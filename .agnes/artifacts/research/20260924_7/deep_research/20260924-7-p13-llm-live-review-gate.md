# P13 LLM-Live — Independent Review Gate

**Verdict: PASS** (all 3 exit criteria + P13 ground hold against the actual code; 2 non-blocking notes recorded)

Reviewed 2026-09-24 against `progress/STATE.json` phase `p13-llm-live`, verifying every claim against source files rather than session notes.

## Inputs reviewed
- `progress/STATE.json` — p13 exit criteria, `gate: gated_until_p12_complete` (p12 last_review2 = pass, 2026-09-23T23:40, so the gate was met when p13 ran; items still `todo` in STATE — bookkeeping only, not an exit-criterion failure)
- `progress/RUNBOOK.md`, `progress/KEY-MAP.md`, `progress/CHANGELOG.md`
- `src/ai/rag/llm.ts`, `src/ai/rag/embeddings.ts`, `src/ai/rag/vector-store.ts`, `src/ai/rag/index.ts`, `src/ai/rag/similarity.ts`
- `.env.example` (tracked manifest) and live `.env` key **names** only (values masked; `.env` is gitignored and correctly uncommitted)
- Gate runs: `tsc --noEmit` and `eslint --max-warnings 0 src`, both via `/usr/local/bin/node`

## Key findings

### Criterion 1 — LLM provider order + manifest reconciliation: **HOLDS**
- `llmEndpoints()` builds LITELLM first (llm.ts:61–72, reads `LITELLM_API_KEY` / `LITELLM_BASE_URL`), KIMCHI second (llm.ts:74–82, reads `KIMCHI_*`); `callLLM` (llm.ts:149–163) falls through to `localSynthesize` (llm.ts:170) — LITELLM → KIMCHI → local-synthesizer, exactly the required order.
- `.env.example` LLM section declares "LITELLM.dev (primary, OpenAI-compatible)" and the code reads `LITELLM_*` vars — the old code-vs-manifest mismatch (committed llm.ts read only `KIMCHI_*`) is resolved.
- Model resolver: `LITELLM_MODEL → KIMCHI_MODEL → 'minimax-m2.7'` (llm.ts:49–53), matching KEY-MAP.md verbatim.
- KEY-MAP.md records the decision: LITELLM row "Canonical primary LLM … Live 200 verified with model `agnes/agnes-3.0-flash`"; KIMCHI row "legacy second leg (after LITELLM)… Model resolver: `LITELLM_MODEL → KIMCHI_MODEL → minimax-m2.7`".

### Criterion 2 — Embeddings cascade + metadata: **HOLDS**
- `LEGS = [openrouterLeg, huggingfaceLeg, vertexLeg]` (embeddings.ts:200) with local-hash as the unconditional last resort in `embedTexts` (embeddings.ts:223) — OpenRouter → HF → Vertex → local-hash, matching `.env.example` order; each leg is a real implementation (OpenRouter batch embeddings, HF Inference API `:embeddings`-shaped call with legacy URL form, Vertex REST `:predict` + SA-JWT→OAuth token exchange).
- Vertex leg is present but runtime-skipped: `enabled()` requires all of `VERTEX_AI_PROJECT_ID && VERTEX_AI_REGION && GOOGLE_APPLICATION_CREDENTIALS_PATH` (embeddings.ts:162–165); live `.env` has none of these three keys → unused-track-B, honestly labeled in KEY-MAP.md.
- Sticky provider lock: `lastLiveProvider` (embeddings.ts:72) with `resetEmbeddingProviderLock` / `activeEmbeddingProvider` hooks (embeddings.ts:76–82); `embedQuery` (embeddings.ts:233–250) passes the sticky provider and force-matches a width-compatible provider when `targetDimension` is given, keeping a chunk batch and its query on the same vector width.
- `filterSameDimension` (embeddings.ts:252–258) is used in `vector-store.ts:189` (seeded) and `vector-store.ts:297` (PocketBase) with `demo_seed ||= comparable.dropped` — cross-provider vectors are dropped, not 0-scored (necessary: `cosineSimilarity` returns 0 on length mismatch, similarity.ts:10).
- `rag/index.ts:130` exposes `providers: { embedding, llm: llm.provider, llm_model: llm.model }` on every result, and the chat route spreads it into the HTTP response (route.ts:129) — the chosen providers are logged in response metadata.

