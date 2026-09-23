import { NextResponse, type NextRequest } from 'next/server';
import { getProDashboard } from '@/ai/pro-portal';

/**
 * P9 — GET /api/v1/pro/dashboard?proId=u-pro
 * Live stats + deadlines + activities + recent clients for the pro book
 * (seeded, demo_seed: true). Powers /pro/dashboard hydration.
 */
export async function GET(req: NextRequest) {
  const proId = req.nextUrl.searchParams.get('proId') ?? 'u-pro';
  return NextResponse.json(getProDashboard(proId));
}

export const dynamic = 'force-dynamic';
