/**
 * P5 F-16 — admin KB publish → re-embed → instantly searchable (the money shot).
 *
 * The demo beat (mvp-demo-plan §3.9): an admin saves a published KB doc, it is
 * chunked + embedded + upserted into the active vector store, and the *next*
 * agent chat already cites the new rules — with an audit log line.
 *
 * Because the vector store is cached per-server-process (see getVectorStore),
 * `publishKbDoc` mutates the same store the chat route reads, so the "chat
 * improves" step is real within one process, not faked. Track A honesty:
 * publish is flagged demo_seed; when the OpenRouter/Vertex provider is live the
 * embeddings are real, otherwise the local-hash fallback is tagged.
 *
 * Track B: the same `ingest` call targets the PocketBase backend (kb_docs +
 * kb_chunks) + a Trigger.dev re-index job; the audit log becomes a table.
 */

import { getVectorStore } from '@/ai/rag/vector-store';
import type { IngestResult } from '@/ai/rag/vector-store';

export interface PublishInput {
  title: string;
  slug: string;
  /** Markdown body (admin editor content). Chunked + embedded on publish. */
  markdown: string;
  category?: string;
  /** Who published it (admin/author identity) for the audit line. */
  actor?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  action: 'published' | 'republished' | 'searched';
  title: string;
  slug: string;
  actor: string;
  chunks: number;
  embeddingProvider: string;
  persisted: boolean;
  demo_seed: boolean;
}

const auditLog: AuditEntry[] = [];
let auditCounter = 0;

/**
 * Publish (or republish) a KB doc: chunk + embed + upsert into the active store,
 * then return the ingest result + a verification that the doc is now retrievable
 * by a topical query (the "improves chat" proof).
 */
export async function publishKbDoc(input: PublishInput): Promise<{
  result: IngestResult;
  searchable: boolean;
  topHit: string | null;
  audit: AuditEntry;
  demo_seed: boolean;
}> {
  const { title, slug, markdown } = input;
  const store = await getVectorStore();

  // Was this slug already in the corpus? (republish vs new)
  const docs = await store.listDocuments();
  const isRepublish = docs.some((d) => d.slug === slug);

  const result = await store.ingest(title, slug, markdown);

  // Verification: run a topical query and confirm the new doc's own source
  // ranks in (strict — not a weak OR, so "verified hit" is honest).
  const probe = slug.replace(/-/g, ' ');
  const { results } = await store.search(`${title} ${probe}`, 5);
  const topHit = results[0]?.source ?? null;
  const searchable = results.some((r) => r.source === title);

  const audit: AuditEntry = {
    id: `kb-audit-${++auditCounter}`,
    at: new Date().toISOString(),
    action: isRepublish ? 'republished' : 'published',
    title,
    slug,
    actor: input.actor ?? 'admin',
    chunks: result.chunksCreated,
    embeddingProvider: result.embeddingProvider,
    persisted: result.persisted,
    demo_seed: result.demo_seed,
  };
  auditLog.push(audit);

  return { result, searchable, topHit, audit, demo_seed: result.demo_seed };
}

/** List the active store's documents (admin board) with chunk counts. */
export async function listPublishedDocs(): Promise<
  Array<{ id: string; title: string; slug: string; status: string; source: string; chunks: number; demo_seed: boolean }>
> {
  const store = await getVectorStore();
  const docs = await store.listDocuments();
  const chunks = await store.listChunks();
  // Count chunks per doc so the admin sees "N chunks indexed".
  const perDoc = new Map<string, number>();
  for (const c of chunks) perDoc.set(c.documentId, (perDoc.get(c.documentId) ?? 0) + 1);
  return docs.map((d) => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    status: d.status ?? 'published',
    source: d.title,
    chunks: perDoc.get(d.id) ?? 0,
    demo_seed: store.backend === 'seeded',
  }));
}

export function getKbAuditLog(limit = 20): AuditEntry[] {
  return auditLog.slice(-limit).reverse();
}

export function resetKbAuditLog(): void {
  auditLog.length = 0;
  auditCounter = 0;
}
