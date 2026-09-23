import { NextResponse, type NextRequest } from 'next/server';
import { inviteMember } from '@/ai/collaboration';
import type { Tier } from '@/lib/seed/demoSeed';

const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * P6 F-18 — POST /api/v1/collab/invite — invite a workspace member (paid-only).
 * Body: { workspaceId?, email, role?, tier? }. Free tier → 403 + upgradeTo.
 * demo_seed: true. Track B = real email delivery + workspace membership.
 */
export async function POST(req: NextRequest) {
  let body: { workspaceId?: string; email?: string; role?: 'member' | 'viewer'; tier?: Tier } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return NextResponse.json({ error: 'a valid `email` is required' }, { status: 400 });
  }
  const tier = body.tier && VALID_TIERS.includes(body.tier) ? body.tier : 'free';
  const out = inviteMember({ workspaceId: body.workspaceId, email: body.email, role: body.role, tier });
  if (!out.ok) {
    return NextResponse.json({ ok: false, error: out.reason, upgradeTo: out.upgradeTo, demo_seed: true }, { status: 403 });
  }
  return NextResponse.json({ ok: true, invite: out.invite, demo_seed: true });
}

export const dynamic = 'force-dynamic';
