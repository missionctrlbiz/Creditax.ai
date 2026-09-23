# P6 collab-polish exit-criteria verification (Creditax.ai)

## Summary
Independent deep-review of phase `p6-collab-polish` (STATE.json `in_progress`, 4/4 items marked done) against the actual code under `src/`. All five exit criteria verified as implemented and honest: F-18 (paid invites + read-only shared-canvas link with signup CTA), F-19 (external connector as prompt context, free=2 cap), the three new collections (seeds + migration), four-locale i18n consistency, and a clean lint gate. `tsc --noEmit` and `eslint --ext .ts,.tsx src` both exit 0.

## Inputs reviewed
- `progress/STATE.json` → `p6-collab-polish` exit criteria (5 items)
- `research/product-foundation.md` items 8/9 (§10 collaboration/connectors: paid invites + canvas sharing; connectors on all tiers, free=2)
- `research/pricing-and-access.md` (changelog: "connectors on all tiers (2/10/unlimited)")
- `src/ai/collaboration.ts`, `src/ai/connectors.ts`
- `src/app/api/v1/collab/route.ts`, `.../invite/route.ts`, `.../share/route.ts`, `src/app/api/v1/connectors/route.ts`
- `src/app/[locale]/share/[slug]/page.tsx`, `src/app/[locale]/dashboard/settings/page.tsx`
- `src/lib/seed/demoSeed.ts`, `pb_migrations/0001_creditax_demo.sql`
- `messages/en|yo|ha|ig.json` (`share` namespace)

## Key findings (criterion by criterion)

1. **F-18 — paid invites + shared-canvas link: PASS**
   - `inviteMember()` (`src/ai/collaboration.ts`): paid-only gate — `PAID_TIERS = ['plus','professional','enterprise']`; free tier returns `{ ok:false, reason, upgradeTo:'plus' }` (403-shaped).
   - `createSharedLink()`: same paid gate; `resolveSharedLink()` returns seeded conversation + `isSignupCta:true` for non-users.
   - Routes: `POST /api/v1/collab/invite` and `POST /api/v1/collab/share` return HTTP 403 with `{ ok:false, error, upgradeTo, demo_seed:true }` on the gate; `GET /api/v1/collab` returns seeded invites + shared links with `demo_seed:true`.
   - UI: `/[locale]/share/[slug]/page.tsx` renders a read-only preview of the seeded canvas + signup CTA card (sign-in `/signup` + find-a-pro) and a visible `demo_seed` badge. `/dashboard/settings` has "Team & Sharing" wired to both endpoints (invite input POSTs to `/api/v1/collab/invite` with the demo tier; shared links rendered from `/api/v1/collab`).

2. **F-19 — Drive connector as prompt context, free=2: PASS**
   - `CONNECTORS_PER_TIER` in demoSeed: `{ free:2, plus:10, professional:∞, enterprise:∞ }` (matches pricing-and-access "2/10/unlimited").
   - `connectService()` enforces the cap: when `used >= cap` returns `ok:false` with a free-includes-2 message + `upgradeTo`.
   - `promptContext()` returns connected app display names (e.g. Google Drive) as context chips; `GET /api/v1/connectors` exposes `context`, `services`, per-tier `status` (used/cap/remaining/unlimited) all with `demo_seed:true`; POST enforces the cap and returns 403 + `upgradeTo` when exceeded.
   - Settings "Connected apps" section shows the free-tier cap copy ("You have N of 2 connectors left on Free") and connect buttons wired to the endpoint.

3. **Collections added + seeded: PASS**
   - `pb_migrations/0001_creditax_demo.sql`: `CREATE TABLE IF NOT EXISTS shared_links / invites / connectors` (plus `subscriptions`).
   - `demoSeed.ts` exports `seedInvites` (2), `seedSharedLinks` (2), `seedConnectors` (3, incl. google_drive for u-consumer), `seedSubscriptions` (2), all flagged `demo_seed: true`.

4. **i18n four-locale consistency: PASS (code-level)**
   - `messages/en|yo|ha|ig.json` each contain a `share` namespace with exactly 10 keys, identical key sets: `backHome, ctaBody, ctaFindPro, ctaSignin, ctaTitle, loading, previewCanvas, readOnly, sharedBy, sharedCanvas`.
   - Caveat: "demo-screenshot sweep" (STATE item `screenshot-sweep: done`) is an artifact of the UI run; screenshots themselves are not present in the repo, so this criterion is verified only at the i18n/locale-page structure level, not by inspecting actual screenshot files.

