# Independent review gate — creditax-ai phase `p3-docs-skills`

## Summary
Independent, code-level verification of the four exit criteria for phase `p3-docs-skills` in `/Users/oyinkansolaarchibong/Desktop/creditax-ai`. All four criteria are met against the actual source (worker output not trusted). Type check and lint both pass with exit code 0. One minor discrepancy found (referral reveal tier vs pricing doc) that does not block the phase. **Verdict: PASS.**

## Inputs reviewed
- `progress/STATE.json` — phase `p3-docs-skills`, all 3 items marked `done`, 4 exit criteria (F-08, F-09, F-20, lint+honesty)
- `progress/RUNBOOK.md` — Track A honesty rules (anything mocked must be labeled `demo_seed: true`)
- `src/ai/notifications.ts` (118 L), `src/ai/referral.ts` (129 L), `src/ai/skills.ts` (238 L)
- Routes: `src/app/api/v1/notifications/route.ts`, `src/app/api/v1/referral/route.ts`, `src/app/api/v1/skills/route.ts`, `src/app/api/v1/skills/[id]/route.ts`
- UI: `src/app/[locale]/dashboard/chat/page.tsx` (781 L), `src/components/shared/NotificationBell.tsx` (155 L), `src/components/shell/AppShell.tsx` (bell wired at line 357)
- `src/lib/seed/demoSeed.ts` (Tier type, seedProfessionals, seedNotifications)
- `research/pricing-and-access.md` (contact-reveal tier table)

## Key findings

### 1. F-08 — filing-deadline alerts + doc-processed events into the bell ✅
- `filingDeadlines()` in `src/ai/notifications.ts` is pure calendar math (next 21st-of-month VAT/WHT cadence, UTC-safe rollover) → `dl-vat` + `dl-wht` records, each `demo_seed: true`.
- `GET /api/v1/notifications` returns `{ notifications, unread, deadlines, demo_seed: true }`; `POST` accepts `document_processed` / `filing_deadline` / `score_change` / `pro_referral` events with 400 validation on missing/invalid fields → `postEvent` pushes into the session feed and updates unread.
- `NotificationBell.tsx` fetches `/api/v1/notifications?userId=u-consumer`, renders deadlines as countdown items ("Due … · N d left") plus feed items, shows unread badge, and labels the panel "demo_seed · filing deadlines are computed, not live".
- **Offline fallback verified:** fetch `catch` → `setLoaded(true)` with empty items → "No notifications" inbox state; the demo never dead-ends. Bell is mounted in `AppShell.tsx`.

### 2. F-09 — low-confidence / audit-intent → verified-pro referral card ✅
- `shouldRefer()` in `src/ai/referral.ts`: high-stakes keywords (audit, appeal, objection, penalty, assess, fine, investigation) force referral with `reason: 'audit_appeal'`; `confidence < 0.6` → `reason: 'low_confidence'`.
- `pickProFor()` deterministically matches intent → seeded *verified* pro (keyword scoring + highest-rated fallback); no LLM, offline-safe.
- `buildReferralCard()` masks contact for free/anonymous viewers and reveals phone/whatsapp/email when `loggedIn === true` or paid tier; card carries `demo_seed: true`.
- `POST /api/v1/referral` validates tier against `VALID_TIERS`, returns `{ refer: false }` or the card, all flagged `demo_seed: true`.
- Chat canvas: explicit (canned TIN attach) or detected triggers surface a live referral card; when masked it shows `+234••• •••0••` and guidance text; when revealed, phone/WhatsApp buttons render. Falls back to a static `Adaeze Consulting Ltd` card only when the pro set is empty.

### 3. F-20 — four Skill chips with fixed I/O, credit cost, tier gate ✅
- `SKILLS` in `src/ai/skills.ts`: `wht-recovery` (5cr), `tcc-readiness` (2cr), `notice-explainer` (2cr), `invoice-wht-check` (2cr, `tierGate: 'plus'`). All result interfaces (`WhtRecoveryResult`, `TccResult`, `NoticeExplainerResult`, `InvoiceWhtResult`) have a mandatory `demo_seed: true` field — enforced at compile time, not just runtime.
- **Chip rail verified in canvas** (`chat/page.tsx` lines ~740): `SKILLS.map` renders each chip with its one-liner + `· Ncr` cost; clicks run with demo-seed inputs (₦240,000 goods/services for invoice WHT, "Zenith Supplies Ltd" vendor for recovery).
- **SkillCard + renderSkillBody verified:** each of the four result types has a dedicated body renderer (line-item table / progress bar + missing-docs / plain-language + deadline countdown / gross-withheld-net-code grid). When a skill lacks input, SkillCard renders a "needs more input" card. Every card displays "demo_seed · output is illustrative, not live data".
- **Tier gate verified (real, not cosmetic):** `POST /api/v1/skills/[id]` → `canRunSkill` → on gate failure returns **403** with `error` + `tier` + **`upgrade_to: 'plus'`** (400 for missing input instead). The chat's `runSkillChip` propagates this: a 403 pushes an "Invoice WHT check — upgrade required" card; offline catch falls back to the local module which enforces the same gate.
- Costs mirror `pricing-and-access §4` (calc = 2 credits); the P4 quota engine can meter without rework.

