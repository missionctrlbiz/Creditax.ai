# UI/UX Refactor — Creditax.ai

**Branch:** `ui-ux-refactor`
**Source of truth:** `research/*` (copy, positioning, pricing) + `superscale/*` (57-screen spec, tokens, mockups) + `superscale/creditax-ai-static-*.png` mockup images (component inventory: unbuilt = waitlist modal, carousel, stakeholder sections, newsletter, count-up stats, canvas task box, chat canvas view, marketplace map, mobile drawers — all covered below)
**Skills applied:** `frontend-design`, `design-taste-frontend`, `high-end-visual-design`, `emil-design-eng`, `web-design-guidelines`, `canvas-design` (per task, noted inline)
**Rules:** keep existing color tokens · new fonts allowed (Syne display + Inter body + JetBrains Mono figures) · consumer-first copy, outcomes not endpoints · reduce overused wording · icon actions over text-chip buttons · dark/light logo context everywhere

**Copy glossary (kills overuse):**
- Tagline: **“Tax Smart. Borrow Smart.”** — hero + login pane + footer only
- Product phrase: **“the tax & credit platform”** / “Creditax” — never repeat “Nigeria’s First AI Tax-Credit Platform” more than once per page
- Banned: “Trusted by 2,400+ developers”, `$` pricing, generic global-tax claims, developer-only hero
- CTA: **“Join the list”** (waitlist modal) · secondary “Log in” · dev-facing “API Docs” stays in nav, never the hero primary

---

## T00 — Setup
- [x] New branch `ui-ux-refactor`
- [x] Install: pocketbase, embla-carousel(+autoplay), react-markdown, remark-gfm, radix (dialog/dropdown/avatar/tooltip/tabs/slot/popover), sonner
**AC:** branch active; `npm ls` shows all packages; no lockfile conflicts.

## T01 — Global design system (root CSS + fonts + shadcn-style primitives)
**Skills:** high-end-visual-design, web-design-guidelines
- [x] Root `globals.css`: Inter body, Syne headings (`h1–h6`), JetBrains Mono for all figures/amounts; base element polish (links, focus rings, selection, scrollbars, `prefers-reduced-motion`); consistent radii/shadows from tokens
- [x] `layout.tsx`: load Inter; metadata copy de-duplicated
- [x] shadcn-style primitives: `Dialog`, `DropdownMenu`, `Avatar`, `Tabs`, `Tooltip`, `Toaster` (sonner) built on radix + cva, themed with existing tokens
**AC:** every page uses Inter body / Syne headings / mono figures without per-page overrides · no token changes to brand colors · primitives render in dark + light · `npm run lint` clean.

## T02 — Theme-aware logo component
- [x] `AppLogo` (image, dark/light swap via ThemeProvider) replaces all hardcoded `/logo.png`, text-“C” squares, emoji marks in Header, Footer, consumer/pro/admin shells, login, sidebar
**AC:** zero hardcoded logo paths outside `AppLogo` (`grep '/logo' src` only hits AppLogo/assets) · logo vertically centered with header line (same height row) · correct file in both themes.

## T03 — One account menu for all boards
- [x] `AccountMenu`: opens **only from circular avatar**; shows demo name + email + portal links + logout; identical styling/person, personal/pro/admin
**AC:** no “Account ▾” text buttons remain · dropdown anchors to avatar in all 3 shells · keyboard/click-outside closes · name visible (“Emeka O.” / “Ayo Ogundimu” / “Admin O.”).

## T04 — App shell: collapsible sidebar + decluttered header (all boards)
**Skills:** emil-design-eng, web-design-guidelines
- [x] Shared `AppShell` authored (`src/components/shell/AppShell.tsx`): collapsible icon rail ↔ labeled sidebar (persisted), single-row header: [menu/toggle] [title/eyebrow] … [search?] [theme] [bell] [avatar]
- [ ] Wire `AppShell` into `dashboard/layout.tsx`, `pro/layout.tsx`, `admin/layout.tsx` (remove old chrome)
- [x] Remove crowded header items (dup nav tabs, extra buttons) — primary nav lives in sidebar
- [x] Mobile: drawer nav (built into AppShell)
**AC:** all top-header nav tabs moved into sidebar · header ≤ 5 controls · collapse/expand animates ≤250ms · identical behavior in personal, pro, admin · mobile hamburger reachable.

