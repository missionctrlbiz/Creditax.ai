/**
 * P3 F-20 — Skills v1 (feature-specs.md §A/B, demo scope §12).
 *
 * A Skill is a guided mini-workflow surfaced as a chat chip: fixed
 * input → output contract, a credit cost, and a tier gate (feature-specs §"Set in
 * Stone"). The four MVP demo Skills:
 *
 *   🧾 01 WHT Credit Recovery  — seeded ₦480,000 unclaimed vendor → claim schedule
 *   📜 02 TCC Readiness       — readiness % + missing-docs checklist + deadline
 *   🧮 08 Invoice WHT Checker — amount + type → deduct / remit-by / code verdict
 *   👀 07 Notice Explainer    — notice text → plain-language + deadline countdown
 *
 * Every output is deterministic + offline and tagged demo_seed: true (Track A
 * honesty). Costs/tier-gates mirror pricing-and-access §4 (calc=2 credits) so the
 * P4 quota engine can meter them without rework. Track B upgrades: real document
 * matching (Skill 01), live TCC document checks (Skill 02), LLM notice
 * translation (Skill 07), and live WHT code lookup (Skill 08).
 */

import { computeWht, fmtNaira } from '@/ai/tax-rules';
import { DEMO_FACTORS, type CreditFactors } from '@/ai/credit-scoring';
import type { Tier } from '@/lib/seed/demoSeed';

export type SkillId = 'wht-recovery' | 'tcc-readiness' | 'notice-explainer' | 'invoice-wht-check';

export interface SkillMeta {
  id: SkillId;
  label: string;
  icon: string;
  costCredits: number;
  tierGate: Tier | null; // null = all tiers; otherwise minimum tier required
  oneLiner: string;
}

/** The chip rail above the composer (replaces the 4 quick-ask chips). */
export const SKILLS: SkillMeta[] = [
  { id: 'wht-recovery', label: '🧾 Recover my WHT', icon: '🧾', costCredits: 5, tierGate: null, oneLiner: 'Scan my docs for unclaimed WHT credit notes' },
  { id: 'tcc-readiness', label: '📜 TCC readiness', icon: '📜', costCredits: 3, tierGate: null, oneLiner: 'Check my Tax Clearance Certificate checklist' },
  { id: 'notice-explainer', label: '📩 Explain a notice', icon: '📩', costCredits: 2, tierGate: null, oneLiner: 'Plain-language breakdown of an IRS/FIRS notice' },
  { id: 'invoice-wht-check', label: '🧮 Invoice WHT check', icon: '🧮', costCredits: 2, tierGate: 'plus', oneLiner: 'Deduct the right WHT before you pay an invoice' },
];

/** Which tiers may run a skill (null gate = free; otherwise paid-or-above). */
const TIER_RANK: Record<Tier, number> = { free: 0, plus: 1, professional: 2, enterprise: 3 };

export function canRunSkill(skill: SkillMeta, tier: Tier): { allowed: boolean; reason?: string } {
  if (skill.tierGate === null || TIER_RANK[tier] >= TIER_RANK[skill.tierGate]) return { allowed: true };
  return { allowed: false, reason: `Requires ${skill.tierGate} tier (you are on ${tier})` };
}

// ---------------------------------------------------------------------------
// Result shapes — fixed I/O contracts, all demo_seed
// ---------------------------------------------------------------------------

export interface WhtRecoveryResult {
  skill: SkillId;
  title: string;
  vendor: string;
  unclaimedPeriod: string;
  totalUnclaimed: number;
  items: Array<{ period: string; client: string; amount: number; status: 'credit_note_missing' | 'claimed' }>;
  nextAction: string;
  demo_seed: true;
}

export interface TccResult {
  skill: SkillId;
  title: string;
  purpose: string;
  readiness: number; // 0–100
  missingDocs: string[];
  readyDocs: string[];
  deadline: string;
  nextAction: string;
  demo_seed: true;
}

export interface NoticeExplainerResult {
  skill: SkillId;
  title: string;
  plainLanguage: string;
  deadline: string;
  daysLeft: number;
  actions: string[];
  demo_seed: true;
}

export interface InvoiceWhtResult {
  skill: SkillId;
  title: string;
  gross: number;
  paymentType: string;
  rate: number;
  witheld: number;
  netToVendor: number;
  remitBy: string;
  whtCode: string;
  verdict: string;
  demo_seed: true;
}

export type SkillResult = WhtRecoveryResult | TccResult | NoticeExplainerResult | InvoiceWhtResult;

// ---------------------------------------------------------------------------
// Deterministic builders (offline demo data)
// ---------------------------------------------------------------------------

/** Skill 01 — seeded ₦480,000 unclaimed WHT across 3 vendor lines. */
export function runWhtRecovery(input: { vendor?: string } = {}): WhtRecoveryResult {
  const vendor = input.vendor ?? 'Zenith Supplies Ltd';
  return {
    skill: 'wht-recovery',
    title: 'WHT credit recovery scan',
    vendor,
    unclaimedPeriod: 'Jan–Jun 2025',
    totalUnclaimed: 480_000,
    items: [
      { period: 'Feb 2025', client: 'Zenith Supplies Ltd', amount: 180_000, status: 'credit_note_missing' },
      { period: 'Apr 2025', client: 'Zenith Supplies Ltd', amount: 200_000, status: 'credit_note_missing' },
      { period: 'Jun 2025', client: 'Zenith Supplies Ltd', amount: 100_000, status: 'credit_note_missing' },
    ],
    nextAction: 'Request credit notes from the vendor, then file a claim with your state IRS. Send to a verified pro?',
    demo_seed: true,
  };
}

