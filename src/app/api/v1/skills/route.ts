import { NextResponse } from 'next/server';
import { SKILLS } from '@/ai/skills';

/**
 * P3 F-20 — list the Skills chip rail.
 *   GET /api/v1/skills → [{ id, label, icon, costCredits, tierGate, oneLiner }]
 * All demo-seeded; costs mirror pricing-and-access §4 for the P4 quota engine.
 */
export function GET() {
  return NextResponse.json({ skills: SKILLS, demo_seed: true });
}

export const dynamic = 'force-dynamic';
