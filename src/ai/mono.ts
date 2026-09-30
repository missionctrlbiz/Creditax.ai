/**
 * P15 — Mono credit-data provider (SANDBOX ONLY).
 *
 * Wires the `MONO_API_KEY` / `MONO_BASE_URL` / `MONO_ENVIRONMENT` keys into a
 * thin client for the credit-lookup the credit-scoring model needs.
 *
 * Sandbox safety (Track A honesty — non-negotiable):
 *   - `monoEnabled()` is true only when a key is present AND
 *     `MONO_ENVIRONMENT === 'sandbox'`. Anything else (absent, `live`,
 *     `production`, …) is refused: every public function returns null so the
 *     caller falls back to the deterministic demo path. This is the guard that
 *     makes a production call impossible in this build.
 *   - No key value is ever logged.
 *   - Every request fails closed to null (network error, non-2xx, empty) so
 *     the credit route keeps working offline and stays truthful.
 */

export interface MonoUser {
  fullname?: string;
  /** 11-digit account number. */
  account_number?: string;
  account_type?: string;
  /** 11-digit BVN. */
  bvn?: string;
  /** 10-digit KV of a connected account (Mono Connect). */
  kv?: string;
  /** KVN (account reference) that pairs with `kv`. */
  kvn?: string;
}

/** Parsed total + record count from a Mono analyzed-flows endpoint. */
export interface MonoFlowTotals {
  total: number;
  count: number;
}

export type MonoIncomes = MonoFlowTotals;
export type MonoOutflows = MonoFlowTotals;

/** True only for a configured sandbox Mono deployment. */
export function monoEnabled(): boolean {
  const key = process.env.MONO_API_KEY;
  const env = (process.env.MONO_ENVIRONMENT || '').toLowerCase();
  return !!key && env === 'sandbox';
}

// Mono uses one host for sandbox + production (docs.mono.co/docs/environments);
// sandbox vs live is selected by the KEY (test_sk_* vs live_sk_*), not the host.
// The old sandbox.api.mono.co host no longer resolves.
const SANDBOX_BASE = 'https://api.withmono.com';

/**
 * Resolve the Mono base URL. When the deployment is in sandbox mode the host
 * is pinned to the documented Mono API host regardless of `MONO_BASE_URL` — a
 * sandbox key can never be aimed at an arbitrary production host via env alone
 * (and the old dead sandbox.api.mono.co default is replaced). In sandbox mode
 * a non-Mono MONO_BASE_URL is ignored (and the operator is warned once, with
 * the masked host, not the key).
 */
function baseUrl(): string {
  const configured = (process.env.MONO_BASE_URL || SANDBOX_BASE).replace(/\/$/, '');
  if ((process.env.MONO_ENVIRONMENT || '').toLowerCase() === 'sandbox') {
    const host = (() => {
      try {
        return new URL(configured).host;
      } catch {
        return configured;
      }
    })();
    if (host !== 'api.withmono.com') {
      console.warn(`[mono] MONO_ENVIRONMENT=sandbox — pinning base URL to ${SANDBOX_BASE} (ignoring MONO_BASE_URL host ${host}).`);
      return SANDBOX_BASE;
    }
  }
  return configured;
}

function authHeaders(): Record<string, string> {
  // Current Mono docs: mono-sec-key holds the app secret (test_sk_* / live_sk_*).
  // MONO_API_KEY may still be a public test_pk_* — that fails closed on v2 with
  // "invalid secret key" (honest 401 → null → demo seed).
  const key = process.env.MONO_API_KEY ?? '';
  return { 'mono-sec-key': key, Authorization: key, Accept: 'application/json' };
}

function parseStatus(data: { status_code?: number; status?: string }): boolean {
  // Mono returns 200-range status_code on success.
  const code = typeof data.status_code === 'number' ? data.status_code : 200;
  return code >= 200 && code < 300 && !/(error|fail)/i.test(data.status ?? '');
}

/**
 * Look up a user by account number + BVN. Returns null (never throws) when
 * Mono is not in sandbox mode, the call fails, or no user is found.
 */
export async function monoLookupUser(accountNumber: string, bvn: string): Promise<MonoUser | null> {
  if (!monoEnabled()) return null;
  const q = new URLSearchParams({ account: accountNumber, bvn });
  try {
    const res = await fetch(`${baseUrl()}/users?${q.toString()}`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!parseStatus(data)) return null;
    const user = data?.data?.user;
    return user ? (user as MonoUser) : null;
  } catch {
    return null;
  }
}

/** Parsed income analysis for a Mono Connect account (kv + kvn). */
export async function monoIncomes(kv: string, kvn: string): Promise<MonoIncomes | null> {
  return monoAnalyzedFlow(kv, kvn, 'incomes');
}

/** Parsed outflow analysis for a Mono Connect account (kv + kvn). */
export async function monoOutflows(kv: string, kvn: string): Promise<MonoOutflows | null> {
  return monoAnalyzedFlow(kv, kvn, 'outflows');
}

/**
 * Fetch + parse a Mono Connect "analyzed flows" endpoint. The parsed totals
 * are deliberately conservative: if the response shape is missing, we return
 * null so the caller can fall back to a factor rather than inventing a number.
 */
async function monoAnalyzedFlow(
  kv: string,
  kvn: string,
  kind: 'incomes' | 'outflows'
): Promise<{ total: number; count: number } | null> {
  if (!monoEnabled()) return null;
  const q = new URLSearchParams({
    kv,
    kvn,
    date: '01/01/2024',
    duration: '12',
    duration_type: 'months',
  });
  try {
    const res = await fetch(`${baseUrl()}/transactions/analyzed/${kind}?${q.toString()}`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!parseStatus(data)) return null;
    const totals: unknown[] = data?.data?.totals ?? [];
    const parsed = totals
      .map((t) => (t as { type?: string; outflow?: number; inflow?: number } | number))
      .map((t) => {
        if (typeof t === 'number') return t;
        // incomes → inflow sum; outflows → outflow sum.
        const amt = kind === 'incomes' ? t?.inflow : t?.outflow;
        return typeof amt === 'number' ? amt : 0;
      });
    const total = parsed.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0);
    return { total, count: parsed.length };
  } catch {
    return null;
  }
}
