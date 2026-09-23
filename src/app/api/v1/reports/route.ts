import { NextResponse, type NextRequest } from 'next/server';
import { createReport } from '@/ai/documents';

/**
 * POST /api/v1/reports — request a report (async shape).
 *
 * Body: { userId?: string, docIds?: string[], type?: 'tax_calculation' | 'credit_report' | 'receipt_analysis' }
 *
 * Track A computes synchronously and returns status 'completed' with a demo
 * download link; Track B returns 'processing' and a worker flips it. The
 * client polls GET /api/v1/reports/:id either way.
 */
export async function POST(req: NextRequest) {
  let body: { userId?: string; docIds?: string[]; type?: 'tax_calculation' | 'credit_report' | 'receipt_analysis' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const report = await createReport(body);
  return NextResponse.json({ report, poll: `/api/v1/reports/${report.id}`, demo_seed: report.demo_seed });
}

export const dynamic = 'force-dynamic';
