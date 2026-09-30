import { NextResponse } from 'next/server';
import { getReport } from '@/ai/documents';

/**
 * GET /api/v1/reports/:id — poll a report's status (async contract).
 *
 * Returns the report (status 'processing' | 'completed', demo download link,
 * totals). 404 when unknown. This is the polling endpoint that lets the UI
 * render "generating…" → "download PDF" without a webhook.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = getReport(id);
  if (!report) {
    return NextResponse.json({ error: `Report "${id}" not found` }, { status: 404 });
  }
  return NextResponse.json({ report, demo_seed: report.demo_seed });
}

export const dynamic = 'force-dynamic';
