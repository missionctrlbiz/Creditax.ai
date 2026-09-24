# OPENCODE CONTINUATION — paste this into opencode (full-access machine, no blocking)

> **STATUS (2026-09-24): p17 COMPLETE.** All fa-1…fa-6 closed on the full-access
> machine. This prompt is retained for the record. Remaining operator actions (not
> code): supply Mono `test_sk_*` + sandbox kv/kvn to flip fa-3 to `mono-sandbox`;
> add PSP test keys to exercise fa-4 (charged stays false until live).

> The creditax-ai 20-phase chain (core-api → p16-key-sweep) is complete: every phase
> `reviewed_pass` in `progress/STATE.json`. What remains is the blocked batch
> **p17-full-access-followups** (fa-1…fa-6) — work the sandboxed Agnes box could not
> finish: the real `next build`, live Mapbox smoke, Mono sandbox 2xx, PSP test keys,
> screenshot capture, and the investor deck. This prompt runs it in opencode, which has
> no approval blocking. Read `progress/STATE.json` (see `full_access_followups` +
> `p17-full-access-followups`), `progress/KEY-MAP.md`, `progress/KEY-AUDIT.md`, and
> `progress/CHANGELOG.md` before touching anything.

---

## PROMPT (paste below into opencode, in the creditax-ai repo root)

> You are continuing the creditax-ai build. The 20-phase runner chain is complete
> (`progress/STATE.json`, all `reviewed_pass`); you are now executing the blocked
> batch `p17-full-access-followups` (fa-1…fa-6) on this full-access machine.
>
> **Read first:** `progress/STATE.json` (fields `full_access_followups` + phase
> `p17-full-access-followups`), `progress/KEY-MAP.md`, `progress/KEY-AUDIT.md`,
> `progress/CHANGELOG.md` (last ~10 lines). Branch `ui-ux-refactor` is clean at the
> last commit; keep each step its own commit, prefix `fa-<n>:`.
>
> **Safety rules (non-negotiable):**
> - NEVER commit `.env` or any key value; mask keys in logs/notes. Only `.env.example`
>   (placeholders) is tracked.
> - Mono is **sandbox-only** (`MONO_ENVIRONMENT=sandbox`); PSP work is test-mode only;
>   `charged` must remain `false` (code guarantee in `src/ai/payments.ts`).
> - Track A honesty: anything still mocked must keep its `demo_seed` / `geo:demo`
>   label. If a live call fails (e.g. token 401), say so honestly in the changelog
>   and keep the demo path as the verified branch — do not fake success.
> - No new Agnes scheduled tasks; opencode has no blocking, so just run it.
>
> **Steps, in order (one commit each):**
>
> 1. **fa-1 build gate.** `npm run build` (real network, no sandbox EPERM). On green,
>    flip every `last_review.gates.build: env_blocked` in STATE.json to
>    `pass (full-access run <date>)`, add a CHANGELOG line, commit
>    `fa-1: build-gate-closeout — full-access build green`.
> 2. **fa-2 Mapbox live smoke.** Ensure `.env` has a Mapbox token with Geocoding v5 +
>    Static Images scopes (the stored one 401'd — refresh/authorize if needed). With
>    the dev server up, verify: `GET /api/v1/marketplace/reverse?lat=6.45&lng=3.39`
>    returns `geo_source: "mapbox"`; `POST /api/v1/marketplace/search` with
>    `originAddress: "Lagos Island"` geocodes; `/marketplace` map panel shows a real
>    raster overlay. Commit `fa-2: mapbox live geo — <outcome>`.
> 3. **fa-3 Mono live 2xx.** Call `GET /api/v1/credit/score?kv=<sandbox kv>&kvn=<sandbox kvn>`
>    (values from the Mono sandbox dashboard — never commit them). Expect
>    `data_source: "mono-sandbox"` on a 2xx. Commit `fa-3: mono sandbox live — <outcome>`.
> 4. **fa-4 PSP test keys (only if FLUTTERWAVE_*/PAYSTACK_* test keys exist).** Verify
>    `pspConfigured()` resolves a provider and `POST /api/v1/quota/tier` billing
>    surfaces it; `charged` must stay `false`. Commit `fa-4: psp test-mode — <outcome>`.
> 5. **fa-5 screenshots A–G.** Follow `assets/demo-screenshots/README.md`: dev server
>    up, capture every manifest entry at desktop 1440×900 (+ mobile 375×812 for the
>    key flows marked). Save as `<section><n>-<slug>[-desktop|-mobile].png` under
>    `assets/demo-screenshots/`. Every simulated-data capture must visibly show the
>    demo_seed/live badge. Mark the README "Capture status" done. Commit
>    `fa-5: demo-screenshots A-G captured`.
> 6. **fa-6 investor deck + paper outline.** Landscape PPTX deck consuming the fa-5
>    captures, per `research/mvp-demo-plan.md` §7 (deck comes after screenshots +
>    pitches). Also draft the academic-paper outline (A4, 10–20pp: idea, context,
>    architecture, cost-benefit, investment, revenue streams, 3-year forecast) as a
>    Markdown doc under `research/`. Commit `fa-6: investor deck + paper outline`.
>
> **When done:** mark all `p17-full-access-followups` items `done`, set
> `current_phase` to `none (p17 complete)`, add the final CHANGELOG line
> (`2026-09-24 — p17 — all fa items complete — <summary>`), commit STATE + changelog,
> and report each fa step's honest outcome (pass / 401 / unreachable / skipped + why).
