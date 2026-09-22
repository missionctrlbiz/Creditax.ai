# Creditax.ai — Product Foundation (Set in Stone)

**Version:** 1.0
**Date:** September 21, 2026
**Status:** FOUNDATIONAL — changes require explicit founder approval and a changelog entry.
**Purpose:** The single source of truth for *what we are building, for whom, and why*.
Every page, feature, price, and pitch must trace back to this document.

---

## 1. What Creditax.ai Is (One Paragraph)

**Creditax.ai is a free-to-start, AI-powered consumer platform that bridges Nigerian tax
compliance and creditworthiness.** A user signs up, chats with an AI tax agent in a
canvas workspace, uploads financial documents from a sidebar, gets plain-English answers
grounded in real Nigerian tax law, sees a credit health score built from compliance +
financial data, and — when human help is needed — is referred to a verified tax
professional inside our own marketplace. Developer APIs expose the same engines that
power the platform; they are a distribution channel and revenue line, **not** the product
being sold.

---

## 2. Positioning Decision (Locked)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Consumer platform first, API second.** The home page, onboarding, and post-login experience sell outcomes ("file correctly, borrow cheaper"), never endpoints. | The current site reads as a developer tool ("Trusted by 2,400+ developers", API-first hero, `$` pricing). That misrepresents the business and confuses non-technical users — the actual majority audience. |
| 2 | **APIs are part of the project, not the pitch.** The RAG engine, tax calculator, and verification services are exposed as APIs so partners, fintechs, and the pro marketplace can build on them. | Keeps optionality (B2B2C revenue) without splitting the brand. |
| 3 | **Free public interface as the front door.** Canvas view + sidebar uploads + agent chat + pro referral are usable free, within defined limits. | Trust and adoption in Nigeria are earned through utility first; conversion follows demonstrated value. |
| 4 | **Nigeria-only depth before breadth.** Every tax answer cites NTA/NTAA/FIRS material for Nigeria. No generic "global tax" claims. | Depth is the moat; generic AI tax tools hallucinate jurisdiction-specific law. |

> **Consequence:** The landing page, login panels, about page, and pricing page must be
> rewritten to consumer-first language (see `mvp-gap-and-demo-plan.md` G-01). No new
> developer-centric hero copy without updating this document first.

---

## 3. Target Audiences (Primary → Secondary)

### P0 — Nigerian consumers & micro/SME owners (the free public user)
- Employees needing PAYE clarity, TCCs, and filing reminders.
- Freelancers/traders with "invisible income" who need documents turned into credibility.
- SME owners facing the 2024 Tax Reform Act, VAT, WHT, and CAC obligations.
- **Job to be done:** "Tell me what I owe, help me file it, and make lenders trust me."

### P1 — Tax professionals (supply side of the marketplace)
- Solo accountants, small firms, former FIRS staff monetising expertise.
- **Job to be done:** "Send me verified clients and give me tools (bulk calc, verification, reports) that make my practice faster."

### P2 — Partners & developers (API consumers)
- Fintechs/lenders needing tax-compliance signals, payroll startups needing PAYE calc, ERP/accounting tools needing WHT/VAT endpoints.
- **Job to be done:** "Give me reliable Nigerian tax primitives so I don't build them."

### P3 — Enterprise / institutional clients (pitch targets)
- Banks, cooperatives, employers, government-adjacent bodies needing compliance rails or white-label tooling.

---

## 4. Stakeholders

| Stakeholder | Interest | What they refer to |
|-------------|----------|--------------------|
| Founder (you) | Vision, revenue, client pitches (4–5 warm leads) | All foundation docs |
| End users (P0) | Free utility, data safety, plain language | App UX, privacy page |
| Tax pros (P1) | Client flow, verification trust, earnings | Marketplace + pro portal |
| API partners (P2) | Uptime, docs, sandbox, pricing per call | Developer hub, status page |
| Enterprise prospects (P3) | Security, compliance, ROI, roadmap | MVP demo, security doc, pricing doc |
| Regulators (FIRS / State IRS / NDPC) | Correct tax content, lawful data handling | Knowledge base citations, security doc |
| Investors (future) | Market, moat, unit economics, forecast | Pitch deck + academic paper (planned, §8) |

---

## 5. The Free Public Interface (The Front Door — Locked Scope)

Every visitor can, without paying:

1. **Canvas view** — a persistent workspace where agent answers render as rich cards
   (calculations, checklists, document extracts), not just chat bubbles.
2. **Sidebar uploads** — receipts, invoices, payslips, CAC docs; stored to the user's
   library with extraction previews.
3. **Agent chat** — single conversational thread; the textbox docks/undocks as the
   canvas fills; user can attach library documents *into* the canvas mid-conversation.
4. **Tax filing settings & actions** — filing-year selector, PAYE/VAT/WHT modes,
   "add to filing", reminders.
5. **Pro referral** — when the agent detects low confidence, high stakes (audit, appeal),
   or explicit request, it recommends verified marketplace professionals with contact actions.
6. **Credit health snapshot** — a starter score with the top improvement action.
7. **Your language, including the AI** — the full interface and agent prompting work in
   **English, Yoruba, Hausa, and Igbo** (§9). A user picks a language once; every
   screen and every agent answer follows it.
8. **Team & sharing (paid)** — paid workspaces can **invite users** and **share a
   canvas** via link (§10).
9. **External AI connectors (all tiers)** — link a second brain or assistant
   (Claude, ChatGPT, Notion, Google Drive, and similar) and prompt *with* it as
   context (§10). Free includes 2 connectors; paid includes more.

Limits for the above live in `pricing-and-access.md`. The experience spec lives in
`roles-and-experience.md`.

