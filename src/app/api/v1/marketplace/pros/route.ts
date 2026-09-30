import { NextResponse, type NextRequest } from 'next/server';
import { listPros } from '@/ai/marketplace';

/**
 * GET /api/v1/marketplace/pros — P14 pro listing with real lat/lng.
 *
 * Returns the seeded professional book (each record carries a real
 * `location.{lat,lng}`) so the client map can place markers at true
 * coordinates instead of percentage offsets. `?verifiedOnly=true` narrows
 * the list. `demo_seed: true` throughout (Track A).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
  const pros = listPros().filter((p) => !verifiedOnly || p.verified);
  return NextResponse.json({
    pros: pros.map((p) => ({
      id: p.id,
      name: p.name,
      verified: p.verified,
      rating: p.rating,
      services: p.services,
      location: p.location,
    })),
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