### 4. Lint + demo_seed honesty ✅
- `/usr/local/bin/node ./node_modules/typescript/bin/tsc --noEmit` → **exit 0**
- `/usr/local/bin/node ./node_modules/eslint/bin/eslint.js --ext .ts,.tsx src` → **exit 0** (`npm run lint` script is exactly `eslint`)
- Honesty: every mocked output path is flagged — all four skill result types (type-enforced), both skill API routes, notification GET/POST, referral POST (both `refer: false` and card responses), and the UI surfaces the flag (skill card footnote, bell footer, answer-card "answered from offline demo knowledge base" badge). No fake OCR or live-data presentation found.

## Risks, gaps, uncertainty
1. **Minor — Plus-tier reveal mismatch (non-blocking):** `referral.ts` reveals contact only for `professional`/`enterprise` (`revealPaid = tier === 'professional' || tier === 'enterprise'`), but `research/pricing-and-access.md` row "Marketplace contact reveal" lists **Plus = Full**, and the masked card's UI copy says "full contact on **Plus** (₦5,000/mo) or when logged in". As written, a logged-in Plus user via the API gets `masked: true` while the UI advertises reveal. The exit criterion ("masked → logged-in reveal") is met (loggedIn === true reveals), so this is a documentation/UI-vs-code consistency defect, not a gate failure.
2. **Nit — misleading no-referral reason:** `shouldRefer` returns `reason: 'low_confidence'` when `refer: false`; the API returns it to clients. Cosmetic.
3. **Canvas hardcodes `tier: 'free'`** for the live chat/referral, so the reveal path is only reachable through the API route's `loggedIn`/`tier` params — acceptable for demo, but P4 auth must wire real session tier in.
4. In-memory stores (events, feeds) reset per process/session; STATE.json notes Track B swaps to PocketBase. As designed, not a defect.
5. Build criterion was not part of this phase's exit list; lint covers criterion 4. (Prior phases noted a sandbox-blocked build; re-verify `npm run build` in a non-sandboxed run.)

## Recommendations
- Add `'plus'` to `revealPaid` in `src/ai/referral.ts` (one-line fix) to match `pricing-and-access.md` and the UI copy.
- Return `reason: null` (or a distinct `no_referral` value) from `shouldRefer` when `refer: false`.
- When P4 auth lands, replace the hardcoded `tier: 'free'` in the chat canvas with the session's real tier.
- Re-run `npm run build` outside the sandbox to close the carried-over env-blocked note.

## Action items / next steps
1. One-line Plus-reveal fix in `referral.ts` (carry into p4-money or P4 auth work).
2. Update `STATE.json` p3-docs-skills `last_review` to `pass` with gate notes (tsc 0, eslint 0, build n/a this phase).
3. Proceed to next phase in STATE order: `p4-money`.

## Verdict JSON
```json
{
  "verdict": "pass",
  "reasons": [
    "F-08: GET /api/v1/notifications returns seeded feed + deterministic filing deadlines (next 21st-of-month VAT/WHT) with demo_seed: true; POST ingests document_processed events; NotificationBell fetches the endpoint, renders deadline countdowns, and falls back to a graceful 'No notifications' state offline.",
    "F-09: shouldRefer fires on high-stakes intent (audit/appeal/objection/penalty) or confidence < 0.6; buildReferralCard picks a verified pro deterministically, masks contact for free/anonymous, reveals on loggedIn/paid tier; chat canvas renders masked (masked digits + upgrade hint) vs revealed (phone/WhatsApp actions) card; API route flags demo_seed.",
    "F-20: all four Skill chips (wht-recovery, tcc-readiness, notice-explainer, invoice-wht-check) are defined with fixed I/O contracts (mandatory demo_seed: true on every result interface), credit costs (5/2/2/2), and tier gates; the chip rail renders in the canvas, and SkillCard/renderSkillBody have per-type bodies plus the demo_seed footnote.",
    "Real tier gate verified: POST /api/v1/skills/[id] returns 403 with upgrade_to: 'plus' when invoice-wht-check runs under the free tier; missing-input returns 400; the UI propagates the 403 as an 'upgrade required' card and falls back to a local deterministic run offline.",
    "demo_seed honesty maintained: type-enforced demo_seed: true on all skill result shapes; every mocked API response (skills list/run, notifications GET/POST, referral) carries demo_seed: true; UI labels 'output is illustrative, not live data'. No fake OCR or fake live data presented as real.",
    "Gate commands: /usr/local/bin/node ./node_modules/typescript/bin/tsc --noEmit → exit 0; /usr/local/bin/node ./node_modules/eslint/bin/eslint.js --ext .ts,.tsx src → exit 0."
  ],
  "remaining_items": [
    "Minor (non-blocking): referral.ts does not reveal contact for 'plus' tier while pricing-and-access.md (Plus = Full) and the masked-card UI copy say 'full contact on Plus' — add 'plus' to revealPaid.",
    "Nit: shouldRefer returns reason 'low_confidence' when refer=false; use a neutral reason.",
    "Carry-over: npm run build remains env-blocked in the sandbox from the rag-pipeline review; re-run in a non-sandboxed environment.",
    "P4 follow-up: wire real session tier/logged-in state into the chat canvas (currently hardcoded tier: 'free') and swap in-memory notification store for PocketBase."
  ]
}
```
