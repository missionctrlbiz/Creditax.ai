import { NextResponse, type NextRequest } from 'next/server';
import { createReport, listReports } from '@/ai/documents';
import { guard } from '@/lib/rate-limit';
import { meter } from '@/ai/quota';

/**
 * POST /api/v1/reports — request a report (async shape).
 *
 * Body: { userId?: string, docIds?: string[], type?: 'tax_calculation' | 'credit_report' | 'receipt_analysis' }
 *
 * Track A computes synchronously and returns status 'completed' with a demo
 * download link; Track B returns 'processing' and a worker flips it. The
 * client polls GET /api/v1/reports/:id either way. P19: report generation is
 * metered server-side (2 credits, reports cap/day) when a userId is present.
 */
export async function POST(req: NextRequest) {
  const limited = guard(req);
  if (limited) return limited;

  let body: { userId?: string; docIds?: string[]; type?: 'tax_calculation' | 'credit_report' | 'receipt_analysis' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (body.userId) {
    const gate = meter(body.userId, 'report');
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
  const report = await createReport(body);
  return NextResponse.json({ report, poll: `/api/v1/reports/${report.id}`, demo_seed: report.demo_seed });
}

/**
 * GET /api/v1/reports?userId=demo — P19: report history was written but
 * never retrievable (listReports existed with no route). The reports board
 * now hydrates from this.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') ?? 'demo';
  const reports = listReports(userId);
  return NextResponse.json({ userId, reports, demo_seed: true });
}

export const dynamic = 'force-dynamic';
