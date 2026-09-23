# P5-Boards Exit-Criteria Verification (Creditax.ai)

Date: 2026-09-23 · Reviewer: independent deep-analysis subagent · Phase: `p5-boards` (progress/STATE.json, status in_progress)

## Summary

All four P5-boards exit criteria verified against the actual code in `/Users/oyinkansolaarchibong/Desktop/creditax-ai`:

1. **F-14b** — marketplace profile contact gating: **met**. Deterministic tier policy in `src/ai/contact-gate.ts` + applied in `src/app/[locale]/marketplace/[proId]/page.tsx` with mock-session read.
2. **F-16** — admin KB publish → re-embed → instantly searchable in chat: **met (with one minor honesty nit)**. `publishKbDoc` writes into the exact cached vector store that `/api/v1/chat` reads; audit log present.
3. **F-17b** — admin users tab wired to data: **met (with minor hydrate defect)**. The page fetches `/api/v1/admin/users` (seed fallback only), status flips + invites hit real endpoints backed by `src/ai/user-admin.ts`.
4. **npm run lint passes**: **confirmed**, exit 0 via `/usr/local/bin/node` (v20.16.0). Typecheck (`tsc --noEmit`) also exit 0. No `test` script exists (per STATE.json notes; `package.json` confirms). Build is environment-blocked in the sandbox (same as prior phases) — not a P5 gate (P5 exit criteria = lint only).

**Verdict: PASS.** Non-blocking remaining items listed below.

## Inputs reviewed

- `progress/STATE.json` — phase `p5-boards`: items `marketplace-contact-gating`, `admin-kb-publish`, `admin-users-board` all marked `done`; exit criteria F-14b / F-16 / F-17b / lint.
- `research/project-roadmap.md` — no F-14b/F-16/F-17b entries found (feature IDs live in foundation docs, not the roadmap).
- Code: `src/ai/contact-gate.ts`, `src/app/[locale]/marketplace/[proId]/page.tsx`, `src/ai/kb-admin.ts`, `src/app/api/v1/admin/kb/route.ts`, `src/app/api/v1/admin/kb/publish/route.ts`, `src/app/[locale]/admin/knowledge-base/page.tsx`, `src/ai/rag/vector-store.ts`, `src/ai/rag/index.ts`, `src/app/api/v1/chat/route.ts`, `src/ai/user-admin.ts`, `src/app/api/v1/admin/users/{route.ts,[id]/route.ts,[id]/status/route.ts,invite/route.ts}`, `src/app/[locale]/admin/users/page.tsx`, `src/lib/seed/demoSeed.ts`, `src/lib/mock-auth.ts`, `package.json`.
- Gates run: `eslint .` (exit 0), `tsc --noEmit` (exit 0), `next build` (env-blocked), no test script.

## Key findings (per criterion)

### 1. F-14b — contact masked until logged-in per tier rules ✅

- `src/ai/contact-gate.ts` implements the pricing-and-access §2 policy as a pure function: anonymous → `masked_anonymous`; logged-in free → `masked_free`; logged-in paid → `logged_in_paid` (revealed). Deterministic `maskPhone` / `maskEmail` helpers keep the profile page honest.
- `src/app/[locale]/marketplace/[proId]/page.tsx` reads the mock session post-mount (`getSession()` from `src/lib/mock-auth.ts`, SSR-safe), maps role `personal` → `free` (stays masked even when logged in) and `pro/admin/author` → `professional` (revealed), and renders `shownPhone` / `shownEmail` through the policy. Contact action buttons show masked-suffix labels and an explanatory toast (`Sign in at a paid tier to reveal…`) when gated; revealed clicks toast an honest `DEMO_TOAST` ("Real contact details unlock once the marketplace backend ships").
- Pro phone/email data is fictional demo data; the page labels reviews as "illustrative sample data" and the map as a static preview — consistent Track A honesty.
- Minor: role→tier mapping is coarse (admin/author count as `professional`); documented in-file as the Track A demo gate; Track B swaps in a server session + per-user contact permissions.

### 2. F-16 — admin KB publish → re-embed → instantly searchable in chat ✅ (money shot is real)

Chain verified end-to-end in the source:

- `POST /api/v1/admin/kb/publish` (`route.ts`) → `publishKbDoc` (`src/ai/kb-admin.ts`) → `getVectorStore().ingest(title, slug, markdown)`.
- `getVectorStore()` (`src/ai/rag/vector-store.ts`) returns a **single module-level cached instance** (`SeededVectorStore` offline, `PocketBaseVectorStore` when reachable). The seeded backend's `ingest` upserts by slug (replacing the seeded doc's chunks or adding a new doc) with fresh embeddings via `embedTexts` (OpenRouter → local-hash fallback, provider recorded per chunk).
- `POST /api/v1/chat` (`src/app/api/v1/chat/route.ts`) → `runRag` → `retrieve` → the **same** `getVectorStore().search(...)`. So within one server process, a doc published by the admin is retrievable by the next chat call — "chat improves" is real, not faked.
- `publishKbDoc` also runs a verification probe (`store.search(\`${title} ${slug-words}\`, 5)`) and returns `searchableNow` + `topHit`; the admin KB page (`src/app/[locale]/admin/knowledge-base/page.tsx`) shows a proof panel ("indexed N chunks via {provider}… verified top-5 hit") and then re-fetches `GET /api/v1/admin/kb`.
- **Audit log: present.** In-memory `auditLog` in `kb-admin.ts` (action published/republished, actor, chunks, embedding provider, persisted, demo_seed), exposed via `GET /api/v1/admin/kb` (`audit` array) and rendered as the "Publish audit" card on the admin page. Track B = audit table (documented in file header).
- Honesty: `demo_seed` is propagated truthfully from the embedding provider (`local-hash` → true; live OpenRouter → false), shown as a badge in the proof panel and per-doc in the corpus grid.
- **Nit (non-blocking):** `searchable = results.some((r) => r.source === title) || results.length > 0` — the `|| results.length > 0` fallback makes `searchableNow` effectively always true whenever *any* chunks exist, so the "verified top-5 hit" label can appear even when the top hit is another doc. The underlying mechanism (new doc's chunks participate in chat ranking) is still real; the display claim is overstated.
- **Nit:** `listPublishedDocs` derives `demo_seed` from `store.backend === 'seeded'` — if the PocketBase backend is active but embeddings came from the local-hash fallback, docs would report `demo_seed: false`. Edge case only relevant when PB + fallback co-occur.

### 3. F-17b — admin users tab wired to data ✅ (with minor hydrate defect)

- `src/app/[locale]/admin/users/page.tsx` **fetches** `/api/v1/admin/users` on mount and replaces the board when the endpoint returns users; `SEED_USERS` is only the initial/offline fallback (not the sole source). Status toggles POST `/api/v1/admin/users/:id/status`; the Add-User button POSTs `/api/v1/admin/users/invite` and prepends a row; a "{N} users · wired to data" badge appears once live.
- Endpoints are backed by real (in-memory) state in `src/ai/user-admin.ts` — `listUsers/getUser/setStatus/inviteUser` mutating a module-scoped `Map` seeded from `seedUsers` (`demo_seed: true` throughout; every response carries `demo_seed: true`). This satisfies "wired to data, not a hard-coded array."
- **Defect (non-blocking):** the fetch mapping hard-codes `status: 'Active'` instead of using the server-provided `u.status`, so a user suspended server-side would render Active after a page reload until the local toggle state overrides it. Also the decorative stat cards (1,247 / 387 / 43) are static with no demo labeling, the Edit modal's save is a `console.log` stub, and the role select lacks the Author option — cosmetic demo gaps, not criterion failures.

### 4. npm run lint ✅

- `eslint .` via `/usr/local/bin/node` (v20.16.0, app-bundled node shim avoided): **exit 0, no findings**.
- `tsc --noEmit -p tsconfig.json`: **exit 0**.
- `package.json` has **no `test` script** — verification is build + lint per STATE.json notes; not a P5 requirement.
- `next build` (Turbopack) fails inside the sandbox: the Rust worker panics writing its panic log to a `/var/folders/…/agnes-sandbox-…` path (filesystem restriction), the same `env_blocked` signature recorded in every prior phase review. No code-level error surfaced; tsc + lint both clean. P5 exit criteria gate on lint only, so this does not block the phase.

## demo_seed honesty check ✅

- KB publish: `demo_seed` from the embedding provider (`local-hash` ⇒ true) on the IngestResult, audit entry, route response, and admin-page badges.
- Users board: all `user-admin.ts` responses carry `demo_seed: true`; invite rows flagged.
- Marketplace profile: demo toasts on mocked contact actions; sample-data labeling on reviews; static-map disclaimer.
- Chat: unchanged from P2/P3 reviews (demo_seed computed from embedding + LLM provider truthfully).
- Only gap found: users-page stat cards are unlabeled static numbers (cosmetic).

## Risks / gaps / uncertainty

| # | Item | Severity |
|---|------|----------|
| R1 | F-16 `searchableNow` weak-OR (`\|\| results.length > 0`) can claim "verified top-5 hit" when topHit is a different doc | minor (display honesty) |
| R2 | F-17b hydrate drops server `u.status` (hard-codes `'Active'`) — suspended users re-appear Active on reload | minor (data fidelity) |
| R3 | `listPublishedDocs` demo_seed by `backend === 'seeded'` mis-reports when PB store + local-hash fallback co-occur | edge case |
| R4 | Build env-blocked in sandbox (Turbopack panic-log EPERM-class failure); needs one full-access re-run to close build | non-blocking for P5 (lint-only gate) |
| R5 | F-14b role→tier mapping lumps admin/author into `professional`; client-side mock auth, not a server session | known Track A limitation, documented |
| R6 | Users board stat cards / edit-modal save / delete button are unlabeled decorative stubs | cosmetic |

## Recommendations / action items

1. Tighten F-16 verification: `const searchable = results.some((r) => r.source === title);` and show "not in top-5 yet" otherwise.
2. Map server status in the users page fetch: `status: u.status === 'suspended' ? 'Suspended' : 'Active'` (and surface `demo_seed` on the stat row or mark it "demo stats").
3. Base `listPublishedDocs` demo_seed on chunk embedding providers (any local-hash ⇒ true), not the backend flag.
4. Re-run `next build` in full access (non-sandboxed) to convert the standing env_blocked build to pass.
5. Track B (already documented in headers): server-side contact-reveal call with real tier check; PocketBase `kb_docs`/`kb_chunks` + Trigger.dev re-index; audit log as a table; `users` collection + permission-checked status changes.

## Verdict

**PASS** — all four P5-boards exit criteria are satisfied by the code; lint and typecheck are clean; demo_seed honesty holds on all P5 outputs. Remaining items R1–R6 are non-blocking refinements.
