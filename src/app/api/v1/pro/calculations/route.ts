import { NextResponse, type NextRequest } from 'next/server';
import { runBulkCalc } from '@/ai/pro-portal';

/**
 * P9 — POST /api/v1/pro/calculations
 *   Body: { proId?, types?: ('VAT'|'PAYE'|'WHT'|'CIT')[] }
 * Runs a deterministic bulk-calc batch over the pro client book and returns
 * the result rows + totals (demo_seed: true). calc credits are metered by the
 * P4 quota engine when the caller passes a userId (Track B swap-in point).
 */
export async function POST(req: NextRequest) {
  let body: { proId?: string; types?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const proId = body.proId ?? 'u-pro';
  const types = body.types?.length ? body.types : ['VAT', 'WHT', 'CIT', 'PAYE'];
  const result = runBulkCalc(proId, types as never);
  return NextResponse.json(result);
}

export const dynamic = 'force-dynamic';
