# Creditax.ai — Agent Guide (Phase 0)

## Project Context

**Creditax.ai** — API-first AI platform bridging tax compliance and creditworthiness for the Nigerian market.

**Status:** Phase 0 (Solo Developer)
- You are working with a single developer
- No sub-agents available yet — implement directly
- Focus is learning infrastructure while building
- Project scaffold exists, no source code implemented yet

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `research/API-Research.md` | RAG architecture, credit APIs, Trigger.dev workflows, library choices |
| `research/Brand-Guidelines.md` | Design system, colors, typography, coding conventions |
| `research/Frontend-Infrastructure.md` | Frontend pages, admin dashboards, auth, B2B/B2C portals, marketplace |
| `research/reconnaissance.md` | Competitive analysis, market research |
| `research/project-roadmap.md` | 6-month implementation plan |
| `research/marketing-strategy.md` | Twitter-first marketing, launch plan, SuperScale content plan |
| `research/superScale-prompts.md` | All prompts for SuperScale.ai (mock-ups, videos, brand assets) |
| `.agents/skills/` | Design skills (frontend-design, web-design-guidelines, etc.) |

**Read these before starting major work.**

---

## Tech Stack (Confirmed Choices)

| Component | Technology | Why |
|-----------|------------|-----|
| **API Hosting** | Vercel | Free tier, global edge, easy scaling |
| **Database + Auth** | Supabase | PostgreSQL + pgvector + built-in auth |
| **Background Jobs** | Trigger.dev | Vercel-integrated, TypeScript-native, free tier |
| **LLM** | Kimchi.dev | OpenAI-compatible, minimax-m2.7, cost-effective |
| **Embeddings** | Google Vertex AI (primary), Hugging Face (fallback) | $300 free credit, text-embedding-005 |
| **File Storage** | Backblaze B2 | 10GB free, S3-compatible |
| **Image CDN** | Cloudinary | 25 credits/month, image optimization |
| **Credit APIs** | Mono (primary), Jumo (via partnership) | Nigerian bank data + credit scoring |
| **Business Verification** | Mono Lookup API + CAC Certificate upload | No official CAC API exists |
| **Geocoding/Maps** | Mapbox | 100k free requests/month, excellent coverage |
| **Knowledge Base** | GitBook-style Markdown | Simpler than PDFs, no Document AI needed |

---

## Key Directories

```
creditax-ai/
├── src/                    # Source code
│   ├── api/v1/            # API routes (/api/v1/*)
│   ├── web/               # Frontend (Next.js)
│   ├── ai/                # LLM, RAG, document parser
│   ├── db/                # Migrations, seeds
│   ├── workers/           # Background job handlers
│   └── core/              # Config, security, shared
├── infra/                 # IaC (Terraform), GCP configs
├── research/              # All planning documents
├── assets/                # Fonts, icons, images
└── scripts/               # DevOps scripts
```

---

## Design & Brand

Before building UI, read `research/Brand-Guidelines.md`.

**Brand Colors:**
- Primary: `#0D7377` (Deep Teal)
- Accent: `#32E875` (Bright Green)
- Dark BG: `#0A0F14`
- Light BG: `#F4F9F9`

**Fonts:** Inter (primary) + JetBrains Mono (code/amounts)

**Design Principle:** "Distinctive over default" — avoid generic AI aesthetics.

---

## Background Jobs (Trigger.dev)

**Trigger.dev** handles all async work:

```typescript
// Example: Document processing workflow
export const processDocumentJob = job({
  id: 'process-document',
  trigger: trigger_webhook({ name: 'document.uploaded' }),

  run: async (payload) => {
    // 1. Download file
    // 2. Extract with Google Document AI
    // 3. Calculate totals
    // 4. Store results
    // 5. Send webhook to user
  }
});
```

**Use Trigger.dev for:**

- Document processing (OCR, extraction)
- Report generation (async PDF creation)
- Credit score refresh (scheduled daily)
- Webhook delivery to clients
- RAG re-indexing (scheduled weekly)

**Why not GCP Cloud Functions?** Trigger.dev is TypeScript-native, has a generous free tier, Vercel integration, and built-in observability.

---

## RAG Pipeline

The RAG system answers Nigerian tax law questions using local documents:

```
User Query → Embed (Vertex AI) → Vector Search (Supabase pgvector) → LLM (Kimchi.dev)
```

**Dual-Index Architecture:**

| Index | Purpose | Content |
|-------|---------|---------|
| `tax_document_chunks` | Tax law Q&A | NTA, NTAA, FIRS guides, circulars |
| `tax_professionals_embeddings` | Marketplace search | Pro profiles, services, location |

**Knowledge Base Documents:**

| Priority | Document |
|----------|----------|
| P0 | Nigeria Tax Act (NTA) 2023 |
| P0 | Tax Administration Act (NTAA) 2023 |
| P0 | FIRS VAT Guide |
| P1 | Withholding Tax Circulars |
| P1 | Capital Gains Tax Act |

**Stored in:** Supabase `tax_document_chunks` table with pgvector embeddings.

**Marketplace RAG:** When users ask "find a tax pro near Lagos" or "who can help with VAT filing", the RAG system searches the `tax_professionals_embeddings` index and combines semantic matching with geographic filtering.

---

## Credit Integration

**APIs Available:**

