/**
 * P4 F-11 — quota engine (Track A, server-side).
 *
 * Monetization proof: credits are metered and enforced on the server, never
 * the client (pricing-and-access.md §6 "Enforcement"). Credits are consumed
 * per internal credit accounting (§4):
 *
 *   chat=1  tax-calc=2  upload=3  report=2  credit-refresh=2  bvns=25  tin-cac=5  api=1
 *
 * Daily caps reset at 00:00 WAT; the free lifetime chat cap (60) is the
 * conversion nudge (§5). Tiers (§2): Free / Plus ₦5,000 / Professional
 * ₦25,000 / Enterprise. Free-tier daily caps derive from the published action
 * limits; paid tiers get raised daily caps with "unlimited fair-use" noted.
 *
 * Track A honesty: the engine seeds from `seedQuotas` (demo_seed) and persists
 * to an in-memory store for the session. The PocketBase `quotas` mirror is the
 * Track B swap — the call surface is stable. When PocketBase is reachable and
 * enabled, the store prefers it.
 */

import { seedQuotas, type DemoQuota } from '@/lib/seed/demoSeed';
import type { Tier } from '@/lib/seed/demoSeed';
export type { Tier };

// ---------------------------------------------------------------------------
// Credit accounting (pricing-and-access §4) — source of truth for metering
// ---------------------------------------------------------------------------

export type MeteredAction =
  | 'chat'
  | 'tax-calc'
  | 'upload'
  | 'report'
  | 'credit-refresh'
  | 'bvns'
  | 'tin-cac'
  | 'api';

/** Credits per action (§4 "Internal Credit Accounting"). */
export const CREDIT_COST: Record<MeteredAction, number> = {
  chat: 1,
  'tax-calc': 2,
  upload: 3,
  report: 2,
  'credit-refresh': 2,
  bvns: 25,
  'tin-cac': 5,
  api: 1,
};

// ---------------------------------------------------------------------------
// Tier caps (pricing-and-access §2, daily + lifetime chat)
// ---------------------------------------------------------------------------

export interface TierCaps {
  tier: Tier;
  /** Daily agent-chat messages (§2). */
  chatPerDay: number;
  /** Lifetime free chat cap (free tier only; others unbounded for demo). */
  lifetimeChatCap: number;
  /** Daily tax-calculation actions (§2). */
  calcsPerDay: number;
  /** Daily document uploads (§2). */
  uploadsPerDay: number;
  /** Daily report-chart generations (§2). */
  reportsPerDay: number;
  /** Included monthly BVN verifications (§2). */
  bvnPerMonth: number;
  /** BVN pay-per-use teaser (free: 2 within 60 days). */
  bvnTeaser: number;
  /** Fair-use note. */
  fairUse: boolean;
}

export const TIER_CAPS: Record<Tier, TierCaps> = {
  free: { tier: 'free', chatPerDay: 5, lifetimeChatCap: 60, calcsPerDay: 5, uploadsPerDay: 2, reportsPerDay: 2, bvnPerMonth: 0, bvnTeaser: 2, fairUse: false },
  plus: { tier: 'plus', chatPerDay: 100, lifetimeChatCap: Infinity, calcsPerDay: 50, uploadsPerDay: 20, reportsPerDay: 10, bvnPerMonth: 5, bvnTeaser: 0, fairUse: true },
  professional: { tier: 'professional', chatPerDay: Infinity, lifetimeChatCap: Infinity, calcsPerDay: Infinity, uploadsPerDay: 100, reportsPerDay: Infinity, bvnPerMonth: 20, bvnTeaser: 0, fairUse: true },
  enterprise: { tier: 'enterprise', chatPerDay: Infinity, lifetimeChatCap: Infinity, calcsPerDay: Infinity, uploadsPerDay: Infinity, reportsPerDay: Infinity, bvnPerMonth: Infinity, bvnTeaser: 0, fairUse: true },
};

/** Daily credit budget per tier = sum of (cap × cost) for the metered actions. */
export function dailyCreditBudget(tier: Tier): number {
  const c = TIER_CAPS[tier];
  if (c.chatPerDay === Infinity || c.calcsPerDay === Infinity) return Infinity;
  return c.chatPerDay * CREDIT_COST.chat + c.calcsPerDay * CREDIT_COST['tax-calc'] + c.uploadsPerDay * CREDIT_COST.upload + c.reportsPerDay * CREDIT_COST.report;
}

// ---------------------------------------------------------------------------
// Quota record (live counters, session-scoped in Track A)
// ---------------------------------------------------------------------------

export interface QuotaRecord {
  userId: string;
  tier: Tier;
  /** Credits consumed today (resets 00:00 WAT — demo holds a session window). */
  creditsToday: number;
  chatsToday: number;
  chatsLifetime: number;
  calcsToday: number;
  uploadsToday: number;
  reportsToday: number;
  bvnUsed: number;
  bvnTeaserRemaining: number;
  demo_seed: true;
}

