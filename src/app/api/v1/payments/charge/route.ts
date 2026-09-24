import { NextResponse, type NextRequest } from 'next/server';
import { sandboxCharge, pspConfigured } from '@/ai/payments';
import { TIER_PLANS, type Tier } from '@/ai/quota';

const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * POST /api/v1/payments/charge — P15 test-mode charge entry point.
 *
 * Body: { tier, userId?, description? }.
 *
 * Returns a *prepared test transaction* (charged: false, demo_seed: true) for
 * the configured PSP (Flutterwave preferred, Paystack alternate) using
 * TEST-mode keys only. When no PSP test keys are present, provider: 'none'
 * and the upgrade stays mocked — nothing is charged. A production charge is
 * structurally impossible in this build.
 */
export async function POST(req: NextRequest) {
  let body: { tier?: Tier; userId?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.tier || !VALID_TIERS.includes(body.tier)) {
    return NextResponse.json(
      { error: '`tier` must be one of ' + VALID_TIERS.join(', ') },
      { status: 400 }
    );
  }

  const result = sandboxCharge({
    tier: body.tier,
    userId: body.userId,
    description: body.description,
  });

  return NextResponse.json({
    ...result,
    tier: body.tier,
    plan: TIER_PLANS.find((p) => p.tier === body.tier),
    psp: pspConfigured(),
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