### Criterion 3 — demo_seed honesty + lint 0: **HOLDS**
- `runRag` (index.ts:131): `demo_seed: demo_seed || llm.provider === 'local-synthesizer'`. A live LLM answer returns provider `'litellm'` or `'kimchi'` (llm.ts:151, 160) — no code path can set the LLM term true after a live answer. The embedding term is only true for local-hash vectors, dropped cross-provider vectors, or an empty query vector (vector-store.ts:201, 307) — truthful, never optimistic. The only other `demo_seed: true` in the chat route is the 403 quota wall (route.ts:79), which is a blocked response, not an answer.
- Gate runs on `/usr/local/bin/node`: `tsc --noEmit` → exit 0; `eslint --max-warnings 0 src` → exit 0. Both green.

### P13 ground — probe evidence in code: **HOLDS**
- `.env.example` now sets `LITELLM_MODEL=agnes/agnes-3.0-flash` with a comment: "the host's live catalog is 41 models (see GET /v1/models); minimax-m2.7 is NOT currently listed there… re-check the catalog before pinning a model" — the required minimax-m2.7 → agnes/agnes-3.0-flash fix with catalog-check note.
- KEY-MAP.md LITELLM row records the live 200 probe with model `agnes/agnes-3.0-flash`; OpenRouter row records the live 2048-dim nemotron width and that "runtime tracks actual width via PROVIDER_DIMS/dimension + sticky lock" (the embedTexts/embedQuery width-consistency probe result).
- HF endpoint-host note is in code: embeddings.ts:49–52 ("the host path must match the model you set (HF Inference API legacy URL form)").

## Risks, gaps, or uncertainty (non-blocking)
1. **`providerFromVector` heuristic** (embeddings.ts:58–63) maps any ≥385-dim vector to `'openrouter'`, so a hypothetical 768-dim Vertex vector recovered from untagged legacy storage would be mislabeled in the fallback path only; both backends record `embeddingProvider`/`metadata.provider` at ingest (vector-store.ts:177, 262), so this is exercised only on rows predating the metadata field. The `dimension` field on `EmbedResult` (embeddings.ts:217, 223) is the reliable runtime width source; `PROVIDER_DIMS.openrouter = 768` while the live nemotron key actually returns 2048-dim — `PROVIDER_DIMS` is a known-width table used for the sticky/dim-matching logic, and the live width is tracked separately via `dimension`, so ranking stays honest, but the table no longer reflects the live OpenRouter width. Worth a Track-B note when OpenRouter model choices change.
2. **STATE.json bookkeeping**: p13 items are still all `todo` and `last_review: null` — the review that clears them (this gate) has not yet been written back. Suggested update: mark the 6 items done, set `last_review` to this verdict.
3. **Vertex leg** remains unused-track-B (all three GCP vars empty in live `.env`) — correctly labeled, no risk of silent faking.

## Recommendations / next steps
- Write this gate result back into `progress/STATE.json` (p13: items done, `last_review` pass, `last_updated`, CHANGELOG line, session log) and commit the p13 tree — the tree currently has 7 uncommitted modified files (.env.example, KEY-MAP, STATE.json, embeddings.ts, index.ts, llm.ts, vector-store.ts).
- Optional hardening for p16 key-sweep: store the actual vector `dimension` alongside `embeddingProvider` in `kb_chunks.metadata` so `embedQuery`'s width matching never relies on `PROVIDER_DIMS` static widths (the KEY-MAP OpenRouter 2048-dim note already anticipates this).
- Clear to advance p14-mapbox-geo; its gate (`gated_until_p12_complete`) is satisfied.
