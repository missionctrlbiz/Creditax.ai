# Creditax.ai — Complete Screen Architecture & Content Specification

> A full text-based breakdown of every screen in the Creditax.ai platform, organized by site architecture. For each screen: layout description, all text content, every link, all components, and every interactive element. Use this as the source of truth for development handoff.

---

## DOCUMENT INDEX

| Section | Screens | Count |
|---------|---------|-------|
| [A — Marketing & Public Pages](#section-a) | Landing, Features, Pricing, About, Blog, Status, Marketplace, Pro Profile, API Docs | 9 |
| [B — Authentication](#section-b) | Login, Signup | 2 |
| [C — Consumer Dashboard](#section-c) | Dashboard, Credit, Filing Wizard, Upload, Documents, Reports, Settings, API Keys, Usage, Empty States, Onboarding | 15 |
| [D — Tax Professional Portal](#section-d) | Pro Dashboard, Clients, Client Detail, Client Docs, Bulk Calc, Reports, Verify, Settings, Application (5 steps) | 11 |
| [E — Admin Panel](#section-e) | Dashboard, Users, Professionals, Marketplace, Audit, KB Editor, Departments, Facilities, Settings | 9 |
| [F — Developer Hub](#section-f) | API Explorer, Quickstart, Reference, SDKs, Sandbox, Webhooks | 6 |
| [G — Component & Mobile System](#section-g) | Mobile Nav, Notifications, Toasts | 5 |

---

---

# SECTION A — MARKETING & PUBLIC PAGES {#section-a}

---

## A01 — Landing Page Hero Section (Desktop)

### Layout
Full-width dark canvas (#0A0F14). Three vertical regions: Navigation Bar (64px fixed top), Hero Content (left 55%, vertically centered), Abstract Background Element (right 45%, geodesic wireframe sphere bleeding off right edge).

### Navigation Bar
**Structure:** Logo left · Nav links center · Actions right · Height 64px · Background #0D1117 · Border-bottom 1px

**Text Content:**
- Logo: `Creditax` (white) + `.ai` (green)
- Nav Links: `Product` · `Pricing` · `API Docs` · `Blog`
- Auth Links: `Log in`

**Links:**
- `/` — Logo
- `/pricing` — Pricing nav link
- `/developers` — API Docs nav link
- `/blog` — Blog nav link
- `/login` — Log in link

**Components:** Logo wordmark, horizontal nav list, button

**Buttons:**
- `Get Early Access` — Primary green CTA button (top-right)

---

### Hero Content (Left Column)
**Text Content:**
- Eyebrow pill: `Now in Beta · Nigeria's First AI Tax-Credit Platform`
- Headline Line 1: `Tax Smart.` (white, 72px)
- Headline Line 2: `Borrow Smart.` (green, 72px)
- Subheadline: `The AI platform bridging tax compliance and creditworthiness for Nigeria`
- Social proof: `Trusted by 2,400+ developers and accountants in Nigeria`

**Components:**
- Pill badge (teal border, teal text, green pulsing dot)
- Two-line large headline block
- Subheadline paragraph
- CTA button row
- Avatar facepile (5 overlapping circles) + social proof text

**Buttons:**
- `Get Early Access →` — Primary green filled
- `View API Docs` — Secondary teal outline

**Links:**
- `/signup` — Get Early Access button
- `/developers/quickstart` — View API Docs button

---

## A02 — Landing Page Hero (Mobile, 375px)

### Layout
Single column. Full-bleed dark canvas. Top bar (44px) with logo left and hamburger right. Content stacked vertically centered. Partial feature card "peek" at bottom fold edge.

### Top Bar
**Text:** `Creditax` + `.ai`
**Components:** Logo, hamburger icon button
**Buttons:** `☰` — Hamburger (opens mobile nav drawer)

### Hero Stack
**Text Content:**
- Eyebrow: `Now in Beta · Nigeria's First AI Tax-Credit Platform`
- Headline: `Tax Smart.` / `Borrow Smart.` (two lines, centered)
- Subheadline: `The AI platform bridging tax compliance and creditworthiness for Nigeria`
- Social: `2,400+ Nigerian developers trust Creditax.ai`

**Components:** Badge pill, headline block, subheadline, two full-width stacked buttons, avatar row, fold-peek card edge

**Buttons (full-width, stacked):**
- `Get Early Access →` — Green filled, 52px height
- `View API Docs` — Teal outline, 52px height

---

## A03 — Features Section

### Layout
Full-width dark canvas (#0A0F14). Section header centered top. Three equal-width cards in horizontal row with 24px gaps. Bottom CTA link centered.

### Section Header
**Text Content:**
- Eyebrow: `PLATFORM FEATURES`
- Headline: `Everything your tax and credit stack needs`
- Subhead: `Built for Nigerian developers, accountants, and financial institutions. Production-ready APIs with AI at the core.`

### Feature Cards (Three cards, identical structure)

**Card 1 — Tax Calculation API**
- Icon: Calculator icon in teal circle (48px)
- Title: `Tax Calculation API`
- Description: `Calculate income tax, VAT, WHT in milliseconds. Supports all Nigerian tax jurisdictions.`
- Mini preview: JSON code block showing API response (₦ values)

**Card 2 — AI Tax Assistant**
- Icon: Chat bubble icon in teal circle
- Title: `AI Tax Assistant`
- Description: `Ask any question about Nigerian tax law. Get instant, cited answers powered by our RAG model trained on FIRS guidelines.`
- Mini preview: Chat UI showing user question + AI response

**Card 3 — Credit Health Score**
- Icon: Gauge icon in teal circle
- Title: `Credit Health Score`
- Description: `Your tax compliance history becomes your creditworthiness. A better tax record unlocks better borrowing rates.`
- Mini preview: Semicircle score gauge showing `742` with "Good Standing" label

**Components:** Section header block, icon circle (48px), feature card (dark inset bg, teal border, 16px radius), code block, mini chat UI, mini gauge chart

### Bottom CTA
**Text:** `Ready to integrate?` + `Read the API docs →`
**Links:** `/developers` — Read the API docs link

---

## A04 — Pricing Page

### Layout
Dark canvas. Section header centered. Monthly/Annual toggle centered below header. Three pricing card columns (Free / Pro / Enterprise). Pro card elevated with green border. Feature comparison table (first rows visible, gradient fade). All content centered with 80px horizontal padding.

### Section Header
**Text:** `PRICING` (eyebrow) · `Simple, transparent pricing` (headline) · `Start free. Scale as you grow. No hidden fees.` (subhead)

### Toggle
**Text:** `Monthly` · `Annual` · `Save 20%` (green badge on Annual)
**Components:** Segmented pill toggle, badge

### Card 1 — Free ($0/mo)
**Text Content:**
- Plan label: `Free`
- Price: `$0` `/month`
- Description: `Perfect for developers exploring the API`
- Features: `100 API calls/month` · `Basic tax calculation` · `Document upload (10/month)`
- Disabled: `AI Tax Assistant` · `Credit Health Score` (gray strikethrough)

**Button:** `Start Free` — Ghost white outline, full-width

### Card 2 — Pro ($49/mo) [HIGHLIGHTED]
**Text Content:**
- Badge: `MOST POPULAR`
- Plan label: `Pro`
- Price: `$49` `/month`
- Description: `For professionals and growing teams`
- Features: `10,000 API calls/month` · `Full AI Tax Assistant (RAG)` · `Unlimited document upload` · `Credit Health Score` · `Priority support`

**Button:** `Get Started →` — Green filled, full-width, green glow shadow

### Card 3 — Enterprise (Custom)
**Text Content:**
- Plan label: `Enterprise`
- Price: `Custom`
- Description: `For financial institutions and large teams`
- Features: `Unlimited API calls` · `Dedicated infrastructure` · `Custom rate limits` · `White-label option` · `SLA + dedicated support`

**Button:** `Talk to Sales` — Teal outline, full-width

**Links:**
- `/signup` — Start Free, Get Started buttons
- `/contact` — Talk to Sales button

### Comparison Table
**Column Headers:** `Feature` · `Free` · `Pro` · `Enterprise`
**Text:** `View full comparison →` (teal link)
**Components:** Comparison table (striped), gradient fade overlay, teal link
**Links:** `#comparison` — View full comparison anchor

---

## A05 — Login Page

### Layout
Split-screen (50/50). Left panel: brand/visual. Right panel: login form. Full-height canvas. Background #0A0F14 left, #0D1117 right.

### Left Panel — Brand
**Text Content:**
- Wordmark: `Creditax` (white) + `.ai` (green)
- Tagline: `Tax Smart. Borrow Smart.`
- Social proof: `Trusted by 2,400+ Nigerian developers and accountants`
- Background: Constellation C watermark at 8% opacity

**Components:** Logo wordmark, tagline text, social proof text, large watermark illustration

### Right Panel — Form Card
**Card:** Background #111922, border-radius 20px, 40px padding, centered in panel

**Text Content:**
- Headline: `Welcome back`
- Subhead: `Sign in to your Creditax account`
- Input label: `Email address`
- Input placeholder: `you@company.com`
- Helper text: `We'll send a one-time sign-in link to your email.`
- Divider text: `or`
- Footer link: `Don't have an account? Sign up →`
- Footer: `© 2025 Creditax.ai · Privacy · Terms`

**Components:** Card, label, text input (email), primary button, divider with "or", secondary OAuth button, footer links

**Buttons:**
- `Send Magic Link →` — Green filled, full-width, 52px
- `Continue with Google` — Ghost with Google G icon, full-width

**Links:**
- `/signup` — Sign up link
- `/privacy` — Privacy link
- `/terms` — Terms link

---

## A06 — Signup Page

### Layout
Identical split-screen structure to Login. Left panel differs (shows benefit list instead of just wordmark). Right panel has two fields + progress indicator.

### Left Panel — Brand + Benefits
**Text Content:**
- Wordmark: `Creditax` + `.ai`
- Benefit 1: `Instant Nigerian tax calculations`
- Benefit 2: `AI-powered tax law answers`
- Benefit 3: `Your tax record builds credit`
- Social proof: `Already used by 2,400+ Nigerian finance professionals`

**Components:** Logo, 3-row benefit checklist (teal/green checkmark circles + text), social proof, constellation watermark

### Right Panel — Form Card
**Text Content:**
- Progress indicator: `● ○ ○` — `Step 1 of 3 — Account details`
- Headline: `Create your account`
- Subhead: `Start building in minutes. No credit card required.`
- Label 1: `Full name`
- Placeholder 1: `Emeka Okonkwo`
- Label 2: `Work email`
- Placeholder 2: `you@company.com`
- Legal: `By creating an account, you agree to our Terms of Service and Privacy Policy.`
- Divider: `or`
- Footer: `Already have an account? Log in →`
- Footer: `© 2025 Creditax.ai · Privacy · Terms`

**Components:** Progress dots, card, step label, two text inputs, primary button, legal text, divider, OAuth button, footer links

**Buttons:**
- `Create Account →` — Green filled, full-width
- `Continue with Google` — Ghost OAuth button

**Links:**
- `/login` — Log in link
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy

---

## A07 — About Page

### Layout
Full-width dark canvas. Sequential vertical sections: Hero → Why We Built This (2-col) → Team (4-col cards) → Values (4-col cards) → Contact CTA. Standard top navigation.

### Hero Section
**Text Content:**
- Eyebrow: `OUR MISSION`
- Headline: `We're building the financial infrastructure that Nigeria's tax and credit system deserves.`
- Subhead: `Creditax.ai was born from a simple frustration: millions of Nigerians are financially capable but invisible to lenders because their economic activity lives outside the formal credit system. We're changing that.`
- Stat 1: `2,400+` — `registered users`
- Stat 2: `₦2.1B+` — `in taxes calculated`
- Stat 3: `94%` — `client compliance rate`

**Components:** Eyebrow, large centered headline, subhead paragraph, 3-stat horizontal row with dividers

### Why We Built This (2-column)
**Text Content — Left column:**
- Title: `Why we built this`
- Paragraph 1: `Nigeria has 40 million SMEs. Most file taxes through informal channels, paper-based processes, and disconnected systems. When they need credit, banks have no data to evaluate them.`
- Paragraph 2: `We built Creditax.ai to close this gap — to make tax compliance effortless and turn that compliance into financial identity. Your tax record IS your credit story.`
- Paragraph 3: `We leverage AI, open banking, and FIRS data to give every Nigerian business the financial visibility it deserves. Not just in Lagos. Everywhere.`

**Right column:** Decorative Nigeria map illustration with user location labels (Lagos: 1,247 users · Abuja: 423 · Port Harcourt: 387)

**Components:** 2-col layout, body text block, data visualization illustration

### Team Section
**Text Content:**
- Title: `The Team`
- Subtitle: `Built by Nigerians, for Nigerians.`
- Card 1: `Chukwuemeka Obi` · `CEO & Co-Founder` · Bio text
- Card 2: `Adaeze Nwosu` · `CTO & Co-Founder` · Bio text
- Card 3: `Tunde Bakare` · `Head of Tax Intelligence` · Bio text
- Card 4: `Chidinma Eze` · `Head of Product` · Bio text

**Components:** Section title, 4-column card grid, avatar circles, name/title/bio text, social icon links

### Values Section
**Text Content:**
- Title: `What we stand for`
- Card 1: `Trust by Default` — description
- Card 2: `Speed as Respect` — description
- Card 3: `Built for Nigeria` — description
- Card 4: `Radical Transparency` — description

**Components:** 4-column card grid, icon circles

### Contact CTA Section
**Text Content:**
- Title: `Get in touch`
- Subtitle: `Have a question, partnership idea, or press inquiry?`
- Labels: `First name` · `Last name` · `Business email` · `Message`

**Components:** Centered header, contact form (2+1+1 field layout), textarea

**Buttons:** `Send Message →` — Green filled, full-width

---

## A08 — Blog Listing Page

### Layout
Dark canvas. Standard top nav with `Blog` nav item active (white). Blog header (title + search). Category pill filter row. Featured post card (large, 2-col). 3-column card grid (6 posts, 2 rows). Pagination bottom.

### Blog Header
**Text Content:**
- Eyebrow: `BLOG`
- Title: `Creditax.ai Blog`
- Subtitle: `Tax insights, product updates, and financial guides for Nigeria.`

**Components:** Eyebrow, H1, subhead, search bar input

**Interactive:** Search bar — `Search articles...` placeholder

### Category Filters
**Text (pills):** `All` · `Tax Tips` · `Product Updates` · `API Guides` · `Nigerian Finance` · `Credit & Borrowing`
**Components:** Horizontal scrollable pill filter group (active: teal filled, inactive: dark outline)

### Featured Post Card
**Text Content:**
- Badge: `FEATURED`
- Category tag: `Tax Tips`
- Title: `How Nigeria's New Tax Reform Act 2024 Affects Your Business — What Every SME Owner Needs to Know`
- Excerpt: `FIRS has introduced sweeping changes to corporate income tax, VAT thresholds, and transfer pricing rules. Here's a plain-English breakdown for Nigerian entrepreneurs.`
- Author: `Adaeze Obi · Product Team`
- Meta: `June 10, 2025 · 8 min read`
- Link: `Read Article →`

**Components:** Large horizontal card (55/45 split), image placeholder, category badge, H2, excerpt, author avatar + meta row, read link

### Grid Posts (6 cards, titles)
1. `Introducing the Creditax RAG Engine: Ask Any Nigerian Tax Question`
2. `5 Documents Every Nigerian Freelancer Should Upload for Maximum Credit Score`
3. `API v2.0 Released: Faster, Cheaper, and WHT Support`
4. `Understanding PITA: Personal Income Tax Act Explained Simply`
5. `How Tax Compliance Beats Traditional Credit Scoring in Nigeria`
6. `Creditax x Mono Integration: Bank Data Now Automatic`

**Components per card:** Image placeholder, category badge, card title, excerpt (1-2 lines), author avatar, meta text, bookmark icon

### Pagination
**Text:** `← Previous` · `1` · `2` · `3` · `...` · `12` · `Next →`
**Components:** Pagination row (active page in teal pill, ghost prev/next buttons)

---

## A09 — System Status Page

### Layout
Minimal top bar (logo + back link). Centered content max-width 760px. Page header → Overall status banner → Service list (5 rows) → Incident history (3 items) → Subscribe section.

### Page Header
**Text Content:**
- Title: `System Status`
- Meta: `Last updated: June 12, 2025 · 02:00 UTC`
- Auto-refresh: `● Auto-refreshing every 60s`

### Overall Status Banner
**Text:** `All Systems Operational` (headline, green) · `No incidents reported in the last 90 days.`
**Components:** Large status pill/banner (green border, green bg-tint), checkmark icon, text, subscribe button

**Button:** `Subscribe to Updates` — Green outline

### Service Rows (5 rows)
| Service | Status | Uptime |
|---------|--------|--------|
| `API Server` | `● Operational` (green) | `99.97% uptime` |
| `RAG Chat Engine` | `● Operational` | `99.91%` |
| `Document Processing` | `● Operational` | `99.89%` ← EXPANDED |
| `Auth System` | `● Operational` | `100%` |
| `Marketplace API` | `● Operational` | `99.82%` |

**Expanded row (Document Processing):**
- Tab pills: `7 days` · `30 days` (active) · `90 days`
- 30-bar uptime history chart (green bars, one amber bar on day 21)
- Labels: `Jun 1` (left) · `Jun 12` (right)
- Stats: `99.89% uptime` · `1 incident` · `Avg response: 1.2s`

**Components:** Service rows (dark card, expand chevron), 3-tab pill group, bar chart, stat pills

### Incident History (3 items)
1. Title: `Elevated Document Processing Latency` · Status: `Resolved` · Date: `June 3, 2025 · 14:22–15:47 UTC` · Duration: `85 minutes`
2. `RAG Chat Intermittent Timeouts` · `Resolved` · `May 28, 2025` · `23 minutes`
3. `Auth Service Degraded` · `Resolved` · `May 15, 2025` · `41 minutes`

**Link:** `View full incident history →`

### Subscribe Section
**Text:** `Get notified about incidents` · `Receive email or Slack alerts the moment we detect any service disruption.`
**Components:** Bell icon, heading, subtitle, email input + subscribe button row, helper text

**Button:** `Subscribe` — Teal filled

---

## A10 — Marketplace Listing Page

### Layout
Standard top nav. Search header (full width, #0D1117 bg). Filter row. Split-view content: Left 40% (scrollable list) · Right 60% (Mapbox dark map with markers).

### Search Header
**Text/Placeholder:** `Find a trusted tax professional in Nigeria...`
**Location:** `📍 Lagos, Nigeria` (teal, inside search bar right)
**Components:** Large search bar (52px), location pill inside bar, search button

**Button:** `Search` — Teal filled, inside bar

### Filter Row
**Filter Labels:** `Service Type ▾` · `Location ▾` (shows `Lagos ×`) · `Rating ▾` · `Price Range ▾` · `✓ Verified Only` (toggle, ON state)
**Count text:** `47 professionals found`
**Components:** Dropdown filters, toggle with label, result count

### Professional Cards (4 visible, scroll implied)

**Card 1 (selected/featured, teal border):**
- Name: `Adaeze Consulting Ltd`
- Badge: `✓ Verified`
- Rating: `★★★★★ 4.9 (127 reviews)`
- Distance: `2.3 km away`
- Tags: `Income Tax` · `VAT` · `Payroll`
- Price: `From ₦15,000/filing`

**Card 2:** `Lagos Tax Partners` · 4.8 · 89 reviews · 5.1 km · `CIT` `Transfer Pricing` `Audit` · `From ₦45,000/filing`
**Card 3:** `QuickTax Nigeria` · 4.6 · 203 reviews · 1.8 km · `VAT` `PAYE` `WHT` · `From ₦8,000/filing`
**Card 4:** `Emeka & Associates` · 4.7 · 56 reviews · 8.4 km · `CIT` `Income Tax` · `From ₦25,000/filing`

**Hover state:** `View Profile →` green button overlay appears on each card

**Components:** Professional card (dark bg, rounded, hover state), avatar circle, verified badge, star rating, distance, service tags, price, map overlay

**Map:** Dark Mapbox tiles, teal pin markers per professional, cluster bubbles showing count (e.g., "8"), tooltip popup on selected: `Adaeze Consulting Ltd — ₦15,000/filing — 4.9 ★`

**Map bottom pill:** `📍 Showing results near Lagos Island`

**Links:** Each card → `/marketplace/[proId]`

---

## A11 — Tax Pro Public Profile Page

### Layout
Standard nav (consumer). Client header (full width, #0D1117). Tabs row. Three-column layout: Left 30% (contact + map + stats) · Center 45% (about + services + reviews) · Right 25% (extra). Sticky bottom CTA bar.

### Profile Header
**Text Content:**
- Business name: `Adaeze Consulting Ltd`
- Badges: `✓ CAC Registered` · `✓ FIRS Certified` · `✓ Creditax Verified`
- Location: `📍 Lagos Island, Lagos · 2.3 km from you`
- Rating: `★★★★★ 4.9 (127 reviews) · Member since March 2022`

**Components:** Large avatar (80px, teal border), business name H1, badge pills (teal/green), location text, rating row, primary CTA button

**Button:** `Request Consultation` — Green filled, 52px, top-right of header
**Sub-text:** `Usually responds in 2hrs`

### Left Column
**Contact Card text:** `Contact` (heading)
**Buttons:**
- `📞 Call Now` — Teal outline
- `✉ Send Email` — Teal outline
- `💬 WhatsApp` — Green filled (primary contact)
- `🌐 Visit Website` — Ghost

**Mini Map:** Shows Victoria Island Lagos, single teal pin
**Address text:** `15 Adeola Odeku St, Victoria Island, Lagos`

**Stat pills:** `127 reviews` · `3 yrs exp` · `98% on-time`

### Center Column
**About text:** Full paragraph describing Adaeze Consulting Ltd specialization and experience.

**Services Table:**
| Service | Turnaround | Price |
|---------|-----------|-------|
| Income Tax Filing | 3–5 days | ₦25,000 |
| VAT Returns (Monthly) | 1–2 days | ₦15,000 |
| Corporate Income Tax | 7–10 days | ₦45,000 |
| Payroll Processing | 2–3 days | ₦20,000/mo |
| Tax Audit Support | As needed | ₦75,000 |

**Reviews Section — 3 reviews:**
1. `Emeka J.` ★★★★★ Jun 2025 — review text
2. `Chidinma O.` ★★★★★ May 2025 — review text
3. `Tunde B.` ★★★★☆ Apr 2025 — review text

**Link:** `See all 127 reviews →`

### Sticky Bottom CTA Bar
**Text:** `Adaeze Consulting Ltd` · `From ₦15,000/filing`
**Buttons:**
- `Request Consultation` — Green filled, 44px
- `Message` — Ghost

**Links:**
- `/pro/apply` — Request Consultation (triggers pro connection flow)

---

---

# SECTION B — AUTHENTICATION {#section-b}
*(Already covered in A05 and A06 above.)*

---

---

# SECTION C — CONSUMER DASHBOARD {#section-c}

### Dashboard Shell (Persistent Layout — All Consumer Screens)

**Top Navigation Bar (64px, #0D1117):**
- Left: Logo `Creditax` + `.ai`
- Center nav: `Dashboard` (active indicator) · `Tax Filing` · `Documents` · `Credit` · `Settings`
- Right: Notification bell (with green dot badge) · User avatar (36px, initials) · `Emeka O.`
- All nav links route to their respective dashboard pages

**Left Sidebar (240px, #0D1117):**
- Section label: `QUICK ACTIONS`
- `↑ Upload Document` (teal, icon + label)
- `💬 Ask Tax Bot` (green, icon + label)
- `📊 View Reports` (white, icon + label)
- Tip card: `💡 Tax Tip` — contextual tip text

---

## C01 — Main Consumer Dashboard

### Layout
Main content area (padding 32px 40px). Welcome row at top. Three stat cards row. Full-width recent activity card.

### Content
**Text:**
- Welcome: `Welcome back, Emeka 👋`
- Date: `Thursday, 12 June 2025`

**Stat Card 1 — Tax Health Score:**
- Label: `TAX HEALTH SCORE`
- Value: `78` / `100`
- Badge: `✓ On Track` (green)
- Visual: Semicircle gauge (teal→green gradient, 78% fill)

**Stat Card 2 — Credit Score:**
- Label: `CREDIT SCORE`
- Value: `720`
- Sub-label: `VantageScore`
- Change: `↑ +15 from last month` (green)
- Visual: Semicircle gauge (72% fill)

**Stat Card 3 — Tax Filing Progress:**
- Label: `2025 TAX FILING`
- Value: `60%`
- Warning: `3 documents still needed` (amber)
- Missing doc chips: `Bank Statement` · `PAYE Receipt` · `Utility Bill` (red dots)
- Visual: Vertical progress bar (60% teal→green fill)

**Recent Activity Card:**
- Header: `Recent Activity` + `View all →` (teal link, right-aligned)
- Activity rows (5 items):
  1. `Tax Health Score updated to 78/100` — 2 hours ago
  2. `Document uploaded: Bank Statement.pdf` — Yesterday
  3. `Credit Score increased by +15 points` — 3 days ago
  4. `AI Tax Bot answered: VAT deduction query` — 5 days ago
  5. `Account created and verified` — Jun 1, 2025

**Components:** Welcome text row, 3-column card grid, semicircle gauge SVG, vertical progress bar, activity feed list with icon-circles, timestamp text

**Links:**
- `View all →` → `/dashboard/activity`
- Sidebar `Upload Document` → `/dashboard/documents/upload`
- Sidebar `Ask Tax Bot` → `/dashboard/credit/chat`
- Sidebar `View Reports` → `/dashboard/reports`

---

## C02 — Credit Score Detail Page

### Layout
Dashboard shell. Below nav: breadcrumb row. Two-column layout: Left 55% (score + breakdown + CTA) · Right 45% (history chart + risk areas + quick actions).

### Breadcrumb
**Text:** `Dashboard > Credit Score`

### Left Column

**Score Card:**
- Full circle ring gauge (200px diameter)
- Score: `720`
- Sub: `/ 850`
- Label: `GOOD` (green, bold)
- Color scale bar with triangle marker at "Good" zone
- Scale labels: `Poor` · `Fair` · `Good` · `Excellent`

**Score Breakdown:**
- Title: `What's Building Your Score`
- Row 1: `Tax Filing History` · `+45 pts` (green) · Progress bar 90% green
- Row 2: `Document Consistency` · `+30 pts` (green) · Bar 65% teal
- Row 3: `Income Stability` · `+25 pts` (green) · Bar 55% teal
- Row 4: `Savings Pattern` · `+20 pts` (amber) · Bar 40% amber

**What This Means Card:**
- Title: `📌 What this means`
- Body: `A score of 720 puts you in the 'Good' tier. Lenders on the Creditax platform will see you as a low-risk borrower. You qualify for loan rates starting from 12% per annum. Improving your filing consistency could push you to 'Excellent' within 3 months.`

**Button:** `How to Improve My Score →` — Green filled, full-width

### Right Column

**Score History Card:**
- Title: `Score History` · Subtitle: `Last 12 months`
- Line chart: X-axis months (Jun 24 → Jun 25), Y-axis (600–800)
- Trend: 680 → 720 (upward, small dip in October)
- Highlighted point: `720 — Jun 2025` tooltip

**Areas to Watch Card:**
- Title: `⚠ Areas to Watch` (amber)
- Row 1: `Savings Pattern` — upload 3 months of savings statements
- Row 2: `Q3 2024 Filing` — late filing note, decay timeline

**Quick Actions Card:**
- `Upload Bank Statement` — Teal outline
- `Request Lender Match` — Green filled
- `Download Score Report` — Ghost white

**Links:**
- Quick Actions buttons → respective flows

---

## C03 — Tax Filing Wizard (Desktop) — Step 3: Review Deductions

### Layout
Dashboard shell. Step indicator bar (below nav, full width). Two-column content: Left 60% (AI bubble + expense list) · Right 40% (running total + insight). Fixed bottom navigation bar.

### Step Indicator (Full-width bar)
**Text:**
- Step 1: `Income Details` (✓ teal, completed)
- Step 2: `Upload Documents` (✓ teal, completed)
- Step 3: `Review Deductions` (● green, ACTIVE)
- Step 4: `Tax Summary` (○ gray, pending)
- Step 5: `Submit & Pay` (○ gray, pending)
- Sub-label: `Step 3 of 5`

### Left Column — AI Bubble
**Text (AI message):**
`Based on your uploaded receipts and invoices, I found ₦2,450,000 in potentially deductible business expenses. Would you like me to add all of these to your filing?`

**Buttons:**
- `✓ Yes, add all` — Green filled (small)
- `Review each one` — Teal outline (small)

**Expense List:**
- Title: `Detected Deductible Expenses` · Sub: `Tap any item to edit or remove`
- Rows (checkbox + name + category tag + amount):
  - ✅ `Generator Fuel — Aug 2024` | `[Operations]` | `₦180,000`
  - ✅ `Office Rent — Q3 2024` | `[Overhead]` | `₦600,000`
  - ✅ `Internet & Utilities` | `[Utilities]` | `₦95,000`
  - ✅ `Staff Training Workshop` | `[HR]` | `₦275,000`
  - ✅ `Professional Services (Legal)` | `[Services]` | `₦450,000`
  - ✅ `Business Travel — Lagos-Abuja` | `[Travel]` | `₦320,000`
  - ⬜ `Personal Grocery Purchase` | `[⚠ Not Eligible]` (amber, dimmed) | `₦85,000`

### Right Column — Running Total Card
**Text:**
- `Gross Income` · `₦12,000,000`
- `Total Deductions` · `₦2,450,000` (green, bold)
- `Taxable Income` · `₦9,550,000`
- `Estimated Tax Due` · `₦2,387,500` (white, 24px bold)
- `Estimated Tax Savings` · `₦612,500 ↑` (green, 24px bold)
- Sub: `Based on 2024 PITA rates for Lagos State`

**AI Insight Card:**
- Label: `✨ AI Insight`
- Text: `Adding the Professional Services deduction alone saves you ₦112,500 in taxes. This is your highest-impact deduction.`

### Bottom Navigation Bar
**Text:** `Step 3 of 5`
**Buttons:**
- `← Back` — Ghost white outline, 140px
- `Continue to Summary →` — Green filled, 220px

---

## C04 — Tax Filing Wizard (Mobile)

### Layout
Single column. Mobile top bar (44px). Thin progress bar (8px, below top bar). Scrollable content: AI bubble → expense list. Sticky bottom panel with savings total + nav buttons.

### Mobile Top Bar
**Text:** `← Back` (teal) · `Review Deductions` (center title) · `3/5` (right)

### Progress Bar
- 60% teal→green fill (Step 3 of 5)

### AI Chat Bubble Card
**Text:** Same as desktop AI message
**Buttons:**
- `✓ Add All Deductions` — Green filled, full-width
- `Let me review each` — Teal outline, full-width

### Expense Rows (4 visible, more below fold)
- Same row data as desktop, compact format (avatar 20px checkbox, category pill below name, amount right)

### Sticky Bottom Panel
**Text:** `Total Savings:` · `₦612,500 ↑` (green, 18px)
**Buttons:**
- `← Back` — Ghost, 44% width
- `Continue →` — Green filled, 52% width

---

## C05 — Document Upload (Desktop)

### Layout
Dashboard shell with sidebar. Main content: page header → large upload zone → filter bar → recent uploads list (5 rows).

### Page Header
**Text:** `Upload Documents` · `Upload receipts, invoices, or tax forms — our AI extracts data automatically.`

### Upload Zone
**Text:**
- Icon: Cloud upload (56px, teal)
- Primary: `Drag & drop files here`
- Secondary: `or`
- Sub: `Supported: JPG · PNG · PDF · Max 10MB per file`

**Buttons:**
- `Browse Files` — Teal outline, 44px
- `📷 Capture with Camera` — Ghost, 44px

### Filter Bar
**Text:** `Recent Uploads` (heading) · `View all in Documents →` (teal link)
**Filter pills:** `All` (active) · `Receipts` · `Invoices` · `Tax Forms` · `Recently Processed`

### Document Rows (5 rows, varying states)

**Row 1 — Processing:**
- Filename: `VAT_Invoice_Zenith_Jun2025.pdf` · `Uploaded 2 mins ago · 3 pages · 1.2MB`
- Status: `Processing...` (teal, with spinner)
- Progress bar: 67% teal fill
- Sub: `AI extracting data...`
- Button: `Cancel ✕` (gray link)

**Row 2 — Extracted:**
- Filename: `Bank_Statement_May2025.pdf` · `Uploaded 15 mins ago · 8 pages · 3.4MB`
- Chips: `[₦2,400,000]` (green) · `[Income]` (teal) · `[May 2025]` (gray)
- Status: `✓ Extracted` (green)
- Actions: `View` · `Download` · `Delete`

**Row 3 — Extracted:** `Generator_Fuel_Receipt.jpg` · `₦180,000` · `[Operations]` · `✓ Extracted`

**Row 4 — Needs Review:**
- Filename: `Unclear_Receipt_0043.jpg`
- Amber strip: `⚠ Low confidence extraction — please verify the detected amount.`
- Status: `⚠ Needs Review` (amber)
- Button: `Review & Confirm →` (amber outlined)

**Row 5 — Extracted:** `PAYE_Certificate_2024.pdf` · `₦4,800,000` · `[Payroll]` · `✓ Extracted`

**Links:** `View all in Documents →` → `/dashboard/documents`

---

## C06 — Document Upload (Mobile)

### Layout
Full-height mobile. Top bar + Camera zone (primary) + filter pills + compact document cards + sticky bottom tab bar.

### Top Bar
**Text:** `← Dashboard` (teal) · `Upload Document` (center) · `[history icon]` (right)

### Camera Zone
**Text:**
- `📷 Tap to capture`
- `or drag a file here`

**Buttons (stacked, full-width):**
- `📷 Use Camera` — Green filled (primary)
- `🖼 Choose from Gallery` — Ghost
- `📂 Browse Files (PDF)` — Ghost
**Sub-text:** `JPG · PNG · PDF · Max 10MB`

### Section Label
**Text:** `Recent Uploads` (heading) · `See all →` (right)
**Filter pills:** `All` · `Receipts` · `Invoices` · `Tax Forms`

### Document Cards (3 visible)
Compact cards: filename + status + progress/chips + timestamp

### Bottom Tab Bar
`Home` · `↑ Upload` (elevated green FAB, 56px) · `Chat` · `Credit` · `Profile`

---

## C07 — My Documents Page

### Layout
Dashboard shell. Header row with view toggle. Filter + search row. Bulk action bar (shown active). Table with 8 rows. Summary footer bar. Pagination.

### Header
**Text:** `My Documents`
**Buttons:**
- `↑ Upload Document` — Green filled, 40px
- List view icon (active, teal) / Grid view icon (gray) — View toggle

### Filter + Search Row
**Filter pills:** `All` (active) · `Receipts` · `Invoices` · `Tax Forms` · `Recently Processed` · `Needs Review` (amber, count "2")
**Search:** `Search documents...` placeholder, 280px
**Sort:** `Date: Newest ▾` dropdown

### Bulk Action Bar (3 selected)
**Text:** `3 documents selected`
**Links:** `Download Selected` (teal) · `Delete Selected` (red) · `Clear Selection ✕` (gray)

### Table Columns
`[checkbox]` · `Document` · `Category` · `Amount Extracted` · `Date Uploaded` · `Status` · `Actions`

### Table Row Data (8 rows, varied statuses)
Each row contains: file icon, filename, page count, category tag, extracted amount (green), upload date, status badge, View/Download/Delete actions.

Status values visible: `✅ Verified` (green) · `🔄 Processing` (amber) · `⚠ Needs Review` (amber) · `❌ Failed` (red, with `Re-upload` action)

### Summary Footer
**Text:** `Showing 8 of 47 documents` · `Total extracted value: ₦12,435,000` (green, right)

### Pagination
`← Prev` · `1` [active] · `2` · `3` · `...` · `6` · `Next →`

---

## C08 — Reports Page

### Layout
Dashboard shell. Header row. Report type selector (4 cards). Two-column: Left 55% (reports list) · Right 45% (preview panel).

### Header
**Text:** `Reports`
**Button:** `+ Generate New Report` — Green filled

### Report Type Selector
**Cards (4, 2×2 grid):**
- `Tax Summary` (selected, teal border) — `Annual & quarterly tax breakdown`
- `Expense Report` — amber icon — `All deductible expenses by category.`
- `Credit Report` — green icon — `Score history & factor analysis.`
- `Custom Report` — blue icon — `Choose your own date range & metrics.`

### Reports List (Left)
**Title:** `Your Reports` · `(12 reports)`
**Column headers:** implicit (Report name · Type badge · Date · File size · Actions)

**Sample rows:**
1. `Annual Tax Summary 2024` · `[Tax Summary]` · `Jun 10, 2025` · `2.4MB` · ↓ PDF · Share · Delete
2. `Expense Report — Q2 2025` · `[Expense]` · `Jun 8` · `4.1MB`
3. `Credit Health Report — June 2025` · `[Credit]` · `Jun 1` · `1.8MB`
(+ 5 more rows)

**Link:** `View all 34 reports →` (pagination or link)

### Preview Panel (Right)
**Label:** `Preview — Annual Tax Summary 2024`

**Summary stats row:**
- `Gross Income:` `₦12,000,000`
- `Total Tax:` `₦2,387,500`
- `Effective Rate:` `19.9%` (green)

**Mini charts:**
- Bar chart: Monthly income (12 bars, teal, December highlighted green)
- Donut chart: Tax breakdown (Income Tax 55% teal · VAT 25% green · WHT 20% amber)

**Breakdown table:**
- `Income Tax` · `₦1,312,125` · 55% bar
- `VAT` · `₦596,875` · 25% bar
- `WHT` · `₦478,500` · 20% bar
- `Total` · `₦2,387,500`

**Export buttons:**
- `↓ PDF` — Green filled, 36px
- `↓ CSV` — Teal outline, 36px
- `📤 Share Link` — Ghost, 36px

**Link:** `View full report →` (teal)

---

## C09 — Settings Page

### Layout
Dashboard shell + inner settings sidebar (200px, #0D1117). Main content max-width 680px, scrollable. Three sections visible: Account · Notifications · Security.

### Inner Settings Sidebar
**Nav items:** `Account` (active, teal) · `Notifications` · `Security` · `Billing` · `API`
**Bottom link:** `Danger Zone` (red)

### Account Section
**Title:** `Account` · Sub: `Manage your personal information and preferences.`

**Profile photo row:** Avatar (72px) · `Emeka Obi` · `Change photo` (teal link) · `Remove` (gray link)

**Form fields (labels above, then input):**
- `First Name` / `Last Name` (side by side) — `Emeka` / `Obi`
- `Email Address` — `emeka.obi@zenithfoods.ng` + `✓ Verified` (green pill inside input)
- `Phone Number` — `+234` prefix + `812 345 6789`
- `Timezone` — `Africa/Lagos (WAT, UTC+1)` dropdown

**Button:** `Save Changes` — Green filled, 48px + `No unsaved changes` (gray, beside)

### Notifications Section
**Title:** `Notifications` · Sub: `Control how Creditax.ai contacts you.`

**Toggle rows (4):**
- `Email Notifications` — `Tax alerts, filing reminders, document updates` · Toggle: ON (teal)
- `Push Notifications` — `Real-time alerts on your device` · Toggle: ON
- `SMS Alerts` — `Critical tax deadlines via SMS` · Toggle: OFF (gray)
- `Weekly Tax Digest` — `Summary of your tax activity every Monday` · Toggle: ON

### Security Section
**Title:** `Security`

**Cards (2):**
1. `Two-Factor Authentication` — Toggle ON (green) · `Authenticator app connected`
2. `Active Sessions` — 3 sessions listed:
   - `Chrome on macOS · Lagos, Nigeria` · `Current session` (green pill)
   - `Safari on iPhone 14 · Lagos, Nigeria` · `2 hours ago` · `Revoke` (red link)
   - `Chrome on Windows · Abuja, Nigeria` · `3 days ago` · `Revoke` (red link)

### Danger Zone
**Text:** `Delete Account` · `Permanently delete your account and all data. This cannot be undone.`
**Button:** `Delete Account` — Red ghost, 40px

---

## C10 — API Keys Page

### Layout
Dashboard shell. Header row. Security warning banner. Active keys (2 card items). Create Key modal (open as overlay panel on right).

### Header
**Text:** `API Keys`
**Button:** `+ Create New Key` — Green filled

### Security Warning Banner
**Text:** `⚠ Keep your API keys secure. Never share them in public repositories or client-side code. Rotate keys immediately if compromised.`
**Link:** `Learn about API security →`

### API Key Card 1 — Production Key (green left border)
**Text:**
- Name: `Production Key` · Badge: `Live` (green)
- Date: `Created Mar 15, 2025`
- Key: `sk_live_****************************8f3a` (masked)
- Meta: `Last used: 2 hours ago` · `Created by: Emeka Obi` · `Scopes: Read, Write`
- Usage: `8,431 / 10,000 calls` · Progress bar 84% (teal→amber gradient)
- Sub: `84% of monthly limit · Resets July 1 · Upgrade for unlimited →`

**Inline actions:** `👁 Reveal` (teal) · `📋 Copy` (gray)
**Buttons:** `Revoke Key` (red ghost, 34px) · `Edit Name` (gray ghost)

### API Key Card 2 — Development Key (teal left border)
**Text:**
- Name: `Development Key` · Badge: `Test` (teal)
- Key: `sk_test_****************************2b91`
- Usage: `234 / unlimited` (no bar, test keys unlimited)
- Scopes: `Read only`

### Create New Key Modal (right slide panel)
**Title:** `Create New API Key`
**Fields:**
- `Key Name *` — text input, `My Production App` (filled example)
- `Environment` — pill toggle: `Live` (selected green) · `Test` (gray)
- `Scopes` — checkboxes:
  - ☑ `Read` — `Access tax calculations and credit data`
  - ☑ `Write` — `Upload documents and submit filings`
  - ☐ `Admin` — `Manage keys and account settings`

**Buttons:**
- `Create Key →` — Green filled, full-width
**Warning text:** `The key will be shown once. Copy it immediately.` (amber)

---

## C11 — Usage Analytics Page

### Layout
Dashboard shell. Header with billing period selector. 4 stat cards row. Main line chart (full width). Two-column below: Left 55% endpoint table · Right 45% quota card + upgrade.

### Header
**Text:** `Usage & Analytics`
**Period pills:** `7 days` · `30 days` (active, teal) · `90 days` · `Custom ▾`
**Text:** `Next billing: July 1, 2025` · `Upgrade Plan →` (green small button)

### Stat Cards (4)
1. `API Calls (June)` · `45,231` · `+12% vs last month` (green) · Mini sparkline
2. `Monthly Limit` · Circular quota ring (45% fill) · `45%` · `45,231 / 100,000 calls`
3. `Avg Response Time` · `142ms` · `p99: 387ms` · `↓ 18ms vs last month` (green)
4. `Success Rate` · `99.6%` · `180 errors in 45,231 calls` · `Most common: 429 Rate Limit` (amber)

### Main Chart
**Title:** `API Calls Over Time` · Toggle: `Hourly` · `Daily` (active) · `Weekly`
**Chart:** 30-day line chart, 3 lines: Total Calls (teal, area fill), Successful (green), Errors (red, near baseline with spike Jun 3)
**Tooltip:** `Jun 10: 1,847 total · 1,843 success · 4 errors`

### Endpoint Breakdown Table (Left)
**Title:** `Usage by Endpoint`
**Columns:** `Endpoint` · `Calls` · `% of Total` (inline progress bar) · `Avg Latency` · `Error Rate`
**Rows:**
- `POST /v2/tax/calculate` · `15,234` · 34% bar · `142ms` · `0.2%`
- `GET /v2/tax/brackets` · `12,456` · 27% · `89ms` · `0.0%`
- `GET /v2/credit/score` · `10,234` · 23% · `203ms` · `0.4%`
- `POST /v2/rag/chat` · `7,307` · 16% · `387ms` · `1.2%` (amber)
- `POST /v2/documents/ocr` · (remainder) · `892ms` (amber) · `2.1%` (amber)

### Quota Card (Right)
**Text:** `Current Plan: Pro` (teal pill) · Usage bar `45,231 / 100,000` (45% teal fill) · `54,769 calls remaining · Resets in 19 days`
**Features:** ✓ 100,000 API calls/month · ✓ Full RAG chat access · ✓ Credit score API

### Upgrade Prompt
**Text:** `Upgrade to Enterprise` · `Get unlimited API calls, dedicated infrastructure, and custom rate limits.`
**Button:** `Talk to Sales →` — Green filled, full-width

---

## C12 — Empty State: Documents

### Layout
Mobile screen (375px). Top bar + full-height centered empty state + bottom tab bar.

**Text Content:**
- Top bar: `← Back` · `Documents` · Filter icon
- Headline: `No documents yet`
- Subtext: `Upload your first receipt, invoice, or tax form to get started — our AI will extract the details automatically.`
- Secondary link: `Or take a photo with your camera →`
- Tip: `💡 Uploading your PAYE receipt adds +8 points to your credit score.`

**Components:** Geometric fan document illustration, headline, subtext, primary button, secondary link, tip card, bottom tab bar

**Buttons:**
- `↑ Upload Document` — Green filled, full-width

---

## C13 — Empty State: Credit Score

### Layout
Mobile screen. Same structure as Documents empty state.

**Text Content:**
- Top bar: `← Back` · `Credit Health` · Info icon
- Empty gauge: large circle ring (unfilled/gray), `?` center, `—` where score would be, `No Score Yet` label
- Lock icon on color scale
- Headline: `Build your credit score`
- Subtext: `Your tax filing history is your credit history. Start filing to unlock your Creditax Credit Score and qualify for better loan rates.`
- Steps:
  - ① `Upload your income documents`
  - ② `Our AI calculates your tax profile`
  - ③ `Your compliance builds your score`

**Buttons:**
- `Start Filing Now →` — Green filled, full-width

**Link:** `Learn how credit scoring works` (teal, underlined)

---

## C14 — Onboarding Welcome Screen

### Layout
Full-immersive mobile (no nav bar). Logo centered top. Two-line personalized headline. Subtext. 3-card step preview. Pagination dots. Bottom CTA area.

**Text Content:**
- Logo: `Creditax.ai`
- Headline: `Welcome to Creditax` (white) / `Emeka` (green, second line — personalized name)
- Subtext: `Nigeria's first AI platform that turns your tax compliance into financial power.`
- Step 1 card: `Connect Bank`
- Step 2 card: `Upload Docs`
- Step 3 card: `Build Credit`
- Dots: `● ○ ○`

**Buttons:**
- `Let's Get Started →` — Green filled, full-width, 56px, green glow
- `Skip for now` — Gray, underlined

---

## C15 — Onboarding Carousel (3-Step Documentation)

### Layout
Design documentation view showing all 3 steps simultaneously as mini phone frames.

**Step 1 — Connect Bank:**
- Title: `Connect your bank`
- Sub: `Securely link your account to verify income`
- Button: `Connect Bank`

**Step 2 — Upload Documents:**
- Title: `Upload your documents`
- Sub: `Receipts, invoices, PAYE slips — AI extracts everything`
- Button: `Start Uploading`

**Step 3 — Build Credit:**
- Title: `Watch your credit grow`
- Sub: `Your tax history builds a score lenders trust`
- Button: `Get Started →`

**Technical annotations:**
- Step 1: `Bank connection uses OAuth 2.0 — read-only access`
- Step 2: `AI OCR extracts amounts, dates, categories in < 3 seconds`
- Step 3: `Score updates every 30 days as you file`

---

---

# SECTION D — TAX PROFESSIONAL PORTAL {#section-d}

### Pro Portal Shell (Persistent)
**Top Nav:** `Creditax.ai` wordmark + `PRO PORTAL` (teal pill badge) + center nav + avatar
**Center Nav links:** `Dashboard` · `Clients` · `Calculations` · `Verify` · `Settings`

---

## D01 — Pro Dashboard

### Layout
Full-width content (no sidebar). Header row → 4 stat cards → 3-column layout (Deadlines 35% · Activity 35% · Quick Actions 30%) → Client table full-width.

### Header
**Text:** `Good morning, Adaeze 👋` · `You have 8 pending tasks and 2 filing deadlines this week.`
**Button:** `Add Client +` — Green filled, 40px

### Stat Cards (4)
1. `Revenue (June)` · `₦2,400,000` · `+12% vs last month` (green)
2. `Pending Tasks` · `8` (amber, bold) · `3 due in 24hrs` (amber)
3. `Client Compliance Rate` · `94%` (green) · `2 clients need attention`
4. `Active Clients` · `47` · `+3 new this month` (green)

### Upcoming Deadlines Card
**Title:** `Upcoming Deadlines` · `FIRS Calendar` (teal link)
**Rows (5):**
- 🔴 `Jun 20` · `Zenith Foods Ltd` · `VAT Return` — red urgency
- 🟡 `Jun 25` · `Eko Logistics` · `WHT Remittance`
- 🟢 `Jun 30` · `Marina Tech` · `CIT Filing`
- ⚪ `Jul 10` · `Okafor & Sons` · `Quarterly Review`
- ⚪ `Jul 15` · `Sunrise Bakery` · `Annual Return`
**Link:** `View FIRS Calendar →`

### Client Activity Feed
**Title:** `Client Activity`
**Items (6):** Recent uploads, report requests, alerts, onboarding completions, bulk calculations, submission confirmations with timestamps

### Quick Actions Card
**Buttons (3, stacked):**
- `Add New Client` — Teal outline, full-width
- `Run Bulk Calculation` — Green filled, full-width
- `Verify Client CAC/TIN` — Ghost white, full-width

### API Usage Widget
**Text:** `API Usage` · `8,431 / 10,000 calls` · Progress bar 84%
**Link:** `Upgrade to Unlimited →` (teal)

### Client Table (below)
**Title:** `Recent Clients` · `View all 47 →` (teal)
**Columns:** `Client Name` · `CAC Number` · `TIN` · `Compliance %` · `Last Activity` · `Status` · `Actions`
**Rows:** 5 rows with colored compliance badges and `View` teal links

---

## D02 — Client Management Page

### Layout
Pro shell. Header row. Search + filter row. Bulk action bar (3 selected). 10-row table. Table footer + pagination.

### Header
**Text:** `Clients` · `(47)`
**Buttons:**
- `↓ Export CSV` — Gray outline
- `Add Client +` — Green filled

### Search + Filters
**Search:** `Search clients, CAC, TIN...` (320px)
**Dropdowns:** `Status: All ▾` · `Compliance: All ▾` · `Last Active ▾`
**Count:** `Showing 1–10 of 47`

### Bulk Action Bar
**Text:** `3 clients selected`
**Links:** `Export CSV` (teal) · `Delete Selected` (red) · `Clear ✕` (gray)

### Table (10 rows)
**Columns:** `[checkbox]` · `Client` · `CAC Number` · `Status` · `Compliance` · `Last Activity` · `Actions`
**Status badges:** `● Active` (green) · `⏳ Pending` (amber) · `⏸ Inactive` (gray) · `⚠ Alert` (red)
**Actions per row:** `View` (teal) · `Docs` (gray) · `Reports` (gray) · `[···]` more

### Table Footer
**Text:** `Showing 1–10 of 47 clients`
**Pagination:** Standard prev/next with page numbers
**Dropdown:** `10 per page ▾`

---

## D03 — Client Detail Page

### Layout
Pro shell. Breadcrumb + client header bar. Tab navigation. Two-column: Left 65% (filter bar + document table) · Right 35% (client info + quick actions + notes).

### Breadcrumb
**Text:** `Clients / Zenith Foods Ltd / Documents`

### Client Header Bar
**Text:**
- Avatar: `ZF` (teal initials)
- Name: `Zenith Foods Ltd`
- Meta: `CAC: RC-248571 · TIN: 1234567-0001 · Lagos, Nigeria`
- Compliance: `94%` (green, 32px bold)
- Status: `● Active` (green pill)

### Tab Navigation
`Overview` · `Documents` (active, teal underline) · `Filings` · `Reports`

### Document Filter Bar
**Pills:** `All (18)` (active) · `Receipts (7)` · `Invoices (4)` · `Tax Forms (3)` · `Bank Statements (4)`
**Controls:** Search input + `Date ▾` sort dropdown
**Button:** `Upload Document +` — Green filled, 40px

### Document Table
**Columns:** `Document` · `Amount` · `Category` · `Date` · `Status` · `Actions`
**8 rows** with varying statuses (Verified/Processing/Issue)

### Right Sidebar Cards
**Client Info:** All client details (industry, tax year, assigned pro, compliance bar)
**Quick Actions buttons:**
- `Calculate Tax Liability` — Teal outline
- `Generate Compliance Report` — Green filled
- `Message Client` — Gray ghost

**Share Settings:** `Allow client to view` toggle (OFF) + description text

---

## D04 — Bulk Calculations Page

### Layout
Pro shell. Header. Two-column: Left 42% (config panels) · Right 58% (results panel).

### Header
**Text:** `Bulk Calculations` · `Run tax calculations for multiple clients at once.`

### Left Column — Config

**Calculation Type Cards (3):**
- `Income Tax` (selected, teal border) — `PITA-compliant personal and corporate tax`
- `VAT` — `Value Added Tax at applicable rates`
- `WHT` — `Withholding Tax on contracts and services`

**Fiscal Year Pills:** `2022` · `2023` · `2024` (selected) · `2025`

**Client Selection:**
- Header: `Select Clients` · `3 selected` (teal pill)
- Controls: `Select All` · `Clear Selection`
- Search input
- Checkbox list (8 clients visible, 3 checked, compliance % per row)

**Button:** `RUN CALCULATIONS →` — Green filled, full-width, 52px
**Helper:** `Estimated time: ~8 seconds for 3 clients`

### Right Column — Results

**Panel header:** `Calculation Results — Income Tax 2024` · `Run at 14:23:05`
**Buttons:** `↓ Export All` (teal) · `Generate Reports` (green)

**Expanded result (Zenith Foods Ltd):**
- `Gross Income` · `₦12,000,000`
- `Total Deductions` · `₦2,450,000` (teal)
- `Tax Due` · `₦2,387,500` (green)
- Badge: `✓ Calculated`

**Collapsed rows:** Eko Logistics · Marina Tech Ltd (summary visible)

**Totals Footer:**
- `3 Clients Calculated`
- `Total Estimated Tax` · `₦7,352,500` (green, 24px)
- `Avg Effective Rate` · `21.3%`
**Button:** `Generate 3 Reports →` — Green filled

---

## D05 — Verify Client Page

### Layout
Pro shell. Header. Info banner. Verification type tabs. Query section. Results panel.

### Header
**Text:** `🛡 Verify Client` · `Verify Nigerian business registrations and tax compliance status via FIRS and CAC APIs.`

### Info Banner
**Text:** `Verification queries count toward your API usage. Each TIN/BVN lookup = 1 API call. Results are cached for 24 hours.`
**Link:** `View Usage →`

### Verification Type Tabs
- `🏢 TIN Verification (Company)` (active, white pill)
- `👤 BVN Verification (Individual)` (gray)
- `📋 Tax Compliance Certificate` (gray)

### Query Section
**Label:** `Tax Identification Number (TIN)`
**Input:** `1234567-0001` (filled, teal border active)
**Inline label:** `TIN` (floating)
**Button:** `Verify →` — Green filled, 56px, 140px wide
**Helper:** `Format: 8-digit TIN assigned by FIRS. Example: 1234567-0001`
**Recent chips:** `1234567-0001 ×` · `0987654-0002 ×` · `5432198-0003 ×`

### Results Panel (green border, success state)
**Header:**
- Avatar: `ZF` (56px, teal)
- Name: `Zenith Foods Ltd` · `RC-248571`
- Status: `● Active` (green large pill) · `FIRS Verified ✓` (teal small pill)

**Details Grid (2×3):**
- `Registration Type` · `Limited Liability Company`
- `CAC Number` · `RC-248571`
- `TIN` · `1234567-0001`
- `Last Filing Date` · `March 31, 2025` + `On time ✓`
- `Compliance Rate` · `94%` (green, bold) + progress bar
- `Outstanding Liabilities` · `₦0` (green)

**Certificate:**
**Text:** `Tax Clearance Certificate` · `Valid until December 31, 2025`
**Progress bar:** 85% fill (Jun position of Dec validity)

**Buttons:**
- `↓ Download Certificate` — Teal filled
- `Save to Client File` — Green filled
- `Share with Client` — Gray ghost

---

---

# SECTION E — ADMIN PANEL {#section-e}

### Admin Shell (Persistent)
**Top Nav:** `Creditax.ai` + `ADMIN` (red pill badge) + search bar + notification (red "5" badge) + avatar
**Left Sidebar (220px):** `Dashboard` · `Users` · `Professionals` (amber "3" badge) · `Knowledge Base` · `Audit Log` · `Marketplace` · `Settings`

---

## E01 — Admin Dashboard

### Layout
Full-width content (32px padding). System health full-width row. 4 stat cards. Two columns: Left 60% (activity feed) · Right 40% (pending approvals).

### System Health Row
**Text:** `System Health` · `2 seconds ago` (auto-refresh)
**4 status items:**
- `● API Server` — `Operational` (green) · `99.97% uptime`
- `● RAG Engine` — `Operational` · `p95: 420ms`
- `● Database` — `Operational` · `47ms query avg`
- `● Auth Service` — `⚠ Degraded` (amber) · `Elevated latency`

### Stat Cards (4)
1. `Active Users` · `1,247` · `+43 today`
2. `Verified Tax Pros` · `89` · `3 pending approval` (amber)
3. `API Calls Today` · `45,231` · `Peak: 2,847/hr at 14:00`
4. `Platform Revenue` · `₦2,400,000` · `June MTD · +18% vs May`

### System Events Feed
**Title:** `System Events` · `Live` (green blinking dot)
**8 feed rows:** Each has icon, event description, user/email, timestamp (color-coded by type)

### Pending Approvals Card
**Title:** `Marketplace Approvals` · `3 pending` (amber badge)
**3 approval items** each with:
- Business name, applied date, doc verification chips (CAC ✓ FIRS ✓ ID ✓)
**Buttons per item:** `Reject` (red ghost, small) · `Approve ✓` (green filled, small)
**Link:** `View all applications →`

---

## E02 — Admin Users Page

### Layout
Admin shell. Header row. Stats row. User table (10 rows). Edit User modal overlay.

### Header
**Text:** `Users`
**Controls:** Search bar + `Role: All ▾` + `Status: All ▾` + `Date: All Time ▾` dropdowns
**Buttons:** `↓ Export` (gray outline) · `+ Add User` (green filled)

### Stats Row (3)
- `Total Users` · `1,247` · `+43 this week`
- `Active Today` · `387` · `31% DAU rate`
- `New This Week` · `43` · `+22% vs last week`

### User Table (10 rows)
**Columns:** `[checkbox]` · `User` · `Email` · `Role` · `Status` · `Last Active` · `Actions`
**Role badges:** `Super Admin` (red) · `Admin` (amber) · `Tax Pro` (teal) · `User` (gray)
**Status:** `● Active` (green) · `⏸ Suspended` (amber)
**Actions:** `Edit` (teal link) · `Suspend` (amber) · `Delete ×` (red) — varies by role

### Edit User Modal
**Title:** `Edit User — Emeka Obi`
**Fields:** `Full Name` · `Email` · `Role` (dropdown) · `Status` (Active toggle)
**Buttons:** `Save Changes` (green) · `Cancel` (gray) · `Delete User` (red, small left)

---

## E03 — Admin Pro Users Page

### Layout
Admin shell. Header row. 4 stat cards. Status tab group. Two-column: Left 55% (pro list) · Right 45% (detail panel).

### Header
**Text:** `Tax Professionals` · `(89)`
**Controls:** Search bar + `+ Add Professional` (green)

### Stats (4)
- `Total Pros` · `89` · `+3 this month`
- `Pending Verification` · `3` (amber, highlighted card)
- `Verified` · `83` (green)
- `Rejected` · `3` (red)

### Status Tabs
`All (89)` (active) · `Pending (3)` (amber) · `Verified (83)` (green) · `Rejected (3)` (red)

### Pro List (left)
**8 rows, 3 states:**
- Pending rows: amber status pill, `View →` (teal), no rating
- Verified rows: green pill, star rating, `View →`
- Rejected: red pill

### Verification Detail Panel (right)
**Label:** `Verification Review`
**Applicant header:** Avatar + name + email + applied date
**Document rows (3):**
1. `CAC Certificate` — `✓ Verified` (green) · `View ↗`
2. `FIRS Tax Clearance` — `✓ Verified` · `View ↗`
3. `NIN Slip` — `⏳ Under Review` (amber) · `View ↗`

**Verification checklist (4 items):** CAC ✓ · FIRS TIN ✓ · ID ⏳ · Profile ✓

**Admin Note:** Textarea (optional)

**Buttons:**
- `✓ Approve & Verify` — Green filled, full-width
- `✗ Reject Application` — Red ghost, full-width
- `Request More Info →` — Teal centered link

---

## E04 — Audit Log Page

### Layout
Admin shell. Header row. Filter row. Expandable table (12 rows, one expanded). Table footer.

### Header
**Text:** `Audit Log`
**Controls:** `↓ Export CSV` (teal outline) · `System Changes Only` (toggle, OFF)

### Filters
- Date pickers: `[Jun 1, 2025]` → `[Jun 12, 2025]`
- `User: All ▾` · `Action: All ▾` · `Entity: All ▾`
- `Clear Filters` (teal link)
- Count: `Showing 247 events in last 12 days`

### Table
**Columns:** `Timestamp` · `User` · `Action` · `Entity Type` · `Entity Name` · `IP Address` · `Details`
**Action badge types:** `✓ Approved` (green) · `↑ Updated` (teal) · `🗑 Deleted` (red) · `🔄 Re-indexed` (blue) · `+ Created` (green) · `🔐 Login` (amber) · `⚙ Config` (purple) · `⚠ Error` (red)

**Expanded row (row 1):**
- Before: `status: pending` (red mono text)
- After: `status: verified` (green mono)
- Reason text

### Table Footer
**Text:** `Showing 1–12 of 247 events`
**Pagination** + `50 per page ▾` dropdown

---

## E05 — Knowledge Base Editor

### Layout
Minimal top bar. Three-panel: Left (document tree 240px) · Center (markdown editor 50%) · Right (live preview 50%).

### Top Bar
**Text:** `Creditax.ai` + `ADMIN` badge + breadcrumb: `Knowledge Base`
**Document controls:** Title input `FIRS VAT Guide 2024`
**Buttons:**
- `Last saved 2 min ago` (gray text)
- `Re-embed 🔄` — Teal outline
- `Unpublish` — Amber outline
- `Publish` — Green filled

### Left — Document Tree
**Folders:**
- `📁 Tax Documents` (expanded)
  - `📄 NTA 2023`
  - `📄 NTAA 2023`
  - `📄 FIRS VAT Guide` (active, teal)
  - `📄 WHT Guidelines`
  - `📄 PITA Summary`
  - `📄 CIT Guide 2024`
  - `+ Add document`
- `📁 Credit Documents` (collapsed)
- `📁 API Reference` (collapsed)
- `📁 Legal & Compliance` (collapsed)
**Footer:** `12 documents · 847 chunks`

### Center — Editor
**Toolbar icons:** `B` · `I` · `H1` `H2` `H3` · `"` (quote) · `{}` (code) · `🔗` · `📋` (list) · `—` · `📷`

**Content (markdown, syntax highlighted):**
```
# FIRS VAT Guide 2024
## Overview
Value Added Tax (VAT) in Nigeria is governed by the **VAT Act Cap V1 LFN 2004**
## Current VAT Rate
The standard VAT rate in Nigeria is **`7.5%`**
### Exempt Goods & Services
- Basic food items (unprocessed)
- Medical products and services
- Educational materials
- Baby products
## Filing Deadlines
VAT returns must be filed on or before the **21st day**
```

**Bottom bar:** `Line 16, Col 45` · `1,247 words · 42 chunks` · `Markdown ▾`

### Right — Live Preview
**Label:** `LIVE PREVIEW · Rendered Output`
**Content:** Rendered HTML of same markdown content

**Bottom bar:** `Preview mode: Rendered` · `42 RAG chunks · avg 280 tokens` (teal mono)

---

## E06 — Admin Settings Page

### Layout
Admin shell + outer sidebar + inner settings sidebar (200px, General active). Main content max-width 680px.

### Inner Settings Sidebar
`General` (active) · `API Settings` · `Security` · `Integrations` · `Billing`

### General Section
**Title:** `General Settings` · `Platform-wide configuration.`

**Fields:**
- `Platform Name` — `Creditax.ai`
- `Support Email` — `support@creditax.ai` + `✓ Verified`
- `Logo` — file upload row + current file name
- `Favicon` — file upload row

**Maintenance Mode Card:**
**Text:** `🔴 Maintenance Mode` · `When enabled, all users will see a maintenance page. APIs will return 503.`
**Toggle:** OFF (gray)
**Warning:** `⚠ Enabling this will immediately take the platform offline for all users.`

**Button:** `Save General Settings` — Green filled

### API Settings Section (below)
**Fields:**
- `Default Rate Limit (req/min)` — `60` input + `per API key` label
- `Pro Rate Limit` — `300`
- `Enterprise Rate Limit` — `Unlimited` (gray italic)
- `Webhook Secret Key` — masked + `🔄 Rotate` (teal) + `📋 Copy` (gray)
- `Allowed Origins (CORS)` — textarea with 3 domain values

### Integrations Section
**3 rows:**
1. `Mono API` — `● Connected` (green) + masked key + `Rotate Key` (teal)
2. `Mapbox GL` — `● Connected` (green) + masked key + `Rotate`
3. `FIRS Verification API` — `⚠ Rate Limited` (amber) + `12/15 req/min used` + `View Quota`

---

---

# SECTION F — DEVELOPER HUB {#section-f}

### Developer Hub Shell (Persistent)
**Top bar (56px):** Logo + `Developers / [page]` breadcrumb + search bar + version selector `v2.1.0 ▾` + `Get API Key →` (green)
**Left sidebar (220px):** Docs navigation by category (Getting Started · Tax Endpoints · Credit Endpoints · AI Assistant · SDKs)

---

## F01 — API Explorer

### Layout
Top bar (with sandbox/production toggle center). Left sidebar (endpoint nav). Center panel (request builder). Right panel (code snippets).

### Sandbox Toggle
**Text:** `🟢 Sandbox` (active, green) · `⚡ Production` (gray, inactive)

### Left Sidebar
**Sections + endpoints:**
- `TAX` (expanded) — `POST /tax/calculate` (active) · `GET /tax/brackets` · `POST /tax/vat` · `GET /tax/wht-tables`
- `CREDIT` (collapsed)
- `DOCUMENTS` (collapsed)
- `AUTH` (collapsed)
- `MARKETPLACE` (collapsed)
**Footer pill:** `🟢 SANDBOX MODE — Safe to test`

### Center Panel — Request Builder
**Endpoint display:** `POST` (green badge) · `/v2/tax/calculate` (white mono, 16px)

**Tabs:** `Params` (active) · `Headers` · `Body` · `Auth`

**Param fields:**
- `income` — `12000000` (Required, teal badge)
- `tax_year` — `2024` (Required)
- `state` — `Lagos` (Optional, gray badge)
- `include_reliefs` — Toggle ON (Optional)
- `entity_type` — Pill toggle: `individual` (active) · `corporate`

**Button:** `Send Request →` — Green filled, full-width, 52px

**Response panel:**
- Status: `200 OK` (green) + `142ms` (gray)
- JSON response (syntax highlighted)

### Right Panel — Code Snippets
**Language tabs:** `cURL` (active) · `JS` · `Python` · `Go`
**Code block:** Full cURL command with syntax highlighting
**Copy button:** `📋 Copy` (teal pill, top-right of block)
**Button:** `Run in Sandbox` — Green outline, full-width

---

## F02 — Quickstart Page

### Layout
Left sidebar + main content (max 780px) + right sidebar.

### Page Header
**Text:** `Quickstart` · `Make your first Creditax.ai API call in under 5 minutes.`

### Language Selector
**Tabs:** `$ cURL` (active) · `JS Node.js` · `🐍 Python` · `Go`

### Step Progress (4 steps)
- Step 1: `Get API key` — ✓ teal (completed, strikethrough)
- Step 2: `Install SDK` — ⏳ amber spinner (CURRENT)
- Step 3: `Make first request` — ○ gray
- Step 4: `View response` — ○ gray
**Label:** `Step 2 of 4`

### Active Step Content (Step 2 — Install SDK)
**Background number:** `02` (teal, 48px, 15% opacity)
**Title:** `Install the SDK`
**Text:** `Install the official Creditax.ai Node.js package using npm or yarn.`

**Code Block 1 (bash):**
```
npm install @creditax/node
```
`📋 Copy` button

**Code Block 2 (JavaScript):**
```javascript
import { CreditaxClient } from '@creditax/node';
const client = new CreditaxClient({
  apiKey: process.env.CREDITAX_API_KEY,
  environment: 'sandbox'
});
```
`📋 Copy` button

### Navigation
**Buttons:**
- `← Step 1: Get API Key` — Ghost gray, 48px, 180px
- `Step 3: Make First Request →` — Green filled, 48px, 240px

### Right Sidebar
**Progress bar:** 50% teal fill · `Step 2 of 4`
**Checklist card:** 4 items (2 checked, 2 pending)
**Helpful Links:** `API Reference →` · `SDK on GitHub ↗` · `Join Discord Community ↗` · `Get Support →`
**Text:** `⏱ ~3 min remaining`

---

## F03 — API Reference Page

### Layout
Left sidebar (category nav) + Center content (endpoint spec, 55%) + Right rail (ToC + try button, remaining).

### Top Bar Additions
**Search:** `Search endpoints, parameters...` (400px center)
**Version:** `v2 (stable) ▾` (teal, active) — dropdown includes `v1 (legacy)`

### Left Sidebar — Endpoint Tree
- `📊 TAX` (expanded, teal)
  - `POST /calculate` (active, teal left border)
  - `GET /brackets`
  - `POST /vat`
  - `GET /wht`
- `💳 CREDIT` (collapsed)
- `📄 DOCUMENTS` (collapsed)
- `🔐 AUTH` (collapsed)
- `🏪 MARKETPLACE` (collapsed)

### Center — Endpoint Block
**Endpoint header:**
- Badge: `POST` (green)
- Path: `/v2/tax/calculate` (white mono, 20px)
- Badge: `🔐 Auth Required` (gray)
**Button:** `Try in Sandbox →` (teal, 32px)

**Description text:** Full endpoint description paragraph

**Auth strip (amber):** Bearer token requirement note

**Request Parameters table:**
- `income` · `number` · `✓` Required · Description
- `tax_year` · `integer` · `✓` · Description
- `state` · `string` · `○` Optional · Description
- `include_reliefs` · `boolean` · `○` · Description
- `entity_type` · `enum` · `○` · Description

**Request Body Example:** Code block with `📋 Copy`

**Response Schema:** Code block with `200 OK` green badge, `📋 Copy`

**Error Codes table:**
- `400 Bad Request` · `income is required`
- `401 Unauthorized` · `Invalid API key`
- `422 Unprocessable` · `Invalid state value`
- `429 Too Many Requests` · `Rate limit exceeded`

### Right Rail
**ToC links:** `Authentication` · `Parameters` · `Request Body` · `Response` · `Error Codes`
**Button:** `Try in Sandbox` — Green filled, full-width
**Related Endpoints:** 3 mono-text links in dark cards

---

## F04 — SDKs Page

### Layout
Left sidebar + main content (full width). Page header → Official Libraries (3-col card grid) → Community Libraries → Request CTA.

### Page Header
**Text:** `Client Libraries` · `Official and community-maintained SDKs for the Creditax.ai API.`

### Section Label
**Text:** `OFFICIAL LIBRARIES` · `Maintained by the Creditax.ai team · Updated with every API release`

### SDK Cards (5, 3-col grid)

**Card 1 — JavaScript/TypeScript (teal left border, featured):**
- Icon: JS/TS language icon (40px)
- Title: `JavaScript / TypeScript`
- Package: `@creditax/node` (teal mono)
- Badge: `v2.1.4` (teal)
- Status: `● Stable · Last updated 2 days ago` + `TypeScript types included`
- Install: `npm install @creditax/node` (code block, green) + `📋 Copy`
- Alt: `or: yarn add @creditax/node`
- Links: `📖 Docs →` · `GitHub ↗` · `npm ↗`

**Card 2 — Python:** `creditax-python` · `v2.0.8` · `pip install creditax` · Same links

**Card 3 — Go:** `creditax-go` · `v2.0.3` · `go get github.com/creditax-ai/creditax-go` · Same links

**Card 4 — Ruby:** `creditax-ruby` · `v1.8.1` (amber badge, older) · `gem install creditax`

**Card 5 — PHP:** `creditax/php-sdk` · `v1.4.0` (amber) · `composer require creditax/php-sdk`

### Community Libraries Section
**Text:** `COMMUNITY LIBRARIES` · `Built by the community. Not officially maintained by Creditax.ai.`
**2 community cards:** `creditax-dart` by `@kelechi_dev` + `GitHub ↗` / `creditax-kotlin` by `@techlagos` + `GitHub ↗`

### Request CTA Row
**Text:** `Missing your language?` · `Request an SDK or contribute to an existing one.`
**Button:** `Request Library →` — Teal outline, 44px

---

## F05 — Sandbox Environment

### Layout
Left sidebar + main content. Environment toggle banner (full width). API key display. Capabilities grid. Test data table. Danger zone. Upgrade CTA.

### Environment Toggle Banner
**Text:** `🟢 SANDBOX` (green large pill) · `ENVIRONMENT` (gray)
**Toggle pills:** `Sandbox` (active green) · `Production` (gray)
**Note:** `⚡ Switching to Production uses real data and real API credits.`

### Sandbox API Key
**Text:** `Your Sandbox API Key`
**Key:** `sk_sandbox_****************************2b91` (masked, white mono)
**Links:** `📋 Copy` · `🔄 Rotate`
**Helper:** `This key is for testing only. It never charges real money or affects real data.`

### Capabilities Grid (3 cards)

**Card 1 — Tax Calculations:** Badge `SANDBOX` (green pill)
- `✓ Income Tax — Simulated`
- `✓ VAT Calculator — Simulated`
- `✓ WHT Tables — Real data (FIRS)`
- Helper text

**Card 2 — AI Tax Assistant:** Badge `SANDBOX`
- `✓ Full RAG responses — Active`
- `✓ All FIRS documents available`

**Card 3 — Document OCR:** Badge `SANDBOX`
- `✓ OCR extraction — Simulated`
- `✓ Sample documents provided`
- `✓ Amount extraction works`

### Sample Test Data Table
**Left:** Test TINs (3 values, teal mono) + descriptions
**Right:** Test Incomes (3 Naira values)

### Danger Zone Card
**Text:** `🗑 Reset Sandbox Data` · `Delete all sandbox test records and start fresh.`
**Button:** `Reset Sandbox →` — Red ghost, 40px

### Upgrade CTA
**Text:** `⚡ Ready for Production?` · `Switch to a live API key to go live. Pro plan includes 100,000 calls/month.`
**Button:** `Upgrade to Pro →` — Green filled, 44px

---

## F06 — Webhooks Management Page

### Layout
Left sidebar + main content. Header row. Endpoint cards (2). Add Endpoint right slide panel (open). Recent Deliveries list.

### Header
**Text:** `Webhooks`
**Button:** `+ Add Endpoint` — Green filled

### Endpoint Card 1 (Active, green left border)
**Status:** `● Active` (green)
**URL:** `https://api.zenithfoods.ng/webhooks/creditax`
**Event pills:** `document.processed` · `credit.score.updated` · `tax.filing.submitted` (teal mono pills)
**Stats:** `Last triggered: 14 min ago` · `Success rate: 99.1%` (green) · `Avg response: 234ms`
**Actions:** `Edit` (teal) · `Delete ×` (red)

### Endpoint Card 2 (Failed, red left border)
**Status:** `⚠ Failed` (red)
**URL:** `https://hooks.ekologistics.ng/tax-events`
**Events:** `pro.application.received` · `document.processed` (amber mono)
**Stats:** `Last triggered: 3 hrs ago` · `Success rate: 67.3%` (red) · `Last error: 502 Bad Gateway` (red)
**Error strip:** `⚠ 3 consecutive failures detected. Check your endpoint URL and server status.` + `View Error Logs →`

### Add Endpoint Slide Panel
**Title:** `Add Webhook Endpoint`
**Fields:**
- `Endpoint URL *` — `https://your-server.com/webhooks` (placeholder)
- `Subscribe to Events` (section label)
- Checkboxes: ☑ `document.processed` + description · ☑ `credit.score.updated` · ☑ `tax.filing.submitted` · ☐ `pro.application.received` · ☐ `user.registered`
- `Signing Secret` — Auto-generated masked value + `🔄 Regenerate`
- Helper: `We'll sign all payloads with this secret. Verify in your server using HMAC-SHA256.`

**Buttons:**
- `Test Endpoint` — Teal outline, full-width
- `Save Endpoint →` — Green filled, full-width

### Recent Deliveries
**Title:** `Recent Deliveries` · `Last 24 hours`
**7 rows:** Event type (teal mono) · Timestamp · Status (`200 OK` green or `502` red) · Response time · `▶ View Payload` (teal link)

---

---

# SECTION G — COMPONENT & MOBILE SYSTEM {#section-g}

---

## G01 — Mobile Navigation Patterns

### Layout
Design documentation canvas (9:16). Shows: Tab bar component → Active state variants → Notification badge example → Mini phone mockup.

### Bottom Tab Bar Component
**5 tabs:**
1. `Home` — house icon, gray (inactive)
2. `Upload` — **ELEVATED FAB** (56px green circle, upload arrow icon, green glow — primary action)
3. `Chat` — chat bubble icon, gray
4. `Credit` — gauge icon, **teal** (active example)
5. `Profile` — person icon, gray

**Tab active state:** Teal icon + teal label + 4px teal indicator dot above

### Notification Badge
**Example:** Chat icon + red `3` badge (18px, top-right of icon)

### Mini Phone Mockup
Shows the tab bar in context of the consumer dashboard screen.

### Technical Notes Text
- `Minimum tap target: 44×44px (Apple HIG)`
- `Safe area bottom: 34px for iPhone X+`
- `Upload button: 56px diameter, elevated 20px`

---

## G02 — Notification & Toast System

### Layout
Design documentation canvas (16:9, desktop). Two columns: Left (Toast Notifications — Floating) · Right (Inline Notifications — Within Cards). Below: Badge Variants.

### Toast Notifications (4 types, left column)

**Toast 1 — Success (green left border 4px):**
- Icon: Green circle + white checkmark
- Title: `Document extracted successfully`
- Sub: `Bank_Statement_May2025.pdf · 3 pages · ₦2.4M detected`
- Dismiss: `✕`
- Auto-dismiss progress bar: 75% green fill

**Toast 2 — Error (red left border):**
- Icon: Red circle + white `✕`
- Title: `Failed to process document`
- Sub: `Please try again or use a higher quality image.`
- Action links: `Try Again` (red) · `Get Help` (gray)
- Progress bar: red

**Toast 3 — Info (blue left border):**
- Icon: Blue circle + `i`
- Title: `Your tax filing is due in 30 days`
- Sub: `PITA filing deadline: July 31, 2025. Start now to avoid late fees.`
- Action: `View →` (blue) + `✕`
- Progress bar: blue

**Toast 4 — Warning (amber left border):**
- Icon: Amber circle + `!`
- Title: `API usage at 80% of monthly limit`
- Sub: `8,431 / 10,000 calls used. Upgrade to Pro for unlimited calls.`
- Action: `Upgrade` (amber) + `✕`
- Progress bar: amber

### Inline Notifications (4 types, right column)

**Inline 1 — Success (green strip, 8% green bg):**
- Icon: ✓ (green, 18px)
- Text: `AI extraction complete · 12 line items found`
- Action: `View Results →` (green link)

**Inline 2 — Warning (amber strip):**
- Icon: ⚠ (amber)
- Text: `Savings Pattern score is low. Upload 3 bank statements to improve.`
- Action: `Upload Now` (amber link)

**Inline 3 — Error (red strip):**
- Icon: ✕ circle (red)
- Text: `FIRS API unavailable. Tax calculation paused. Retrying in 60s...`
- Action: `Retry Now` (red link)

**Inline 4 — Info (blue strip):**
- Icon: `i` (blue)
- Text: `New feature: You can now request a Lender Match directly from your credit score.`
- Action: `Try It →` (blue link)

### Badge Variants Row
**Navigation badge:** Nav icon + red `3` count circle (18px)
**Status pills:**
- `✓ Verified` — green bg/border/text
- `⏳ Processing` — amber
- `✗ Failed` — red
- `● Live` — blue + pulsing dot

---

## G03 — Onboarding Empty States (Mobile, 9:16)
*(Already documented in C12 and C13 above.)*

---

---

# GLOBAL NAVIGATION LINK REFERENCE

## All Top-Level Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Landing Hero | None |
| `/pricing` | Pricing | None |
| `/about` | About | None |
| `/blog` | Blog Listing | None |
| `/blog/[slug]` | Blog Post | None |
| `/status` | System Status | None |
| `/marketplace` | Marketplace | None |
| `/marketplace/[proId]` | Pro Profile | None |
| `/developers` | API Explorer | USER+ |
| `/developers/quickstart` | Quickstart | USER+ |
| `/developers/reference` | API Reference | USER+ |
| `/developers/sdks` | SDKs | None |
| `/developers/sandbox` | Sandbox | USER+ |
| `/developers/webhooks` | Webhooks | USER+ |
| `/login` | Login | None (redirects if authed) |
| `/signup` | Signup | None |
| `/dashboard` | Consumer Dashboard | USER |
| `/dashboard/credit` | Credit Overview | USER |
| `/dashboard/credit/detail` | Credit Detail | USER |
| `/dashboard/tax-filing/[step]` | Filing Wizard | USER |
| `/dashboard/documents` | My Documents | USER |
| `/dashboard/documents/upload` | Upload | USER |
| `/dashboard/reports` | Reports | USER |
| `/dashboard/settings` | Settings | USER |
| `/dashboard/keys` | API Keys | USER |
| `/dashboard/usage` | Usage Analytics | USER |
| `/pro/dashboard` | Pro Dashboard | TAX_PRO |
| `/pro/clients` | Client Management | TAX_PRO |
| `/pro/clients/[id]` | Client Detail | TAX_PRO |
| `/pro/clients/[id]/documents` | Client Docs | TAX_PRO |
| `/pro/calculations` | Bulk Calculations | TAX_PRO |
| `/pro/reports` | Pro Reports | TAX_PRO |
| `/pro/verify` | Verify Client | TAX_PRO |
| `/pro/settings` | Pro Settings | TAX_PRO |
| `/pro/apply` | Application Flow | USER |
| `/admin/dashboard` | Admin Dashboard | ADMIN |
| `/admin/users` | User Management | ADMIN |
| `/admin/professionals` | Pro Management | ADMIN |
| `/admin/marketplace` | Approvals Queue | ADMIN |
| `/admin/audit` | Audit Log | ADMIN |
| `/admin/knowledge-base` | KB Editor | SUPER_ADMIN |
| `/admin/departments` | Departments | SUPER_ADMIN |
| `/admin/facilities` | Facilities | SUPER_ADMIN |
| `/admin/settings` | System Settings | SUPER_ADMIN |

---

> **Total Screens Documented:** 57 (desktop) + mobile variants
> **Sections:** Marketing (9) · Auth (2) · Consumer Dashboard (15) · Pro Portal (11) · Admin Panel (9) · Developer Hub (6) · Component System (5)
> **Design System:** Syne + JetBrains Mono · Token-based theming (dark/light) · shadcn/ui base components
