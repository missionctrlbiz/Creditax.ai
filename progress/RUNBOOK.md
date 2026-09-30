# CREDITAX PHASE 2 — RAG PIPELINE (shareable run prompt)

Paste into a fresh Agnes Code session bound to `/Users/oyinkansolaarchibong/Desktop/creditax-ai`:

---

**Task:** load the project skill `phase-runner` with argument `run rag-pipeline` and execute this phase my way.

**Ground rules (my build style — non-negotiable):**
1. `progress/STATE.json` is the source of truth. Re-read it before and after every step; never trust this prompt over it.
2. Build P0 items first, P1 only if the phase stays green. One phase at a time, in STATE.json `order`.
3. Track A honesty: this is the demo architecture. Anything mocked must be labeled `demo seed` / `demo_seed: true` in responses, exactly like `src/app/api/v1/chat/route.ts` already does. Never present mocked data as production.
4. Work only on top of what exists: `src/ai/rag/` (chunker, similarity, embeddings with local-hash fallback, llm) and routes `POST /api/v1/chat`, `POST /api/v1/rag/search` are already committed. Verify them; extend, don't rebuild.
5. Toolchain: `/usr/local/bin/node` + system npm only (the app node/npx shims are broken). Network-enabled shell calls only when reaching the registry. Write only inside the project or `.agnes/work/`. Never commit secrets.
6. Definition of done: `npm run build` AND `npm run lint` pass.

**Phase 2 scope (rag-pipeline):**
- P0: vector store setup (Track A: in-memory/pgvector-shaped interface over PocketBase + seeded KB; Track B target: Supabase pgvector), ingest `scripts/kb/*.md` (NTA 2023, NTAA 2023, FIRS VAT guide, PAYE/PIT, WHT circulars, TCC guide) with chunking + embeddings, end-to-end `POST /api/v1/chat` returning answer + citations + confidence, `GET /api/v1/tax/rules/:topic` retrieval.
- P1: webhook callback stub for async chat responses, per-user conversation history, multi-turn context.
- Embeddings: keep the provider-swap pattern from `src/ai/rag/embeddings.ts` (primary provider → deterministic local-hash fallback, flagged).

**Review gate:** before advancing, delegate an independent subagent to check every exit criterion in STATE.json against the actual code (fresh eyes, not your own). I do not advance on self-review.

**Bookkeeping (every run):** update STATE.json items + `last_updated`, append one line to `progress/CHANGELOG.md`, write a session log to `.agnes/work/sessions/YYYY-MM-DD-rag-pipeline-<attempt>.md`, commit phase work as `phase: rag-pipeline — <verdict>`.

**Failure handling:** up to 3 passes per attempt. Pass → chain the next step per the skill. Fail on pass 3 → mark blocked, write `progress/BLOCKED-rag-pipeline.md`, stop.

**Out of scope:** core-api open items (auth/verify, api-keys, rate limit) — leave them; note in the session log what remains. No new phases not in STATE.json.

---
