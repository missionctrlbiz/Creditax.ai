# Creditax.ai — PocketBase Demo MVP Architecture

**Version:** 1.0  
**Date:** September 21, 2026  
**Status:** Active Development — Demo MVP  
**Target:** VPS-hosted demo with PocketBase, ready for client approval

---

## 1. Current State Audit

### 1.1 What Exists Now

| Component | Current Implementation | Status |
|-----------|------------------------|--------|
| **Database** | Hardcoded JSON in `src/data/blog.ts`, `localStorage` for auth (`src/lib/mock-auth.ts`) | ❌ No real persistence |
| **Supabase** | Configured in `.env` (URL + keys present) | ⚠️ **Not connected** — zero `@supabase/supabase-js` imports, no DB calls |
| **Auth** | `localStorage`-based mock auth (`src/lib/mock-auth.ts`) | ❌ Not production-ready |
| **Blog** | Static JSON array exported from `src/data/blog.ts` | ❌ Not editable via admin |
| **Reports** | Hardcoded in page component (`src/app/dashboard/reports/page.tsx`) | ❌ Not persisted |
| **RAG / AI** | Empty directories: `src/ai/rag/`, `src/ai/llm/`, `src/ai/document_parser/` | ⚠️ Scaffolded, no logic |
| **API Routes** | Empty: `src/api/routes/` | ⚠️ No backend endpoints |

### 1.2 Confirmed Gaps

- No database client initialized anywhere in `src/`
- No Supabase service usage despite `.env` credentials
- All "data" is compile-time constants or browser `localStorage`
- No file upload pipeline
- No vector search capability
- No background job processing

---

## 2. Target Architecture: PocketBase Demo MVP

### 2.1 Why PocketBase for Demo

| Factor | PocketBase | Supabase (current plan) |
|--------|------------|-------------------------|
| **Deployment** | Single binary + SQLite file | Requires PostgreSQL server |
| **Hosting** | Your VPS (already running) | Cloud service |
| **Setup time** | Minutes | Hours (project + migrations) |
| **Portability** | Ship `pocketbase.db` + binary | Export/import SQL dumps |
| **File storage** | Built-in (stores alongside DB) | Separate storage layer |
| **Admin UI** | Auto-generated at `/pb/_/` | Separate dashboard |
| **Auth** | Built-in (email/password, OAuth) | Built-in |
| **Migration later** | Straightforward schema mapping | Already on target |
| **Cost for demo** | $0 (VPS already paid) | Free tier limits apply |

**Decision:** Use PocketBase now. It ships as one binary + one `.db` file. No migration needed for demo. Schema maps cleanly to Supabase later if you outgrow it.

---

## 3. PocketBase Instance Setup

### 3.1 VPS Directory Structure

```
/var/www/creditax-demo/
├── pocketbase/
│   ├── pocketbase              # PocketBase binary (download from pocketbase.io)
│   ├── .env                    # PocketBase env (SMTP, admin email, etc.)
│   └── pb_data/
│       ├── pocketbase.db       # SQLite database — THIS IS YOUR DATA
│       └── files/              # Uploaded files (images, PDFs, certs)
└── web/
    └── creditax-ai/            # Next.js app (this repo)
```

### 3.2 Start Command

```bash
cd /var/www/creditax-demo/pocketbase
./pocketbase serve --http 127.0.0.1:8090
```

PocketBase Admin UI: `http://your-vps-ip:8090/_/`

### 3.3 Initial Admin Setup

```bash
./pocketbase setup
# Email: admin@creditax.ai
# Password: <secure-password>
```

---

## 4. PocketBase Collections (Schema)

### 4.1 Collection: `documents`

**Purpose:** Markdown knowledge base entries (tax law docs, guides, etc.)

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto | Primary key |
| `title` | text | Document title |
| `slug` | text | URL-safe identifier (unique) |
| `content` | text | Full Markdown body |
| `file_path` | text | Optional: source file path |
| `file_size` | number | Bytes, optional |
| `status` | select | `draft` or `published` (default: `draft`) |
| `created_at` | autodate | |
| `updated_at` | autodate | |

### 4.2 Collection: `chunks`

