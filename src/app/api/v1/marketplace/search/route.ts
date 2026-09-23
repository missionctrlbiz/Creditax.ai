import { NextResponse, type NextRequest } from 'next/server';
import { searchPros, searchProsRag, type SearchInput } from '@/ai/marketplace';

/**
 * POST /api/v1/marketplace/search — geo + semantic pro search.
 *
 * Body: { query?, service?, verifiedOnly?, city?, state?, lat?, lng?, radiusKm?, topK?, rag?: boolean }
 *
 * - rag: false (default) → deterministic geo-search (haversine + filters).
 * - rag: true            → hybrid semantic + geo (embeds profiles, cosine rank,
 *                          then geo radius), returning the embedding provider.
 *
 * Track A: over the seeded pros, `demo_seed: true`. Track B swaps in
 * Mapbox geocoding + Supabase PostGIS + live pro embeddings.
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
  const out = searchPros(body);
  return NextResponse.json(out);
}

export const dynamic = 'force-dynamic';
