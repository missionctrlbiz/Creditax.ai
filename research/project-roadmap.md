# Creditax.ai — Project Roadmap

**Project:** Creditax.ai — AI-Powered Tax & Credit Intelligence Platform
**Version:** 1.0
**Date:** June 11, 2026
**Author:** Solo Developer
**Horizon:** 6 Months

---

## Overview

Creditax.ai is an API-first platform merging tax compliance intelligence with credit scoring for the Nigerian market. Built for learning full-stack infrastructure while creating a monetizable product.

---

## Phase 0: Foundation (Week 1-2)

**Goal:** Establish brand, research complete, project scaffolded

### Milestones

- [x] Reconnaissance research completed (`research/reconnaissance.md`)
- [x] Brand identity drafted (`research/brand-identity.md`)
- [x] Project folder structure created
- [x] PRD template created
- [x] This roadmap created

### This Week's Tasks

- [ ] Finalize brand name (Creditax.ai confirmed)
- [ ] Create logo concept (can use text-based initially)
- [ ] Set up Git repository
- [ ] Configure development environment

### Deliverables

| Deliverable | Status |
|-------------|--------|
| reconnaissance.md | ✅ Complete |
| brand-identity.md | ✅ Complete |
| PRD-template.md | ✅ Complete |
| project-roadmap.md | ✅ Complete |
| Git repository | 🔄 In Progress |
| Logo concept | ⏳ Pending |

---

## Phase 1: Core API Infrastructure (Week 3-5)

**Goal:** Basic API running with API key management, tax calculation endpoints

### Milestones

- [ ] API framework set up (Next.js API routes or Express)
- [ ] API key generation and management system
- [ ] Rate limiting middleware
- [ ] Basic tax calculation endpoint (income tax estimate)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Developer portal (basic)

### Technical Skills to Practice

| Skill | How Practiced |
|-------|---------------|
| API key management | Generate, store, validate, rotate API keys |
| Middleware patterns | Rate limiting, auth checks |
| Environment config | .env, secrets management |

### Feature List

```
P0:
- POST /api/v1/auth/verify -> Validate API key
- POST /api/v1/tax/calculate -> Income tax calculation
- GET /api/v1/tax/brackets -> Current tax brackets

P1:
- POST /api/v1/api-keys -> Generate new API key
- GET /api/v1/api-keys -> List user's keys
- DELETE /api/v1/api-keys/:id -> Revoke key
- Rate limiting: 100 requests/minute per key
```

### Stack

- **API:** Next.js API Routes (or Express on Vercel)
- **Database:** Supabase (for API keys, user data)
- **Auth:** Supabase Auth
- **Hosting:** Vercel (free tier)

---

## Phase 2: AI Integration & RAG Pipeline (Week 6-8)

**Goal:** Tax Q&A chatbot powered by RAG on Nigerian tax law

### Milestones

- [ ] Supabase vector store set up
- [ ] Nigerian tax law documents ingested (NTA, NTAA, FIRS guides)
- [ ] RAG pipeline working (embed → store → retrieve → generate)
- [ ] Chat endpoint: POST /api/v1/chat
- [ ] Webhook system for async responses

### Technical Skills to Practice

| Skill | How Practiced |
|-------|---------------|
| RAG architecture | Embeddings + vector search + LLM |
| Document processing | Chunking, embedding, storage |
| Async processing | Webhooks for long-running queries |

### Feature List

```
P0:
- POST /api/v1/chat -> Ask tax question (RAG-powered)
- GET /api/v1/tax/rules/:topic -> Retrieve relevant tax rules

P1:
- Webhook callback for chat responses
- Conversation history per user
- Multi-turn conversation support

P2:
- Multi-language support (Yoruba, Hausa, Igbo, Pidgin)
- Voice input support
```

### Stack

- **LLM:** OpenAI GPT-4o (or Gemini 1.5)
- **Embeddings:** OpenAI text-embedding-3-small
- **Vector DB:** Supabase pgvector
- **Document Source:** NTA, NTAA, FIRS public documents

---

## Phase 3: Document Processing Pipeline (Week 9-12)

**Goal:** Upload receipts/invoices → extract data → generate reports

### Milestones

- [ ] Document upload endpoint
- [ ] Integration with Google Document AI (or Rossum)
- [ ] Data extraction (amounts, dates, tax IDs, descriptions)
- [ ] Report generation endpoint
- [ ] Document storage with S3-compatible storage (Supabase Storage)

### Technical Skills to Practice

| Skill | How Practiced |
|-------|---------------|
| File upload handling | Multipart uploads, validation |
| External AI API integration | Google Document AI |
| Background jobs | GCP Triggers for heavy processing |
| Report generation | PDF/text generation |

### Feature List

```
P0:
- POST /api/v1/documents/upload -> Upload receipt/invoice
- GET /api/v1/documents/:id -> Get extracted data
- POST /api/v1/documents/:id/report -> Generate expense report

P1:
- POST /api/v1/documents/bulk-upload -> Batch upload
- GET /api/v1/reports -> List generated reports
- Webhook on document processed

P2:
- Auto-categorization of expenses
- VAT extraction and calculation
- Integration with accounting software
```

### Stack

- **Document AI:** Google Document AI ($300 free tier)
- **Storage:** Supabase Storage
- **Background Jobs:** GCP Cloud Functions/Triggers

---

## Phase 4: Credit Scoring Integration (Week 13-16)

**Goal:** Link tax compliance history to credit score, offer credit health

### Milestones

