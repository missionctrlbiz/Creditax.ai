# P8 canvas-heart — independent review gate

**Verdict: PASS.** Every P8 exit criterion in `progress/STATE.json` was verified against the actual code; tsc and eslint both exit 0.

## Summary

`/dashboard/chat` is now the infinite-canvas workspace (roles-and-experience §3.2, mvp-demo-plan G-03, demo scope #4/#12): a pannable/zoomable board of positioned cards (answers, prompts, docs, skills, referrals, filing, walls, share links) with a docked composer and a live sidebar. All four P8 exit criteria hold against the real implementation, and the phase's gates (`tsc --noEmit` = 0, `eslint . --max-warnings 0` = 0) pass.

## Inputs reviewed

- `progress/STATE.json` (phase `p8-canvas-heart` items + exit criteria, status `awaiting_review`)
- `progress/RUNBOOK.md` (ground rules: STATE.json is source of truth, Track A honesty, tsc+lint gate)
- `src/app/[locale]/dashboard/chat/page.tsx` (canvas)
- `src/app/api/v1/chat/route.ts` (metering + doc context + 403 wall)
- `src/ai/quota.ts` (`meter`, `TIER_CAPS`, upgrade hints)
- `src/app/api/v1/documents/route.ts` + `src/ai/documents.ts` (`seedDocumentsForUser`, `getDocument`)
- `src/ai/referral.ts` (`buildReferralCard`)
- `src/ai/rag/index.ts` (`runRag` contextText param) + `src/ai/rag/llm.ts` (locale handling)
- `src/app/api/v1/connectors/route.ts` (connector prompt context)

## Key findings

### 1. Canvas is a board, not a thread — PASS

`page.tsx` renders an infinite canvas:
- Camera state `cam {x,y,z}` with pointer-drag panning on the stage background and wheel zoom around the cursor (`MIN_Z 0.4`–`MAX_Z 2.5`); zoom in/out/fit chrome.
- World transform on the card layer: `transform: translate(cam.x, cam.y) scale(cam.z)`, `transformOrigin: 0 0`; dot-grid parallax via `backgroundPosition: cam.x cam.y` and `backgroundSize: 24*cam.z`.
- Cards are `CanvasCard[]` with `kind` (user/answer/filing/referral/skill/wall/share/thinking), `pos {x,y}` and `width`, absolutely positioned (`left/top`) inside the transformed layer; each card is draggable by its top bar (screen delta ÷ zoom → world delta).
- Docked composer beneath the viewport (`bottom-3` center-aligned form) with skill chip rail, pinned-doc chip, input + send.
- Left sidebar: live library card, "Connected context" connector chips, live credits card.
- Not a vertical chat thread: initial greeting is anchored at world (60,40); batches alternate columns/lanes via `spawnAnchor()`.

### 2. exit1 — chat POST carries {userId, locale, tier, docId}; server meters; 403 renders wall card — PASS

- `ask()` fetch body: `{question, locale, userId: me.userId, tier: me.tier, loggedIn, docId: doc?.id}`.
- `me` is resolved from `getSession()` (pb-auth with mock fallback) mapped to a seed user id, so the tier is the *real session tier*.
- `chat/route.ts`: when `userId` present, calls `meter(userId, 'chat', {tier})` from `src/ai/quota.ts`; on `!gate.allowed` returns **403** with `blocked:true, upgrade, status` (free caps: 5 chats/day, 60 lifetime).
- Canvas: on `res.status === 403` it reads `data.upgrade`/`data.status`, pushes a `kind:'wall'` card rendering the named-limit message + upgrade CTA and refreshes the live quota sidebar.

### 3. exit2 — live library, attach pins doc context server-side — PASS

- Library = `GET /api/v1/documents?userId=…` → `seedDocumentsForUser(userId)` in `src/ai/documents.ts`: demo seed accounts get lazily seeded fixture docs through the *same deterministic extractor* the upload flow uses (idempotent, store-backed, `DEMO_USER_IDS` guard). The static LIBRARY array is gone; sidebar reads `d.documents`.
- Attach: `attach(doc)` sets `pinnedDoc`; `ask()` sends `docId`; `chat/route.ts` resolves it **server-side** via `getDocument(body.docId)` and builds a labeled `docContext` string (name/format/group/status/amount/category/period/warning), passed as the `contextText` param of `runRag` (`src/ai/rag/index.ts`), which prepends it to the LLM context and adds an "Attached document" citation.

### 4. exit3 — tier-aware referral, no hardcoded 'free' — PASS

- `buildReferralCard` in `src/ai/referral.ts` takes `{tier, loggedIn, …}`; contact reveal = paid tier (plus/professional/enterprise) OR `loggedIn === true`; otherwise masked. No literal tier value is hardwired inside the function.
- Canvas call site: `buildReferralCard({text, confidence: liveConfidence, tier: (me.tier || 'free') as Tier, loggedIn: me.loggedIn})` — the tier argument is the real session tier; `|| 'free'` is only a fallback for the initial pre-hydration state (default `me`), not a hardcoded assumption. `loggedIn` is derived from the session (consumer at demo@creditax.ai → false; other demo roles → true).

### 5. exit4 — skill chips + connector chips; localized answers; tsc+lint — PASS

- Skill chips: `SKILLS.map` renders a chip rail above the composer; `runSkillChip` POSTs `/api/v1/skills/:id` with `{tier: me.tier}` (metered, refreshes quota) with a local deterministic fallback; results are pinned as `kind:'skill'` canvas cards.
- Connected apps: sidebar "Connected context" card renders `connectors` from `GET /api/v1/connectors?userId&tier` (`promptContext(userId)` in `src/ai/connectors.ts`).
- Locale: `src/ai/rag/llm.ts` has `LOCALE_LANGUAGE` (en/Yoruba/Hausa/Igbo) and `LOCALE_LEAD` short localized lead-ins; `callLLM` instructs "Respond in {lang}" for Kimchi and the local synthesizer prepends `LOCALE_LEAD[locale]`; locale flows chat POST → route → `runRag(locale)` → LLM.
- Gates: `tsc --noEmit` → exit 0; `eslint . --max-warnings 0` → exit 0.

## Evidence / observations

- Free-tier caps verified in `TIER_CAPS.free`: `chatPerDay: 5`, `lifetimeChatCap: 60` — matches "5th free chat metered-blocked" semantics (5 allowed, 6th → 403 daily; lifetime 60).
- Upgrade hint message is tier-named and Naira-priced (`₦5,000/mo`), consistent with `pricing-and-access §5` and the currency rule.
- `demo_seed: true` preserved on the 403 payload, quota status, documents, connectors, and referral card — Track A honesty maintained.
- Sidebar quota card shows real counters (`chats.today/cap/lifetime`) and refreshes after each metered turn.

## Risks, gaps, uncertainty

- Non-blocking: when `me` is not yet hydrated (initial render), the canvas defaults `userId:'u-consumer'`, `tier:'free'` and the referral call uses the `|| 'free'` fallback for one possible turn; after `getSession()` resolves, real values take over. Acceptable for demo, but worth noting.
- The quota store is in-memory/session-scoped (Track A); PocketBase mirror is the Track B swap — call surface already stable per `src/ai/quota.ts` docs.
- `loggedIn` derivation (`role !== 'consumer' || email !== 'demo@creditax.ai'`) means a logged-in demo *consumer* still gets referral contact revealed; consistent with the "paid login reveals contact" rule only if the demo consumer is treated as logged-in — matches `buildReferralCard`'s `revealLogged` semantics as shipped.

## Recommendations

1. Mark `p8-canvas-heart` as `reviewed_pass` in STATE.json with this gate record and append the CHANGELOG line.
2. Advance to `p9-pro-portal` per STATE.json order.
3. Optionally (Track B / p12): seed the `u-consumer` demo quota near the 5/60 caps so the 403 wall is reachable in the scripted demo without five manual turns.

## Action items / next steps

- [ ] Update STATE.json: `p8-canvas-heart.status = reviewed_pass`, add `last_review` (verdict pass, tsc 0, lint 0).
- [ ] Append one line to `progress/CHANGELOG.md`.
- [ ] Commit: `phase: p8-canvas-heart — pass`.
- [ ] Start `p9-pro-portal` run.
