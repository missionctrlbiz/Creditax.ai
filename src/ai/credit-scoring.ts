/**
 * credit-scoring — deterministic credit score model (Track A).
 *
 * Score = f(income, income stability, savings rate, debt burden, tax compliance)
 * Range: 300–850 (VantageScore-compatible, matching the existing UI's maxScore).
 *
 * Our differentiator (product-foundation §5): tax compliance is a first-class
 * factor. No competitor combines credit scoring with tax filing history.
 *
 * Track A honesty: the model is real math; the *inputs* are demo seed until
 * Mono's Connect/Income/Prove APIs wire in (Track B). Every output carries
 * `demo_seed: true` while the data source is the demo seed.
 */

// ---------------------------------------------------------------------------
// Inputs (what Mono Connect / Income / Prove would supply in Track B)
// ---------------------------------------------------------------------------

export interface CreditFactors {
  /** Monthly income (₦). From Mono Income analysis. */
  monthlyIncome: number;
  /** Months of consistent positive income. From Mono transaction velocity. */
  incomeStabilityMonths: number;
  /** 0–1: fraction of income that is consistently saved / not spent. */
  savingsRate: number;
  /** 0–1: monthly debt obligations / monthly income. */
  debtBurden: number;
  /** 0–1: tax compliance score (filing history, document consistency). */
  taxComplianceScore: number;
}

export interface ScoreFactor {
  label: string;
  points: number;
  max: number;
  percentage: number; // 0-100, for the UI's factor bars
}

export interface CreditScoreResult {
  score: number; // 300-850
  range: { min: number; max: number };
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  factors: ScoreFactor[];
  /** True when the inputs came from demo seed (not live Mono data). */
  demo_seed: boolean;
  data_source: 'mono' | 'demo_seed';
  computed_at: string;
}

// ---------------------------------------------------------------------------
// Model constants (tuned for the Nigerian market; see API-Research §2.3)
// ---------------------------------------------------------------------------

const SCORE_MIN = 300;
const SCORE_MAX = 850;

// Weight ceilings per factor.
const WEIGHTS = {
  income: 200, // ₦50k/mo → full +200
  stability: 150, // 12 months consistent → full +150
  savings: 100, // 20%+ savings → full +100
  debt: -100, // 50%+ debt burden → full -100
  tax: 150, // 100% compliant → full +150 (our differentiator)
} as const;

// ---------------------------------------------------------------------------
// Core scoring
// ---------------------------------------------------------------------------

export function computeCreditScore(factors: CreditFactors): Omit<CreditScoreResult, 'demo_seed' | 'data_source' | 'computed_at'> {
  const { monthlyIncome, incomeStabilityMonths, savingsRate, debtBurden, taxComplianceScore } = factors;

  // Income: linear up to ₦50k/mo (typical SME / salaried ceiling in the demo).
  const incomePts = Math.min(WEIGHTS.income, (monthlyIncome / 50_000) * WEIGHTS.income);

  // Stability: 12 months consistent = full points.
  const stabilityPts = Math.min(WEIGHTS.stability, (incomeStabilityMonths / 12) * WEIGHTS.stability);

  // Savings: 20% savings rate = full points.
  const savingsPts = Math.min(WEIGHTS.savings, (savingsRate / 0.2) * WEIGHTS.savings);

  // Debt: inverse — 0% debt = 0 penalty; 50%+ debt = full -100.
  const debtPts = -Math.min(Math.abs(WEIGHTS.debt), (debtBurden / 0.5) * Math.abs(WEIGHTS.debt));

  // Tax compliance: 100% = full +150. Our differentiator.
  const taxPts = Math.min(WEIGHTS.tax, taxComplianceScore * WEIGHTS.tax);

  const raw = SCORE_MIN + incomePts + stabilityPts + savingsPts + debtPts + taxPts;
  const score = Math.round(Math.max(SCORE_MIN, Math.min(SCORE_MAX, raw)));

  const grade =
    score >= 750 ? 'excellent' : score >= 650 ? 'good' : score >= 500 ? 'fair' : 'poor';

  const scaleScoreToPct = (pts: number, maxPts: number) =>
    Math.round((Math.max(0, pts) / Math.abs(maxPts)) * 100);

  const resultFactors: ScoreFactor[] = [
    { label: 'Income Level', points: Math.round(incomePts), max: WEIGHTS.income, percentage: scaleScoreToPct(incomePts, WEIGHTS.income) },
    { label: 'Income Stability', points: Math.round(stabilityPts), max: WEIGHTS.stability, percentage: scaleScoreToPct(stabilityPts, WEIGHTS.stability) },
    { label: 'Savings Pattern', points: Math.round(savingsPts), max: WEIGHTS.savings, percentage: scaleScoreToPct(savingsPts, WEIGHTS.savings) },
    { label: 'Debt Burden', points: Math.round(debtPts), max: WEIGHTS.debt, percentage: scaleScoreToPct(debtPts, WEIGHTS.debt) },
    { label: 'Tax Filing History', points: Math.round(taxPts), max: WEIGHTS.tax, percentage: scaleScoreToPct(taxPts, WEIGHTS.tax) },
  ];

  return { score, range: { min: SCORE_MIN, max: SCORE_MAX }, grade, factors: resultFactors };
}

// ---------------------------------------------------------------------------
// Demo seed factors (the "Emeka O." story from the existing dashboard)
// ---------------------------------------------------------------------------

export const DEMO_FACTORS: CreditFactors = {
  monthlyIncome: 450_000, // ₦450k/mo → 90% of income ceiling
  incomeStabilityMonths: 9, // 9/12 → 75% stability
  savingsRate: 0.11, // 11% → 55% of the 20% target
  debtBurden: 0.22, // 22% → light debt, small penalty
  taxComplianceScore: 0.85, // 85% (strong filing history)
};

export function demoCreditScore(): CreditScoreResult {
  return {
    ...computeCreditScore(DEMO_FACTORS),
    demo_seed: true,
    data_source: 'demo_seed',
    computed_at: new Date().toISOString(),
  };
}