**Purpose:** RAG chunks with embeddings for semantic search

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto | Primary key |
| `document_id` | relation → `documents` | Parent document |
| `chunk_text` | text | The text chunk |
| `chunk_index` | number | Order within document |
| `embedding` | json | Float array from OpenRouter |
| `token_count` | number | Approximate tokens |
| `metadata` | json | `{ "source": "NTA 2023", "section": "Section 4" }` |
| `created_at` | autodate | |

**Note on sqlite-vec:** PocketBase default build does NOT include sqlite-vec. We store embeddings as JSON and compute cosine similarity in the Next.js API layer (see §6).

### 4.3 Collection: `professionals`

**Purpose:** Tax professional marketplace profiles

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto | Primary key |
| `name` | text | Firm/practitioner name |
| `slug` | text | URL-safe (unique) |
| `email` | text | |
| `phone` | text | |
| `whatsapp` | text | Optional |
| `website` | text | Optional |
| `cac_number` | text | CAC registration number |
| `services` | json | `["VAT Filing", "Tax Audit", "TCC"]` |
| `description` | text | Profile text |
| `location_text` | text | Human-readable address |
| `lat` | number | Latitude (optional) |
| `lng` | number | Longitude (optional) |
| `verified` | bool | Admin-approved (default: `false`) |
| `avatar` | file | Profile image |
| `cac_certificate` | file | PDF upload for verification |
| `created_at` | autodate | |

### 4.4 Collection: `reports`

**Purpose:** Generated tax reports and documents

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto | Primary key |
| `user_id` | relation → `users` | Owner |
| `name` | text | Report filename/title |
| `type` | select | `tax_calculation`, `credit_report`, `receipt_analysis` |
| `date` | text | ISO date string |
| `size` | text | Human-readable (e.g., "2.4 MB") |
| `file_path` | text | PocketBase file reference |
| `download_url` | text | Direct download link |
| `created_at` | autodate | |

### 4.5 Collection: `users` (Built-in)

**Purpose:** Authentication and user profiles

Use PocketBase's built-in `users` collection. Extend with:

| Field | Type | Notes |
|-------|------|-------|
| `role` | select | `consumer`, `tax_pro`, `admin` |
| `company_name` | text | Optional |
| `phone` | text | Optional |
| `avatar` | file | Optional profile image |

---

## 5. Data Model Relationships

```
documents (1) ──▶ (N) chunks
   │
   └── When a document is created/updated:
       1. Chunk the Markdown content
       2. Generate embeddings via OpenRouter
       3. Store chunks with embedding vectors

users (1) ──▶ (N) reports
   │
   └── Generated reports linked to owner

professionals (standalone)
   │
   └── Embedded as vectors for marketplace RAG
```

---

## 6. RAG Pipeline (PocketBase + OpenRouter)

### 6.1 Embeddings Model: OpenRouter

**Primary (Free):** `nvidia/nemotron-3-embed-1b:free`  
**Fallback (Cheap):** `openai/text-embedding-3-small` ($0.02/M tokens)

OpenRouter API endpoint:
```
POST https://openrouter.ai/api/v1/embeddings
Authorization: Bearer $OPENROUTER_API_KEY
Content-Type: application/json

{
  "model": "nvidia/nemotron-3-embed-1b:free",
  "input": "text to embed",
  "encoding_format": "float"
}
```

### 6.2 Embedding Dimensions

| Model | Dimensions | Context Window |
|-------|-----------|----------------|
| `nvidia/nemotron-3-embed-1b:free` | 768 | 32,768 tokens |
| `openai/text-embedding-3-small` | 1536 | 8,191 tokens |

**Store as JSON arrays** in `chunks.embedding`. Both models output `number[]` — no schema changes needed if you swap.

### 6.3 Chunking Strategy

```typescript
// Recommended for demo
const CHUNK_SIZE = 500;      // tokens (approximate)
const CHUNK_OVERLAP = 50;    // tokens
const SEPARATOR = "\n\n";    // Markdown paragraph split

function chunkMarkdown(text: string): string[] {
  const paragraphs = text.split(SEPARATOR);
  const chunks: string[] = [];
  let current = "";
  
  for (const para of paragraphs) {
    if (current.length + para.length > CHUNK_SIZE * 4) { // rough char estimate
      if (current) chunks.push(current.trim());
      current = para;
    } else {
      current += SEPARATOR + para;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}
```

### 6.4 Ingestion Flow