## T05 — Landing hero rewrite (consumer-first, reduced copy)
**Skills:** design-taste-frontend, frontend-design
- [ ] Badge: “Early access · Built for Nigeria” (once)
- [ ] H1: “Tax Smart. / Borrow Smart.” (Syne display) · sub: outcome line (“File correctly. Borrow cheaper.”)
- [ ] CTAs: primary **Join the list** (opens T14 modal) · secondary **Log in**; no API-docs primary; kill fake “2,400+” proof, use real capability chips
- [ ] Keep/adapt LogoGraphic; add subtle motion (respect reduced-motion)
**AC:** grep shows 0× “2,400+”, 0× “Now in Beta · Nigeria’s First AI…”, 1× tagline · hero reads consumer-first · both CTAs work · light+dark both polished.

## T06 — Features section: topic icons (Qwen-generated, transparent)
**Skills:** canvas-design (art direction) + qwen-image + remove-bg
- [ ] 6 feature cards (consumer-facing: tax calc, AI assistant, credit health, filings, documents, marketplace) — replace inline SVG boxes with generated transparent icons matched to each topic + logo style (teal/green, flat, consistent)
- [ ] Short outcome copy per card (≤18 words)
**AC:** 6 generated icons in `public/images/icons/` with transparent bg · no generic hero SVG icons remain in cards · copy ≤18 words/card · section headline is outcome-based, not “API stack”.

## T07 — How it works (new section)
- [ ] 3-step strip: Ask/upload → Get cited answer + filing-ready numbers → Build credit lenders trust
**AC:** present on `/` between features and stats · numbered steps, ≤12 words each.

## T08 — Stats section (count-up)
**Skills:** emil-design-eng
- [ ] 4 capability stats (e.g. tax types, answer latency, languages EN/YO/HA/IG, uptime/assist hours) — count-up on viewport entry, mono figures, teal/green accent, respects reduced-motion
**AC:** numbers animate 0→target once on load/enter · no fabricated user counts · figures use JetBrains Mono.

## T09 — Publications carousel → blog
- [ ] 6 publication cards (newspapers/media), **3 per view**, autoplay loop, pause on hover, arrows/dots; “View more →” links `/blog`
**AC:** exactly 6 cards, 3 visible ≥md, auto-advances ~4s, manual controls work, “View more” navigates to `/blog`, mobile shows 1–2 per view without overflow.

## T10 — Three stakeholder promo sections
- [ ] **Consumers** (P0): “Tell me what I owe, help me file, make lenders trust me” → personal dashboard value, generated lifestyle image
- [ ] **Tax pros** (P1): verified clients + bulk tools → `/marketplace` + `/pro/apply`, generated pro image
- [ ] **Partners & enterprise** (P2/P3): reliable Nigerian tax primitives + security → `/developers`, generated abstract/API image
**AC:** three distinct alternating-layout sections on `/` · each has image (generated, no placeholder), ≤40-word body, one CTA · consumer section appears first.

## T11 — Marketplace teaser + pricing preview
- [ ] Marketplace strip: map-ish visual + 3 pro cards → `/marketplace`
- [ ] Pricing preview: Free ₦0 highlighted + link to full `/pricing` (₦ only)
**AC:** no `$` anywhere on `/` · prices match pricing doc · CTAs route correctly.

## T12 — Newsletter signup (blog)
**Skills:** design-taste-frontend (compelling copy)
- [ ] Section above footer: headline + ≤20-word pitch + email field + “Subscribe” → PocketBase (`waitlist`, source=newsletter) · success state inline
**AC:** valid email required · success message shown · record persisted to PB when reachable (local queue fallback when PB down) · error/empty states styled.

## T13 — Footer expansion
- [x] Columns: Product / Company / Resources / Legal + Marketplace + socials + tagline; keep token styles
**AC:** includes Marketplace, Blog, Pricing, About, Status, Privacy, Terms, API Docs · single flat row gone · no dead links.

## T14 — Header “Join the list” modal (PocketBase capture)
- [x] Header CTA text **“Join the list”** opens compact centered dialog with bg overlay (radix Dialog): email + submit → POST PB `waitlist` (source=header) → success: “You’re on the list — we’ll email you when we launch.”
- [x] Escape/overlay click closes · duplicate email = friendly already-on-list state
**AC:** CTA no longer links to `/login` · overlay + compact modal (max-w ~420px) · record in PB `waitlist` · success copy exactly launch-notification wording · focus trap + accessible labels.

