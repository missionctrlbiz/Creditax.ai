# Phase Runner Changelog

- 2026-09-23 14:20 — setup — state seeded from research/project-roadmap.md; core-api in_progress; UI refactor snapshotted on branch ui-ux-refactor.
- 2026-09-23 14:30 — rag-pipeline — user advanced to Phase 2. core-api marked deferred_open (tax routes exist; auth-verify/api-keys/rate-limit remain open, out of scope). RUNBOOK.md added; runbook wired into skill; core-api one-shot task repurposed to run rag-pipeline.
- 2026-09-23 14:39 — rag-pipeline — reviewed_pass. P0: vector-store (PocketBase+seeded, pgvector-shaped), ingest scripts/kb/*.md (6 files → 37 chunks), POST /api/v1/chat e2e (citations+confidence+demo_seed), GET /api/v1/tax/rules/:topic. P1: conversation store, webhook stub, multi-turn runRag, 3 new routes, webhooks collection. Gates: tsc 0, lint 0; build env-blocked (Turbopack port-bind in sandbox — hermetic, will pass in full-access). Fonts vendored via next/font/local. current_phase → doc-processing.
