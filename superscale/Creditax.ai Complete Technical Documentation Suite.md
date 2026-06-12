# Creditax.ai — Complete Technical Documentation Suite

> 12 technical documents covering the full scope of the Creditax.ai platform. Designed for a solo developer building the system end-to-end. Reference each document independently or read sequentially for full context.

---

# Document Index

| # | Document | Purpose |
|---|----------|---------|
| 01 | [Tech Stack & Project Setup](#doc-01) | Languages, frameworks, services |
| 02 | [File & Folder Architecture](#doc-02) | Complete codebase structure |
| 03 | [Database Schema](#doc-03) | All tables, columns, relationships |
| 04 | [Authentication & Authorization](#doc-04) | Auth flows, roles, RBAC |
| 05 | [API Specification](#doc-05) | All endpoints, methods, payloads |
| 06 | [Screen Inventory & Route Map](#doc-06) | Every screen and its URL |
| 07 | [Entity Relationship Document](#doc-07) | ERD narrative and relationships |
| 08 | [Product Requirements Document (PRD)](#doc-08) | Features, user stories, acceptance criteria |
| 09 | [Design System Guide](#doc-09) | Colors, typography, components, tokens |
| 10 | [Data Flow & State Management](#doc-10) | Client-server data architecture |
| 11 | [Security & Compliance](#doc-11) | Security requirements, NDPA, FIRS |
| 12 | [Deployment & Infrastructure](#doc-12) | DevOps, hosting, CI/CD |

---

# DOC 01 — Tech Stack & Project Setup {#doc-01}

## Overview

Creditax.ai is a full-stack web and mobile platform with three distinct user surfaces: a consumer app, a tax professional portal, and a super admin panel. It exposes a public REST API for third-party integrations.

## Recommended Stack

### Frontend
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Next.js 14 (App Router)** | SSR/SSG, file-based routing, API routes |
| Language | **TypeScript** | Type safety across full stack |
| Styling | **Tailwind CSS** | Utility-first, fast iteration |
| UI Components | **shadcn/ui** | Headless, accessible, customizable |
| State Management | **Zustand** | Lightweight, no boilerplate |
| Data Fetching | **TanStack Query v5** | Caching, invalidation, optimistic updates |
| Forms | **React Hook Form + Zod** | Schema validation, performance |
| Charts | **Recharts** | Score gauges, usage charts, trend lines |
| Maps | **Mapbox GL JS** | Marketplace map, location picker |
| Code Editor | **CodeMirror 6** | KB markdown editor with syntax highlighting |
| Animations | **Framer Motion** | Onboarding transitions, empty state animations |

### Backend
| Layer | Choice | Reason |
|-------|--------|--------|
| Runtime | **Node.js 20+** | Ecosystem, async, Nigerian hosting compatibility |
| API Framework | **Express.js** | Mature, flexible, large ecosystem |
| ORM | **Prisma** | Type-safe queries, migrations, schema-first |
| Database | **PostgreSQL 15** | Relational, JSON support, full-text search |
| Cache | **Redis (Upstash)** | Session store, rate limiting, queue |
| Queue | **BullMQ** | Document processing, report generation |
| Auth | **Clerk** (or **NextAuth v5**) | Magic link, OAuth, sessions |
| File Storage | **Cloudflare R2** | S3-compatible, cheap egress |
| OCR | **AWS Textract** | Receipt/invoice extraction |
| AI/RAG | **LangChain + OpenAI GPT-4o** | Tax law Q&A, document understanding |
| Vector DB | **Pinecone** (or **pgvector**) | RAG embedding storage |
| Email | **Resend** | Transactional email, magic links |
| SMS | **Termii** | Nigerian SMS provider |
| Payments | **Paystack** | NGN payments, subscriptions |
| Webhooks | **Svix** | Reliable webhook delivery |

### Infrastructure
| Layer | Choice |
|-------|--------|
| Frontend Hosting | Vercel |
| Backend Hosting | Railway or Render |
| Database | Neon (serverless Postgres) or Supabase |
| CDN | Cloudflare |
| Monitoring | Sentry + BetterStack |
| Analytics | PostHog |
| CI/CD | GitHub Actions |

## Environment Variables Required

```env
# App
NEXT_PUBLIC_APP_URL=https://creditax.ai
APP_SECRET=

# Database
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# AI
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX=creditax-kb

# Storage
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_BUCKET=creditax-documents
CLOUDFLARE_R2_ENDPOINT=

# OCR
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# External APIs
MONO_SECRET_KEY=
FIRS_API_KEY=
MAPBOX_ACCESS_TOKEN=
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=

# Communications
RESEND_API_KEY=
TERMII_API_KEY=

# Webhooks
SVIX_API_KEY=
WEBHOOK_SECRET=

# Redis
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
```

---

# DOC 02 — File & Folder Architecture {#doc-02}

```
creditax-ai/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/             # Public marketing pages
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx      # Blog listing
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── pricing/page.tsx
│   │   │   │   └── status/page.tsx
│   │   │   │
│   │   │   ├── (auth)/               # Auth pages (no sidebar)
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   │   │
│   │   │   ├── (dashboard)/          # Consumer dashboard
│   │   │   │   ├── layout.tsx        # Dashboard shell + sidebar
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── tax-filing/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [step]/page.tsx  # Wizard steps 1-5
│   │   │   │   ├── documents/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── upload/page.tsx
│   │   │   │   ├── credit/
│   │   │   │   │   ├── page.tsx      # Credit overview
│   │   │   │   │   └── detail/page.tsx
│   │   │   │   ├── reports/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   │
│   │   │   ├── (pro)/                # Tax Professional portal
│   │   │   │   ├── layout.tsx        # Pro shell + PRO PORTAL badge
│   │   │   │   ├── pro/
│   │   │   │   │   ├── dashboard/page.tsx
│   │   │   │   │   ├── clients/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [clientId]/
│   │   │   │   │   │       ├── page.tsx       # Client overview
│   │   │   │   │   │       ├── documents/page.tsx
│   │   │   │   │   │       └── reports/page.tsx
│   │   │   │   │   ├── calculations/page.tsx
│   │   │   │   │   ├── reports/page.tsx
│   │   │   │   │   ├── verify/page.tsx
│   │   │   │   │   └── settings/page.tsx
│   │   │   │
│   │   │   ├── (admin)/              # Super admin panel
│   │   │   │   ├── layout.tsx        # Admin shell + ADMIN badge
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/page.tsx
│   │   │   │   │   ├── users/page.tsx
│   │   │   │   │   ├── professionals/page.tsx
│   │   │   │   │   ├── knowledge-base/page.tsx
│   │   │   │   │   ├── audit/page.tsx
│   │   │   │   │   ├── marketplace/page.tsx
│   │   │   │   │   ├── departments/page.tsx
│   │   │   │   │   ├── facilities/page.tsx
│   │   │   │   │   └── settings/page.tsx
│   │   │   │
│   │   │   ├── (developers)/         # Developer hub
│   │   │   │   ├── developers/
│   │   │   │   │   ├── page.tsx      # API Explorer
│   │   │   │   │   ├── quickstart/page.tsx
│   │   │   │   │   ├── reference/page.tsx
│   │   │   │   │   ├── sdks/page.tsx
│   │   │   │   │   ├── sandbox/page.tsx
│   │   │   │   │   └── webhooks/page.tsx
│   │   │   │
│   │   │   ├── (marketplace)/
│   │   │   │   ├── marketplace/page.tsx
│   │   │   │   └── marketplace/[proId]/page.tsx
│   │   │   │
│   │   │   ├── api/                  # Next.js API routes (thin layer)
│   │   │   │   └── [...]/route.ts    # Proxies to backend
│   │   │   │
│   │   │   └── layout.tsx            # Root layout
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn base components
│   │   │   ├── layout/               # Shell, sidebar, nav, topbar
│   │   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── documents/            # Upload zone, document list, status
│   │   │   ├── credit/               # Score gauge, factor bars, trend chart
│   │   │   ├── tax-filing/           # Wizard steps, AI chat bubble
│   │   │   ├── marketplace/          # Map, pro cards, search
│   │   │   ├── admin/                # Admin-specific components
│   │   │   ├── developers/           # Code blocks, API explorer form
│   │   │   ├── shared/               # Toast, modal, empty state, badge
│   │   │   └── onboarding/           # Carousel, welcome screen
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                # API client (axios/fetch wrapper)
│   │   │   ├── auth.ts               # Auth helpers
│   │   │   ├── utils.ts              # cn(), formatNGN(), formatDate()
│   │   │   ├── validators/           # Zod schemas
│   │   │   └── constants.ts          # Tax rates, FIRS data
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-user.ts
│   │   │   ├── use-documents.ts
│   │   │   ├── use-credit-score.ts
│   │   │   ├── use-tax-filing.ts
│   │   │   └── use-realtime.ts
│   │   │
│   │   ├── store/
│   │   │   ├── filing-store.ts       # Tax wizard state
│   │   │   ├── ui-store.ts           # Sidebar, modals
│   │   │   └── notification-store.ts
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   └── api/                          # Express backend
│       ├── src/
│       │   ├── index.ts              # Express app entry
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── users.ts
│       │   │   ├── documents.ts
│       │   │   ├── tax.ts
│       │   │   ├── credit.ts
│       │   │   ├── rag.ts
│       │   │   ├── professionals.ts
│       │   │   ├── clients.ts
│       │   │   ├── reports.ts
│       │   │   ├── api-keys.ts
│       │   │   ├── webhooks.ts
│       │   │   ├── marketplace.ts
│       │   │   ├── admin/
│       │   │   │   ├── users.ts
│       │   │   │   ├── professionals.ts
│       │   │   │   ├── audit.ts
│       │   │   │   ├── kb.ts
│       │   │   │   ├── departments.ts
│       │   │   │   └── facilities.ts
│       │   │   └── developers/
│       │   │       ├── sandbox.ts
│       │   │       └── usage.ts
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── rbac.middleware.ts
│       │   │   ├── rate-limit.middleware.ts
│       │   │   ├── audit.middleware.ts
│       │   │   └── sandbox.middleware.ts
│       │   │
│       │   ├── services/
│       │   │   ├── ocr.service.ts
│       │   │   ├── rag.service.ts
│       │   │   ├── tax-calculator.service.ts
│       │   │   ├── credit-score.service.ts
│       │   │   ├── firs.service.ts
│       │   │   ├── webhook.service.ts
│       │   │   ├── email.service.ts
│       │   │   └── storage.service.ts
│       │   │
│       │   ├── workers/
│       │   │   ├── document.worker.ts   # OCR + extraction queue
│       │   │   ├── report.worker.ts     # Report generation queue
│       │   │   └── embed.worker.ts      # RAG re-embedding queue
│       │   │
│       │   ├── prisma/
│       │   │   └── schema.prisma
│       │   │
│       │   └── types/
│       │       └── index.ts
│       │
│       └── package.json
│
├── packages/
│   ├── creditax/                     # Public Node.js SDK
│   ├── creditax-python/              # Public Python SDK
│   └── shared/                       # Shared types and validators
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
└── README.md
```

---

# DOC 03 — Database Schema {#doc-03}

## Complete Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum UserRole {
  USER
  TAX_PRO
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  PENDING_VERIFICATION
  DELETED
}

enum DocumentStatus {
  UPLOADING
  PROCESSING
  EXTRACTED
  NEEDS_REVIEW
  VERIFIED
  FAILED
}

enum DocumentCategory {
  RECEIPT
  INVOICE
  TAX_FORM
  BANK_STATEMENT
  PAYROLL
  OVERHEAD
  OPERATIONS
  TRAVEL
  COMPLIANCE
  UNKNOWN
}

enum TaxType {
  INCOME_TAX
  VAT
  WHT
  CIT
}

enum FilingStatus {
  DRAFT
  IN_PROGRESS
  SUBMITTED
  PROCESSING
  ACCEPTED
  REJECTED
}

enum CreditTier {
  POOR
  FAIR
  GOOD
  EXCELLENT
}

enum ProApplicationStatus {
  PENDING
  APPROVED
  REJECTED
  MORE_INFO_REQUESTED
}

enum ProStatus {
  ACTIVE
  SUSPENDED
  INACTIVE
  UNDER_REVIEW
}

enum ReportType {
  TAX_SUMMARY
  EXPENSE_REPORT
  CREDIT_REPORT
  AUDIT_REPORT
  COMPLIANCE_REPORT
  CUSTOM
}

enum ApiKeyEnvironment {
  LIVE
  TEST
  SANDBOX
}

enum WebhookStatus {
  ACTIVE
  FAILED
  PAUSED
}

enum FacilityStatus {
  ONLINE
  OFFLINE
  WARNING
  STANDBY
}

enum KbStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum AuditAction {
  CREATED
  UPDATED
  DELETED
  LOGIN
  LOGOUT
  APPROVED
  REJECTED
  EXPORTED
  VIEWED
  CONFIG_CHANGED
  RE_INDEXED
}

// ─────────────────────────────────────────────
// CORE USER TABLES
// ─────────────────────────────────────────────

model User {
  id                String       @id @default(cuid())
  clerkId           String       @unique
  email             String       @unique
  emailVerified     Boolean      @default(false)
  firstName         String?
  lastName          String?
  phone             String?
  photoUrl          String?
  role              UserRole     @default(USER)
  status            UserStatus   @default(ACTIVE)
  timezone          String       @default("Africa/Lagos")
  onboardingStep    Int          @default(0)
  onboardingDone    Boolean      @default(false)

  // Relations
  taxFilings        TaxFiling[]
  documents         Document[]
  creditScore       CreditScore?
  apiKeys           ApiKey[]
  webhooks          Webhook[]
  reports           Report[]
  notifications     Notification[]
  sessions          UserSession[]
  auditLogs         AuditLog[]   @relation("AuditUser")
  department        DepartmentMember?

  // Pro-side: if this user is also a pro
  professionalProfile TaxProfessional?

  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  @@index([email])
  @@index([clerkId])
  @@map("users")
}

model UserSession {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceInfo  String?
  ipAddress   String?
  location    String?
  lastActiveAt DateTime @default(now())
  createdAt   DateTime @default(now())
  isActive    Boolean  @default(true)

  @@map("user_sessions")
}

// ─────────────────────────────────────────────
// TAX PROFESSIONAL
// ─────────────────────────────────────────────

model TaxProfessional {
  id                  String               @id @default(cuid())
  userId              String               @unique
  user                User                 @relation(fields: [userId], references: [id], onDelete: Cascade)

  businessName        String
  cacNumber           String?              @unique
  firsIN              String?              @unique
  bio                 String?
  photoUrl            String?
  yearsExperience     Int?
  entityType          String?              // LLC, Sole Proprietor, etc.
  industry            String?

  // Location
  address             String?
  city                String?
  state               String?
  latitude            Float?
  longitude           Float?

  // Contact
  phoneNumber         String?
  whatsapp            String?
  website             String?
  responseTime        String?              // "2-4 hours"

  // Status
  status              ProStatus            @default(UNDER_REVIEW)
  applicationStatus   ProApplicationStatus @default(PENDING)
  isVerified          Boolean              @default(false)
  isMarketplaceListed Boolean              @default(false)
  rejectionReason     String?
  adminNote           String?
  verifiedAt          DateTime?

  // Ratings
  averageRating       Float?
  totalReviews        Int                  @default(0)

  // Relations
  services            ProService[]
  documents           ProDocument[]
  clients             ClientRelationship[]
  reviews             ProReview[]
  workingHours        WorkingHours[]

  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  @@index([state])
  @@index([isMarketplaceListed])
  @@map("tax_professionals")
}

model ProService {
  id            String          @id @default(cuid())
  proId         String
  pro           TaxProfessional @relation(fields: [proId], references: [id], onDelete: Cascade)
  name          String          // "Income Tax Filing"
  description   String?
  minPrice      Decimal?
  maxPrice      Decimal?
  turnaroundDays Int?
  isActive      Boolean         @default(true)

  @@map("pro_services")
}

model ProDocument {
  id          String          @id @default(cuid())
  proId       String
  pro         TaxProfessional @relation(fields: [proId], references: [id], onDelete: Cascade)
  type        String          // "CAC_CERT" | "FIRS_CLEARANCE" | "VALID_ID"
  fileUrl     String
  status      String          @default("PENDING") // PENDING | VERIFIED | REJECTED
  verifiedAt  DateTime?
  createdAt   DateTime        @default(now())

  @@map("pro_documents")
}

model ProReview {
  id          String          @id @default(cuid())
  proId       String
  pro         TaxProfessional @relation(fields: [proId], references: [id], onDelete: Cascade)
  reviewerId  String
  rating      Int             // 1-5
  comment     String?
  createdAt   DateTime        @default(now())

  @@map("pro_reviews")
}

model WorkingHours {
  id        String          @id @default(cuid())
  proId     String
  pro       TaxProfessional @relation(fields: [proId], references: [id], onDelete: Cascade)
  dayOfWeek Int             // 0=Sun, 6=Sat
  openTime  String?         // "09:00"
  closeTime String?         // "17:00"
  isClosed  Boolean         @default(false)

  @@map("working_hours")
}

// ─────────────────────────────────────────────
// CLIENT RELATIONSHIP (Pro <-> User)
// ─────────────────────────────────────────────

model ClientRelationship {
  id            String          @id @default(cuid())
  proId         String
  pro           TaxProfessional @relation(fields: [proId], references: [id], onDelete: Cascade)
  clientUserId  String
  status        String          @default("ACTIVE") // ACTIVE | INACTIVE | PENDING
  notes         String?
  assignedAt    DateTime        @default(now())
  taxYear       Int?

  // Client documents shared with this pro
  sharedDocs    SharedDocument[]

  @@unique([proId, clientUserId])
  @@map("client_relationships")
}

model SharedDocument {
  id               String             @id @default(cuid())
  relationshipId   String
  relationship     ClientRelationship @relation(fields: [relationshipId], references: [id], onDelete: Cascade)
  documentId       String
  document         Document           @relation(fields: [documentId], references: [id])
  sharedAt         DateTime           @default(now())

  @@map("shared_documents")
}

// ─────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────

model Document {
  id                String           @id @default(cuid())
  userId            String
  user              User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  filename          String
  originalName      String
  fileUrl           String
  fileSize          Int
  mimeType          String
  pageCount         Int?

  // Extraction results
  status            DocumentStatus   @default(UPLOADING)
  category          DocumentCategory @default(UNKNOWN)
  extractedAmount   Decimal?
  extractedDate     DateTime?
  extractedData     Json?            // Full OCR result JSON
  confidence        Float?           // 0-1 confidence score
  ocrProvider       String?          // "AWS_TEXTRACT"

  // Filing association
  taxFilingId       String?
  taxFiling         TaxFiling?       @relation(fields: [taxFilingId], references: [id])

  // Shared with pros
  sharedDocuments   SharedDocument[]

  processedAt       DateTime?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  @@index([userId])
  @@index([status])
  @@index([category])
  @@map("documents")
}

// ─────────────────────────────────────────────
// TAX FILING
// ─────────────────────────────────────────────

model TaxFiling {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  taxYear         Int
  taxType         TaxType       @default(INCOME_TAX)
  status          FilingStatus  @default(DRAFT)
  currentStep     Int           @default(1)

  // Income details
  grossIncome     Decimal?
  state           String?       @default("Federal")
  entityType      String?       @default("individual")

  // Calculated values
  totalDeductions Decimal?
  taxableIncome   Decimal?
  totalTax        Decimal?
  effectiveRate   Float?
  taxSavings      Decimal?

  // AI summary
  aiSummary       String?
  aiDeductions    Json?         // Detected deduction list from AI

  // Documents
  documents       Document[]

  submittedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([userId, taxYear])
  @@map("tax_filings")
}

// ─────────────────────────────────────────────
// CREDIT SCORE
// ─────────────────────────────────────────────

model CreditScore {
  id                  String   @id @default(cuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  score               Int?     // 300–850
  tier                CreditTier?
  maxScore            Int      @default(850)

  // Factor breakdown
  taxFilingHistory    Int      @default(0)  // Points contribution
  documentConsistency Int      @default(0)
  incomeStability     Int      @default(0)
  savingsPattern      Int      @default(0)

  // History (stored as JSONB array of snapshots)
  history             Json     @default("[]")

  lastCalculatedAt    DateTime?
  nextUpdateAt        DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("credit_scores")
}

// ─────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────

model Report {
  id          String     @id @default(cuid())
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  proId       String?    // If generated by a pro for a client
  clientId    String?    // Target client userId (for pro reports)

  type        ReportType
  title       String
  taxYear     Int?
  dateFrom    DateTime?
  dateTo      DateTime?
  fileUrl     String?    // Generated PDF URL
  fileSize    Int?
  sections    Json?      // Selected sections for custom reports
  status      String     @default("GENERATING") // GENERATING | READY | FAILED

  createdAt   DateTime   @default(now())

  @@index([userId])
  @@index([proId, clientId])
  @@map("reports")
}

// ─────────────────────────────────────────────
// API KEYS
// ─────────────────────────────────────────────

model ApiKey {
  id            String             @id @default(cuid())
  userId        String
  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  keyHash       String             @unique    // bcrypt hash of the full key
  keyPrefix     String                        // "sk_live_" or "sk_test_"
  lastFourChars String                        // For display: "8f3a"
  environment   ApiKeyEnvironment  @default(LIVE)
  scopes        String[]           @default(["read"])
  isActive      Boolean            @default(true)
  lastUsedAt    DateTime?
  revokedAt     DateTime?

  usageLogs     ApiUsageLog[]

  createdAt     DateTime           @default(now())

  @@map("api_keys")
}

model ApiUsageLog {
  id          String   @id @default(cuid())
  apiKeyId    String
  apiKey      ApiKey   @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  endpoint    String
  method      String
  statusCode  Int
  latencyMs   Int?
  ipAddress   String?
  createdAt   DateTime @default(now())

  @@index([apiKeyId])
  @@index([createdAt])
  @@map("api_usage_logs")
}

// ─────────────────────────────────────────────
// WEBHOOKS
// ─────────────────────────────────────────────

model Webhook {
  id            String        @id @default(cuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  url           String
  events        String[]      // ["document.processed", "credit.score.updated"]
  secretHash    String        // HMAC secret (hashed)
  status        WebhookStatus @default(ACTIVE)
  successRate   Float?
  lastTriggeredAt DateTime?
  consecutiveFails Int        @default(0)

  deliveries    WebhookDelivery[]

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@map("webhooks")
}

model WebhookDelivery {
  id          String   @id @default(cuid())
  webhookId   String
  webhook     Webhook  @relation(fields: [webhookId], references: [id], onDelete: Cascade)
  eventType   String
  payload     Json
  statusCode  Int?
  responseMs  Int?
  success     Boolean  @default(false)
  attempts    Int      @default(1)
  createdAt   DateTime @default(now())

  @@index([webhookId])
  @@map("webhook_deliveries")
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // "DOCUMENT_READY" | "SCORE_UPDATED" | "FILING_DUE" | "API_QUOTA"
  title     String
  message   String
  isRead    Boolean  @default(false)
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([userId, isRead])
  @@map("notifications")
}

// ─────────────────────────────────────────────
// KNOWLEDGE BASE
// ─────────────────────────────────────────────

model KbFolder {
  id        String       @id @default(cuid())
  name      String
  slug      String       @unique
  order     Int          @default(0)
  articles  KbArticle[]
  createdAt DateTime     @default(now())

  @@map("kb_folders")
}

model KbArticle {
  id          String    @id @default(cuid())
  folderId    String
  folder      KbFolder  @relation(fields: [folderId], references: [id])
  title       String
  slug        String    @unique
  content     String    // Raw markdown
  status      KbStatus  @default(DRAFT)
  wordCount   Int?
  chunkCount  Int?      // Number of RAG chunks after embedding
  lastEmbeddedAt DateTime?
  publishedAt DateTime?
  updatedAt   DateTime  @updatedAt
  createdAt   DateTime  @default(now())

  @@map("kb_articles")
}

// ─────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────

model AuditLog {
  id          String      @id @default(cuid())
  userId      String?
  user        User?       @relation("AuditUser", fields: [userId], references: [id])
  action      AuditAction
  entityType  String      // "User" | "Document" | "TaxPro" | "KnowledgeBase" etc.
  entityId    String?
  entityName  String?
  before      Json?       // State before change
  after       Json?       // State after change
  ipAddress   String?
  userAgent   String?
  isSystem    Boolean     @default(false)
  createdAt   DateTime    @default(now())

  @@index([entityType])
  @@index([createdAt])
  @@map("audit_logs")
}

// ─────────────────────────────────────────────
// ADMIN: DEPARTMENTS
// ─────────────────────────────────────────────

model Department {
  id          String             @id @default(cuid())
  name        String
  description String?
  color       String?            // Brand color for card border
  managerId   String?
  members     DepartmentMember[]
  projects    Project[]
  createdAt   DateTime           @default(now())

  @@map("departments")
}

model DepartmentMember {
  id           String     @id @default(cuid())
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  userId       String     @unique
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  joinedAt     DateTime   @default(now())

  @@map("department_members")
}

model Project {
  id           String     @id @default(cuid())
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  name         String
  isActive     Boolean    @default(true)
  createdAt    DateTime   @default(now())

  @@map("projects")
}

// ─────────────────────────────────────────────
// ADMIN: FACILITIES
// ─────────────────────────────────────────────

model Facility {
  id           String         @id @default(cuid())
  name         String
  location     String?
  provider     String?        // "AWS" | "Azure" | "GCP" | "On-premise"
  region       String?
  sshHost      String?
  monitoringUrl String?
  status       FacilityStatus @default(ONLINE)
  isStandby    Boolean        @default(false)

  // Latest metrics (updated by monitoring cron)
  cpuPercent   Float?
  memPercent   Float?
  reqPerSec    Int?
  uptimePct30d Float?
  lastCheckedAt DateTime?

  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@map("facilities")
}

// ─────────────────────────────────────────────
// BILLING / SUBSCRIPTIONS
// ─────────────────────────────────────────────

model Subscription {
  id              String   @id @default(cuid())
  userId          String   @unique
  plan            String   // "FREE" | "PRO" | "ENTERPRISE"
  status          String   // "ACTIVE" | "CANCELLED" | "PAST_DUE"
  paystackSubId   String?
  apiCallsLimit   Int      @default(100)
  apiCallsUsed    Int      @default(0)
  resetAt         DateTime?
  trialEndsAt     DateTime?
  currentPeriodEnd DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("subscriptions")
}
```

---

# DOC 04 — Authentication & Authorization {#doc-04}

## Auth Architecture

Creditax.ai uses **Clerk** for authentication (magic link + Google OAuth). Clerk issues a JWT that the backend validates on every request.

## User Roles & Permissions Matrix

| Permission | USER | TAX_PRO | ADMIN | SUPER_ADMIN |
|-----------|------|---------|-------|------------|
| View own dashboard | ✓ | ✓ | ✓ | ✓ |
| Upload documents | ✓ | ✓ | — | — |
| Tax filing wizard | ✓ | — | — | — |
| View own credit score | ✓ | ✓ | — | — |
| Access Pro portal | — | ✓ | — | — |
| Manage clients | — | ✓ | — | — |
| Bulk calculations | — | ✓ | — | — |
| Verify client TIN/BVN | — | ✓ | — | — |
| List on marketplace | — | ✓ | — | — |
| View admin panel | — | — | ✓ | ✓ |
| Manage users | — | — | ✓ | ✓ |
| Approve pro applications | — | — | ✓ | ✓ |
| Edit knowledge base | — | — | — | ✓ |
| System settings | — | — | — | ✓ |
| View audit logs | — | — | ✓ | ✓ |
| Manage departments | — | — | — | ✓ |
| Manage facilities | — | — | — | ✓ |
| Create API keys | ✓ | ✓ | — | — |
| Access sandbox | ✓ | ✓ | — | — |

## Auth Flow (Consumer)

```
1. User visits /login
2. Enters email → Clerk sends magic link
3. User clicks link → Clerk validates token
4. Clerk issues session JWT (30 days)
5. Next.js middleware checks JWT on every request
6. Backend validates JWT header on every API call
7. User role checked via RBAC middleware
```

## Auth Flow (Magic Link Implementation)

```typescript
// middleware.ts (Next.js)
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/blog(.*)",
    "/pricing",
    "/status",
    "/marketplace(.*)",
    "/api/v2/(.*)",  // Public API (key auth)
  ],
  ignoredRoutes: ["/api/webhooks(.*)"],
});

// Role-based route guards
// app/(admin)/layout.tsx
export default async function AdminLayout({ children }) {
  const { sessionClaims } = auth();
  if (sessionClaims?.role !== "SUPER_ADMIN") redirect("/dashboard");
  return children;
}
```

## JWT Session Claims Structure

```typescript
interface SessionClaims {
  sub: string;          // Clerk user ID
  email: string;
  role: UserRole;       // Synced from DB on login
  status: UserStatus;
  plan: string;         // "FREE" | "PRO" | "ENTERPRISE"
  proId?: string;       // If user is a tax professional
  iat: number;
  exp: number;
}
```

## API Key Authentication (Public API)

```typescript
// middleware/auth.middleware.ts
export async function apiKeyAuth(req, res, next) {
  const key = req.headers.authorization?.replace("Bearer ", "");
  if (!key) return res.status(401).json({ error: "No API key" });

  // Extract prefix to find env (sk_live_ / sk_test_ / sk_sandbox_)
  const isSandbox = key.startsWith("sk_sandbox_");

  // Hash and look up in DB
  const hash = await bcrypt.hash(key, 10);
  const apiKey = await prisma.apiKey.findFirst({
    where: { keyHash: hash, isActive: true }
  });

  if (!apiKey) return res.status(401).json({ error: "Invalid API key" });

  req.userId = apiKey.userId;
  req.apiKeyId = apiKey.id;
  req.isSandbox = isSandbox;
  next();
}
```

---

# DOC 05 — API Specification {#doc-05}

## Base URL
- Production: `https://api.creditax.ai/v2`
- Sandbox: Uses same base with sandbox API key prefix `sk_sandbox_`

## Authentication
All endpoints require either:
- `Authorization: Bearer sk_live_****` (API key auth for public API)
- `Authorization: Bearer <clerk_jwt>` (session auth for dashboard)

---

### TAX ENDPOINTS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/tax/calculate` | API Key | Calculate income tax / VAT / WHT |
| `GET` | `/tax/brackets` | API Key | Get current FIRS tax brackets |
| `POST` | `/tax/vat` | API Key | Calculate VAT |
| `GET` | `/tax/wht-tables` | API Key | WHT rates by payment type |

**POST /tax/calculate**
```json
// Request
{
  "income": 12000000,
  "tax_year": 2024,
  "state": "Lagos",
  "include_reliefs": true,
  "entity_type": "individual"
}

// Response 200
{
  "status": "success",
  "gross_income": 12000000,
  "taxable_income": 9550000,
  "total_tax": 2387500,
  "effective_rate": "19.9%",
  "breakdown": [
    { "bracket": "0–300,000", "rate": "7%", "tax": 21000 },
    { "bracket": "300,001–600,000", "rate": "11%", "tax": 33000 }
  ],
  "reliefs_applied": {
    "cra": 200000,
    "pension": 250000
  }
}
```

---

### CREDIT ENDPOINTS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/credit/score` | JWT | Get user's credit score |
| `GET` | `/credit/history` | JWT | Score history (12 months) |
| `GET` | `/credit/factors` | JWT | Score factor breakdown |
| `POST` | `/credit/lender-match` | JWT | Find matching lenders |

---

### DOCUMENT ENDPOINTS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/documents/upload` | JWT | Upload + trigger OCR |
| `GET` | `/documents` | JWT | List user's documents |
| `GET` | `/documents/:id` | JWT | Get document + extracted data |
| `PUT` | `/documents/:id/confirm` | JWT | Confirm extracted data |
| `DELETE` | `/documents/:id` | JWT | Delete document |
| `POST` | `/documents/ocr` | API Key | OCR a document (API) |

---

### AI / RAG ENDPOINTS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/rag/chat` | API Key / JWT | Ask the AI Tax Assistant |
| `GET` | `/rag/chat/:sessionId` | JWT | Get chat history |

**POST /rag/chat**
```json
// Request
{
  "message": "What is the VAT rate for digital services in Nigeria?",
  "session_id": "sess_abc123"
}

// Response 200
{
  "reply": "The VAT rate for digital services in Nigeria is 7.5% as per FIRS circular...",
  "sources": [
    { "title": "FIRS VAT Guide 2024", "section": "Digital Services", "page": 12 }
  ],
  "session_id": "sess_abc123",
  "tokens_used": 312
}
```

---

### VERIFICATION ENDPOINTS (Pro only)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/verify/tin` | JWT (Pro) | Verify company TIN via FIRS |
| `POST` | `/verify/bvn` | JWT (Pro) | Verify individual BVN |
| `GET` | `/verify/clearance/:tin` | JWT (Pro) | Get tax clearance certificate |

---

### ADMIN ENDPOINTS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/admin/users` | JWT (Admin) | List all users |
| `PUT` | `/admin/users/:id` | JWT (Admin) | Update user role/status |
| `DELETE` | `/admin/users/:id` | JWT (Super) | Delete user |
| `GET` | `/admin/professionals` | JWT (Admin) | List tax professionals |
| `PUT` | `/admin/professionals/:id/approve` | JWT (Admin) | Approve pro application |
| `PUT` | `/admin/professionals/:id/reject` | JWT (Admin) | Reject with reason |
| `GET` | `/admin/audit` | JWT (Admin) | Get audit logs |
| `GET` | `/admin/stats` | JWT (Admin) | Platform stats |
| `GET` | `/admin/kb` | JWT (Super) | List KB articles |
| `POST` | `/admin/kb` | JWT (Super) | Create KB article |
| `PUT` | `/admin/kb/:id` | JWT (Super) | Update KB article |
| `POST` | `/admin/kb/:id/embed` | JWT (Super) | Re-embed article for RAG |

---

# DOC 06 — Screen Inventory & Route Map {#doc-06}

## Public Routes (No Auth Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingHero | Hero section + features + pricing preview |
| `/about` | AboutPage | Mission, team, values |
| `/blog` | BlogListing | Article grid |
| `/blog/[slug]` | BlogPost | Individual article |
| `/pricing` | PricingPage | Plans + comparison table |
| `/status` | StatusPage | System uptime |
| `/marketplace` | MarketplaceListing | Find tax professionals |
| `/marketplace/[proId]` | ProPublicProfile | Professional's public page |
| `/login` | LoginPage | Magic link + Google OAuth |
| `/signup` | SignupPage | Create account |

## Consumer Dashboard Routes (Auth: USER+)

| Route | Component | Guard |
|-------|-----------|-------|
| `/dashboard` | ConsumerDashboard | USER |
| `/dashboard/tax-filing` | TaxFilingList | USER |
| `/dashboard/tax-filing/[step]` | TaxFilingWizard | USER |
| `/dashboard/documents` | DocumentsPage | USER |
| `/dashboard/documents/upload` | DocumentUpload | USER |
| `/dashboard/credit` | CreditOverview | USER |
| `/dashboard/credit/detail` | CreditDetail | USER |
| `/dashboard/reports` | ReportsPage | USER |
| `/dashboard/settings` | SettingsPage | USER |

## Pro Portal Routes (Auth: TAX_PRO)

| Route | Component | Guard |
|-------|-----------|-------|
| `/pro/dashboard` | ProDashboard | TAX_PRO |
| `/pro/clients` | ClientManagement | TAX_PRO |
| `/pro/clients/[clientId]` | ClientDetail | TAX_PRO |
| `/pro/clients/[clientId]/documents` | ClientDocuments | TAX_PRO |
| `/pro/clients/[clientId]/reports` | ClientReports | TAX_PRO |
| `/pro/calculations` | BulkCalculations | TAX_PRO |
| `/pro/reports` | ProReports | TAX_PRO |
| `/pro/verify` | VerifyClient | TAX_PRO |
| `/pro/settings` | ProSettings | TAX_PRO |
| `/pro/apply` | ProApplication (5 steps) | USER |

## Admin Routes (Auth: ADMIN / SUPER_ADMIN)

| Route | Component | Guard |
|-------|-----------|-------|
| `/admin/dashboard` | AdminDashboard | ADMIN |
| `/admin/users` | AdminUsers | ADMIN |
| `/admin/professionals` | AdminProfessionals | ADMIN |
| `/admin/marketplace` | MarketplaceApprovals | ADMIN |
| `/admin/audit` | AuditLog | ADMIN |
| `/admin/knowledge-base` | KbEditor | SUPER_ADMIN |
| `/admin/departments` | Departments | SUPER_ADMIN |
| `/admin/facilities` | Facilities | SUPER_ADMIN |
| `/admin/settings` | AdminSettings | SUPER_ADMIN |

## Developer Routes (Auth: USER+)

| Route | Component | Guard |
|-------|-----------|-------|
| `/developers` | ApiExplorer | USER |
| `/developers/quickstart` | Quickstart | USER |
| `/developers/reference` | ApiReference | USER |
| `/developers/sdks` | SdksPage | USER |
| `/developers/sandbox` | SandboxPage | USER |
| `/developers/webhooks` | WebhooksPage | USER |
| `/dashboard/keys` | ApiKeysPage | USER |
| `/dashboard/usage` | UsageAnalytics | USER |

## API Routes

| Method | Path | Type |
|--------|------|------|
| `GET` | `/api/health` | Public |
| `POST` | `/api/v2/tax/*` | API Key |
| `POST` | `/api/v2/credit/*` | API Key / JWT |
| `POST` | `/api/v2/documents/*` | API Key / JWT |
| `POST` | `/api/v2/rag/*` | API Key |
| `POST` | `/api/webhooks/clerk` | Webhook |
| `POST` | `/api/webhooks/paystack` | Webhook |

---

# DOC 07 — Entity Relationship Document {#doc-07}

## Core Relationships

```
User (1) ──────────────── (1) CreditScore
User (1) ──────────────── (N) TaxFiling
User (1) ──────────────── (N) Document
User (1) ──────────────── (1) TaxProfessional [optional — if role = TAX_PRO]
User (1) ──────────────── (N) ApiKey
User (1) ──────────────── (N) Webhook
User (1) ──────────────── (N) Report
User (1) ──────────────── (N) Notification
User (1) ──────────────── (1) Subscription
User (1) ──────────────── (1) DepartmentMember [optional]

TaxProfessional (1) ────── (N) ProService
TaxProfessional (1) ────── (N) ProDocument [CAC, FIRS, ID]
TaxProfessional (1) ────── (N) ProReview
TaxProfessional (1) ────── (N) ClientRelationship

ClientRelationship (N) ─── (1) TaxProfessional
ClientRelationship (N) ─── (1) User [as client]
ClientRelationship (1) ─── (N) SharedDocument

Document (N) ──────────── (1) TaxFiling [optional]
Document (N) ──────────── (N) SharedDocument

KbFolder (1) ──────────── (N) KbArticle

Department (1) ─────────── (N) DepartmentMember
Department (1) ─────────── (N) Project

ApiKey (1) ─────────────── (N) ApiUsageLog
Webhook (1) ────────────── (N) WebhookDelivery

AuditLog (N) ───────────── (1) User [nullable — some are system events]
```

## Key Business Logic Rules

1. **A User can become a TaxProfessional** by submitting the 5-step application. Their `role` stays `USER` until approved; after approval it becomes `TAX_PRO`.
2. **A TaxProfessional manages Clients** through the `ClientRelationship` join table. One pro can have many clients; one client can have many pros (future: currently 1:1 per tax year).
3. **Documents belong to Users**, but can be shared with pros via `SharedDocument`. The client controls sharing via a toggle.
4. **CreditScore is recalculated** asynchronously whenever: a new document is processed, a tax filing changes status, or the monthly cron runs.
5. **ApiKeys** have a `keyHash` stored (never the raw key). The raw key is shown once at creation. A `lastFourChars` field enables masked display.
6. **AuditLog** is append-only. No deletes. System events have `userId = null` and `isSystem = true`.
7. **KbArticles** have two phases: content writing (markdown editor) and embedding (background worker sends content to OpenAI, stores vectors in Pinecone, updates `chunkCount`).

---

# DOC 08 — Product Requirements Document (PRD) {#doc-08}

## Product Vision

Creditax.ai is Nigeria's first AI-powered platform that bridges tax compliance and creditworthiness. Users who file taxes accurately and consistently build a credit history that unlocks access to formal lending.

## User Personas

### Persona 1: The Nigerian SME Owner (Primary B2C)
- **Name:** Emeka, 34, Lagos
- **Goal:** File taxes without a physical accountant, understand his liabilities
- **Pain:** Tax system is opaque; lenders won't give him credit without a formal credit score
- **Value from Creditax:** AI-guided filing + credit score built from tax history

### Persona 2: The Tax Professional (B2B)
- **Name:** Adaeze, 38, Lagos
- **Goal:** Manage 40+ clients, generate reports, verify credentials
- **Pain:** Manual processes, WhatsApp-based document collection, no dashboard
- **Value from Creditax:** Professional CRM with document processing and bulk tools

### Persona 3: The Developer (API)
- **Name:** Chidi, 27, Abuja
- **Goal:** Integrate tax calculations and credit scoring into his fintech app
- **Pain:** No clean Nigerian tax API exists
- **Value from Creditax:** REST API with SDKs, sandbox, webhooks

## Core Feature Modules

### Module 1: Consumer Tax Filing
**User Stories:**
- As a user, I want to upload my receipts so the AI can extract deductions automatically
- As a user, I want the wizard to guide me step-by-step through filing
- As a user, I want to see my estimated tax savings in real-time as I add deductions
- As a user, I want to receive an AI explanation of each deduction before confirming

**Acceptance Criteria:**
- Document uploads trigger OCR within 10 seconds
- Wizard has exactly 5 steps with persistent progress
- AI savings counter updates in < 500ms on checkbox change
- Final submission generates a PDF tax summary

### Module 2: Credit Scoring
**User Stories:**
- As a user, I want to see a numerical credit score based on my tax history
- As a user, I want to understand which factors contribute to my score
- As a user, I want to see my score history over 12 months
- As a user, I want the system to tell me exactly how to improve my score

**Acceptance Criteria:**
- Score range: 300–850 (VantageScore-style)
- Four contributing factors with point weights
- Score updated within 1 hour of filing status change
- Trend chart shows monthly snapshots for past 12 months

### Module 3: AI Tax Assistant (RAG)
**User Stories:**
- As a user, I want to ask any question about Nigerian tax law in plain English
- As a developer, I want to query the tax assistant via API

**Acceptance Criteria:**
- Responses cite specific FIRS documents and sections
- Response time < 3 seconds (95th percentile)
- Context window maintains last 10 messages per session
- Admin can add/update/re-embed KB articles

### Module 4: Tax Professional Portal
**User Stories:**
- As a pro, I want to manage all my clients in one dashboard
- As a pro, I want to run bulk tax calculations for multiple clients at once
- As a pro, I want to verify a client's CAC number and TIN via FIRS API
- As a pro, I want to generate and download PDF compliance reports

**Acceptance Criteria:**
- Client table supports 47+ clients with pagination
- Bulk calculations complete for 10 clients in < 30 seconds
- CAC/TIN verification returns results within 5 seconds
- Reports generate as PDF within 60 seconds

### Module 5: Marketplace
**User Stories:**
- As a user, I want to find a verified tax professional near me
- As a professional, I want to be listed on the marketplace with my services and prices
- As an admin, I want to approve/reject professional applications with document verification

**Acceptance Criteria:**
- Map shows professionals within 50km radius
- Professionals display verified CAC and FIRS badges only after admin approval
- User can contact pro via WhatsApp, email, or phone from the profile page
- Admin can approve/reject in < 5 clicks

### Module 6: Public API
**User Stories:**
- As a developer, I want to calculate Nigerian tax via a REST API
- As a developer, I want to receive webhooks when document processing completes
- As a developer, I want a sandbox environment to test without real data

**Acceptance Criteria:**
- API response time < 200ms for tax calculations (p95)
- Webhook delivery retried 3 times on failure with exponential backoff
- Sandbox environment completely isolated from production data
- SDKs available for Node.js and Python at launch

---

# DOC 09 — Design System Guide {#doc-09}

## Brand Tokens

```css
/* colors.css */
:root {
  /* Primary Palette */
  --color-bg-base:      #0A0F14;  /* Page background */
  --color-bg-elevated:  #0D1117;  /* Nav, sidebar, footer */
  --color-bg-card:      #111922;  /* Cards, panels */
  --color-bg-inset:     #0F161E;  /* Alternating table rows */

  /* Brand Colors */
  --color-teal:         #0D7377;  /* Primary brand, icons, borders */
  --color-teal-muted:   rgba(13,115,119,0.12); /* Card tint backgrounds */
  --color-green:        #32E875;  /* Primary CTA, success, accent */
  --color-green-muted:  rgba(50,232,117,0.12); /* Success tint */

  /* Semantic Colors */
  --color-error:        #EF4444;  /* Errors, danger, delete */
  --color-warning:      #F59E0B;  /* Warnings, pending, amber states */
  --color-info:         #3B82F6;  /* Informational states */
  --color-success:      #32E875;  /* Same as green */

  /* Typography */
  --color-text-primary:   #FFFFFF;
  --color-text-secondary: #8899AA;
  --color-text-muted:     #6B7A8D;
  --color-text-disabled:  #4A5568;

  /* Borders */
  --color-border:       rgba(255,255,255,0.07);
  --color-border-muted: rgba(255,255,255,0.04);
  --color-border-teal:  rgba(13,115,119,0.3);
  --color-border-green: rgba(50,232,117,0.3);
}
```

## Typography Scale

```css
/* typography.css — Font: Syne (Google Fonts) */
/* Code Font: JetBrains Mono */

.text-display  { font: 700 40px/1.2 'Syne', sans-serif; }
.text-h1       { font: 700 32px/1.25 'Syne', sans-serif; }
.text-h2       { font: 700 24px/1.3 'Syne', sans-serif; }
.text-h3       { font: 600 20px/1.35 'Syne', sans-serif; }
.text-h4       { font: 600 16px/1.4 'Syne', sans-serif; }
.text-body-lg  { font: 400 18px/1.7 'Syne', sans-serif; }
.text-body     { font: 400 15px/1.6 'Syne', sans-serif; }
.text-body-sm  { font: 400 13px/1.6 'Syne', sans-serif; }
.text-label    { font: 500 12px/1 'Syne', sans-serif; letter-spacing: 0.12em; text-transform: uppercase; }
.text-code     { font: 400 13px/1.7 'JetBrains Mono', monospace; }
```

## Tailwind Config Extension

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A0F14',
          elevated: '#0D1117',
          card: '#111922',
          inset: '#0F161E',
        },
        teal: { DEFAULT: '#0D7377', muted: 'rgba(13,115,119,0.12)' },
        green: { DEFAULT: '#32E875', muted: 'rgba(50,232,117,0.12)' },
      },
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        pill: '9999px',
      },
    },
  },
};
```

## Component Specifications

### Button Variants
```tsx
// Primary CTA
<Button className="bg-green text-bg-base font-semibold h-12 rounded-btn px-7">
  Get Early Access →
</Button>

// Secondary / Outline
<Button variant="outline" className="border-teal text-teal h-12 rounded-btn px-7">
  View API Docs
</Button>

// Ghost
<Button variant="ghost" className="text-white border border-white/15 h-12 rounded-btn">
  Cancel
</Button>

// Danger
<Button className="border border-red-500/60 text-red-400 h-10 rounded-btn">
  Delete Account
</Button>
```

### Card Variants
```tsx
// Standard card
<div className="bg-bg-card border border-white/[0.07] rounded-card p-7">

// Teal accent card (active/selected)
<div className="bg-bg-card border-l-4 border-l-teal rounded-card p-7 bg-teal/5">

// Green accent card (success/pro)
<div className="bg-bg-card border border-green/30 rounded-card p-7">

// Warning card
<div className="bg-bg-card border border-amber-500/25 rounded-card p-6">

// Danger zone card
<div className="bg-bg-card border border-red-500/20 rounded-card p-6">
```

### Status Badge System
```tsx
const badges = {
  active:     "bg-green/12 border border-green/30 text-green text-xs font-bold",
  pending:    "bg-amber-500/12 border border-amber-500/30 text-amber-400 text-xs font-bold",
  failed:     "bg-red-500/12 border border-red-500/30 text-red-400 text-xs font-bold",
  info:       "bg-blue-500/12 border border-blue-500/30 text-blue-400 text-xs font-bold",
  teal:       "bg-teal/12 border border-teal/30 text-teal text-xs font-bold",
};
```

### Score Gauge Component (SVG)
```tsx
// components/credit/ScoreGauge.tsx
export function ScoreGauge({ score, max = 850 }) {
  const pct = score / max;
  const r = 80; // radius
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - pct * 0.75); // 270° arc

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* Track */}
      <circle cx="100" cy="100" r={r} fill="none"
        stroke="#1E2A35" strokeWidth="16"
        strokeDasharray={circumference * 0.75}
        strokeLinecap="round"
        transform="rotate(135 100 100)" />
      {/* Fill — gradient from teal to green */}
      <circle cx="100" cy="100" r={r} fill="none"
        stroke="url(#scoreGradient)" strokeWidth="16"
        strokeDasharray={`${circumference * 0.75 * pct} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(135 100 100)" />
      <defs>
        <linearGradient id="scoreGradient">
          <stop offset="0%" stopColor="#0D7377" />
          <stop offset="100%" stopColor="#32E875" />
        </linearGradient>
      </defs>
      {/* Score text */}
      <text x="100" y="105" textAnchor="middle"
        fill="white" fontSize="36" fontFamily="Syne" fontWeight="700">
        {score}
      </text>
    </svg>
  );
}
```

### Toast Notification System
```tsx
// Four toast types — use with sonner or react-hot-toast
const toastStyles = {
  success: { border: '4px solid #32E875', icon: CheckCircle, color: '#32E875' },
  error:   { border: '4px solid #EF4444', icon: XCircle,     color: '#EF4444' },
  warning: { border: '4px solid #F59E0B', icon: AlertTriangle,color: '#F59E0B' },
  info:    { border: '4px solid #3B82F6', icon: Info,         color: '#3B82F6' },
};
```

### Spacing System
```
4px  — micro gap (icon to text)
8px  — tight (chip gap, small internal)
12px — compact (button padding small)
16px — base (card internal gap)
20px — comfortable (form field gap)
24px — section gap (card to card)
28px — card padding
32px — card padding large
40px — section padding
48px — page section gap
64px — major section gap
80px — hero padding
```

---

# DOC 10 — Data Flow & State Management {#doc-10}

## Client State Architecture

```
┌─────────────────────────────────────────────┐
│                  Next.js App                │
│                                             │
│  Server Components (RSC)                    │
│  └─ Fetch data on server (no waterfall)     │
│                                             │
│  Client Components                          │
│  └─ TanStack Query (server state cache)     │
│  └─ Zustand (ephemeral UI state)           │
│  └─ React Hook Form (form state)           │
└─────────────────────────────────────────────┘
```

## TanStack Query Key Structure

```typescript
// lib/query-keys.ts
export const queryKeys = {
  user:       () => ['user'],
  documents:  () => ['documents'],
  document:   (id: string) => ['document', id],
  credit:     () => ['credit-score'],
  filing:     (year: number) => ['tax-filing', year],
  clients:    () => ['clients'],
  client:     (id: string) => ['client', id],
  reports:    () => ['reports'],
  usage:      (period: string) => ['usage', period],
  apiKeys:    () => ['api-keys'],
  webhooks:   () => ['webhooks'],
};
```

## Zustand Stores

```typescript
// store/filing-store.ts — Tax wizard state
interface FilingStore {
  currentStep: number;
  grossIncome: number | null;
  selectedDeductions: Deduction[];
  totalDeductions: number;
  estimatedSavings: number;

  setStep: (step: number) => void;
  setIncome: (income: number) => void;
  toggleDeduction: (id: string) => void;
  reset: () => void;
}

// store/ui-store.ts — Global UI
interface UIStore {
  sidebarCollapsed: boolean;
  activeModal: string | null;
  setSidebarCollapsed: (v: boolean) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
}
```

## Document Processing Flow

```
User uploads file
       │
       ▼
POST /api/documents/upload
       │
       ▼
Store in Cloudflare R2 → Return presigned URL
       │
       ▼
Queue document in BullMQ (document-processing-queue)
       │
       ▼
document.worker.ts picks up job:
  1. Download from R2
  2. Send to AWS Textract
  3. Parse extracted data (amount, date, category)
  4. Classify category via GPT-4o mini
  5. Update Document in DB (status: EXTRACTED)
  6. Trigger webhook: document.processed
  7. Recalculate credit score (if high confidence)
       │
       ▼
Frontend invalidates ['documents'] query → UI updates
```

## Credit Score Calculation Flow

```
Trigger: Document processed / Filing submitted / Monthly cron
       │
       ▼
credit-score.service.ts:
  1. Fetch user's tax filings (on-time ratio)
  2. Fetch documents (consistency, count, recency)
  3. Fetch bank statements (income stability)
  4. Calculate factor scores (0-100 each)
  5. Weight and sum: filing(35%) + docs(25%) + income(25%) + savings(15%)
  6. Map to 300-850 range
  7. Snapshot score in history JSON
  8. Update CreditScore record
  9. Send notification if score changed ≥10 points
```

---

# DOC 11 — Security & Compliance {#doc-11}

## Security Requirements

### Data Encryption
- All data at rest: AES-256 encryption (Neon/Supabase managed)
- All data in transit: TLS 1.3 minimum
- Document files in R2: Server-side encryption enabled
- API keys: bcrypt hash stored, raw key shown once

### Authentication Security
- Magic link tokens expire in 15 minutes
- Session JWTs expire in 30 days (configurable)
- 2FA required for Admin and Super Admin roles
- Consecutive failed login attempts trigger account lock (5 attempts)
- All auth events logged in `audit_logs`

### API Security
```typescript
// Rate limiting per tier (per IP per minute)
const rateLimits = {
  free:       { requests: 60,    window: '1m' },
  pro:        { requests: 300,   window: '1m' },
  enterprise: { requests: 3000,  window: '1m' },
  sandbox:    { requests: 999999, window: '1m' }, // Unlimited
};

// CORS allowed origins
const allowedOrigins = [
  'https://creditax.ai',
  'https://app.creditax.ai',
  process.env.ALLOWED_ORIGINS, // Admin-configurable
];
```

### Webhook Security
- All webhook payloads signed with HMAC-SHA256
- Signature sent in `X-Creditax-Signature` header
- Consumer must verify signature before processing

### Input Validation
- All API inputs validated with Zod schemas
- SQL injection prevented via Prisma parameterized queries
- File uploads: type validation (PDF/JPG/PNG), max 10MB, virus scan via ClamAV
- XSS prevention: Content Security Policy headers set on all pages

## Nigerian Compliance

### NDPA (Nigeria Data Protection Act 2023)
- Data Processing Agreement displayed at signup
- Users can request data export (within 72 hours)
- Users can request data deletion (within 30 days)
- Data subject rights managed via Settings > Account > Delete Account

### FIRS Data Handling
- TIN and BVN data never stored permanently (verified then discarded)
- Tax calculation results stored but not shared with FIRS
- Certificate downloads watermarked with user email

### Financial Data
- No payment card data stored (Paystack handles PCI-DSS compliance)
- Bank account data from Mono: read-only OAuth scope, credentials never stored
- All financial figures stored as `Decimal` (PostgreSQL NUMERIC) to avoid float precision errors

---

# DOC 12 — Deployment & Infrastructure {#doc-12}

## Environment Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     DEV       │    │   STAGING    │    │  PRODUCTION  │
│  localhost    │    │ staging.     │    │ creditax.ai  │
│  :3000        │    │ creditax.ai  │    │              │
│               │    │              │    │              │
│  Local PG     │    │  Neon (dev)  │    │ Neon (prod)  │
│  Local Redis  │    │  Upstash     │    │ Upstash      │
│  Sandbox APIs │    │  Sandbox     │    │ Live APIs    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx prisma generate
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-cli@v2
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
      - run: railway up
```

## Database Migration Strategy

```bash
# Development workflow
npx prisma migrate dev --name "add_facility_table"

# Staging deployment
npx prisma migrate deploy

# Production (automated in CI)
npx prisma migrate deploy

# Emergency rollback
npx prisma migrate resolve --rolled-back "migration_name"
```

## Background Worker Setup

```typescript
// workers/document.worker.ts
import { Worker } from 'bullmq';
import { redis } from '../lib/redis';

const worker = new Worker('document-processing', async (job) => {
  const { documentId, fileUrl } = job.data;
  // 1. OCR → 2. Parse → 3. Classify → 4. Update DB → 5. Webhook
}, { connection: redis, concurrency: 5 });

worker.on('failed', (job, err) => {
  // Update document status to FAILED
  // Send error notification to user
});
```

## Monitoring Stack

```typescript
// Sentry — Error tracking
import * as Sentry from "@sentry/nextjs";
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });

// PostHog — Product analytics
import posthog from 'posthog-js';
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com',
  capture_pageview: true,
});

