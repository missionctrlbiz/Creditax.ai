# P16 Key-Sweep Independent Review Gate — Creditax.ai

## Verdict: **PASS**

All four exit criteria for phase `p16-key-sweep` were verified against the actual source. Both P16 "correction" claims (the two earlier false "wired" labels) were confirmed: `RATE_LIMIT_PER_MINUTE` is now genuinely read by code, and `AUTH_SESSION_SECRET` genuinely has zero consumers. No secret value is committed; both type and lint gates are green.

---

## 1. Summary

An independent subagent swept `/Users/oyinkansolaarchibong/Desktop/creditax-ai`, re-derived the full `.env` key inventory (38 names), cross-checked it against `progress/KEY-MAP.md` + `progress/KEY-AUDIT.md`, and verified each status by reading the code that actually reads each variable. The sweep finds:

- **Criterion 1** (every `.env` key in the map with status + exact files): **holds.** 38/38 key names match in the docs; zero missing. Both corrections are real: `RATE_LIMIT_PER_MINUTE` now comes from env (`src/lib/rate-limit.ts:25`); `AUTH_SESSION_SECRET` has **zero** code consumers and is correctly documented as `reserved` (not the earlier false "wired").
- **Criterion 2** (no fake wiring): **holds.** `grep` across `src/` finds **no** consumers of `BACKBLAZE_B2_*`, `CLOUDINARY_*`, `TRIGGER_*`, `RESEND_*`, `TWILIO_*` — consistent with the `unused-track-B` documentation (none of those SDKs are installed). Mapbox is genuinely wired (`src/ai/mapbox.ts` + the marketplace page + `reverse/pros/search` routes).
- **Criterion 3** (no secret committed; audit log; lint 0): **holds.** `.env` is gitignored (`.gitignore:17`) and untracked; only `.env.example` + `next-env.d.ts` are env-tracked. A `git grep` for every distinctive live-value fragment returns only the public demo `CREDITAX_API_KEY` placeholder. `tsc --noEmit` exit 0; `eslint --max-warnings 0 src` exit 0.
- **Criterion 4** (runbook + STATE notes record the final map): **holds.** `KEY-MAP.md`'s status column carries the final four-way triage (wired / sandboxed / reserved / unused-track-B), `KEY-AUDIT.md` is the per-key decision log, and `STATE.json`'s `env_keys_note` points at `KEY-MAP.md` as authoritative.

### Live probe confirmation (all three P16 wirings behave)
1. `configuredRpmLimit()` reads `RATE_LIMIT_PER_MINUTE` — `src/lib/rate-limit.ts:25` (`Number(process.env.RATE_LIMIT_PER_MINUTE)`, falls back to 100 when unset/invalid).
2. `GET /api/v1/status` surfaces `CREDITAX_ENV` as `environment` — `src/app/api/v1/status/route.ts:16` (`const environment = process.env.CREDITAX_ENV || 'demo'`), returned in the JSON body (`environment` field, line 22).
3. `pocketbaseUrl()` includes `NEXT_PUBLIC_POCKETBASE_FALLBACK_URL` in its chain — `src/lib/pb-features.ts:19` (`PB_URL` chain = `NEXT_PUBLIC_POCKETBASE_URL → POCKETBASE_URL → NEXT_PUBLIC_POCKETBASE_FALLBACK_URL → 'http://127.0.0.1:8090'`, exported via `pocketbaseUrl()`).

---

## 2. Inputs reviewed