---

## 6. How the RAG Architecture Translates to an API (Founder Explainer)

You do not sell "RAG". You sell **answers you can defend**. The pipeline and its API
shape:

```
User question (or API call)
  → Embed query (Vertex AI)
  → Vector search Supabase pgvector (tax_document_chunks + tax_professionals_embeddings)
  → Retrieve top-k cited chunks (NTA, NTAA, FIRS guides, circulars)
  → LLM (Kimchi.dev) generates answer WITH citations
  → PII redaction → audit log → response
```

**What this becomes as products:**

| API surface | What the caller gets | Who uses it |
|-------------|----------------------|-------------|
| `POST /api/v1/chat` | Grounded tax answer + citations + confidence | Our own canvas (primary), partner apps |
| `POST /api/v1/tax/calculate` (PAYE/VAT/WHT/CIT) | Deterministic figures + legal reference | Pro portal bulk calc, fintech payroll |
| `POST /api/v1/verify` (TIN/BVN/CAC-status) | Verification verdict + evidence | Onboarding, lenders, pro verify |
| `POST /api/v1/credit/score` | Score + factor breakdown | Dashboard, lending partners |
| Marketplace RAG (`/api/v1/pros/search`) | Natural-language pro matching ("VAT expert near Lekki") | Chat referral, marketplace search |

**Why developers need it (the answer to "why an API"):** no official FIRS integration
API exists — and we deliberately build on **published** law, guides, and circulars
rather than any unofficial government-system access (see `legal-compliance.md` §3).
Anyone building payroll, lending, or bookkeeping for Nigeria must otherwise hand-code
PAYE bands, VAT rules, and WHT rates — and keep them current through reform acts.
Our API sells *maintained correctness*: versioned rules, cited answers, and compliance
signals no single app wants to maintain. That is the B2B2C wedge; the consumer platform
is the proof it works.

---

## 7. Full Project Scope (Everything, One List)

1. **Consumer web app** — canvas chat, uploads library, tax filing flows, credit score, reports, settings.
2. **Tax knowledge RAG** — ingestion pipeline, dual pgvector indexes, cited chat engine.
3. **Credit engine** — Mono (bank data) + filings → score, factors, simulator, refresh jobs.
4. **Pro marketplace** — discovery, verified profiles, geolocation, RAG matching, referrals, reviews.
5. **Pro practice portal** — clients, bulk calculations, verification, white-label reports.
6. **Partner API platform** — keys, versioned endpoints, sandbox, webhooks, usage metering, docs.
7. **Admin & trust ops** — users, pros queue, knowledge-base editor, audit log, settings, status.
8. **Billing & access** — tiers, quotas, token accounting, Flutterwave/Paystack, invoices.
9. **Security & compliance** — NDPR-aligned PII handling, threat controls (`security-foundation.md`).
10. **Content & growth** — blog, docs, status page, lifecycle emails, referral loops.

Out of scope (explicit): holding client funds, filing directly with FIRS on a user's
behalf without licensed-pro review, lending our own balance sheet.

---

## 9. Site-Wide Language — i18n Including Prompting (Locked)

Applies to the demo, the MVP demo, and the final product equally:

1. **Four languages, everywhere:** English (default), Yoruba, Hausa, Igbo — UI
   strings, emails, notices, disclaimers, and **agent prompts and answers**.
2. **Technical approach:** locale routing (`/en`, `/yo`, `/ha`, `/ig`) via an i18n
   framework; language preference stored on the user profile; the agent's system
   prompt carries the locale so answers, citations formatting, and money phrasing
   follow it. Multilingual embeddings cover Yoruba/Hausa/Igbo queries against the
   (English) tax corpus, with the response rendered in the user's language.
3. **Quality bar:** tax and legal strings are translated by humans and signed off by
   a Content Editor — machine translation is a drafting aid only, never the ship step.

## 10. Collaboration & Connectors (Locked)

1. **Invites are paid-only.** Any paid workspace (Plus and up for consumers;
   Professional seats for firms) can invite users; free workspaces are single-user.
2. **Canvas sharing is paid-only.** Paid users can share a canvas via link
   (view or comment); recipients without accounts get a read-only preview with a
   signup CTA — a growth loop.
3. **External AI connectors ship on all tiers** (free: 2 connectors). A connector
   links Claude, ChatGPT, Notion, Google Drive, or another second brain so the user
   can prompt *with* that context inside our canvas. Connectors are read-scoped,
   revocable, and logged; quotas in `pricing-and-access.md`.

## 11. Planned Long-Form Documents (Noted, Not Started)

- **Investor pitch deck** — landscape, high-design, ~12 slides: problem, solution, demo,
  moat (RAG + compliance-credit data), traction, business model, team, ask.
- **Academic-style paper** — portrait A4, 10–20 pages with references: idea, literature/
  context (Nigerian tax reform), solution architecture, methodology, cost-benefit analysis,
  investment requirements, revenue streams, 3-year forecast, risks, conclusion.
- Both will be drafted from these foundation docs once the MVP demo is stable.

---

## Changelog

### v1.1 (September 21, 2026)
- Added §9 site-wide i18n (EN/YO/HA/IG incl. agent prompting, all tracks) and §10 collaboration/connectors (paid invites + canvas sharing; connectors on all tiers, 2 free); reframed the FIRS/API line to the no-grey-area posture (points to legal-compliance.md).

### v1.0 (September 21, 2026)
- Initial product foundation: positioning (platform-first, API-as-channel), audiences P0–P3, stakeholders, free public interface scope, RAG→API explainer, full scope list, out-of-scope, future deck + paper noted.
