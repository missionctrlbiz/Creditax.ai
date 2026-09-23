/**
 * P2 — cosine similarity over plain float arrays.
 *
 * No pgvector here (PocketBase stores embeddings as JSON). For the demo-scale
 * chunk set, brute-force cosine in the API layer is fine (pocketbase-demo
 * spec §6.5). Returns -1..1; higher = more similar.
 */

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export interface Scored<T> {
  item: T;
  score: number;
}

/** Rank an array of items against a query vector, descending by score. */
export function rankBySimilarity<T extends { embedding: number[] }>(
  query: number[],
  items: T[]
): Scored<T>[] {
  return items
    .map((item) => ({ item, score: cosineSimilarity(query, item.embedding) }))
    .sort((a, b) => b.score - a.score);
}
