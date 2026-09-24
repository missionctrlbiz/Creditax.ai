/**
 * P0 — vector store: pgvector-shaped interface with two backends.
 *
 * Track A (this demo): stores chunk embeddings as JSON and ranks with
 * brute-force cosine — no vector DB extension needed. The interface is
 * deliberately shaped like Supabase pgvector (`search(query, topK)` with
 * cosine scores) so the Track B migration is a backend swap, not a rewrite
 * (pocketbase-demo spec §16.2–16.3).
 *
 *   - PocketBaseVectorStore: reads/writes `kb_docs` / `kb_chunks` when PB is
 *     reachable and the P1 flag is on.
 *   - SeededVectorStore:     inlined demo seed (src/lib/seed/demoSeed.ts),
 *     in-memory, every result labelled demo_seed.
 *
 * Every stored chunk records the embedding provider that produced its vector,
 * so `demo_seed` is computed truthfully (true when the local-hash fallback is
 * anywhere in the ranking) rather than guessed from the vector dimension.
 */

import { getPb } from '@/lib/pocketbase';
import { probePocketBase, pocketbaseEnabled } from '@/lib/pb-features';
import { seedKbDocs } from '@/lib/seed/demoSeed';
import { chunkMarkdown } from './chunker';
import { embedTexts, embedQuery, providerFromVector, filterSameDimension, type EmbeddingProvider } from './embeddings';
import { rankBySimilarity } from './similarity';

// ---------------------------------------------------------------------------
// Shapes (pgvector-shaped)
// ---------------------------------------------------------------------------

export interface StoredChunk {
  id: string;
  documentId: string;
  source: string;
  section: string;
  text: string;
  /** number[] | null — null until embedded (Track A stores JSON vectors). */
  embedding: number[] | null;
  /** Which provider produced `embedding` (null while unembedded). */
  embeddingProvider: EmbeddingProvider | null;
  score?: number;
}

export interface StoredDocument {
  id: string;
  title: string;
  slug: string;
  status: string;
}

export interface IngestResult {
  documentId: string;
  title: string;
  chunksCreated: number;
  embeddingProvider: EmbeddingProvider;
  persisted: boolean;
  demo_seed: boolean;
}

export interface VectorSearchResult {
  results: StoredChunk[];
  provider: EmbeddingProvider;
  /** True when the local-hash fallback provider contributed any ranked vector. */
  demo_seed: boolean;
}

export interface VectorStore {
  readonly backend: 'pocketbase' | 'seeded';
  listDocuments(): Promise<StoredDocument[]>;
  listChunks(): Promise<StoredChunk[]>;
  /** Chunk + embed a markdown document; upsert its chunks. */
  ingest(title: string, slug: string, markdown: string): Promise<IngestResult>;
  /** Cosine top-k over all chunks (query embedded with the same provider). */
  search(query: string, topK: number): Promise<VectorSearchResult>;
}

/**
 * Ensure every chunk has a vector, embedding only the missing ones through the
 * provider-aware embeddings module (OpenRouter → local-hash fallback) and
 * recording which provider produced each vector.
 */
async function withEmbeddings(chunks: StoredChunk[]): Promise<{
  embedded: (StoredChunk & { embedding: number[] })[];
  provider: EmbeddingProvider;
  demo_seed: boolean;
}> {
  const missing = chunks.filter((c) => !c.embedding || c.embedding.length === 0);
  let provider: EmbeddingProvider | null = null;
  let demoSeed = false;

  if (missing.length > 0) {
    const r = await embedTexts(missing.map((c) => c.text));
    provider = r.provider;
    demoSeed = r.provider === 'local-hash';
    missing.forEach((c, i) => {
      c.embedding = r.vectors[i] ?? [];
      c.embeddingProvider = r.provider;
    });
  }

  // Truthful demo_seed: any local-hash vector in the working set means at
  // least part of the ranking used the offline fallback.
  const inPlay = chunks.map((c) => c.embeddingProvider ?? providerFromVector(c.embedding));
  demoSeed = inPlay.some((p) => p === 'local-hash') || demoSeed;

  return {
    embedded: chunks.map((c) => ({ ...c, embedding: c.embedding ?? [] })),
    provider: provider ?? (inPlay[0] ?? 'local-hash'),
    demo_seed: demoSeed,
  };
}