| Input | Path | What was checked |
|-------|------|------------------|
| Phase state | `progress/STATE.json` | `p16-key-sweep` items/exit criteria; `env_keys_note` (38-key inventory + "authoritative map = KEY-MAP.md") |
| Key map | `progress/KEY-MAP.md` | Full key→usage table + status column (the triage of record) |
| Key audit | `progress/KEY-AUDIT.md` | Per-key decision log (Wired / Reserved / Unused-track-B sections) |
| Live env | `.env` | All 38 key **names** (values treated as secrets, never re-emitted except masked) |
| Template | `.env.example` | Placeholders + public demo key; the only env file tracked in git |
| Rate limiter | `src/lib/rate-limit.ts` | `configuredRpmLimit()` — verifies the P16 correction |
| Status route | `src/app/api/v1/status/route.ts` | `environment` field sourced from `CREDITAX_ENV` |
| PB resolver | `src/lib/pb-features.ts` | `pocketbaseUrl()` URL chain incl. fallback var |
| Mapbox | `src/ai/mapbox.ts`, `src/app/[locale]/marketplace/page.tsx`, `src/app/api/v1/marketplace/{reverse,pros,search}` | genuine geocode/reverse wiring |
| Mono / payments | `src/ai/mono.ts`, `src/ai/payments.ts` | sandbox-guard + test-mode resolver key reads |
| LLM / embeddings | `src/ai/rag/llm.ts`, `src/ai/rag/embeddings.ts` | LITELLM/KIMCHI + OpenRouter/HF/Vertex cascade key reads |
| Git | `.gitignore`, `git ls-files`, `git grep` | secret-hygiene verification |
| Gates | `tsc --noEmit`, `eslint --max-warnings 0 src` (via `/usr/local/bin/node`) | both exit 0 |

---

## 3. Key findings

### F1. All 38 `.env` key names are represented in the docs (criterion 1)
Whole-token grep of each `.env` key across `KEY-MAP.md` + `KEY-AUDIT.md` returned **0 missing**. The 38 keys: `AUTH_SESSION_SECRET`, `BACKBLAZE_B2_{KEY_ID,APPLICATION_KEY,BUCKET}`, `CLOUDINARY_{API_KEY,API_SECRET,CLOUD_NAME}`, `CREDITAX_API_KEY`, `CREDITAX_ENV`, `FLUTTERWAVE_{PUBLIC,SECRET}_KEY`, `HF_API_KEY`, `KIMCHI_{API_KEY,BASE_URL,MODEL}`, `LITELLM_{API_KEY,BASE_URL}` (in `.env`), `MAPBOX_ACCESS_TOKEN`, `MONO_{API_KEY,BASE_URL,ENVIRONMENT}`, `NEXT_PUBLIC_{APP_URL,MAPBOX_TOKEN,POCKETBASE_FALLBACK_URL,POCKETBASE_URL,USE_POCKETBASE}`, `OPENROUTER_{API_KEY,EMBED_MODEL}`, `PAYSTACK_{PUBLIC,SECRET}_KEY`, `POCKETBASE_{SUPERUSER_EMAIL,SUPERUSER_PASSWORD,URL}`, `RATE_LIMIT_PER_MINUTE`, `RESEND_API_KEY`, `TRIGGER_PROJECT_KEY`, `TWILIO_{ACCOUNT_SID,AUTH_TOKEN}`.

### F2. The two P16 "false-wired" corrections are genuine (criterion 1 sub-checks)
- **`RATE_LIMIT_PER_MINUTE` — corrected to wired:** `src/lib/rate-limit.ts:24-28` defines `configuredRpmLimit()` that reads `process.env.RATE_LIMIT_PER_MINUTE` and exposes `DEFAULT_RPM_LIMIT = configuredRpmLimit()` (with a 100 fallback when unset/invalid). Comment on lines 20-22 explicitly notes the P16 change ("was a hardcoded 100 — the constant now actually comes from the env manifest"). The limiter `admit()` defaults to this constant (line 51).
- **`AUTH_SESSION_SECRET` — corrected to reserved:** `grep -rn "AUTH_SESSION_SECRET" src/` returns **no matches** (exit 1), proving zero code consumers. Both `KEY-MAP.md` (status `reserved`) and `KEY-AUDIT.md` (Reserved section) document it as "no cookie/JWT signer exists yet; the P7/P12 pb-auth+mock spine does not read it" and set a Track-B follow-up. This directly refutes the earlier false "wired" label.

