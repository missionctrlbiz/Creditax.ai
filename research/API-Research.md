# Creditax.ai — API Research & Architecture Document

**Version:** 1.4
**Date:** June 12, 2026
**Status:** Research — Work in Progress

---

## Changelog

### v1.4 (June 12, 2026)
- Added Section 2.4: Business Verification APIs (CAC Lookup)
  - No official CAC public API - hybrid approach using Mono Lookup + document upload
  - CAC certificate verification flow for marketplace
  - BVN/NIN verification via Mono Prove for individual tax pros
- Added Section 2.5: Geolocation & Address Services
  - Mapbox recommended (100k free requests/month)
  - PostGIS/Supabase geography for proximity search
  - Distance query examples
- Added Section 3.7: RAG for Marketplace
  - Dual-index architecture (tax docs + pro profiles)
  - TaxProfessionalDocument structure with location/contact
  - Hybrid search (semantic + geographic)
  - Conversational marketplace queries ("find tax pro near me")
  - Supabase tables for tax professionals + embeddings
  - Trigger.dev workflow for professional onboarding
- Added Phase 6 to Task List (Tax Professional Marketplace)
- Updated Infrastructure Requirements with Mapbox, Backblaze B2, Cloudinary
- Added Mapbox environment variables
- Updated Implementation Roadmap with marketplace features

### v1.3 (June 12, 2026)
- Marked Okra as DEFUNCT
- Updated Mono as primary credit API
- Updated LLM to Kimchi.dev (not OpenAI)
- Updated embeddings to Vertex AI primary + Hugging Face + OpenAI fallbacks
- Updated knowledge base approach to Markdown/GitBook style

