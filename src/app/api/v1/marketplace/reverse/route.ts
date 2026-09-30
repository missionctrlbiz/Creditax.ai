import { NextResponse, type NextRequest } from 'next/server';
import { nearMeLabel } from '@/ai/marketplace';

/**
 * GET /api/v1/marketplace/reverse?lat=&lng= — P14 "near me" reverse geocode.
 *
 * Turns the caller's lat/lng (typically browser geolocation) into a human
 * address via the Mapbox Geocoding API when the server token is present.
 * Returns `{ label, lat, lng, geo_source, demo_seed }` where `geo_source` is
 * `mapbox` on a live hit and `demo` when the token is absent or the request
 * failed — the caller renders the honest fallback in that case.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get('lat') ?? NaN);
  const lng = Number(searchParams.get('lng') ?? NaN);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: '`lat` and `lng` must be numbers' }, { status: 400 });
  }

  const label = await nearMeLabel(lat, lng);
  const geo_source = label ? ('mapbox' as const) : ('demo' as const);
  return NextResponse.json({
    label: label ?? `${lat.toFixed(4)}, ${lng.toFixed(4)} (demo origin)`,
    lat,
    lng,
    geo_source,
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