### F3. No fake wiring for Track-B services (criterion 2)
`grep -rn "BACKBLAZE_B2\|CLOUDINARY\|TRIGGER_PROJECT_KEY\|TRIGGER_DEPLOYMENT\|RESEND_API_KEY\|TWILIO_" src/` returns **no matches**. The documentation matches reality: no `@aws-sdk`, `cloudinary`, `trigger.dev`, `resend`, or `twilio` dependency is installed and there is no `trigger.config.ts`, so these keys have no code path — `KEY-MAP.md`/`KEY-AUDIT.md` label them `unused-track-B` **with reasons** rather than silently "wired." Document storage is in-memory + PocketBase JSON (Track A).

### F4. Mapbox is genuinely wired (criterion 2)
- `src/ai/mapbox.ts:27` (`return !!process.env.MAPBOX_ACCESS_TOKEN`) and `:33` (returns the token) guard `mapboxGeocode`/`mapboxReverseGeocode`; `null`-on-failure drives the demo `geo_source:'demo'` fallback.
- `src/app/[locale]/marketplace/page.tsx:251` reads `process.env.NEXT_PUBLIC_MAPBOX_TOKEN` for the client raster/overlay + "near me".
- Server routes `src/app/api/v1/marketplace/{reverse,pros,search}` exercise the geocode path.
- (P14 context: the live token 401s on Geocoding, so the *live-tested* branch is the honest demo path — recorded, not a code defect.)

### F5. No secret is committed; only the public demo key may appear (criterion 3)
- `.gitignore:17` lists `.env` (and `.env.local`, `.env.development`, `.env.production`, `.env*.local`). `git check-ignore -v .env` → `.gitignore:17:.env	.env`. `git ls-files .env` → empty (`.env` untracked).
- Tracked env-ish files: only `.env.example` and `next-env.d.ts`.
- A `git grep` for every distinctive live-value fragment (LiteLLM `sk-gw-…`, OpenRouter `sk-or-…`, HF `hf_…`, both Mapbox `pk.…` tokens, Mono `test_pk_…`, `creditax-demo-session-secret`, etc.) returns a **single** hit: `.env.example:155: CREDITAX_API_KEY=sk_demo_creditax_v1_00000000` — which is the documented **public** demo key, explicitly allowed. No live secret value is present in any tracked file.

### F6. Audit log records a decision for every key (criterion 3/4)
`KEY-AUDIT.md` partitions all 38 keys into **Wired** (14 rows), **Reserved** (3 rows), and **Unused-track-B** (7 rows), with a consumer/rationale per key. `KEY-MAP.md`'s status column is the machine-readable four-way triage (wired / wired(sandbox) / reserved / unused-track-B). `STATE.json` `env_keys_note` names `progress/KEY-MAP.md` as the authoritative map and lists the same inventory, so later runs know live vs mock.

### F7. Gates are green (criterion 3)
Run via `/usr/local/bin/node` (the app-shim `node`/`npx` are broken, as instructed):
- `node node_modules/typescript/bin/tsc --noEmit` → **exit 0**
- `node node_modules/eslint/bin/eslint.js --max-warnings 0 src` → **exit 0**

---

## 4. Evidence / observations (file:line)

