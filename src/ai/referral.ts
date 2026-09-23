/**
 * P3 F-09 — pro-referral trigger (Track A).
 *
 * The agent surfaces a verified pro when:
 *   - the answer confidence is below the threshold (low-confidence), OR
 *   - the question carries a high-stakes intent (audit, appeal, objection,
 *     penalty) — matching mvp-demo-plan §3.2.5 / product-foundation §5.
 *
 * The card masks the contact by default and reveals it when the viewer is
 * logged-in at a paid tier (pricing-and-access §2 "Marketplace contact reveal").
 *
 * Deterministic + offline: maps intent → the best-matching seeded pro via
 * service keywords, no LLM. Track B replaces the keyword match with RAG
 * pro-retrieval + a real contact-reveal gate.
 */

import { seedProfessionals, type DemoProfessional } from '@/lib/seed/demoSeed';
import type { Tier } from '@/lib/seed/demoSeed';

export type ReferralReason = 'low_confidence' | 'audit_appeal' | 'explicit' | 'none';

export interface ReferralCard {
  pro: {
    id: string;
    slug: string;
    name: string;
    city: string;
    state: string;
    services: string[];
    rating: number;
    reviewCount: number;
    verified: boolean;
  };
  /** Masked unless the viewer is logged-in at a paid tier. */
  contact: {
    masked: boolean;
    phone?: string;
    whatsapp?: string;
    email?: string;
    reason: ReferralReason;
  };
  demo_seed: true;
}

/** High-stakes intent keywords that force a referral regardless of confidence. */
const HIGH_STAKES = ['audit', 'appeal', 'objection', 'penalty', 'assess', 'fine', 'investigation'];

/** Intent → pro-service keyword overlap so the right pro is recommended. */
const INTENT_KEYWORDS = [
  ['vat', 'v a t'],
  ['audit', 'investigation', 'appeal', 'objection', 'penalty'],
  ['wht', 'withholding', 'credit', 'recovery'],
  ['paye', 'salary', 'corporate', 'cit', 'tcc', 'clearance'],
];

export function shouldRefer(text: string, confidence?: number): { refer: boolean; reason: ReferralReason } {
  const lower = (text ?? '').toLowerCase();
  if (HIGH_STAKES.some((k) => lower.includes(k))) return { refer: true, reason: 'audit_appeal' };
  // Low-confidence answers always surface a verified pro.
  if (typeof confidence === 'number' && confidence < 0.6) return { refer: true, reason: 'low_confidence' };
  return { refer: false, reason: 'none' };
}

/** Best matching verified pro for a text intent (deterministic, offline). */
export function pickProFor(text: string): DemoProfessional | null {
  const lower = (text ?? '').toLowerCase();
  let best: { pro: DemoProfessional; score: number } | null = null;
  for (const p of seedProfessionals) {
    if (!p.verified) continue;
    let score = 0;
    for (const k of p.services) if (lower.includes(k.toLowerCase())) score += 2;
    // Bonus for intent-keyword overlap across all pro service words.
    for (const grp of INTENT_KEYWORDS) {
      for (const word of grp) {
        if (word.includes(' ')) continue;
        if (lower.includes(word) && p.services.some((s) => s.toLowerCase().includes(word))) score += 1;
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { pro: p, score };
  }
  // No strong match → the highest-rated verified pro (deterministic fallback).
  if (!best) {
    const top = [...seedProfessionals].filter((p) => p.verified).sort((a, b) => b.rating - a.rating)[0];
    if (top) best = { pro: top, score: 0 };
  }
  return best?.pro ?? null;
}

/**
 * Build the referral card. Contact is masked for free-tier / anonymous viewers
 * and revealed for Plus / Professional tiers (Marketplace contact-reveal rule).
 */
export function buildReferralCard(input: {
  text: string;
  confidence?: number;
  tier?: Tier;
  loggedIn?: boolean;
}): ReferralCard | null {
  const { refer, reason } = shouldRefer(input.text, input.confidence);
  const pro = pickProFor(input.text);
  if (!refer || !pro) return null;

  // Paid tiers (Plus / Professional / Enterprise) see full contact details.
  // pricing-and-access.md §2: Free = masked, Plus/Pro = Full, Ent = priority.
  const revealPaid =
    input.tier === 'plus' || input.tier === 'professional' || input.tier === 'enterprise';
  const revealLogged = input.loggedIn === true;
  const masked = !(revealPaid || revealLogged);

  return {
    pro: {
      id: pro.id,
      slug: pro.slug,
      name: pro.name,
      city: pro.location.city,
      state: pro.location.state,
      services: pro.services,
      rating: pro.rating,
      reviewCount: pro.reviewCount,
      verified: pro.verified,
    },
    contact: {
      masked,
      ...(masked
        ? {}
        : { phone: pro.phone, whatsapp: pro.whatsapp, email: pro.email }),
      reason,
    },
    demo_seed: true,
  };
}
