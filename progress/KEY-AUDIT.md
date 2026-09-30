# P16 KEY AUDIT (2026-09-24)

Authoritative decision record for the key-sweep. 38 keys in `.env`; each ends
in **wired** (read in src/), **sandboxed** (test-mode only), **unused-track-B**
(documented reason), or **reserved** (documented, no consumer yet). Ground rule
from KEY-MAP: no value ever committed; this log references keys by name only.

## Wired (runtime consumer exists)
| Key | Consumer |
|-----|----------|
| `LITELLM_API_KEY/BASE_URL/MODEL` | `src/ai/rag/llm.ts` (primary LLM leg, P13) |
| `KIMCHI_API_KEY/BASE_URL/MODEL` | `src/ai/rag/llm.ts` (legacy second leg, P13) |
| `OPENROUTER_API_KEY` (+`OPENROUTER_EMBED_MODEL`) | `src/ai/rag/embeddings.ts` (cascade head, P13) |
| `HF_API_KEY` (+`HF_EMBED_MODEL`) | `src/ai/rag/embeddings.ts` (HF leg, P13) |
| `VERTEX_AI_PROJECT_ID/REGION` + `GOOGLE_APPLICATION_CREDENTIALS_PATH` | `src/ai/rag/embeddings.ts` Vertex leg (present; runtime-skipped while the service-account JSON is absent) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `src/app/[locale]/marketplace/page.tsx` static-raster overlay (P14) |
| `MAPBOX_ACCESS_TOKEN` | `src/ai/mapbox.ts` server geocode/reverse-geocode (P14) |
| `MONO_API_KEY` / `MONO_BASE_URL` / `MONO_ENVIRONMENT` | `src/ai/mono.ts` — **sandboxed** (guard blocks non-sandbox; host pinned) |
| `FLUTTERWAVE_*` / `PAYSTACK_*` | `src/ai/payments.ts` — **sandboxed** (test-mode resolver; keys empty in live .env → provider none) |
| `POCKETBASE_URL` + `NEXT_PUBLIC_POCKETBASE_URL` + `NEXT_PUBLIC_USE_POCKETBASE` | `src/lib/pb-features.ts` / `pocketbase.ts` / `pb-auth.ts` |
| `NEXT_PUBLIC_POCKETBASE_FALLBACK_URL` | P16: added to the PB URL chain (pb-features resolver, used by pocketbase/pb-auth) |
| `CREDITAX_API_KEY` | developer portal demo seed (`src/app/[locale]/developers/*`) |
| `RATE_LIMIT_PER_MINUTE` | P16: `src/lib/rate-limit.ts` now reads it (was a hardcoded 100 — false "wired" claim corrected) |
| `CREDITAX_ENV` | P16: surfaced on `GET /api/v1/status` (`environment` field) |

## Reserved (documented, no live consumer — intentional)
| Key | Why |
|-----|-----|
| `AUTH_SESSION_SECRET` | No cookie/JWT signer exists yet; P7/P12 unified auth spine (pb-auth + mock) doesn't read it. `.env.example` now says so (previously a false "wired" claim). Set when a signed-cookie session store lands (Track B). |
| `NEXT_PUBLIC_APP_URL` | No code reference; the base URL is Next's `NEXT_PUBLIC_APP_URL` convention but unconsumed today. Reserved for future absolute-URL rendering. |
| `POCKETBASE_SUPERUSER_EMAIL`, `POCKETBASE_SUPERUSER_PASSWORD` | For PocketBase superuser collection seeding from `scripts/`; not part of the auth flow, no script consumes them yet. |

## Unused-track-B (documented, deliberately not wired)
| Key | Reason |
|-----|--------|
| `BACKBLAZE_B2_KEY_ID`, `BACKBLAZE_B2_APPLICATION_KEY`, `BACKBLAZE_B2_BUCKET` | Document/report byte-storage. Document store is in-memory + PocketBase JSON (Track A); B2 uploads arrive in Track B. No `@aws-sdk`/B2 dep installed. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Marketplace/KB imagery served from static `public/images` now; Cloudinary is the Track B image CDN. No `cloudinary` dep. |
| `TRIGGER_PROJECT_KEY` (+`TRIGGER_DEPLOYMENT_ID/SECRET`) | Trigger.dev is NOT installed (no dep, no `trigger.config.ts`). Background jobs run in-request in Track A; jobs are the Track B upgrade. Documented in AGENTS.md. |
| `RESEND_API_KEY` | Notification delivery is the in-app bell + webhook stubs (Track A). Resend emails are Track B. No `resend` dep. |
| `TWILIO_ACCOUNT_SID/_AUTH_TOKEN` | SMS verification (BVN/comms) is Track B. No `twilio` dep. |
| `JUMO_API_KEY/_BASE_URL` | Jumo credit scoring is a partnership/Track B. Kept unused by design (see KEY-MAP). |
| `OPENAI_API_KEY` | Not used by the P13 cascade (OpenRouter→HF→Vertex→hash). Unused. |

## Verification
- `git grep` shows no key values in tracked files; `.env` is gitignored; `.env.example`
  holds placeholders + the public demo `CREDITAX_API_KEY`.
- Gates: `tsc --noEmit` exit 0; `eslint --max-warnings 0 src` exit 0.