## T15 — Login + signup redesign (direct email login → PocketBase)
- [ ] Side pane: **no small logo card** — full-size animated hero mark (same style as landing hero), tagline “Tax Smart. Borrow Smart.” beneath, **back-to-home button at top** + mark itself links home
- [ ] Main pane: email → button **“Login →”** (no “Send Magic Link”); role selector kept (Personal / Tax Pro / Admin); on submit: store `{email, role}` to PB `login_log` (fallback queue), then enter portal directly
- [ ] Same treatment on signup · remove “Trusted by 2,400+” line · Google button removed (direct email flow is the spec)
- [ ] **Accepted deviation:** direct-login flow intentionally replaces `roles-and-experience.md` §2 magic-link spec (session instruction); flag for research-doc follow-up
- [ ] **Accepted deviation:** mocked “magic link” copy is intentionally replaced by direct-login flow (session note overrode `roles-and-experience.md` §2) — update research doc separately if this ships
**AC:** grep login/signup: 0× “Magic Link”, 0× “2,400+”, 0× small-logo side card · side pane shows hero-scale mark + tagline · two home links (top button + mark) · login stores email+role to PB (or queue) before redirect · all 3 roles land on correct dashboard.

## T16 — Personal dashboard shell
- [ ] `AppLogo` dark/light in sidebar+header, aligned to header line · nav in sidebar (Dashboard, Chat, Filing, Documents, Upload, Credit, Reports, Usage, Keys, Settings) · decluttered header per T04 · avatar menu per T03
**AC:** no hardcoded `/logo.png` in `dashboard/layout` · all 10 routes reachable from sidebar · header matches pro/admin pattern · theme toggle flips logo correctly.

## T17 — Upload area → canvas task box
**Skills:** frontend-design, canvas-design
- [x] Replace drag-placeholder on `/dashboard/documents/upload` (+ dashboard home quick-drop) with **task box**: canvas-style composer — drop files OR type a task (“Extract this receipt”), file chips, submit affordance, empty state art (generated)
**AC:** drag-over visual state · click-to-browse works · typed task field present · placeholder dashed-box design gone · matches canvas spec (composer under canvas).

## T18 — Tax assistant → real canvas view
- [x] `/dashboard/chat`: canvas layout — left/main canvas area rendering markdown answers as rich cards (react-markdown), composer docked beneath, skill chips row (WHT, TCC, Notice, Invoice) above input, sources/citation chips, scrollable thread
- [x] All required packages installed (react-markdown, remark-gfm)
**AC:** no “placeholder” text · sample thread renders markdown (lists/tables/links) · chips visible & clickable (can prefill input) · composer always reachable while scrolling · mobile stacks.

## T19 — Share/invite controls scrollable
- [x] Share button + invite link + permission row(s) fit and scroll within their container on all viewports (dashboard header/card)
**AC:** at 375px width no clipping/overflow · horizontally scrollable row with visible affordance · copy-link works (clipboard).

## T20 — Personal dashboard: animated signals + count-up stats + polish
**Skills:** emil-design-eng
- [x] All stat counters (score, tax-health %, filings, ₦ amounts — incl. the 74%-style figure) count up on load
- [x] Moving signal/ticker animations refined (smooth, looped, purposeful — not unfinished)
- [x] Illustrations/cards refined: consistent spacing, one bold element per card, generated empty-state art
**AC:** every numeric stat animates once on mount · no layout shift during count-up · signals loop ≥3s cycle, no jank, disabled under `prefers-reduced-motion` · cards pass contrast AA.

## T21 — Pro dashboard shell + identity
- [x] Logo dark/light + badge, sidebar/header parity with T04, circular avatar with **demo account name visible** (e.g. “Ayo Ogundimu”), avatar-anchored menu
**AC:** text-“C” logo gone · inline `style={{color:'var(--…)'}}` patterns replaced by token classes · avatar shows initials/photo + name on ≥sm · collapse works.

## T22 — Bulk calculations refinement
- [x] `/pro/calculations`: functional-feeling bulk calc UI — client multi-select, batch table, per-row results, totals footer, run/download icon actions, empty + loading states
**AC:** table with ≥4 columns + totals · select-all works · row actions are **icon buttons** (not text chips) · empty/loading/error states present · mocked data clearly demo-safe.

## T23 — CAC verification refinement
- [x] `/pro/verify` (+ relevant `/pro/apply` step): stepper, CAC number input w/ format hint, certificate drop, status cards (pending/verified/rejected) with icon states, submission summary
**AC:** linear stepper ≥3 steps · status cards styled with tokens · upload affordance present · no raw placeholder strings.

## T24 — Admin shell: de-loud + lucide + aligned headers
**Skills:** high-end-visual-design, web-design-guidelines
- [x] Replace emoji nav with lucide icons · quieter stat cards (revenue/signals toned down: smaller type, muted accents, less glow) · sidebar headers aligned to content grid · remove excess header items (keep search/theme/avatar per T04) · font consistency (Syne headings/Inter body via root, no local overrides) · avatar dropdown per T03
**AC:** 0× emoji in `admin/**` · revenue/stat cards use token colors with restrained accent (no neon overload) · header ≤5 controls · sidebar collapse aligns icons+labels · global-font rules apply (no per-file font-family).

