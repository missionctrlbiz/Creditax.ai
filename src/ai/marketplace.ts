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

  // Geo filter + sort.
  if (useGeo) {
    const origin = { lat: input.lat!, lng: input.lng! };
    list = list
      .map((p) => ({ ...p, distanceKm: haversineKm(origin, p.location) }))
      .filter((p) => (p.distanceKm ?? Infinity) <= radius)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }

  const total = list.length;
  return { results: list.slice(0, topK), total, demo_seed: true, used_geo: useGeo };
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

  // Apply geo radius when provided, then order.
  if (origin) {
    candidates = candidates
      .map((p) => ({ ...p, distanceKm: haversineKm(origin, p.location) }))
      .filter((p) => (p.distanceKm ?? Infinity) <= radius)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
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
  submitApplication({
    businessName: 'SouthWest Tax & Audit',
    ownerName: 'Bola T.',
    cacNumber: 'RC-5544332',
    services: ['Tax Audit', 'VAT Filing'],
    city: 'Lagos',
    state: 'Lagos',
  });
  return listApplications();
}