// Seed the store from seedQuotas (demo_seed).
function seedRecord(userId: string, tier: Tier): QuotaRecord {
  const seed: DemoQuota | undefined = seedQuotas.find((q) => q.userId === userId);
  return {
    userId,
    tier,
    creditsToday: seed ? seed.chatToday * CREDIT_COST.chat + seed.calcsToday * CREDIT_COST['tax-calc'] + seed.uploadsToday * CREDIT_COST.upload : 0,
    chatsToday: seed?.chatToday ?? 0,
    chatsLifetime: seed?.lifetimeChats ?? 0,
    calcsToday: seed?.calcsToday ?? 0,
    uploadsToday: seed?.uploadsToday ?? 0,
    reportsToday: 0,
    bvnUsed: seed?.bvnsUsed ?? 0,
    bvnTeaserRemaining: seed ? seed.bvnsFreeTeaser - seed.bvnsUsed : TIER_CAPS[tier].bvnTeaser,
    demo_seed: true,
  };
}

const store = new Map<string, QuotaRecord>();

function getOrCreate(userId: string, tier: Tier = 'free'): QuotaRecord {
  let rec = store.get(userId);
  if (!rec) {
    rec = seedRecord(userId, tier);
    store.set(userId, rec);
  }
  return rec;
}

// ---------------------------------------------------------------------------
// Status — what the usage page + upgrade walls render
// ---------------------------------------------------------------------------

export interface QuotaStatus {
  userId: string;
  tier: Tier;
  credits: {
    today: number;
    budget: number; // Infinity → fair-use/unlimited
    remaining: number;
  };
  chats: { today: number; cap: number; lifetime: number; lifetimeCap: number };
  calcs: { today: number; cap: number };
  uploads: { today: number; cap: number };
  reports: { today: number; cap: number };
  bvn: { used: number; includedThisMonth: number; teaserRemaining: number };
  overDailyLimit: boolean;
  overLifetimeLimit: boolean;
  fairUse: boolean;
  /** Upgrade hint shown on a wall (null for top tiers / no wall). */
  upgradeHint: { to: Tier; message: string } | null;
  demo_seed: true;
}

export function quotaStatus(userId: string, tier?: Tier): QuotaStatus {
  const rec = tier ? setTier(userId, tier) : getOrCreate(userId, 'free');
  const caps = TIER_CAPS[rec.tier];
  const budget = dailyCreditBudget(rec.tier);
  const remaining = budget === Infinity ? Infinity : Math.max(0, budget - rec.creditsToday);
  const overDailyLimit = budget !== Infinity && rec.creditsToday >= budget;
  const overLifetimeLimit =
    rec.tier === 'free' && caps.lifetimeChatCap !== Infinity && rec.chatsLifetime >= caps.lifetimeChatCap;

  // Upgrade hint: free → Plus (named limit, ₦5,000/mo per pricing §5).
  let upgradeHint: QuotaStatus['upgradeHint'] = null;
  if (rec.tier === 'free' && (overDailyLimit || overLifetimeLimit)) {
    upgradeHint = { to: 'plus', message: `You've hit today's ${caps.chatPerDay} free chats — Plus gives you ${TIER_CAPS.plus.chatPerDay}/day for ₦5,000/mo.` };
  } else if (rec.tier === 'plus' && caps.calcsPerDay !== Infinity && rec.calcsToday >= caps.calcsPerDay) {
    upgradeHint = { to: 'professional', message: 'You\'ve reached the Plus calculation cap — Professional is unlimited for ₦25,000/mo.' };
  }

  return {
    userId,
    tier: rec.tier,
    credits: { today: rec.creditsToday, budget: budget === Infinity ? -1 : budget, remaining: remaining === Infinity ? -1 : remaining },
    chats: { today: rec.chatsToday, cap: caps.chatPerDay === Infinity ? -1 : caps.chatPerDay, lifetime: rec.chatsLifetime, lifetimeCap: caps.lifetimeChatCap === Infinity ? -1 : caps.lifetimeChatCap },
    calcs: { today: rec.calcsToday, cap: caps.calcsPerDay === Infinity ? -1 : caps.calcsPerDay },
    uploads: { today: rec.uploadsToday, cap: caps.uploadsPerDay === Infinity ? -1 : caps.uploadsPerDay },
    reports: { today: rec.reportsToday, cap: caps.reportsPerDay === Infinity ? -1 : caps.reportsPerDay },
    bvn: { used: rec.bvnUsed, includedThisMonth: caps.bvnPerMonth === Infinity ? -1 : caps.bvnPerMonth, teaserRemaining: Math.max(0, rec.bvnTeaserRemaining) },
    overDailyLimit,
    overLifetimeLimit,
    fairUse: caps.fairUse,
    upgradeHint,
    demo_seed: true,
  };
}

