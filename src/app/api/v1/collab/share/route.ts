import { NextResponse, type NextRequest } from 'next/server';
import { createSharedLink } from '@/ai/collaboration';
import type { Tier } from '@/lib/seed/demoSeed';

const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * P6 F-18 — POST /api/v1/collab/share — create a read-only shared-canvas link.
 * Body: { conversationId?, access?, tier? }. Paid-only → 403 + upgradeTo.
 * Returns the link + its public /share/<slug> URL. demo_seed: true.
 */
export async function POST(req: NextRequest) {
  let body: { conversationId?: string; access?: 'view' | 'comment'; tier?: Tier } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }
  const tier = body.tier && VALID_TIERS.includes(body.tier) ? body.tier : 'free';
  const out = createSharedLink({ conversationId: body.conversationId, access: body.access, tier });
  if (!out.ok) {
    return NextResponse.json({ ok: false, error: out.reason, upgradeTo: out.upgradeTo, demo_seed: true }, { status: 403 });
  }
  return NextResponse.json({ ok: true, link: out.link, url: `/share/${out.link.urlSlug}`, demo_seed: true });
}

export const dynamic = 'force-dynamic';
