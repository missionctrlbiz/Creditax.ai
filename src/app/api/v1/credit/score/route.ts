import { NextResponse, type NextRequest } from 'next/server';
import {
  demoCreditScore,
  monoSandboxCreditScore,
  type CreditScoreResult,
} from '@/ai/credit-scoring';
import { monoEnabled } from '@/ai/mono';
import { guard } from '@/lib/rate-limit';

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

  let result: CreditScoreResult;
  if (kv && kvn && monoEnabled()) {
    const live = await monoSandboxCreditScore(kv, kvn);
    result = live ?? demoCreditScore();
  } else {
    result = demoCreditScore();
  }

  return NextResponse.json({
    ...result,
    factors: result.factors,
    simulator: { available: true, tier_required: 'plus' },
    reference: [
      'Score = f(income, stability, savings rate, debt burden, tax compliance)',
      'Tax compliance is a first-class factor (Creditax differentiator)',
      result.data_source === 'mono-sandbox'
        ? 'Income source: Mono sandbox analyzed flows (kv/kvn supplied); non-income factors fall back to the demo profile.'
        : 'Deterministic demo seed — the "filing streak beats bank balance" story.',
    ],
    mono: {
      sandbox: result.data_source === 'mono-sandbox',
      enabled: monoEnabled(),
      note: result.data_source === 'mono-sandbox'
        ? 'Live Mono sandbox data (test key); demo_seed stays true because these are sandbox test values.'
        : 'Mono not used for this request (no kv/kvn, or not in sandbox mode).',
    },
    demo_seed: result.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