```
Admin adds/updates Markdown in PocketBase
    │
    ▼
Next.js API route: POST /api/v1/rag/ingest
    │
    ├── 1. Fetch document from PocketBase
    ├── 2. Chunk the Markdown
    ├── 3. Call OpenRouter embeddings API (batched)
    ├── 4. Delete existing chunks for document
    ├── 5. Insert new chunks with embeddings
    └── 6. Return chunk count
```

### 6.5 Query Flow (RAG Search)

```
User asks question: "What is the VAT rate for SMEs?"
    │
    ▼
Next.js API route: POST /api/v1/chat
    │
    ├── 1. Embed user query via OpenRouter
    ├── 2. Fetch ALL chunks from PocketBase
    │       (for <10k chunks, brute-force is fine)
    ├── 3. Cosine similarity in JS:
    │       - Compute dot product of query vector × each chunk vector
    │       - Sort by similarity score
    │       - Take top 5
    ├── 4. Build prompt: chunks + user question
    ├── 5. Call LLM (Kimchi.dev or OpenRouter)
    └── 6. Return answer with source citations
```

### 6.6 Cosine Similarity Implementation

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

### 6.7 Classifier (Optional): Jev via OpenRouter

If you need structured classification (e.g., route queries, detect intent), use TypeSafe AI's Jev model:

```typescript
// OpenRouter endpoint: POST /api/alpha/decisions
{
  "model": "~typesafe/jev-latest",
  "state": { "query": "I need help with my VAT return" },
  "questions": {
    "intent": {
      "type": "choice",
      "instructions": "What is the user's intent?",
      "criteria": {
        "tax_question": "Asking about tax law, rates, or compliance",
        "credit_question": "Asking about credit scores or loans",
        "marketplace_search": "Looking for a tax professional",
        "general": "General inquiry or greeting"
      }
    },
    "urgency": {
      "type": "score",
      "instructions": "How urgent is this request?",
      "criteria": [
        "Low — general information",
        "Medium — needs response within days",
        "High — needs response within hours",
        "Critical — deadline today or overdue"
      ]
    }
  }
}
```

**When to use Jev:**
- Pre-classify user queries before RAG (route to different prompts)
- Tag incoming support requests
- Auto-categorize uploaded documents

**When NOT to use Jev:**
- For the RAG embedding pipeline (Jev is not an embedding model)
- For generating responses (use Kimchi.dev or similar LLM)

---

## 7. File & Image Handling

### 7.1 PocketBase File Fields

PocketBase handles file uploads natively. Files are stored in `pb_data/files/` and served via REST API.

**Supported operations:**
- Upload: `POST /api/collections/professionals/records/{id}`
  - Form data with `avatar` or `cac_certificate` fields
- Download: `GET /api/files/professionals/{record-id}/{filename}`
- Thumbnail: `GET /api/files/professionals/{record-id}/200x200/{filename}`

### 7.2 File Size Limits (Demo)

Configure in PocketBase `.env`:
```
PB_PUBLIC_DIR=./pb_data/public
PB_FILES_MAXSIZE=10485760  # 10MB per file
```

### 7.3 Next.js Upload Flow

```typescript
// Frontend
const formData = new FormData();
formData.append("avatar", fileInput.files[0]);

const res = await fetch("http://localhost:8090/api/collections/professionals/records/{id}", {
  method: "PATCH",
  headers: { "Authorization": `Bearer ${adminToken}` },
  body: formData,
});
```

---

## 8. API Routes Structure (Next.js)

### 8.1 Route Map

```
src/app/api/v1/
├── chat/
│   └── route.ts          # POST — RAG-powered Q&A
├── rag/
│   ├── ingest/
│   │   └── route.ts      # POST — Ingest document → chunks + embeddings
│   └── search/
│       └── route.ts      # POST — Semantic search (returns top chunks)
├── documents/
│   ├── route.ts          # GET list, POST create
│   └── [id]/
│       └── route.ts      # GET, PATCH, DELETE
├── professionals/
│   ├── route.ts          # GET list (with optional geo filter), POST create
│   └── [slug]/
│       └── route.ts      # GET public profile
├── reports/
│   ├── route.ts          # GET user's reports, POST generate
│   └── [id]/
│       └── route.ts      # GET, DELETE
├── auth/
│   ├── login/
│   │   └── route.ts      # POST — PocketBase auth proxy
│   ├── logout/
│   │   └── route.ts      # POST
│   └── me/
│       └── route.ts      # GET — current user
└── classify/
    └── route.ts          # POST — Optional Jev classification
```

