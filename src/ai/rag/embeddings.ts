/**
 * P2 — embeddings provider.
 *
 * Primary: OpenRouter (free `nvidia/nemotron-3-embed-1b:free`, 768-dim).
 * Fallback: a deterministic local hash-embedding (64-dim) so the RAG demo still
 * ranks chunks *meaningfully* when there is no network / no API key. The
 * fallback is clearly a degradation — it keeps the demo running and honest,
 * and every response is tagged with the provider used.
 */

export type EmbeddingProvider =
  | 'openrouter'
  | 'local-hash'
  | 'vertex'
  | 'huggingface';

export interface EmbedResult {
  vectors: number[][];
  provider: EmbeddingProvider;
  dimension: number;
}

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/embeddings';
const OPENROUTER_MODEL = 'nvidia/nemotron-3-embed-1b:free';

const LOCAL_DIM = 128;
export { LOCAL_DIM };

/** Heuristic provider inference from a stored vector (fallback only — prefer
 * the provider recorded at ingest time). Local-hash is 128-dim; OpenRouter
 * nemotron-3-embed-1b is 768-dim. */
export function providerFromVector(v: number[] | null | undefined): EmbeddingProvider {
  if (!v || v.length === 0) return 'local-hash';
  return v.length === LOCAL_DIM ? 'local-hash' : 'openrouter';
}

function localKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY;
}

/**
 * Stopword list (Nigerian tax-domain noise words). Removed before hashing so
 * short, high-signal terms ("vat", "paye", "wht", "relief") dominate the
 * vector instead of "the / what / do / i".
 */
const STOPWORDS = new Set(
  (
    'a an and are as at be by can do does for from had has have he i if in is it of on or that the to was we were what when where who will with '
  ).split(' ')
);

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Embed a batch of texts. Tries OpenRouter when a key is present and the
 * request succeeds; otherwise returns deterministic local-hash vectors so the
 * caller always gets a working embedding.
 */
export async function embedTexts(texts: string[]): Promise<EmbedResult> {
  const key = localKey();
  if (key) {
    try {
      const res = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          input: texts,
          encoding_format: 'float',
        }),
      });
      if (!res.ok) {
        // Surface the provider error, fall through to local so the demo runs.
        console.warn(`[embeddings] OpenRouter ${res.status}, using local hash fallback`);
      } else {
        const data = await res.json();
        const vectors: number[][] = (data.data ?? []).map((item: { embedding: number[] }) => item.embedding);
        if (vectors.length === texts.length && vectors[0]?.length) {
          return { vectors, provider: 'openrouter', dimension: vectors[0].length };
        }
      }
    } catch (err) {
      console.warn('[embeddings] OpenRouter unreachable, using local hash fallback', err);
    }
  }
  return { vectors: texts.map((t) => localHashEmbed(t)), provider: 'local-hash', dimension: LOCAL_DIM };
}

export async function embedQuery(query: string): Promise<EmbedResult> {
  return embedTexts([query]);
}

/**
 * Deterministic sublinear-TF hash embedding. Not semantically rich, but stable
 * and zero-dep: stopword-filtered word + bigram counts are hashed into buckets
 * (unsigned, so collisions add rather than cancel) and cosine between a query
 * and a chunk rewards genuine keyword overlap. Good enough to make the demo
 * rank the right NTA/VAT/PIT chunks without any external call.
 */
function localHashEmbed(text: string): number[] {
  const vec = new Array(LOCAL_DIM).fill(0);
  const normalized = text
    .toLowerCase()
    .replace(/₦/g, ' naira ')
    .replace(/[^a-z0-9\s%]+/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);
  const tokens = [...words];
  for (let i = 0; i < words.length - 1; i++) tokens.push(`${words[i]} ${words[i + 1]}`);

  // Count term frequency, dropping stopwords.
  const tf = new Map<string, number>();
  for (const tok of tokens) {
    if (STOPWORDS.has(tok)) continue;
    tf.set(tok, (tf.get(tok) ?? 0) + 1);
  }

  for (const [tok, count] of tf.entries()) {
    const bucket = fnv1a(tok) % LOCAL_DIM;
    // Sublinear (1 + ln) dampens long chunks so a precise short query can still match.
    vec[bucket] += 1 + Math.log(count + 1);
  }

  // L2-normalise so cosine ≈ dot product.
  let norm = 0;
  for (let i = 0; i < LOCAL_DIM; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1;
  return vec.map((v) => v / norm);
}