// BetterStack — Uptime monitoring
// Pings /api/health every 60 seconds
// Routes to statuspage at creditax.ai/status
```

## Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Time to First Byte (TTFB) | < 200ms | Vercel Edge |
| Largest Contentful Paint (LCP) | < 2.5s | Next.js Image |
| API response time (p95) | < 200ms | Railway |
| Document OCR processing | < 10s | BullMQ |
| Report generation | < 60s | BullMQ |
| RAG chat response | < 3s | OpenAI streaming |
| Database query (p99) | < 50ms | Prisma + indexes |

## Launch Checklist

```markdown
### Pre-Launch
- [ ] All 57 screens implemented and tested
- [ ] Database migrations run on production
- [ ] FIRS API credentials obtained and tested
- [ ] Mono Open Banking integration tested
- [ ] Paystack subscriptions configured
- [ ] Clerk production keys set
- [ ] All environment variables set in Vercel + Railway
- [ ] Sentry error tracking verified
- [ ] Uptime monitoring configured
- [ ] NDPA compliance reviewed by counsel
- [ ] Privacy Policy and Terms of Service live

### Security Pre-Launch
- [ ] Penetration test (basic)
- [ ] SQL injection scan
- [ ] XSS/CSRF headers verified
- [ ] API rate limiting tested
- [ ] File upload validation tested
- [ ] Admin route protection verified

### Performance Pre-Launch
- [ ] Lighthouse score > 85 on all key pages
- [ ] Database indexes verified (EXPLAIN ANALYZE)
- [ ] Image optimization (Next.js Image for all assets)
- [ ] Bundle size < 250KB initial JS
- [ ] Redis caching for tax brackets and WHT tables
```

---

> **Document Version:** 1.0 | **Platform:** Creditax.ai | **Scope:** Full 57-screen platform
> 
> These 12 documents form the complete technical foundation for solo developer implementation. Start with DOC 01 (tech stack), DOC 02 (folder structure), and DOC 03 (database schema) before building any feature. Use DOC 06 (route map) as your daily sprint reference.
