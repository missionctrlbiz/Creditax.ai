/**
 * P2 — Nigerian tax reference tables + deterministic calculators.
 *
 * Single source of truth for the demo's PAYE / VAT / WHT figures (F-06).
 * All values trace to the P0 KB docs in scripts/kb/ and NTA 2023 / NTAA 2023.
 * Figures are demo-labeled: re-verify against the current NTA schedule before
 * any production use (legal-compliance.md §2).
 *
 * Everything here is pure and synchronous — no IO, no LLM — so the calculator
 * endpoints are fast, testable, and deterministic.
 */

// ---------------------------------------------------------------------------
// Personal Income Tax — graduated bands (NTA 2023 residents)
// ---------------------------------------------------------------------------
export interface PitBand {
  /** Minimum chargeable income (₦) this band starts at. */
  from: number;
  /** Maximum chargeable income (₦) this band ends at; Infinity for the last. */
  to: number;
  rate: number; // decimal, e.g. 0.07
}

/** Annual graduated bands, chargeable-income based. */
export const PIT_BANDS: PitBand[] = [
  { from: 0, to: 300_000, rate: 0.07 },
  { from: 300_000, to: 600_000, rate: 0.11 },
  { from: 600_000, to: 1_100_000, rate: 0.15 },
  { from: 1_100_000, to: 1_600_000, rate: 0.19 },
  { from: 1_600_000, to: 3_200_000, rate: 0.21 },
  { from: 3_200_000, to: 5_600_000, rate: 0.23 },
  { from: 5_600_000, to: Infinity, rate: 0.24 },
];

/**
 * Consolidated Relief Allowance = max(₦200,000, 20% of gross), and never less
 * than 1% of gross.
 */
export function consolidatedRelief(gross: number): number {
  const floor = 200_000;
  const pct = gross * 0.2;
  const min = gross * 0.01;
  return Math.max(floor, pct, min);
}

/**
 * Compute annual PAYE for a resident employee.
 * @param gross        annual gross emoluments (₦)
 * @param deductions   annual statutory deductions (pension, NHIS) already netted
 * @param extraRelief  any additional approved relief (₦), default 0
 */
export function computePaye(gross: number, deductions = 0, extraRelief = 0) {
  const cra = consolidatedRelief(gross);
  const chargeable = Math.max(0, gross - cra - deductions - extraRelief);
  let tax = 0;
  const applied: { band: string; amount: number; rate: number }[] = [];
  for (const band of PIT_BANDS) {
    const lower = band.from;
    const upper = band.to === Infinity ? chargeable : Math.min(band.to, chargeable);
    if (chargeable <= lower) break;
    const taxableInBand = Math.max(0, upper - lower);
    const bandTax = taxableInBand * band.rate;
    tax += bandTax;
    applied.push({ band: `${fmtNaira(lower)}–${band.to === Infinity ? '+' : fmtNaira(band.to)}`, amount: bandTax, rate: band.rate });
  }
  return {
    gross,
    cra,
    deductions,
    extraRelief,
    chargeable,
    annualPaye: tax,
    monthlyPaye: tax / 12,
    effectiveRate: gross > 0 ? tax / gross : 0,
    appliedBands: applied,
  };
}

// ---------------------------------------------------------------------------
// VAT
// ---------------------------------------------------------------------------
export const VAT_RATE = 0.075;
export const VAT_DEADLINE = '21st of the following month';

export interface VatInput {
  /** Taxable sales *before* VAT (net). */
  netSales?: number;
  /** Taxable sales *including* VAT (gross). Exactly one of netSales/grossSales. */
  grossSales?: number;
  /** Total input VAT claimed (deductible) for the period. */
  inputVat?: number;
}

export function computeVat(input: VatInput) {
  const net = input.netSales ?? (input.grossSales != null ? input.grossSales / (1 + VAT_RATE) : 0);
  const outputVat = net * VAT_RATE;
  const inputVat = input.inputVat ?? 0;
  const netVatPayable = Math.max(0, outputVat - inputVat);
  const refund = outputVat - inputVat < 0 ? inputVat - outputVat : 0;
  return {
    net,
    vatRate: VAT_RATE,
    outputVat,
    inputVat,
    netVatPayable,
    vatRefund: refund,
    filingDeadline: VAT_DEADLINE,
  };
}

// ---------------------------------------------------------------------------
// Withholding Tax — typical rates by payment type (demo reference)
// ---------------------------------------------------------------------------
export interface WhtRate {
  label: string;
  rate: number;
}

export const WHT_RATES: WhtRate[] = [
  { label: 'Goods / services (contract)', rate: 0.1 },
  { label: 'Professional fees', rate: 0.1 },
  { label: 'Dividends (Nigerian resident)', rate: 0.1 },
  { label: 'Interest on loans', rate: 0.15 },
  { label: 'Rent (residential)', rate: 0.1 },
  { label: 'Management fees / commissions', rate: 0.1 },
];

/** Deterministic WHT verdict for the invoice checker (F-20). */
export function computeWht(grossPayment: number, paymentType: string) {
  const match = WHT_RATES.find((r) => r.label.toLowerCase().includes(paymentType.toLowerCase()));
  const rate = match ? match.rate : 0.1;
  const witheld = grossPayment * rate;
  const netToVendor = grossPayment - witheld;
  return {
    grossPayment,
    paymentType: match?.label ?? paymentType,
    rate,
    witheld,
    netToVendor,
    remitBy: '21st of the following month',
    note: 'Issue a WHT credit note to the vendor so they can claim the credit.',
  };
}

// ---------------------------------------------------------------------------
// Formatting helper (₦ only, no $ anywhere — currency rule)
// ---------------------------------------------------------------------------
export function fmtNaira(n: number): string {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return `${sign}₦${abs.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}
