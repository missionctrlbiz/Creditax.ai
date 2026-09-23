/**
 * P0 — knowledge-base ingestion.
 *
 * Reads the markdown docs under scripts/kb/*.md, chunks each one
 * (chunker.ts) and embeds the chunks (embeddings.ts — OpenRouter primary,
 * local-hash fallback), then upserts them into the active vector store. This is
 * the Track A ingest pipeline; when PocketBase is up it persists to
 * `kb_docs`/`kb_chunks`, otherwise it hydrates the in-memory seeded store so
 * the RAG demo still ranks the right chunks offline.
 *
 * Idempotent: re-running replaces a slug's chunks rather than duplicating.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { getVectorStore, type VectorStore, type IngestResult } from './vector-store';

export interface KbDoc {
  title: string;
  slug: string;
  markdown: string;
}

export interface IngestReport {
  ingested: IngestResult[];
  backend: VectorStore['backend'];
  filesFound: number;
  /** True when at least one document's vectors came from the local-hash fallback. */
  demo_seed: boolean;
}

/**
 * Read the KB markdown files from disk. Resolves relative to the process cwd
 * (project root in dev + the VPS demo layout). Returns an empty list if the
 * directory is absent (e.g. a trimmed serverless bundle) — callers then rely
 * on the seeded pre-cut chunks.
 */
export async function loadKbMarkdownDocs(kbDir = 'scripts/kb'): Promise<KbDoc[]> {
  const absDir = path.join(process.cwd(), kbDir);
  let entries: string[];
  try {
    entries = await fs.readdir(absDir);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith('.md'));
  const docs: KbDoc[] = [];
  for (const file of files) {
    const markdown = await fs.readFile(path.join(absDir, file), 'utf8');
    docs.push(parseFrontmatter(markdown, file));
  }
  return docs;
}

/** Pull `title` / `slug` from YAML frontmatter; fall back to the H1 + filename. */
function parseFrontmatter(markdown: string, filename: string): KbDoc {
  const fm = markdown.match(/^---\n([\s\S]*?)\n---/);
  const title = fm ? extractField(fm[1], 'title') : null;
  const slug = fm ? extractField(fm[1], 'slug') : null;
  const h1 = markdown.match(/^#\s+(.+)$/m);
  return {
    title: title || h1?.[1]?.trim() || filename.replace(/\.md$/, ''),
    slug: slug || filename.replace(/\.md$/, '').toLowerCase(),
    markdown,
  };
}

function extractField(frontmatter: string, key: string): string | null {
  const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].replace(/^["']|["']$/g, '').trim() : null;
}

/**
 * Ingest every KB doc into the given store (defaults to the active store).
 * Returns a report; `demo_seed` is true when the offline fallback provider was
 * used for any document.
 */
export async function ingestKnowledgeBase(store?: VectorStore): Promise<IngestReport> {
  const active = store ?? (await getVectorStore());
  const docs = await loadKbMarkdownDocs();
  if (docs.length === 0) {
    return { ingested: [], backend: active.backend, filesFound: 0, demo_seed: true };
  }

  const ingested: IngestResult[] = [];
  for (const doc of docs) {
    ingested.push(await active.ingest(doc.title, doc.slug, doc.markdown));
  }
  return {
    ingested,
    backend: active.backend,
    filesFound: docs.length,
    demo_seed: ingested.some((r) => r.demo_seed),
  };
}