### 8.2 PocketBase JS SDK (Client Side)

Install: `npm install pocketbase`

```typescript
// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://localhost:8090');

// Auth
export async function login(email: string, password: string) {
  await pb.admins.authWithPassword(email, password);
  // or pb.collection('users').authWithPassword(email, password)
}

// Fetch records
export async function getDocuments() {
  return await pb.collection('documents').getList(1, 50, {
    filter: 'status = "published"',
    sort: '-created',
  });
}

// Create with file
export async function createProfessional(data: FormData) {
  return await pb.collection('professionals').create(data);
}
```

### 8.3 PocketBase Admin SDK (Server Side)

```typescript
// src/lib/pocketbase-admin.ts
import PocketBase from 'pocketbase';

export const pbAdmin = new PocketBase('http://localhost:8090');

// Authenticate as admin for privileged operations
export async function ensureAdmin() {
  if (pbAdmin.authStore.isAdmin) return;
  await pbAdmin.admins.authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL!,
    process.env.POCKETBASE_ADMIN_PASSWORD!
  );
}
```

---

## 9. RAG Implementation Details

### 9.1 Document Ingestion

```typescript
// src/app/api/v1/rag/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/pocketbase-admin';
import { chunkMarkdown } from '@/lib/rag/chunker';
import { embedTexts, EmbeddingProvider } from '@/lib/rag/embeddings';

export async function POST(request: NextRequest) {
  await ensureAdmin();
  
  const { documentId } = await request.json();
  
  // 1. Fetch document from PocketBase
  const doc = await pbAdmin.collection('documents').getOne(documentId);
  
  // 2. Chunk
  const chunks = chunkMarkdown(doc.content);
  
  // 3. Embed (batch)
  const embeddings = await embedTexts(chunks, 'nvidia/nemotron-3-embed-1b:free');
  
  // 4. Delete old chunks
  const existing = await pbAdmin.collection('chunks').getList(1, 10000, {
    filter: `document_id = "${documentId}"`,
  });
  for (const chunk of existing.items) {
    await pbAdmin.collection('chunks').delete(chunk.id);
  }
  
  // 5. Insert new chunks
  for (let i = 0; i < chunks.length; i++) {
    await pbAdmin.collection('chunks').create({
      document_id: documentId,
      chunk_text: chunks[i],
      chunk_index: i,
      embedding: embeddings[i],
      token_count: chunks[i].split(/\s+/).length,
      metadata: { source: doc.title },
    });
  }
  
  return NextResponse.json({ chunksCreated: chunks.length });
}
```

### 9.2 Embeddings Provider

```typescript
// src/lib/rag/embeddings.ts
export type EmbeddingProvider = 
  | 'nvidia/nemotron-3-embed-1b:free'
  | 'openai/text-embedding-3-small';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/embeddings';

export async function embedTexts(
  texts: string[],
  model: EmbeddingProvider = 'nvidia/nemotron-3-embed-1b:free'
): Promise<number[][]> {
  const response = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: texts,
      encoding_format: 'float',
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Embedding failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

export async function embedQuery(
  query: string,
  model: EmbeddingProvider = 'nvidia/nemotron-3-embed-1b:free'
): Promise<number[]> {
  const embeddings = await embedTexts([query], model);
  return embeddings[0];
}
```

### 9.3 Chat Endpoint (RAG)

```typescript
// src/app/api/v1/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/pocketbase';
import { embedQuery } from '@/lib/rag/embeddings';
import { cosineSimilarity } from '@/lib/rag/similarity';
import { callLLM } from '@/lib/rag/llm';

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  
  // 1. Embed query
  const queryVector = await embedQuery(message);
  
  // 2. Fetch all chunks
  const chunks = await pbAdmin.collection('chunks').getList(1, 10000);
  
  // 3. Score and rank
  const scored = chunks.items
    .map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryVector, chunk.embedding as number[]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  // 4. Build context
  const context = scored
    .map(c => `[Source: ${c.metadata?.source || 'Unknown'}]\n${c.chunk_text}`)
    .join('\n\n---\n\n');
  
  // 5. Call LLM
  const answer = await callLLM(context, message);
  
  return NextResponse.json({
    answer,
    sources: scored.map(c => ({
      document_id: c.document_id,
      chunk_text: c.chunk_text.slice(0, 200) + '...',
      score: c.score,
    })),
  });
}
```

