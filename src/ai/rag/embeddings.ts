/**
 * P13 — embeddings provider cascade (canon-reconciled).
 *
 * Order (per `.env.example` "OpenRouter → Hugging Face → Vertex → local-hash"):
 *   1. openrouter    — 768-dim, free nemotron-3-embed-1b (OPENROUTER_API_KEY)
 *   2. huggingface   — 384-dim all-MiniLM-L6-v2 (HF_API_KEY + HF_EMBED_MODEL)
 *   3. vertex        — 768-dim text-embedding-005 (VERTEX_AI_PROJECT_ID +
 *                      VERTEX_AI_REGION + GOOGLE_APPLICATION_CREDENTIALS_PATH)
 *   4. local-hash    — 128-dim deterministic offline fallback (no key needed)
 *
 * Every result is tagged with the live `provider` that produced it so the
 * caller keeps the `demo_seed` honesty flag truthful (only local-hash sets
 * it). A *process provider lock* records the last live provider that succeeded
 * and biases subsequent calls toward it, so a chunk batch and its query stay
 * on the same width. A `filterSameDimension` helper drops mismatched-width
 * vectors so cross-provider rankings stay honest (cosine of unequal-length
 * vectors is 0 and would silently poison the top-k).
 *
 * The Vertex leg is best-effort: when the GCP project / service-account JSON
 * are not configured (the current .env leaves them empty) the leg is skipped
 * and treated as unused-track-B — it never throws, it just does not run.
 */

import { createPrivateKey, sign } from 'node:crypto';

export type EmbeddingProvider =
  | 'openrouter'
  | 'huggingface'
  | 'vertex'
  | 'local-hash';

export interface EmbedResult {
  vectors: number[][];
  provider: EmbeddingProvider;
  dimension: number;
}

/** Known width per provider (used for the dimension-consistency check). */
export const PROVIDER_DIMS: Record<EmbeddingProvider, number> = {
  openrouter: 768,
  huggingface: 384,
  vertex: 768,
  'local-hash': 128,
};

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/embeddings';
const OPENROUTER_MODEL = process.env.OPENROUTER_EMBED_MODEL || 'nvidia/nemotron-3-embed-1b:free';

// NOTE: the host path must match the model you set (HF Inference API legacy
// URL form). Swapping HF_EMBED_MODEL to a different repo requires updating the
// host path too; otherwise this leg returns null and the cascade continues.
const HF_ENDPOINT = 'https://api-inference.huggingface.co/models/all-MiniLM-L6-v2';
const HF_MODEL = process.env.HF_EMBED_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';

const LOCAL_DIM = 128;
export { LOCAL_DIM };

/** Heuristic provider inference from a stored vector (fallback only — prefer
 * the provider recorded at ingest time). Widths: local-hash 128, huggingface
 * 384, openrouter/vertex 768 (openrouter reported for the default live leg). */
export function providerFromVector(v: number[] | null | undefined): EmbeddingProvider {
  if (!v || v.length === 0) return 'local-hash';
  if (v.length === LOCAL_DIM) return 'local-hash';
  if (v.length === PROVIDER_DIMS.huggingface) return 'huggingface';
  return 'openrouter';
}

// ---------------------------------------------------------------------------
// Process provider lock: remember the last live provider that succeeded so
// subsequent calls bias toward it and keep the corpus on one width.
// ---------------------------------------------------------------------------
let lastLiveProvider: EmbeddingProvider | null = null;

/** Test / reset hook — clear the sticky provider preference. */
export function resetEmbeddingProviderLock(): void {
  lastLiveProvider = null;
}

/** The sticky live provider, if any (null = follow the canonical order). */
export function activeEmbeddingProvider(): EmbeddingProvider | null {
  return lastLiveProvider;
}

interface EmbedLeg {
  provider: EmbeddingProvider;
  /** Whether this leg can run with the current env (key / creds present). */
  enabled(): boolean;
  /** Embed a batch; returns vectors or null when the provider declines. */
  embed(texts: string[]): Promise<number[][] | null>;
}

const openrouterLeg: EmbedLeg = {
  provider: 'openrouter',
  enabled: () => !!process.env.OPENROUTER_API_KEY,
  async embed(texts) {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) return null;
    try {
      const res = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: OPENROUTER_MODEL, input: texts, encoding_format: 'float' }),
      });
      if (!res.ok) {
        console.warn(`[embeddings] OpenRouter ${res.status}, trying next leg`);
        return null;
      }
      const data = await res.json();
      const vectors: number[][] = (data.data ?? []).map((item: { embedding: number[] }) => item.embedding);
      return vectors.length === texts.length && vectors[0]?.length ? vectors : null;
    } catch (err) {
      console.warn('[embeddings] OpenRouter unreachable, trying next leg', err);
      return null;
    }
  },
};

