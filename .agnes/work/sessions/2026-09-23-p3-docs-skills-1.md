# P3 (Docs & Skills) — attempt 1 — 2026-09-23

## Implemented
- **F-08 deadline-notifications**: `src/ai/notifications.ts` — in-memory bell feed (seeded from `seedNotifications`) + `postEvent()` for doc-processed/filing events + `filingDeadlines()` deterministic next-21st-of-month VAT/WHT countdowns. Routes: `GET /api/v1/notifications` (feed + unread + deadlines), `POST /api/v1/notifications` (ingest event, kind-validated). UI: `src/components/shared/NotificationBell.tsx` (live fetch, unread badge, deadline countdown rows, offline → empty-state fallback, demo_seed footer) wired into `AppShell` header (replaced static bell).
- **F-09 pro-referral-card**: `src/ai/referral.ts` — `shouldRefer(text, confidence)` (high-stakes intent: audit/appeal/objection/penalty, or confidence < 0.6) + `pickProFor(text)` (deterministic service-keyword match over verified seeded pros, highest-rated fallback) + `buildReferralCard({text, confidence, tier, loggedIn})` → contact masked for free/anonymous, revealed for Plus/Professional/Enterprise or loggedIn (pricing-and-access §2 "Marketplace contact reveal"). Route: `POST /api/v1/referral`. Chat canvas: `ask()` now emits live referral cards (masked state + "full contact on Plus" hint); static 'Adaeze' card remains only for explicit-intent fallback.
- **F-20 skills-v1-chips**: `src/ai/skills.ts` — SKILLS rail (🧾 wht-recovery 5cr / 📜 tcc-readiness 2cr / 📩 notice-explainer 2cr / 🧮 invoice-wht-check 2cr + tierGate 'plus'), `canRunSkill` tier gate, four deterministic result builders with fixed I/O contracts (all `demo_seed: true` at the type level), `runSkill` dispatcher. Routes: `GET /api/v1/skills` (list), `POST /api/v1/skills/:id` (run; 403 + `upgrade_to` on gate, 400 on missing input). Chat canvas: chip rail replaced the 4 static quick-asks; `runSkillChip` tries live API then falls back to local deterministic module offline; `SkillCard` + `renderSkillBody` render per-skill canvas result cards (claim schedule / readiness % + missing-docs / plain-language + countdown / deduct-remit-code grid), each with a demo_seed footnote.

## Decisions
- Skills run free-tier by default in the canvas (demo viewer); P4 quota engine meters the costCredits.
- Referral mask/reveal is tier-driven, not just login-driven, to match pricing-and-access §2 (Plus = Full contact).
- Notice-explainer embeds the user's notice text in its plain-language output (uses the previously unused `notice` var).

## Gates
- tsc --noEmit: exit 0. eslint src: exit 0 (0 warnings after notice-var fix).
- build: env_blocked (sandbox EPERM) — same as prior phases.
- No runtime smoke run: no tsx/esbuild CLI in toolchain and @/ alias unresolvable ad-hoc; verified by tsc + reviewer instead.

## Reviewer flags applied
- referral.ts revealPaid now includes 'plus' (was professional/enterprise only).
- shouldRefer no-refer reason changed to 'none' (was misleading 'low_confidence').

## Remaining (P4)
- Wire real session tier/loggedIn into the chat canvas (hardcoded tier:'free').
- Server-side quota metering for skill costCredits (quota-engine).
- PocketBase swap for the in-memory notifications store.