### 9.4 LLM Provider

Use Kimchi.dev (already configured in `.env`):

```typescript
// src/lib/rag/llm.ts
const KIMCHI_BASE = process.env.KIMCHI_BASE_URL || 'https://llm.kimchi.dev/openai/v1';
const KIMCHI_MODEL = process.env.KIMCHI_MODEL || 'minimax-m2.7';

export async function callLLM(context: string, question: string): Promise<string> {
  const response = await fetch(`${KIMCHI_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KIMCHI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: KIMCHI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a Nigerian tax law assistant. Answer questions using ONLY the provided context. If the context doesn't contain the answer, say "I don't have information about that in my knowledge base." Always cite your source.`,
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      max_tokens: 1000,
    }),
  });
  
  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated.';
}
```

---

## 10. Auth Migration (Mock → PocketBase)

### 10.1 Current State

`src/lib/mock-auth.ts` uses `localStorage` to store role + email. No server-side validation.

### 10.2 Target State

Replace with PocketBase auth:

```typescript
// src/lib/pocketbase.ts (update)
export async function login(email: string, password: string) {
  await pb.collection('users').authWithPassword(email, password);
  return pb.authStore.model;
}

export async function getSession() {
  if (pb.authStore.isValid) return pb.authStore.model;
  return null;
}

export async function logout() {
  pb.authStore.clear();
}
```

**Migration path:**
1. Keep `mock-auth.ts` as fallback during development
2. Add feature flag: `NEXT_PUBLIC_USE_POCKETBASE_AUTH=true`
3. Switch to PocketBase auth when ready

---

## 11. Knowledge Base Content Seeding

### 11.1 Initial Documents to Add

| Document | Source | Format |
|----------|--------|--------|
| Nigeria Tax Act 2023 (key sections) | Research/planning | Markdown |
| Tax Administration Act 2023 (key sections) | Research/planning | Markdown |
| FIRS VAT Guide | Research/planning | Markdown |
| Withholding Tax Circulars | Research/planning | Markdown |
| Capital Gains Tax Act | Research/planning | Markdown |

### 11.2 Seeding Script

```typescript
// scripts/seed-knowledge-base.ts
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');
await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL!, process.env.PB_ADMIN_PASSWORD!);

const docs = [
  { title: 'Nigeria Tax Act 2023', slug: 'nta-2023', content: fs.readFileSync('./kb/nta-2023.md', 'utf8') },
  // ... more docs
];

for (const doc of docs) {
  await pb.collection('documents').create({
    ...doc,
    status: 'published',
  });
}
```

---

## 12. Demo Deployment Checklist

### 12.1 VPS Setup

```bash
# 1. Install PocketBase
mkdir -p /var/www/creditax-demo/pocketbase
cd /var/www/creditax-demo/pocketbase
curl -L https://pocketbase.io/downloads/releases/latest/linux_amd64.zip -o pb.zip
unzip pb.zip

# 2. Initialize
./pocketbase setup

# 3. Create collections via Admin UI (http://vps-ip:8090/_/)
#    OR use migrations (see §12.3)

# 4. Start as service
sudo nano /etc/systemd/system/pocketbase.service
```

`/etc/systemd/system/pocketbase.service`:
```ini
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=www-data
WorkingDir=/var/www/creditax-demo/pocketbase
ExecStart=/var/www/creditax-demo/pocketbase/pocketbase serve --http 127.0.0.1:8090
Restart=always
Environment=PB_PUBLIC_DIR=./pb_data/public
Environment=PB_FILES_MAXSIZE=10485760

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
```

### 12.2 Next.js Environment Variables

```env
# .env.local (Next.js)
POCKETBASE_URL=http://localhost:8090

# OpenRouter (Embeddings + optional LLM)
OPENROUTER_API_KEY=sk-or-v1-...

# LLM (Kimchi.dev)
KIMCHI_API_KEY=castai_v1_...
KIMCHI_BASE_URL=https://llm.kimchi.dev/openai/v1
KIMCHI_MODEL=minimax-m2.7