// ---------------------------------------------------------------------------
// Seeded backend (offline default)
// ---------------------------------------------------------------------------

class SeededVectorStore implements VectorStore {
  readonly backend = 'seeded' as const;
  private chunks: StoredChunk[] = [];
  private docs: StoredDocument[] = [];
  private initialized = false;

  private init() {
    if (this.initialized) return;
    this.docs = seedKbDocs.map((d) => ({ id: d.id, title: d.title, slug: d.slug, status: d.status }));
    this.chunks = seedKbDocs.flatMap((d) =>
      d.chunks.map((c, i) => ({
        id: `seed-${d.id}-${i}`,
        documentId: d.id,
        source: d.title,
        section: c.section,
        text: c.text,
        embedding: c.embedding ?? null,
        embeddingProvider: c.embedding ? providerFromVector(c.embedding) : null,
      }))
    );
    this.initialized = true;
  }

  async listDocuments() {
    this.init();
    return this.docs;
  }

  async listChunks() {
    this.init();
    return this.chunks;
  }

  async ingest(title: string, slug: string, markdown: string): Promise<IngestResult> {
    this.init();
    const chunks = chunkMarkdown(markdown);
    const { vectors, provider } = await embedTexts(chunks.map((c) => c.text));
    // Upsert by slug: reuse the seeded doc id so we replace its pre-cut
    // chunks rather than duplicating the corpus.
    const existing = this.docs.find((d) => d.slug === slug);
    const docId = existing ? existing.id : `doc-${slug}`;
    if (existing) existing.title = title;
    else this.docs.push({ id: docId, title, slug, status: 'published' });
    this.chunks = this.chunks.filter((c) => c.documentId !== docId);
    chunks.forEach((c, i) =>
      this.chunks.push({
        id: `${docId}-${i}`,
        documentId: docId,
        source: title,
        section: c.section,
        text: c.text,
        embedding: vectors[i] ?? null,
        embeddingProvider: provider,
      })
    );
    return {
      documentId: docId,
      title,
      chunksCreated: chunks.length,
      embeddingProvider: provider,
      persisted: false,
      demo_seed: provider === 'local-hash',
    };
  }

  async search(query: string, topK: number): Promise<VectorSearchResult> {
    this.init();
    const { embedded, provider, demo_seed } = await withEmbeddings(this.chunks);
    // P13 — rank on the dominant corpus width so the query and every compared
    // chunk agree on vector dimension. Cross-provider (mismatched-width)
    // vectors are dropped rather than silently 0-scored into the top-k.
    const targetDim = dominantDimension(embedded.map((c) => c.embedding));
    const comparable = filterSameDimension(
      embedded.map((c) => c.embedding),
      targetDim
    );
    const rankedChunks = embedded.filter((c) => c.embedding.length === targetDim);
    const queryVec = (await embedQuery(query, targetDim)).vectors[0];
    const ranked = rankBySimilarity(queryVec, rankedChunks);
    return {
      results: ranked.slice(0, topK).map((r) => ({ ...r.item, score: r.score })),
      provider,
      // Any drop (comparable < corpus) or a local-hash query vector means the
      // ranking fell back partly to the offline path → keep demo_seed honest.
      demo_seed: demo_seed || comparable.dropped || queryVec.length === 0,
    };
  }
}

/** Most common non-empty vector width in the set (the corpus's working dim). */
function dominantDimension(vectors: number[][]): number {
  const counts = new Map<number, number>();
  for (const v of vectors) if (v.length) counts.set(v.length, (counts.get(v.length) ?? 0) + 1);
  let best = 0;
  let bestCount = -1;
  for (const [dim, count] of counts) if (count > bestCount) { best = dim; bestCount = count; }
  return best;
}

