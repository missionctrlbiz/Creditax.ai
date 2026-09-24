# Creditax.ai — Academic-Style Paper Outline (A4, 10–20 pp)

**Status:** Outline only (fa-6) — full draft after Track B production cutover or in parallel with client pitches.  
**Target length:** 12–18 pages body + references (A4, 11pt, 1.5 line spacing).  
**Citation style:** APA 7 (or IEEE if venue requires).  
**Sources to weave in:** `research/product-foundation.md`, `pricing-and-access.md`, `security-foundation.md`, `legal-compliance.md`, `feature-specs.md`, `mvp-demo-plan.md`, `project-roadmap.md`, NTA 2023 / NTAA 2023 / FIRS guides, Mono & Mapbox public docs, Nigerian tax-reform secondary sources.

---

## Front matter

| Element | Content |
|---------|---------|
| Title | *Creditax.ai: Bridging Nigerian Tax Compliance and Creditworthiness with a Grounded AI Platform* |
| Authors | Founder / corresponding author (solo Phase 0); affiliations TBD |
| Abstract | 200–250 words: problem (tax reform + thin-file credit), system (RAG over published law + deterministic calculators + credit factor model + marketplace), evaluation (demo build + cost model), contribution (compliance–credit flywheel, 4-language UX, dual-index RAG) |
| Keywords | tax compliance; retrieval-augmented generation; credit scoring; Nigeria; financial inclusion; large language models |

---

## §1 Introduction (~1.5 pp)

1. Motivation: 2024 Nigerian tax reforms (New Nigeria Tax Act, Tax Administration Act, Capital Gains changes) create widespread uncertainty for employees, freelancers, SMEs.
2. Dual gap: (a) trustworthy, citable tax guidance at consumer scale; (b) credit underwriting that treats compliance as signal.
3. Thesis: a free-to-start AI canvas grounded in **published** law, coupled with a credit-health score and a verified professional marketplace, improves both filing confidence and lender trust.
4. Contributions (bulleted):
   - Dual-index RAG (law chunks + professional profiles) with citation-required generation.
   - Deterministic calculators co-located with generative answers (defensible figures).
   - Compliance–credit factor loop with explicit privacy/NDPA posture.
   - Naira-only, quota-enforced product economics with documented unit costs.
   - Working Track A reference implementation and live Mapbox/Mono integration paths.
5. Paper structure map.

---

## §2 Context & Related Work (~2 pp)

1. **Nigerian tax landscape:** FIRS vs state IRS; PAYE/VAT/WHT/CIT; 2023–2024 reform acts; TIN/BVN/CAC as identity rails.
2. **Tax tech landscape:** filing assistants, calculators, chatbots — typically generic or non-citable; no compliance→credit bridge.
3. **Credit & alternative data:** BVN/NIN verification, bank statement analysis (Mono ecosystem), thin-file scoring limits.
4. **RAG for regulated domains:** citation faithfulness, hallucination cost, chunking of statutes; contrast with open-domain chatbots.
5. **Financial inclusion & trust:** language diversity (EN/YO/HA/IG), marketplace verification as trust infrastructure.
6. **Gap statement:** no known product in-market that unifies *cited tax Q&A + calculators + credit score + verified pro marketplace* for Nigeria under NDPA-aware design.

---

## §3 System Idea & Product Architecture (~2.5 pp)

### 3.1 Product idea (one paragraph + diagram)

Consumer-first platform; APIs as distribution channel (not the pitch).

### 3.2 Reference architecture (figure)

```
Clients (web canvas / mobile-ready PWA / partner API)
  → Edge API (auth, API keys, rate limits, quotas)
  → Services:
      • RAG chat (embed → pgvector top-k → LLM + citations → redact → audit)
      • Tax rules engine (PAYE/VAT/WHT/CIT)
      • Document extract pipeline (upload → parse → chunk → store)
      • Credit score service (factors: income stability, savings, debt, compliance)
      • Identity verify (Mono sandbox/live; fail-closed)
      • Marketplace search (semantic + PostGIS proximity + Mapbox geocode)
      • Billing/quotas (Naira tiers, credit accounting)
  → Storage (Postgres+pgvector, object store B2, CDN images)
  → Async jobs (report gen, score refresh, re-index)
```