# PocketBase Admin (for server-side operations)
POCKETBASE_ADMIN_EMAIL=admin@creditax.ai
POCKETBASE_ADMIN_PASSWORD=<secure-password>
```

### 12.3 PocketBase Migrations (Optional)

For reproducible setup, use PocketBase migrations:

```bash
./pocketbase migrate create init

# This generates a SQL migration file in pb_data/migrations/
# Edit it to create your collections:
```

`pb_data/migrations/0001_initial.sql`:
```sql
-- documents collection
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- chunks collection
CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding TEXT,  -- JSON array
  token_count INTEGER,
  metadata TEXT,   -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- professionals collection
CREATE TABLE IF NOT EXISTS professionals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  website TEXT,
  cac_number TEXT NOT NULL,
  services TEXT,   -- JSON array
  description TEXT,
  location_text TEXT,
  lat REAL,
  lng REAL,
  verified BOOLEAN DEFAULT 0,
  avatar TEXT,
  cac_certificate TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- reports collection
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  size TEXT NOT NULL,
  file_path TEXT,
  download_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES _users(id)
);

-- users table extension (PocketBase creates _users automatically)
ALTER TABLE _users ADD COLUMN role TEXT DEFAULT 'consumer';
ALTER TABLE _users ADD COLUMN company_name TEXT;
ALTER TABLE _users ADD COLUMN phone TEXT;
ALTER TABLE _users ADD COLUMN avatar TEXT;
```

Apply migrations:
```bash
./pocketbase migrate
```

---

## 13. Data Flow Diagrams

### 13.1 Knowledge Base RAG Flow

```
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│  Admin UI    │─────▶│  Next.js API │─────▶│  OpenRouter      │
│  (PocketBase │      │  /rag/ingest │      │  Embeddings API  │
│   Admin UI)  │      │              │      │  (free)          │
└──────────────┘      └──────┬───────┘      └──────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  PocketBase      │
                    │  chunks table    │
                    │  (embedding JSON)│
                    └──────────────────┘
```

### 13.2 User Query Flow

```
┌──────────┐    ┌──────────────────┐    ┌──────────────────┐
│  User    │───▶│  Next.js API     │───▶│  OpenRouter      │
│  Query   │    │  /chat           │    │  Embed Query     │
└──────────┘    └───────┬──────────┘    └──────────────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  Fetch ALL       │
                │  chunks from PB  │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  Cosine Sim in   │
                │  JS (top 5)      │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  LLM (Kimchi.dev)│
                │  + context       │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  Response to     │
                │  User            │
                └──────────────────┘
```

### 13.3 File Upload Flow

```
┌──────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Frontend│───▶│  Next.js API     │───▶│  PocketBase      │
│  Form    │    │  Route (proxy)   │    │  File Storage    │
└──────────┘    └──────────────────┘    └──────────────────┘
                         │                       │
                         │                       ▼
                         │              ┌──────────────────┐
                         │              │  pb_data/files/  │
                         │              │  (auto-served)   │
                         │              └──────────────────┘
                         ▼
                ┌──────────────────┐
                │  Record updated  │
                │  with file path  │
                └──────────────────┘
```

---

## 14. Environment Variables Reference

### 14.1 PocketBase (`.env` in pocketbase/)

```
# Admin
PB_ADMIN_EMAIL=admin@creditax.ai
PB_ADMIN_PASSWORD=<secure-password>

# SMTP (optional, for emails)
SMTP_HOST=smtp.your-vps.com
SMTP_PORT=587
SMTP_USER=noreply@creditax.ai
SMTP_PASS=<email-password>

# Public URL
PUBLIC_URL=https://creditax-demo.your-domain.com
```

### 14.2 Next.js (`.env.local`)

```env
# PocketBase
POCKETBASE_URL=http://localhost:8090

# OpenRouter (Embeddings + optional LLM)
OPENROUTER_API_KEY=sk-or-v1-...

# Kimchi.dev (LLM)
KIMCHI_API_KEY=castai_v1_...
KIMCHI_BASE_URL=https://llm.kimchi.dev/openai/v1
KIMCHI_MODEL=minimax-m2.7

# Optional: Jev Classifier
TYPESAFE_API_KEY=...

