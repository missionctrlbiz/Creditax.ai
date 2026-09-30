# Creditax.ai — Gap Analysis, Two-Track Plan & MVP Demo (Set in Stone)

**Version:** 1.0
**Date:** September 21, 2026
**Status:** FOUNDATIONAL — changes require explicit founder approval and a changelog entry.

---

## 1. Page Audit (September 21, 2026)

**Live routes: 48** across public (8), consumer dashboard (10 + chat), pro portal (7),
marketplace (2), developers (6), admin (7), auth (2), legal/status (3), blog (2).
**Specced screens: 57** in `superscale/` (Sections A–G).

**Top gaps** (full technical audit already exists — see §2, do not duplicate):

| ID | Gap | Track that fixes it |
|----|-----|---------------------|
| G-01 | Site positioned as developer tool; copy + `$` pricing contradict consumer-first decision | Demo (copy/₦ now) → Main (full rewrite) |
| G-02 | Auth is `localStorage` mock; chat answers are canned; all data is constants | A (PocketBase) → B (Supabase Auth) |
| G-03 | No canvas workspace; chat is a basic bubble list; no attach-into-canvas | A (basic canvas) → B (full canvas spec) |
| G-04 | No onboarding / empty states / notifications system (spec G02/G03 unbuilt) | A (minimal) → B (full) |
| G-05 | No payments, no quota enforcement, usage page is mock figures | A (mocked tiers) → B (real billing) |
| G-06 | No real uploads pipeline, RAG, Mono, jobs (`src/ai/*`, `src/api/*` empty) | A (mocked services) → B (real integrations) |

---

## 2. Two Tracks (Locked — Do Not Confuse)

### Track A — MVP DEMO (for the 4–5 client pitches, ASAP)
- **Spec:** `src/docs/pocketbase-demo-mvp-architecture.md` (already written, 1,099 lines).
- **Stack:** Next.js + **PocketBase** (auth, DB, files in one free binary) + OpenRouter
  free-tier embeddings/LLM + **mocked** Mono/RAG/credit data.
- **Data:** Mocked/seeded throughout — clearly labeled `demo seed` in code. It must
  *behave* correctly (quotas, roles, flows) while *knowing* nothing real.
- **Rule:** nothing in Track A may be presented as production. It exists to sell.
- **Legal gate:** Track A runs on mocked data only. Real user BVN, bank links, and
  filings go live exclusively under Track B and only after NDPC registration +
  DPIA complete (see `legal-compliance.md` §2, §7).

### Track B — MAIN ARCHITECTURE (the robust system)
- **Spec:** `research/API-Research.md` — Supabase + pgvector, Kimchi.dev + Vertex AI,
  Mono/Jumo, Trigger.dev, dual RAG indexes.
- Built in parallel after Track A is demo-stable; schema maps from PocketBase
  collections (§4 of the Track A doc) to Supabase tables (§3.6/§3.7 of API-Research).

---

## 3. MVP Demo Scope (What Must Work for Cameras)

1. Repositioned landing (consumer hero) + **₦ pricing page** (done §6), **with the
   language switcher visible (EN/YO/HA/IG) on landing, auth, dashboard shell, and
   chat** — full 4-language coverage lands in the main build; the demo proves the
   framework plus translated core flows and localized agent answers.
2. Demo login across 4 roles (consumer, pro, admin, author) with correct homes.
3. Dashboard-first landing incl. empty-state composer.
4. Basic canvas chat (seeded grounded answers + citations UI), sidebar upload with
   extraction preview, attach-into-canvas.
5. One PAYE + one VAT calculation with Naira figures and FIRS references.
6. Starter credit snapshot + factor list (seeded).
7. Marketplace search + verified pro profile + contact reveal (logged-in).
8. Quota walls trigger visibly on free limits (proof of monetisation).
9. Admin: users list, pro approval queue, KB article publish → reflected in chat.
10. Status page all-green + pricing/usage consistency.
11. Collaboration preview (mocked): paid workspace invites a member, shares a canvas
    link (read-only preview + signup CTA), and connects one external app (e.g.,
    Drive) as prompt context — proving the §10 product-foundation story on camera.
12. Skills v1 on camera (mocked, per `feature-specs.md`): 🧾 WHT recovery scan,
    📜 TCC readiness tracker, 📩 notice explainer, 🧮 invoice WHT check — as chat
    chips above the textarea with canvas result cards.

---

## 4. Demo Script (8 Minutes, Tax-Reporting-Fintech Audience)

Audience: tax-reporting fintechs, government-project investors, accountants/financiers.
Emphasise **compliance reporting, accountant leverage, financing trust** — not APIs.

| Min | Beat | Screen |
|-----|------|--------|
| 0–1 | Hook: "Tax Smart. Borrow Smart." + 2024 Reform pain for SMEs | Landing |
| 1–2 | Free signup → empty dashboard → composer → first cited answer | Dashboard → canvas |
| 2–4 | Upload invoice → extraction → attach → PAYE/VAT calc in Naira | Canvas + sidebar |
| 4–5 | Starter credit snapshot: "filing streak beats bank balance" | Credit page |
| 5–6 | Stuck case → verified pro referral → WhatsApp contact | Marketplace |
| 6–7 | Pro view: client list, bulk calc, verification; Admin: approve pro, publish KB rule, chat improves | Pro portal + admin |
| 7–8 | Money: quota wall → ₦ tiers → API/sandbox one-liner → ask | Pricing → developers |

---

## 5. Screenshot Inventory (After Demo-Stable — Real Captures, Not Mocks)

Capture every route in §1 (48) at desktop 1440px + key mobile 375px flows (onboarding,
upload, chat, marketplace), plus the 10 demo-scope states in §3. Store under
`assets/demo-screenshots/` grouped by section (A–G). These feed the pitch deck.

---

## 6. Done-Now Change Log (This Session)

- `src/app/pricing/page.tsx`: **$ → ₦** (Free ₦0 / Plus ₦5,000, ₦4,000 annual /
  Professional ₦25,000, ₦20,000 annual / Enterprise custom), consumer-first copy,
  quota-based features + BVN row, 4-tier comparison table.
- Foundation docs created: `product-foundation.md`, `pricing-and-access.md`,
  `security-foundation.md`, `roles-and-experience.md`, this file.

---

## 7. What Comes After (Order Locked)

1. Track A demo-stable → 2. screenshots → 3. client pitches → 4. investor deck
   (landscape) + academic paper (A4, 10–20pp: idea, context, architecture,
   cost-benefit, investment, revenue streams, 3-year forecast) → 5. Track B build-out.

---

## Changelog

### v1.2 (September 21, 2026)
- Demo scope gains item 12: Skills v1 chips on camera (WHT recovery, TCC, notice, invoice checker per feature-specs.md).

### v1.1 (September 21, 2026)
- Demo scope gains: 4-language switcher framework (EN/YO/HA/IG on core flows) and mocked collaboration preview (invites, shared canvas link, one connector). Legal gating cross-linked (NDPC/DPIA must complete before production real-data launch).

### v1.0 (September 21, 2026)
- Initial gap/plan foundation: 48-route audit summary, top-6 gaps, locked two-track split (Track A PocketBase mocks / Track B robust), 10-item demo scope, 8-minute fintech-tailored demo script, screenshot inventory rule, Naira pricing change log, ordered next steps.
