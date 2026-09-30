# CONTINUATION — Full-Access Run (hand-off prompt)

> **Status:** Chain complete. All 20 phases (core-api → p16-key-sweep) are
> `reviewed_pass` in `progress/STATE.json`. Final tree commit: `7c3dc36`
> (branch `ui-ux-refactor`). Idle scheduled tasks (p13 one-shot runner +
> recurring watchdog) were deleted on 2026-09-24 — **do not recreate them**.
>
> **This prompt is for the NEW, full-access machine** (real network, no OS
> sandbox restrictions, browser + dev server available). It picks up the work
> that the sandboxed authoring box could not finish. Copy the "PROMPT" block
> below into a fresh session on that machine.

---

## Why this machine matters

The authoring box had no outbound network permission and an OS-level EPERM
that blocked the Turbopack build worker. That left four honest, open ends:

1. **Build gate env-blocked** — every phase recorded `build: env_blocked`;
   tsc + lint passed everywhere, `next build` was never actually green.
2. **Mapbox live geo** — token present but 401 on Geocoding (not authorized);
   the demo fallback path was live-tested, the live path is not.
3. **Mono sandbox 2xx** — `sandbox.api.mono.co` unreachable; fail-closed
   null → demo seed was the live-tested branch, `data_source: mono-sandbox`
   was never exercised with a real 2xx.
4. **Screenshots A–G** — the manifest in `assets/demo-screenshots/README.md`
   is pending capture (needs dev server + browser). It feeds the investor deck
   (mvp-demo-plan §7 order: screenshots → pitches → deck + paper).

---

## PROMPT (paste this into the new session)

> Continue the creditax-ai build on this full-access machine. Read
> `progress/STATE.json` (all 20 phases reviewed_pass; follow-ups under
> `full_access_followups`), `progress/KEY-MAP.md`, `progress/KEY-AUDIT.md`,
> and `progress/CHANGELOG.md` before touching anything. Branch
> `ui-ux-refactor` is clean at `7c3dc36`; keep this run as its own commit(s),
> never re-commit `.env` or key values (mask in logs/notes).
>
> Then, in this order:
>
> **1. Build gate (fa-1).** Run `npm run build`. On green, update every
> phase entry in STATE.json whose `last_review.gates.build` says
> `env_blocked` → `pass (full-access run <date>)`, add one CHANGELOG line,
> commit as `phase: build-gate-closeout — full-access build green`.
>
> **2. Mapbox live smoke (fa-2).** Confirm a Mapbox token with Geocoding v5
> + Static Images scopes is in `.env` (swap the 401 one for an authorized
> token if needed). Then verify, with the dev server up:
> - `GET /api/v1/marketplace/reverse?lat=6.45&lng=3.39` → `geo_source: "mapbox"`
> - `POST /api/v1/marketplace/search` with `originAddress: "Lagos Island"`
>   → geocoded origin, pros sorted by distance
> - `/marketplace` map panel loads a real Mapbox raster overlay (no broken image)
> Record results in CHANGELOG; if the token still 401s, say so honestly and
> keep the demo path as the verified branch.
>
> **3. Mono live 2xx (fa-3).** With outbound network, call
> `GET /api/v1/credit/score?kv=<MONO_SANDBOX_KV>&kvn=<MONO_SANDBOX_KVN>`
> (sandbox values from Mono dashboard, **never commit them**). Expect
> `data_source: "mono-sandbox"` on a 2xx; confirm `charged`/demo honesty
> elsewhere is untouched. Add a CHANGELOG line.
>
> **4. PSP test keys (fa-4, only if keys exist).** If FLUTTERWAVE_*/
> PAYSTACK_* test keys are present, verify `pspConfigured()` resolves a
> provider and `POST /api/v1/quota/tier` billing surfaces it. `charged`
> MUST remain `false` (code-level guarantee in `src/ai/payments.ts`).
>
> **5. Screenshot capture A–G (fa-5).** Follow
> `assets/demo-screenshots/README.md`: dev server up, capture every entry at
> desktop 1440×900 (mobile 375×812 for the key flows marked in the manifest).
> Save as `<section><n>-<slug>[-desktop|-mobile].png` in
> `assets/demo-screenshots/`. Every simulated-data capture must show the
> demo_seed/live badge (Track A honesty rule). Update the README
> "Capture status" to done with the list.
>
> **6. Investor deck (fa-6).** Build the landscape investor deck consuming
> the fa-5 screenshots, per mvp-demo-plan §7 (after screenshots + client
> pitches). Draft the academic-paper outline (A4, 10–20pp: idea, context,
> architecture, cost-benefit, investment, revenue streams, 3-year forecast)
> as a Markdown doc under `research/` when time allows. Deck = PPTX artifact.
>
> Commit cadence: one commit per step above, message prefix `fa-<n>:`,
> e.g. `fa-2: mapbox live geo smoke — token authorized, geo_source=mapbox`.
> Do not open new phase-runner/watchdog scheduled tasks; the chain is done.

---

## Checklist for the new machine

- [ ] fa-1 `npm run build` green → STATE.json `build` fields → pass
- [ ] fa-2 Mapbox authorized token → `geo_source: mapbox` on reverse + search; overlay raster loads
- [ ] fa-3 Mono sandbox 2xx → credit/score `data_source: mono-sandbox`
- [ ] fa-4 PSP test keys (if present) → provider resolved, `charged: false`
- [ ] fa-5 screenshots A–G captured into `assets/demo-screenshots/`
- [ ] fa-6 investor deck (PPTX, landscape) + paper outline (Markdown)
- [ ] No `.env` or key values committed; no new scheduled tasks
