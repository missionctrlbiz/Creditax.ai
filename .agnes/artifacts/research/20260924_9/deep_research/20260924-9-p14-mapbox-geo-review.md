# P14 Mapbox Geo — Independent Review Gate

## Verdict

**PASS** — all three exit criteria of phase `p14-mapbox-geo` are satisfied by the actual code; tsc and lint gates are clean. Two non-blocking follow-ups are recorded.

## Summary

The phase wires `MAPBOX_ACCESS_TOKEN` (server) and `NEXT_PUBLIC_MAPBOX_TOKEN` (client) into marketplace geocoding and the map view's "near me". Server-side geocode/reverse live in `src/ai/mapbox.ts` and fail open (return `null`, never throw) so every caller degrades to the deterministic Lagos-Island demo origin flagged `geo_source:'demo'`. The search route is POST-only with a `rag` flag; the default path is the new `searchProsGeo`. The `/marketplace` page hydrates a live pro book with real lat/lng, overlays a Mapbox Static raster (with onLoad/onError guarding against a 401 leaving a broken image), projects pins from real coordinates, and runs "near me" through browser geolocation → Mapbox reverse geocode. No token value is committed anywhere in tracked files.

## Inputs reviewed

- `progress/STATE.json` (phase `p14-mapbox-geo`: status in_progress, 4 items still marked `todo`, 3 exit criteria) and `progress/KEY-MAP.md` line 13 (mapbox row, status `wired`).
- `src/ai/mapbox.ts` (full read)
- `src/ai/marketplace.ts` (full read)
- `src/app/api/v1/marketplace/search/route.ts`, `reverse/route.ts`, `pros/route.ts` (full reads)
- `src/app/[locale]/marketplace/page.tsx` (full read, 817 lines)
- `src/lib/seed/demoSeed.ts` (seed pros with real lat/lng)
- Key hygiene: `.gitignore`, `.env.example`, `git ls-files` / `git grep` audit, live 401 probe of the stored server token (value masked)
- Gates: `tsc --noEmit` and `eslint --max-warnings 0 src` via `/usr/local/bin/node`

## Key findings (criterion-by-criterion)

### EC1 — Marketplace search geocodes via Mapbox; demo fallback with flag: **PASS**

- `src/ai/mapbox.ts:47-71` — `mapboxGeocode` builds `https://api.mapbox.com/geocoding/v5/mapbox.places/{q}/.json?types=place,address&limit=1&country=ng` (L53-54), authenticates with `Authorization: Bearer ${token}` where the token comes only from `process.env.MAPBOX_ACCESS_TOKEN` (L27, L33, L40). On `!res.ok` it logs a warn and returns `null` (L56-58); on empty `features` returns `null` (L62); network errors are caught → `null` (L68-70). Missing token or empty input short-circuits to `null` (L50). It never throws.
- `src/ai/mapbox.ts:75-100` — `mapboxReverseGeocode` mirrors this for `.../reverse/{lng},{lat}.json` with the same `country=ng` filter, Bearer auth, and null-on-failure contract.
- `src/ai/marketplace.ts:39` — `SearchInput.originAddress` present.
- `src/ai/marketplace.ts:109-126` — `resolveOrigin()` returns `geo_source:'mapbox'` **only** when a live geocode succeeds (L114); on failure it returns the deterministic Lagos-Island origin `{6.4281, 3.4214}` with `geo_source:'demo'` and an explicit "demo fallback — geocode unavailable" label (L117-118). Caller-supplied lat/lng → `'client'` (L123); no geo requested → `origin: null` + `'demo'` (L126).
- `src/ai/marketplace.ts:189-202` — `searchProsGeo()` resolves the origin, then re-runs the deterministic haversine search with the resolved lat/lng (L199; haversine filter/sort at L167) and spreads `geo_source` + `origin_label` onto the output (L200). `SearchOutput` carries both fields (L61, L63).
- `src/app/api/v1/marketplace/search/route.ts:19-34` — exports only `POST`; `body.rag` routes to `searchProsRag` (L27-28), default path routes to `searchProsGeo` (L33).
- **Live evidence confirmed:** the stored `MAPBOX_ACCESS_TOKEN` (present, length 94, prefix `pk.` — value masked) returns **401 Unauthorized ("Not Authorized - No Token")** on the geocoding API today. That exercises exactly the code path the criterion describes: `!res.ok` → `null` → deterministic demo origin with `geo_source:'demo'`. The demo path is reachable and honest.

### EC2 — Map view markers at real lat/lng; "near me" → browser geolocation → Mapbox reverse: **PASS**

