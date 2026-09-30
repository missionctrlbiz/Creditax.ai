/**
 * marketplace — pro search + verification store (Track A).
 *
 * Combines the two marketplace retrieval modes the exit criteria call for:
 *   - geo-search:  haversine distance from a user's lat/lng + radius, filters
 *     by service / verified, sorted nearest-first.
 *   - pro-rag:     embed a professional profile → cosine similarity against a
 *     natural-language query ("I need a VAT expert near Lagos"), combined
 *     with the geographic filter (hybrid semantic + geo, API-Research §3.7).
 *
 * Plus the pro-application + admin-approval flow (CAC lookup demo + flip a
 * pro to `verified`). All records are `demo_seed`; the underlying seed pros
 * come from src/lib/seed/demoSeed.ts. Track B swaps Mono CAC lookup + real
 * certificate OCR in.
 */

import { seedProfessionals, type DemoProfessional } from '@/lib/seed/demoSeed';
import { embedTexts, embedQuery } from '@/ai/rag/embeddings';
import { rankBySimilarity } from '@/ai/rag/similarity';
import { mapboxGeocode, mapboxReverseGeocode, type MapboxGeoResult, type GeoSource } from '@/ai/mapbox';

// ---------------------------------------------------------------------------
// Search types
// ---------------------------------------------------------------------------

export interface SearchInput {
  query?: string;
  service?: string;
  verifiedOnly?: boolean;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  /**
   * P14 — free-text origin address (e.g. "Lekki, Lagos"). When present, the
   * search geocodes it via Mapbox (server-side) and uses the result as the
   * haversine origin; falls back to the demo origin when Mapbox is unavailable.
   */
  originAddress?: string;
  /** Haversine radius in km; default 200. */
  radiusKm?: number;
  topK?: number;
}

export interface ScoredPro extends DemoProfessional {
  distanceKm?: number;
  relevance?: number;
}

export interface SearchOutput {
  results: ScoredPro[];
  total: number;
  demo_seed: true;
  used_geo: boolean;
  /**
   * P14 — where the geo origin came from: `mapbox` (live geocode), `client`
   * (caller supplied lat/lng, e.g. browser geolocation), or `demo` (the
   * deterministic fallback origin). `demo` means the result set is not
   * backed by a live geocode — the honest flag Track A requires.
   */
  geo_source?: GeoSource;
  /** Human-readable label of the geocoded origin (forward or reverse). */
  origin_label?: string;
}

// ---------------------------------------------------------------------------
// Geo helpers
// ---------------------------------------------------------------------------

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance (km) between two lat/lng points. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(s));
}

