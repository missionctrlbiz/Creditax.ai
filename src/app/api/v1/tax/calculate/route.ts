import { NextResponse, type NextRequest } from 'next/server';
import {
  computePaye,
  computeVat,
  computeWht,
  fmtNaira,
  type VatInput,
} from '@/ai/tax-rules';
import { guard } from '@/lib/rate-limit';
import { meter } from '@/ai/quota';

type CalcBody = {
  kind: 'paye' | 'vat' | 'wht';
  gross?: number;
  deductions?: number;
  extraRelief?: number;
  netSales?: number;
  grossSales?: number;
  inputVat?: number;
  paymentType?: string;
  /** P19: meter the calc against the caller's quota (pricing §6 — server-side). */
  userId?: string;
};

/**
 * POST /api/v1/tax/calculate — deterministic, Naira-only tax figures.
 *
 * - kind: 'paye' → { gross, deductions, extraRelief }
 * - kind: 'vat'  → VatInput { netSales | grossSales, inputVat }
 * - kind: 'wht'  → { gross (payment amount), paymentType }
 *
 * Every response is tagged `demo_seed: true` and `reference` with the NTA/NTAA
 * section it traces to — the "answers you can defend" posture.
 */
export async function POST(req: NextRequest) {
  // core-api "rate-limit" closure: 100 req/min per key (in-memory window).
  const limited = guard(req);
  if (limited) return limited;

  let body: CalcBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.kind) {
    return NextResponse.json({ error: '`kind` must be one of paye|vat|wht' }, { status: 400 });
  }

  // P19: tax-calc was previously unmetered (only chat enforced). Meter 2
  // credits per calc when a user is present; anonymous demo calls stay free.
  if (body.userId) {
    const gate = meter(body.userId, 'tax-calc');
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: gate.reason,
          blocked: true,
          upgrade: gate.status.upgradeHint,
          status: gate.status,
          demo_seed: true,
        },
        { status: 403, headers: { 'X-Creditax-Quota': gate.reason ?? 'limit' } }
      );
    }
  }

  switch (body.kind) {
    case 'paye': {
      const gross = Number(body.gross ?? 0);
      if (!gross || gross < 0) {
        return NextResponse.json({ error: '`gross` must be a positive Naira amount' }, { status: 400 });
      }
      const r = computePaye(gross, Number(body.deductions ?? 0), Number(body.extraRelief ?? 0));
      return NextResponse.json({
        kind: 'paye',
        ...r,
        human: {
          gross: fmtNaira(r.gross),
          cra: fmtNaira(r.cra),
          chargeable: fmtNaira(r.chargeable),
          annual: fmtNaira(r.annualPaye),
          monthly: fmtNaira(r.monthlyPaye),
          effectiveRate: `${(r.effectiveRate * 100).toFixed(1)}%`,
        },
        reference: ['NTA 2023 — PIT graduated bands', 'FIRS PAYE Guide'],
        demo_seed: true,
      });
    }
    case 'vat': {
      const input: VatInput = {
        netSales: body.netSales != null ? Number(body.netSales) : undefined,
        grossSales: body.grossSales != null ? Number(body.grossSales) : undefined,
        inputVat: body.inputVat != null ? Number(body.inputVat) : undefined,
      };
      if (input.netSales == null && input.grossSales == null) {
        return NextResponse.json(
          { error: 'Provide `netSales` (before VAT) or `grossSales` (incl. VAT)' },
          { status: 400 }
        );
      }
      const r = computeVat(input);
      return NextResponse.json({
        kind: 'vat',
        ...r,
        human: {
          net: fmtNaira(r.net),
          outputVat: fmtNaira(r.outputVat),
          inputVat: fmtNaira(r.inputVat),
          payable: fmtNaira(r.netVatPayable),
          refund: fmtNaira(r.vatRefund),
          deadline: r.filingDeadline,
        },
        reference: ['FIRS VAT Guide — 7.5% standard rate', 'VAT Act (as amended)'],
        demo_seed: true,
      });
    }
    case 'wht': {
      const gross = Number(body.gross ?? 0);
      if (!gross || gross < 0) {
        return NextResponse.json({ error: '`gross` must be a positive Naira amount' }, { status: 400 });
      }
      const r = computeWht(gross, body.paymentType ?? 'services');
      return NextResponse.json({
        kind: 'wht',
        ...r,
        human: {
          gross: fmtNaira(r.grossPayment),
          withheld: fmtNaira(r.witheld),
          netToVendor: fmtNaira(r.netToVendor),
          rate: `${Math.round(r.rate * 100)}%`,
          remitBy: r.remitBy,
        },
        reference: ['FIRS WHT Circulars', 'NTAA 2023 — WHT remittance'],
        demo_seed: true,
      });
    }
    default:
      return NextResponse.json({ error: 'Unknown kind' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
