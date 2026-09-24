# P12 Demo Polish — Independent Review Gate

**Verdict: FAIL** (residual dead buttons in `src/app/[locale]/pro/clients/[id]/page.tsx` violate the exit criterion "Every button resolves to a real handler")

Review scope: verify the p12-demo-polish exit criteria in `progress/STATE.json` against actual code. All 7 named dead buttons and all non-button criteria pass; one residual violation found.

## Inputs reviewed
- `progress/STATE.json` → p12-demo-polish phase block (exit criteria ×3, items ×4, last_review claims)
- `src/app/[locale]/developers/reference/page.tsx`, `developers/sdks/page.tsx`, `developers/webhooks/page.tsx`, `pro/clients/[id]/page.tsx`
- Repo-wide `<Button`/`<button` sweep in `src/app` (handler/Link-wrapping check on all 5 focus files; repo-wide grep for remaining no-`onClick` candidates)
- `src/app/globals.css`
- `src/app/[locale]/dashboard/documents/page.tsx`, `dashboard/usage/page.tsx`
- `research/mvp-demo-plan.md` §4/§5, `assets/demo-screenshots/README.md`
- 24 demo-beat route files under `src/app/[locale]/` + `src/app/api/v1/admin/kb/`
- Gates: `tsc --noEmit`, `eslint --max-warnings 0 src` (run via `/usr/local/bin/node`)

## Key findings

### 1. Dead-button audit — PASS for the 7 named buttons, FAIL on residuals
All seven p12-target buttons resolve to real handlers:
| Button | File | Resolution |
|---|---|---|
| Try in Sandbox | `developers/reference/page.tsx:466` | `onClick={goToSandbox}` → `router.push(/${locale}/developers/sandbox)` (def at line 137) |
| Request Library | `developers/sdks/page.tsx:353` | multi-line `onClick={() => toast('Library requested (demo)', …)}` |
| Edit / Delete endpoint | `developers/webhooks/page.tsx:235/239` | both multi-line `toast('Edit endpoint (demo)'/'Endpoint removed (demo)')` |
| Test Endpoint | `developers/webhooks/page.tsx:492` | `toast('Test delivery sent (demo)', …)` |
| View Error Logs | `developers/webhooks/page.tsx:303` | native button, `toast('Error logs (demo)', …)` |
| View Payload | `developers/webhooks/page.tsx:362` | native button, `toast('Payload inspector (demo)', …)` |
| Upload Document | `pro/clients/[id]/page.tsx:491` | `<Button>` wrapped in `<Link href="/dashboard/documents/upload">` (route exists) |
| Generate Compliance Report ×2 | `pro/clients/[id]/page.tsx:388, 690` | `toast('Compliance report queued for …', …)` |
| Message Client | `pro/clients/[id]/page.tsx:402` | `toast('Message drafted for …', …)` |

**FAIL (residual):** `pro/clients/[id]/page.tsx` still contains **10 native icon-only `<button>` elements with no onClick/onKeyDown at all** (i.e. genuinely no-op, worse than empty-onClick):
- L283 "Message" icon, L290 "Edit" icon (client header card)
- L541/548/555 "View/Download/More" per document row
- L612/619/626 "View/Download/More" per filing row
- L665/672 "Download/More" per report row

The exit criterion is global — "Every button resolves to a real handler (no console.log stubs / empty onClick)". The last_review note ("Last 7 dead buttons wired") only covered the 7 named buttons and did not sweep native `<button>` icon rows in the same file.

Other files scanned: repo-wide grep for `<Button` without same-line `onClick` was followed up per-block; residual no-handler candidates outside the focus files are all legitimate (`type="submit"` form buttons, or `<Button>` wrapped in `<Link>`, e.g. `admin/marketplace` "View" at L204 is inside `<Link href="/admin/professionals">`). No other dead `<Button>` components found.

### 2. console.log stubs — PASS
Repo grep in `src/app`: only 3 hits, all non-runtime:
- `developers/quickstart/page.tsx:64` — `console.log('Tax calculated:', response.data);` inside a backtick template-literal JS code example (displayed to user)
- `developers/page.tsx:125` — `console.log(response.data);` inside the same style of template-literal example
- `admin/users/page.tsx:235` — a *comment* ("was a console.log dead button"), not a call
No runtime `console.log` stubs in `src/app`.

### 3. globals.css — PASS
- `.container` utility at L259 (plus 64rem media override L267) inside `@layer utilities`
- All six keyframes present: `fade-in` L430, `zoom-in` L434, `fade-out` L438, `zoom-out` L442, `slide-in-up` L446, `slide-in-down` L450
- data-state rules L455–464: `[data-state='open']` (+ `.fade-in-0/.zoom-in-95/.slide-in-up/.slide-in-down` modifiers) and `[data-state='closed']` (fade-out + zoom-out)
- Font vars L5–7: `--font-inter`, `--font-syne`, `--font-jetbrains-mono`; wired into `--font-sans/--font-display/--font-mono` L71–73