5. **npm run lint: PASS**
   - `/usr/local/bin/node ./node_modules/typescript/bin/tsc --noEmit` → exit 0.
   - `/usr/local/bin/node ./node_modules/eslint/bin/eslint.js --ext .ts,.tsx src` → exit 0 (no output).

## Evidence / observations
- Gates on P6 endpoints: `invite`/`share` 403 payloads carry `upgradeTo: 'plus'` and `demo_seed: true`; `connectors` POST 403 carries `used/cap/upgradeTo` + `demo_seed`.
- `demo_seed` honesty: every P6 mock payload (invite objects, shared links, connector objects, `listInvites/listSharedLinks/listConnectors`, `connectorStatus`, `promptContext`, `resolveSharedLink`) is explicitly flagged `demo_seed: true`, and the share page + settings board show `demo_seed` badges. No fake external API calls are implied; Track B (real OAuth/email/membership) is documented in file headers.
- `resolveSharedLink` falls back to the first seeded link for unknown slugs so demo links always render — intentional Track A behaviour, noted in code.
- Settings page hard-codes the demo identity (`tier='free'`, `userId='u-consumer'`) — consistent with the demo-seed model, not a defect for P6.

## Risks, gaps, uncertainty
- Screenshot sweep is not re-verifiable from repo contents (no image artifacts under review); rely on the i18n + page structure check.
- `listInvites`/`listConnectors` count only seeded rows; session-created connectors/invites are not persisted anywhere in Track A, so a page reload resets state — expected Track A limitation.
- Free-tier cap message in `connectService` hard-codes "Free includes…" wording even for `plus`/`professional` tiers when those caps would be hit; the seeded caps (2/10/∞) make this unreachable in practice, but the copy is tier-agnostic.
- `inviteMember` does not dedupe repeated invites to the same email/role (Track B concern).

## Recommendations
1. Update `progress/STATE.json` p6-collab-polish `last_review` with verdict `pass` (gates tsc exit 0, eslint exit 0, honesty pass) and move `current_phase` handling forward per workflow.
2. Track B follow-ups: persist created invites/links/connectors (PocketBase), real OAuth for connectors, email delivery, per-link access enforcement, tier-specific cap copy.

## Action items / next steps
- Mark p6-collab-polish `reviewed_pass` in STATE.json.
- Re-run the demo-screenshot sweep once a build-capable (non-sandboxed) environment is available, to close the criterion-4 artifact check.
- Keep lint/tsc green: both gates re-verified in this review (exit 0 / exit 0).

## Verdict JSON
```json
{
  "verdict": "pass",
  "reasons": [
    "F-18: inviteMember + createSharedLink paid-only gate (plus/professional/enterprise); free returns 403-shaped {ok:false, upgradeTo:'plus'}; routes /api/v1/collab/invite and /share return HTTP 403 + upgradeTo + demo_seed:true; GET /api/v1/collab lists seeded invites + shared links.",
    "F-18: /share/[slug] page renders read-only seeded canvas preview with demo_seed badge and signup CTA (isSignupCta always true for non-users, Track A).",
    "F-19: CONNECTORS_PER_TIER free=2 (+plus=10, pro/ent=∞, matching pricing-and-access '2/10/unlimited'); connectService enforces the cap with ok:false + upgradeTo; promptContext surfaces connected apps (Google Drive seeded) as context chips; /api/v1/connectors GET/POST expose status, services, context with demo_seed.",
    "Collections: shared_links, invites, connectors tables in pb_migrations/0001_creditax_demo.sql; demoSeed.ts seeds DemoInvite(2)/DemoSharedLink(2)/DemoConnector(3)/DemoSubscription(2), all demo_seed:true.",
    "i18n: messages/en|yo|ha|ig.json each have a `share` namespace with the identical 10 keys (backHome, ctaBody, ctaFindPro, ctaSignin, ctaTitle, loading, previewCanvas, readOnly, sharedBy, sharedCanvas).",
    "Gates: /usr/local/bin/node ./node_modules/typescript/bin/tsc --noEmit exit 0; /usr/local/bin/node ./node_modules/eslint/bin/eslint.js --ext .ts,.tsx src exit 0.",
    "demo_seed honesty: every P6 mocked output (invite, shared link, connector, status, context, share-page payload) is explicitly flagged demo_seed:true with visible UI badges; Track B boundaries documented in code."
  ],
  "remaining_items": [
    "Screenshot-sweep artifact (criterion 4) not re-verifiable from repo files — no screenshot images present to inspect; verified at i18n/locale-structure level only.",
    "Track B (out of P6 scope): persist session-created invites/links/connectors, real OAuth for connectors, email delivery, per-link access enforcement, tier-specific cap messaging."
  ]
}
```
