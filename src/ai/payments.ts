/**
 * P15 — payments / charge sandbox path (TEST-MODE ONLY).
 *
 * The canonical PSP for a Nigerian-focused MVP is Flutterwave
 * (research/API-Research.md); Paystack is the documented alternate. This
 * module resolves *which* PSP is configured from the test-mode keys in `.env`
 * and exposes a test-only charge entry point.
 *
 * Sandbox safety (non-negotiable, Track A honesty):
 *   - Only TEST-mode keys are read. There is no production endpoint, no
 *     production secret, and no code path that would charge a real card.
 *   - A completed real authorization needs an interactive customer session
 *     (eWallet / 3DS / redirect), which is out of scope for the demo. So the
 *     charge call returns a *prepared test transaction* (`charged: false`,
 *     `demo_seed: true`) — it never claims a real charge succeeded.
 *   - When no PSP test keys are present the result is `provider: 'none'`,
 *     `status: 'unauthorized'` — the upgrade stays mocked (the P4 billing
 *     path) and nothing is faked.
 */

import { TIER_PLANS, type Tier } from '@/ai/quota';

export type PspName = 'flutterwave' | 'paystack' | 'none';

export interface ChargeInput {
  /** The tier being purchased (drives the ₦ amount). */
  tier: Tier;
  /** Customer / user id (kept for the demo trace; no PII beyond the id). */
  userId?: string;
  /** Reference label for the test transaction. */
  description?: string;
}

export interface ChargeResult {
  provider: PspName;
  /** 'prepared-test' = a test transaction was prepared but not completed. */
  status: 'prepared-test' | 'unauthorized' | 'not-configured';
  /** Always false in this build — no real charge can complete. */
  charged: false;
  /** Naira amount for the tier. */
  amountNGN: number;
  /** A deterministic test reference (Track A), not a live PSP ref. */
  test_reference: string;
  note: string;
  demo_seed: true;
}

/**
 * Resolve the configured PSP from the TEST-mode keys only.
 * Flutterwave is preferred (canonical for NG); Paystack is the alternate.
 */
export function pspConfigured(): PspName {
  const hasFlutter =
    !!process.env.FLUTTERWAVE_SECRET_KEY && !!process.env.FLUTTERWAVE_PUBLIC_KEY;
  const hasPaystack =
    !!process.env.PAYSTACK_SECRET_KEY && !!process.env.PAYSTACK_PUBLIC_KEY;
  if (hasFlutter) return 'flutterwave';
  if (hasPaystack) return 'paystack';
  return 'none';
}

function amountForTier(tier: Tier): number {
  return TIER_PLANS.find((p) => p.tier === tier)?.priceNGN ?? 0;
}

/**
 * Prepare a TEST-ONLY charge for the given tier. Returns the PSP, a
 * deterministic test reference, and the ₦ amount. It never completes a real
 * authorization and never contacts a production endpoint.
 */
export function sandboxCharge(input: ChargeInput): ChargeResult {
  const provider = pspConfigured();
  const amount = amountForTier(input.tier);

  if (provider === 'none') {
    return {
      provider: 'none',
      status: 'not-configured',
      charged: false,
      amountNGN: amount,
      test_reference: '',
      note: 'No PSP test keys in .env — upgrade stays mocked (P4 billing path); nothing is charged.',
      demo_seed: true,
    };
  }

  const ref =
    `${provider}-test-${input.tier}-${(input.userId ?? 'anon').slice(0, 8)}-${Date.now().toString(36)}`;
  return {
    provider,
    status: 'prepared-test',
    charged: false,
    amountNGN: amount,
    test_reference: ref,
    note:
      `${provider} test-mode keys present → a test transaction is prepared (not completed). ` +
      `Completing a real authorization needs an interactive customer session (Track B). No production charge is possible in this build.`,
    demo_seed: true,
  };
}
