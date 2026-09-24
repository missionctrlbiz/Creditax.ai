import { NextResponse, type NextRequest } from 'next/server';
import { PIT_BANDS, VAT_RATE, WHT_RATES, fmtNaira } from '@/ai/tax-rules';
import { guard } from '@/lib/rate-limit';

/**
 * GET /api/v1/tax/brackets — reference tables (used by the developer-portal
 * one-liner in the demo script and as a self-check surface for the calculators).
 *
 * Naira-only, demo-labeled. Re-verify against the current NTA schedule before
 * any production use.
 */
export async function GET(req: NextRequest) {
  // core-api "rate-limit" closure: 100 req/min per key (in-memory window).
  const limited = guard(req);
  if (limited) return limited;

  return NextResponse.json({
    currency: 'NGN',
    pit: {
      bands: PIT_BANDS.map((b) => ({
        from: b.from,
        to: b.to === Infinity ? 'unlimited' : b.to,
        rate: b.rate,
        label: `${fmtNaira(b.from)}–${b.to === Infinity ? 'and above' : fmtNaira(b.to)}`,
      })),
      consolidatedRelief: 'max(₦200,000, 20% of gross), and never less than 1% of gross',
    },
    vat: {
      rate: VAT_RATE,
      deadline: '21st of the following month',
    },
    wht: {
      typical: WHT_RATES,
      note: 'Rates vary by category and amend frequently — confirm the current FIRS circular.',
    },
    reference: ['NTA 2023', 'FIRS guides', 'NTAA 2023'],
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