## T25 — Admin marketplace approvals styling
- [x] Approval queue: professional cards with avatar, CAC badge, status chips (token-based), icon actions (✓ ✗ 👁 as lucide in icon buttons), filters, bulk-select
**AC:** actions are icon buttons w/ tooltips/aria-labels · status chips use success/warning/error tokens · list scans in <5s · empty state exists.

## T26 — Admin users/professionals + pro-review simplification
- [x] Users & Professionals tables: icon row actions (view/edit/more), avatar+name cells, filters · professional review panel: simplify “select a professional to review” busy buttons → single list + detail pane
**AC:** 0× plain text-chip action buttons in admin tables (icons + aria-labels) · review = list+detail, not button cluster · selecting a pro opens detail pane · tables responsive at 768px.

## T27 — Marketplace map placeholder
- [x] `/marketplace`: map panel with generated/static Lagos-style map image + pins + “near me” button (disabled/demo toast) until Mapbox token wired
**AC:** map area ≥40% of list view on desktop, stacked on mobile · pins mark listed pros · no broken Mapbox requests (no token = static) · “near me” has clear demo affordance.

## T28 — Image generation program (≤50, qwen-image + remove-bg)
**Skills:** canvas-design, qwen-image (zcode), remove-bg (zcode)
- [ ] Batch-generate into `public/images/`: 10 transparent topic icons (T06), 10 diverse avatars, 8 lifestyle/section images (T10/T11), 8 dashboard/empty-state illustrations, 6 marketplace/pro photos, 1 static map, 2 OG/misc — total ≤50
- [ ] Icons: generate → remove-bg → optimize (≤80KB each where possible)
- [ ] No repeated single avatar; every visible image slot uses purpose-fit art
**AC:** ≥35 images delivered, ≤50 total · all product icons transparent · referenced images actually used in UI (no orphans) · `alt` text on every img · no giant (>500KB) images in critical paths.

## T29 — Brutal review sweep (beyond disclosed items)
- [ ] Mobile nav on marketing header (hamburger; currently zero nav links <md)
- [ ] Active-state on all nav links; consistent CTA copy site-wide (“Join the list”)
- [ ] Missing-tab fixes (Usage/Keys/Chat reachable), blog category pills componentized
- [ ] Pricing/about/blog copy pass: ₦ only, consumer-first, glossary applied
- [ ] Accessibility: focus-visible, aria on menus/dialogs, contrast spot-check, reduced-motion
- [ ] Dead-link sweep (no `href="#"`, no 404s from nav)
**AC:** Lighthouse-style manual checklist passes · `grep 'href="#"'` empty · mobile can reach every marketing page · CTA wording consistent.

## T30 — Final verification
- [ ] `npm run lint` → 0 errors
- [ ] `npm run typecheck` (tsc --noEmit) → 0 errors
- [ ] `npm run build` → succeeds
- [ ] Route sweep: all routes 200 on dev server
- [ ] Walk every AC above, tick boxes, note any deviations here
**AC:** all commands green · every checkbox in this file either [x] or explicitly deferred with reason.

---

### Progress log
| Date | Notes |
|------|-------|
| 2026-09-22 | Branch `ui-ux-refactor` created; deps installed; plan authored |
| 2026-09-22 | T01 ✅ root type (Inter/Syne/mono) + Inter + sonner in layout; T02 ✅ AppLogo; T03 ✅ AccountMenu; T04 ✅ shared AppShell across personal/pro/admin (collapsible sidebar, decluttered header, mobile drawer, avatar-only menu); T05–T11 ✅ landing rebuild (hero rewrite, 6 icon cards, how-it-works, count-up stats, publications carousel → /blog, 3 stakeholder sections, marketplace + pricing strips, newsletter); T12 ✅ newsletter PB capture; T13 ✅ footer columns; T14 ✅ JoinListModal + pocketbase.ts (waitlist/login_log + local-queue fallback); T15 ✅ login/signup direct-email + hero side pane (PB record, no magic link); T16–T19 ✅ personal shell, canvas TaskBox upload, chat canvas view (react-markdown), scrollable share/invite; T20 ✅ count-up stats + refined signals; T21–T23 ✅ pro shell/avatar name, bulk calc, CAC verify; T24–T26 ✅ admin de-loud/lucide, marketplace approvals, icon actions + list-detail review; T27 ✅ marketplace map placeholder; T28 ✅ 41 generated images (icons/avatars/sections/dashboard/marketplace) via qwen-image; T29 ⏳ sweep; T30 ⏳ lint/typecheck/build/route-check. |