| Provider | Purpose | Data |
|----------|---------|------|
| Mono | Financial data | Income analysis, statements, BVN/NIN verification |
| Jumo | Credit scoring (via partnership) | Alternative credit score |

> ⚠️ **Okra is DEFUNCT** — Do not use Okra in any integration plans.

**Credit Score = f(income, stability, savings rate, debt burden)**

No competitor combines credit scoring with tax compliance data — this is our differentiator.

---

## Tax Professional Marketplace

**Purpose:** Onboard verified tax professionals so consumers can find trusted help for taxes, filing, and audits.

**Verification Flow:**
1. Tax pro signs up and enters CAC registration number
2. Mono Lookup API validates business name/status (no official CAC API exists)
3. Tax pro uploads CAC certificate PDF as proof
4. Admin reviews and approves/rejects in `/admin/marketplace`
5. Once approved, pro appears in marketplace with verified badge

**Geolocation Search:**
- Mapbox Geocoding API converts addresses to lat/lng
- Supabase PostGIS geography for proximity queries
- "Near me" feature uses browser geolocation API
- Results sorted by distance when location is shared

**RAG Integration:**
- Tax professionals embedded as vector documents (services, description, location)
- Natural language queries: "I need a VAT expert near Lagos Island"
- RAG returns top matches with contact info (phone, email, WhatsApp)
- Hybrid search combines semantic similarity + geographic filtering

**Key Pages:**
- `/marketplace` — Public listing with search, filters, map view
- `/marketplace/[slug]` — Professional profile (e.g., `/marketplace/akinwale-associates`)
- `/pro/apply` — Multi-step tax pro application
- `/admin/marketplace` — Super admin approval queue

**Contact Info Storage:** Every professional profile stores phone, email, WhatsApp (optional), website (optional) for direct contact.

---

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Run tests

# Trigger.dev (run alongside dev)
npx trigger.dev
```

---

## Implementation Priority

### Phase 0 (Current) — Foundation

- [x] Git repo initialized
- [x] Research complete
- [ ] Dev environment configured
- [ ] Supabase project created
- [ ] Trigger.dev project created

### Phase 1 (Week 3-5) — Core API

- API key generation + validation
- Tax calculation endpoint
- Rate limiting

### Phase 2 (Week 6-8) — RAG

- Document ingestion pipeline
- Vector store setup
- Chat endpoint

### Phase 3 (Week 9-12) — Document Processing

- Google Document AI integration
- Receipt/invoice extraction
- Report generation

---

## Git Workflow

```bash
git status                    # Check current state
git add <file>                # Stage specific files
git commit -m "description"   # Commit with clear message
```

**Rule:** Never commit secrets, API keys, or credentials.

---

## When to Ask Questions

Ask only if the repo cannot answer:

- Undocumented team conventions
- Missing setup prerequisites
- Clarification on user preferences

Do NOT ask about anything clearly documented in `research/`.

---

## Design Skills

Skills are installed in `.agents/skills/` for design work:

| Skill | Use For |
|-------|---------|
| `find-skills` | Discover new skills |
| `frontend-design` | Distinctive UI guidance |
| `web-design-guidelines` | Vercel interface standards |
| `high-end-visual-design` | Premium/Awwwards aesthetics |

Load with the `skill` tool when designing.

---

## Document Changelog Policy

**When editing any research document, ALWAYS add a changelog entry at the bottom.**

Format:
```
### vX.Y (Date)
- Description of changes
```

Changelog goes at the bottom of the document, after the main content, before any trailing markers.

**Research Documents with Changelogs:**
- `research/API-Research.md` — API research, RAG architecture
- `research/Brand-Guidelines.md` — Design system, typography, colors
- `research/Frontend-Infrastructure.md` — Frontend pages, admin dashboards, auth, marketplace
- `research/brand-identity.md` — Brand foundation, logo, tagline
- `research/reconnaissance.md` — Market research, competitive analysis
- `research/project-roadmap.md` — Implementation timeline
- `research/marketing-strategy.md` — Twitter-first marketing, launch plan
- `research/superScale-prompts.md` — All SuperScale.ai prompts for marketing materials

---

*Document Version: 1.2*
*Last Updated: June 12, 2026*

## Changelog

### v1.2 (June 12, 2026)
- Added Mapbox to tech stack (geocoding, maps, 100k free requests/month)
- Added Mono Lookup API + CAC Certificate upload for business verification
- Added Tax Professional Marketplace section with verification flow
- Updated RAG Pipeline with dual-index architecture (tax docs + pro profiles)
- Added "Near me" and proximity search documentation
- Added contact info storage (phone, email, WhatsApp, website)
- Updated project-roadmap.md with Phase 5.5: Tax Professional Marketplace
- Added marketing-strategy.md (Twitter-first, SuperScale plan)
- Added superScale-prompts.md (all prompts for SuperScale.ai)
- Added Frontend-Infrastructure.md to key documents

### v1.1 (June 12, 2026)
- Added changelog policy to AGENTS.md
- Updated tech stack: Kimchi.dev (LLM), Vertex AI (embeddings)
- Added Frontend-Infrastructure.md to key documents
- Removed Google Document AI (using Markdown/GitBook approach)
- Updated credit APIs: Okra marked DEFUNCT, Mono primary, Jumo via partnership
- Storage: Backblaze B2 for files, Cloudinary for images

### v1.0 (June 11, 2026)
- Initial AGENTS.md creation