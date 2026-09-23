/**
 * P2 — RAG pipeline (ingest → embed → rank → grounded answer).
 *
 * Composes provider-aware retrieval on top of the P0 vector store. Works fully
 * offline: with no network/key, embeddings fall back to the local hash and the
 * LLM falls back to the local synthesizer, so the demo still returns a cited,
 * ranked answer. Every result carries `providers` + `demo_seed` so the UI can
 * show *how* it was produced (Track A honesty rule).
 */

import { getVectorStore } from './vector-store';
import { ingestKnowledgeBase } from './ingest';
import { callLLM, type LLMResult } from './llm';
import type { EmbeddingProvider } from './embeddings';

export interface RagChunk {
  text: string;
  source: string;
  section: string;
  score?: number;
}

export interface RagResult {
  answer: string;
  citations: string[];
  confidence: number;
  providers: { embedding: EmbeddingProvider; llm: LLMResult['provider'] };
  demo_seed: boolean;
  topChunks: RagChunk[];
  conversationId?: string;
}

export interface RagTurn {
  role: 'user' | 'assistant';
  text: string;
}

let ingested = false;
let ingestPromise: Promise<void> | null = null;

/** Ingest the KB markdown exactly once per process (idempotent in the store). */
export function ensureIngested(): Promise<void> {
  if (ingested) return Promise.resolve();
  if (!ingestPromise) {
    ingestPromise = ingestKnowledgeBase()
      .then(() => {
        ingested = true;
      })
      .catch((err) => {
        // A missing scripts/kb dir or read error should not dead-end the demo;
        // the store still holds its seeded pre-cut chunks.
        console.warn('[rag] KB ingestion skipped — using seeded chunks', err);
        ingested = true;
      });
  }
  return ingestPromise;
}

export function resetIngest(): void {
  ingested = false;
  ingestPromise = null;
}

/** Flatten + rank KB chunks for a question, via the active vector store. */
export async function retrieve(question: string, topK = 5): Promise<{
  chunks: RagChunk[];
  embedding: EmbeddingProvider;
  demo_seed: boolean;
}> {
  await ensureIngested();
  const store = await getVectorStore();
  const { results, provider, demo_seed } = await store.search(question, topK);
  return {
    chunks: results.map((c) => ({ text: c.text, source: c.source, section: c.section, score: c.score })),
    embedding: provider,
    demo_seed,
  };
}

/**
 * Run the full grounded-answer pipeline.
 * @param question user question (any locale; agent prompt carries the locale)
 * @param locale   user language (en/yo/ha/ig) — forwarded to the LLM prompt
 * @param history  P1 multi-turn: recent conversation turns (oldest first).
 *                 Prepended to the LLM context so follow-up questions keep thread.
 * @param conversationId P1: optional id of the conversation this turn belongs to.
 */
export async function runRag(
  question: string,
  locale = 'en',
  topK = 5,
  history: RagTurn[] = [],
  conversationId?: string
): Promise<RagResult> {
  const { chunks, embedding, demo_seed } = await retrieve(question, topK);

  const context = chunks.map((c) => `[Source: ${c.source} — ${c.section}]\n${c.text}`);
  // Multi-turn: fold recent history into the LLM user message so the model
  // can reference prior answers without re-querying the store.
  const historyBlock = history.length > 0
    ? `Recent conversation:\n${history.map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')}\n\n`
    : '';

  const llm = await callLLM({
    context: [historyBlock + context.join('\n\n---\n\n')].filter(Boolean),
    question,
    locale,
  });

  return {
    answer: llm.answer,
    citations: chunks.map((c) => `${c.source} — ${c.section}`),
    confidence: llm.confidence,
    providers: { embedding, llm: llm.provider },
    demo_seed: demo_seed || llm.provider === 'local-synthesizer',
    topChunks: chunks,
    conversationId,
  };
}
