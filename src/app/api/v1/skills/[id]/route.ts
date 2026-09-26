import { NextResponse, type NextRequest } from 'next/server';
import { SKILLS, runSkill, canRunSkill, type SkillId, type SkillMeta } from '@/ai/skills';
import { meter } from '@/ai/quota';
import type { Tier } from '@/lib/seed/demoSeed';

const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * P3 F-20 — run one Skill (deterministic demo output, Track A honesty).
 *   POST /api/v1/skills/:id  body { tier?, userId?, amount?, paymentType?, notice?, vendor?, purpose?, dueDate? }
 *
 * P19: skills are actually METERED now — the per-Skill credit cost
 * (SKILLS[].costCredits: 5/3/2/2) is charged via the P4 quota engine when a
 * userId is present; hitting a cap returns 403 with `upgrade_to` so the
 * canvas renders the wall. `invoice-wht-check` is Plus-gated → 403.
 */
export async function POST(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop() as SkillId | undefined;
  const skill = SKILLS.find((s) => s.id === id);
  if (!skill) {
    return NextResponse.json({ error: `Unknown skill: ${id}` }, { status: 404 });
  }

  let body: {
    tier?: Tier;
    userId?: string;
    amount?: number;
    paymentType?: string;
    notice?: string;
    vendor?: string;
    purpose?: string;
    dueDate?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const tier: Tier = body.tier && VALID_TIERS.includes(body.tier) ? body.tier : 'free';

  // P19: charge the Skill's credit cost server-side (was claimed, never done).
  if (body.userId) {
    const gate = meter(body.userId, 'skill', { tier, cost: skill.costCredits });
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: gate.reason,
          tier,
          upgrade_to: gate.status.upgradeHint?.to ?? 'plus',
          status: gate.status,
          demo_seed: true,
        },
        { status: 403, headers: { 'X-Creditax-Quota': gate.reason ?? 'limit' } }
      );
    }
  }

  const out = runSkill(
    skill.id,
    {
      amount: body.amount,
      paymentType: body.paymentType,
      notice: body.notice,
      vendor: body.vendor,
      purpose: body.purpose,
      dueDate: body.dueDate,
    },
    tier
  );

  if (!out.ok) {
    const gate = canRunSkill(skill as SkillMeta, tier);
    const isGate = !gate.allowed;
    return NextResponse.json(
      {
        error: out.reason,
        tier,
        ...(isGate ? { upgrade_to: skill.tierGate } : {}),
      },
      { status: isGate ? 403 : 400 }
    );
  }
  return NextResponse.json(out, { status: 200 });
}

export const dynamic = 'force-dynamic';
