# p4-money Review Gate — F-11 / F-12 / F-13 Verification

Independent review gate for the creditax-ai `p4-money` phase. Verdict based on the actual committed code, not the worker's claims.

## Summary
**Verdict: PASS.** All three exit criteria (F-11 server-side quota engine, F-12 named-limit upgrade walls + live usage page, F-13 subscriptions collection + mock tier flip) are satisfied by real code. `tsc --noEmit` and `eslint` both exit 0. ₦-only currency rule and demo_seed honesty are maintained on every P4 output. Two minor non-blocking gaps noted (credit-refresh has no per-action guardrail; subscriptions collection exists but Track A does not persist a row).

## Inputs reviewed
- `progress/STATE.json` — p4-money items (quota-engine / upgrade-walls-usage / mock-billing-tiers / subscriptions-collection all `done`) + 4 exit criteria.
- `progress/RUNBOOK.md` — Track A honesty rule (mocked ⇒ `demo_seed: true`), toolchain, definition of done.
- `research/pricing-and-access.md` — §2 tiers, §4 credit accounting, §5 conversion, §6 enforcement, ₦-only currency rule.
- New code: `src/ai/quota.ts`, `src/app/api/v1/quota/route.ts`, `.../meter/route.ts`, `.../tier/route.ts`, `src/components/shared/UpgradeWall.tsx`, `src/app/[locale]/dashboard/usage/page.tsx`, `src/app/api/v1/chat/route.ts`.
- Supporting: `src/lib/seed/demoSeed.ts` (seedQuotas/DemoQuota), `pb_migrations/0001_creditax_demo.sql` (quotas + subscriptions tables), `src/lib/pb-data.ts`.

## Key findings

### F-11 — server-side quota engine (exit criterion 1) ✅
- `CREDIT_COST` in `quota.ts` matches §4 exactly: chat=1, tax-calc=2, upload=3, report=2, credit-refresh=2, bvns=25, tin-cac=5, api=1.
- `TIER_CAPS` matches §2: free (chat 5/day, lifetime 60, calc 5, upload 2, report 2, bvn 0 + teaser 2), plus (100/–/50/20/10, bvn 5), professional (∞/∞/∞/100/∞, bvn 20), enterprise (∞).
- `QuotaRecord` holds daily counters (creditsToday, chatsToday, calcsToday, uploadsToday, reportsToday, bvnUsed) **and** a lifetime counter (chatsLifetime).
- `meter()` is the enforcement point: it checks per-action caps **before** charging, then mutates the record server-side (`rec.creditsToday += cost` + action counter). Chat guards both the daily cap (6th chat blocked) and the free 60-lifetime cap. `POST /api/v1/quota/meter` returns `403 + reason + upgrade` on cap-hit.
- The `quotas` collection exists in `pb_migrations/0001_creditax_demo.sql` (user_id, tier, chat_today/cap, lifetime_chats/cap, calcs/uploads/reports, bvns_used/teaser/monthly, reset_date, demo_seed) — the Track B DB mirror of the in-memory store.

### F-12 — named-limit upgrade walls + live usage (exit criterion 2) ✅
- 6th chat: `meter('chat')` blocks at `chatsToday >= 5` → `reason: 'daily_limit'`. 60-cap: free `chatsLifetime >= 60` → `reason: 'lifetime_limit'`.
- Chat route `POST /api/v1/chat` (F-11 metering point): when `userId` is present it calls `meter(userId, 'chat')` and short-circuits with a **403** body `{ blocked: true, upgrade: status.upgradeHint, status, demo_seed: true }` + `X-Creditax-Quota` header before doing any RAG work. Anonymous chat is intentionally un-metered so the demo never dead-ends (honest, not faked enforcement).
- Upgrade hint is truly named-limit: "You've hit today's 5 free chats — Plus gives you 100/day for ₦5,000/mo." (exact limit + Plus ₦5,000/mo per §5).
- `UpgradeWall.tsx` renders `hint.message` (named limit) + "Upgrade to {to}" + an explicit "demo_seed · upgrade is a mock tier flip (Paystack/Flutterwave is Track B)" line.
- `/dashboard/usage` now fetches `GET /api/v1/quota?userId=u-consumer` and renders **live** counter tiles (credits today/budget, chats today+cap+lifetime, calcs, uploads) — replacing the old static mock figures with real engine counters. It also mounts `UpgradeWall` when a hint exists and POSTs to `/api/v1/quota/tier` on upgrade. (The pre-existing API-stats grid/chart below the panel is dashboard chrome, not in F-11/F-12 scope.)

### F-13 — subscriptions + mock tier flip (exit criterion 3) ✅
- `subscriptions` collection defined in `0001_creditax_demo.sql` (user_id, plan, status, billing_cycle, period_end, demo_seed), documented as "mocked billing — real Paystack/Flutterwave in Track B".
- `setTier()` flips the user's tier in the store and re-baselines counters to the new tier's seed.
- `POST /api/v1/quota/tier` = set tier + toast: returns the plan and `toast: { "Plus · ₦5,000/mo" }` plus `billing: { provider: 'mock', note: 'Real Paystack/Flutterwave is Track B', demo_seed: true }`.

## Evidence / observations
- Credit-cost and tier-cap constants verified line-by-line against §2/§4/§5.
- Seed `u-consumer`: chatToday 4, lifetimeChats 54 → 5th chat allowed, 6th blocked; below the 60-lifetime cap, so a live metered user demonstrably hits the daily wall.
- 20 occurrences of `demo_seed: true` across the P4 files (quota types, all three quota routes, UpgradeWall note, usage badge, chat 403).
- No `$` / USD pricing in any P4 file; the only `$` matches in `src/` are shell `\\` line-continuations in `developers/page.tsx` (not currency, not P4).
- Free-tier summed daily credit budget = 5·1 + 5·2 + 2·3 + 2·4 = 25; individual action caps bound the total to that budget, so the summed-budget invariant holds.

## Risks, gaps, uncertainty
1. **credit-refresh / tin-cac / api** are metered (they add to `creditsToday`) but have no per-action daily guardrail in `meter()`; they are bounded only by the summed credit budget. Acceptable for the named exit criteria (which focus on chat/calc/upload/report/bvn), but a per-day refresh cap would tighten §2 "1 starter snapshot" for the free tier.
2. **Subscriptions row not persisted in Track A** — `setTier` mutates the in-memory tier only; no `subscriptions` row is written (consistent with mocked billing; real PSP is Track B). The collection itself exists, satisfying "subscriptions collection".
3. **6th-chat wall only fires for metered users** — anonymous chat (no `userId`) is un-metered by design, so an anonymous demo user never sees the wall. This is honest (not faked enforcement) but means the F-12 wall is user-scoped.
4. In-memory store resets on restart; WAT daily reset + DB persistence are explicitly deferred to Track B (documented in code comments).

## Recommendations
- Optional hardening (non-blocking): add a per-day `credit-refresh` guardrail and a free-tier "1 starter snapshot" latch in `meter()`; when Track B lands, wire `setTier` to upsert a `subscriptions` row and swap the in-memory store for PocketBase `quotas`.

## Action items / next steps
- Mark `p4-money` as `reviewed_pass` in STATE.json (tsc exit 0, eslint exit 0, build env-blocked in sandbox as in prior phases).
- Carry the two optional hardening items to Track B alongside real PSP + PocketBase quota persistence.

## Gates
- `tsc --noEmit`: **exit 0**
- `eslint --ext .ts,.tsx src`: **exit 0**
- build: not required by p4 exit criteria (lint only); sandbox Turbopack EPERM applies as in prior phases.
