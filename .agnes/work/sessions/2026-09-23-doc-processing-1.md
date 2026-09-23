# Session log — 2026-09-23 — doc-processing (attempt 1)

## Verdict: **reviewed_pass** (independent subagent)

## Scope built (all P0; no P1 defined for this phase)
- **Deterministic extractor** `src/ai/doc-extract.ts` — filename fixtures + rawBody
  number heuristic → {amount, category, group, confidence, demo_seed:true}. No
  OCR/LLM; real vision is a Track B swap behind the same interface.
- **Document + report store** `src/ai/documents.ts` — in-memory primary,
  optional PocketBase mirror (`documents` table). `processDocument`,
  `createReport` (aggregates totals + by-category), `getReport`/`listReports`.
  Reports use the async `processing|completed` shape so a Track B worker can
  flip the state.
- **API routes**:
  - `POST /api/v1/documents/upload` + `GET /api/v1/documents`
  - `POST /api/v1/reports` (returns `poll` link) + `GET /api/v1/reports/:id`
- **Schema**: added `documents` collection; aligned `reports.demo_seed` default → 1.
- **UI wiring**: upload page `runTask()` now calls the live extractor with an
  offline fallback to the simulated values (click-through still completes).

## Gates
- tsc 0 · eslint 0 · build env_blocked (Turbopack EPERM in sandbox)
- Offline harness: VAT invoice → ₦620,500 conf 0.94; unclear → needs-review 0.31;
  rawBody heuristic → ₦600,000; report totals ₦715,500; poll → completed.

## Review notes (remaining, out of scope / Track B)
- No real webhook callback delivery (satisfied via polling).
- No durable worker (Trigger.dev); `processing` is a shape, results in-memory.
- core-api open items still deferred.
