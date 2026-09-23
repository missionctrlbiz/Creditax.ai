/**
 * doc-processing — document + report store (Track A).
 *
 * In-memory primary so the demo click-through is reliable with no backend;
 * optional PocketBase persistence when the P1 flag + probe succeed (mirrors
 * the rag-pipeline store pattern). Every record is `demo_seed: true`.
 *
 * Track B: replace the in-memory maps with a durable queue (Trigger.dev) +
 * PocketBase/Supabase rows; the API shape stays the same.
 */

import { extractDocument, type ExtractedDoc } from './doc-extract';
import { fmtNaira } from './tax-rules';
import { probePocketBase, pocketbaseEnabled } from '@/lib/pb-features';
import { getPb } from '@/lib/pocketbase';

export interface ProcessedDocument extends ExtractedDoc {
  user_id: string;
  created_at: string;
}

export type ReportType = 'tax_calculation' | 'credit_report' | 'receipt_analysis';

export interface Report {
  id: string;
  user_id: string;
  type: ReportType;
  title: string;
  status: 'processing' | 'completed';
  /** demo download link (Track B: real signed PDF URL). */
  download_url: string;
  summary: string;
  totals: Record<string, string>;
  demo_seed: true;
  created_at: string;
}

const docs = new Map<string, ProcessedDocument>();
const reports = new Map<string, Report>();

let counter = 0;
const nextId = (p: string) => `${p}-${Date.now().toString(36)}-${++counter}`;

async function pbUp(): Promise<boolean> {
  return pocketbaseEnabled() && (await probePocketBase());
}

/**
 * Process an uploaded document: run the deterministic extractor, persist to
 * the in-memory store, and (if PocketBase is reachable) mirror to the
 * `documents` collection.
 */
export async function processDocument(input: {
  name: string;
  rawBody?: string;
  userId?: string;
}): Promise<ProcessedDocument> {
  const doc: ProcessedDocument = {
    ...extractDocument({ id: nextId('doc'), name: input.name, rawBody: input.rawBody }),
    user_id: input.userId ?? 'demo',
    created_at: new Date().toISOString(),
  };
  docs.set(doc.id, doc);

  if (await pbUp()) {
    try {
      await getPb().collection('documents').create({
        name: doc.name,
        user_id: doc.user_id,
        status: doc.status,
        amount: doc.amount ?? 0,
        category: doc.category ?? '',
        period: doc.period ?? '',
        group: doc.group,
        confidence: doc.confidence,
        demo_seed: 1,
      });
    } catch (err) {
      console.warn('[doc-processing] PocketBase mirror failed; in-memory only', err);
    }
  }
  return doc;
}

export function getDocument(id: string): ProcessedDocument | null {
  return docs.get(id) ?? null;
}

export function listDocuments(userId = 'demo'): ProcessedDocument[] {
  return [...docs.values()].filter((d) => d.user_id === userId);
}

/**
 * Request a report over a set of documents. Returns immediately with
 * status 'processing' (the async shape); the result is available via
 * getReport. Track A computes it synchronously and stores 'completed'; a
 * real worker would flip the status after OCR/PDF generation.
 */
export async function createReport(input: {
  userId?: string;
  docIds?: string[];
  type?: ReportType;
}): Promise<Report> {
  const userId = input.userId ?? 'demo';
  const type: ReportType = input.type ?? 'receipt_analysis';
  const id = nextId('rep');
  const sourceDocs = (input.docIds ?? []).map((d) => docs.get(d)).filter(Boolean) as ProcessedDocument[];
  const scope = sourceDocs.length > 0 ? sourceDocs : listDocuments(userId);

  const totalAmount = scope.reduce((sum, d) => sum + (d.amount ?? 0), 0);
  const byCategory = new Map<string, number>();
  for (const d of scope) {
    if (d.category) byCategory.set(d.category, (byCategory.get(d.category) ?? 0) + (d.amount ?? 0));
  }

  const titles: Record<ReportType, string> = {
    tax_calculation: 'Tax Summary',
    credit_report: 'Credit Health Report',
    receipt_analysis: 'Receipt & Invoice Analysis',
  };

  const report: Report = {
    id,
    user_id: userId,
    type,
    title: titles[type],
    status: 'completed',
    download_url: `/reports/${id}.pdf`, // demo link; Track B signs a real PDF
    summary:
      type === 'credit_report'
        ? 'Filing history and document consistency feed the credit factors shown in the dashboard.'
        : `Aggregated ${scope.length} document(s) with extracted totals.`,
    totals: {
      documents: String(scope.length),
      extracted: String(scope.filter((d) => d.status === 'extracted').length),
      needsReview: String(scope.filter((d) => d.status === 'needs-review').length),
      totalExtracted: fmtNaira(totalAmount),
      byCategory: JSON.stringify(Object.fromEntries([...byCategory.entries()].map(([k, v]) => [k, fmtNaira(v)]))),
    },
    demo_seed: true,
    created_at: new Date().toISOString(),
  };
  reports.set(id, report);
  return report;
}

export function getReport(id: string): Report | null {
  return reports.get(id) ?? null;
}

export function listReports(userId = 'demo'): Report[] {
  return [...reports.values()].filter((r) => r.user_id === userId);
}
