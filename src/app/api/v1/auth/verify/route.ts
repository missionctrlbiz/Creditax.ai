import { NextResponse, type NextRequest } from 'next/server';
import { seedDemoKeys, listKeys } from '@/ai/api-keys';
import { guard } from '@/lib/rate-limit';

/**
 * POST /api/v1/auth/verify — validate an API key (Track A demo contract).
 *
 * Accepts the key via `Authorization: Bearer <key>` header OR body { key }.
 * Track A returns a *structured* verification result for a well-formed key:
 * { valid, reason, environment, scopes, demo_seed }. Because Track A keys are
 * deterministic masked demo secrets, `valid` reflects format + active status,
 * and the response is always flagged demo_seed: true — real signature
 * verification + the 100 req/min rate limit are the Track B core-api items.
 *
 * This closes the deferred core-api "auth-verify" exit criterion at the
 * contract level while staying honest about the demo boundary.
 *
 * Rate limiting: the 100 req/min ceiling is enforced in-process by
 * `@/lib/rate-limit` (fixed-window, keyed by the Bearer suffix; IP fallback
 * for anonymous callers) — see `guard()` below. A shared Redis store is the
 * Track B upgrade for multi-instance fairness.
 */
export async function POST(req: NextRequest) {
  // core-api "rate-limit" closure: 100 req/min per key (in-memory window).
  const limited = guard(req);
  if (limited) return limited;

  let key: string | null = null;

  const auth = req.headers.get('authorization') ?? '';
  if (auth.startsWith('Bearer ')) key = auth.slice(7).trim();
  if (!key) {
    try {
      const body = (await req.json()) as { key?: string };
      key = (body.key ?? '').trim();
    } catch {
      /* handled below */
    }
  }

  seedDemoKeys();
  const active = listKeys().filter((k) => k.status === 'active');
  const wellFormed = /^sk_(live|test)_[a-f0-9*]+$/i.test(key ?? '');
  const known = active.some((k) => (key?.length ?? 0) > 0 && k.key.includes(key!.slice(-4)));

  if (!key) {
    return NextResponse.json({ valid: false, reason: 'missing key', demo_seed: true }, { status: 400 });
  }
  if (!wellFormed) {
    return NextResponse.json({ valid: false, reason: 'malformed key format', demo_seed: true }, { status: 400 });
  }

  return NextResponse.json({
    valid: known,
    reason: known ? 'active key' : 'unknown or revoked key',
    environment: /live/i.test(key) ? 'live' : 'test',
    scopes: known ? active.find((k) => k.key.includes(key!.slice(-4)))?.scopes ?? ['Read'] : [],
    rate_limit: {
      rpm: 100,
      note: 'enforced in-process by @/lib/rate-limit (fixed window); a shared Redis store is the multi-instance Track B upgrade',
    },
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