### 3.3 Dual-index RAG

- Index A: `tax_document_chunks` (NTA, NTAA, FIRS, circulars).
- Index B: `tax_professionals_embeddings` (services, bio, location).
- Hybrid retrieval notes: semantic + filters (tier, geo, language).

### 3.4 Deterministic + generative split

- Calculators: versioned rules, legal reference IDs on every response.
- Generator: allowed to summarize law but must attach chunk citations; confidence + referral triggers.

### 3.5 Roles & flows

Four demo roles (consumer, tax_pro, admin, author) → home routes; canvas, pro portal, admin approval queues.

### 3.6 Honesty & provenance labels

`demo_seed` / `geo:demo` until production cutover; NDPA/DPIA gate before real-data launch.

---

## §4 Methodology / Implementation (~2 pp)

1. Stack choices with rationale (Next.js, Supabase/Postgres+pgvector, Trigger.dev, Kimchi-compatible LLM, Vertex embeddings, Mono, Mapbox, Backblaze B2).
2. Knowledge base ingestion: Markdown KB → chunks → embeddings → evaluation set of Nigerian tax questions.
3. Grounding protocol: system prompt + citation schema + refusal/referral policy on low confidence.
4. Credit score factor model (illustrative formula; no real BVN in Track A).
5. Security controls: PII redaction, rate limits, session/API key handling, audit logs (point to `security-foundation.md`).
6. Evaluation plan (Track B): citation precision/recall on held-out FIRS/NTA questions; calculator golden tests; p95 latency; cost per grounded answer.

---

## §5 Cost–Benefit Analysis (~1.5 pp)

1. **Unit costs (from pricing-and-access §3):** agent message ≈ ₦5; calc ₦3; upload ₦15; BVN ≈ ₦90 vs price ₦350; score refresh ₦5.
2. **CAC envelope:** free tier capped (~₦370 typical / ₦1,500 max vs ₦2,000 envelope).
3. **Margin by tier:** Plus ~55% typical; Pro ~73%; Enterprise floor 60%.
4. **Benefit side:** avoided manual rule maintenance for partners; conversion payback (one Plus ≈ seven free acquires); higher-margin BVN line.
5. **Sensitivity:** LLM token cost ±, Mono unit moves >20% → re-cut quotas before price changes.
6. Table: status-quo (manual advice / brittle calculators) vs Creditax (cited, metered, multi-surface).

---

## §6 Investment Requirements (~1 pp)

1. **Use of funds buckets:** compliance & security hardening (DPIA, pen test), Mono/PSP production credentials + testing, marketplace supply ops, GTM/content, cloud egress, 2–3 hires.
2. **Milestones tied to capital:** mono-sandbox → live data path; PSP test → production charges (`charged` flag lifecycle); NDPA gate; first Enterprise LOI.
3. **Milestone-based budget sketch** (placeholder ranges to fill after Track B scoping — do not invent precise ask in paper until founder locks it).
4. Risk reserves: provider price shocks, LLM cost spikes.

---

## §7 Revenue Streams (~1 pp)

| Stream | Mechanism | Who pays |
|--------|-----------|----------|
| Subscriptions | Free / Plus ₦5k / Pro ₦25k / Enterprise custom, annual −20% | Consumers, pros |
| Identity pay-per-use | BVN ₦350 (teaser 2/60d), TIN/CAC lookups | Consumers, onboarding flows |
| Marketplace | Contact reveal + priority placement / take-rate as scoped | Pros |
| Partner API | Sandbox free / Plus 5k / Pro 50k calls + overage | Fintech, payroll, ERP |
| Enterprise | White-label, portfolio scoring, SSO/SLA | Banks, institutions |
| Future BaaS (WIP) | Embedded tax/verification rails — **do not promise until scoped** | Platforms |

Cross-reference: quotas enforced in code; credits table (chat=1, calc=2, BVN=25, …).

---

## §8 Three-Year Forecast (~1.5 pp)

