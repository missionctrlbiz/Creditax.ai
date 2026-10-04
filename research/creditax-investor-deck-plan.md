# Creditax.ai — Investor Deck Build Plan (The Final Criterion)

**Status:** LOCKED PLAN — every build decision defers to this document.
**Version:** 1.0 · September 28, 2026
**Reference:** `~/Downloads/AUTHO-Investor-Pitch-Final.html` (Autho Seed Investor Brief v2.0 — the refined 20-slide format, converted to `AUTHO-Investor-Pitch-Final.pdf`, 20 pages, 65 clickable links)

---

## 1. What We Are Building

A **20-slide, light-mode, interactive investor deck** for Creditax.ai:

| Output | Path |
|---|---|
| HTML source (editable) | `research/creditax-investor-deck.html` |
| Final PDF (client-facing) | `research/creditax-investor-deck.pdf` |
| Real product screenshots | `assets/deck-screens/` |
| AI-generated imagery (qwen) | `assets/deck-art/` |
| Per-slide PNG previews | `assets/deck-previews/` |

Format: A4 landscape (297×210mm), light theme, Gamma-grade spacing — detailed but never dense.

**Two upgrades over the Autho final (deliberate, not copies):**
1. The Autho final has **internal navigation only** (65 anchor links, cover TOC → pages, footer → cover). Creditax adds **real external links** to the live product (`creditax.missionctrl.com.ng` routes), verified live before embedding.
2. The Autho final's one photographic asset (cover hero) went missing. Creditax's art pipeline is **locked in advance**: qwen-generated, logo-referenced, stored in-repo.

---

## 2. The Alignment System (Why This Time Is Different)

The refined Autho deck aligns because of five mechanics. Creditax adopts all five — this is the non-negotiable core:

1. **Fixed-height pages:** `.page { width:297mm; height:210mm; }` — never `min-height`. A slide cannot grow; content must fit inside it.
2. **Flex-fit content:** `.page` is `display:flex; flex-direction:column`; the content zone is `flex:1; min-height:0; gap:Xmm`. Slack is absorbed by flex; tables stretch via `panel.fill > table {flex:1}` + `td {height:1px}`. Nothing spills, nothing crowds.
3. **In-flow footer:** the reference footer is the last flex child (never absolute), so it can never be overlapped.
4. **Distributed rows:** two-column and grid layouts use `flex:1; min-height:0` so columns equalize.
5. **Tabular numerals:** `font-variant-numeric:tabular-nums` on the body — every money figure lines up.

### THE CUSHION RULE (user's #1 requirement — stricter than Autho)

The Autho final runs tight 8mm vertical padding. Creditax adds deliberate cushion:

| Token | Value | Notes |
|---|---|---|
| Page padding | **14mm top · 13mm sides · 13mm bottom** | vs Autho's 8mm — visibly calmer |
| Header block (kicker + H1 + rule) | `margin-bottom: 5.5mm` | air between title zone and content |
| Content zone gap | `4mm` between stacked blocks | |
| Footer | `border-top; padding-top: 3mm; margin-top: 3mm` | never closer than 3mm to content above |
| Panel padding | `5mm 5.5mm` | |
| Row/column gap | `4.5mm` | |

**QA gate (hard):** every rendered slide must show ≥ **8mm** clear space between the last content line and the footer rule, and ≥ **5mm** between the header rule and first content block. Measured programmatically per slide; any violation blocks delivery. If a slide cannot fit with cushion, content is cut — never spacing.

---

## 3. Color Tokens — Exact, Audited, No Estimation

Light theme. Every value below is copied from `research/Brand-Guidelines.md` — nothing sampled, nothing invented. A **build-time token audit** extracts every hex/rgba from the final HTML and diffs it against this allowlist; any non-listed value fails the build.

### Backgrounds & surfaces
| Token | Hex | Use |
|---|---|---|
| `--surface` | `#FFFFFF` | page background |
| `--bg-light` | `#F4F9F9` | panels, alternating table rows, soft blocks |
| `--bg-dark` | `#0A0F14` | cover art overlay base, stat ink only — **never full-width bands** (user-locked rule from the working paper) |

### Brand
| Token | Hex | Use |
|---|---|---|
| `--primary` | `#0D7377` | kickers, panel titles, table headers, rules, primary accents |
| `--primary-light` | `#14919B` | secondary accents, hover-tone, stat border rotation |
| `--accent` | `#32E875` | highlight numerals on dark art only, success ticks, chart "good" fills |

