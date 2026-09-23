import { NextResponse, type NextRequest } from 'next/server';
import { getProVerification } from '@/ai/pro-portal';

/**
 * P9 — GET /api/v1/pro/verify?proId=u-pro
 * The pro's own CAC verification record + per-client check results
 * (seeded, demo_seed: true). The verify stepper page hydrates from this
 * instead of a hardcoded result. Track B = Mono CAC lookup + certificate OCR.
 */
export async function GET(req: NextRequest) {
  const proId = req.nextUrl.searchParams.get('proId') ?? 'u-pro';
  return NextResponse.json(getProVerification(proId));
}

export const dynamic = 'force-dynamic';
