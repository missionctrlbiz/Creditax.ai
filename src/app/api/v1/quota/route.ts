import { NextResponse, type NextRequest } from 'next/server';
import { quotaStatus, TIER_PLANS } from '@/ai/quota';
import { seedQuotas, seedUsers, type Tier } from '@/lib/seed/demoSeed';

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
  // Resolve the demo tier from the seeded user record (e.g. u-admin =
  // enterprise, u-pro = professional) with the seed quota as a fallback, so
  // each demo account reports its own caps instead of the free default.
  const tier: Tier | undefined =
    seedUsers.find((u) => u.id === userId)?.tier ??
    seedQuotas.find((q) => q.userId === userId)?.tier;
  const status = quotaStatus(userId, tier);
  return NextResponse.json({ ...status, plans: TIER_PLANS, demo_seed: true });
}

export const dynamic = 'force-dynamic';