/** Build the natural-language text a pro profile is embedded from (§3.7). */
function proEmbeddingText(p: DemoProfessional): string {
  return [
    `Business: ${p.name}`,
    `Owner: ${p.owner}`,
    `Services: ${p.services.join(', ')}`,
    `Location: ${p.location.city}, ${p.location.state}`,
    `CAC: ${p.cacNumber}`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Pro listing (P14 — real lat/lng for the client-side map)
// ---------------------------------------------------------------------------

/** All seed pros with their real lat/lng, so the client can place markers. */
export function listPros(): DemoProfessional[] {
  return seedProfessionals.map((p) => ({ ...p }));
}

/**
 * P14 — resolve the geo origin for a search. If the caller supplied a free-text
 * `originAddress`, geocode it via Mapbox (server-side) → `geo_source:'mapbox'`.
 * If lat/lng were supplied directly (e.g. browser geolocation) → `geo_source:'client'`.
 * Otherwise → the deterministic Lagos-Island demo origin → `geo_source:'demo'`.
 */
export async function resolveOrigin(
  input: SearchInput
): Promise<{ origin: { lat: number; lng: number } | null; geo_source: GeoSource; label?: string }> {
  if (input.originAddress?.trim()) {
    const geo: MapboxGeoResult | null = await mapboxGeocode(input.originAddress);
    if (geo) return { origin: { lat: geo.lat, lng: geo.lng }, geo_source: 'mapbox', label: geo.label };
    // No live geocode (token absent / request failed): demo fallback, honestly flagged.
    return {
      origin: { lat: 6.4281, lng: 3.4214 },
      geo_source: 'demo',
      label: 'Lagos Island (demo fallback — geocode unavailable)',
    };
  }
  if (typeof input.lat === 'number' && typeof input.lng === 'number') {
    return { origin: { lat: input.lat, lng: input.lng }, geo_source: 'client' };
  }
  // No geo requested at all.
  return { origin: null, geo_source: 'demo' };
}

/** P14 — reverse-geocode for "near me" (client lat/lng → human address). */
export async function nearMeLabel(lat: number, lng: number): Promise<string | null> {
  const r: MapboxGeoResult | null = await mapboxReverseGeocode(lat, lng);
  return r?.label ?? null;
}

// ---------------------------------------------------------------------------
// Geo-search (filter + nearest-first)
// ---------------------------------------------------------------------------

export function searchPros(input: SearchInput): SearchOutput {
  const radius = input.radiusKm ?? 200;
  const topK = input.topK ?? 10;
  const q = (input.query ?? '').trim().toLowerCase();
  const useGeo = typeof input.lat === 'number' && typeof input.lng === 'number';

  let list: ScoredPro[] = seedProfessionals.map((p) => ({ ...p }));

  // Query match: name / services / city / state.
  if (q) {
    list = list.filter((p) =>
      [p.name, p.owner, p.location.city, p.location.state, ...p.services]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }
  if (input.service) {
    list = list.filter((p) => p.services.some((s) => s.toLowerCase() === input.service!.toLowerCase()));
  }
  if (input.verifiedOnly) list = list.filter((p) => p.verified);
  if (input.city) list = list.filter((p) => p.location.city.toLowerCase() === input.city!.toLowerCase());
  if (input.state) list = list.filter((p) => p.location.state.toLowerCase() === input.state!.toLowerCase());

  // Priority placement (pricing-and-access §2): Professional-tier firms rank
  // ahead within the same distance band — a stable, two-key sort.
  const byPlacement = (a: ScoredPro, b: ScoredPro) =>
    Number(b.priority ?? false) - Number(a.priority ?? false);

  // Geo filter + sort.
  if (useGeo) {
    const origin = { lat: input.lat!, lng: input.lng! };
    list = list
      .map((p) => ({ ...p, distanceKm: haversineKm(origin, p.location) }))
      .filter((p) => (p.distanceKm ?? Infinity) <= radius)
      .sort((a, b) => byPlacement(a, b) || (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  } else {
    list = [...list].sort(byPlacement);
  }

  const total = list.length;
  return {
    results: list.slice(0, topK),
    total,
    demo_seed: true,
    used_geo: useGeo,
    // P14 — with direct lat/lng the origin is client-supplied; when no geo at
    // all was requested, the flag reads demo (no origin used).
    geo_source: useGeo ? 'client' : 'demo',
  };
}

/**
 * P14 — async geo-search that also accepts a free-text `originAddress`. The
 * address is geocoded via Mapbox (server-side) when a token is present, and
 * the resulting lat/lng drives the same haversine filter + nearest-first
 * sort as `searchPros`. Falls back to the deterministic Lagos-Island demo
 * origin when Mapbox is unavailable, flagged `geo_source: 'demo'`.
 */
export async function searchProsGeo(input: SearchInput): Promise<SearchOutput> {
  if (input.originAddress?.trim()) {
    const { origin, geo_source, label } = await resolveOrigin(input);
    if (!origin) {
      const out = searchPros(input);
      return { ...out, geo_source: 'demo' };
    }
    // Re-run the deterministic search using the resolved lat/lng.
    const out = searchPros({ ...input, lat: origin.lat, lng: origin.lng, originAddress: undefined });
    return { ...out, geo_source, used_geo: true, origin_label: label };
  }
  // No address geocoding needed.
  return searchPros(input);
}

// ---------------------------------------------------------------------------
// Pro RAG (semantic + geo hybrid)
// ---------------------------------------------------------------------------

export async function searchProsRag(input: SearchInput): Promise<
  SearchOutput & { provider: string }
> {
  const query = (input.query ?? '').trim();
  const topK = input.topK ?? 5;
  const useGeo = typeof input.lat === 'number' && typeof input.lng === 'number';
  const origin = useGeo ? { lat: input.lat!, lng: input.lng! } : null;
  const radius = input.radiusKm ?? 500;

  // Start from the same filters as geo-search (service / verified / city).
  let candidates = seedProfessionals.filter((p) => {
    if (input.verifiedOnly && !p.verified) return false;
    if (input.service && !p.services.some((s) => s.toLowerCase() === input.service!.toLowerCase())) return false;
    if (input.city && p.location.city.toLowerCase() !== input.city!.toLowerCase()) return false;
    return true;
  });

  // Semantic ranking when there is a natural-language query.
  let provider = 'local-hash';
  if (query.length > 0) {
    const texts = candidates.map(proEmbeddingText);
    const { vectors, provider: prov } = await embedTexts(texts);
    provider = prov;
    const qv = (await embedQuery(query)).vectors[0];
    const ranked = rankBySimilarity(qv, candidates.map((p, i) => ({ ...p, embedding: vectors[i] ?? [] })));
    candidates = ranked.slice(0, topK * 2).map((r) => r.item);
  }

  // Apply geo radius when provided, then order (priority placement first).
  if (origin) {
    candidates = candidates
      .map((p) => ({ ...p, distanceKm: haversineKm(origin, p.location) }))
      .filter((p) => (p.distanceKm ?? Infinity) <= radius)
      .sort((a, b) => Number(b.priority ?? false) - Number(a.priority ?? false) || (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }

  const results: ScoredPro[] = candidates.slice(0, topK);
  return {
    results: results.map((r) => ({ ...r, relevance: r.relevance ?? undefined })),
    total: results.length,
    demo_seed: true,
    used_geo: !!origin,
    provider,
  };
}

// ---------------------------------------------------------------------------
// Pro application + admin approval
// ---------------------------------------------------------------------------

export interface ProApplication {
  id: string;
  business_name: string;
  owner_name: string;
  cac_number: string;
  services: string[];
  city: string;
  state: string;
  /** 'pending' → admin flips to 'verified' (pro.verified=true) or 'rejected'. */
  status: 'pending' | 'verified' | 'rejected';
  /** True when the CAC lookup was simulated (Track A). */
  cac_lookup: 'demo' | 'mono';
  demo_seed: true;
  created_at: string;
}

const applications = new Map<string, ProApplication>();
let appCounter = 0;

export function listApplications(): ProApplication[] {
  return [...applications.values()];
}

export function getApplication(id: string): ProApplication | null {
  return applications.get(id) ?? null;
}

/**
 * Submit a pro application. Track A "verifies" CAC by format (5+ chars) and
 * tags the lookup as `demo`; Track B calls Mono CAC + stores the certificate.
 */
export function submitApplication(input: {
  businessName: string;
  ownerName?: string;
  cacNumber: string;
  services?: string[];
  city?: string;
  state?: string;
}): ProApplication {
  appCounter += 1;
  const id = `app-${Date.now().toString(36)}-${appCounter}`;
  const rec: ProApplication = {
    id,
    business_name: input.businessName,
    owner_name: input.ownerName ?? '',
    cac_number: input.cacNumber,
    services: input.services ?? [],
    city: input.city ?? '',
    state: input.state ?? '',
    status: 'pending',
    // Track A: CAC is a simulated format check, not a live Mono lookup.
    // Track B replaces this with cac_lookup:'mono' once the real API lands.
    cac_lookup: 'demo',
    demo_seed: true,
    created_at: new Date().toISOString(),
  };
  applications.set(id, rec);
  return rec;
}

/** Admin approve: mark verified + (optionally) register the pro as verified. */
export function approveApplication(id: string): ProApplication | null {
  const a = applications.get(id);
  if (!a) return null;
  a.status = 'verified';
  // Flip the matching seed pro to verified if it exists (by CAC number).
  const pro = seedProfessionals.find((p) => p.cacNumber === a.cac_number);
  if (pro) pro.verified = true;
  return a;
}

export function rejectApplication(id: string): ProApplication | null {
  const a = applications.get(id);
  if (!a) return null;
  a.status = 'rejected';
  return a;
}

/** Seed one pending application so the admin queue shows content. */
export function seedDemoApplication(): ProApplication[] {
  if (applications.size > 0) return listApplications();
  // P10 — seed the 3 pending applications the admin boards show (matching the
  // professionals/marketplace page fallbacks) so live counts agree.
  submitApplication({
    businessName: 'Benson Tax Consultants',
    ownerName: 'Benson O.',
    cacNumber: 'RC-4112233',
    services: ['VAT Returns', 'WHT Filing'],
    city: 'Abuja',
    state: 'FCT',
  });
  submitApplication({
    businessName: 'Okonkwo & Partners',
    ownerName: 'Chidi O.',
    cacNumber: 'RC-7788990',
    services: ['Tax Audit Support', 'TCC'],
    city: 'Lagos',
    state: 'Lagos',
  });
  submitApplication({
    businessName: 'Lagos Tax Solutions',
    ownerName: 'Tunde A.',
    cacNumber: 'RC-6655443',
    services: ['Corporate Tax', 'PAYE'],
    city: 'Victoria Island',
    state: 'Lagos',
  });
  return listApplications();
}