- `src/app/[locale]/marketplace/page.tsx:193-211` — `livePros` hydrated from `GET /api/v1/marketplace/pros?verifiedOnly=true`; the route (route.ts:12-26) returns `{pros: [{id, name, verified, rating, services, location:{lat,lng,...}}], demo_seed:true}` — exactly the shape the page consumes. Seed pros carry real coordinates (`src/lib/seed/demoSeed.ts`: Lekki 6.4485/3.4702, Ikoyi 6.5170/3.4700, Maitama 9.0763/7.3986, VI 6.4281/3.4214).
- `page.tsx:510-537` — static Lagos PNG base layer (`/images/marketplace/map-lagos.png`) with a Mapbox Static raster overlay built from the live pros' real coordinates (L249-264, `marker-symbol` pins + `access_token=NEXT_PUBLIC_MAPBOX_TOKEN`). The overlay renders only while `mapboxImgOk !== false` (L527) and flips state via `onLoad`/`onError` (L536-537), so a 401/invalid client token can never leave a broken image — the PNG shows through and the "demo" chip stays visible (L550).
- `page.tsx:222-247, 579-582` — pins are projected from real lat/lng through a padded bounding-box projection (`coordBox` + `projectPin`) when a live coordinate exists, with the display list's percentage pins as the offline fallback.
- `page.tsx:292-345` — `locateNearMe()`: `navigator.geolocation.getCurrentPosition` (8 s timeout) → `GET /api/v1/marketplace/reverse?lat=&lng=` (route.ts:13-29 returns `{label, lat, lng, geo_source:'mapbox'|'demo', demo_seed:true}` via `nearMeLabel` → `mapboxReverseGeocode`) → nearest verified pro search from that real origin via `POST /api/v1/marketplace/search`. Toasts are labeled **"(demo geo)"** whenever the origin is not live Mapbox (L339, L382; same labeling in the `showMapToast` fallback path, L362-382).
- `reverse/route.ts` validates lat/lng as finite numbers (400 otherwise), so malformed browser coords are rejected, not silently demoed.

### EC3 — Tokens from env only; nothing committed; lint 0: **PASS**

- `.env` is gitignored (`.gitignore:17-21`; `git check-ignore .env` confirms). `.env.example` (L76-77) holds placeholders only: `NEXT_PUBLIC_MAPBOX_TOKEN=pk.` / `MAPBOX_ACCESS_TOKEN=pk.` — no real values.
- Repo-wide audit: `git grep` over tracked files finds **no** `pk.eyJ` string. The only hits on disk are in untracked `.env` (correct — gitignored) and gitignored `.next` dev-cache/build artifacts (also gitignored, `git ls-files` shows 0 tracked `.next` files).
- Server code reads `process.env.MAPBOX_ACCESS_TOKEN` only (`src/ai/mapbox.ts:27,33`); the client reads `process.env.NEXT_PUBLIC_MAPBOX_TOKEN` only (`page.tsx:249`). Token values are never logged — warnings print status codes, not tokens.
- Gate runs (via `/usr/local/bin/node`, since the app's npx shims are broken): `tsc --noEmit` → **exit 0**; `eslint --max-warnings 0 src` → **exit 0**.

## Risks, gaps, or uncertainty

1. **Stored Mapbox token is currently invalid (401).** The live "mapbox" branch of every path has therefore only been exercised up to the failure boundary. The failure→demo behavior is correct and honest, but a positive live test (real geocode, real reverse label, live static raster) requires a valid token before launch. The 401 body "Not Authorized - No Token" suggests the key is missing/expired or scoped wrong.
2. **Hydration uses `verifiedOnly=true`**, so the unverified seed pro (p-4) never appears in `livePros`; its pin falls back to percentage placement. Cosmetic, consistent with the "Verified only" default filter, but worth a note when unverified pros are shown.
3. **STATE.json phase items still read `todo`** (`mapbox-geocode`, `marketplace-map-view`, `near-me-live`, `geo-demo_seed-fallback`) and `last_review` is null — the work exists in the tree but the phase record was not updated after authoring. The reviewer verdict below should be recorded there.
4. `searchPros` (the sync path) sets `geo_source` but not `origin_label`; only the async `searchProsGeo` path sets the label. Intentional (label is geocode-derived), but consumers of the sync API get no origin label.
5. Build was not part of this phase's exit criteria ("lint 0"); tsc+lint are green. Any Turbopack EPERM build caveat that affected earlier phases is out of scope here.

## Recommendations

- Record this verdict in `progress/STATE.json` (`p14-mapbox-geo.last_review`, flip the 4 items to `done`, status → `reviewed_pass`) and keep `KEY-MAP.md` as the authoritative map.
- Obtain/refresh a working Mapbox token, then run one live smoke test of forward geocode, reverse geocode, and the static-raster overlay so the `geo_source:'mapbox'` branch is proven end-to-end.
- Consider hydrating `livePros` without `verifiedOnly` (or accepting the fallback pin) if unverified pros should ever show on the map.

## Action items / next steps

1. [Runner] Update `progress/STATE.json` for p14: items done, `last_review` verdict pass, `last_updated` stamp.
2. [Owner] Fix `MAPBOX_ACCESS_TOKEN` (401 today); re-run the geocode probe to confirm a 200 + `features[0]`.
3. [Owner] Live-verify: address geocode ("Lekki, Lagos"), "near me" reverse label, and static-raster overlay with a real client token.
4. [Optional] Add an `origin_label` note to `searchPros` docs or keep it async-only; document the choice.

## Remaining items (non-blocking for this gate)

- STATE.json p14 record update (items → done, last_review)
- Valid Mapbox token + live positive-path smoke test
- Unverified-pro pin fallback note