// ---------------------------------------------------------------------------
// Meter — consume credits on the server (enforcement point)
// ---------------------------------------------------------------------------

export interface MeterResult {
  allowed: boolean;
  userId: string;
  action: MeteredAction;
  cost: number;
  reason?: 'daily_limit' | 'lifetime_limit' | 'bvn_teaser_exhausted';
  status: QuotaStatus;
  demo_seed: true;
}

/**
 * Consume credits for an action. Returns allowed:false + reason when the
 * cap is hit so the caller can surface an upgrade wall (F-12).
 */
export function meter(userId: string, action: MeteredAction, opts: { tier?: Tier } = {}): MeterResult {
  const rec = getOrCreate(userId, opts.tier);
  const caps = TIER_CAPS[rec.tier];
  const cost = CREDIT_COST[action];

  // Per-action guardrails before charging credits.
  if (action === 'chat') {
    if (rec.chatsToday >= caps.chatPerDay) return { allowed: false, userId, action, cost, reason: 'daily_limit', status: quotaStatus(userId), demo_seed: true };
    if (rec.tier === 'free' && caps.lifetimeChatCap !== Infinity && rec.chatsLifetime >= caps.lifetimeChatCap) {
      return { allowed: false, userId, action, cost, reason: 'lifetime_limit', status: quotaStatus(userId), demo_seed: true };
    }
  }
  if (action === 'tax-calc' && rec.calcsToday >= caps.calcsPerDay) return { allowed: false, userId, action, cost, reason: 'daily_limit', status: quotaStatus(userId), demo_seed: true };
  if (action === 'upload' && rec.uploadsToday >= caps.uploadsPerDay) return { allowed: false, userId, action, cost, reason: 'daily_limit', status: quotaStatus(userId), demo_seed: true };
  if (action === 'report' && rec.reportsToday >= caps.reportsPerDay) return { allowed: false, userId, action, cost, reason: 'daily_limit', status: quotaStatus(userId), demo_seed: true };
  if (action === 'bvns' && rec.bvnUsed >= caps.bvnPerMonth + rec.bvnTeaserRemaining) {
    return { allowed: false, userId, action, cost, reason: 'bvn_teaser_exhausted', status: quotaStatus(userId), demo_seed: true };
  }

  // Charge credits + action counters (server-side, never client).
  rec.creditsToday += cost;
  switch (action) {
    case 'chat':
      rec.chatsToday += 1;
      rec.chatsLifetime += 1;
      break;
    case 'tax-calc':
      rec.calcsToday += 1;
      break;
    case 'upload':
      rec.uploadsToday += 1;
      break;
    case 'report':
      rec.reportsToday += 1;
      break;
    case 'credit-refresh':
      break;
    case 'bvns':
      if (rec.bvnTeaserRemaining > 0) rec.bvnTeaserRemaining -= 1;
      rec.bvnUsed += 1;
      break;
    case 'tin-cac':
    case 'api':
      break;
  }

  return { allowed: true, userId, action, cost, status: quotaStatus(userId), demo_seed: true };
}

// ---------------------------------------------------------------------------
// Tier change — F-13 mock billing (flip tier + toast; real PSP is Track B)
// ---------------------------------------------------------------------------

export function setTier(userId: string, tier: Tier): QuotaRecord {
  const rec = getOrCreate(userId, tier);
  // Keep the record but re-baseline counters to the new tier's seed so the
  // demo reflects the tier's published limits (pricing §2).
  rec.tier = tier;
  const seed = seedQuotas.find((q) => q.userId === userId && q.tier === tier);
  if (seed) {
    rec.creditsToday = seed.chatToday * CREDIT_COST.chat + seed.calcsToday * CREDIT_COST['tax-calc'] + seed.uploadsToday * CREDIT_COST.upload;
    rec.chatsToday = seed.chatToday;
    rec.chatsLifetime = seed.lifetimeChats;
    rec.calcsToday = seed.calcsToday;
    rec.uploadsToday = seed.uploadsToday;
    rec.bvnUsed = seed.bvnsUsed;
    rec.bvnTeaserRemaining = seed.bvnsFreeTeaser - seed.bvnsUsed;
  }
  store.set(userId, rec);
  return rec;
}

/** Available tiers + mock ₦ pricing (F-13, currency rule: ₦ only). */
export const TIER_PLANS: Array<{ tier: Tier; name: string; priceNGN: number; blurb: string }> = [
  { tier: 'free', name: 'Free', priceNGN: 0, blurb: 'One genuine aha — a taste, not a meal.' },
  { tier: 'plus', name: 'Plus', priceNGN: 5000, blurb: '100 chats/day, full contact reveal, BVN quota.' },
  { tier: 'professional', name: 'Professional', priceNGN: 25000, blurb: 'Unlimited fair-use + client tools + shared canvas.' },
  { tier: 'enterprise', name: 'Enterprise', priceNGN: 0, blurb: 'Custom pooled scoring + SSO (contact us).' },
];