/** Skill 02 — TCC readiness % + missing-docs checklist (deterministic demo). */
export function runTccReadiness(input: { purpose?: string } = {}): TccResult {
  const purpose = input.purpose ?? 'A government tender';
  // Readiness is derived from the demo credit factors (compliance-driven).
  const factors: CreditFactors = DEMO_FACTORS;
  const compliance = 0.25 + factors.taxComplianceScore * 0.75; // demo heuristic
  const readiness = Math.round(compliance * 100);
  const missingDocs =
    readiness < 100
      ? ['FIRS TIN certificate', '2024 CIT/PIT assessments (paid)', 'VAT annual return', 'WHT remittance receipts']
      : [];
  const readyDocs = ['Business name / RC document', 'Current annual return', 'Bank account details'];
  return {
    skill: 'tcc-readiness',
    title: 'TCC readiness tracker',
    purpose: `You need this TCC for ${purpose}.`,
    readiness,
    missingDocs,
    readyDocs,
    deadline: 'TCC must be issued 30 days before the tender close',
    nextAction: `Upload the missing ${missingDocs.length} documents to reach 100% and assemble the bundle.`,
    demo_seed: true,
  };
}

/** Skill 07 — notice explainer: plain-language + deadline countdown. */
export function runNoticeExplainer(input: { notice?: string; dueDate?: string } = {}): NoticeExplainerResult {
  const notice = input.notice ?? 'FIRS assessment notice — additional VAT payable for Q2';
  const dueDate = input.dueDate ?? addCalendarDays(14);
  const daysLeft = Math.round(
    (new Date(`${dueDate}T00:00:00Z`).getTime() - Date.now()) / 86_400_000
  );
  const plainLanguage = `In plain language, your notice (“${notice}”) means the tax authority believes you owe additional VAT. You can either pay it, or object within the deadline. Paying now keeps your TCC/credit path clear; objecting starts an appeal that takes months.`;
  return {
    skill: 'notice-explainer',
    title: 'Notice explainer',
    plainLanguage,
    deadline: dueDate,
    daysLeft: Math.max(0, daysLeft),
    actions: ['Pay the assessed amount (safest, keeps compliance clean)', 'Or file an objection within the deadline', 'Get a verified pro to review before responding'],
    demo_seed: true,
  };
}

/** Skill 08 — invoice WHT checker (reuses the F-06 rules engine). */
export function runInvoiceWhtCheck(input: { amount: number; paymentType: string }): InvoiceWhtResult {
  const v = computeWht(input.amount, input.paymentType);
  // Deterministic demo WHT code by payment-type (Track B = live schedule lookup).
  const code = whtCode(input.paymentType);
  return {
    skill: 'invoice-wht-check',
    title: 'Invoice WHT verdict',
    gross: input.amount,
    paymentType: v.paymentType,
    rate: v.rate,
    witheld: v.witheld,
    netToVendor: v.netToVendor,
    remitBy: v.remitBy,
    whtCode: code,
    verdict: `Deduct ${fmtNaira(v.witheld)} (${Math.round(v.rate * 100)}%), remit by ${v.remitBy}, WHT code ${code}. Issue the vendor a credit note so they can claim it.`,
    demo_seed: true,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deterministic WHT code by payment-type keyword (demo schedule). */
function whtCode(paymentType: string): string {
  const t = paymentType.toLowerCase();
  if (t.includes('rent') || t.includes('residential')) return 'WHT-10R';
  if (t.includes('interest') || t.includes('loan')) return 'WHT-15I';
  if (t.includes('dividend')) return 'WHT-10D';
  if (t.includes('professional')) return 'WHT-10P';
  if (t.includes('commission') || t.includes('management')) return 'WHT-10C';
  return 'WHT-10G'; // goods/services default
}

/** `days` from today (ISO date). */
function addCalendarDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Dispatch a skill by id (used by the chip click + API route). */
export function runSkill(
  id: SkillId,
  input: { amount?: number; paymentType?: string; notice?: string; vendor?: string; purpose?: string; dueDate?: string },
  tier: Tier = 'free'
): { ok: true; result: SkillResult; costCredits: number } | { ok: false; reason: string } {
  const skill = SKILLS.find((s) => s.id === id);
  if (!skill) return { ok: false, reason: 'Unknown skill' };
  const gate = canRunSkill(skill, tier);
  if (!gate.allowed) return { ok: false, reason: gate.reason ?? 'Tier gate' };

  switch (id) {
    case 'wht-recovery':
      return { ok: true, result: runWhtRecovery(input), costCredits: skill.costCredits };
    case 'tcc-readiness':
      return { ok: true, result: runTccReadiness(input), costCredits: skill.costCredits };
    case 'notice-explainer':
      return { ok: true, result: runNoticeExplainer(input), costCredits: skill.costCredits };
    case 'invoice-wht-check': {
      if (typeof input.amount !== 'number' || !input.paymentType) {
        return { ok: false, reason: 'Invoice WHT check needs an amount and a payment type' };
      }
      return { ok: true, result: runInvoiceWhtCheck({ amount: input.amount, paymentType: input.paymentType }), costCredits: skill.costCredits };
    }
  }
}
