# Creditax.ai — Agent Buildout Workflow

**Version:** 1.0
**Date:** June 12, 2026
**Status:** Active Buildout
**Branch:** `mvp-refactor`
**Reference Branch:** `57-screen-feature-branch` (57 screens built, DO NOT DELETE)

---

## Purpose

This document is the **single source of truth** for engineering teams building Creditax.ai MVP. It contains the complete scope, agent task definitions, technical specifications, and workflow for completing the build.

> **Important:** This is NOT a simplified MVP scope. It is the FULL buildout plan covering all planned features, structured for parallel agent execution with cross-loop verification.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Full Page Inventory](#4-full-page-inventory)
5. [API Endpoints](#5-api-endpoints)
6. [Database Schema](#6-database-schema)
7. [Agent Task Definitions](#7-agent-task-definitions)
8. [Safe File Deletion Strategy](#8-safe-file-deletion-strategy)
9. [Cross-Loop Workflow](#9-cross-loop-workflow)
10. [Testing & Verification](#10-testing--verification)
11. [Non-MVP Files to Delete](#11-non-mvp-files-to-delete)
12. [Reference Assets](#12-reference-assets)

---

## 1. Project Overview

**Creditax.ai** — API-first AI platform bridging tax compliance and creditworthiness for the Nigerian market.

### Core Value Proposition
- RAG-powered tax Q&A using Nigerian tax law (NTA 2023, NTAA 2023, FIRS guides)
- Credit scoring based on tax compliance history
- Verified tax professional marketplace with geolocation search

### Target Users
1. **Consumers (B2C)** — Individuals needing tax help, document processing, credit score
2. **Tax Professionals (B2B)** — CPAs, tax agents needing client management
3. **Developers (B2B2B)** — API access for building on Creditax

### Branch Context
```
mvp-refactor (current) ← YOU ARE HERE
├── Working branch for MVP buildout
├── Contains 57-screen assets in /superscale
└── All non-MVP files marked for deletion

57-screen-feature-branch (reference only)
├── 57 screens built via SuperScale
├── NOT part of current build
└── DO NOT DELETE - serves as visual reference
```

---

## 2. Tech Stack

### Confirmed Choices

| Component | Technology | Purpose |
|-----------|------------|---------|
| **API Hosting** | Vercel | Free tier, global edge, easy scaling |
| **Database + Auth** | Supabase | PostgreSQL + pgvector + built-in auth |
| **Background Jobs** | Trigger.dev | Vercel-integrated, TypeScript-native, free tier |
| **LLM** | Kimchi.dev | OpenAI-compatible, minimax-m2.7, cost-effective |
| **Embeddings** | Google Vertex AI (primary), Hugging Face (fallback) | text-embedding-005 |
| **File Storage** | Backblaze B2 | 10GB free, S3-compatible |
| **Image CDN** | Cloudinary | 25 credits/month, image optimization |
| **Credit APIs** | Mono (primary), Jumo (via partnership) | Nigerian bank data + credit scoring |
| **Business Verification** | Mono Lookup API + CAC Certificate upload | No official CAC API exists |
| **Geocoding/Maps** | Mapbox | 100k free requests/month, excellent coverage |
| **Payments** | Stripe | Subscription management |
| **Knowledge Base** | GitBook-style Markdown | Simple, version-controlled |

### Project Directory Structure

```
creditax-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── dashboard/         # User dashboard
│   │   ├── admin/             # Admin pages
│   │   ├── pro/               # Tax professional portal
│   │   ├── marketplace/       # Public marketplace
│   │   └── api/               # API routes
│   ├── ai/                    # LLM, RAG, embeddings
│   ├── core/                  # Config, security, utilities
│   ├── db/                    # Migrations, seeds
│   └── workers/               # Trigger.dev jobs
├── superscale/                # 57-screen reference assets (DO NOT DELETE)
├── public/                    # Static assets
├── research/                  # Planning documents
└── scripts/                   # DevOps scripts
```

---

## 3. Design System

### Brand Colors

```css
:root {
  /* Primary */
  --color-primary: #0D7377;        /* Deep Teal */
  --color-primary-dark: #095557;
  --color-primary-light: #14919B;

  /* Accent */
  --color-accent: #32E875;         /* Bright Green */
  --color-accent-dark: #28C45F;
  --color-accent-light: #5AED94;

  /* Backgrounds */
  --color-bg-dark: #0A0F14;        /* Dark mode background */
  --color-bg-light: #F4F9F9;       /* Light mode background */
  --color-bg-card: #111922;        /* Card background (dark) */
  --color-bg-card-light: #FFFFFF;  /* Card background (light) */

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;

  /* Status */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### Typography

```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Code/Numbers Font */
font-family: 'JetBrains Mono', 'Fira Code', monospace;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-glow: 0 0 20px rgba(50, 232, 117, 0.3);
```

### Component Patterns

**Buttons:**
- Primary: `bg-[#0D7377] text-white hover:bg-[#095557]`
- Accent: `bg-[#32E875] text-black hover:bg-[#28C45F]`
- Ghost: `bg-transparent border border-[#0D7377] text-[#0D7377]`

**Cards:**
- Background: `--color-bg-card`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Radius: `--radius-xl`
- Padding: `--space-6`

**Inputs:**
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Focus: `border-[#32E875] ring-2 ring-[#32E875]/20`

---

## 4. Full Page Inventory

### 4.1 Public Pages (No Auth Required)

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| Landing | `/` | Marketing homepage with hero, features, CTA | P0 |
| Pricing | `/pricing` | Subscription tiers: Free (50/day), Pro ($19/mo, 500/day), Enterprise | P0 |
| Docs | `/docs` | API documentation | P2 |
| Blog | `/blog` | Company blog | P2 |
| About | `/about` | Company info | P2 |
| Status | `/status` | Service status page | P1 |
| Marketplace | `/marketplace` | Find verified tax professionals | P1 |

### 4.2 Authenticated Consumer Pages (B2C)

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| Dashboard | `/dashboard` | User home: Tax Health Score, Credit Score, quick actions | P0 |
| Tax Chat | `/dashboard/chat` | **CORE FEATURE** — RAG-powered tax Q&A | P0 |
| Document Upload | `/dashboard/upload` | Camera-first upload with OCR preview | P1 |
| My Documents | `/dashboard/documents` | View/manage uploaded documents | P1 |
| Credit Score | `/dashboard/credit` | Credit health based on tax compliance | P1 |
| Tax Filing | `/dashboard/tax-filing` | Guided tax filing wizard | P2 |
| Reports | `/dashboard/reports` | Generated tax summaries | P2 |
| API Keys | `/dashboard/keys` | Manage API keys (future) | P3 |
| Usage | `/dashboard/usage` | Token usage analytics | P1 |
| Settings | `/dashboard/settings` | Account, notifications, security | P0 |

### 4.3 Tax Professional Portal (B2B)

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| Pro Dashboard | `/pro` | Overview: clients, revenue, compliance | P1 |
| Client Management | `/pro/clients` | Full client list with search/filter | P1 |
| Client Detail | `/pro/clients/[id]` | Deep-dive: documents, filings, compliance | P1 |
| Client Documents | `/pro/documents` | View client's uploaded docs | P1 |
| Bulk Calculations | `/pro/calculations` | Run tax calc across multiple clients | P2 |
| Client Verification | `/pro/verify` | TIN/BVN verification via Mono API | P1 |
| Pro Settings | `/pro/settings` | Profile, branding, sub-accounts | P2 |
| Apply | `/pro/apply` | Multi-step application flow | P1 |

### 4.4 Super Admin Pages

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| Admin Dashboard | `/admin` | System metrics, active users, alerts | P0 |
| Users | `/admin/users` | User management | P1 |
| Tax Professionals | `/admin/professionals` | Pro user management | P1 |
| Knowledge Base | `/admin/kb` | Markdown editor for tax documents | P0 |
| Audit Log | `/admin/audit` | All system changes | P1 |
| Marketplace | `/admin/marketplace` | Pro approval queue | P1 |
| Departments | `/admin/departments` | Department management | P2 |
| Facilities | `/admin/facilities` | Live facility observation | P2 |
| Admin Settings | `/admin/settings` | System settings | P1 |

### 4.5 Developer Portal (Phase 4+)

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| API Explorer | `/developers` | Interactive API docs | P4 |
| Quickstart | `/developers/quickstart` | Integration guide | P4 |
| Reference | `/developers/reference` | Full API reference | P4 |
| SDKs | `/developers/sdks` | Client libraries | P4 |
| Sandbox | `/developers/sandbox` | Test environment | P4 |
| Webhooks | `/developers/webhooks` | Webhook management | P4 |

---

## 5. API Endpoints

### 5.1 Authentication

```
POST /api/v1/auth/magic-link
  Request: { email: string }
  Response: { success: boolean, message: string }

POST /api/v1/auth/verify
  Request: { token: string }
  Response: { user: User, session: Session }

POST /api/v1/auth/logout
  Response: { success: boolean }

GET /api/v1/auth/session
  Response: { user: User | null }
```

### 5.2 RAG Chat (Core Feature)

```
POST /api/v1/chat
  Request: { 
    message: string,
    conversationId?: string,
    includeSources?: boolean
  }
  Response: { 
    reply: string,
    sources?: Source[],
    conversationId: string,
    tokensUsed: number
  }

GET /api/v1/chat/conversations
  Response: { conversations: Conversation[] }

GET /api/v1/chat/conversations/:id
  Response: { conversation: Conversation, messages: Message[] }

DELETE /api/v1/chat/conversations/:id
  Response: { success: boolean }
```

### 5.3 Documents

```
POST /api/v1/documents/upload
  Request: FormData (file, metadata)
  Response: { document: Document, extraction: Extraction }

GET /api/v1/documents
  Response: { documents: Document[] }

GET /api/v1/documents/:id
  Response: { document: Document, extraction: Extraction }

DELETE /api/v1/documents/:id
  Response: { success: boolean }

POST /api/v1/documents/:id/process
  Response: { jobId: string }

GET /api/v1/documents/:id/extraction
  Response: { extraction: Extraction }
```

### 5.4 Credit

```
GET /api/v1/credit/score
  Response: { 
    score: number,
    factors: Factor[],
    history: HistoryItem[]
  }

GET /api/v1/credit/report
  Response: { 
    report: CreditReport,
    generatedAt: string
  }

POST /api/v1/credit/verify-bvn
  Request: { bvn: string }
  Response: { verified: boolean, data: BVNData }
```

### 5.5 Tax Calculations

```
POST /api/v1/tax/calculate
  Request: { 
    income: number,
    year: number,
    type: 'personal' | 'business'
  }
  Response: { 
    tax: number,
    brackets: Bracket[],
    breakdown: Breakdown
  }

GET /api/v1/tax/brackets
  Response: { brackets: TaxBracket[] }

GET /api/v1/tax/rules/:topic
  Response: { rules: TaxRule[] }
```

### 5.6 Knowledge Base

```
GET /api/v1/kb/documents
  Response: { documents: KBDocument[] }

GET /api/v1/kb/documents/:id
  Response: { document: KBDocument, content: string }

POST /api/v1/kb/documents
  Request: { title: string, content: string, category: string }
  Response: { document: KBDocument }

PUT /api/v1/kb/documents/:id
  Request: { title?: string, content?: string }
  Response: { document: KBDocument }

DELETE /api/v1/kb/documents/:id
  Response: { success: boolean }

POST /api/v1/kb/documents/:id/embed
  Response: { jobId: string }
```

### 5.7 Marketplace

```
GET /api/v1/marketplace/professionals
  Query: { 
    search?: string,
    location?: string,
    service?: string,
    verified?: boolean,
    limit?: number,
    offset?: number
  }
  Response: { professionals: TaxPro[], total: number }

GET /api/v1/marketplace/professionals/:id
  Response: { professional: TaxPro }

POST /api/v1/marketplace/consultation
  Request: { professionalId: string, message: string }
  Response: { consultation: Consultation }
```

### 5.8 Usage & Billing

```
GET /api/v1/usage
  Response: { 
    daily: UsageData,
    monthly: UsageData,
    limits: Limits
  }

POST /api/v1/billing/stripe/checkout
  Request: { tier: 'pro' | 'enterprise' }
  Response: { sessionUrl: string }

POST /api/v1/billing/stripe/webhook
  Request: Stripe webhook payload
  Response: { received: boolean }
```

### 5.9 Admin

```
GET /api/v1/admin/users
  Query: { search?, role?, limit?, offset? }
  Response: { users: User[], total: number }

POST /api/v1/admin/users/:id/suspend
  Response: { success: boolean }

GET /api/v1/admin/professionals
  Query: { status?, search? }
  Response: { professionals: TaxPro[] }

POST /api/v1/admin/professionals/:id/approve
  Response: { success: boolean }

POST /api/v1/admin/professionals/:id/reject
  Request: { reason: string }
  Response: { success: boolean }

GET /api/v1/admin/audit
  Query: { userId?, action?, from?, to?, limit?, offset? }
  Response: { entries: AuditEntry[], total: number }
```

---

## 6. Database Schema

### Core Tables

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'pro', 'admin', 'super_admin')),
  stripe_customer_id TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  daily_token_limit INT DEFAULT 50,
  tokens_used_today INT DEFAULT 0,
  last_token_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Professionals
CREATE TABLE tax_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  business_name TEXT NOT NULL,
  cac_number TEXT,
  cac_verified BOOLEAN DEFAULT FALSE,
  firs_tin TEXT,
  description TEXT,
  services TEXT[],
  price_min INT,
  price_max INT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Nigeria',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  website TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected')),
  rejection_reason TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INT,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  extraction JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Scores
CREATE TABLE credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  score INT NOT NULL,
  factors JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, calculated_at)
);

-- KB Documents (Knowledge Base)
CREATE TABLE kb_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  chunk_count INT,
  embedding_status TEXT DEFAULT 'pending' CHECK (embedding_status IN ('pending', 'embedding', 'completed', 'failed')),
  published BOOLEAN DEFAULT FALSE,
  version INT DEFAULT 1,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Consultations
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES tax_professionals(id),
  consumer_id UUID REFERENCES users(id),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Vector Tables (for RAG)

```sql
-- Tax Document Chunks (for RAG Q&A)
CREATE TABLE tax_document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kb_document_id UUID REFERENCES kb_documents(id),
  chunk_text TEXT NOT NULL,
  chunk_index INT,
  embedding VECTOR(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Professional Embeddings (for marketplace search)
CREATE TABLE tax_professional_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_professional_id UUID REFERENCES tax_professionals(id),
  embedding VECTOR(768),
  searchable_text TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
-- Vector search indexes
CREATE INDEX idx_tax_chunks_embedding ON tax_document_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_pro_embeddings_embedding ON tax_professional_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Geolocation index
CREATE INDEX idx_tax_pro_lat_lng ON tax_professionals(latitude, longitude);

-- Text search
CREATE INDEX idx_tax_pro_search ON tax_professionals USING gin(to_tsvector('english', business_name || ' ' || COALESCE(description, '')));

-- Performance indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_credit_user ON credit_scores(user_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);
```

---

## 7. Agent Task Definitions

### Phase 1: Foundation (Parallel)

#### Agent 1: Landing + Pricing Page
```
Task: landing-pricing
Priority: P0
Estimated Time: 4 hours

Scope:
- Build / page.tsx (landing page)
  - Hero section with headline, subheadline, CTAs
  - Features grid (RAG chat, document upload, credit score)
  - Social proof section
  - Footer with links
- Build /pricing page.tsx
  - Free tier card (50 queries/day)
  - Pro tier card ($19/mo, 500 queries/day) with Stripe integration
  - Enterprise tier card (custom)
  - FAQ section

Tech Stack:
- Next.js App Router
- Tailwind CSS
- Framer Motion for animations
- Stripe Checkout

Verification:
- npm run build passes
- Page loads at / and /pricing
- Stripe checkout redirects correctly
```

#### Agent 2: Authentication Flow
```
Task: auth-flow
Priority: P0
Estimated Time: 4 hours

Scope:
- Build /login/page.tsx
  - Magic link email input
  - "Send link" button with loading state
  - Success state with "check email" message
- Build /signup/page.tsx
  - Email input
  - Terms acceptance checkbox
  - Magic link send flow
- Supabase Auth integration
  - Magic link via Supabase
  - Session management
  - Protected route middleware

Tech Stack:
- Supabase Auth
- React Hook Form + Zod validation
- Middleware for route protection

Verification:
- Magic link email sends successfully
- Clicking link logs user in
- Redirect to /dashboard after login
- Logout clears session
```

#### Agent 3: RAG Chat (Core Feature)
```
Task: rag-chat
Priority: P0
Estimated Time: 8 hours

Scope:
- Build /dashboard/chat/page.tsx
  - Chat interface with message history
  - Input field with send button
  - Loading state during API call
  - Token usage display
  - Source citations in responses
- Build /api/v1/chat endpoint
  - Accept user message
  - Embed query via Vertex AI
  - Vector search in Supabase pgvector
  - Generate response via Kimchi.dev
  - Track token usage
  - Enforce daily limits

Tech Stack:
- Vertex AI embeddings
- Supabase pgvector
- Kimchi.dev LLM
- Trigger.dev for async (optional)

Verification:
- Chat responds to tax queries
- Sources are cited
- Token count updates
- Daily limit enforced
```

#### Agent 4: Dashboard Scaffold
```
Task: dashboard-scaffold
Priority: P0
Estimated Time: 4 hours

Scope:
- Build /dashboard/layout.tsx
  - Sidebar navigation
  - Header with user menu
  - Main content area
- Build /dashboard/page.tsx
  - Tax Health Score card (0-100)
  - Credit Score card
  - Quick actions (Upload, Chat, Reports)
  - Recent activity feed
- Token usage tracking component
  - Daily/weekly/monthly charts
  - Limit warning when approaching cap

Tech Stack:
- Next.js App Router
- Tailwind CSS
- Recharts for usage charts

Verification:
- Dashboard loads with user data
- Navigation works
- Usage charts display
```

---

### Phase 2: Consumer Features (Parallel)

#### Agent 5: Document Upload
```
Task: document-upload
Priority: P1
Estimated Time: 6 hours

Scope:
- Build /dashboard/upload/page.tsx
  - Camera capture (mobile)
  - Drag-and-drop zone (desktop)
  - File type validation
  - Upload progress indicator
- Build /dashboard/documents/page.tsx
  - Document list with thumbnails
  - Status badges (pending, processing, complete)
  - Delete functionality
  - Filter by type/status
- Document processing pipeline
  - Trigger.dev job for OCR
  - Data extraction (amount, date, description)
  - Storage in Supabase

Tech Stack:
- React Dropzone
- Trigger.dev jobs
- Supabase Storage

Verification:
- Files upload successfully
- OCR extracts data
- Documents appear in list
- Status updates correctly
```

#### Agent 6: Settings Page
```
Task: settings-page
Priority: P0
Estimated Time: 3 hours

Scope:
- Build /dashboard/settings/page.tsx
  - Profile section (name, avatar)
  - Security section (change password, 2FA)
  - Notifications section (email, push toggles)
  - Billing section (current plan, upgrade button)
  - Danger zone (delete account)

Tech Stack:
- React Hook Form
- Supabase Auth

Verification:
- Settings save correctly
- Avatar uploads work
- Notifications toggle persists
```

#### Agent 7: Admin KB Editor
```
Task: admin-kb
Priority: P0
Estimated Time: 6 hours

Scope:
- Build /admin/layout.tsx
  - Admin sidebar
  - Header with admin indicator
- Build /admin/kb/page.tsx
  - Document tree (sidebar)
  - Markdown editor (main area)
  - Preview toggle
  - Publish/Unpublish button
  - Version history
- KB API endpoints
  - CRUD for documents
  - Re-embed functionality

Tech Stack:
- React Markdown
- CodeMirror for editor
- Supabase

Verification:
- Documents can be created/edited
- Preview renders correctly
- Publish updates document
- Re-embed triggers vector update
```

#### Agent 8: Usage Tracking
```
Task: usage-tracking
Priority: P1
Estimated Time: 3 hours

Scope:
- Build /dashboard/usage/page.tsx
  - Daily token usage bar
  - 30-day history chart
  - Usage by feature breakdown
  - Limit warnings
- Usage API endpoint
  - GET /api/v1/usage
  - Daily token reset logic
  - Tier-based limits

Verification:
- Usage displays correctly
- Reset happens at midnight
- Charts show accurate data
```

---

### Phase 3: Marketplace + Tax Pro (Parallel)

#### Agent 9: Marketplace Public Listing
```
Task: marketplace-public
Priority: P1
Estimated Time: 6 hours

Scope:
- Build /marketplace/page.tsx
  - Search bar (text input)
  - Service type filters
  - Location filters
  - Map view toggle
  - Results list with cards
  - "Near me" button (geolocation)
- Build /marketplace/[slug]/page.tsx
  - Professional profile
  - Services + pricing table
  - Contact options (call, WhatsApp, email)
  - Map with location
  - Reviews section

Tech Stack:
- Mapbox GL JS
- Supabase PostGIS
- RAG for search

Verification:
- Search returns results
- Filters work
- Map displays markers
- "Near me" sorts by distance
```

#### Agent 10: Tax Pro Application Flow
```
Task: pro-application
Priority: P1
Estimated Time: 8 hours

Scope:
- Build /pro/apply/page.tsx (multi-step form)
  - Step 1: Basic info (business name, CAC)
  - Step 2: Mono Lookup API verification
  - Step 3: CAC certificate upload
  - Step 4: Location + services
  - Step 5: Contact info
  - Step 6: Review + submit
- Build /pro/dashboard/page.tsx
  - Client overview
  - Pending tasks
  - Revenue summary

Tech Stack:
- React Hook Form + Zod
- Mono Lookup API
- Supabase Storage

Verification:
- Multi-step form completes
- CAC verification works
- Upload succeeds
- Admin receives notification
```

#### Agent 11: Admin Marketplace Approvals
```
Task: admin-marketplace
Priority: P1
Estimated Time: 4 hours

Scope:
- Build /admin/marketplace/page.tsx
  - Pending approvals queue
  - Pro details view
  - Approve/Reject buttons
  - Rejection reason modal
- Admin API endpoints
  - POST /admin/professionals/:id/approve
  - POST /admin/professionals/:id/reject

Verification:
- Approvals queue shows pending pros
- Approve publishes to marketplace
- Reject sends notification
```

---

### Phase 4: Integration + Testing (Sequential)

#### Agent 12: Integration Test
```
Task: integration-test
Priority: P0
Estimated Time: 4 hours

Scope:
- End-to-end test scenarios:
  1. Signup → Login → Chat → Logout
  2. Upload document → Process → View extraction
  3. Pro application → Admin approval → Marketplace
  4. Subscription → Stripe webhook → Access granted
- Fix any broken flows
- Verify error handling

Verification:
- All E2E flows pass
- Error states display correctly
```

#### Agent 13: Cleanup + Build
```
Task: cleanup-build
Priority: P0
Estimated Time: 4 hours

Scope:
- Delete non-MVP files (see Section 11)
- Verify build still works
- Fix any broken imports
- Ensure superscale assets preserved

Verification:
- npm run build passes
- All MVP routes work
- No console errors
```

#### Agent 14: Final Verification
```
Task: final-verification
Priority: P0
Estimated Time: 2 hours

Scope:
- Run full test suite
- npm run lint passes
- npm run typecheck passes
- Lighthouse audit (optional)
- Cross-browser testing (if time permits)

Verification:
- All checks pass
- Ready for deployment
```

---

## 8. Safe File Deletion Strategy

### Critical Rules

1. **ALWAYS verify 57-screen reference exists first:**
   ```bash
   git branch -a | grep 57-screen
   ```

2. **DO NOT delete `superscale/` directory** — contains reference assets

3. **DO NOT delete `src/core/`, `src/ai/`, `src/db/`, `src/workers/`**

4. **Test build BEFORE deletion:**
   ```bash
   npm run build  # Must pass before deletion
   ```

5. **Test build AFTER deletion:**
   ```bash
   npm run build  # Must still pass after deletion
   ```

### Pre-Deletion Checklist

- [ ] `npm run build` passes
- [ ] All MVP routes return 200
- [ ] `superscale/` directory exists and is intact
- [ ] Git status shows only expected changes

### Deletion Commands

```bash
# Phase 1: Delete entire sections not in MVP
rm -rf src/app/pro/                    # B2B Tax Pro portal
rm -rf src/app/marketplace/            # Marketplace
rm -rf src/app/developers/             # Developer portal
rm -rf src/app/blog/                   # Blog
rm -rf src/app/about/                  # About page
rm -rf src/app/status/                 # Status page

# Phase 2: Delete individual non-MVP pages
rm -rf src/app/admin/professionals/    # Admin pro management
rm -rf src/app/admin/users/            # Admin user management
rm -rf src/app/admin/audit/            # Admin audit log
rm -rf src/app/admin/departments/      # Admin departments
rm -rf src/app/admin/facilities/       # Admin facilities

# Phase 3: Delete consumer pages not in MVP
rm -rf src/app/dashboard/credit/       # Credit score detail
rm -rf src/app/dashboard/tax-filing/   # Tax filing wizard
rm -rf src/app/dashboard/reports/      # Reports page
rm -rf src/app/dashboard/keys/         # API keys

# Phase 4: Verify build
npm run build
```

### What to KEEP

```
src/app/
├── page.tsx                    # Landing page ✅
├── pricing/page.tsx            # Pricing page ✅
├── login/page.tsx              # Magic link login ✅
├── signup/page.tsx             # Signup page ✅
├── layout.tsx                  # Root layout ✅
├── dashboard/
│   ├── page.tsx               # Consumer dashboard ✅
│   ├── chat/page.tsx          # RAG chat ✅
│   ├── documents/page.tsx     # Document list ✅
│   ├── upload/page.tsx        # Document upload ✅
│   ├── settings/page.tsx      # Settings ✅
│   ├── usage/page.tsx         # Usage tracking ✅
│   └── layout.tsx             # Dashboard layout ✅
└── admin/
    ├── page.tsx               # Admin dashboard ✅
    ├── kb/page.tsx            # KB editor ✅
    ├── marketplace/page.tsx   # Approval queue ✅
    └── layout.tsx             # Admin layout ✅

src/
├── core/                       # ✅ KEEP ALL
├── ai/                         # ✅ KEEP ALL
├── db/                         # ✅ KEEP ALL
├── workers/                    # ✅ KEEP ALL
└── app/api/                    # ✅ KEEP ALL

public/
├── favicon.png                 # ✅ KEEP
├── logo.png                    # ✅ KEEP
├── wordmark.png                # ✅ KEEP
└── (other assets)              # ✅ KEEP

superscale/                     # ✅ DO NOT DELETE (reference)
├── *.md                        # Design documentation
└── *.png, *.jpeg               # Screen mocks
```

---

## 9. Cross-Loop Workflow

### Execution Model

```
LOOP until ALL phases complete:

  ┌─────────────────────────────────────────────┐
  │  Phase 1: Foundation (4 agents in parallel) │
  │  ├── Agent 1: Landing + Pricing            │
  │  ├── Agent 2: Auth Flow                    │
  │  ├── Agent 3: RAG Chat                     │
  │  └── Agent 4: Dashboard Scaffold           │
  │                                             │
  │  Test: npm run build, verify routes        │
  └─────────────────────────────────────────────┘
           ↓ (if all pass)
  ┌─────────────────────────────────────────────┐
  │  Phase 2: Consumer Features (4 agents)     │
  │  ├── Agent 5: Document Upload              │
  │  ├── Agent 6: Settings                     │
  │  ├── Agent 7: Admin KB Editor              │
  │  └── Agent 8: Usage Tracking               │
  │                                             │
  │  Test: Full consumer flow                  │
  └─────────────────────────────────────────────┘
           ↓ (if all pass)
  ┌─────────────────────────────────────────────┐
  │  Phase 3: Marketplace (3 agents)           │
  │  ├── Agent 9: Marketplace Public           │
  │  ├── Agent 10: Pro Application             │
  │  └── Agent 11: Admin Marketplace           │
  │                                             │
  │  Test: Marketplace flow                    │
  └─────────────────────────────────────────────┘
           ↓ (if all pass)
  ┌─────────────────────────────────────────────┐
  │  Phase 4: Integration (3 agents)           │
  │  ├── Agent 12: Integration Test            │
  │  ├── Agent 13: Cleanup + Build             │
  │  └── Agent 14: Final Verification          │
  │                                             │
  │  Test: npm run build + lint + typecheck    │
  └─────────────────────────────────────────────┘
           ↓ (if all pass)
  ┌─────────────────────────────────────────────┐
  │  PROJECT COMPLETE                           │
  └─────────────────────────────────────────────┘

  BLOCKED FLOW (retry up to 3 times):
  ┌─────────────────────────────────────────────┐
  │  If agent BLOCKED:                          │
  │  1. Spawn helper agent with context         │
  │  2. Helper resolves blocker                 │
  │  3. Original agent retries                  │
  │  4. If still blocked after 3 retries →      │
  │     Escalate with detailed error report     │
  └─────────────────────────────────────────────┘
```

### Agent Communication Protocol

Each agent must report:
- **STARTING**: Task begun
- **BLOCKED**: Blocker with details + suggested resolution
- **COMPLETED**: Task done with verification results
- **FAILED**: Unrecoverable error

### Blocking Resolution Flow

```
Agent reports BLOCKED
       ↓
Create helper agent with:
- Blocked task ID
- Error details
- Context (what agent was trying to do)
- Relevant files/code
       ↓
er resolves
       ↓
Original agent retries
       ↓
Success → Continue
Failure after 3 retries → Escalate
```

---

## 10. Testing & Verification

### Verification Checklist

#### Build Verification
- [ ] `npm run build` passes without errors
- [ ] `npm run lint` passes without errors
- [ ] `npm run typecheck` passes without errors

#### Route Verification
- [ ] GET `/` returns 200
- [ ] GET `/pricing` returns 200
- [ ] GET `/login` returns 200
- [ ] GET `/signup` returns 200
- [ ] GET `/dashboard` returns 200 (auth required)
- [ ] GET `/dashboard/chat` returns 200 (auth required)
- [ ] GET `/dashboard/documents` returns 200 (auth required)
- [ ] GET `/dashboard/settings` returns 200 (auth required)
- [ ] GET `/dashboard/usage` returns 200 (auth required)
- [ ] GET `/admin` returns 200 (admin required)
- [ ] GET `/admin/kb` returns 200 (admin required)

#### Feature Verification

**Auth Flow:**
- [ ] Can request magic link
- [ ] Magic link email received
- [ ] Clicking link logs in
- [ ] Redirect to /dashboard after login
- [ ] Logout clears session

**RAG Chat:**
- [ ] Can send message
- [ ] Response received (within 30s)
- [ ] Sources displayed
- [ ] Token count updates
- [ ] Daily limit enforced

**Document Upload:**
- [ ] Can upload file
- [ ] Progress shown
- [ ] Document appears in list
- [ ] Status shows processing → complete

**Admin KB:**
- [ ] Can create document
- [ ] Can edit document
- [ ] Preview renders markdown
- [ ] Publish updates document

**Marketplace:**
- [ ] Search returns results
- [ ] Filters work
- [ ] Map displays markers
- [ ] "Near me" shows distance

### E2E Test Scenarios

```typescript
// Scenario 1: New user signup → chat → logout
async function testUserFlow() {
  // 1. Signup
  await page.goto('/signup');
  await page.fill('[name=email]', 'test@example.com');
  await page.click('[type=submit]');
  
  // 2. Check magic link message
  await expect(page.locator('text=Check your email')).toBeVisible();
  
  // 3. (Simulate email click - use test link)
  await page.goto('/auth/callback?token=test-token');
  
  // 4. Should be on dashboard
  await expect(page).toHaveURL('/dashboard');
  
  // 5. Go to chat
  await page.goto('/dashboard/chat');
  await page.fill('[name=message]', 'What is VAT?');
  await page.click('[type=submit]');
  
  // 6. Wait for response
  await expect(page.locator('.message-assistant')).toBeVisible({ timeout: 30000 });
  
  // 7. Logout
  await page.click('[data-testid=user-menu]');
  await page.click('text=Logout');
  
  // 8. Should be redirected to login
  await expect(page).toHaveURL('/login');
}
```

---

## 11. Non-MVP Files to Delete

### Files Marked for Deletion

```
# DELETE these entire directories:

src/app/pro/                      # B2B Tax Pro portal
src/app/marketplace/              # Marketplace (Phase 3, not MVP)
src/app/developers/               # Developer portal (Phase 4+)
src/app/blog/                     # Blog (marketing)
src/app/about/                    # About page (marketing)
src/app/status/                   # Status page (infra)

src/app/admin/professionals/      # Admin pro management
src/app/admin/users/              # Admin user management  
src/app/admin/audit/              # Admin audit log
src/app/admin/departments/        # Admin departments
src/app/admin/facilities/         # Admin facilities

src/app/dashboard/credit/         # Credit score detail page
src/app/dashboard/tax-filing/     # Tax filing wizard
src/app/dashboard/reports/        # Reports page
src/app/dashboard/keys/           # API keys page

# Individual files to delete:

src/app/pricing/page.tsx          # Will be rebuilt
src/app/page.tsx                  # Will be rebuilt
src/app/login/page.tsx            # Will be rebuilt
src/app/signup/page.tsx           # Will be rebuilt
src/app/dashboard/page.tsx        # Will be rebuilt
src/app/dashboard/chat/page.tsx   # Will be rebuilt
src/app/dashboard/settings/page.tsx  # Will be rebuilt
src/app/admin/page.tsx            # Will be rebuilt
src/app/admin/kb/page.tsx         # Will be rebuilt

# DO NOT DELETE:

superscale/                       # Reference assets (DO NOT DELETE)
src/core/                         # Config and utilities
src/ai/                           # LLM and RAG logic
src/db/                           # Database migrations
src/workers/                      # Background jobs
public/                           # Assets
research/                         # Planning documents
```

### Deletion Order

1. **First**: Delete entire directories (faster, fewer git issues)
2. **Second**: Delete individual page files
3. **Third**: Run `npm run build` to catch any broken imports
4. **Fourth**: Clean up any orphaned imports or components

---

## 12. Reference Assets

### Superscale Directory (DO NOT DELETE)

Location: `./superscale/`

Contains:
- `Creditax.ai — Complete Screen Architecture & Content Specification (All 57 Screens).md`
- `Creditax.ai Complete Technical Documentation Suite.md`
- `Creditax.ai Design Token System.md`
- `Creditax.ai Master Open Design Prompt & Handoff Document.md`
- `Brand-Guidelines.md`
- `brand-identity.md`
- `Frontend-Infrastructure.md`
- `creditax-ai-static-*.png` (screen mocks)
- `creditax-ai-static-*.jpeg`

Purpose: Visual reference for building pages, design token values, component specifications.

### How to Use Screen Mocks

1. Open `creditax-ai-static-*.png` files in image viewer
2. Reference for:
   - Layout structure
   - Component placement
   - Typography sizing
   - Color usage
   - Spacing decisions
3. Do NOT copy pixel-by-pixel — use as inspiration for implementing the same design with code

### Design Token Reference

See `superscale/Creditax.ai Design Token System.md` for:
- Exact color values (HEX, RGB, HSL)
- Typography scale
- Spacing values
- Border radius
- Shadow definitions
- Component states

---

## Appendix A: Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Kimchi.dev (LLM)
KIMCHI_API_KEY=
KIMCHI_BASE_URL=https://api.kimchi.ai/v1

# Vertex AI (Embeddings)
GOOGLE_APPLICATION_CREDENTIALS=
VERTEX_AI_PROJECT_ID=

# Mono (Credit API)
MONO_SECRET_KEY=
MONO_PUBLISHABLE_KEY=

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Trigger.dev
TRIGGER_API_KEY=
TRIGGER_PUBLIC_KEY=

# Backblaze B2
B2_APPLICATION_KEY=
B2_APPLICATION_KEY_ID=
B2_BUCKET_NAME=
```

---

## Appendix B: Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.2.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-dropzone": "^14.2.0",
    "react-markdown": "^9.0.0",
    "@codemirror/lang-markdown": "^6.2.0",
    "codemirror": "^6.0.0",
    "@uiw/react-codemirror": "^4.21.0",
    "mapbox-gl": "^3.0.0",
    "@mapbox/mapbox-gl-geocoder": "^5.0.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "date-fns": "^3.0.0",
    "zod": "^3.22.0",
    "@trigger.dev/sdk": "^2.3.0",
    "langchain": "^0.1.0"
  }
}
```

---

## Appendix C: Troubleshooting

### Build Fails After Deletion
1. Check for orphaned imports in deleted files
2. Run `git status` to see what changed
3. If import error, find and fix or delete the importing file
4. If component error, check if component is used elsewhere

### Auth Not Working
1. Verify Supabase URL and anon key are set
2. Check Supabase dashboard for auth logs
3. Verify middleware is checking auth correctly
4. Check that callback URL is whitelisted in Supabase

### RAG Chat Slow or Failing
1. Check Vertex AI credentials
2. Verify pgvector extension is enabled
3. Check if embeddings exist in `tax_document_chunks` table
4. Check Kimchi.dev API key and quota

### Stripe Webhook Not Working
1. Verify webhook endpoint is accessible
2. Check Stripe webhook signature
3. Verify webhook is registered in Stripe dashboard
4. Check Trigger.dev logs for webhook processing

---

*Document Version: 1.0*
*Last Updated: June 12, 2026*
*Branch: mvp-refactor*

---

## Changelog

### v1.0 (June 12, 2026)
- Initial comprehensive agent workflow document
- Full scope (not simplified) for engineering teams
- Complete page inventory, API endpoints, database schema
- Agent task definitions for 14 agents across 4 phases
- Safe deletion strategy preserving 57-screen reference
- Cross-loop workflow with blocking resolution
- Testing & verification checklists
- Environment variables, dependencies, troubleshooting