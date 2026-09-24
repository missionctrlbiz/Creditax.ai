# Independent Review Gate — p15-mono-payments (creditax-ai)

**Verdict: PASS** — all three exit criteria hold in the actual source; no production charge is structurally possible; secrets stay uncommitted; tsc + lint clean.

## Summary

Phase p15 wires a sandbox-only Mono client into the credit-scoring provider interface and a test-only PSP charge path into payments. Code review (not notes) confirms: `monoEnabled()` gates every Mono call on `MONO_API_KEY` + `MONO_ENVIRONMENT==='sandbox'`; `monoSandboxCreditScore()` labels results `data_source:'mono-sandbox'` while keeping `demo_seed:true` and fails closed to the demo seed; `pspConfigured()` reads only test-mode keys and `sandboxCharge()` always returns `charged:false` with zero HTTP calls; both payment routes surface the honest provider state. Live `.env` matches the probe note: Mono sandbox key present (host unreachable → fail-closed demo seed), PSP keys empty → provider `'none'`.

## Inputs reviewed

- `progress/STATE.json` (p15 phase block: 3 exit criteria, items, gate) and `progress/KEY-MAP.md` lines 14–16, 29
- `src/ai/mono.ts` (full file)
- `src/ai/credit-scoring.ts` (full file)
- `src/ai/payments.ts` (full file)
- `src/app/api/v1/payments/charge/route.ts`, `src/app/api/v1/quota/tier/route.ts`
- `src/app/api/v1/credit/score/route.ts` (wiring of the provider swap)
- `.gitignore`, `.env.example`, local `.env` (key presence only, values not inspected beyond non-empty checks)
- Gates: `tsc --noEmit` (exit 0), `eslint --max-warnings 0 src` (exit 0), both via `/usr/local/bin/node`

## Key findings (criterion by criterion)

### 1. Credit-scoring provider swap — holds
- **Sandbox guard:** `monoEnabled()` at `src/ai/mono.ts:41-45` returns `!!key && env === 'sandbox'` with the env lowercased — missing key, `live`, `production`, or any other value → false. Every public Mono function checks it first: `monoLookupUser` (`mono.ts:67`), `monoIncomes`/`monoOutflows` via `monoAnalyzedFlow` (`mono.ts:104`). All fetch paths also `catch → null` and reject non-2xx / bad `status_code` (`mono.ts:69-80`, `110-128`), so a non-sandbox or unreachable host can only ever yield null → demo-seed fallback.
- **Swap:** `monoSandboxCreditScore(kv, kvn)` (`credit-scoring.ts:152-192`) returns null when `!monoEnabled()`, no kv/kvn, or `incomes.count === 0` (line 156, 164) — the route then falls back (`credit/score/route.ts:36`: `result = live ?? demoCreditScore()`). Income is Mono-derived (12-month average, line 168); stability/savings derived from flow counts; debt/tax honestly carried from the demo profile (lines 170-185). Output is `data_source:'mono-sandbox'` + `demo_seed:true` (lines 187-189).
- **Demo unchanged:** `demoCreditScore()` (`credit-scoring.ts:126-133`) still returns `demo_seed:true, data_source:'demo_seed'` over `DEMO_FACTORS` — no semantic drift.

### 2. Payments charge path — holds
- `pspConfigured()` (`payments.ts:50-59`) reads **only** `FLUTTERWAVE_SECRET_KEY/PUBLIC_KEY` (preferred) then `PAYSTACK_SECRET_KEY/PUBLIC_KEY` (alternate); no env var like `*_PRODUCTION_KEY` is ever consulted.
- `sandboxCharge()` (`payments.ts:70-107`) **always** returns `charged: false` (type-level: `charged: false` literal in `ChargeResult`, line 35) and `demo_seed: true`; with no keys → `provider:'none'`, `status:'not-configured'` (lines 76-86); with test keys → deterministic `test_reference` + `status:'prepared-test'` (lines 88-105). `grep` confirms **no `fetch`/`https://` anywhere in payments.ts** — it is impossible for this build to contact a PSP endpoint, test or production, and complete a card charge.
- Honest wiring: `charge/route.ts:41-52` spreads the result and adds `psp: pspConfigured()`, `demo_seed:true`; `quota/tier/route.ts:33-49` sets `billing.provider` from the resolver, with an explicit "upgrade stays mocked; nothing is charged" note when `provider === 'none'` (lines 44-47).

### 3. Guard + secrets + lint — holds
- Non-sandbox guard verified in item 1; `baseUrl()` defaults to `https://sandbox.api.mono.co` (`mono.ts:48`).
- `.env` is gitignored (`.gitignore:17-21`); `git ls-files` shows only `.env.example` tracked. `.env.example:84-86,109-114` holds placeholders (`MONO_API_KEY=` empty, `FLUTTERWAVE_ENVIRONMENT=test`); `git log -- .env` empty.
- No secret values committed: `test_p`/Paystack/Flutterwave secret-string greps over `src` + `.env.example` found only masked UI demo fixtures (`sk_live_****…8f3a`, `sk_test_****…2b91` in dashboard key pages — display fixtures, not real credentials) and the api-keys masking helper.
- Local `.env` state matches the live-probe note: `MONO_API_KEY` non-empty + `MONO_ENVIRONMENT=sandbox` (guard passes; host unreachable → `monoSandboxCreditScore` null → demo seed, honest); all four PSP vars empty → `pspConfigured() === 'none'`.
- Gates: `tsc --noEmit` exit 0; `eslint --max-warnings 0 src` exit 0 (via `/usr/local/bin/node` as required).

## Risks / gaps / uncertainty

- **`MONO_BASE_URL` is operator-settable:** the guard verifies the `MONO_ENVIRONMENT` string but not the host. Setting `MONO_ENVIRONMENT=sandbox` together with a production `MONO_BASE_URL` in `.env` would send a sandbox key at the production host. No such configuration exists today (default is `sandbox.api.mono.co`; local `.env` uses the default), so the criterion "any non-sandbox call is blocked" holds — but the invariant is env-var-trusted, not host-pinned. Flag for the p16 key sweep.
- **STATE.json phase bookkeeping is stale:** p15 items are all `todo` / `status: in_progress` with `last_review: null` even though the code work is verified complete. The gate approval should flip items to `done` and record `last_review`.
- **`monoLookupUser` is exported but unused** by any route in `src/` — dormant, harmless (lint clean), worth folding into Track B or deleting.
- Live probe could not execute the Mono HTTP path (host unreachable from this box); the fail-close behavior above was verified structurally, not by observation of a 2xx Mono response.

## Recommendations / next steps

1. Approve p15; update `progress/STATE.json`: items → `done`, add `last_review` (verdict pass, gates tsc/lint exit 0), keep `gate: gated_until_p12_complete` semantics recorded as satisfied by this review.
2. p16 key sweep: add a lint/CI check asserting no `live`/`production` suffix key patterns are committed, and consider pinning `MONO_BASE_URL` to the sandbox host in code when `MONO_ENVIRONMENT==='sandbox'` (defense-in-depth over the env-var-trusted invariant).
3. Defer `monoLookupUser` (and full Mono Prove debt/tax factors) to Track B; delete or mark `@internal` if unused in the demo.
