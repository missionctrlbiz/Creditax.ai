import { NextResponse, type NextRequest } from 'next/server';
import { searchProsRag, searchProsGeo, type SearchInput } from '@/ai/marketplace';

/**
 * POST /api/v1/marketplace/search — geo + semantic pro search.
 *
 * Body: { query?, service?, verifiedOnly?, city?, state?, lat?, lng?,
 *         originAddress?, radiusKm?, topK?, rag?: boolean }
 *
 * - rag: false (default) → deterministic geo-search (haversine + filters).
 *   P14: an `originAddress` (free text) is geocoded via Mapbox when a server
 *   token is present; otherwise the deterministic Lagos-Island demo origin is
 *   used and `geo_source: 'demo'` is returned (honest Track A flag).
 * - rag: true            → hybrid semantic + geo (embeds profiles, cosine rank,
 *                          then geo radius), returning the embedding provider.
 *
 * Every result over the seeded pros is `demo_seed: true`.
 */
export async function POST(req: NextRequest) {
  let body: SearchInput & { rag?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.rag) {
    const out = await searchProsRag(body);
    return NextResponse.json(out);
  }

  // P14 — deterministic geo-search, with optional Mapbox address geocoding.
  const out = await searchProsGeo(body);
  return NextResponse.json(out);
}

export const dynamic = 'force-dynamic';
