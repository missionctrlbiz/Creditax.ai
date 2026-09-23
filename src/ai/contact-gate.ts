/**
 * P5 F-14b — marketplace contact gating (Track A).
 *
 * Pricing-and-access §2 "Marketplace contact reveal":
 *   Free      → contact masked until login
 *   Plus      → full contact reveal
 *   Pro/Ent   → full contact + priority placement
 *
 * This module is the deterministic display rule (mask helpers + reveal policy)
 * the pro-profile page applies to phone/email/WhatsApp. It is pure + offline so
 * the demo can flip the gate on-camera. Track B makes the reveal a server call
 * (session + tier from the auth layer, per-user contact permissions).
 */

import type { Tier } from '@/lib/seed/demoSeed';

export interface RevealInput {
  loggedIn: boolean;
  /** The viewer's tier (free unless they've upgraded). */
  tier: Tier;
}

export interface RevealPolicy {
  /** False for anonymous / free → contact stays masked. */
  revealed: boolean;
  reason: 'logged_in_paid' | 'masked_free' | 'masked_anonymous';
  hint: string;
}

/** Free + not logged in = masked. Logged in at a paid tier = revealed. */
export function contactRevealPolicy(input: RevealInput): RevealPolicy {
  if (!input.loggedIn) {
    return { revealed: false, reason: 'masked_anonymous', hint: 'Sign in to reveal full contact' };
  }
  const paid = input.tier !== 'free';
  if (paid) {
    return { revealed: true, reason: 'logged_in_paid', hint: `Full contact on ${input.tier} tier` };
  }
  return { revealed: false, reason: 'masked_free', hint: 'Free tier keeps pro contact masked — upgrade to reveal' };
}

/** Deterministic phone mask: keep the last 3 digits, e.g. +234••• •••• 5678. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '••••';
  return `••• ••• ${digits.slice(-4)}`;
}

/** Deterministic email mask: first char + domain, e.g. a••••@firm.ng. */
export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at <= 0) return '••••@•••';
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  return `${local[0]}••••@${domain}`;
}
