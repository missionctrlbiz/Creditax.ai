/**
 * Rate limiting (Track A closure of the deferred core-api "rate-limit" item).
 *
 * A fixed-window, in-memory limiter keyed by API key (or caller IP fallback),
 * enforcing the 100 req/min ceiling documented in auth/verify. Each admitted
 * request also increments the key's usage counter so the developer-portal
 * "usage" figure is live rather than decorative.
 *
 * Track A honesty:
 * - The limiter is REAL — it counts requests per key per window and returns a
 *   429 with a structured body when the ceiling is hit.
 * - It is in-memory: a multi-instance production deployment needs a shared
 *   store (Redis) — that's the Track B upgrade, noted in the 429 body.
 * - `demo_seed: true` flags the limiter's demo provenance; the numbers are
 *   genuine request counts, not mocks.
 */

const DEFAULT_WINDOW_MS = 60_000;
/**
 * Per-key ceiling, operator-overridable via `RATE_LIMIT_PER_MINUTE`
 * (P16 key-sweep: the constant now actually comes from the env manifest
 * instead of being a hard-coded 100). Falls back to 100 when unset/invalid.
 */
function configuredRpmLimit(): number {
  const raw = Number(process.env.RATE_LIMIT_PER_MINUTE);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 100;
}
export const DEFAULT_RPM_LIMIT = configuredRpmLimit();

interface WindowState {
  start: number;
  count: number;
}

const windows = new Map<string, WindowState>();

export interface RateLimitDecision {
  limited: boolean;
  limit: number;
  remaining: number;
  resetInSec: number;
  key: string;
  demo_seed: true;
}

/**
 * Admit or reject one request for `key` under the fixed-window ceiling.
 * On admission the counter is incremented and the key record's `usage` is
 * bumped so the portal sees real activity.
 */
export function admit(key: string, limit: number = DEFAULT_RPM_LIMIT): RateLimitDecision {
  const now = Date.now();
  const state = windows.get(key);
  if (!state || now - state.start >= DEFAULT_WINDOW_MS) {
    const fresh: WindowState = { start: now, count: 0 };
    windows.set(key, fresh);
    fresh.count += 1;
    bumpUsage(key);
    return { limited: false, limit, remaining: Math.max(0, limit - fresh.count), resetInSec: Math.ceil(DEFAULT_WINDOW_MS / 1000), key, demo_seed: true };
  }

  if (state.count < limit) {
    state.count += 1;
    bumpUsage(key);
    const resetInSec = Math.max(1, Math.ceil((state.start + DEFAULT_WINDOW_MS - now) / 1000));
    return { limited: false, limit, remaining: Math.max(0, limit - state.count), resetInSec, key, demo_seed: true };
  }

  const resetInSec = Math.max(1, Math.ceil((state.start + DEFAULT_WINDOW_MS - now) / 1000));
  return { limited: true, limit, remaining: 0, resetInSec, key, demo_seed: true };
}

import { bumpUsage } from '@/ai/api-keys';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/** 429 response body — structured, demo-labeled. */
export function rateLimitedBody(decision: RateLimitDecision, retryAfterSec: number) {
  return {
    error: 'rate_limit_exceeded',
    detail: `More than ${decision.limit} requests/min for this key.`,
    retry_after_sec: retryAfterSec,
    note: 'In-memory window; a shared store (Redis) is required for multi-instance fairness — a Track B upgrade.',
    demo_seed: true,
  };
}

/**
 * Resolve the rate-limit identity for a request: the Bearer key suffix is the
 * primary identifier; callers with no key fall back to the IP. Anonymity keeps
 * the demo honest (no PII beyond what the caller already presents).
 */
export function limiterKey(req: NextRequest): string {
  const auth = req.headers.get('authorization') ?? '';
  if (auth.startsWith('Bearer ')) return `key:${auth.slice(7).trim().slice(-4)}`;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  return `ip:${ip}`;
}

/**
 * Run an endpoint under the limiter. Returns a 429 `NextResponse` when the
 * window is exhausted, otherwise `null` so the route proceeds. On admission the
 * key's stored `usage` counter is bumped so the developer portal shows real
 * activity.
 */
export function guard(req: NextRequest, limit: number = DEFAULT_RPM_LIMIT): NextResponse | null {
  const identity = limiterKey(req);
  const decision = admit(identity, limit);
  if (decision.limited) {
    return NextResponse.json(rateLimitedBody(decision, decision.resetInSec), {
      status: 429,
      headers: { 'Retry-After': String(decision.resetInSec) },
    });
  }
  if (identity.startsWith('key:')) bumpUsage(identity.slice(4));
  return null;
}