# Optional: Google Maps (for geocoding)
NEXT_PUBLIC_MAPBOX_TOKEN=pk....
```

---

## 15. Package Dependencies (Add to `package.json`)

```json
{
  "dependencies": {
    "pocketbase": "^0.21.0"
  },
  "devDependencies": {
    "@types/pocketbase": "^0.21.0"
  }
}
```

---

## 16. Migration Path to Production

### 16.1 When to Migrate

Migrate from PocketBase to Supabase (or self-hosted Postgres) when:
- You need multi-server deployment (PocketBase is single-node)
- You outgrow SQLite performance (>100k records, heavy concurrent writes)
- You need advanced PostGIS features for geo queries
- Client demands "proper" cloud database

### 16.2 Schema Mapping (PocketBase → Supabase)

| PocketBase | Supabase | Notes |
|------------|----------|-------|
| `documents` table | `documents` table | Direct mapping |
| `chunks.embedding` (JSON) | `chunks.embedding` (vector(1536)) | Add pgvector extension |
| `professionals.avatar` (file) | `professionals.avatar` (Supabase Storage) | Migrate files |
| `_users` table | `auth.users` + `profiles` | Use Supabase Auth |
| `pb_data/files/` | Supabase Storage bucket | S3-compatible |

### 16.3 Embeddings Migration

When moving to Supabase with pgvector:
```sql
-- Convert JSON embeddings to native vector type
ALTER TABLE chunks 
  ADD COLUMN embedding_vec vector(1536)
  GENERATED ALWAYS AS (embedding::vector(1536)) STORED;

CREATE INDEX chunks_embedding_idx 
  ON chunks 
  USING ivfflat (embedding_vec vector_cosine_ops);
```

Then update query to use Supabase vector search instead of JS cosine similarity.

---

## 17. Demo Readiness Criteria

### 17.1 Must-Have for Client Demo

- [ ] PocketBase running on VPS with all collections created
- [ ] Admin can log in to `/pb/_/` and CRUD documents
- [ ] At least 5 Nigerian tax documents seeded in knowledge base
- [ ] `/api/v1/chat` endpoint returns answers with citations
- [ ] `/api/v1/professionals` lists tax professionals
- [ ] File upload works (avatar + CAC certificate)
- [ ] Auth works (signup/login/logout via PocketBase)
- [ ] Chat UI shows "thinking" state and sources

### 17.2 Nice-to-Have

- [ ] Jev classifier routes queries (tax vs credit vs marketplace)
- [ ] Map view for tax professionals
- [ ] Document ingestion from admin UI
- [ ] Report generation (PDF download)
- [ ] Credit score dashboard (mock data for demo)

---

## 18. Security Notes (Demo)

- PocketBase admin UI should be IP-whitelisted or behind VPN for demo
- OpenRouter API key should be server-side only (never expose to client)
- Kimchi.dev API key should be server-side only
- Use PocketBase's built-in rate limiting
- Enable CORS in PocketBase to allow only your Next.js domain

---

## 19. Troubleshooting

| Issue | Solution |
|-------|----------|
| PocketBase binary won't start | Check `chmod +x pocketbase`, verify SQLite permissions on `pb_data/` |
| Embeddings API rate limited | Switch from free NVIDIA model to `openai/text-embedding-3-small` ($0.02/M tokens) |
| Chunks not returning relevant results | Increase `CHUNK_SIZE`, add overlap, or try different embedding model |
| File uploads fail | Check `PB_FILES_MAXSIZE` in PocketBase `.env`, ensure `pb_data/files/` is writable |
| CORS errors | Add `CORS_ALLOWED_ORIGINS=*` (dev) or specific domain (prod) to PocketBase `.env` |

---

## 20. Open Questions / Decisions Needed

1. **OpenRouter account**: Create account at openrouter.ai, add $5-10 credit for embeddings + optional LLM usage
2. **PocketBase version**: Use latest stable (v0.23+ recommended for custom SQLite driver if needed later)
3. **Tax documents source**: Extract from `research/` folder and convert to Markdown
4. **Jev integration**: Do you need structured classification in the demo, or is simple RAG enough?
5. **Demo timeline**: Target date for client review?

---

*Document Version: 1.0*  
*Last Updated: September 21, 2026*