### 4. Stale toast imports — PASS
`dashboard/documents/page.tsx` and `dashboard/usage/page.tsx`: grep for `toast|Toast` returns **zero** matches in either file. (Both files' only buttons use `window.location.href` navigation — usage L215 → `/pricing`, documents L102 → `/dashboard/documents/upload`, route exists.)

### 5. Demo-script beats → live routes — PASS
§4's 8 beats map to existing routes (all 24 checked, all `OK`):
| Beat | Screen | Route file |
|---|---|---|
| 0–1 Hook | Landing | `[locale]/page.tsx` |
| 1–2 Signup→answer | Dashboard + canvas | `dashboard/page.tsx`, `dashboard/chat/page.tsx` |
| 2–4 Upload+calc | Canvas + sidebar | `dashboard/documents/upload` (dir exists) |
| 4–5 Credit snapshot | Credit page | `dashboard/credit/page.tsx` |
| 5–6 Pro referral | Marketplace | `marketplace/page.tsx`, `marketplace/[proId]/page.tsx` |
| 6–7 Pro/Admin | Pro portal + admin | `pro/dashboard`, `pro/clients/[id]`, `pro/calculations`, `pro/verify`, `admin/dashboard`, `admin/professionals`, `admin/knowledge-base` ✔ (KB at `/admin/knowledge-base` confirmed) |
| 7–8 Money+API | Pricing→developers | `pricing/page.tsx`, `developers/{quickstart,sandbox,reference,webhooks}` |

`/api/v1/admin/kb` exists (`route.ts` + `publish/`), supporting beat F3's audit-log claim.

### 6. Screenshot manifest — PASS
`assets/demo-screenshots/README.md` covers sections **A–G** with per-entry route + state tables, each section header explicitly tagged with its §4 beat range (A beats 0–1, B 1–3, C 4/8, D 5, E 6, F 6, G 7–8). Capture status honestly marked "pending — dev server required (full-access)"; naming convention and demo_seed-badge rule documented.

### 7. Gates — PASS
- `tsc --noEmit` (via `/usr/local/bin/node node_modules/typescript/bin/tsc`): **exit 0, zero output**
- `eslint --max-warnings 0 src` (via `/usr/local/bin/node node_modules/eslint/bin/eslint.js`): **exit 0, zero output**
- `next build`: not re-run here (environment-blocked in sandbox per STATE.json note; not a code defect — matches prior review's `env_blocked` classification)

## Risks / gaps / uncertainty
- **Hard fail:** 10 no-op native icon buttons in `pro/clients/[id]/page.tsx` (L283, 290, 541, 548, 555, 612, 619, 626, 665, 672). These are in a §4 beat-6 screen ("Client detail") that IS in the demo script and the screenshot manifest (E2), so a demo walk-through pressing "Message"/"Edit"/row actions would hit no-ops.
- State JSON `last_review` claims "Every button resolves to a real handler" — true for the 7 named buttons, but the sweep evidently stopped at `<Button>` components and missed native `<button>` elements in that file.
- `next build` green in a full-access environment remains outstanding (same env block as prior review; not a code defect).
- PNG captures in `assets/demo-screenshots/` deferred to full-access (documented in manifest; acceptable for p12 exit which only requires the inventory manifest).

## Recommendations / action items
1. **Blocker:** wire the 10 native icon buttons in `pro/clients/[id]/page.tsx` — cheapest honest fix consistent with p12's Track A/B approach: `onClick={() => toast('…(demo)', {description: 'lands on the Track B worker'})}` for Message/Edit/Download/More; view actions could open a detail panel or navigate. Re-run tsc + eslint after.
2. Update `progress/STATE.json` p12 items: `dead-buttons-sweep` should flip back to `todo` (or add item `native-icon-button-sweep`) and the phase status to `reviewed_fail` / `open` until re-review.
3. After wiring: re-run the full-access `next build` to close the last gate and set p12 `last_review` to a fresh independent pass.

## Evidence / observations
- `grep -rn 'console\.log' src/app` → 3 hits: 2 template-literal code examples (quickstart L64, developers L125), 1 comment (admin/users L235).
- `grep -n 'toast\|Toast'` on the two dashboard files → 0 matches each.
- `sed` inspection confirmed every named p12 button's handler (see table in §1).
- awk/node scan of `pro/clients/[id]` native `<button>` blocks → 10 blocks with no event handler.
- tsc/eslint exit codes captured as 0 from the exact sandbox-safe invocations.
