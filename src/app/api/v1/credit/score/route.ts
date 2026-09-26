import { NextResponse, type NextRequest } from 'next/server';
import {
  demoCreditScore,
  monoSandboxCreditScore,
  type CreditScoreResult,
} from '@/ai/credit-scoring';
import { monoEnabled } from '@/ai/mono';
import { guard } from '@/lib/rate-limit';
import { meter } from '@/ai/quota';

/**
 * GET /api/v1/credit/score — VantageScore-shaped credit snapshot.
 *
 * Two honest data sources (Track A):
 *   - No params → the deterministic demo seed ("filing streak beats bank
 *     balance"), `data_source: 'demo_seed'`.
 *   - `?kv=<Mono Connect KV>&kvn=<KVN>` → when MONO is in SANDBOX mode, the
 *     income-side score from live Mono sandbox analyzed flows,
 *     `data_source: 'mono-sandbox'` (still `demo_seed: true` — the values are
 *     sandbox test data, not a real person's finances). When Mono is
 *     unavailable / not in sandbox mode it degrades back to the demo seed and
 *     reports `data_source: 'demo_seed'` so nothing is faked.
 *
 * `demo_seed` is truthfully true in both cases (sandbox test data and seeded
 * data are both non-production).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const limited = guard(req);
  if (limited) return limited;

  const kv = req.nextUrl.searchParams.get('kv') ?? '';
  const kvn = req.nextUrl.searchParams.get('kvn') ?? '';
  const userId = req.nextUrl.searchParams.get('userId') ?? '';

  // P19: a real BVN-verified pull (kv/kvn) is a metered action (BVN teaser,
  // 25cr accounting) — page hydrations without kv/kvn stay free.
  if (userId && kv && kvn) {
    const gate = meter(userId, 'bvns');
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: gate.reason,
          blocked: true,
          upgrade: gate.status.upgradeHint,
          status: gate.status,
          demo_seed: true,
        },
        { status: 403, headers: { 'X-Creditax-Quota': gate.reason ?? 'limit' } }
      );
    }
  }

  let result: CreditScoreResult;
  let monoAttempted = false;
  if (kv && kvn && monoEnabled()) {
    monoAttempted = true;
    const live = await monoSandboxCreditScore(kv, kvn);
    result = live ?? demoCreditScore();
  } else {
    result = demoCreditScore();
  }

  const monoSandboxHit = result.data_source === 'mono-sandbox';
  return NextResponse.json({
    ...result,
    factors: result.factors,
    simulator: { available: true, tier_required: 'plus' },
    reference: [
      'Score = f(income, stability, savings rate, debt burden, tax compliance)',
      'Tax compliance is a first-class factor (Creditax differentiator)',
      monoSandboxHit
        ? 'Income source: Mono sandbox analyzed flows (kv/kvn supplied); non-income factors fall back to the demo profile.'
        : 'Deterministic demo seed — the "filing streak beats bank balance" story.',
    ],
    mono: {
      sandbox: monoSandboxHit,
      enabled: monoEnabled(),
      attempted: monoAttempted,
      note: monoSandboxHit
        ? 'Live Mono sandbox data (test key); demo_seed stays true because these are sandbox test values.'
        : monoAttempted
          ? 'Mono sandbox call attempted but failed closed (invalid/missing secret key, bad kv/kvn, or unreachable) — demo seed used.'
          : 'Mono not used for this request (no kv/kvn, or not in sandbox mode).',
    },
    demo_seed: result.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