- [ ] Tax compliance history endpoint
- [ ] Credit score calculation (basic algorithm)
- [ ] Credit health dashboard
- [ ] BVN/NIN verification integration (optional)

### Technical Skills to Practice

| Skill | How Practiced |
|-------|---------------|
| Data correlation | Tax history → credit risk |
| Credit scoring algorithms | Points-based or ML model |
| Verification integrations | BVN lookup APIs |

### Feature List

```
P0:
- GET /api/v1/credit/score -> Get credit health score
- GET /api/v1/credit/history -> Tax compliance history
- GET /api/v1/credit/report -> Full credit report

P1:
- POST /api/v1/credit/verify-bvn -> BVN verification
- Credit monitoring alerts (webhook)
- Improvement recommendations

P2:
- Loan eligibility estimate
- Integration with lending partners
- Credit building suggestions
```

### Stack

- **Database:** Continue with Supabase
- **Verification:** Okra, Mono, or similar Nigerian API
- **Credit Model:** Rule-based initially, ML upgrade later

---

## Phase 5: B2B Platform & Developer Ecosystem (Week 17-20)

**Goal:** Full developer platform with API keys, webhooks, sandbox

### Milestones

- [ ] Developer dashboard (manage keys, view usage)
- [ ] Sandbox environment
- [ ] Webhook system (configurable endpoints)
- [ ] Usage analytics
- [ ] Comprehensive API documentation

### Technical Skills to Practice

| Skill | How Practiced |
|-------|---------------|
| Load balancing | Vercel edge + GCP Cloud Run |
| Webhook architecture | Event-driven, retries, signature verification |
| Usage tracking | Per-key analytics |
| Terraform IaC | Full GCP project setup |

### Feature List

```
P0:
- Developer portal: key management
- Sandbox: /sandbox/v1/* endpoints
- POST /api/v1/webhooks -> Register webhook
- GET /api/v1/usage -> Usage per key

P1:
- Usage alerts (webhook when approaching limit)
- Custom scopes per API key
- Team management (multiple keys per org)
- OpenAPI spec (public)

P2:
- Stripe integration for usage-based billing
- Partner program
- White-label options
```

### Stack

- **IaC:** Terraform (full GCP project)
- **Monitoring:** GCP Cloud Monitoring + Logging
- **Load Testing:** k6 or loader.io
- **Docs:** Vercel (deployment) or ReadMe.com

---

## Phase 6: Launch & Iterate (Week 21-24+)

**Goal:** Public launch, get users, iterate based on feedback

### Milestones

- [ ] Public API launch
- [ ] Landing page + marketing
- [ ] Waitlist/early access signup
- [ ] First paying customers
- [ ] Feedback loop established

### Go-to-Market

1. **Developer outreach** — Nigerian tech community (Twitter, DevC, etc.)
2. **Content marketing** — Blog on tax compliance, credit tips
3. **Partnerships** — CPAs, small business associations
4. **Product Hunt** — Launch when ready

### Pricing Model (TBD)

```
Free Tier:
- 100 API calls/month
- Basic tax calculations
- Document upload (10/month)

Pro Tier: $X/month
- 10,000 API calls/month
- Full RAG chat
- Document processing
- Credit score

Enterprise: Custom
- Unlimited
- Custom rate limits
- Dedicated support
- White-label
```

---

## Monthly Breakdown

| Month | Focus | Key Deliverables |
|-------|-------|------------------|
| **Month 1** | Foundation | Brand, API skeleton, API key system, first endpoint |
| **Month 2** | AI/RAG | RAG pipeline, tax Q&A, webhook system |
| **Month 3** | Document Pipeline | Upload → Extract → Report, background jobs |
| **Month 4** | Credit + IaC | Credit scoring, Terraform full setup, monitoring |
| **Month 5** | B2B Platform | Developer dashboard, sandbox, usage analytics |
| **Month 6** | Launch | Public launch, marketing, first revenue |

---

## Risk Management

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| FIRS API changes | Medium | High | Version all endpoints, don't rely on live FIRS data |
| LLM costs | Medium | Medium | Aggressive caching, rate limits, free tiers first |
| Solo burnout | Medium | High | Focus on small wins, don't overbuild |
| Competition | Low | Medium | Move fast, unique platform positioning |
| Nigerian internet | Medium | Low | Progressive web app, offline graceful degradation |

---

## Success Metrics

### Technical

| Metric | Target |
|--------|--------|
| API uptime | 99.5% |
| Response time (p95) | < 500ms |
| Test coverage | > 80% |
| Documentation completeness | 100% of endpoints |

### Business

| Metric | Target (6 months) |
|--------|-------------------|
| API signups | 100 |
| Active API users | 25 |
| Monthly revenue | $1,000 |
| NPS score | > 40 |

---

## Open Questions

- [ ] Should we target B2C (consumers) or B2B (businesses) first?
- [ ] Pricing model — flat rate vs. usage-based?
- [ ] BVN verification now or later?
- [ ] Build native mobile app or stay web-only?
- [ ] Partnership with established fintech or go solo?

---

## Resources

### Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Google Document AI](https://cloud.google.com/document-ai)
- [OpenAI API](https://platform.openai.com/docs)
- [Terraform GCP](https://developer.hashicorp.com/terraform/tutorials/gcp-get-started)

### Reference Products

- TurboTax API ecosystem
- Rossum (document processing)
- Stripe (developer platform, API key management)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | June 11, 2026 | Initial roadmap |

---

*End of Roadmap*