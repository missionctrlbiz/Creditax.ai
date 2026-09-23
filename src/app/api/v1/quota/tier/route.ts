import { NextResponse, type NextRequest } from 'next/server';
import { setTier, TIER_PLANS, type Tier } from '@/ai/quota';

const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * P4 F-13 — POST /api/v1/quota/tier — mocked billing tier flip.
 *
 * Body: { userId?, tier } → flips the user's tier + returns the plan + a
 * toast payload. Currency rule: ₦ only. "Upgrade" = set tier + toast; real
 * Paystack/Flutterwire wiring is Track B (the response pre-declares
 * `billing.provider: "mock"`).
 */
export async function POST(req: NextRequest) {
  let body: { userId?: string; tier?: Tier } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.tier || !VALID_TIERS.includes(body.tier)) {
    return NextResponse.json({ error: '`tier` must be one of ' + VALID_TIERS.join(', ') }, { status: 400 });
  }
  const userId = body.userId ?? 'u-consumer';
  setTier(userId, body.tier);
  const plan = TIER_PLANS.find((p) => p.tier === body.tier);
  return NextResponse.json({
    userId,
    tier: body.tier,
    plan,
    toast: {
      title: plan ? `You're on ${plan.name}` : 'Tier updated',
      body: plan?.priceNGN ? `${plan.name} · ₦${plan.priceNGN.toLocaleString('en-NG')}/mo` : 'Free tier',
    },
    billing: { provider: 'mock', note: 'Real Paystack/Flutterwave is Track B', demo_seed: true },
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
