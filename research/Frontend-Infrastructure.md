# Creditax.ai — Frontend Architecture & Infrastructure

**Version:** 1.1
**Date:** June 12, 2026
**Status:** Research Complete

---

## Changelog

### v1.1 (June 12, 2026)
- Added B2C Consumer pages (tax filing, document upload, credit score)
- Added B2B Tax Professional Portal (verify, dashboard, client management)
- Added Tax Professional Marketplace
- Added Partner API onboarding flow
- Expanded auth flows for multi-user types

### v1.0 (June 12, 2026)
- Initial creation of Frontend Architecture document
- Research compiled from Stripe, Mono, Plaid, Linear, Vercel
- Covers all frontend pages, admin roles, auth layers, and infrastructure status pages

---

## Table of Contents

1. [Frontend Pages Scope](#1-frontend-pages-scope)
2. [B2C Consumer Portal](#2-b2c-consumer-portal)
3. [B2B Tax Professional Portal](#3-b2b-tax-professional-portal)
4. [Tax Professional Marketplace](#4-tax-professional-marketplace)
5. [Sign-up & Authentication](#5-sign-up--authentication)
6. [Admin Dashboards & Roles](#6-admin-dashboards--roles)
7. [Infrastructure Status Pages](#7-infrastructure-status-pages)
8. [Marketing Pages](#8-marketing-pages)
9. [Component Library](#9-component-library)
10. [Design Tokens](#10-design-tokens)

---

## 1. Frontend Pages Scope

### 1.1 Public Pages (No Auth Required)

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Marketing homepage |
| **Pricing** | `/pricing` | Subscription plans |
| **Docs** | `/docs` | API documentation |
| **Blog** | `/blog` | Company blog |
| **About** | `/about` | Company info |
| **Status** | `/status` | Service status page |
| **Marketplace** | `/marketplace` | Find verified tax professionals |

### 1.2 Authenticated User Pages (B2C Consumer)

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/dashboard` | User home after login |
| **Tax Filing** | `/dashboard/tax-filing` | Tax Q&A, calculations, filing |
| **Document Upload** | `/dashboard/upload` | Upload receipts, invoices |
| **My Documents** | `/dashboard/documents` | View uploaded documents |
| **Credit Score** | `/dashboard/credit` | View credit health score |
| **Reports** | `/dashboard/reports` | Generated tax summaries |
| **API Keys** | `/dashboard/keys` | Manage API keys |
| **Usage** | `/dashboard/usage` | Usage analytics |
| **Settings** | `/dashboard/settings` | Account settings |

### 1.3 Authenticated User Pages (B2B Tax Professional)

| Page | Route | Description |
|------|-------|-------------|
| **Pro Dashboard** | `/pro` | Tax professional home |
| **Client Management** | `/pro/clients` | Manage client accounts |
| **Client Documents** | `/pro/documents` | View client's uploaded docs |
| **Tax Calculations** | `/pro/calculations` | Run bulk calculations |
| **Client Reports** | `/pro/reports` | Generate client reports |
| **Verify Client** | `/pro/verify` | Verify client identity/TIN |
| **Pro Settings** | `/pro/settings` | Profile, branding settings |

### 1.4 Super Admin Pages

| Page | Route | Description |
|------|-------|-------------|
| **Admin Dashboard** | `/admin` | Super admin home |
| **Users** | `/admin/users` | User management |
| **Pro Users** | `/admin/professionals` | Tax professional management |
| **Knowledge Base** | `/admin/kb` | Markdown editor for docs |
| **Audit Log** | `/admin/audit` | All system changes |
| **Departments** | `/admin/departments` | Department management |
| **Facilities** | `/admin/facilities` | Live facility observation |
| **Marketplace Approvals** | `/admin/marketplace` | Approve verified professionals |
| **Settings** | `/admin/settings` | System settings |

### 1.5 Developer Portal

| Page | Route | Description |
|------|-------|-------------|
| **API Explorer** | `/developers` | Interactive API docs |
| **Quickstart** | `/developers/quickstart` | Integration guide |
| **Reference** | `/developers/reference` | Full API reference |
| **SDKs** | `/developers/sdks` | Client libraries |
| **Sandbox** | `/developers/sandbox` | Test environment |
| **Webhooks** | `/developers/webhooks` | Webhook management |

### 1.6 Super Admin Pages

| Page | Route | Description |
|------|-------|-------------|
| **Admin Dashboard** | `/admin` | Super admin home |
| **Users** | `/admin/users` | User management |
| **Pro Users** | `/admin/professionals` | Tax professional management |
| **Knowledge Base** | `/admin/kb` | Markdown editor for docs |
| **Audit Log** | `/admin/audit` | All system changes |
| **Departments** | `/admin/departments` | Department management |
| **Facilities** | `/admin/facilities` | Live facility observation |
| **Marketplace Approvals** | `/admin/marketplace` | Approve verified professionals |
| **Settings** | `/admin/settings` | System settings |

---

## 2. B2C Consumer Portal

**Vision:** "Tax assistant in your pocket" — consumer-friendly, approachable, builds trust. Think Netflix meets Duolingo for taxes. No intimidating jargon, just clear guidance.

### 2.1 Consumer Dashboard (`/dashboard`)

**Purpose:** Personal tax command center — see at a glance what needs attention.

```
Layout:
┌─────────────────────────────────────────┐
│ [Avatar] Welcome back, [Name]           │
│                                         │
│ ┌─────────────┐  ┌────────────────────┐│
│ │ Tax Health  │  │ Credit Score Card  ││
│ │ Score: 78   │  │ Score: 720  ▲ +15 ││
│ │ ● On Track  │  │ "Good" range       ││
│ └─────────────┘  └────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📋 Tax Filing Status                │ │
│ │ [===██████====] 60% complete        │ │
│ │ 3 documents needed                  │ │
│ │ [Upload Now]                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Recent Activity          Quick Actions  │
│ ├─ Receipt uploaded       [+ Upload Doc]│
│ ├─ Tax calc complete      [Ask Tax Bot] │
│ └─ Report generated       [View Reports]│
└─────────────────────────────────────────┘
```

**Key UI Principles:**
- Non-threatening, gamified progress indicators
- "Tax Health Score" (0-100) — simple, actionable
- Clear CTAs without financial jargon
- Mobile-first responsive design

### 2.2 Tax Filing Interface (`/dashboard/tax-filing`)

**Purpose:** Guided tax filing with AI assistance.

```
Layout:
┌─────────────────────────────────────────┐
│ Tax Filing 2025                    [?] │
│                                         │
│ Step 3: Review Deductions               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💬 "Based on your uploaded receipts,│ │
│ │    I found ₦2.4M in deductible      │ │
│ │    expenses. Want me to add these?" │ │
│ │                                     │ │
│ │ ├─ Office Supplies    ₦45,000    ✓ │ │
│ │ ├─ Transportation    ₦120,000    ✓ │ │
│ │ └─ Equipment         ₦380,000    ✓ │ │
│ │                                     │ │
│ │ [Add to Filing] [Edit] [Dismiss]   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Running Total Deductions            │ │
│ │ ₦2,450,000                          │ │
│ │                                     │ │
│ │ Estimated Tax Savings: ₦612,500     │ │
│ │ (Based on 25% bracket)              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [< Back]              [Continue >]      │
└─────────────────────────────────────────┘
```

**Key UI Principles:**
- Conversational AI chat interface for guidance
- Step-by-step wizard with progress bar
- Real-time calculations as user makes decisions
- Plain language explanations on hover/tap

### 2.3 Document Upload (`/dashboard/upload`)

**Purpose:** Frictionless receipt/invoice capture — camera-first, drag-drop on desktop.

```
Layout:
┌─────────────────────────────────────────┐
│ Upload Documents                    [?] │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │     📷                               │ │
│ │                                     │ │
│ │  Drag & drop files here             │ │
│ │  or tap to capture                  │ │
│ │                                     │ │
│ │  Supports: JPG, PNG, PDF            │ │
│ │  Max 10MB per file                  │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Recent Uploads                          │
│ ┌─────────────────────────────────────┐ │
│ │ receipt_kitchen_001.jpg             │ │
│ │ ✓ Extracted: ₦45,000 | Office supp  │ │
│ │ [View] [Delete]                     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ invoice_tech_store.pdf              │ │
│ │ ⏳ Processing...                    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key UI Principles:**
- Camera capture with auto-crop assistance
- Drag-drop zone for desktop
- Real-time OCR preview with editable fields
- Clear processing states (pending → extracting → confirmed)

### 2.4 Credit Score View (`/dashboard/credit`)

**Purpose:** Show credit health based on tax compliance — simple, transparent, educational.

```
Layout:
┌─────────────────────────────────────────┐
│ Your Credit Health                  [?] │
│                                         │
│        ┌─────────────────┐              │
│        │                 │              │
│        │      720        │              │
│        │    ● Good       │              │
│        │                 │              │
│        └─────────────────┘              │
│                                         │
│ What This Means:                        │
│ "Your tax compliance history and        │
│ financial behavior indicate you're      │
│ a responsible borrower."                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Score Factors                       │ │
│ │ ├─ Tax Filing History    +45 pts    │ │
│ │ ├─ Document Consistency  +30 pts    │ │
│ │ ├─ Income Stability      +25 pts    │ │
│ │ └─ Savings Pattern       +20 pts    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [How to Improve]  [View Full Report]    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💡 "Filing your 2024 returns could  │ │
│ │    boost your score by 20+ points"  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key UI Principles:**
- Large, simple score display (no FICO complexity)
- Factor breakdown with +/- impact
- Educational tooltips explaining each factor
- Actionable improvement suggestions

### 2.5 B2C Unique Features

| Feature | Description |
|---------|-------------|
| **Tax Health Score** | Simple 0-100 score based on filing consistency, document uploads, compliance |
| **AI Tax Chat** | Conversational interface for tax questions (RAG-powered) |
| **Push Reminders** | "Hey, your tax deadline is in 30 days" via email/push |
| **Progress Gamification** | Badges for completing filing steps, streaks for consistent uploads |
| **Credit Simulator** | "What if I file my taxes? → See potential score improvement" |
| **Multi-language** | Support for English, Yoruba, Hausa, Igbo (Phase 2) |

---

## 3. B2B Tax Professional Portal

**Vision:** "Practice management for tax professionals" — efficient, professional, trust-building. Like Slack meets Zoom for tax work.

### 3.1 Tax Pro Dashboard (`/pro`)

**Purpose:** Overview of all client work, revenue, and compliance status.

```
Layout:
┌──────────────────────────────────────────────────┐
│ [Logo] Creditax Pro          [Notifications] [⚙]│
│                                                  │
│ Good morning, [Name]                             │
│ You have [12] active clients                     │
│                                                  │
│ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │
│ │ Revenue    │ │ Pending    │ │ Compliance    │ │
│ │ ₦2.4M mo   │ │ Tasks: 8   │ │ Rate: 94%     │ │
│ │ ▲ 12%      │ │ [View]     │ │ [Details]     │ │
│ └────────────┘ └────────────┘ └────────────────┘ │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Upcoming Deadlines                           ││
│ │ ├─ Ajo Investment — TIN Renewal    Due Jun 30││
│ │ ├─ GreenLeaf Ltd — VAT Filing      Due Jun 25││
│ │ └─ TechStart Inc — Audit Prep      Due Jul 05││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ Client Activity                Quick Actions     │
│ ├─ 3 new document uploads     [+ Add Client]    │
│ ├─ 2 report requests          [+ Bulk Calc]     │
│ └─ 1 compliance alert         [View All Tasks]  │
└──────────────────────────────────────────────────┘
```

**Key UI Principles:**
- Professional, dashboard-dense (accountants want data)
- Color-coded deadlines and alerts
- Revenue tracking visible
- Bulk action support (select multiple clients)

### 3.2 Client Management (`/pro/clients`)

**Purpose:** Full client list with search, filter, and bulk operations.

```
Layout:
┌──────────────────────────────────────────────────┐
│ Clients (47)              [+ Add Client] [Export]│
│ [Search...] [Filter ▼] [Status ▼]                │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ ☐ Ajo Investment Limited                     ││
│ │   CAC: BN-123456   TIN: 12345678-0001       ││
│ │   Status: Active   Compliance: ● 94%        ││
│ │   Last Activity: 2 hours ago                ││
│ │   [View] [Documents] [Reports] [Edit]       ││
│ └──────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────┐│
│ │ ☐ GreenLeaf Consulting                      ││
│ │   CAC: BN-789012   TIN: 98765432-0002       ││
│ │   Status: Active   Compliance: ● 87%        ││
│ │   Last Activity: 1 day ago                  ││
│ │   [View] [Documents] [Reports] [Edit]       ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ Showing 1-10 of 47           [< 1 2 3 4 5 >]    │
└──────────────────────────────────────────────────┘
```

**Key UI Principles:**
- Spreadsheet-like table for power users
- Bulk selection for batch operations
- Export to CSV/Excel
- Quick filters (status, compliance score, last activity)

### 3.3 Client Detail View (`/pro/clients/[id]`)

**Purpose:** Deep-dive into individual client — documents, filings, compliance history.

```
Layout:
┌──────────────────────────────────────────────────┐
│ ← Back to Clients                                │
│                                                  │
│ ┌──────────────────┐  ┌────────────────────────┐│
│ │ GreenLeaf Consul │  │ Compliance Score       ││
│ │ CAC: BN-789012   │  │ ● 87%                  ││
│ │ TIN: 98765432-2  │  │ ████████░░ Good        ││
│ │ Industry: Tech   │  └────────────────────────┘│
│ │ Since: Jan 2025  │                            │
│ └──────────────────┘                            │
│                                                  │
│ Tabs: [Overview] [Documents] [Filings] [Reports]│
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Documents (23)                               ││
│ │                                              ││
│ │ Filter: [All ▼] [Receipts] [Invoices] [Forms]││
│ │                                              ││
│ │ ┌──────────────────────────────────────────┐ ││
│ │ │ receipt_office_jan.pdf                    │ ││
│ │ │ ₦45,000 | Office Supplies | Jan 15      │ ││
│ │ │ Status: ● Verified                        │ ││
│ │ │ [View] [Delete]                           │ ││
│ │ └──────────────────────────────────────────┘ ││
│ └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### 3.4 Bulk Tax Calculations (`/pro/calculations`)

**Purpose:** Run tax calculations across multiple clients at once.

```
Layout:
┌──────────────────────────────────────────────────┐
│ Bulk Calculations                                │
│                                                  │
│ Select Calculation Type:                         │
│ [Income Tax ▼]                                   │
│                                                  │
│ Select Clients:                                  │
│ ☑ Ajo Investment (12 employees)                  │
│ ☑ GreenLeaf Consulting (5 employees)             │
│ ☑ TechStart Inc (28 employees)                   │
│ ☐ Diamond Ventures (3 employees)                 │
│ [Select All] [Clear Selection]                   │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Fiscal Year: [2025 ▼]                        ││
│ │ Calculation Mode: [Standard ▼]                ││
│ │                                              ││
│ │ [Run Calculations]                           ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ Results (3 selected)                             │
│ ┌──────────────────────────────────────────────┐│
│ │ Ajo Investment: ₦4,520,000 estimated tax     ││
│ │ GreenLeaf Consult: ₦1,890,000 estimated tax  ││
│ │ TechStart Inc: ₦8,240,000 estimated tax      ││
│ │                                              ││
│ │ Total Estimated: ₦14,650,000                 ││
│ │                                              ││
│ │ [Export All] [Generate Reports]              ││
│ └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### 3.5 Client Verification (`/pro/verify`)

**Purpose:** Verify client identity and tax compliance status via TIN/BVN lookup.

```
Layout:
┌──────────────────────────────────────────────────┐
│ Verify Client                                    │
│                                                  │
│ Verification Type:                               │
│ ○ TIN Verification (Company)                     │
│ ○ BVN Verification (Individual)                  │
│ ○ Tax Compliance Certificate                     │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Enter TIN: [________________________]        ││
│ │                                              ││
│ │ [Verify TIN]                                 ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Verification Result                          ││
│ │                                              ││
│ │ Company: GreenLeaf Consulting Ltd            ││
│ │ TIN: 98765432-0002                           ││
│ │ Status: ● Active                             ││
│ │ Last Filing: March 2025                      ││
│ │ Compliance Rate: 94%                         ││
│ │                                              ││
│ │ [Download Certificate] [Save to Client]     ││
│ └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### 3.6 B2B Unique Features

| Feature | Description |
|---------|-------------|
| **Multi-client Management** | Dashboard with all clients, bulk operations |
| **Client Document Portal** | Shared view for documents — pro uploads, client views |
| **Bulk Calculations** | Run tax calc on 10+ clients simultaneously |
| **TIN/BVN Verification** | Real-time verification via API (Mono/Okra) |
| **Compliance Tracking** | Per-client compliance scores, deadline alerts |
| **White-label Reports** | Pro-branded reports for clients |
| **Sub-account Support** | Pro can create sub-accounts for junior staff |

---

## 4. Tax Professional Marketplace

**Vision:** "Airbnb for tax professionals" — trust through verification, discovery through filtering, co-location search. Credible, verified tax players only.

**Key Innovation:** Integration with RAG for natural language queries ("I need a VAT expert near Lagos Island") combined with API-based CAC verification and geolocation.

### 4.1 Marketplace Landing (`/marketplace`)

**Purpose:** Public page where consumers find verified tax professionals via search, filters, or natural language.

```
Layout:
┌──────────────────────────────────────────────────┐
│                                                  │
│     Find a Trusted Tax Professional              │
│     ─────────────────────────────────            │
│     Verified experts ready to help with          │
│     your taxes, audits & compliance              │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ 🔍 "I need help with VAT filing in Lagos"   ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│     [Search]  [Use my location 📍]              │
│                                                  │
│     ─── OR browse by service ───                │
│     [Personal Income Tax] [Business Tax]         │
│     [VAT Filing] [Audit Support]                │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Filters:                                     ││
│ │ Service Type  [All ▼]   Location  [Lagos ▼] ││
│ │ Rating         [4+ ★]    Price    [₦₦-₦₦₦₦] ││
│ │ [✓ Verified only]  [✓ Near me]              ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ ┌─────────────┐  ┌─────────────────────────────┐│
│ │   🗺️ Map    │  │ Results (12 found)         ││
│ │   View      │  │                             ││
│ │             │  │ ┌─────────────────────────┐││
│ │   [Marker]  │  │ │ 1. Akinwale & Associates│││
│ │   [Marker]  │  │ │ 📍 2.3km | ⭐4.8       ││
│ │   [Marker]  │  │ │ ₦75,000 - VAT Filing   ││
│ │             │  │ └─────────────────────────┘││
│ │   [Marker]  │  │ ┌─────────────────────────┐││
│ │             │  │ │ 2. GreenLeaf Tax        │││
│ └─────────────┘  │ │ 📍 4.1km | ⭐4.6       ││
│                  │ │ ₦60,000 - VAT Filing   ││
│                  │ └─────────────────────────┘│
│                  └─────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### 4.2 Verification Flow (API + Document)

**Purpose:** When a tax pro signs up, we verify their business via Mono Lookup API and document upload before listing.

```
┌──────────────────────────────────────────────────┐
│              Tax Pro Signup Flow                 │
│                                                  │
│  ┌─────────────┐     ┌─────────────┐            │
│  │   Step 1    │────▶│   Step 2    │            │
│  │ Basic Info  │     │ CAC Verify  │            │
│  └─────────────┘     └─────────────┘            │
│        │                   │                    │
│        │                   ▼                    │
│        │            ┌─────────────┐             │
│        │            │ Mono Lookup │             │
│        │            │    API      │             │
│        │            └─────────────┘             │
│        │                   │                    │
│        │                   ▼                    │
│        │            ┌─────────────┐             │
│        │            │ CAC Cert    │             │
│        │            │  Upload     │             │
│        │            └─────────────┘             │
│        │                   │                    │
│        ▼                   ▼                    │
│  ┌─────────────┐     ┌─────────────┐            │
│  │   Step 3    │────▶│   Step 4    │            │
│  │  Location   │     │  Admin      │            │
│  │  & Contact  │     │  Review     │            │
│  └─────────────┘     └─────────────┘            │
│                              │                   │
│                              ▼                   │
│                       ┌─────────────┐            │
│                       │ ✓ Verified  │            │
│                       │ → Listed    │            │
│                       └─────────────┘            │
└──────────────────────────────────────────────────┘
```

**Step-by-step:**

1. **Basic Info** — Business name, owner, services offered
2. **CAC Verification** — Enter CAC number → Mono Lookup API validates → upload CAC certificate PDF
3. **Location & Contact** — Address entry → Mapbox geocodes to lat/lng → phone, email, website
4. **Admin Review** — Super admin sees verification status → approves/rejects

### 4.3 Natural Language Search (RAG Integration)

**Purpose:** When users ask questions in the RAG chat, we can recommend tax pros if intent matches.

```
User: "I need someone to help me file my business VAT returns. 
       I'm on Lagos Island."

AI Response (RAG):
─────────────────────────────────────────────────
For VAT filing help in Lagos Island, I found these
verified tax professionals near you:

┌─────────────────────────────────────────────────┐
│ 1. 🏢 Akinwale & Associates                    │
│    📍 Lagos Island | 📍 2.3 km away            │
│    ⭐ 4.8 (127 reviews)                        │
│    💰 Starting from ₦75,000                    │
│    🏷️ Services: VAT Filing, Income Tax         │
│                                                 │
│    📞 08012345678  📧 akin@taxpro.com          │
│    [Call] [WhatsApp] [View Profile]           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 2. 🏢 GreenLeaf Tax Services                   │
│    📍 Victoria Island | 📍 3.8 km away         │
│    ⭐ 4.6 (89 reviews)                         │
│    💰 Starting from ₦60,000                    │
│    🏷️ Services: VAT Filing, Audit Support      │
│                                                 │
│    📞 08098765432  📧 info@greenleaf.com       │
│    [Call] [WhatsApp] [View Profile]           │
└─────────────────────────────────────────────────┘

Would you like me to help you request a consultation
with either of these professionals?
──────────────────────────────────────────────────

Actions: [Request Consultation] [Show More] [Start Over]
```

### 4.4 Professional Profile Card

**Purpose:** Trust-building card showing verification, services, reviews, contact options.

```
┌──────────────────────────────────────────────────┐
│ ┌──────┐  Akinwale & Associates Tax Services    │
│ │ [PH] │  ● Verified CAC  ● FIRS Registered    │
│ └──────┘  📍 Lagos Island | 📍 2.3km away       │
│                                                  │
│ ⭐⭐⭐⭐⭐ 4.8 (127 reviews) | 8 years exp       │
│                                                  │
│ Services: Personal Tax | VAT | Audit Support    │
│                                                  │
│ 💰 ₦50,000 - ₦500,000                           │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Contact Options:                             ││
│ │ 📞 08012345678  [Call]                      ││
│ │ 📧 akin@taxpro.com  [Email]                 ││
│ │ 💬 08012345678   [WhatsApp]                 ││
│ │ 🌐 www.akinwaletax.com [Website]            ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ [View Full Profile] [Request Consultation]      │
└──────────────────────────────────────────────────┘
```

### 4.5 Professional Detail Page (`/marketplace/[slug]`)

**Purpose:** Full profile with credentials, reviews, services, map, contact options.

```
Layout:
┌──────────────────────────────────────────────────┐
│ ← Back to Search                    [Share] [📌] │
│                                                  │
│ ┌──────┐  Akinwale & Associates                 │
│ │ [PH] │  ● Verified CAC  ● FIRS Registered    │
│ │  📍  │  Lagos Island, Nigeria                 │
│ └──────┘  📍 2.3km from you                     │
│                                                  │
│ ⭐⭐⭐⭐⭐ 4.8 (127 reviews) | Member since 2022  │
│                                                  │
│ ─── Location ─────────────────────────────────── │
│                                                  │
│         🗺️                                       │
│      [Map with marker]                          │
│      Lagos Island, Lagos                        │
│                                                  │
│ ─── About ──────────────────────────────────────│
│                                                  │
│ Professional tax services for individuals and   │
│ businesses. Specializing in VAT, income tax,    │
│ and FIRS compliance. Former FIRS officer with   │
│ 8+ years of experience.                         │
│                                                  │
│ ─── Services & Pricing ─────────────────────────│
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ Service               Turnaround   Price     ││
│ │ Personal Income Tax   3 days      ₦50,000    ││
│ │ Business Tax Filing   5 days     ₦150,000    ││
│ │ VAT Return            2 days      ₦75,000    ││
│ │ Tax Audit Support     7 days     ₦500,000    ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ ─── Contact ────────────────────────────────────│
│                                                  │
│ 📞 08012345678   [Call Now]                    │
│ 📧 akin@taxpro.com   [Send Email]              │
│ 💬 08012345678   [WhatsApp]                    │
│ 🌐 www.akinwaletax.com [Visit Website]         │
│                                                  │
│ ─── Reviews (127) ──────────────────────────────│
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ "Akinwale made my tax filing so easy..."     ││
│ │ — Chinedu A., Lagos  ⭐⭐⭐⭐⭐  2 weeks ago   ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ [Request Consultation]                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.6 Pro Application Flow (`/pro/apply`)

**Purpose:** Onboarding flow for tax professionals with API verification.

```
Step 1: Basic Info
┌──────────────────────────────────────────────┐
│ Business Name: [___________________________]  │
│ Owner Name: [______________________________]  │
│ CAC Reg Number: [________] [Verify via API]  │
│                   ✓ Verified! GreenLeaf Ltd   │
│ FIRS TIN: [_______________] (optional)       │
│ Years of Experience: [8 ▼]                   │
└──────────────────────────────────────────────┘

Step 2: Services
┌──────────────────────────────────────────────┐
│ Services offered (check all):                │
│ ☑ Personal Income Tax                        │
│ ☑ Business Tax Filing                        │
│ ☑ VAT Returns                                │
│ ☑ Tax Audit Support                          │
│                                              │
│ Price Range:                                 │
│ Min: [₦50,000] Max: [₦500,000]              │
│                                              │
│ Description (for RAG search):                │
│ [_________________________________           │
│  Professional tax services for individuals   │
│  and businesses...]                          │
└──────────────────────────────────────────────┘

Step 3: Location
┌──────────────────────────────────────────────┐
│ Business Address:                            │
│ [15 Admiralty Way, Lekki Phase 1, Lagos__]  │
│                                              │
│ 📍 Location detected: Lekki, Lagos           │
│    [Adjust on map if needed]                 │
│                                              │
│ City: [Lagos ▼]  State: [Lagos ▼]           │
└──────────────────────────────────────────────┘

Step 4: Contact
┌──────────────────────────────────────────────┐
│ Phone: [+234_______________]                 │
│ Email: [____________________]                │
│ WhatsApp: [+234____________] (optional)      │
│ Website: [________________] (optional)       │
└──────────────────────────────────────────────┘

Step 5: Verification Documents
┌──────────────────────────────────────────────┐
│ Upload required documents:                   │
│                                              │
│ ☑ CAC Certificate (PDF)                     │
│   [cac_certificate.pdf] ✓ Uploaded           │
│                                              │
│ ☑ FIRS Certificate (PDF)                    │
│   [firscert.pdf] ✓ Uploaded                  │
│                                              │
│ ☐ Valid ID (Passport/NIN/Driver License)    │
│   [id_card.pdf] ✓ Uploaded                   │
│                                              │
│ [Submit Application]                         │
└──────────────────────────────────────────────┘
```

### 4.7 Marketplace Features

| Feature | Implementation |
|---------|----------------|
| **API Verification** | Mono Lookup API for CAC number validation |
| **Document Verification** | CAC + FIRS certificate upload |
| **Geolocation Search** | Mapbox geocoding + PostGIS proximity |
| **Map View** | Mapbox GL JS with markers |
| **"Near Me"** | Browser geolocation API + distance sort |
| **RAG Integration** | Dual-index search (semantic + geographic) |
| **Contact Discovery** | Click-to-call, WhatsApp, email links |
| **Admin Approval** | Super admin queue in `/admin/marketplace` |
| **Slug URLs** | SEO-friendly profiles: `/marketplace/akinwale-associates` |
| **Share/Bookmark** | Share profile link, save to favorites |

---

## 5. Sign-up & Authentication

### 5.1 Sign-up Options

Based on research from Stripe, Mono, Plaid:

**Primary Sign-up Methods:**

```
1. Email Magic Link (Recommended for MVP)
   - User enters email → receives code/link → auto-login
   - No password required
   - Simplest flow

2. Google Sign-up
   - One-click OAuth
   - Fastest onboarding

3. GitHub Sign-up (optional, for developer audience)
   - Useful if targeting developer users
```

**Sign-up Flow (Magic Link):**

```
/signup
  └── Enter email
        ↓
  [Send magic link button]
        ↓
  "Check your email" screen with resend option
        ↓
  User clicks link → redirected to /dashboard
```

### 2.2 Login Flow

```
/login
  └── Enter email
        ↓
  [Send link button]
        ↓
  User clicks email link → auto-login → /dashboard
```

### 2.3 Auth Implementation

**Stack:**

- **Supabase Auth** — handles magic link, OAuth, session management
- **Protected Routes** — middleware to check auth state
- **Role-based Access** — user role stored in `users` table

**Auth Pages:**

| Page | Route |
|------|-------|
| Login | `/login` |
| Signup | `/signup` |
| Forgot Password | `/forgot-password` |
| Reset Password | `/reset-password` |

---

## 6. Admin Dashboards & Roles

### 6.1 User Roles

```
1. SUPER_ADMIN
   - Full system access
   - Manage knowledge base
   - View audit logs
   - Manage users
   - Manage marketplace approvals
   - System settings

2. ADMIN
   - Manage their organization
   - View usage
   - Manage team members
   - Cannot access other orgs

3. USER
   - Access own dashboard
   - Manage API keys
   - View own usage
   - Chat with RAG
   - Upload documents
```

### 6.2 Super Admin Dashboard Features

**Dashboard Overview:**

- System health metrics
- Active users count
- API usage summary
- Recent activity feed
- Alerts/warnings

**Knowledge Base Editor (`/admin/kb`):**

```
Features:
├── Document tree (sidebar)
├── Markdown editor (main area)
├── Preview toggle
├── Publish/Unpublish
├── Version history
├── Re-embed button
└── Audit trail (who changed what)
```

**User Management (`/admin/users`):**

```
Features:
├── User list with search/filter
├── View user details
├── Suspend/activate account
├── Reset API keys
├── View usage history
└── Change user role
```

**Audit Log (`/admin/audit`):**

```
Features:
├── All system changes
├── Filter by user, action, date
├── User column → click to view user
├── Action types: CREATE, UPDATE, DELETE
├── Timestamp
└── IP address tracking
```

### 3.3 Admin Navigation

```
Sidebar (collapsible):
├── Dashboard
├── Users
├── Knowledge Base
│   ├── VAT
│   ├── Income Tax
│   ├── WHT
│   └── ...
├── Departments
├── Facilities
├── Audit Log
└── Settings
```

---

## 7. Infrastructure Status Pages

### 7.1 Status Page Structure

Based on Stripe's status page:

```
/status
  └── Service list with indicators:
      ├── API (Operational/Degraded/Down)
      ├── RAG Chat (Operational/Degraded/Down)
      ├── Document Processing
      ├── Auth System
      └── Status History (last 90 days)
```

### 7.2 Status Indicators

| Status | Color | Meaning |
|--------|-------|---------|
| 🟢 Operational | Green | All systems go |
| 🟡 Degraded | Yellow | Partial issues |
| 🔴 Down | Red | Service unavailable |
| 🟠 Maintenance | Orange | Scheduled downtime |

### 7.3 Incident Response

```
If service degrades/down:
1. Show incident banner on frontend
2. Create status page incident
3. Auto-update every 15 mins
4. Notify users when resolved
```

---

## 8. Marketing Pages

### 8.1 Landing Page Structure

Based on Stripe, Mono, Plaid research:

**Hero Section:**

```
Headline: [Value prop]
Subheadline: [Supporting text]
CTA: [Get Started] [Talk to Sales]
Stats: X customers, Y transactions
```

**Features Section:**

```
Grid of 3-6 feature cards
Each with:
- Icon
- Title
- Short description
```

**Social Proof:**

```
"Trusted by" logos
Customer testimonials
Case study links
```

**Pricing Preview:**

```
Free tier highlight
Pro/Enterprise tiers
CTA to pricing page
```

### 5.2 Navigation Structure

```
Header (sticky):
├── Logo
├── Product (dropdown)
├── Solutions
├── Pricing
├── Docs
├── Blog
└── Login / Get Started

Footer:
├── Product links
├── Company links
├── Legal links
└── Social links
```

### 5.3 Pricing Page

```
Tiers:
├── Free
│   - X requests/month
│   - Basic features
│   - Community support
│
├── Pro ($X/month)
│   - Unlimited requests
│   - Advanced features
│   - Priority support
│
└── Enterprise (Contact sales)
    - Custom limits
    - Dedicated support
    - SLA
```

---

## 9. Component Library

### 9.1 Core Components

Based on Linear and Stripe research:

**Navigation:**

- `Sidebar` — Collapsible admin sidebar
- `TopNav` — Main navigation bar
- `Breadcrumb` — Page hierarchy
- `Tabs` — In-page navigation

**Data Display:**

- `Table` — Sortable, filterable data table
- `Card` — Content container
- `StatsCard` — Metric display with trend
- `Badge` — Status indicators
- `Avatar` — User profile images

**Forms:**

- `Input` — Text input with label, error
- `Select` — Dropdown select
- `Button` — Primary, secondary, ghost variants
- `Checkbox` / `Radio`
- `Toggle` — Boolean switch

**Feedback:**

- `Toast` — Notification popup
- `Modal` — Dialog overlay
- `Alert` — Inline warning/info
- `Spinner` — Loading indicator
- `Progress` — Progress bar

**Layout:**

- `Container` — Max-width wrapper
- `Grid` — Responsive grid system
- `Stack` — Vertical/horizontal stack
- `Divider` — Section separator

### 9.2 Specialized Components

**Admin-specific:**

- `DataTable` — With pagination, search, filters
- `TreeView` — Knowledge base document tree
- `MarkdownEditor` — Rich markdown editing
- `AuditLogEntry` — Change history display

**Dashboard-specific:**

- `MetricCard` — Single stat display
- `Chart` — Usage/analytics charts
- `ActivityFeed` — Recent actions list
- `ApiKeyCard` — API key display with copy

---

## 10. Design Tokens

Based on Brand Guidelines:

### 10.1 Colors

```css
:root {
  /* Primary */
  --color-primary: #0D7377;        /* Deep Teal */
  --color-accent: #32E875;         /* Bright Green */

  /* Background */
  --color-bg-dark: #0A0F14;        /* Dark BG */
  --color-bg-light: #F4F9F9;       /* Light BG */
  --color-bg-card: #111922;        /* Card BG (dark mode) */

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #8899A6;
  --color-text-muted: #657786;

  /* Status */
  --color-success: #32E875;
  --color-warning: #FFAD1F;
  --color-error: #E02432;
  --color-info: #1DA1F2;

  /* Border */
  --color-border: #38444D;
  --color-border-light: #E1E8ED;
}
```

### 10.2 Typography

```css
/* Primary: Inter */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Mono: JetBrains Mono */
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
```

### 10.3 Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 10.4 Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

---

## Implementation Priority

### Phase 1 (MVP) — Must Have

**B2C Consumer:**
- [ ] `/` — Landing page
- [ ] `/login` — Magic link login
- [ ] `/signup` — Magic link signup
- [ ] `/dashboard` — User dashboard
- [ ] `/dashboard/tax-filing` — Tax Q&A + calculations
- [ ] `/dashboard/upload` — Document upload
- [ ] `/status` — Infrastructure status

**Admin:**
- [ ] `/admin/kb` — Knowledge base editor
- [ ] `/admin/marketplace` — Marketplace approval queue

### Phase 2 — Important

**B2C Consumer:**
- [ ] `/dashboard/credit` — Credit health score view
- [ ] `/dashboard/documents` — Document management
- [ ] `/dashboard/reports` — Report generation
- [ ] `/dashboard/usage` — Usage analytics
- [ ] `/dashboard/settings` — Account settings

**B2B Tax Professional:**
- [ ] `/pro` — Tax pro dashboard
- [ ] `/pro/clients` — Client management
- [ ] `/pro/verify` — TIN/BVN verification

**Admin:**
- [ ] `/admin/users` — User management
- [ ] `/admin/audit` — Audit log
- [ ] `/admin/professionals` — Tax pro management

**Developer Portal:**
- [ ] `/developers` — API docs portal
- [ ] `/developers/quickstart` — Integration guide
- [ ] `/pricing` — Pricing page

### Phase 3 — Nice to Have

**B2B Tax Professional:**
- [ ] `/pro/documents` — Client document portal
- [ ] `/pro/calculations` — Bulk tax calculations
- [ ] `/pro/reports` — Client report generation
- [ ] `/pro/apply` — Marketplace application flow

**Marketplace:**
- [ ] `/marketplace` — Public marketplace listing
- [ ] `/marketplace/[slug]` — Professional profile pages
- [ ] `/pro/settings` — Pro profile/branding settings

**Admin:**
- [ ] `/admin/departments` — Department management
- [ ] `/admin/facilities` — Facility status observation

**B2C Enhancements:**
- [ ] Push notification reminders
- [ ] Multi-language support (Yoruba, Hausa, Igbo)
- [ ] Gamification (badges, streaks)
- [ ] Credit simulator

---

## Reference Companies Researched

| Company | What to Learn |
|---------|---------------|
| **Stripe** | Clean marketing, simple auth, status page |
| **Mono** | Nigerian market, fintech product cards |
| **Plaid** | Auth flows, developer docs structure |
| **Linear** | Dark mode admin, sidebar nav, inbox concept |
| **Vercel** | Minimal auth, clean dashboard |
| **Uber** | Dual-side marketplace (driver/rider) |
| **Airbnb** | Trust through verification, professional profiles |

---

*Document Version: 1.1*
*Last Updated: June 12, 2026*