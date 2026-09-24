# CREDITAX KEY MAP (authoritative key → usage)

Generated 2026-09-24. This is the reference the P16 key-sweep phase audits against.
**Rules:** real values live in `.env` (gitignored — NEVER commit). Only `.env.example` (key names + placeholders) is tracked. Mask values in all logs, STATE, changelog, and code comments.

| Key | Phase that wires it | Target file(s) / usage | Status |
|-----|--------------------|------------------------|--------|
| `LITELLM_API_KEY`, `LITELLM_BASE_URL`, `LITELLM_MODEL` | P13 | **Canonical primary LLM** — `src/ai/rag/llm.ts` LITELLM leg first in `llmEndpoints()` (OpenAI-compatible `chat/completions`). Live 200 verified with model `agnes/agnes-3.0-flash`. | wired |
| `KIMCHI_API_KEY`, `KIMCHI_BASE_URL`, `KIMCHI_MODEL` | P13 | `src/ai/rag/llm.ts` **legacy second leg** (after LITELLM). Reconciled: LITELLM is canonical, KIMCHI kept as a fallback, not removed. Model resolver: `LITELLM_MODEL → KIMCHI_MODEL → minimax-m2.7` (live LITELLM_MODEL empty, KIMCHI_MODEL=agnes/agnes-3.0-flash is what the host actually serves). | wired (legacy leg) |
| `OPENROUTER_API_KEY`, `OPENROUTER_EMBED_MODEL` | P13 | `src/ai/rag/embeddings.ts` OpenRouter leg (cascade head). Live 768→**2048-dim** returned by the free nemotron model; runtime tracks actual width via `PROVIDER_DIMS`/`dimension` + sticky lock. | wired |
| `HF_API_KEY`, `HF_EMBED_MODEL` | P13 | Hugging Face embedding leg added to the `embeddings.ts` cascade (OpenRouter → **HF** → Vertex → local-hash). Live HF_INFER endpoint + all-MiniLM-L6-v2 (384-dim). | wired |
| `VERTEX_AI_PROJECT_ID`, `VERTEX_AI_REGION`, `GOOGLE_APPLICATION_CREDENTIALS_PATH` | P13/P16 | Vertex embeddings leg **implemented** in `embeddings.ts` (REST `:predict` + SA JWT→OAuth). In the current .env all three are empty → the leg is present but skipped at runtime (unused-track-B until a service-account JSON lands). | wired (unused-track-B while creds empty) |
| `NEXT_PUBLIC_MAPBOX_TOKEN`, `MAPBOX_ACCESS_TOKEN` | P14 | `src/ai/mapbox.ts` (server `MAPBOX_ACCESS_TOKEN` → `mapboxGeocode`/`mapboxReverseGeocode`); `src/app/api/v1/marketplace/{reverse,pros,search}` routes; `src/app/[locale]/marketplace/page.tsx` client map (static raster + real-coord pins + `NEXT_PUBLIC_MAPBOX_TOKEN` overlay, browser geolocation → reverse-geocode "near me"). Falls back to demo haversine + PNG, flagged `geo_source:'demo'`, when the token is absent/401/unauthorized. | wired |
| `MONO_API_KEY`, `MONO_BASE_URL`, `MONO_ENVIRONMENT=sandbox` | P15 | **SANDBOX-ONLY** Mono client in `src/ai/mono.ts` (`monoEnabled()` is true only when a key is present AND `MONO_ENVIRONMENT==='sandbox'` — a non-sandbox value makes every call fail closed to null). Wired into `credit-scoring.ts` (`monoSandboxCreditScore(kv,kvn)`, income-side from Mono analyzed flows, `data_source:'mono-sandbox'`, `demo_seed` stays true) and `GET /api/v1/credit/score?kv=&kvn=` (falls back to the demo seed when Mono is unreachable). No production call is possible. | wired (sandbox) |
| `FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_SECRET_KEY` | P15 | Canonical PSP (NG MVP). Test-mode charge path in `src/ai/payments.ts` (`sandboxCharge` → prepared test transaction, `charged:false` always; a real authorization needs an interactive customer session = Track B). No production charge possible. **Keys empty in the live .env** → the resolver reports `provider:'none'` and the P4 upgrade stays mocked (unused-track-B). | wired (test-mode, keys empty) |
| `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` | P15/P16 | Alternate PSP, tested via the same `payments.ts` test-only resolver (second choice after Flutterwave). **Keys empty in the live .env** → unused-track-B until keys land. | wired (test-mode, keys empty) |
| `BACKBLAZE_B2_KEY_ID`, `_APPLICATION_KEY`, `_BUCKET` | P16 | File/document upload storage (S3-compatible). Wire into document/report storage in `src/ai/documents.ts` when uploads go live. | pending |
| `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET` | P16 | Image CDN for marketplace avatars, KB images, generated imagery. | pending |
| `TRIGGER_PROJECT_KEY` | P16 | Trigger.dev background jobs (async doc processing, report gen, credit refresh, webhook delivery, RAG re-index). | pending |
| `RESEND_API_KEY` | P16 | Email delivery (transactional: receipts, notification emails). | pending |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` | P16 | SMS delivery (BVN/verification, comms). | pending |
| `POCKETBASE_URL`, `POCKETBASE_SUPERUSER_EMAIL/_PASSWORD` | P7 (done) | Live auth + collections (replacing localStorage mock). Kept as the demo data spine. | wired |
| `AUTH_SESSION_SECRET` | P7 (done) | Session signing. | wired |
| `CREDITAX_API_KEY`, `RATE_LIMIT_PER_MINUTE` | P4/core-api | API key base + rate limit constant. | wired |
| `VERTEX_AI_*`, `GOOGLE_APPLICATION_CREDENTIALS_PATH` | P16 | Vertex AI embeddings (Track B / optional cascade head). Triage if key present. | unused-track-B (if empty) |
| `JUMO_API_KEY`, `JUMO_BASE_URL` | P15/P16 | Jumo credit scoring (partnership, Track B). Not in current .env — leave unused-track-B until provided. | unused-track-B |

## P16 acceptance
Every key above must end in one of: **wired** (in the target file), **sandboxed** (Mono/Paystack/Flutterwave, sandbox-guarded), or **unused-track-B** (documented reason). The sweep updates this table's Status column and records the decision in the session log. No value from `.env` may appear in any committed file.
