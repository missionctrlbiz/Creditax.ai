import { NextResponse, type NextRequest } from 'next/server';
import { buildReferralCard, shouldRefer } from '@/ai/referral';
import type { Tier } from '@/lib/seed/demoSeed';

const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * P3 F-09 — pro-referral trigger.
 *
 *   POST /api/v1/referral
 *   body { text, confidence?, tier?, loggedIn? }
 *
 * Returns a verified-pro card. Contact is masked for free/anonymous viewers and
 * revealed for Plus/Professional (Marketplace contact-reveal rule). Track A:
 * deterministic intent match over seeded pros, demo_seed: true. Track B swaps
 * the keyword match for RAG pro-retrieval + a real login/tier gate.
 */
export async function POST(req: NextRequest) {
  let body: { text?: string; confidence?: number; tier?: Tier; loggedIn?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.text) {
    return NextResponse.json({ error: '`text` is required' }, { status: 400 });
  }

  const tier: Tier = body.tier && VALID_TIERS.includes(body.tier) ? body.tier : 'free';
  const decision = shouldRefer(body.text, body.confidence);
  const card = buildReferralCard({
    text: body.text,
    confidence: body.confidence,
    tier,
    loggedIn: body.loggedIn,
  });

  if (!card) {
    return NextResponse.json({ refer: false, reason: decision.reason, demo_seed: true });
  }
  return NextResponse.json({ refer: true, card, demo_seed: true });
}

export const dynamic = 'force-dynamic';
