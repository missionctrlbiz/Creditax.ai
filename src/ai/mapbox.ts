/**
 * P14 — Mapbox geocoding (server-side).
 *
 * Geocodes a free-text address to real lat/lng via the Mapbox Geocoding API
 * (`MAPBOX_ACCESS_TOKEN`), and reverse-geocodes a lat/lng back to a human
 * address (for "near me"). When the token is absent or the request fails the
 * functions return null so callers fall back to the deterministic demo geo
 * and flag it `geo:demo` — Track A honesty (never present a demo origin as
 * a live geocode).
 *
 * The token is read from `process.env` only and is never logged. The Static
 * Maps token for the client (`NEXT_PUBLIC_MAPBOX_TOKEN`) is handled by the
 * marketplace page, not here.
 */

export interface MapboxGeoResult {
  lat: number;
  lng: number;
  /** Human-readable full address (reverse) or matched place name (forward). */
  label: string;
}

export type GeoSource = 'mapbox' | 'client' | 'demo';

/** True when a server-side geocoding token is configured. */
export function mapboxConfigured(): boolean {
  return !!process.env.MAPBOX_ACCESS_TOKEN;
}

function serverToken(): string | undefined {
  // Prefer the dedicated server key; NEXT_PUBLIC_ is for the browser and
  // should not be the one driving server calls.
  return process.env.MAPBOX_ACCESS_TOKEN;
}

async function get(url: string, token: string): Promise<Response> {
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
}

/** Forward-geocode a free-text address to a single best lat/lng match. */
export async function mapboxGeocode(address: string): Promise<MapboxGeoResult | null> {
  const token = serverToken();
  const q = address?.trim();
  if (!token || !q) return null;
  try {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}/.json` +
      `?types=place,address&limit=1&country=ng`;
    const res = await get(url, token);
    if (!res.ok) {
      console.warn(`[mapbox] geocode ${res.status}, falling back to demo geo`);
      return null;
    }
    const data = await res.json();
    const f = data?.features?.[0];
    if (!f?.geometry?.coordinates) return null;
    return {
      lng: Number(f.geometry.coordinates[0]),
      lat: Number(f.geometry.coordinates[1]),
      label: typeof f.place_name === 'string' ? f.place_name : q,
    };
  } catch (err) {
    console.warn('[mapbox] geocode unreachable, falling back to demo geo', err);
    return null;
  }
}

/** Reverse-geocode a lat/lng to a human address (used by "near me"). */
export async function mapboxReverseGeocode(
  lat: number,
  lng: number
): Promise<MapboxGeoResult | null> {
  const token = serverToken();
  if (!token || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  try {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/reverse/${lng},${lat}.json` +
      `?types=place,address&limit=1&country=ng`;
    const res = await get(url, token);
    if (!res.ok) {
      console.warn(`[mapbox] reverse-geocode ${res.status}, falling back to demo geo`);
      return null;
    }
    const data = await res.json();
    const f = data?.features?.[0];
    if (!f?.geometry?.coordinates) return null;
    return {
      lng: Number(f.geometry.coordinates[0]),
      lat: Number(f.geometry.coordinates[1]),
      label: typeof f.place_name === 'string' ? f.place_name : `${lat}, ${lng}`,
    };
  } catch (err) {
    console.warn('[mapbox] reverse-geocode unreachable, falling back to demo geo', err);
    return null;
  }
}