| Observation | Location |
|-------------|----------|
| `configuredRpmLimit()` reads `RATE_LIMIT_PER_MINUTE` | `src/lib/rate-limit.ts:24-28` (read at `:25`, fallback to 100 at `:26`) |
| Limiter default uses the env-derived constant | `src/lib/rate-limit.ts:51` (`admit(key, limit = DEFAULT_RPM_LIMIT)`) |
| `CREDITAX_ENV` → status `environment` | `src/app/api/v1/status/route.ts:16` + JSON `environment` at `:22` |
| PB URL chain incl. fallback var | `src/lib/pb-features.ts:17-19` (`… → NEXT_PUBLIC_POCKETBASE_FALLBACK_URL → '127.0.0.1:8090'`), exported `pocketbaseUrl()` `:27` |
| Same fallback var also in the PB client | `src/lib/pocketbase.ts:20` |
| Mapbox server guard + token accessor | `src/ai/mapbox.ts:27`, `:33` |
| Mapbox client token | `src/app/[locale]/marketplace/page.tsx:251` |
| Mono sandbox guard (fail-closed) | `src/ai/mono.ts:42-43`, host pin `:58-60`, header `:68` |
| Test-only PSP resolver (keys empty → none) | `src/ai/payments.ts:54-56` |
| LLM cascade LITELLM→KIMCHI | `src/ai/rag/llm.ts:61-77` |
| Embedding cascade OpenRouter→HF→Vertex | `src/ai/rag/embeddings.ts:94,120,163-169` |
| `.env` gitignored | `.gitignore:17` |
| Public demo key is the only tracked value | `.env.example:155` |
| `AUTH_SESSION_SECRET` zero consumers | `grep -rn AUTH_SESSION_SECRET src/` → no matches |
| Track-B keys zero consumers | `grep -rn "BACKBLAZE_B2\|CLOUDINARY\|TRIGGER_PROJECT_KEY\|…|TWILIO_" src/` → no matches |

---

## 5. Risks, gaps, uncertainty

- **Live smoke of the Mapbox "happy path" is still untestable here.** The live `MAPBOX_ACCESS_TOKEN` currently 401s on Geocoding (P14 note), so the *positive* live-geo branch has not been exercised end-to-end; only the honest demo fallback was exercised. Not a code defect — a key/authorization gap.
- **Mono sandbox 2xx unverified.** `monoSandboxCreditScore` is fail-closed to `null` from this sandboxed box (host unreachable); the live 2xx path remains untested.
- **Superuser creds + `GOOGLE_APPLICATION_CREDENTIALS` / Vertex are reserved / unused-track-B by design** (empty in `.env`), so those legs are present in code but skipped at runtime — correctly documented, not a gap.
- **Secrets are masked** in this review; I did not print `.env` value fragments beyond targeted masked grep targets.
- **`LITELLM_MODEL`** is not a key defined in the live `.env` (only `LITELLM_API_KEY`/`LITELLM_BASE_URL` are); it is resolved from `.env.example`'s default + `KIMCHI_MODEL`, which is exactly what `KEY-MAP.md` documents. This is consistent, not a mismatch.

---

## 6. Recommendations

1. **Fix the live Mapbox token authorization** so the positive geocode branch can be smoke-tested (keeps the honest-demo fallback intact).
2. **Confirm the Mono sandbox reachability** from a non-sandboxed runtime to validate the 2xx credit path before declaring `mono-sandbox` fully live.
3. When Track B lands, **wire `AUTH_SESSION_SECRET` to a real signed-cookie/JWT session store** and flip its status from `reserved` to `wired`; keep the `KEY-AUDIT` row updated.
4. Keep the **in-memory rate limiter** labeled for a Redis upgrade in multi-instance production (already noted in the 429 body + comments).
5. Leave B2/Cloudinary/Trigger/Resend/Twilio/Jumo/Vertex/`OPENAI_API_KEY`/Supabase-legacy as `unused-track-B` until the corresponding SDKs + creds are actually installed and consumed; re-audit then.

---

## 7. Action items / next steps

- [ ] Flip `p16-key-sweep` `last_review` to `verdict: pass` in `STATE.json` (reviewer: independent subagent, gates tsc/lint green, honesty: live-vs-mock map confirmed).
- [ ] Set the 8 `p16-key-sweep` items (`key-audit`, `mapbox-slot`, `b2-storage`, `cloudinary-images`, `trigger-jobs`, `resend-twilio-comms`, `paystack-flutterwave-payments`, `unused-keys-triaged`) to `done`, each annotated with its track (wired / sandboxed / reserved / unused-track-B).
- [ ] Track the two non-blocking live validations (Mapbox 2xx, Mono 2xx) as follow-up probe items, not blockers.
- [ ] No code change required to pass the gate — the corrections are already in the tree.

---

*Independent subagent review · 2026-09-24 · Creditax.ai P16 catch-all key-sweep.*
