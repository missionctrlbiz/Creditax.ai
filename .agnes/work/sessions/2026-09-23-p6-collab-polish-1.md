# P6 (Collab + Polish) — attempt 1 — 2026-09-23

## Implemented
- **F-18 collaboration-preview**: `src/ai/collaboration.ts` — `inviteMember` (paid-only: plus/pro/ent; free → {ok:false, upgradeTo:'plus'}) + `listInvites`; `createSharedLink` (paid-only, view/comment) + `listSharedLinks` + `resolveSharedLink(slug)` (read-only preview + signup CTA). Routes: GET /api/v1/collab, POST /collab/invite (403+upgradeTo on free), POST /collab/share. UI: dashboard settings "Team & Sharing" section (shared links + workspace invites wired to the endpoints, paid-feature note); public read-only `/share/[slug]` page (seeded conversation + signup CTA, i18n `share`).
- **F-19 connectors-preview**: `src/ai/connectors.ts` — `CONNECTORS_PER_TIER` (free=2, plus=10, pro/ent=∞, matching pricing-and-access §2), `connectService` enforces the cap (over-cap → ok:false + upgradeTo), `promptContext` surfaces connected apps (Google Drive seeded for u-consumer) as context chips, `connectorStatus` for the "free shows 2 included" line. Route: GET/POST /api/v1/connectors. UI: settings "Connected apps" section (per-tier cap banner + prompt-context chips + connect-a-tool grid).
- **remaining-collections**: `pb_migrations/0001_creditax_demo.sql` already has shared_links/invites/connectors; `demoSeed.ts` now seeds DemoInvite/DemoSharedLink/DemoConnector/DemoSubscription (all demo_seed:true) + CONNECTORS_PER_TIER.
- **screenshot-sweep**: i18n `share` namespace added to all 4 locales (en/yo/ha/ig, 10 identical keys). Actual camera screenshots are the manual on-camera step; repo-level sweep = locale-structure consistency (verified identical key sets).

## Decisions
- resolveSharedLink is pure/synchronous → share page derives the whole view via useMemo (no setState-in-effect, keeps the react-hooks gate clean).
- All P6 outputs carry demo_seed:true; free-tier gate returns a P4-shaped {ok:false, upgradeTo} so the upgrade wall reuses the existing money-layer affordance.

## Gates
- tsc exit 0 · eslint exit 0 · build env-blocked (P6 criterion is lint-only).
## Reviewer
- P6 verified pass: F-18/F-19 + collections + i18n all confirmed against code; demo_seed honesty holds.

## Remaining (Track B, out of P6 scope)
- Persist session-created invites/links/connectors to PB; real OAuth for connectors; email delivery; per-link access enforcement.