1. **Assumptions (explicit):** Nigeria-only; Track A→B cutover timeline; free→Plus conversion ≥1/10 in 90 days; no dollar pricing.
2. **Year 1 (build & prove):** consumer launch, 100 API signups / 25 active API users (roadmap 6-mo targets), first revenue, marketplace supply ≥20 verified pros, NPS >40 target.
3. **Year 2 (deepen):** lender portfolio scoring pilots, Enterprise white-label, pro seats growth, expand verification set.
4. **Year 3 (widen):** optional regional/BaaS rail after legal scoping; partner-led distribution.
5. **Revenue composition shift:** Y1 subscriptions-heavy → Y2 API + BVN volume → Y3 Enterprise + take-rate.
6. Table: Y1/Y2/Y3 ranges (MAU, paid conversion, ARPU ₦, gross margin, key cost drivers) — mark as **scenario bands**, not commitments.
7. Chart placeholders: adoption S-curve; revenue mix stacked bars; CAC payback.

---

## §9 Risks & Governance (~1 p)

| Risk | Mitigation |
|------|------------|
| LLM hallucination on statute | Citations mandatory; golden set; referral on low confidence |
| NDPA / NDPC non-compliance | DPIA before real-data launch; PII minimisation; audit logs |
| Provider concentration (Mono) | Sandbox/live host pinning; fail-closed demo path; multi-provider notes (no Okra) |
| Regulatory change (FIRS forms) | Versioned KB re-index jobs; circulars P1 priority |
| Free-tier cost blowout | Lifetime + daily quotas in middleware |
| Solo/key-person risk | Docs-as-code, STATE runbooks, modular services |
| CBN/consumer-credit boundary | Stay advisory + signals; never present as unlicensed lender (legal-compliance) |

---

## §10 Conclusion (~0.5 pp)

Restate the flywheel: cited tax answers → better filings → stronger credit signal → better loan outcomes → more usage. Call for production hardening + empirical evaluation (Track B) and invite collaboration with tax professionals, lenders, and regulators on open standards for compliance-linked underwriting.

---

## References (seed list — expand in draft)

1. Federal Inland Revenue Service. (2023–2024). *Guides, circulars, and public notices* (VAT, WHT, TCC).
2. National Assembly of Nigeria. (2023). *Nigeria Tax Act / Nigeria Tax Administration Act (as amended 2024 reforms).*
3. Lewis, P., et al. (2020). *Retrieval-augmented generation for knowledge-intensive NLP tasks.* NeurIPS.
4. Mono. (2026). *Connect, identity, and lookup API documentation* (api.withmono.com).
5. Mapbox. (2026). *Geocoding v5 & Static Images API documentation.*
6. NITDA. (2023). *Nigeria Data Protection Act (NDPA).*
7. Selected literature on alternative credit scoring in Sub-Saharan Africa (to expand).
8. CBN guidelines on credit risk and consumer due diligence (relevant extracts).

---

## Figure & table plan

| # | Type | Caption |
|---|------|---------|
| Fig 1 | Architecture | End-to-end Creditax reference architecture |
| Fig 2 | Sequence | Grounded answer path (embed → retrieve → generate → cite) |
| Fig 3 | Flywheel | Compliance → score → behaviour loop |
| Fig 4 | Screenshot panel | Canvas, credit, marketplace (from fa-5, demo_seed labelled) |
| Fig 5 | Chart | Unit cost vs price (BVN, chat) |
| Fig 6 | Chart | 3-year revenue mix scenario |
| Tab 1 | Pricing tiers | From pricing-and-access §2 |
| Tab 2 | Unit economics | From §3 |
| Tab 3 | Risks | From §9 |

---

## Writing order (suggested)

1. §3 architecture + §4 methodology (from code that exists).
2. §5–§7 economics (from locked pricing doc).
3. §2 related work (research pass).
4. §8 forecast (founder scenarios).
5. §1 / abstract / conclusion last.
6. Figures: regenerate from live app after Mono flip.

---

## Changelog

### v1.0 (September 24, 2026)
- Initial 10–20 pp outline for fa-6 (idea, context, architecture, cost-benefit, investment, revenue streams, 3-year forecast, risks) aligned to product-foundation §11 and mvp-demo-plan §7.