const huggingfaceLeg: EmbedLeg = {
  provider: 'huggingface',
  enabled: () => !!process.env.HF_API_KEY,
  async embed(texts) {
    const key = process.env.HF_API_KEY;
    if (!key) return null;
    try {
      const res = await fetch(
        `${HF_ENDPOINT}/?model=${encodeURIComponent(HF_MODEL)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            'X-Use-Cached-Embeddings': 'true',
          },
          body: JSON.stringify({ inputs: texts, model: HF_MODEL }),
        }
      );
      if (!res.ok) {
        console.warn(`[embeddings] HuggingFace ${res.status}, trying next leg`);
        return null;
      }
      const data = await res.json();
      const vectors: number[][] | undefined = data?.embeddings;
      return Array.isArray(vectors) && vectors.length === texts.length && vectors[0]?.length
        ? vectors
        : null;
    } catch (err) {
      console.warn('[embeddings] HuggingFace unreachable, trying next leg', err);
      return null;
    }
  },
};

/**
 * Vertex leg — REST `:predict` on text-embedding-005. Reads the service
 * account JSON from GOOGLE_APPLICATION_CREDENTIALS_PATH, signs a short-lived
 * JWT (HS/RSA) and exchanges it for an OAuth Bearer token. When the GCP
 * project / region / credentials are not all set (the live .env leaves them
 * empty) `enabled()` is false and the leg is skipped — unused-track-B.
 */
const vertexLeg: EmbedLeg = {
  provider: 'vertex',
  enabled: () =>
    !!process.env.VERTEX_AI_PROJECT_ID &&
    !!process.env.VERTEX_AI_REGION &&
    !!process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH,
  async embed(texts) {
    const project = process.env.VERTEX_AI_PROJECT_ID;
    const region = process.env.VERTEX_AI_REGION || 'us-central1';
    const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
    if (!project || !saPath) return null;
    try {
      const { readFileSync } = await import('node:fs');
      const sa = JSON.parse(readFileSync(saPath, 'utf8')) as Record<string, unknown>;
      const token = await vertexAccessToken(sa);
      if (!token) return null;
      const res = await fetch(
        `https://${region}-aiplatform.googleapis.com/v1/projects/${project}/locations/${region}/publishers/google/models/text-embedding-005:predict`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ instances: texts.map((t) => ({ content: t })) }),
        }
      );
      if (!res.ok) {
        console.warn(`[embeddings] Vertex ${res.status}, trying next leg`);
        return null;
      }
      const data = await res.json();
      const vectors: number[][] = (data?.predictions ?? []).map(
        (p: { values?: number[]; embedding?: number[] }) => p.values ?? p.embedding ?? []
      );
      return vectors.length === texts.length && vectors[0]?.length ? vectors : null;
    } catch (err) {
      console.warn('[embeddings] Vertex unavailable, trying next leg', err);
      return null;
    }
  },
};

const LEGS: EmbedLeg[] = [openrouterLeg, huggingfaceLeg, vertexLeg];

/**
 * Embed a batch by walking the live legs in canonical order. When
 * `preferProvider` is set (the sticky lock) that leg is tried first. Records
 * the provider that succeeded on the lock, and falls back to local-hash so
 * the caller always gets a working embedding.
 */
export async function embedTexts(texts: string[], preferProvider?: EmbeddingProvider): Promise<EmbedResult> {
  const order: EmbedLeg[] = preferProvider && preferProvider !== 'local-hash'
    ? [...LEGS.filter((l) => l.provider === preferProvider), ...LEGS.filter((l) => l.provider !== preferProvider)]
    : LEGS;

  for (const leg of order) {
    if (!leg.enabled()) continue;
    const vectors = await leg.embed(texts);
    if (vectors && vectors.length === texts.length) {
      lastLiveProvider = leg.provider;
      return { vectors, provider: leg.provider, dimension: vectors[0].length };
    }
  }

  // Local-hash fallback (never fails; deterministic + offline).
  lastLiveProvider = 'local-hash';
  return { vectors: texts.map((t) => localHashEmbed(t)), provider: 'local-hash', dimension: LOCAL_DIM };
}

/**
 * Embed a single query. Passes the sticky provider so the query stays on the
 * same width as the corpus; when `targetDimension` is given and the sticky
 * provider does not match it, the query is forced through a provider that does
 * (or local-hash) so the ranking never mixes widths.
 */
export async function embedQuery(query: string, targetDimension?: number): Promise<EmbedResult> {
  let prefer = lastLiveProvider ?? undefined;
  if (targetDimension != null) {
    const stickyDim = prefer ? PROVIDER_DIMS[prefer] : null;
    if (stickyDim !== targetDimension) {
      const match = (['openrouter', 'vertex', 'huggingface', 'local-hash'] as EmbeddingProvider[]).find(
        (p) => PROVIDER_DIMS[p] === targetDimension
      );
      prefer = match;
    }
  }
  return embedTexts([query], prefer);
}

/**
 * Drop vectors whose width differs from `dimension` (cross-provider safety).
 * The vector store uses this before ranking so a query and its corpus always
 * compare honestly. Returns the filtered + a boolean that anything was dropped.
 */
export function filterSameDimension(
  vectors: number[][],
  dimension: number
): { kept: number[][]; dropped: boolean } {
  const kept = vectors.filter((v) => v.length === dimension);
  return { kept, dropped: kept.length < vectors.length };
}

// ---------------------------------------------------------------------------
// Vertex OAuth token (service-account → short-lived Bearer).
// ---------------------------------------------------------------------------

async function vertexAccessToken(
  sa: Record<string, unknown>
): Promise<string | null> {
  const saKey = sa.private_key;
  const clientEmail = sa.client_email;
  if (typeof saKey !== 'string' || typeof clientEmail !== 'string') return null;
  try {
    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const jwtClaims = Buffer.from(
      JSON.stringify({
        iss: clientEmail,
        aud: 'https://oauth2.googleapis.com/token',
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        iat: now,
        exp: now + 3600,
        email: clientEmail,
      })
    ).toString('base64url');
    const key = createPrivateKey(saKey);
    const sig = sign('RSA-SHA256', Buffer.from(`${jwtHeader}.${jwtClaims}`), key);
    const assertion = `${jwtHeader}.${jwtClaims}.${sig.toString('base64url')}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(assertion)}`,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.access_token === 'string' ? data.access_token : null;
  } catch (err) {
    console.warn('[embeddings] Vertex token exchange failed', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Deterministic local-hash embedding (offline fallback).
// ---------------------------------------------------------------------------

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