### v1.2 (June 11, 2026)
- Added Super Admin interface for KB management
- Updated dependency alternatives (Drizzle ORM, Flutterwave payments, etc.)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Credit & Financial APIs](#2-credit--financial-apis)
3. [RAG Architecture](#3-rag-architecture)
4. [Knowledge Base Database](#4-knowledge-base-database)
5. [Background Jobs & Workflow Automation (Trigger.dev)](#5-background-jobs--workflow-automation-triggerdev)
6. [External Libraries & Dependencies](#6-external-libraries--dependencies)
7. [Complete Task List](#7-complete-task-list)
8. [Infrastructure Requirements](#8-infrastructure-requirements)
9. [Implementation Roadmap](#9-implementation-roadmap)

---

## 1. Executive Summary

This document provides a comprehensive analysis of:

1. **Ready-to-use APIs** for credit scoring, credit status, and financial data
2. **Detailed RAG (Retrieval-Augmented Generation) architecture** for tax law Q&A
3. **Knowledge base database** structure for Nigerian tax documents
4. **Background job infrastructure** using Trigger.dev
5. **External libraries** required for implementation

**Key Finding:** No public API exists for Nigerian tax calculations or FIRS integration. The credit ecosystem has APIs (Mono, Jumo) but none combine credit scoring with tax compliance data — our core differentiator.

> ⚠️ **Critical Update (June 2026):** Okra is DEFUNCT. Do not use Okra in any integration plans. Mono is the primary active provider.

**Strategic Approach:**

- Use third-party APIs for credit data (Mono primary, Jumo via partnership)
- Use Kimchi.dev for LLM (cost-effective open-source models)
- Use Google Vertex AI for embeddings with Hugging Face and OpenAI as fallbacks
- Build proprietary RAG pipeline for Nigerian tax law
- Use Trigger.dev for background job orchestration
- Store tax documents in Supabase with pgvector for RAG

---

## 2. Credit & Financial APIs

### 2.1 Nigerian API Providers

> **⚠️ Status Update (June 2026):** Okra is DEFUNCT — company has shut down. Do not use Okra in any integration plans.

#### Mono

**Overview:** Africa's foremost Open Banking API company (acquired by Flutterwave). Provides financial data, payments, and identity verification.

| Aspect | Details |
|--------|---------|
| **Website** | https://mono.co/ |
| **Status** | ✅ ACTIVE |
| **API Type** | Financial data, bank payments, identity |
| **Bank Coverage** | 100+ banks and fintechs across Nigeria, Ghana, South Africa |
| **Data Available** | Transactions, statements, balance, income analysis, creditworthiness |
| **KYC/ID** | BVN lookup, NIN verification via Mono Prove |
| **Pricing** | Free tier + usage-based |
| **API Format** | REST with webhooks |
| **Key Products** | Connect (financial data), Statement Pages, DirectPay, DirectDebit, Lookup, Prove |

**Endpoints:**

```
POST /api/v1/connect/initiate    → Start bank auth flow
GET  /api/v1/accounts/:id        → Account details
GET  /api/v1/accounts/:id/ledger → Transaction ledger
GET  /api/v1/income              → Income analysis
POST /api/v1/identity/lookup     → BVN/NIN verification
POST /api/v1/prove               → Identity verification
```

**Why Mono:**

- Now part of Flutterwave ecosystem (stronger stability)
- 5M+ accounts linked, 10B+ financial data processed
- Credit Risk Assessment product built-in
- Statement Pages for no-code bank statements
- ISO 27001 certified
- Works with Renmoney, Fairmoney, PalmPay, Piggyvest

**Overview:** Bank account and financial data API for Africa.

| Aspect | Details |
|--------|---------|
| **Website** | https://mono.co/ |
| **API Type** | Financial data, identity |
| **Bank Coverage** | Major Nigerian banks |
| **Data Available** | Transactions, statements, balance, income |
| **KYC/ID** | BVN lookup |
| **Pricing** | Free tier + usage-based |
| **API Format** | REST |

**Endpoints:**

```
POST /api/v1/virtual-accounts      → Create virtual account
GET  /api/v1/accounts/:id          → Account details
GET  /api/v1/accounts/:id/ledger   → Transaction ledger
GET  /api/v1/income                → Income analysis
POST /api/v1/identity/bvn          → BVN verification
```

**Why Mono:**

- Virtual accounts for payment collection
- Income analysis and categorization
- Clean API design
- Good free tier for development

---

#### Jumo

**Overview:** B2B financial infrastructure platform powering banks and fintechs across Africa. Not a direct API consumer product — operates as white-label infrastructure.

| Aspect | Details |
|--------|---------|
| **Website** | https://www.jumo.world/ |
| **Status** | ✅ ACTIVE |
| **API Type** | B2B infrastructure, AI scoring, embedded finance |
| **Coverage** | Ghana, Kenya, Nigeria, South Africa, Tanzania, Uganda + more |
| **Data Sources** | Bank transactions, mobile money, alternative data |
| **Partners** | Airtel, MTN, Orange Money, Absa, Ecobank, Standard Bank, Fidelity |
| **Focus** | SME banking, mass-market credit, embedded finance |
| **Pricing** | B2B subscription (not public pricing) |
| **Key Stats** | 10% of Africa's top banks work with Jumo, 250M+ loans disbursed |

**Why Jumo (for Creditax):**

- Infrastructure behind market leaders — proven at scale
- AI prediction capabilities for credit scoring
- Configurable, not a one-size-fits-all API
- Works with partners rather than direct consumers

> **Note:** Jumo is B2B infrastructure, not a developer-friendly API you can sign up for directly. Integration would require a partnership discussion. Consider as a potential future credit scoring provider, not an initial MVP choice.

#### Other Active Nigerian Fintech Providers

| Provider | Status | Type | Best For |
|----------|--------|------|----------|
| **Paystack** (Stripe) | ✅ Active | Payments, identity | Payments, not credit |
| **Flutterwave** | ✅ Active | Payments, identity | Pan-African payments |
| **Kuda** | ✅ Active | Digital bank | Bank account data (if you have partnership) |
| **Carbon** | ✅ Active | Credit/lending | Internal credit scoring only |
| **FairMoney** | ✅ Active | Credit/lending | Internal credit scoring only |
| **Paga** | ✅ Active | Payments | No open banking API |

---

### 2.2 Credit Scoring Comparison

| Provider | Credit Score | Bank Data | KYC | Alternative Data | Nigeria | API-First | Status |
|----------|--------------|-----------|-----|------------------|---------|-----------|--------|
| Mono | Partial | Yes | Yes | No | Yes | Yes | ✅ Active |
| Jumo | Yes (B2B) | Yes | Partial | Yes | Yes | Via partnership | ✅ Active |
| Paystack/Stripe | No | No | Yes | No | Yes | Yes | ✅ Active |
| Flutterwave | No | No | Yes | No | Yes | Yes | ✅ Active |
| Carbon | Internal | Yes | Yes | Yes | Yes | No | ✅ Active |
| FairMoney | Internal | Yes | Yes | Yes | Yes | No | ✅ Active |
| Okra | No | Yes | Yes | Partial | Yes | Yes | ❌ DEFUNCT |

**Gap Identified:** No provider offers a public credit scoring API with tax compliance integration. This is our opportunity.

---

### 2.3 Proposed Credit Integration Strategy

#### Phase 1: Basic Integration (Mono)

> **Note:** Okra is defunct. Use Mono as primary financial data provider.

```typescript
// Credit Score Algorithm (Phase 1)
interface CreditFactors {
  monthlyIncome: number;           // From Mono connect
  incomeStability: number;         // Months of consistent income
  transactionVelocity: number;     // Spending patterns
  savingsRate: number;             // Income vs spending ratio
  debtBurden: number;              // Existing debt payments
  taxComplianceScore?: number;     // NEW: Tax filing history (future)
}

// Score calculation (simplified rule-based)
function calculateCreditScore(factors: CreditFactors): number {
  let score = 300; // Base score

  // Income factor (up to +200)
  score += Math.min(factors.monthlyIncome / 50000, 200);

  // Stability factor (up to +150)
  score += factors.incomeStability * 15;

  // Savings rate (up to +150)
  score += factors.savingsRate * 3;

  // Cap at 900 (Nigerian credit max)
  return Math.min(score, 900);
}
```

#### Phase 2: Advanced (Jumo Partnership or Mono Creditworthiness)

```typescript
// Option A: Mono Creditworthiness product
async function getMonoCreditworthiness(customerId: string): Promise<CreditAssessment> {
  const response = await fetch('https://api.mono.co/v1/creditworthiness', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MONO_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customer_id: customerId,
      country: 'ng'
    })
  });

  const data = await response.json();
  return data;
}

// Option B: Jumo (requires partnership, not direct API access)
// Contact Jumo for B2B partnership: https://jumo.world/contact/
```

---

### 2.4 Business Verification APIs (CAC Lookup)

For the Tax Professional Marketplace, we need to verify that businesses are legitimately registered with Nigeria's CAC (Corporate Affairs Commission).

> ⚠️ **Important:** There is **NO official public CAC API**. CAC does not offer a direct API for business name/company verification. We must use alternative approaches.

#### Verification Approaches

| Approach | Method | Reliability | Cost |
|----------|--------|-------------|------|
| **Manual CAC Search** | Search cac.gov.ng manually | High | Free but time-consuming |
| **CAC Certificate Upload + Admin Review** | Pro uploads certificate, admin verifies | Medium | Staff time |
| **Third-party Verification Service** | Use a service like Mono's business verification | High | Usage-based |
| **CAC Scraper (NOT RECOMMENDED)** | Scrape CAC website | Medium | Risk of IP blocking |

#### Recommended: Hybrid Verification Flow

```
1. Tax Pro signs up and enters CAC registration number
2. We call Mono's Lookup API to get basic business info (if available)
3. Pro uploads CAC Certificate (PDF) as proof
4. Admin reviews and approves/rejects
5. Once approved, Pro appears in marketplace
```

#### Mono Lookup API (Business Verification)

Mono offers a Lookup product that can retrieve business information:

```typescript
// Mono Business Lookup
POST /api/v1/lookup/business
Headers: Authorization: Bearer {MONO_API_KEY}
Body: {
  "registration_number": "BN-123456"
}

Response: {
  "name": "GreenLeaf Consulting Ltd",
  "registration_number": "BN-123456",
  "status": "active",
  "registration_date": "2020-03-15",
  "address": "15 Admiralty Way, Lekki Phase 1, Lagos",
  // May include email, phone if available
}
```

> **Note:** Mono's business lookup coverage may be limited. Verify current capabilities at https://mono.co/lookup

#### CAC Certificate Verification Flow

For comprehensive verification, require document upload:

```
Required Documents for Marketplace Application:
1. CAC Certificate (Form CAC 1.1 or CAC 2 for business names)
2. FIRS TIN Certificate
3. Valid ID (Passport, NIN, Driver's License)
4. Professional body membership (optional but increases trust)
```

#### Alternative: BVN/NIN for Individual Tax Professionals

For individual tax consultants (not companies), verify via BVN/NIN:

```typescript
// Mono Prove (NIN-based identity)
POST /api/v1/prove
Headers: Authorization: Bearer {MONO_API_KEY}
Body: {
  "nin": "12345678901",
  "phone": "+2348012345678"
}

// Response includes basic identity info
```

---

### 2.5 Geolocation & Address Services

For proximity-based marketplace search (find tax pros near me), we need geocoding.

#### Geocoding Providers

| Provider | Free Tier | Accuracy | Notes |
|----------|-----------|----------|-------|
| **Google Maps Geocoding API** | $200/month free | Excellent | Requires credit card |
| **Mapbox Geocoding API** | 100k/month free | Excellent | Good for low volume |
| **Nominatim (OpenStreetMap)** | Rate limited | Good | Free but rate limited |
| **LocationIQ** | 10k/month free | Good | Free tier available |

#### Recommended: Mapbox

```
Why Mapbox:
- Generous free tier (100k requests/month)
- Excellent African coverage (Google is better but costs more)
- Powers Uber, Snapchat, Samsung
- Good API SDKs
```

```typescript
// Mapbox Geocoding
GET https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json
  ?access_token={MAPBOX_ACCESS_TOKEN}
  &country=ng
  &proximity=3.3792,6.5244  // Bias toward Nigeria
  &limit=1

Response: {
  "features": [{
    "center": [3.3792, 6.5244],  // [lng, lat]
    "place_name": "Lagos, Nigeria",
    "context": [{
      "id": "place.123",
      "text": "Lagos"
    }]
  }]
}
```

#### Storing Location Data

Add to `tax_professionals` table:

```sql
ALTER TABLE tax_professionals ADD COLUMN location GEOGRAPHY(POINT, 4326);
ALTER TABLE tax_professionals ADD COLUMN address_text VARCHAR(500);
ALTER TABLE tax_professionals ADD COLUMN city VARCHAR(100);
ALTER TABLE tax_professionals ADD COLUMN state VARCHAR(100);
ALTER TABLE tax_professionals ADD COLUMN country VARCHAR(100) DEFAULT 'Nigeria';
```

#### Proximity Search Query (PostgreSQL)

```sql
-- Find tax pros within 50km of user's location
SELECT
  id,
  business_name,
  city,
  -- Calculate distance in km
  ST_Distance(
    location::geography,
    ST_SetSRID(ST_MakePoint(3.3792, 6.5244), 4326)::geography
  ) / 1000 as distance_km
FROM tax_professionals
WHERE
  status = 'verified'
  AND ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint(3.3792, 6.5244), 4326)::geography,
    50000  -- 50km radius
  )
ORDER BY distance_km ASC;
```

---

## 3. RAG Architecture

### 3.1 Overview

**RAG (Retrieval-Augmented Generation)** will power our tax law Q&A system. Instead of relying solely on LLM knowledge (which may be outdated or inaccurate for Nigerian tax), we retrieve relevant tax documents and use them as context.

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER QUERY                                       │
│                   "How do I calculate VAT?"                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     EMBEDDING API (with fallbacks)                      │
│                                                                      │
│   Primary:   Google Vertex AI (text-embedding-005, 768 dim)          │
│   Fallback:  Hugging Face (all-MiniLM-L6-v2, 384 dim)                │
│   Final:     OpenAI (text-embedding-3-small, 1536 dim)               │
│                                                                      │
│         query_embedding = embed("How do I calculate VAT?")            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     VECTOR SEARCH                                       │
│              Supabase pgvector (cosine similarity)                    │
│                                                                      │
│   SELECT content FROM tax_documents                                    │
│   WHERE embedding <-> query_embedding < 0.3                           │
│   ORDER BY embedding <-> query_embedding                              │
│   LIMIT 4;                                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT ASSEMBLY                                     │
│                                                                      │
│   retrieved_chunks = [                                                 │
│     "Section 15 of NTA 2023: VAT is charged at 7.5%...",             │
│     "FIRS VAT guide: Input and output VAT calculation...",           │
│     "VAT exemption list under Schedule 2..."                         │
│   ]                                                                   │
│                                                                      │
│   prompt = f"""                                                         │
│   You are a Nigerian tax expert. Answer based ONLY on:               │
│   {retrieved_chunks}                                                  │
│   Question: {user_query}                                              │
│   """                                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     LLM GENERATION                                      │
│              Kimchi.dev (OpenAI-compatible endpoint)                   │
│                                                                      │
│   Model: minimax-m2.7 (fast) or kimi-k2.6 (reasoning)                │
│   Endpoint: https://llm.kimchi.dev/openai/v1                          │
│                                                                      │
│   response = llm.generate(prompt)                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER RESPONSE                                   │
│     "VAT in Nigeria is charged at 7.5% standard rate.                │
│      To calculate: Add 7.5% to your net invoice amount..."           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 RAG Pipeline Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Embeddings** | Google Vertex AI (primary), Hugging Face (fallback), OpenAI (final fallback) | Convert text to vectors |
| **Vector Database** | Supabase pgvector | Store and search document embeddings |
| **LLM** | Kimchi.dev (minimax-m2.7, kimi-k2.6) | Generate responses |
| **Chunking** | Custom tokenizer | Split documents into searchable units |
| **Metadata** | PostgreSQL | Store document source, date, category |

**Embedding Provider Priority:**

1. **Google Vertex AI** — `$300 free credit`, `text-embedding-005`, 768 dimensions
2. **Hugging Face Inference API** — Free tier, `all-MiniLM-L6-v2`, 384 dimensions
3. **OpenAI** — `$5 free credit`, `text-embedding-3-small`, 1536 dimensions (final fallback)

### 3.4 Document Chunking Strategy

```typescript
interface ChunkConfig {
  chunkSize: number;        // Target tokens per chunk (500-800)
  overlap: number;          // Overlap between chunks (50-100 tokens)
  minChunkLength: number;   // Minimum characters per chunk (100)
  maxChunkLength: number;   // Maximum characters per chunk (2000)
}

const DEFAULT_CHUNK_CONFIG: ChunkConfig = {
  chunkSize: 600,           // ~2400 characters
  overlap: 100,             // ~400 characters overlap
  minChunkLength: 200,
  maxChunkLength: 3000
};

function chunkDocument(text: string, config = DEFAULT_CHUNK_CONFIG): Chunk[] {
  const chunks: Chunk[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  let currentChunk = '';
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);

    if (currentTokens + sentenceTokens > config.chunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        tokenCount: currentTokens,
        startChar: chunks.reduce((sum, c) => sum + c.content.length, 0),
        endChar: chunks.reduce((sum, c) => sum + c.content.length, 0) + currentChunk.length
      });

      // Start new chunk with overlap
      currentChunk = sentence;
      currentTokens = sentenceTokens;
    } else {
      currentChunk += ' ' + sentence;
      currentTokens += sentenceTokens;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      tokenCount: currentTokens,
      startChar: 0,
      endChar: 0 // Will be calculated
    });
  }

  return chunks;
}
```

### 3.5 RAG Query Flow

```typescript
// Embedding generation with fallbacks
async function generateEmbedding(text: string): Promise<number[]> {
  // Primary: Google Vertex AI
  try {
    const { VertexAI } = await import('@google-cloud/aiplatform');
    const predictor = new VertexAI.PredictionService(...);
    const response = await predictor.predict({
      endpoint: 'text-embedding-005',
      input: text
    });
    return response.predictions[0].embeddings.values;
  } catch (e) { /* fall through */ }

  // Fallback 1: Hugging Face
  try {
    const response = await fetch('https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HF_API_KEY}` },
      body: JSON.stringify({ inputs: text })
    });
    return await response.json();
  } catch (e) { /* fall through */ }

  // Fallback 2: OpenAI
  const { OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const embed = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return embed.data[0].embedding;
}

// LLM via Kimchi.dev (OpenAI-compatible)
async function queryKimchi(prompt: string): Promise<string> {
  const response = await fetch('https://llm.kimchi.dev/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KIMCHI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'minimax-m2.7',  // or 'kimi-k2.6' for reasoning tasks
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

async function ragQuery(userQuery: string, filters?: QueryFilters): Promise<RAGResponse> {
  // 1. Generate embedding for user query
  const queryEmbedding = await generateEmbedding(userQuery);

  // 2. Vector similarity search
  const retrievedChunks = await supabase
    .from('tax_document_chunks')
    .select('content, metadata, source_url, chunk_index')
    .rpc('match_tax_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.3,
      match_count: 4,
      filter_category: filters?.category
    });

  // 3. Assemble context
  const context = retrievedChunks
    .map(chunk => `[Source ${chunk.metadata.source}]: ${chunk.content}`)
    .join('\n\n');

  // 4. Generate response with citations via Kimchi.dev
  const response = await queryKimchi(`You are a Nigerian tax expert. Answer based ONLY on the provided context.
If the context doesn't contain the answer, say "Based on my knowledge..." and provide a general answer.
Always cite your sources using [Source X] notation.

Context:
${context}

Question: ${userQuery}`);

  return {
    answer: response,
    citations: extractCitations(response),
    chunks: retrievedChunks,
    model: 'minimax-m2.7',
    tokensUsed: estimateTokens(response)
  };
}
```

### 3.6 RAG Database Schema

> **Note:** Embedding dimension varies by provider (768 for Google Vertex, 384 for Hugging Face, 1536 for OpenAI). Default to 1536 (max) or use provider-specific tables.

```sql
-- Tax documents (source files)
CREATE TABLE tax_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT NOT NULL, -- 'nta', 'ntaa', 'firs_guide', 'court_case'
  category TEXT NOT NULL,    -- 'income_tax', 'vat', 'withholding', 'capital_gains'
  jurisdiction TEXT DEFAULT 'federal', -- 'federal', 'lagos', 'kano', etc.
  effective_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- Additional metadata
);

-- Document chunks (embeddings)
-- Note: Using 1536 (OpenAI max) to accommodate all providers
-- Consider separate tables per provider if storage is concern
CREATE TABLE tax_document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES tax_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  token_count INTEGER,
  embedding vector(1536), -- Supports all providers (768/384/1536)
  embedding_provider TEXT DEFAULT 'google_vertex', -- 'google_vertex', 'hugging_face', 'openai'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX idx_tax_chunks_embedding ON tax_document_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Full-text search index
CREATE INDEX idx_tax_chunks_fts ON tax_document_chunks
  USING gin(to_tsvector('english', content));

-- Queries table for analytics
CREATE TABLE rag_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  response_text TEXT,
  llm_model TEXT DEFAULT 'minimax-m2.7', -- Kimchi model used
  embedding_provider TEXT,
  tokens_used INTEGER,
  latency_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.7 RAG for Marketplace: Tax Professional Search

**Vision:** When a user asks "I need a tax consultant near Lagos Island" or "Who can help me with VAT filing in Abuja?", the RAG system retrieves relevant tax professionals from our marketplace.

#### Dual-Index Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TWO VECTOR INDICES                           │
│                                                                  │
│  ┌─────────────────────────┐   ┌─────────────────────────────┐ │
│  │  TAX DOCUMENTS INDEX    │   │  TAX PROFESSIONALS INDEX    │ │
│  │  (Existing RAG)         │   │  (New - Marketplace)        │ │
│  │                         │   │                             │ │
│  │  - NTA 2023 chunks      │   │  - Business descriptions    │ │
│  │  - FIRS guidelines      │   │  - Services offered         │ │
│  │  - VAT circulars        │   │  - Location (embedded)      │ │
│  │  - Tax case law         │   │  - Specializations          │ │
│  └─────────────────────────┘   └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Tax Professional Document Structure

Each verified tax professional becomes a searchable "document" in the vector store:

```typescript
interface TaxProfessionalDocument {
  id: string;
  businessName: string;
  ownerName: string;
  cacNumber: string;
  firsTin: string;
  services: string[];           // ["Personal Income Tax", "VAT Filing", "Audit Support"]
  description: string;          // "Expert tax consultant with 10+ years experience..."
  location: {
    address: string;
    city: string;               // "Lagos"
    state: string;              // "Lagos State"
    coordinates: [number, number]; // [longitude, latitude]
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    whatsapp?: string;
  };
  verification: {
    cacVerified: boolean;
    firsVerified: boolean;
    adminApproved: boolean;
    verifiedAt: Date;
  };
  metadata: {
    rating: number;             // 4.8
    reviewCount: number;        // 127
    joinedAt: Date;
    priceRange: string;         // "₦50,000 - ₦500,000"
  };
}
```

#### Embedding Tax Professionals

```typescript
// Create searchable text from professional data
function createProfessionalEmbedding(doc: TaxProfessionalDocument): string {
  return `
    Business Name: ${doc.businessName}
    Owner: ${doc.ownerName}
    Services: ${doc.services.join(', ')}
    Location: ${doc.location.city}, ${doc.location.state}
    Description: ${doc.description}
    Specializations: ${doc.services.join(', ')}
    Price Range: ${doc.priceRange}
    Contact: ${doc.contact.phone}, ${doc.contact.email}
  `.trim();
}

// When a new professional is verified, embed and store
await embedAndStoreProfessional(taxPro);
```

#### Hybrid Search Query

For marketplace queries, combine vector similarity with geographic filtering:

```typescript
async function searchTaxProfessionals(query: string, userLocation?: {lat: number, lng: number}) {
  // 1. Generate embedding for query
  const queryEmbedding = await embed(query);

  // 2. Vector search (semantic match on services, description)
  const semanticMatches = await supabase
    .from('tax_professionals_embeddings')
    .select('*')
    .rpc('match_tax_professionals', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 10
    });

  // 3. If user provided location, filter by distance
  let results = semanticMatches.data;
  if (userLocation) {
    results = results
      .map(pro => ({
        ...pro,
        distance: calculateDistance(
          userLocation.lat, userLocation.lng,
          pro.location.coordinates[1], pro.location.coordinates[0]
        )
      }))
      .filter(pro => pro.distance <= pro.maxSearchRadius || !pro.maxSearchRadius)
      .sort((a, b) => a.distance - b.distance);
  }

  return results;
}
```

#### Conversational Marketplace Queries

The RAG system can handle natural language queries about professionals:

```
User: "I need help filing my business VAT returns. I'm in Lagos."

RAG Pipeline:
1. Detect intent: marketplace_search
2. Extract entities: location=Lagos, service=VAT filing
3. Search index for VAT experts in Lagos
4. Format response with top 3 matches + contact CTA

Response:
"For VAT filing help in Lagos, I found these verified tax professionals:

1. 🏢 Akinwale & Associates
   📍 Lagos Island | ⭐ 4.8 (127 reviews)
   💰 Starting from ₦75,000
   📞 08012345678 | 📧 akin@taxpro.com

2. 🏢 GreenLeaf Tax Services
   📍 Victoria Island | ⭐ 4.6 (89 reviews)
   💰 Starting from ₦60,000
   📞 08098765432

3. 🏢 TaxHub Professionals
   📍 Ikeja | ⭐ 4.9 (203 reviews)
   💰 Starting from ₦50,000
   📞 08055555555

Would you like me to connect you with any of these professionals?"
```

#### Supabase Table for Tax Professionals

```sql
-- Tax professionals table
CREATE TABLE tax_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  business_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255),
  cac_number VARCHAR(50),
  firs_tin VARCHAR(50),
  services TEXT[] DEFAULT '{}',
  description TEXT,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  location GEOGRAPHY(POINT, 4326),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  whatsapp VARCHAR(50),
  cac_verified BOOLEAN DEFAULT false,
  firs_verified BOOLEAN DEFAULT false,
  admin_approved BOOLEAN DEFAULT false,
  verification_documents JSONB DEFAULT '[]',
  max_search_radius_km INTEGER DEFAULT 100,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_min INTEGER,
  price_max INTEGER,
  slug VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected, suspended
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create GIN index for services array
CREATE INDEX idx_tax_pros_services ON tax_professionals USING GIN(services);

-- Create spatial index for location
CREATE INDEX idx_tax_pros_location ON tax_professionals USING GIST(location);

-- Embeddings table for vector search
CREATE TABLE tax_professionals_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_professional_id UUID REFERENCES tax_professionals(id) ON DELETE CASCADE,
  embedding VECTOR(768), -- Match embedding dimension
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pro_embeddings ON tax_professionals_embeddings USING HNSW(embedding);
```

#### Trigger.dev Workflow: Onboarding New Professional

```typescript
export const onboardTaxProfessional = workflow(
  'onboard-tax-professional',
  async (payload: { userId: string; businessData: TaxProfessionalDocument }) => {
    // 1. Create database record
    const taxPro = await steps.createTaxProfessionalRecord({ businessData });

    // 2. Verify CAC number (via Mono Lookup or manual)
    const cacStatus = await steps.verifyCAC(taxPro.cacNumber);

    // 3. Geocode address
    const coordinates = await steps.geocodeAddress(taxPro.address);

    // 4. Update record with coordinates
    await steps.updateCoordinates({ taxProId: taxPro.id, coordinates });

    // 5. Create embedding
    const embedding = await steps.createProfessionalEmbedding({ taxPro });

    // 6. If all verified, set admin_approved = true and notify user
    if (cacStatus.valid && taxPro.firsVerified) {
      await steps.setVerifiedStatus({ taxProId: taxPro.id });
      await steps.sendWelcomeEmail({ taxPro });
    } else {
      await steps.notifyAdminReview({ taxProId: taxPro.id });
    }
  }
);
```

---

### 3.8 Multimodal RAG (Phase 4+ Enhancement)

> **Vision:** Upgrade the RAG pipeline to handle multiple content types beyond Markdown.

**Current State (MVP):** Markdown-only knowledge base with text embeddings.

**Planned Enhancement:**

| Format | Processing | Embedding |
|--------|------------|-----------|
| **Markdown** (current) | Parse text | Standard text embedding |
| **PDF** (future) | Extract text via pdf-parse | Standard text embedding |
| **Images** (future) | OCR via Tesseract + GPT-4o vision | Vision embeddings |
| **Video** (future) | Transcribe via Whisper API | Standard text embedding |

**Architecture for Multimodal RAG:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     INPUT PROCESSING                            │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Markdown │  │   PDF    │  │  Image   │  │  Video   │        │
│  │  (text)  │  │ (text)   │  │ (OCR)    │  │ (audio)  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   Content Extraction   │                         │
│              │   + Metadata Parsing   │                         │
│              └────────────────────────┘                         │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │  Chunking Strategy     │                         │
│              │  (by content type)     │                         │
│              └────────────────────────┘                         │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   Embedding Model      │                         │
│              │  Vertex AI / OpenAI    │                         │
│              └────────────────────────┘                         │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   Vector Storage       │                         │
│              │   (Supabase pgvector)  │                         │
│              └────────────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation Priority:**

| Phase | Format | Priority | Notes |
|-------|--------|----------|-------|
| MVP | Markdown | P0 | Current state |
| Phase 4+ | PDF | P1 | Legal documents, FIRS publications |
| Phase 4+ | Images | P2 | Receipts, invoices with visual data |
| Phase 4+ | Video | P3 | Tax tutorials, FIRS webinars |

**Libraries for Multimodal:**

```typescript
// PDF parsing
import pdfParse from 'pdf-parse';

// Image OCR
import Tesseract from 'tesseract.js';

// Video transcription
import OpenAI from 'openai';
const whisper = new OpenAI.Audio({ apiKey: process.env.OPENAI_API_KEY });

// For now, use Kimchi.dev with vision capability (when available)
```

---

## 4. Knowledge Base Database

### 4.1 Document Categories

| Category | Sources | Priority |
|----------|---------|----------|
| **Nigeria Tax Act (NTA)** | Official FIRS publication | P0 |
| **Tax Administration Act (NTAA)** | Official FIRS publication | P0 |
| **FIRS Public Rulings** | firs.gov.ng | P0 |
| **VAT Guidelines** | FIRS VAT Guide 2024 | P0 |
| **Withholding Tax Guidelines** | FIRS circulars | P1 |
| **Capital Gains Tax** | Legal texts | P1 |
| **State Taxes** | LIRS, KIRS, OYIRS | P2 |
| **Court Cases** | Tax appeal tribunal decisions | P2 |
| **Industry Guides** | FIRS industry-specific guides | P2 |

### 4.2 Knowledge Base Strategy: Markdown/GitBook-Style

> **⚠️ Architectural Decision (June 12, 2026):** For MVP, we use a GitBook-style markdown knowledge base instead of PDF parsing. This simplifies the RAG pipeline, reduces storage costs, and enables non-technical updates via an admin interface.

**Why Markdown over PDFs:**

| Aspect | PDF Parsing | Markdown Docs |
|--------|-------------|---------------|
| Setup complexity | High (Document AI, pdf-parse) | Low |
| Storage | Large (binary files) | Small (text only) |
| Update process | Re-parse + re-embed | Edit + re-embed |
| OCR errors | Possible | None |
| Google Doc AI cost | Uses $300 free credit | Not needed |
| Version control | Harder | Easy (git) |
| Admin interface | Complex | Simpler |

**Knowledge Base Structure (GitBook-style):**

```
/knowledge-base
  /tax-types
    /income-tax
      index.md              → Overview
      brackets.md           → Tax brackets table
      exemptions.md         → Exemptions
      filing.md             → Filing procedures
    /vat
      index.md
      rates.md              → 7.5% standard rate
      exemptions.md
      input-output.md       → Input/output VAT
    /withholding-tax
      index.md
      rates.md              → WHT rates by type
    /capital-gains
      index.md
      rates.md
  /procedures
    tax-filing.md
    objections-appeals.md
    penalties.md
  /jurisdiction
    federal.md
    lagos.md
```

**Admin Interface (Super Admin Required):**

```
Super Admin Features:
├── Markdown Editor (rich text → markdown)
├── Document Tree Navigator
├── Version History (who changed what, when)
├── Publish/Unpublish toggle
├── Re-embed individual docs (after edit)
├── Preview rendered document
├── Bulk re-embed all documents
└── Audit log (all changes)
```

> **Note:** Phase 0 MVP can start with direct markdown file edits (git-based). Super Admin interface is Phase 1 when content updates need non-developer access.

### 4.3 Document Ingestion Pipeline (Markdown)

```
┌──────────────────────────────────────────────────────────────────────┐
│                    MARKDOWN SOURCES                                   │
│   /knowledge-base/*.md (GitBook-style structure)                     │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    PARSING LAYER (simplified)                         │
│                                                                      │
│   • Parse frontmatter (title, category, jurisdiction, effective_date)│
│   • Split by # Heading (each H1/H2 = potential chunk)                │
│   • Preserve code blocks, tables, lists                               │
│   • Extract metadata from YAML frontmatter                           │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    EMBEDDING LAYER (with fallbacks)                   │
│                                                                      │
│   1. Google Vertex AI (text-embedding-005) — primary                 │
│      If fails →                                                       │
│   2. Hugging Face Inference API (all-MiniLM-L6-v2)                   │
│      If fails →                                                       │
│   3. OpenAI (text-embedding-3-small) — final fallback                │
│                                                                      │
│   • Chunk = each H2 section (~200-800 tokens)                        │
│   • Track source file + section path for citations                    │
│   • Re-embed only changed sections on update                         │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                                      │
│                                                                      │
│   • Supabase PostgreSQL (markdown content + metadata)                │
│   • pgvector (embeddings)                                            │
│   • No PDF storage needed                                            │
│   • Version tracking via 'updated_at' + audit log                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Frontmatter Example:**

```yaml
---
title: VAT Rates in Nigeria
category: vat
jurisdiction: federal
effective_date: 2024-01-01
last_reviewed: 2026-06-12
author: admin
status: published
---
```

### 4.3 Initial Knowledge Base Content

#### P0 Documents (Must Have)

1. **Nigeria Tax Act 2023**
   - Full text of NTA as amended
   - Source: FIRS official publication
   - Pages: ~300

2. **Nigeria Tax Administration Act (NTAA) 2023**
   - Tax procedures, filing, penalties
   - Source: FIRS official publication
   - Pages: ~150

3. **FIRS VAT Guide**
   - VAT rates, exemptions, filing
   - Source: FIRS public guidance
   - Pages: ~100

4. **Personal Income Tax Rates**
   - Current tax brackets
   - Source: NTA Schedule
   - Pages: ~20

#### P1 Documents (Should Have)

5. **Withholding Tax Circulars**
   - WHT rates for various payments
   - Source: FIRS circulars
   - Pages: ~50

6. **Capital Gains Tax Act**
   - CGT rates and computation
   - Source: Legal text
   - Pages: ~30

7. **FIRS Public Rulings (Latest)**
   - Specific interpretations
   - Source: firs.gov.ng
   - Pages: ~100

#### P2 Documents (Nice to Have)

8. **Lagos State Internal Revenue Service (LIRS) Guides**
9. **Court Cases from Tax Appeal Tribunal**
10. **Industry-specific FIRS guidelines**

### 4.4 Knowledge Base Maintenance

```typescript
interface KnowledgeBaseConfig {
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'on-demand';
  versionTracking: boolean;
  staleThresholdDays: number;  // Days before doc is flagged as outdated
  reindexTrigger: 'schedule' | 'manual' | 'webhook';
}

const DEFAULT_CONFIG: KnowledgeBaseConfig = {
  updateFrequency: 'monthly',
  versionTracking: true,
  staleThresholdDays: 90,
  reindexTrigger: 'manual'
};

// Scheduled re-indexing job
async function updateKnowledgeBase(): Promise<UpdateResult> {
  const updatedDocs: DocumentUpdate[] = [];
  const errors: Error[] = [];

  // Check FIRS website for document updates
  const latestVersions = await checkFIRSDocuments();

  for (const doc of latestVersions) {
    try {
      const currentVersion = await getCurrentVersion(doc.id);

      if (currentVersion.version !== doc.version) {
        // Document has been updated
        await processNewVersion(doc);
        updatedDocs.push({
          id: doc.id,
          title: doc.title,
          oldVersion: currentVersion.version,
          newVersion: doc.version,
          chunksUpdated: doc.chunkCount
        });
      }
    } catch (error) {
      errors.push(error as Error);
    }
  }

  return {
    updatedDocuments: updatedDocs,
    errors,
    timestamp: new Date()
  };
}
```

---

## 5. Background Jobs & Workflow Automation (Trigger.dev)

### 5.1 Why Trigger.dev?

**Trigger.dev** is an open-source workflow automation platform that runs in the background. It replaces traditional cron jobs and message queues with durable, observable workflows.

#### Comparison with Alternatives

| Feature | Trigger.dev | AWS Lambda + SQS | GCP Cloud Functions | Temporal |
|---------|-------------|------------------|---------------------| ----------|
| **Open Source** | Yes | No | No | Yes |
| **Free Tier** | Generous | Limited | Limited | Limited |
| **Durability** | Built-in | Manual setup | Manual setup | Built-in |
| **Observable** | Built-in dashboards | CloudWatch | Cloud Monitoring | Manual |
| **TypeScript Native** | Yes | No | No | Yes |
| **Vercel Integration** | Native | Requires setup | Requires setup | No |
| **Idempotency** | Automatic | Manual | Manual | Built-in |
| **Retries** | Built-in | Manual | Manual | Built-in |

#### Key Benefits for Creditax

1. **No infrastructure to manage** — We focus on code, not servers
2. **Durable execution** — Jobs survive server restarts
3. **Built-in retries** — Failed jobs automatically retry with backoff
4. **Observable** — See job status, duration, failures in dashboard
5. **Vercel integration** — Native deployment to Vercel
6. **Free tier** — Sufficient for MVP and early growth

### 5.2 Trigger.dev Use Cases in Creditax

| Use Case | Trigger | Action |
|----------|---------|--------|
| **Document Processing** | Webhook or API call | Process uploaded receipt/invoice |
| **Credit Score Refresh** | Daily schedule | Update credit scores for active users |
| **Report Generation** | API call | Generate PDF reports async |
| **Webhook Delivery** | Event trigger | Deliver webhook events to clients |
| **RAG Re-indexing** | Weekly schedule | Update knowledge base |
| **Usage Cleanup** | Monthly schedule | Archive old usage logs |
| **Notification Sending** | API call | Send email/SMS notifications |
| **Document OCR** | Queue trigger | Process document with Google DocAI |

### 5.3 Workflow Examples

#### Example 1: Document Processing Pipeline

```typescript
import { job, step, trigger } from '@trigger.dev/sdk';

export const processDocumentJob = job({
  id: 'process-document',
  trigger: trigger_webhook({
    name: 'document.uploaded'
  }),

  run: async (payload) => {
    const { documentId, fileUrl, userId } = payload;

    // Step 1: Download and validate file
    const file = await step('download-file', async () => {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to download file');
      return response.arrayBuffer();
    });

    // Step 2: Send to Google Document AI
    const extraction = await step('extract-document', async () => {
      return await googleDocumentAI.process({
        file: file,
        mimeType: 'application/pdf',
        processorType: 'receipt' // or 'invoice'
      });
    });

    // Step 3: Calculate totals
    const calculation = await step('calculate', async () => {
      return {
        subtotal: extraction.amount,
        vat: extraction.amount * 0.075,
        total: extraction.amount * 1.075,
        date: extraction.date,
        vendor: extraction.vendor
      };
    });

    // Step 4: Store results
    const saved = await step('save-results', async () => {
      return await supabase.from('processed_documents').insert({
        document_id: documentId,
        user_id: userId,
        extraction,
        calculation,
        status: 'completed'
      });
    });

    // Step 5: Send webhook to user
    await step('notify-user', async () => {
      await sendWebhook(userId, 'document.processed', {
        documentId,
        calculation
      });
    });

    return { success: true, documentId, calculation };
  }
});
```

#### Example 2: Daily Credit Score Refresh

```typescript
export const refreshCreditScoresJob = job({
  id: 'refresh-credit-scores',
  // Run daily at 2 AM
  trigger: trigger_scheduled({
    cron: '0 2 * * *'
  }),

  run: async () => {
    // Step 1: Get all active users with last score > 24 hours ago
    const usersToRefresh = await step('get-users', async () => {
      return await supabase
        .from('users')
        .select('id, last_score_refresh')
        .where('subscription_status', 'active')
        .where('last_score_refresh', '<', new Date(Date.now() - 24 * 60 * 60 * 1000));
    });

    // Step 2: Refresh scores in batch (max 50 concurrent)
    const results = await step('refresh-scores', async () => {
      return await Promise.all(
        usersToRefresh.map(async (user) => {
          try {
            const score = await calculateCreditScore(user.id);
            await updateUserScore(user.id, score);
            return { userId: user.id, success: true, score };
          } catch (error) {
            return { userId: user.id, success: false, error: (error as Error).message };
          }
        })
      );
    });

    // Step 3: Log results
    await step('log-results', async () => {
      await supabase.from('score_refresh_logs').insert({
        timestamp: new Date(),
        users_processed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      });
    });

    return { processed: results.length };
  }
});
```

#### Example 3: Async Report Generation

```typescript
export const generateReportJob = job({
  id: 'generate-report',
  trigger: trigger_webhook({
    name: 'report.requested'
  }),

  run: async (payload) => {
    const { reportId, userId, reportType, dateRange } = payload;

    await step('update-status', async () => {
      await supabase
        .from('reports')
        .update({ status: 'processing' })
        .eq('id', reportId);
    });

    // Fetch data based on report type
    const reportData = await step('fetch-data', async () => {
      switch (reportType) {
        case 'expense_summary':
          return await fetchExpenseSummary(userId, dateRange);
        case 'tax_summary':
          return await fetchTaxSummary(userId, dateRange);
        case 'credit_report':
          return await fetchCreditReport(userId);
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }
    });

    // Generate PDF (using React PDF or Puppeteer)
    const pdfBuffer = await step('generate-pdf', async () => {
      return await generatePDFReport(reportType, reportData);
    });

    // Upload to storage
    const storagePath = await step('upload-pdf', async () => {
      const path = `reports/${userId}/${reportId}.pdf`;
      await supabase.storage.from('reports').upload(path, pdfBuffer);
      return path;
    });

    // Update database
    await step('update-status', async () => {
      await supabase
        .from('reports')
        .update({
          status: 'completed',
          download_url: storagePath,
          completed_at: new Date()
        })
        .eq('id', reportId);
    });

    // Send notification
    await step('notify-user', async () => {
      await sendWebhook(userId, 'report.completed', {
        reportId,
        downloadUrl: storagePath
      });
    });

    return { success: true, reportId, downloadUrl: storagePath };
  }
});
```

### 5.4 Error Handling & Retries

```typescript
// Automatic retry configuration
export const robustDocumentJob = job({
  id: 'robust-document-processing',
  retry: {
    maxAttempts: 3,
    delay: 'exponential',  // 1s, 2s, 4s, 8s...
    backoffMultiplier: 2,
    maxDelay: '5 minutes'
  },

  run: async (payload) => {
    // Job automatically retries on failure
    // Each attempt logs to Trigger.dev dashboard
    // After max attempts, marked as failed and alerted
  }
});
```

### 5.5 Observability

```typescript
import { Logger } from '@trigger.dev/sdk';

// Use the built-in logger
export const observedJob = job({
  id: 'observed-document-processing',

  run: async (payload) => {
    const logger = new Logger();

    logger.info('Starting document processing', {
      documentId: payload.documentId,
      userId: payload.userId
    });

    try {
      const result = await processDocument(payload);
      logger.success('Document processed', { documentId: payload.documentId });
      return result;
    } catch (error) {
      logger.error('Document processing failed', {
        documentId: payload.documentId,
        error: (error as Error).message
      });
      throw error;
    }
  }
});
```

**Trigger.dev Dashboard provides:**

- Job run history
- Success/failure rates
- Average duration
- Error traces with stack logs
- Real-time logs stream
- Webhook delivery status

---

## 6. External Libraries & Dependencies

### 6.1 Core Dependencies

| Library | Version | Purpose | Justification |
|---------|---------|---------|---------------|
| **next** | ^14.0 | React framework | API routes, SSR, Vercel deployment |
| **@supabase/supabase-js** | ^2.x | Database client | PostgreSQL + pgvector access |
| **@trigger.dev/sdk** | ^3.x | Background jobs | Workflow automation |
| **openai** | ^4.x | OpenAI fallback embeddings | text-embedding-3-small (final fallback) |
| **@google-cloud/aiplatform** | latest | Google Vertex AI embeddings | text-embedding-005 (primary) |
| **langchain** | ^0.1.x | RAG framework | Document loading, chunking, chains |
| **@langchain/community** | ^0.0.x | Vector stores | Supabase vector integration |
| **googleapis** | ^130.x | Google Doc AI | Document extraction |
| **zod** | ^3.x | Validation | Request/response validation |
| **trpc** | ^11.x | API layer | Type-safe API endpoints |
| **tailwindcss** | ^3.x | Styling | CSS framework |
| **typescript** | ^5.x | Type safety | Language |

> **Note:** Kimchi.dev uses OpenAI-compatible API — no special SDK needed. Use standard `fetch` with `https://llm.kimchi.dev/openai/v1` endpoint.

### 6.2 Document Processing Libraries

| Library | Purpose |
|---------|---------|
| **pdf-parse** | Extract text from PDFs |
| **mammoth** | Convert DOCX to text |
| **turndown** | HTML to Markdown conversion |
| **cheerio** | HTML parsing for scraping |
| **node-fetch** | HTTP requests |

### 6.3 Credit API Clients

| Library | Purpose |
|---------|---------|
| **@mono/sdk** | Mono API client (or use raw fetch) |
| **axios** | HTTP client for API calls |

### 6.4 Optional/Future Dependencies

#### ORM Options (Database Abstraction)

| Library | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **Prisma** | ⚠️ Limited (exhausted) | $12+/month | Type-safe, great DX, but free tier is restrictive |
| **Drizzle ORM** | ✅ Unlimited | Self-hosted | Lightweight, SQL-like, no free tier limits |
| **Kysely** | ✅ Unlimited | Self-hosted | SQL query builder, no ORM overhead |
| **Bookshelf** | ✅ Unlimited | Self-hosted | Traditional ORM for Node |

> **Recommendation:** Use Supabase's built-in query builder (`supabase-js`) directly. If you need more structure, **Drizzle ORM** is a lightweight alternative that doesn't impose per-tier query limits.

#### Caching Options

| Library | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **Upstash Redis** | 10K commands/day | $10+/month | Serverless Redis, pay-per-command |
| **Vercel KV** | 4K requests/day | $10+/month | Redis for Vercel ecosystem |
| **Cloudflare KV** | 100K reads/day | $5+/month | Global KV store, eventual consistency |
| **Turso (LibSQL)** | 9GB storage, 500 reqs/day | $5+/month | SQLite-based, embedded edge DB |
| **Supabase (with caching)** | ✅ Use Supabase | - | Cache via Supabase Edge Functions |

> **Recommendation:** Start with **Supabase Edge Functions + Postgres caching** to avoid Redis complexity. Migrate to **Upstash Redis** or **Cloudflare KV** when you hit scale.

#### Email Options

| Library | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **Resend** | 3,000 emails/month | $20+/month | Modern, developer-friendly |
| **Loops** | 1,000 emails/month | $25+/month | Good for SaaS transactional |
| **Postmark** | 100 emails/month | $35+/month | High deliverability, SaaS focus |
| **Mailgun** | 5,000 emails/month | $35+/month | Traditional, good deliverability |
| **SendGrid** | 100 emails/day | $15+/month | Enterprise-focused |
| **Brevo (Sendinblue)** | 300 emails/day | $25+/month | All-in-one marketing + transactional |

> **Recommendation:** **Resend** for modern stack. **Brevo** if you need marketing features alongside transactional.

#### Error Tracking / Monitoring Options

| Library | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **Sentry** | 5K errors/month, 7 days retention | $26+/month | Industry standard, great DX |
| **Highlight** | 1K sessions/month | $59+/month | Session replay + errors |
| **Glitchtip** | ✅ Open source, self-host | - | Sentry alternative, self-host free |
| **Bugsnag** | 2K errors/month | $29+/month | Stability scores |
| **LogRocket** | 1K sessions/month | $95+/month | Session replay |
| **Better Uptime** | 10 monitors | $15+/month | Uptime + on-call |

> **Recommendation:** Start with **Sentry** free tier during MVP. Self-host **Glitchtip** if you hit limits and want full control.

#### Analytics Options

| Library | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **PostHog** | 1M events/month | $0 + usage | Product analytics, session replay |
| **Plausible** | 10K pageviews/month | $9+/month | Privacy-first, simple |
| **Fathom** | 500K pageviews/month | $14+/month | Privacy-first, no cookies |
| **Umami** | ✅ Self-host | - | Simple, self-hosted, no tracking |
| **Google Analytics** | ✅ Free | - | Industry standard, privacy concerns |
| **Simple Analytics** | 100K pageviews/month | €19+/month | Privacy-first |

> **Recommendation:** **PostHog** for product analytics (events, funnels, session replay). **Plausible** or **Umami** if privacy-first is priority.

#### Payments / Billing Options

| Library | Free Tier | Transaction Fee | Notes |
|---------|-----------|-----------------|-------|
| **Stripe** | ✅ Free account | 2.9% + 30¢ | Industry standard, great DX |
| **Flutterwave** | ✅ Free account | 1.4% + 150₦ (NG) | Pan-African, works with Nigerian banks |
| **Paystack** (Stripe subsidiary) | ✅ Free account | 1.5% + 100₦ (NG) | Strong in Nigeria, acquired by Stripe |
| **M-Pesa (Safaricom)** | Business account | Varies | Kenya, Tanzania, Mozambique |
| **Lemon Squeezy** | ✅ Free | 3.5% + 30¢ | Creator/ SaaS focused |
| **Paddle** | ✅ Free | 5% + 10¢ | Billing infrastructure, tax handling included |

> **For Nigerian market:** **Flutterwave** or **Paystack** are the best choices — they support local bank transfers, USSD, cards, and mobile money. Stripe is good for international payments.

> **Recommendation:** Use **Flutterwave** for Nigerian-focused MVP (better local payment methods). Add **Stripe** later if you need international coverage.

#### Storage / CDN / File Upload Options

> **Note:** Supabase is used ONLY for RAG (structured data + pgvector). All file uploads, images, and static assets go to external CDN.

**Storage (General Files, Documents):**

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Backblaze B2** | 10GB storage | ✅ **Selected** — S3-compatible, $0.006/GB/month after free tier |
| **Supabase Storage** | ❌ Not used | Keeping Supabase clean for RAG only |

**Image Upload + CDN:**

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Cloudinary** | 25 credits/month (~25GB bandwidth) | ✅ **Selected** — Image optimization, transformations, global CDN |

#### Additional Optional Tools

| Library | Purpose | Free Tier | Notes |
|---------|---------|-----------|-------|
| **Zapier / Make** | Workflow automation | 100 runs/month | No-code integrations |
| **Ngrok** | Webhook testing | 1 tunnel, 4 hours | Local dev for webhooks |
| **GitHub Actions** | CI/CD | 2,000 mins/month | Free for open/private repos |
| **Depot** | Docker builds | 1 concurrent | Faster builds |
| **Neon** | Serverless Postgres | 0.5GB storage | Branching for dev/staging |

### 6.5 Library Justification

#### Why LangChain?

LangChain provides:

- **Document loaders** — Unified interface for PDFs, DOCX, URLs
- **Text splitters** — Purpose-built chunking strategies
- **Vector store integration** — Supabase pgvector native support
- **Chain composition** — RAG pipeline as code
- **Prompt templates** — Reusable, version-controlled prompts

**Alternative considered:** Build RAG pipeline from scratch

- **Pros:** Less dependencies, smaller bundle size
- **Cons:** Reinventing wheel, no community support, more bugs
- **Decision:** Use LangChain for speed and reliability

#### Why Trigger.dev over alternatives?

**Alternative 1: AWS Lambda + SQS**

- More infrastructure to manage
- No native TypeScript support
- Manual retry/observability setup
- Cold starts

**Alternative 2: GCP Cloud Functions/Triggers**

- Google-specific (we're Vercel-focused)
- More setup complexity
- Less developer-friendly

**Alternative 3: Temporal**

- Excellent durability
- Steeper learning curve
- No Vercel integration
- More infrastructure

**Decision: Trigger.dev** — Best fit for Vercel + TypeScript + MVP speed

---

## 7. Complete Task List

### Phase 1: Core API Infrastructure

| Task | Status | Priority | Dependencies |
|------|--------|----------|--------------|
| Set up Next.js project with TypeScript | ⏳ | P0 | None |
| Configure Supabase project | ⏳ | P0 | None |
| Set up Trigger.dev project | ⏳ | P0 | None |
| Implement API key generation | ⏳ | P0 | Supabase |
| Implement rate limiting middleware | ⏳ | P0 | Redis (optional) |
| Create tax calculation endpoint | ⏳ | P0 | Tax brackets data |
| Set up Kimchi.dev + Vertex AI | ⏳ | P0 | Kimchi account, Google Cloud |
| Create API documentation (OpenAPI) | ⏳ | P1 | None |
| Build developer portal (basic) | ⏳ | P2 | Next.js |

### Phase 2: RAG Pipeline + Knowledge Base

| Task | Status | Priority | Dependencies |
|------|--------|----------|--------------|
| Set up `/knowledge-base` folder structure | ⏳ | P0 | None |
| Write initial markdown docs (VAT, income tax, WHT) | ⏳ | P0 | None |
| Create markdown parser (extract frontmatter + sections) | ⏳ | P0 | None |
| Generate embeddings (Vertex AI primary, HF fallback) | ⏳ | P0 | Kimchi.dev, Vertex AI |
| Store in Supabase pgvector | ⏳ | P0 | Supabase |
| Build RAG query function | ⏳ | P0 | LangChain, Kimchi.dev |
| Create chat endpoint | ⏳ | P0 | RAG function |
| Add citations to responses | ⏳ | P1 | RAG function |
| Build Super Admin markdown editor interface | ⏳ | P1 | Next.js |
| Add version history to knowledge base | ⏳ | P1 | Supabase |
| Implement conversation history | ⏳ | P2 | Supabase |

### Phase 3: Document Processing

| Task | Status | Priority | Dependencies |
|------|--------|----------|--------------|
| Set up Google Document AI | ⏳ | P0 | Google Cloud |
| Create document upload endpoint | ⏳ | P0 | Cloudflare R2 (or Cloudinary) |
| Build OCR processing job | ⏳ | P0 | Trigger.dev, Google DocAI |
| Implement data extraction | ⏳ | P0 | Google DocAI |
| Create report generation endpoint | ⏳ | P1 | Trigger.dev |
| Implement bulk upload | ⏳ | P2 | None |
| Add auto-categorization | ⏳ | P2 | ML/heuristics |

### Phase 4: Credit Integration

> **⚠️ Note:** Okra is DEFUNCT. All Okra references should be replaced with Mono.

| Task | Status | Priority | Dependencies |
|------|--------|----------|--------------|
| Set up Mono API access | ⏳ | P0 | Mono account |
| Create account connection flow | ⏳ | P0 | Mono Connect |
| Implement transaction fetch | ⏳ | P0 | Mono API |
| Build credit score algorithm | ⏳ | P0 | Transaction data |
| Create credit score endpoint | ⏳ | P0 | Score algorithm |
| Explore Jumo partnership | ⏳ | P2 | Jumo partnership |
| Add BVN/NIN verification | ⏳ | P1 | Mono Lookup/Prove |

### Phase 5: B2B Platform

| Task | Status | Priority | Dependencies |
|------|--------|----------|--------------|
| Build API key management portal | ⏳ | P0 | Next.js |
| Create webhook registration system | ⏳ | P0 | Trigger.dev |
| Implement usage analytics | ⏳ | P1 | Supabase |
| Build sandbox environment | ⏳ | P1 | None |
| Create usage limits dashboard | ⏳ | P1 | None |
| Implement team management | ⏳ | P2 | None |
| Add Stripe billing (future) | ⏳ | P2 | Stripe |

### Phase 6: Tax Professional Marketplace

| Task | Status | Priority | Dependencies |
|------|--------|----------|--------------|
| Set up Mapbox account | ⏳ | P0 | Mapbox |
| Create `tax_professionals` table | ⏳ | P0 | Supabase |
| Implement Mono Lookup integration | ⏳ | P0 | Mono API |
| Build tax pro signup flow | ⏳ | P0 | Next.js, Supabase |
| Create CAC document upload | ⏳ | P0 | Supabase Storage |
| Build admin approval queue | ⏳ | P0 | Next.js |
| Set up geocoding (Mapbox) | ⏳ | P0 | Mapbox API |
| Create marketplace listing page | ⏳ | P1 | Next.js |
| Implement proximity search | ⏳ | P1 | PostGIS/Supabase |
| Create tax pro profile pages | ⏳ | P1 | Next.js |
| Build RAG embedding pipeline for pros | ⏳ | P1 | Vertex AI |
| Implement hybrid search (semantic + geo) | ⏳ | P2 | Supabase, RAG |
| Add "near me" to chat | ⏳ | P2 | RAG pipeline |

### Ongoing Tasks

| Task | Frequency | Priority |
|------|-----------|----------|
| Update knowledge base (FIRS docs) | Monthly | P0 |
| Monitor API errors | Daily | P0 |
| Refresh credit scores | Daily | P1 |
| Review and optimize costs | Weekly | P1 |
| Security audit | Monthly | P0 |
| Backup verification | Weekly | P0 |

---

## 8. Infrastructure Requirements

### 8.1 Required Services

| Service | Purpose | Free Tier | Estimated Cost (Growth) |
|---------|---------|-----------|-------------------------|
| **Vercel** | API + Frontend hosting | 100K requests | $0 → $20/month |
| **Supabase** | Database + Auth + Storage + Vector | 500MB database | $0 → $25/month |
| **Trigger.dev** | Background jobs | 10K runs/month | $0 → $49/month |
| **Kimchi.dev** | LLM (OpenAI-compatible) | Free tier | $0 → $50/month |
| **Google Vertex AI** | Embeddings (primary) | $300 free credit | $0 → $50/month |
| **Google Cloud** | Document AI | $300 free credit | $0 → $50/month |
| **Mono** | Bank APIs + Business Lookup | Free tier | $0 → $100/month |
| **Mapbox** | Geocoding + Maps | 100K requests/month | $0 → $50/month |
| **Backblaze B2** | File storage | 10GB | $0 → $5/month |
| **Cloudinary** | Image CDN | 25 credits | $0 → $20/month |
| **Domain (Cloudflare)** | DNS + Security | Free | $0 |

### 8.2 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Kimchi.dev (LLM - primary)
KIMCHI_API_KEY=

# Embeddings (in priority order)
GOOGLE_CLOUD_PROJECT_ID=           # Google Vertex AI (primary)
GOOGLE_APPLICATION_CREDENTIALS=    # For Vertex AI auth
HF_API_KEY=                        # Hugging Face (fallback)
OPENAI_API_KEY=                    # OpenAI (final fallback)

# Google Document AI
GOOGLE_DOCAI_PROCESSOR_ID=

# Mono (replaces defunct Okra)
MONO_API_KEY=
MONO_WEBHOOK_SECRET=

# Mapbox (Geocoding + Maps)
MAPBOX_ACCESS_TOKEN=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Trigger.dev
TRIGGER_SECRET_KEY=
TRIGGER_PUBLIC_KEY=

# Internal
API_SECRET_KEY=                    # For signing internal requests
ENCRYPTION_KEY=                    # For encrypting sensitive data
```

### 8.3 Security Checklist

- [ ] All API keys in environment variables (not code)
- [ ] Supabase row-level security (RLS) enabled
- [ ] API rate limiting configured
- [ ] Webhook signature verification
- [ ] HTTPS only (Vercel handles this)
- [ ] Input validation on all endpoints (Zod)
- [ ] SQL injection prevention (parameterized queries via Supabase)
- [ ] XSS prevention (React handles this by default)
- [ ] CORS configured for known origins only
- [ ] Audit logging for sensitive operations

---

## 9. Implementation Roadmap

### Month 1: Foundation

```
Week 1-2:
├── Set up project structure
├── Configure Supabase (database + storage)
├── Set up Trigger.dev
├── Implement basic API key system
└── Create tax calculation endpoint

Week 3-4:
├── Download and process NTA/NTAA documents
├── Build RAG ingestion pipeline
├── Test RAG query with tax questions
└── Create basic developer documentation
```

### Month 2: AI Integration

```
Week 5-6:
├── Complete document chunking and embedding
├── Build RAG chat endpoint
├── Implement conversation history
└── Add citation tracking

Week 7-8:
├── Integrate Mono for bank data
├── Build transaction fetch pipeline
├── Create credit score algorithm (v1)
└── Test with sample users
```

### Month 3: Document Pipeline

```
Week 9-10:
├── Set up Google Document AI
├── Build document upload endpoint
├── Create document processing workflow
└── Implement data extraction

Week 11-12:
├── Build report generation
├── Add webhook notifications
├── Integrate with RAG for receipts
└── Test full document → report pipeline
```

### Month 4: Credit + Infrastructure

```
Week 13-14:
├── Complete credit score integration
├── Add BVN/NIN verification
├── Set up Terraform IaC
└── Configure monitoring

Week 15-16:
├── Build API dashboard
├── Implement usage analytics
├── Security hardening
└── Load testing
```

### Month 5: B2B Platform + Marketplace

```
Week 17-18:
├── API key management portal
├── Webhook system
└── Developer documentation

Week 19-20:
├── Sandbox environment
├── Usage dashboard
├── Team management (if time)
└── Tax Professional Marketplace (Phase 1):
    ├── Tax pro signup with CAC verification
    ├── Mono Lookup API integration
    ├── Admin approval workflow
    ├── Public marketplace listing
    └── Geolocation setup (Mapbox)
```

### Month 6: Launch + Marketplace RAG

```
Week 21-22:
├── Public API launch
├── Marketing website
└── Waitlist signup

Week 23-24:
├── Early adopter outreach
├── Marketplace RAG integration:
│   ├── Embed tax professionals as documents
│   ├── Hybrid search (semantic + geographic)
│   ├── "Find tax pro near me" feature
│   └── Conversational recommendations
├── First revenue tracking
└── Bug fixes and improvements
```

---

### Marketplace Features Summary

| Feature | Implementation |
|---------|----------------|
| **CAC Business Verification** | Mono Lookup API + CAC certificate upload |
| **Geocoding** | Mapbox (100k free requests/month) |
| **Proximity Search** | PostGIS / Supabase geography queries |
| **RAG Integration** | Dual-index: tax docs + pro profiles |
| **Contact Discovery** | Phone, email, WhatsApp in RAG response |
| **Admin Approval** | Super admin queue in `/admin/marketplace` |

---

### Month 6: Launch

```
Week 21-22:
├── Public API launch
├── Marketing website
└── Waitlist signup

Week 23-24:
├── Early adopter outreach
├── Bug fixes and improvements
└── First revenue tracking
```

---

## Appendix: API Reference Summary

### Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/verify` | Validate API key |
| POST | `/api/v1/tax/calculate` | Calculate income tax |
| GET | `/api/v1/tax/brackets` | Current tax brackets |
| POST | `/api/v1/chat` | RAG-powered tax Q&A |
| GET | `/api/v1/tax/rules/:topic` | Retrieve tax rules |
| POST | `/api/v1/documents/upload` | Upload document |
| GET | `/api/v1/documents/:id` | Get extraction result |
| POST | `/api/v1/documents/:id/report` | Generate report |
| GET | `/api/v1/credit/score` | Get credit score |
| GET | `/api/v1/credit/history` | Tax compliance history |
| POST | `/api/v1/credit/verify-bvn` | BVN verification |
| POST | `/api/v1/api-keys` | Create API key |
| GET | `/api/v1/api-keys` | List API keys |
| DELETE | `/api/v1/api-keys/:id` | Revoke API key |
| POST | `/api/v1/webhooks` | Register webhook |
| GET | `/api/v1/usage` | Usage analytics |

---

*Document Version: 1.4*
*Last Updated: June 12, 2026*
*Next Review: Weekly during implementation*

## Changelog

### v1.4 (June 12, 2026)
- **MVP REFACTOR:** Deferred Developer Portal to post-MVP
  - API Explorer, SDKs, Sandbox, Webhooks marked "Phase 4+"
  - Focus now on consumer RAG product first
- **Multimodal RAG (Future):** Added vision for enhanced RAG pipeline
  - Phase 1: Markdown only (current)
  - Phase 4+: Add PDF, image (OCR), video (transcription) support
  - Updated Section 3.8 with multimodal architecture

### v1.3 (June 12, 2026)
- **Knowledge Base:** Adopted **Markdown/GitBook-style** approach for MVP
  - GitBook-style folder structure (`/tax-types/vat/rates.md`)
  - YAML frontmatter for metadata
  - Super Admin interface for content management (Phase 1)
  - No PDF storage or Google Document AI needed initially
- **Storage Strategy:** Supabase for RAG ONLY. All uploads/images via external CDN.
  - **Backblaze B2** for general file/document storage (10GB free)
  - **Cloudinary** for image upload + CDN (25 credits/month)
  - Supabase Storage explicitly not used
- Expanded **Section 6.4 Optional Dependencies** with comprehensive alternatives:
  - ORM: Drizzle, Kysely, Bookshelf (Prisma alternatives)
  - Payments: Flutterwave, Paystack, M-Pesa, Lemon Squeezy, Paddle
  - Email: Loops, Postmark, Mailgun, SendGrid, Brevo
  - Error Tracking: Highlight, Glitchtip, Bugsnag, LogRocket
  - Analytics: Plausible, Fathom, Umami, Simple Analytics
  - Caching: Vercel KV, Cloudflare KV, Turso

### v1.2 (June 12, 2026)
- Replaced OpenAI GPT-4o with **Kimchi.dev** for LLM
  - Endpoint: `https://llm.kimchi.dev/openai/v1`
  - Models: `minimax-m2.7` (fast), `kimi-k2.6` (reasoning)
- Updated embedding stack with provider priority:
  1. **Google Vertex AI** (primary, $300 credit, text-embedding-005)
  2. **Hugging Face** (fallback, free tier, all-MiniLM-L6-v2)
  3. **OpenAI** (final fallback, $5 credit, text-embedding-3-small)
- Supabase pgvector remains as vector database
- Updated environment variables for all providers

### v1.1 (June 12, 2026)
- ⚠️ Okra marked DEFUNCT — company shut down
- Updated Mono status to ACTIVE (Flutterwave acquisition)
- Updated Jumo status to ACTIVE (B2B infrastructure partner)
- Removed all Okra SDK references
- Replaced Okra with Mono in all integration plans
- Added warning callouts throughout document