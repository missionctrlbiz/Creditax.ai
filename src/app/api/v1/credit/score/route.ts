import { NextResponse, type NextRequest } from 'next/server';
import { demoCreditScore, type CreditScoreResult } from '@/ai/credit-scoring';
import { guard } from '@/lib/rate-limit';

/**
 * GET /api/v1/credit/score — VantageScore-shaped credit snapshot.
 *
 * Track A: returns the deterministic demo score (the "filing streak beats
 * bank balance" story) and flags it `demo_seed: true` / `data_source:
 * "demo_seed"`. Track B swaps `demoCreditScore()` for a call into the Mono
 * Connect/Income/Prove-backed data provider and recomputes via
 * `computeCreditScore(liveFactors)` — the response shape is stable.
 *
 * This is demo-scope item 6 on camera: a seeded score + factor bars, with the
 * "try the simulator" affordance gated behind a tier.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // core-api "rate-limit" closure: 100 req/min per key (in-memory window).
  const limited = guard(req);
  if (limited) return limited;

  const result: CreditScoreResult = demoCreditScore();
  return NextResponse.json({
    ...result,
    factors: result.factors,
    // Demo affordance: the "try the simulator" deep-dive is a paid feature.
    simulator: { available: true, tier_required: 'plus' },
    reference: [
      'Score = f(income, stability, savings rate, debt burden, tax compliance)',
      'Tax compliance is a first-class factor (Creditax differentiator)',
    ],
    demo_seed: result.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
