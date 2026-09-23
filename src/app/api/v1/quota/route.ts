import { NextResponse, type NextRequest } from 'next/server';
import { quotaStatus, TIER_PLANS } from '@/ai/quota';

/**
 * P4 F-12 — GET /api/v1/quota → live counters + caps + upgrade hint.
 *
 * This powers the "named-limit upgrade walls" (demo scope 8) and the live
 * /dashboard/usage page (replaces mock figures). Free-tier daily caps derive
 * from pricing-and-access §2; the free lifetime chat cap (60) is the
 * conversion nudge (§5). Track A: in-memory over seedQuotas, demo_seed: true.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') ?? 'u-consumer';
  const status = quotaStatus(userId);
  return NextResponse.json({ ...status, plans: TIER_PLANS, demo_seed: true });
}

export const dynamic = 'force-dynamic';