// ---------------------------------------------------------------------------
// PocketBase backend
// ---------------------------------------------------------------------------

function mapPbChunk(r: Record<string, unknown>): StoredChunk {
  const metadata = r.metadata ? (JSON.parse(String(r.metadata)) as { source?: string; section?: string; provider?: EmbeddingProvider }) : {};
  const embedding = r.embedding ? (JSON.parse(String(r.embedding)) as number[]) : null;
  return {
    id: r.id as string,
    documentId: r.document_id as string,
    source: metadata.source ?? 'Unknown',
    section: metadata.section ?? '',
    text: r.chunk_text as string,
    embedding,
    embeddingProvider: metadata.provider ?? providerFromVector(embedding),
  };
}

class PocketBaseVectorStore implements VectorStore {
  readonly backend = 'pocketbase' as const;

  async listDocuments(): Promise<StoredDocument[]> {
    const res = await getPb().collection('kb_docs').getList(1, 100);
    return res.items.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      title: r.title as string,
      slug: r.slug as string,
      status: r.status as string,
    }));
  }

  async listChunks(): Promise<StoredChunk[]> {
    const res = await getPb().collection('kb_chunks').getFullList();
    return res.map((r: Record<string, unknown>) => mapPbChunk(r));
  }

  async ingest(title: string, slug: string, markdown: string): Promise<IngestResult> {
    const chunks = chunkMarkdown(markdown);
    const { vectors, provider } = await embedTexts(chunks.map((c) => c.text));
    const pb = getPb();

    let docId: string;
    const existing = await pb.collection('kb_docs').getFullList({ filter: `slug = "${slug}"` });
    if (existing.length > 0) {
      docId = existing[0].id;
      await pb.collection('kb_docs').update(docId, { title, status: 'published', content: markdown });
    } else {
      const created = await pb.collection('kb_docs').create({ title, slug, status: 'published', content: markdown, demo_seed: 1 });
      docId = created.id;
    }

    const old = await pb.collection('kb_chunks').getFullList({ filter: `document_id = "${docId}"` });
    for (const r of old) await pb.collection('kb_chunks').delete(r.id);
    for (let i = 0; i < chunks.length; i++) {
      await pb.collection('kb_chunks').create({
        document_id: docId,
        chunk_text: chunks[i].text,
        chunk_index: i,
        embedding: JSON.stringify(vectors[i] ?? []),
        token_count: chunks[i].tokenCount,
        metadata: JSON.stringify({ source: title, section: chunks[i].section, provider }),
        demo_seed: 1,
      });
    }

    return {
      documentId: docId,
      title,
      chunksCreated: chunks.length,
      embeddingProvider: provider,
      persisted: true,
      demo_seed: provider === 'local-hash',
    };
  }

  async search(query: string, topK: number): Promise<VectorSearchResult> {
    const chunks = await this.listChunks();
    const { embedded, provider, demo_seed } = await withEmbeddings(chunks);
    // P13 — same dimension-consistency rule as the seeded backend: rank on
    // the dominant corpus width; drop cross-provider vectors, never 0-score them.
    const targetDim = dominantDimension(embedded.map((c) => c.embedding));
    const comparable = filterSameDimension(
      embedded.map((c) => c.embedding),
      targetDim
    );
    const rankedChunks = embedded.filter((c) => c.embedding.length === targetDim);
    const queryVec = (await embedQuery(query, targetDim)).vectors[0];
    const ranked = rankBySimilarity(queryVec, rankedChunks);
    return {
      results: ranked.slice(0, topK).map((r) => ({ ...r.item, score: r.score })),
      provider,
      demo_seed: demo_seed || comparable.dropped || queryVec.length === 0,
    };
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

let cached: VectorStore | null = null;

export async function getVectorStore(): Promise<VectorStore> {
  if (cached) return cached;
  const usePb = pocketbaseEnabled() && (await probePocketBase());
  cached = usePb ? new PocketBaseVectorStore() : new SeededVectorStore();
  return cached;
}

/** Test hook. */
export function resetVectorStore(): void {
  cached = null;
}
