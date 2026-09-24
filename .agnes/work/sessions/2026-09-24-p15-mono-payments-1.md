# Session 2026-09-24 — p15-mono-payments (attempt 1)

## Gate check
`gated_until_p12_complete` MET (p12 @ 56289ef, clean tree). p15 → in_progress.

## Ground
- Live `.env` (names only, masked): `MONO_API_KEY` present (test_p…), `MONO_ENVIRONMENT=sandbox`, `MONO_BASE_URL=https://sandbox.api.mono.co`. PSP keys (FLUTTERWAVE_*, PAYSTACK_*) all **empty**.
- Live probe: Mono sandbox host unreachable from this sandboxed box (fetch failed) → the honest fail-close path (null → demo seed) is the live-tested branch.

## Implemented
- **src/ai/mono.ts** (new): sandbox-only Mono client. `monoEnabled()` true only when key present AND `MONO_ENVIRONMENT==='sandbox'`. `monoLookupUser`, `monoIncomes`, `monoOutflows` all null-on-failure (never throw). **Host pinning (post-review hardening):** in sandbox mode `baseUrl()` pins `https://sandbox.api.mono.co` regardless of a non-sandbox `MONO_BASE_URL`, warning once — makes "a sandbox key can never hit a production host" a code invariant.
- **src/ai/credit-scoring.ts**: `data_source: 'mono-sandbox' | 'demo_seed'`; new `monoSandboxCreditScore(kv, kvn)` — income-side factors from Mono analyzed flows (12-mo avg), stability proxied by record count, savings from income-vs-outflow, debt/tax carry the demo profile (documented; Mono Prove is Track B). Returns null when Mono disabled / call fails / no income data → route falls back to `demoCreditScore()`. `demo_seed` stays true for sandbox data (it's test data, not a real person's finances); `data_source` tells the difference.
- **src/app/api/v1/credit/score/route.ts**: `?kv=&kvn=` live-sandbox path (when `monoEnabled()`), demo fallback otherwise; response carries `data_source` + a `mono` block (sandbox/enabled/note).
- **src/ai/payments.ts** (new): `pspConfigured()` reads ONLY test-mode keys (Flutterwave canonical → Paystack alternate → none); `sandboxCharge()` always returns `charged:false` + `demo_seed:true` (prepared-test or not-configured) — no production charge path exists, no PSP endpoint is contacted.
- **routes**: new `POST /api/v1/payments/charge`; `POST /api/v1/quota/tier` billing payload now surfaces the real PSP resolver state (`provider` flutterwave|paystack|none) instead of the "Track B" placeholder.

## Verification
- tsc --noEmit: 0. eslint --max-warnings 0 src: 0.
- Live probe (emitted JS + `@/` alias shim, `.env` inline-loaded, values masked): `monoEnabled()=true`; `monoSandboxCreditScore → null` (host unreachable → route uses demo seed, honestly); `demoCreditScore → data_source=demo_seed, score=751`; `pspConfigured()=none` (PSP keys empty); `sandboxCharge(plus) → {provider:none, status:not-configured, charged:false, amountNGN:5000}`.
- next build: Turbopack EPERM sandbox env-block (same as p3–p14; not a code defect).

## Independent review gate
deep-analysis: **PASS** — all 3 exit criteria verified at file:line; no real secrets committed (.env gitignored, .env.example placeholders; masked fixtures only). Non-blocking notes: (1) STATE record stale → fixed this session; (2) MONO_BASE_URL operator-settable → **fixed in-session** via sandbox host pinning; (3) `monoLookupUser` dormant (unused by routes; Keep for Track B CAC/BVN lookup, lint-clean); (4) live 2xx from Mono untestable from this box (host unreachable) — fail-close verified structurally.

## Remaining / next
- p16-key-sweep (queued, gate met): full KEY-MAP audit — every key must end wired / sandboxed / unused-track-B (JUMO, B2, Cloudinary, Trigger.dev, Resend, Twilio pending).
