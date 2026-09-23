# CREDITAX KEY MAP (authoritative key → usage)

Generated 2026-09-24. This is the reference the P16 key-sweep phase audits against.
**Rules:** real values live in `.env` (gitignored — NEVER commit). Only `.env.example` (key names + placeholders) is tracked. Mask values in all logs, STATE, changelog, and code comments.

| Key | Phase that wires it | Target file(s) / usage | Status |
|-----|--------------------|------------------------|--------|
| `LITELLM_API_KEY`, `LITELLM_BASE_URL`, `LITELLM_MODEL` | P13 | **Canonical primary LLM** per `.env.example` header ("LITELLM.dev primary, OpenAI-compatible, minimax-m2.7") + `research/API-Research`. NOT yet read by `src/ai/rag/llm.ts`. | pending |
| `KIMCHI_API_KEY`, `KIMCHI_BASE_URL`, `KIMCHI_MODEL` | P13 | `src/ai/rag/llm.ts` **currently reads KIMCHI_* vars** (primary → local-synthesizer). Diverges from canonical manifest (which lists LITELLM). **Reconcile in P13**: align code to the canonical LLM provider + keep whichever key the live `.env` actually has working; don't assume. | pending |
| `OPENROUTER_API_KEY`, `OPENROUTER_EMBED_MODEL` | P13 | `src/ai/rag/embeddings.ts` primary embedding provider (OpenRouter; cascade head per `.env.example`). Local-hash is last-resort fallback. | pending |
| `HF_API_KEY`, `HF_EMBED_MODEL` | P13 | Hugging Face embedding fallback in `src/ai/rag/embeddings.ts` cascade. **Not yet implemented** — committed code only wires openrouter + local-hash; P13 adds HF + Vertex legs. | pending |
| `VERTEX_AI_PROJECT_ID`, `VERTEX_AI_REGION`, `GOOGLE_APPLICATION_CREDENTIALS_PATH` | P13/P16 | Vertex embeddings = canonical cascade step (Vertex before local-hash, per `.env.example` comment "OpenRouter → HF → Vertex → local-hash"). Empty in current .env → treat as unused-track-B until a service-account JSON is added. | pending |
| `NEXT_PUBLIC_MAPBOX_TOKEN`, `MAPBOX_ACCESS_TOKEN` | P14 | `src/app/api/v1/marketplace/search/route.ts` geocoding + `/marketplace` map view + "near me". Server key (MAPBOX_ACCESS_TOKEN) for server-side geocode; NEXT_PUBLIC for client markers. Fall back to demo haversine when absent (flag `geo:demo`). | pending |
| `MONO_API_KEY`, `MONO_BASE_URL`, `MONO_ENVIRONMENT=sandbox` | P15 | credit data provider swap in `src/ai/credit-scoring.ts` (provider interface already shaped). Sandbox-only; `MONO_ENVIRONMENT` guard blocks non-sandbox. Result labeled `source:'mono-sandbox'`. | pending |
| `FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_SECRET_KEY` | P15 | **Canonical PSP for Nigerian-focused MVP** (research/API-Research.md: "Use Flutterwave for Nigerian-focused MVP"). Primary payments/charge sandbox path (mocked P4 billing becomes real-sandbox). No production charge in demo. | pending |
| `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` | P15/P16 | Alternate PSP (Paystack/Stripe, 1.5%+100₦ NG). Wire as secondary if Flutterwave keys are absent/empty; record choice in KEY-MAP. | pending |
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
