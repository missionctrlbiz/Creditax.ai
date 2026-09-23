/**
 * doc-processing — deterministic receipt/invoice extractor (Track A).
 *
 * Extracts the fields a demo needs (amount, category, date, group, confidence)
 * from a filename + optional raw text body. No OCR / LLM here: this is a
 * heuristic labelled `demo_seed: true` everywhere. Real OCR is a Track B
 * integration (Google Document AI / Kimchi.dev vision) behind the same
 * interface, so the UI wiring does not change when that lands.
 *
 * The heuristic is tuned to recognise the demo's own fixture filenames so the
 * click-through shows plausible figures ("VAT_Invoice_Zenith_Jun2025.pdf →
 * ₦620,500 invoice"). For unknown names it degrades to "needs review".
 */

export interface ExtractedDoc {
  id: string;
  name: string;
  format: string;
  status: 'extracted' | 'needs-review';
  amount?: number;
  category?: string;
  period?: string;
  group: 'receipt' | 'invoice' | 'tax-form';
  confidence: number; // 0..1
  demo_seed: true;
  /** Optional human-readable warning for the UI (low-confidence cases). */
  warning?: string;
}

// Fixture map — recognises the demo's own files by filename.
type FixtureDoc = Omit<ExtractedDoc, 'id' | 'name' | 'demo_seed'>;
const FIXTURES: { match: string; doc: FixtureDoc }[] = [
  {
    match: 'vat_invoice',
    doc: { format: 'PDF', status: 'extracted', amount: 620500, category: 'VAT', period: 'Jun 2025', group: 'invoice', confidence: 0.94 },
  },
  {
    match: 'bank_statement',
    doc: { format: 'PDF', status: 'extracted', amount: 2400000, category: 'Income', period: 'May 2025', group: 'tax-form', confidence: 0.9 },
  },
  {
    match: 'generator_fuel',
    doc: { format: 'JPG', status: 'extracted', amount: 180000, category: 'Operations', period: 'Aug 2024', group: 'receipt', confidence: 0.86 },
  },
  {
    match: 'unclear',
    doc: {
      format: 'IMG',
      status: 'needs-review',
      amount: 95000,
      category: 'Uncategorised',
      period: 'unknown',
      group: 'receipt',
      confidence: 0.31,
      warning: 'Low confidence extraction — please verify the detected amount.',
    },
  },
  {
    match: 'paye',
    doc: { format: 'PDF', status: 'extracted', amount: 4800000, category: 'Payroll', period: 'FY 2024', group: 'tax-form', confidence: 0.92 },
  },
  {
    match: 'rent|office',
    doc: { format: 'PDF', status: 'extracted', amount: 600000, category: 'Overhead', period: 'Q3 2024', group: 'receipt', confidence: 0.88 },
  },
];

/**
 * Extract a single document. `rawBody` is optional: if supplied, numeric
 * patterns are scanned as a second-pass signal (useful when OCR becomes real
 * later). For the Track A demo the filename path is what drives the demo
 * narrative.
 */
export function extractDocument(input: {
  id: string;
  name: string;
  rawBody?: string;
}): ExtractedDoc {
  const lower = input.name.toLowerCase();

  // 1. Fixture match by filename (highest-confidence path for the demo).
  for (const f of FIXTURES) {
    if (new RegExp(f.match, 'i').test(lower)) {
      return { ...f.doc, id: input.id, name: input.name, demo_seed: true } as ExtractedDoc;
    }
  }

  // 2. Heuristic: look for a ₦ / $ number in the raw body (if any) or fall
  // back to "needs review".
  let amount: number | undefined;
  if (input.rawBody) {
    const m = input.rawBody.match(/₦?\s?\d[\d,]{2,}/g);
    if (m && m.length > 0) {
      // Take the largest figure — typical for a total on a receipt/invoice.
      amount = Math.max(...m.map((s) => Number(s.replace(/[^\d]/g, ''))));
    }
  }
  const group = /invoice|vat/i.test(input.name) ? 'invoice' : /statement|paye|tax/i.test(input.name) ? 'tax-form' : 'receipt';

  return {
    id: input.id,
    name: input.name,
    format: (input.name.split('.').pop() ?? 'FILE').toUpperCase().slice(0, 4),
    status: amount ? 'extracted' : 'needs-review',
    amount,
    category: amount ? 'Uncategorised' : undefined,
    period: 'unknown',
    group,
    confidence: amount ? 0.42 : 0.18,
    demo_seed: true,
    warning: amount ? undefined : 'Could not detect a clear amount — please verify manually.',
  };
}