### Text
| Token | Hex | Use |
|---|---|---|
| `--text` | `#1A2B3C` | headlines, body |
| `--muted` | `#6B7B8C` | secondary text, labels, sources |
| `--faint` | `rgba(107,123,140,.6)` | disclaimers, micro-copy |

### Semantic (Brand-Guidelines §5, used sparingly)
| Token | Hex | Use |
|---|---|---|
| success `#10B981` · warning `#F59E0B` · error `#EF4444` · info `#3B82F6` | | severity pills, candor notes, chart differentiators |

### Borders & lines
`--border: rgba(13,115,119,.15)` · `--border-strong: rgba(13,115,119,.25)` · footer/header rules use `--primary` at 2px (header) and `--border` 1px (footer).

### Gradients (ONLY the two sanctioned brand gradients — never freestyle)
| Where | Formula |
|---|---|
| Title rule (the gradrule equivalent) | `linear-gradient(90deg, #0D7377, #14919B)` — 30mm × 2.6px |
| Cover/closing art scrim | `linear-gradient(135deg, #0D7377 0%, #14919B 50%, #32E875 100%)` at ≤ 20% opacity over imagery only |
| Chart fills | flat tokens, no gradients |

---

## 4. Typography

| Role | Spec |
|---|---|
| Family | `'Inter', -apple-system, 'Segoe UI', Arial, sans-serif` — loaded from Google Fonts with local fallback (Autho's embedded font was corrupt and rode its fallback; we embed Inter properly via `<link>` + `font-display:swap`) |
| Mono (figures) | `'JetBrains Mono', 'Fira Code', monospace` — every Naira figure, page number, table figure |
| Kicker | 9pt · 700 · letter-spacing `.22em` · uppercase · `--primary` |
| H1 | 22pt · 700 · line-height 1.16 · `--text` · letter-spacing −0.01em |
| Panel title (h3.bt) | 12pt · 700, optional tag pill |
| Body | 10.5pt · line-height 1.5 |
| Small/captions | 9.5pt · 1.45 |
| Footer | 7.5pt · letter-spacing `.05em` |
| Numbers | `font-variant-numeric: tabular-nums` globally |

---

## 5. Component Vocabulary (ported from the Autho final, re-tokened)

| Component | Autho-final pattern | Creditax use |
|---|---|---|
| Header | kicker → H1 → 30mm gradient rule | every slide |
| Footer | brand · centered sources · page no, `border-top` | every slide; brand links → cover; source names become **live links** where they have URLs |
| Panel | `#F4F9F9` fill, 1px border, 8px radius | stat cards, snapshot tables |
| Candor note | tinted panel + uppercase micro-title | red `#EF4444` tint = honesty/kill-conditions; info `#3B82F6` tint = assumptions; success `#10B981` tint = proof points |
| Pill | severity badges (crit/high/med/gen) | risk slide |
| Statline | left-border stat strips, rotating `#0D7377 / #14919B / #3B82F6 / #F59E0B` | problem + market slides |
| Bigtile | 2×2 grid, 10px radius | investment highlights, why now |
| Bars | CSS track+fill rows, flat token fills | unit economics sensitivity |
| Flow | node → arrow → node strip | product mechanics, GTM sequence |
| Chips | rounded pills | "what exists today" build status |
| TOC | 2-col dotted-leader list on cover | cover, **clickable** to every slide |
| Band image | full-width image + caption scrim | screenshot strips |
| `a.xref` | dotted-underline link | all external links, `--primary` tinted |

---

## 6. Real Screenshots (grounding requirement)

Source inventory exists: `assets/demo-screenshots/` (A01–G05 series, ~20 files). **Most were captured before the current landing redesign** — the deck requires fresh captures so the deck never shows a product state that doesn't exist.

**Capture pass (before deck assembly):** browser automation against the live deployment `https://creditax.missionctrl.com.ng` at 1440×900 (desktop) and 390×844 (mobile), light theme, saved to `assets/deck-screens/`:

| Shot | Route | Used on |
|---|---|---|
| landing-hero | `/` | Exec Summary, The Product |
| canvas-cited-answer | dashboard chat with citations | The Product |
| document-extract | upload → extraction preview | The Product / Build Status |
| credit-snapshot | starter score + factors | Business Model |
| marketplace-search | `/en/marketplace` grid + map | Market Opportunity / GTM |
| pro-profile | verified pro detail | Competition & Moat (trust) |
| quota-wall | upgrade card | Business Model (conversion) |
| pricing-tiers | `/en/pricing` | Business Model |
| usage-dashboard | `/en/dashboard/usage` | Unit Economics |
| skills-chips | WHT/TCC chips on canvas | The Product |
| admin-approval | pro approval queue | Trust slides |
| status-page | `/en/status` all green | Trust Framework |

Fallback: if a live capture fails, the matching existing `assets/demo-screenshots/` file is used and labeled with its capture date. Every screenshot carries a small caption chip (`LIVE PRODUCT · creditax.missionctrl.com.ng`) that itself links to the route.

---

## 7. AI Imagery — qwen, Logo-Locked (!IMPORTANT)

**Model:** `qwen-image-edit` (image-reference mode) via the qwen-image skill — 5–7 images, color-graded to the token palette (teal/green/white; warm Nigerian contexts; **light and airy to match the deck** — no dark-mode renders).

**Logo rule (!IMPORTANT):** every generation that includes branding receives `public/logo.png` (the horizontal logo: icon + "Creditax.ai" + tagline) as the reference image, and the prompt states verbatim: *"reproduce the exact logo from the reference image — same icon geometry, same colors, icon and wordmark together, never redrawn, never recolored."* Icon-only slots use `public/favicon.png` as reference. **Both logo forms (full horizontal lockup AND icon) appear across the deck; never the wordmark alone, never an AI-redrawn logo.** Post-generation, each image is visually checked against the reference logo; a mismatched logo regenerates.

| # | Slot | Slide | Brief |
|---|---|---|---|
| 1 | Cover hero | Cover | A young Nigerian professional at a bright desk/laptop with a subtle glowing teal interface hologram; **horizontal Creditax logo placed per reference**; airy, premium-fintech, light |
| 2 | The Problem strip | Slide 4 | Market trader / freelancer with phone and receipts, bright daylight, teal accent light |
| 3 | Why Now visual | Slide 6 | Stylized light map of Nigeria with glowing teal network nodes (fintech rails) |
| 4 | Product illustration | Slide 7 | Person asking a phone a question, answer card glowing with citation lines |
| 5 | Marketplace visual | Slide 11 | Professional shaking hands / storefront with verified-badge motif, light |
| 6 | The Ask visual | Slide 20 (closing) | Optimistic upward path / Lagos skyline at golden hour, light and clean, horizontal logo per reference |
| 7 (reserve) | Compliance visual | Slide 17 | Shield/document motif in teal line-art style |

---

## 8. Slide Map (20 slides, Autho-final structure, Creditax facts)

All content drawn from the two locked documents (`creditax-working-paper.html`, `creditax-financial-projections.html`) and the research foundation. No new claims.

| # | Slide | Content source | Key visual |
|---|---|---|---|
| 1 | **Cover** — brand, one-para value prop, 4-stat meta strip (RAISING **N10,000,000** / MARKET Nigeria first · 4 languages / FOUNDER MissionCTRL · Lagos / DATE September 2026), disclaimer, **clickable 2-col TOC** | working paper cover + financials p1 | qwen hero #1 |
| 2 | Executive Summary — problem/product/moat/doctrine + **Round Snapshot** (Raise N10M · Stage pre-revenue · Model subscriptions + identity + API · Pilot demo track · Runway 6 months · Ask partners & lead investor) + "What exists today" chips + CANDOR box | WP p2 | screenshot strip |
| 3 | Investment Highlights — 4 reasons 2×2 (cited-answers moat · compliance-credit dataset nobody holds · verified marketplace flywheel · 4-language distribution) + "what would kill each" band | WP §1–3 | — |
| 4 | The Problem — statline (7.5% VAT · 5–30% WHT · 17 PAYE bands · 60-message free cap) + actor table + unclaimed-WHT wedge + global proof point | WP §3 | qwen #2 strip |
| 5 | Market Opportunity — TAM/SAM/SOM panels (computed honestly from pricing doc: N2,000 CAC envelope, 1:10 conversion) + "the pool, computed honestly" table + honest-market-caveat note | Financials §1, WP §3 | — |
| 6 | Why Now — 4 shifts (2024 reform · mobile rails · identity BVN/NIN/TIN · category validation) | WP §1–2 | qwen #3 |
| 7 | The Product — "how it works" flow (ask → cited answer → calculate → score → refer) + surfaces rail + **live links** to marketplace & product routes | WP §4–5 | screenshots + qwen #4 |
| 8 | Build Status — BUILT / IN BUILD / GATED chips (48-route demo, calculators, KB, admin, pro portal) + what ships when | WP §8, mvp-demo-plan | screenshot strip |
| 9 | Business Model — 7 revenue streams table (phase-badged) + conversion loop + "deliberately excluded from projections" note + **live link** to `/en/pricing` | WP §16 | screenshot: pricing |
| 10 | Unit Economics — base vs upside scenario cards + reconciliation candor (Naira-only, documented unit costs) + sensitivity bars + per-user worth + **live link** to usage route | Financials §1, §5 | CSS bars |
| 11 | Go-To-Market — 3 steps (demo-first to warm leads · content + developer outreach · supply-first marketplace) + pilot KPI contract + expansion chips + **live link** to marketplace | WP §17 | qwen #5 |
| 12 | Competition & Moat — competitor table (generic assistants · global tax suites · bank/bureau tools · status quo) + three locks that compound | WP §3, §8 | screenshot: pro profile |
| 13 | Implementation — six phase cards (0–6, week-badged) + sequencing rule (gates before spend) | WP Part III | — |
| 14 | Cost-Benefit & Viability — N10M use-of-funds table + monthly burn mini-chart + stakeholder cost-benefit + viability verdict / kill conditions | Financials §3–4 | CSS bars |
| 15 | Risk Register — 8–10 risks, severity pills, mitigation, "monitored by" metric | WP §21 | — |
| 16 | Stage & Compliance Gates — CAC → DPIA-lite → NDPC full gate → enterprise pen-test ladder | WP §18 | — |
| 17 | Security Architecture — 4 data classification levels + locked PII rules | WP §19 | qwen #7 (reserve) |
| 18 | Data Protection & NDPA — registration sequence, 4-language notices, breach workflow | WP §18–19 | — |
| 19 | Threat Model — 8 threats grid (account takeover, scrapers, abuse, fraud…) | security-foundation §2 | — |
| 20 | **The Ask** — round card (N10,000,000 · 6 months · 4 investor-visible milestones) + milestone tiles + "what this deck does not claim" candor box + contact + **live links** | Financials §8 | qwen #6 |

---

## 9. Interactivity (internal nav + real external links)

**Internal (parity with Autho final):** cover TOC links to all 20 slides (`#s1…#s20`); every footer brand links back to the cover. Target: **≥ 21 internal links** in the PDF.

**External (the upgrade):** `a.xref` links on slides 7, 9, 10, 11, 12, 20 to live routes — verified with HTTP 200 immediately before build: `/`, `/en/pricing`, `/en/marketplace`, `/en/developers`, `/en/status`, `/en/blog`. Screenshot caption chips also link to their routes. Target: **≥ 8 external links**, each `color:--primary; border-bottom:1px dotted`.

**Verification:** post-render `pymupdf get_links()` must report internal ≥ 21 and external ≥ 8, and every external URI must appear in the verified-live list.

---

## 10. Build Pipeline & QA Gates

1. **Capture** screenshots (§6) → `assets/deck-screens/`
2. **Generate** art (§7, qwen with logo references) → `assets/deck-art/` → visual logo check per image
3. **Assemble** HTML (this plan's CSS system) → `research/creditax-investor-deck.html`
4. **Token audit** — script extracts all hex/rgba values from final HTML, diffs against §3 allowlist → zero offenders
5. **Render** — headless Chrome, `@page{size:297mm 210mm;margin:0}`, print-color-adjust exact
6. **Cushion QA** — per-slide programmatic check: content-to-footer ≥ 8mm, header-to-content ≥ 5mm, zero content outside page box
7. **Link QA** — internal ≥ 21, external ≥ 8, all external URIs live-verified
8. **Sequence QA** — footer page numbers read exactly `01…20`, no fragment sheets
9. **Visual sweep** — every slide rendered to PNG and reviewed (alignment, contrast, logo fidelity)
10. **Metadata** — Title/Author/Creator/Subject set; deliver HTML + PDF + previews

**Definition of done:** all nine gates pass. Any gate failure loops back to the specific step — spacing is never sacrificed to fit content, and content is never invented to fill space.

---

## 11. Open Items

- [ ] `AUTHO-Investor-Pitch-Final.pdf` delivered (done — 20 pages, 65 links, 1.4MB) but its **cover art is missing** (`assets/cover-hero.png` not on this machine) — locate the asset folder from the machine that built the Autho deck if the client copy needs the art
- [ ] Confirm live routes return 200 on build day (landing/pricing/marketplace/developers/status/blog)
- [ ] Founder approval of slide-20 contact block details
