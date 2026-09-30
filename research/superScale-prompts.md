# SuperScale.ai Prompts Guide

**Version:** 1.2
**Date:** June 12, 2026
**Purpose:** All prompts needed to generate marketing materials for Creditax.ai using SuperScale.ai

---

## Changelog

### v1.2 (June 12, 2026)
- Added Section 5.17: 16x9 Combined Screen Layouts (8 combined layouts)
  - Auth pages (login + signup side-by-side)
  - B2C Onboarding flow (2x2 grid)
  - Marketplace user flow (3-panel horizontal)
  - Tax filing wizard steps (2x2 grid)
  - Pro application flow (5-panel horizontal)
  - Settings pages (2x2 grid)
  - Error & edge case states (2x3 grid)
  - Mobile screens combined (2x2 grid of phones)
- Added Section 6: Complete Remaining Features Inventory (43 screens/features)
  - Public pages (5 remaining: Docs, Blog, About, Status, Footer)
  - B2C Consumer (10 remaining: Upload, Documents, Reports, API Keys, Usage, Settings)
  - B2B Tax Pro (8 remaining: Clients, Documents, Calculations, Reports, Verify, Settings)
  - Admin (8 remaining: Users, Professionals, KB Editor, Audit, Departments, Facilities, Approvals, Settings)
  - Developer Portal (6 remaining: Explorer, Quickstart, Reference, SDKs, Sandbox, Webhooks)
  - API/Backend (13 remaining: Keys, Tax Calc, RAG, Documents, Credit, Mono, Mapbox, Trigger, Webhooks, Rate Limit, KB Editor, Pro Onboarding)
- Added individual prompts for all 31 remaining screen designs

### v1.1 (June 12, 2026)
- Added prominent logo section at top (Section 0) with full logo package prompt
- Added logo variations prompt (minimal, horizontal, stacked, monogram, with tagline)
- Added favicon and app icon set prompt
- Added Section 6: Front-End UI Design Variations (16 page designs)
  - Landing page hero, features, pricing
  - Auth pages (login/signup)
  - B2C dashboard, credit score, tax filing wizard
  - B2B pro dashboard, client detail
  - Marketplace listing, pro profile, application flow
  - Admin dashboard, mobile navigation, empty states, notifications

### v1.0 (June 12, 2026)
- Initial prompt guide for SuperScale.ai
- Covers: Product mock-ups, explainer videos, brand/logo, design system
- Brand colors and voice guidelines included

---

## IMPORTANT: Start with the Logo

The logo is the foundation of all other designs. Generate this FIRST before any other assets.

---

## 0. Logo Design (PRIORITY #1)

### 0.1 Primary Logo — Full Package

```
DESIGN A LOGO FOR "CREDITAX.AI"

Company: Creditax.ai
Tagline: "Tax Smart. Borrow Smart."
Type: Fintech / Tax Tech / Credit Platform
Market: Nigeria, Africa

BRAND COLORS:
- Deep Teal: #0D7377 (primary)
- Bright Green: #32E875 (accent/success)
- Dark Background: #0A0F14

BRAND PERSONALITY:
- Trustworthy (like a good accountant)
- Clear (no jargon)
- Optimistic (progress over problems)
- Modern but rooted (African identity + global technology)

WHAT TO CONVEY:
- Financial intelligence (subtle money/data motif)
- Nigerian identity (recognizable as Nigerian brand)
- Tech-forward and modern
- Trust and reliability
- The "credit + tax" connection

LOGO STYLES TO CREATE:

1. COMBINATION MARK (Main Logo)
   - Icon/symbol on left
   - "Creditax" wordmark on right
   - Include ".ai" as smaller text
   - This is the PRIMARY logo

2. ICON ONLY (For app icon, favicon, small uses)
   - Symbol that works without text
   - Should be recognizable at 16x16 pixels
   - Square proportions

3. WORDMARK (For horizontal layouts, letterheads)
   - Stylized "Creditax" text only
   - Can include tagline below

4. LOGO ON DARK BACKGROUND
   - White/light version for dark backgrounds

5. LOGO ON LIGHT BACKGROUND
   - Full color version for light backgrounds

TECHNICAL REQUIREMENTS:
- Vector format (SVG, AI, EPS)
- All versions listed above
- Monochrome version (single color)
- Favicon version (16x16, 32x32, 48x48)
- Apple Touch Icon (180x180)
- Social media profile image (400x400)

CREATIVE DIRECTION:
The logo should feel like Stripe meets Nigerian warmth. Not overly corporate. Not trying to be American or European. It should feel like:
- A trusted financial tool
- Something that understands Nigeria specifically
- Modern and innovative
- Approachable, not intimidating
- Professional but friendly

ICON IDEAS (for inspiration, not instruction):
- Abstract "C" shape with tax document motif
- Stylized naira sign merged with checkmark
- Credit card/chip with African pattern
- Graph trending up with African continent silhouette
- Tax document with credit score gauge

DESIGNER NOTES:
- The "C" in Creditax could incorporate a document outline
- Green can be used sparingly for positive actions
- Keep it simple — should work in monochrome
- Think about how it looks as a tiny favicon

Output: ZIP file with all logo variations (SVG + PNG), favicon set, source files
```

### 0.2 Logo Variations

```
REFINE THE LOGO WITH THESE VARIATIONS:

Variation 1: Minimal Icon
- Remove text, icon only
- Single color (teal on white, white on dark)
- Perfect for app icon, favicon, watermarks

Variation 2: Horizontal Lockup
- Icon left, text right
- Wide proportions
- For website header, presentations

Variation 3: Stacked Lockup
- Icon top, text bottom
- Square proportions
- For social media profile, app splash

Variation 4: Monogram
- Stylized "C" or "CA" letters
- Very small uses, embossing, stamps

Variation 5: With Tagline
- Full logo + "Tax Smart. Borrow Smart." below
- For print materials, pitch decks

Output: ZIP file with all variations in SVG + PNG
```

### 0.3 Favicon & App Icon Set

```
CREATE FAVICON AND APP ICON SET FOR "CREDITAX.AI"

Sizes needed:
- 16x16 (favicon, browser tab)
- 32x32 (favicon, retina)
- 48x48 (favicon)
- 64x64 (Windows tile)
- 96x96 (Google TV)
- 180x180 (Apple Touch)
- 192x192 (Android Chrome)
- 512x512 (PWA)
- 1024x1024 (App Store)

Design requirements:
- Single color (teal #0D7377) on transparent background
- Works as square and circle masks
- Simple enough to be recognizable at 16x16
- Matches primary logo design

Output: ZIP file with all sizes as PNG + SVG source
```

---

## Brand Reference

Before generating content, here's the brand foundation:

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Deep Teal** | `#0D7377` | Primary brand — trust, stability |
| **Light Teal** | `#14919B` | Accent buttons, links |
| **Bright Green** | `#32E875` | Success, CTAs, money/tax positive |
| **Dark Background** | `#0A0F14` | Premium tech feel |
| **Light Background** | `#F4F9F9` | Clean cards |
| **Primary Text** | `#1A2B3C` | Main body copy |
| **Muted Text** | `#6B7B8C` | Secondary text |

### Typography
- **Primary:** Inter (Google Fonts)
- **Mono:** JetBrains Mono (amounts, code)

### Voice
- Trustworthy (like a good accountant)
- Clear (no jargon)
- Optimistic (progress over problems)
- Modern but rooted (African identity + global tech)

### Tagline Options
- "Tax Smart. Borrow Smart."
- "Your AI-Powered Tax & Credit Intelligence"
- "The Platform for Financial Clarity"

---

## 1. Product Mock-up Prompts

### 1.1 Developer Dashboard (Dark Mode)

```
Create a product mock-up of a developer dashboard for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark mode interface (#0A0F14 background)
- Primary accent: Deep Teal (#0D7377)
- Secondary accent: Bright Green (#32E875)
- Show an API key management view with:
  - API key displayed (partially masked: sk_live_****8f3a)
  - "Copy" and "Regenerate" buttons
  - Usage meter showing 2,847 / 10,000 requests
  - Simple line chart showing API calls over time
  - Left sidebar navigation with: Dashboard, API Keys, Usage, Docs, Settings
- Modern, clean SaaS aesthetic like Stripe or Linear
- Include subtle gradients and card shadows
- Nigerian context is NOT shown in the UI itself

Output: High-fidelity product screenshot, dark mode, 1920x1080
```

### 1.2 RAG Chat Interface

```
Create a product mock-up of an AI-powered tax Q&A chat interface for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark mode interface (#0A0F14 background)
- Primary accent: Deep Teal (#0D7377)
- Chat interface showing conversation with AI assistant
- User message: "How do I calculate VAT on imported services?"
- AI response showing formatted tax guidance with bullet points
- Source citation: "Based on FIRS VAT Guide 2024"
- Input field at bottom with placeholder: "Ask about Nigerian taxes..."
- Left sidebar showing: Dashboard, Tax Filing, Documents, Credit Score, Chat, API Keys
- Clean, minimal design with good whitespace
- Similar aesthetic to ChatGPT or Claude interface

Output: High-fidelity product screenshot, dark mode, 1920x1080
```

### 1.3 Tax Professional Marketplace (Map View)

```
Create a product mock-up of a tax professional marketplace search interface for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark mode interface (#0A0F14 background)
- Primary accent: Deep Teal (#0D7377)
- Secondary accent: Bright Green (#32E875)
- Split view layout:
  - Left 40%: Search filters (Service: VAT Filing, Location: Lagos, Rating: 4+ stars)
  - Right 60%: Map view with 3 location markers in Lagos
- Cards below map showing 2 tax professionals:
  - Profile photo placeholder (professional headshot)
  - Business name, verified badges (CAC, FIRS)
  - Star rating (4.8), review count (127)
  - Services offered as pills
  - Distance indicator
- Search bar at top: "Find a tax professional near you"
- Modern, trustworthy marketplace aesthetic

Output: High-fidelity product screenshot, dark mode, 1920x1080
```

### 1.4 Credit Score View

```
Create a product mock-up of a credit health score dashboard for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark mode interface (#0A0F14 background)
- Primary accent: Deep Teal (#0D7377)
- Large circular score gauge showing "720" in center with label "Good"
- Score breakdown section showing:
  - Tax Filing History: +45 points (green bar)
  - Document Consistency: +30 points (green bar)
  - Income Stability: +25 points (green bar)
  - Savings Pattern: +20 points (green bar)
- Educational tooltip: "Your tax compliance history is a strong indicator of creditworthiness"
- CTA button: "How to Improve"
- Clean, financial dashboard aesthetic
- Subtle background gradient

Output: High-fidelity product screenshot, dark mode, 1920x1080
```

### 1.5 Mobile: Document Upload

```
Create a mobile product mock-up of a document upload screen for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Mobile frame (iPhone 14 Pro or similar)
- Dark mode interface (#0A0F14 background)
- Camera-first upload UI
- Large dashed upload zone in center with camera icon
- Text: "Tap to capture or drag to upload"
- Supported formats: JPG, PNG, PDF (smaller text)
- Recent uploads section below:
  - Receipt thumbnail
  - Status: "Extracted: ₦45,000 | Office Supplies"
  - Checkmark indicating verified
- Bottom navigation: Home, Upload, Chat, Credit, Profile
- Primary accent: Deep Teal (#0D7377)

Output: High-fidelity mobile screenshot, dark mode, 9:19.5 aspect
```

### 1.6 Tax Filing Wizard (Mobile)

```
Create a mobile product mock-up of a guided tax filing step for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Mobile frame (iPhone 14 Pro or similar)
- Dark mode interface (#0A0F14 background)
- Progress indicator at top: "Step 2 of 5: Review Deductions"
- Progress bar below (40% filled, teal)
- Chat-like interface showing AI assistant message:
  "Based on your uploaded receipts, I found ₦2.4M in deductible expenses. Want me to add these?"
- List of expenses with checkmarks:
  - Office Supplies: ₦45,000 ✓
  - Transportation: ₦120,000 ✓
  - Equipment: ₦380,000 ✓
- Running total card at bottom:
  - "Total Deductions: ₦2,450,000"
  - "Estimated Tax Savings: ₦612,500"
- Primary accent: Deep Teal (#0D7377)
- Bright Green (#32E875) for positive savings

Output: High-fidelity mobile screenshot, dark mode, 9:19.5 aspect
```

---

## 2. Explainer Video Prompts

### 2.1 What is Creditax.ai? (60 sec)

```
Create a 60-second explainer video for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Script/Voiceover Direction:
"Tax season in Nigeria is confusing. The rules changed in 2026, and most people don't know where to start. That's where Creditax comes in.

We're building the missing API for Nigerian taxes — a developer platform that lets any app calculate tax, verify TIN numbers, and integrate tax intelligence.

But here's what makes us different: your tax compliance history directly improves your credit score. File your taxes consistently? Your credit health goes up. It's that simple.

We also connect you with verified tax professionals across Nigeria — vetted, trusted experts ready to help.

Tax Smart. Borrow Smart. That's Creditax."

Visual Direction:
- Open: Dark tech aesthetic, Nigerian skyline silhouette
- Animation: API code flowing, tax calculations appearing
- Show credit score improving as tax filing icons check off
- Transition: Map of Nigeria with location pins appearing
- Close: Logo reveal with tagline

Colors: Deep Teal (#0D7377), Bright Green (#32E875), Dark BG (#0A0F14)
Style: Modern, trustworthy, professional but approachable
Audio: Confident Nigerian-accented voiceover, subtle tech sounds

Output: 60-second video, 16:9, MP4
```

### 2.2 How to Calculate Tax in 3 Lines of Code (45 sec)

```
Create a 45-second developer-focused demo video for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Script/Voiceover Direction:
"Three lines of code to calculate Nigerian income tax. That's it.

First, you get your API key. Then, you send the income. And boom — you get the full breakdown including PAYE, deductions, and take-home pay.

No more hunting down tax brackets. No more guessing. Just accurate calculations powered by the latest Nigerian Tax Act.

Build it into your payroll app, your accounting software, or your financial dashboard. The API handles the complexity so you don't have to.

Check the docs. Get your key. Start building."

Visual Direction:
- Code editor on left, output on right
- Syntax highlighting with teal highlights
- Show each line appearing as voiceover mentions it
- Output JSON appearing with smooth animation
- Subtle background: dark mode code environment
- Overlay text: API endpoint URL

Colors: Deep Teal (#0D7377), Dark BG (#0A0F14), syntax highlighting in brand colors
Style: Developer-focused, clean code aesthetic, fast-paced
Audio: Technical, precise voiceover, subtle keypress sounds

Output: 45-second video, 16:9, MP4
```

### 2.3 Find a Tax Pro Near You (60 sec)

```
Create a 60-second marketplace explainer for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Script/Voiceover Direction:
"Need help with your taxes but don't know who to trust?

Creditax brings you Nigeria's first verified tax professional marketplace.

Every professional on our platform is vetted — CAC registration verified, FIRS credentials checked, identity confirmed.

Search by location, service, or price. Or just ask our AI: 'Find a VAT expert near Lagos Island.' We'll show you verified pros within kilometers of you.

See their ratings, reviews, and pricing upfront. Contact them directly — call, WhatsApp, or email. No middleman.

Find trusted tax help. Anywhere in Nigeria."

Visual Direction:
- Nigerian map appearing with location pins
- Search bar appearing: "I need help with VAT filing in Lagos"
- AI processing visualization
- Results appearing: professional cards with photos, badges, distance
- Map with markers in Lagos area
- Contact options appearing (call, WhatsApp icons)
- Professional card expanding with full details

Colors: Deep Teal (#0D7377), Bright Green (#32E875) for verified badges, Dark BG (#0A0F14)
Style: Trustworthy, marketplace feel, human and professional
Audio: Warm, reassuring voiceover

Output: 60-second video, 16:9, MP4
```

### 2.4 How Tax Compliance Improves Credit (90 sec)

```
Create a 90-second educational video for "Creditax.ai" - an AI-powered tax and credit intelligence platform for Nigeria.

Script/Voiceover Direction:
"Here's something most lenders won't tell you: how you handle your taxes affects your credit score.

Think about it. Someone who files consistently, keeps good records, and stays compliant — they're demonstrating exactly the behaviors that make a good borrower.

That's the insight behind Creditax. We bridge tax compliance and creditworthiness.

When you file your taxes through our platform, we track your compliance history. Consistent filing? That's +points. Documented deductions? That's +points. Clean record over time? Your credit health score goes up.

This isn't magic. It's math. We're just using data that already exists.

And when your credit health improves, you get better access to financial services. Loans with better rates. Credit cards with higher limits. More opportunities.

Tax Smart. Borrow Smart.

Start building your tax health today."

Visual Direction:
- Open: Split screen — person filing taxes on left, credit score on right
- Animation: Connection line forming between tax actions and score increase
- Show factors appearing: Tax Filing History (+45), Document Consistency (+30), etc.
- Credit score gauge animating upward
- Real-world scenario: person getting loan approval
- Close: Logo with tagline

Colors: Deep Teal (#0D7377), Bright Green (#32E875) for positive changes, Dark BG (#0A0F14)
Style: Educational, trustworthy, slightly inspirational
Audio: Warm, knowledgeable voiceover with slight Nigerian accent

Output: 90-second video, 16:9, MP4
```

---

## 3. Brand & Logo Design Prompts

### 3.1 Logo Design (Primary)

```
Design a logo for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Company Name: Creditax.ai
Tagline: "Tax Smart. Borrow Smart."

Brand Personality:
- Trustworthy (like a good accountant)
- Clear (no jargon)
- Optimistic (progress over problems)
- Modern but rooted (African identity + global technology)

Brand Colors:
- Primary: Deep Teal (#0D7377)
- Accent: Bright Green (#32E875)
- Dark BG: #0A0F14

What the logo should convey:
- Financial intelligence (subtle money/data motif)
- Nigerian identity (recognizable as Nigerian brand)
- Tech-forward and modern
- Trust and reliability
- The "credit + tax" connection

Logo Style Options (please provide multiple):
1. Icon-based: A symbol that works alone (like the Twitter bird or Spotify note)
2. Wordmark: Stylish text treatment of "Creditax"
3. Combination: Icon + wordmark together

Technical Requirements:
- Vector format (SVG, AI)
- Works on dark and light backgrounds
- Scales from favicon (16x16) to billboard
- Include a monochrome version
- Include a favicon version

Your creative direction:
The logo should feel like a fintech company that understands Nigeria — innovative but not trying to be American or European. Think Stripe meets Nigerian warmth. Not overly corporate. Approachable tech.
```

### 3.2 Icon Set

```
Design an icon set for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Required Icons (24x24 base, stroke style):
1. Tax/Document icon
2. Credit card/Score icon
3. Calculator icon
4. Chatbot/AI icon
5. Map/Marker icon
6. Checkmark/Verified icon
7. User/Person icon
8. Building/Business icon
9. Document upload icon
10. Settings/Gear icon

Style Guidelines:
- Stroke width: 2px
- Rounded corners: 2px radius
- Color: Deep Teal (#0D7377) for primary, Bright Green (#32E875) for accent states
- Works on dark backgrounds (#0A0F14)
- Consistent visual weight across all icons

Output: SVG files, organized in a single ZIP
```

### 3.3 Social Media Assets

```
Create social media template assets for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Platform: Twitter/X
Dimensions: 1200x675 pixels

Template 1: Announcement
- Dark background (#0A0F14)
- Creditax logo (centered top area)
- Large headline text area
- Subtle geometric accent (teal)
- Profile/link placeholder at bottom

Template 2: Educational Thread Cover
- Dark background (#0A0F14)
- Icon representing topic (tax, credit, etc.)
- "Thread" label in corner
- Headline text area
- Brand colors as accents

Template 3: Product Demo
- Dark background (#0A0F14)
- Placeholder for product screenshot (16:9)
- Headline overlay area
- "Demo" badge in corner

Template 4: Testimonial/Quote
- Dark background (#0A0F14)
- Large quotation marks icon (teal)
- Quote text area
- Attribution line
- Brand accent elements

Template 5: Event/Webinar
- Dark background (#0A0F14)
- "Live" or "Upcoming" badge
- Event title area
- Date/time display
- Registration CTA button area (green accent)

All templates should:
- Feel cohesive as a brand
- Include subtle background texture or gradient
- Have space for text overlay
- Include Creditax logo (small, bottom right)

Output: PSD or Figma file + exported PNGs at 2x resolution
```

### 3.4 Brand Guidelines Document

```
Create a brand guidelines document for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Document Sections:

1. Logo Usage
   - Clear space rules (minimum padding around logo)
   - Minimum size requirements
   - What NOT to do with the logo
   - Logo variations (dark bg, light bg, monochrome)

2. Color System
   - Primary colors with hex, RGB, CMYK values
   - Secondary/accent colors
   - Neutral colors
   - Semantic colors (success, warning, error, info)
   - Do NOT use these color combinations (inaccessible)

3. Typography
   - Font families: Inter (primary), JetBrains Mono (code)
   - Type scale with sizes and weights
   - Usage examples for each level
   - How NOT to use typography

4. Voice & Tone
   - Brand voice attributes
   - Example copy (good and bad)
   - Nigerian context considerations
   - Technical vs. consumer language

5. Imagery Style
   - Photo style guidelines
   - Illustration style
   - Iconography style
   - What NOT to use

6. Application Examples
   - Business card
   - Website header
   - Social media post
   - Email signature
   - App icon

Output: PDF document (20-30 pages), also provide Figma source file
```

---

## 4. Product Information Prompts

### 4.1 Product One-Pager

```
Create a one-page product summary for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Content to include:

HEADLINE: "The Missing Tax API for Nigeria"

SUBHEAD: "Tax compliance meets credit intelligence"

KEY FEATURES (with brief descriptions):
1. Tax Calculation API
   - Income tax, VAT, WHT calculations
   - Based on NTA 2023 and NTAA 2023

2. AI Tax Assistant
   - RAG-powered Q&A on Nigerian tax law
   - Trained on official FIRS documents

3. Document Processing
   - Upload receipts, invoices
   - Auto-extraction with OCR

4. Credit Health Score
   - New scoring model based on tax compliance
   - Better tax history = better credit

5. Tax Professional Marketplace
   - Find verified tax experts near you
   - CAC-verified, FIRS-registered

TARGET AUDIENCES:
- Nigerian developers (API integration)
- Tax professionals (marketplace)
- SMEs (compliance + credit)

CALL TO ACTION:
"Get early access" / "Join waitlist"

Output: Clean PDF, 1 page, ready for investor/customer sharing
```

### 4.2 API Documentation Cover

```
Create a visually appealing cover for Creditax.ai API documentation.

Content:
- Title: "Creditax API"
- Subtitle: "Build with Nigeria's Tax Intelligence Platform"
- Version: "v1.0 — Early Access"
- Aesthetic: Dark mode, code-like background pattern
- Brand colors: Deep Teal (#0D7377), Bright Green (#32E875)
- Include abstract tech elements (nodes, connections)

Output: PDF, 1 page, high resolution
```

---

## 6. Front-End UI Design Variations

Use these prompts to generate complete page designs for the Creditax.ai platform.

### 6.1 Landing Page Hero Section

```
Design the hero section of a landing page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14) with subtle gradient
- Headline: "Tax Smart. Borrow Smart."
- Subheadline: "The AI platform bridging tax compliance and creditworthiness for Nigeria"
- Two CTAs: Primary "Get Early Access" (green #32E875), Secondary "View API Docs" (teal outline)
- Abstract 3D or geometric background element suggesting data/finance
- Brand colors: Deep Teal (#0D7377), Bright Green (#32E875), Dark BG (#0A0F14)
- Mobile and desktop layouts
- Modern SaaS aesthetic (like Stripe, Linear, Vercel)

Output: High-fidelity design mock-up, dark mode, 1920x1080 + mobile (375x812)
```

### 5.2 Landing Page Feature Section

```
Design a features section for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Three feature cards in a row:
  1. Tax Calculation API - Calculator icon, "Calculate income tax, VAT, WHT in milliseconds"
  2. AI Tax Assistant - Chat icon, "Ask any question about Nigerian tax law"
  3. Credit Health Score - Chart icon, "Your tax history improves your credit"
- Each card has: Icon (in teal circle), Title, Description, subtle hover animation
- Clean card design with #111922 background, subtle border
- Modern, minimal SaaS style

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.3 Pricing Page

```
Design a pricing page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Toggle for Monthly/Annual (Annual shows 20% discount badge)
- Three pricing tiers:
  1. Free: $0/mo - 100 API calls, Basic tax calc, Document upload (10/mo
  2. Pro: $49/mo - 10,000 API calls, Full RAG chat, Unlimited docs, Credit score
  3. Enterprise: Custom - Unlimited, Dedicated support, Custom rate limits, White-label
- Pro tier should be highlighted as "Most Popular" with green accent
- Feature comparison list below cards
- Brand colors: Deep Teal (#0D7377), Bright Green (#32E875)
- Modern SaaS pricing aesthetic

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.4 Auth Pages (Login/Signup)

```
Design login and signup pages for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Centered card layout (#111922 card with subtle shadow)
- Login page: Email input, "Send Magic Link" button, "Don't have an account? Sign up" link
- Signup page: Email input, "Create Account" button, "Already have an account? Log in" link
- SuperScale branding note: "Powered by SuperScale" in footer
- Google OAuth button (optional, can be added later)
- Clean, minimal, trustworthy feel
- Brand colors: Deep Teal (#0D7377), Bright Green (#32E875) for primary CTA

Output: Two high-fidelity design mock-ups, dark mode, 1920x1080 each
```

### 5.5 B2C Dashboard (Consumer)

```
Design a consumer dashboard for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Top navigation: Logo, nav items (Dashboard, Tax Filing, Documents, Credit, Settings), User avatar
- Main content area with:
  - Welcome message: "Welcome back, [Name]"
  - Tax Health Score card (large gauge showing 78/100, "On Track" label)
  - Credit Score card (gauge showing 720, "+15 from last month")
  - Tax Filing Progress card (progress bar 60%, "3 documents needed")
  - Recent Activity feed (list of recent actions)
  - Quick Actions sidebar (Upload Document, Ask Tax Bot, View Reports)
- Cards have #111922 background with subtle borders
- Clean, approachable consumer feel (not too technical)

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.6 B2C Credit Score Detail Page

```
Design a credit score detail page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Large circular score display in center (720, with label "Good" below)
- Score breakdown section showing contributing factors:
  - Tax Filing History: +45 points (green progress bar)
  - Document Consistency: +30 points (green progress bar)
  - Income Stability: +25 points (green progress bar)
  - Savings Pattern: +20 points (green progress bar)
- Educational section: "What this means" explaining the score
- CTA: "How to Improve Your Score" button
- Historical trend mini chart (line graph showing score over time)
- Brand colors: Deep Teal (#0D7377), Bright Green (#32E875) for positive indicators

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.7 Tax Filing Wizard (Step View)

```
Design a tax filing wizard step view for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Step indicator at top: Steps 1-5 with current step highlighted (Step 3: Review Deductions)
- Main content area showing:
  - AI chat bubble: "Based on your uploaded receipts, I found ₦2.4M in deductible expenses. Want me to add these?"
  - List of expenses with checkmarks and amounts
  - Running total card showing: Total Deductions (₦2,450,000), Estimated Tax Savings (₦612,500)
- Bottom navigation: "Back" button (outline), "Continue" button (solid green)
- Clean, guided flow with clear progress
- Mobile-friendly design

Output: High-fidelity design mock-up, dark mode, 1920x1080 + mobile (375x812)
```

### 5.8 B2B Pro Dashboard (Tax Professional)

```
Design a tax professional dashboard for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Top navigation: Logo, "Pro Portal" label, nav (Dashboard, Clients, Calculations, Verify, Settings), User avatar
- Stats row:
  - Revenue: ₦2.4M/month (+12%)
  - Pending Tasks: 8
  - Compliance Rate: 94%
- Upcoming Deadlines section (list with dates, client names, task types)
- Client Activity feed (recent uploads, report requests, alerts)
- Quick Actions: Add Client, Bulk Calculation, Verify Client
- Table view of recent clients (name, CAC number, compliance %, last activity)
- More data-dense than consumer dashboard (pro users want information)

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.9 Tax Pro Client Detail Page

```
Design a client detail page for tax professionals on "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Header: Client name, CAC number, TIN, status badge (Active), compliance score (94%)
- Tab navigation: Overview, Documents, Filings, Reports
- Documents tab selected showing:
  - Filter bar (All, Receipts, Invoices, Forms)
  - Document list with: filename, amount extracted, category, date, status badge
  - Upload button
- Sidebar showing: Client info card, quick actions
- Professional, data-rich layout

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.10 Marketplace Listing Page (Public)

```
Design a tax professional marketplace listing page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Search bar at top: "Find a trusted tax professional" with location icon
- Filter row: Service type dropdown, Location dropdown, Rating filter, Price range, Verified toggle
- Split view:
  - Left 40%: Scrollable list of professional cards
  - Right 60%: Interactive map with markers (Mapbox style)
- Professional card shows: Photo, Business name, Verified badges, Star rating, Services, Starting price, Distance
- Cards are interactive (hover shows "View Profile" button)
- Map markers show count when zoomed out
- Trust-focused, marketplace aesthetic

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.11 Tax Pro Public Profile Page

```
Design a public profile page for a tax professional on "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Profile header: Large photo, Business name, Verified badges (CAC, FIRS), Location, Distance from user
- Rating display: 4.8 stars, 127 reviews, "Member since 2022"
- Map section showing exact location
- About section with description
- Services & Pricing table: Service name, Turnaround time, Price
- Contact section with large buttons: Call Now, Send Email, WhatsApp, Visit Website
- Reviews section with 2-3 sample reviews
- Sticky CTA at bottom: "Request Consultation"
- Trust-building, professional aesthetic

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.12 Tax Pro Application Flow (Multi-Step)

```
Design a multi-step application flow for tax professionals to join the marketplace on "Creditax.ai".

Requirements (5 steps):
- Dark background (#0A0F14)
- Step indicator at top: 5 steps with labels
- Step 1 - Basic Info: Business name, CAC number with "Verify" button, FIRS TIN, Years of experience
- Step 2 - Services: Checkbox list of services, price range inputs
- Step 3 - Location: Address input with "Detect Location" button, City/State dropdowns, Mini map preview
- Step 4 - Contact: Phone, Email, WhatsApp (optional), Website (optional)
- Step 5 - Verification: File upload zones for CAC Certificate, FIRS Certificate, Valid ID
- Progress indicator showing current step
- Back/Next navigation buttons
- Professional, trustworthy onboarding feel

Output: Five high-fidelity design mock-ups, dark mode, 1920x1080 each
```

### 5.13 Admin Dashboard

```
Design a super admin dashboard for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Collapsible sidebar: Dashboard, Users, Professionals, Knowledge Base, Audit Log, Marketplace, Settings
- Main content:
  - System health indicators (API, RAG, Database, Auth - all green/operational)
  - Stats row: Active Users (1,247), Tax Pros (89), API Calls Today (45,231), Revenue (₦2.4M)
  - Recent activity feed showing system events
  - Pending marketplace approvals queue (3 items with Approve/Reject buttons)
- Data-dense, control-panel aesthetic
- Professional admin interface

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.14 Mobile Navigation Patterns

```
Design mobile navigation patterns for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Bottom tab bar design showing: Home, Upload, Chat, Credit, Profile
- Each tab with icon and label
- Active state: Teal highlight (#0D7377)
- Upload tab should be slightly elevated or highlighted as primary action
- Clean, easy to tap with thumb
- Works on iPhone SE and larger

Output: High-fidelity design mock-up, dark mode, 375x812 (mobile)
```

### 5.15 Empty States & Onboarding

```
Design empty state and onboarding screens for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Empty state for Documents: Illustration, "No documents yet", "Upload your first receipt or invoice to get started", Upload button
- Empty state for Credit: Gauge with no score, "Start filing your taxes to build your credit health", Get Started button
- First-time onboarding screen: Welcome message, 3-step carousel (Connect bank, Upload documents, Build credit), Next/Get Started buttons
- Friendly, encouraging tone
- Subtle animations implied

Output: Four high-fidelity design mock-ups, dark mode, 375x812 each
```

### 5.16 Notification & Toast Designs

```
Design notification and toast UI components for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark card design (#111922) with status-colored left border
- Success toast: Green border (#32E875), Checkmark icon, "Document extracted successfully"
- Error toast: Red border (#EF4444), X icon, "Failed to process document. Please try again."
- Info toast: Blue border (#3B82F6), Info icon, "Your tax filing is due in 30 days"
- Warning toast: Yellow border (#F59E0B), Warning icon, "API usage at 80%"
- Include inline notifications (within cards) and toast notifications (floating)
- Clean, readable typography

Output: High-fidelity design mock-up showing all notification types, dark mode, 1920x1080
```

---

## 5.17 16x9 Combined Screen Layouts

Combine 2 smaller screens into one 16:9 ratio layout for efficient review and onboarding visualization.

### 5.17.1 Auth Pages Combined

```
Design a 16:9 layout combining login and signup pages side-by-side for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Left Side - Login:
- Email input field
- "Send Magic Link" button (Bright Green #32E875)
- "Don't have an account? Sign up" link
- Google OAuth button (outline style)

Right Side - Signup:
- Email input field
- "Create Account" button (Bright Green #32E875)
- "Already have an account? Log in" link
- Google OAuth button (outline style)

Layout:
- Split 50/50 vertically
- Thin divider line between (teal #0D7377)
- Both sides on dark background (#0A0F14)
- Centered card design (#111922) on each side
- "Powered by SuperScale" footer note

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.17.2 B2C Onboarding Flow Combined

```
Design a 16:9 layout showing 4 onboarding screens combined for "Creditax.ai".

Layout: 2x2 grid

Screen 1 (Top Left) - Welcome:
- Logo centered
- "Welcome to Creditax" heading
- "Tax Smart. Borrow Smart." tagline
- "Get Started" button

Screen 2 (Top Right) - Connect:
- Bank connection illustration
- "Connect your bank account"
- Mono integration mention
- "Connect Bank" button

Screen 3 (Bottom Left) - Upload:
- Document upload illustration
- "Upload your documents"
- "Receipts, invoices, forms"
- "Upload Document" button

Screen 4 (Bottom Right) - Credit:
- Credit score gauge (empty)
- "Build your credit health"
- "Start filing taxes to improve your score"
- "View Dashboard" button

All dark mode, consistent card styling, subtle borders

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.17.3 Marketplace User Flow Combined

```
Design a 16:9 layout showing the marketplace discovery flow for "Creditax.ai".

Layout: 3-panel horizontal

Panel 1 - Search:
- Search bar: "Find a tax professional"
- Location selector
- Service dropdown
- "Near me" toggle

Panel 2 - Results:
- List of 3 professional cards
- Photo, name, badges, rating
- Distance indicator
- "View Profile" buttons

Panel 3 - Profile Preview:
- Pro photo and name
- Verified badges
- Services list
- Price range
- Contact buttons (Call, WhatsApp, Email)
- "Request Consultation" CTA

Dark mode, consistent with main marketplace designs

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.17.4 Tax Filing Wizard Steps Combined

```
Design a 16:9 layout showing 4 steps of the tax filing wizard for "Creditax.ai".

Layout: 2x2 grid

Step 1 (Top Left) - Income Entry:
- Income input field
- Employment status selector
- "Next" button

Step 2 (Top Right) - Deductions Review:
- AI chat: "I found ₦2.4M in deductions"
- List of deductions with checkmarks
- Running total

Step 3 (Bottom Left) - Document Upload:
- Upload zone (dashed border)
- Camera icon
- "Tap to capture or drag files"

Step 4 (Bottom Right) - Review & Submit:
- Summary card
- Total tax due: ₦612,500
- "Submit Filing" button (green)

Dark mode, step indicator at top of each card, consistent styling

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.17.5 Pro Application Flow Combined

```
Design a 16:9 layout showing the 5-step tax pro application flow for "Creditax.ai".

Layout: 5-panel horizontal (narrower each)

Panel 1 - Basic Info:
- Step 1 indicator
- Business name input
- CAC number input with "Verify" button

Panel 2 - Services:
- Step 2 indicator
- Service checkboxes
- Price range inputs

Panel 3 - Location:
- Step 3 indicator
- Address input
- City/State dropdowns

Panel 4 - Contact:
- Step 4 indicator
- Phone, Email fields
- WhatsApp optional

Panel 5 - Verification:
- Step 5 indicator
- File upload icons (3)
- "Submit Application" button

Dark mode, step indicators at top, progress line connecting panels

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.17.6 Settings Pages Combined

```
Design a 16:9 layout combining key settings pages for "Creditax.ai".

Layout: 2x2 grid

Panel 1 (Top Left) - Account Settings:
- Profile photo upload
- Name, email fields
- Password change
- "Save Changes" button

Panel 2 (Top Right) - Notification Settings:
- Toggle switches for:
  - Email notifications
  - Push notifications
  - SMS alerts
  - Marketing emails

Panel 3 (Bottom Left) - API Settings:
- API key display (masked)
- "Regenerate Key" button
- Webhook URL input

Panel 4 (Bottom Right) - Billing:
- Current plan display (Pro)
- Payment method
- "Upgrade Plan" button

Dark mode, card-based design, sidebar on left (common across all)

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.17.7 Error & Edge Case States Combined

```
Design a 16:9 layout showing various error and edge case states for "Creditax.ai".

Layout: 2x3 grid (6 cards)

Card 1 - 404 Page:
- "404" large text
- "Page not found"
- "Go Home" button

Card 2 - Empty Search Results:
- Magnifying glass icon
- "No results found"
- Suggestions text

Card 3 - Network Error:
- Wifi/X icon
- "No internet connection"
- "Retry" button

Card 4 - API Rate Limit:
- Speedmeter icon
- "Rate limit exceeded"
- "Upgrade to Pro" CTA

Card 5 - Session Expired:
- Clock icon
- "Session expired"
- "Log in again" button

Card 6 - Server Error:
- Server icon with X
- "Something went wrong"
- "Contact support" link

All dark mode, consistent card styling, subtle red accent for errors

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 5.17.8 Mobile Screens Combined (4 per 16:9)

```
Design a 16:9 layout combining 4 mobile screens for "Creditax.ai" - efficient for overview.

Layout: 2x2 grid of phone frames

Frame 1 (Top Left) - Home/Dashboard:
- Mobile dashboard
- Bottom tab bar
- Tax health score, credit score cards
- Quick action buttons

Frame 2 (Top Right) - Document Upload:
- Camera-first UI
- Dashed upload zone
- Recent uploads list

Frame 3 (Bottom Left) - Chat/RAG:
- Chat interface
- User message + AI response
- Input field at bottom

Frame 4 (Bottom Right) - Profile/Credit:
- Credit score gauge
- Score breakdown
- "Improve Score" CTA

Phone frames with dark borders, consistent styling, 375x812 content area

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

---

## 6. REMAINING FEATURES & SCREENS TO BUILD

Complete inventory of all planned features not yet designed/built. Use these prompts for the next round of SuperScale generation or for developer implementation.

---

### Public Pages (No Auth Required)

| # | Screen | Route | Status | Priority | Prompt |
|---|--------|-------|--------|----------|--------|
| 1 | Landing (Hero) | `/` | ✅ Built | P0 | N/A |
| 2 | Landing (Features) | `/` | ✅ Built | P0 | N/A |
| 3 | Landing (Pricing) | `/pricing` | ✅ Built | P0 | N/A |
| 4 | Landing (Footer) | `/` | ❌ Not built | P2 | See 6.1 |
| 5 | API Documentation | `/docs` | ❌ Not built | P1 | See 6.2 |
| 6 | Blog | `/blog` | ❌ Not built | P2 | See 6.3 |
| 7 | About | `/about` | ❌ Not built | P2 | See 6.4 |
| 8 | Status Page | `/status` | ❌ Not built | P1 | See 6.5 |
| 9 | Marketplace Listing | `/marketplace` | ✅ Built | P0 | N/A |
| 10 | Pro Profile Page | `/marketplace/[slug]` | ✅ Built | P0 | N/A |

### B2C Consumer Pages

| # | Screen | Route | Status | Priority | Prompt |
|---|--------|-------|--------|----------|--------|
| 11 | Consumer Dashboard | `/dashboard` | ✅ Built | P0 | N/A |
| 12 | Tax Filing Wizard | `/dashboard/tax-filing` | ✅ Built | P0 | N/A |
| 13 | Document Upload | `/dashboard/upload` | ❌ Not built | P0 | See 6.6 |
| 14 | My Documents | `/dashboard/documents` | ❌ Not built | P1 | See 6.7 |
| 15 | Credit Score View | `/dashboard/credit` | ✅ Built | P0 | N/A |
| 16 | Credit Score Detail | `/dashboard/credit` | ✅ Built | P0 | N/A |
| 17 | Reports | `/dashboard/reports` | ❌ Not built | P1 | See 6.8 |
| 18 | API Keys | `/dashboard/keys` | ❌ Not built | P1 | See 6.9 |
| 19 | Usage Analytics | `/dashboard/usage` | ❌ Not built | P1 | See 6.10 |
| 20 | Settings | `/dashboard/settings` | ❌ Not built | P1 | See 6.11 |

### B2B Tax Professional Portal

| # | Screen | Route | Status | Priority | Prompt |
|---|--------|-------|--------|----------|--------|
| 21 | Pro Dashboard | `/pro` | ✅ Built | P0 | N/A |
| 22 | Client Management | `/pro/clients` | ❌ Not built | P0 | See 6.12 |
| 23 | Client Detail | `/pro/clients/[id]` | ✅ Built | P0 | N/A |
| 24 | Client Documents | `/pro/documents` | ❌ Not built | P1 | See 6.13 |
| 25 | Bulk Calculations | `/pro/calculations` | ❌ Not built | P0 | See 6.14 |
| 26 | Client Reports | `/pro/reports` | ❌ Not built | P1 | See 6.15 |
| 27 | Verify Client | `/pro/verify` | ❌ Not built | P0 | See 6.16 |
| 28 | Pro Settings | `/pro/settings` | ❌ Not built | P1 | See 6.17 |

### Admin Dashboard

| # | Screen | Route | Status | Priority | Prompt |
|---|--------|-------|--------|----------|--------|
| 29 | Admin Dashboard | `/admin` | ✅ Built | P0 | N/A |
| 30 | Users | `/admin/users` | ❌ Not built | P0 | See 6.18 |
| 31 | Pro Users | `/admin/professionals` | ❌ Not built | P0 | See 6.19 |
| 32 | Knowledge Base Editor | `/admin/kb` | ❌ Not built | P0 | See 6.20 |
| 33 | Audit Log | `/admin/audit` | ❌ Not built | P1 | See 6.21 |
| 34 | Departments | `/admin/departments` | ❌ Not built | P2 | See 6.22 |
| 35 | Facilities | `/admin/facilities` | ❌ Not built | P2 | See 6.23 |
| 36 | Marketplace Approvals | `/admin/marketplace` | ❌ Not built | P0 | See 6.24 |
| 37 | Admin Settings | `/admin/settings` | ❌ Not built | P1 | See 6.25 |

### Developer Portal

| # | Screen | Route | Status | Priority | Prompt |
|---|--------|-------|--------|----------|--------|
| 38 | API Explorer | `/developers` | ❌ Not built | P0 | See 6.26 |
| 39 | Quickstart | `/developers/quickstart` | ❌ Not built | P0 | See 6.27 |
| 40 | API Reference | `/developers/reference` | ❌ Not built | P0 | See 6.28 |
| 41 | SDKs | `/developers/sdks` | ❌ Not built | P1 | See 6.29 |
| 42 | Sandbox | `/developers/sandbox` | ❌ Not built | P1 | See 6.30 |
| 43 | Webhooks | `/developers/webhooks` | ❌ Not built | P1 | See 6.31 |

### API & Backend (Not Visual - For Implementation)

| # | Feature | Status | Priority |
|---|---------|--------|----------|
| 44 | API Key Generation | ❌ Not built | P0 |
| 45 | Tax Calculation Endpoints | ❌ Not built | P0 |
| 46 | RAG Chat Endpoint | ❌ Not built | P0 |
| 47 | Document Upload/Processing | ❌ Not built | P0 |
| 48 | Credit Score Algorithm | ❌ Not built | P0 |
| 49 | Mono Integration (Bank Data) | ❌ Not built | P0 |
| 50 | Mono Lookup (Business Verify) | ❌ Not built | P0 |
| 51 | Mapbox Geocoding | ❌ Not built | P0 |
| 52 | Trigger.dev Workflows | ❌ Not built | P0 |
| 53 | Webhook System | ❌ Not built | P1 |
| 54 | Rate Limiting | ❌ Not built | P0 |
| 55 | Admin KB Editor (Backend) | ❌ Not built | P0 |
| 56 | Pro Onboarding Workflow | ❌ Not built | P0 |

---

## 6.X Individual Prompts for Remaining Screens

### 6.2 API Documentation Page (`/docs`)

```
Design an API documentation page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Left sidebar: Navigation (Introduction, Authentication, Endpoints, Examples, SDKs)
- Main content area:
  - Endpoint display: Method badge (GET/POST), path, description
  - Parameters table: Name, Type, Required, Description
  - Code example in JetBrains Mono
  - Response example JSON
  - "Try it" console panel on right
- Top: Search bar for docs, version selector
- Clean documentation aesthetic (like Stripe docs, ReadMe)

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.3 Blog Page (`/blog`)

```
Design a blog listing page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Header: "Blog" title, search bar
- Featured post: Large card at top with image placeholder, title, excerpt, date, author
- Post grid: 3 columns of post cards
- Each card: Image placeholder, category tag, title, excerpt, date
- Sidebar (optional): Popular posts, categories, newsletter signup
- Pagination at bottom

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.4 About Page (`/about`)

```
Design an About page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Hero: "About Creditax" with mission statement
- Team section: 3-4 team member cards (photo placeholder, name, title, bio)
- Story section: "Why we built this" narrative
- Values section: 3-4 value cards with icons
- Contact CTA: "Get in touch" email form

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.5 Status Page (`/status`)

```
Design an infrastructure status page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Header: "System Status" with last updated time
- Overall status indicator: "All Systems Operational" (green) or degraded (yellow)
- Service list:
  - API: Operational (green dot)
  - RAG Chat: Operational (green dot)
  - Document Processing: Operational (green dot)
  - Auth System: Operational (green dot)
  - Marketplace: Operational (green dot)
- Each service expandable to show uptime history (7/30/90 days)
- Incident history section: Past incidents with resolution status
- Subscribe to updates button

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.6 Document Upload (Full Page) (`/dashboard/upload`)

```
Design a full document upload page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Large upload zone (dashed border, camera icon)
- "Tap to capture or drag files here" text
- Supported formats: JPG, PNG, PDF, Max 10MB
- Recent uploads section below:
  - List of uploaded documents
  - Thumbnail preview
  - Status: Processing (spinner) → Extracted (checkmark)
  - Extracted data preview: Amount, category, date
  - View/Delete actions
- Filters: All, Receipts, Invoices, Forms
- Mobile camera capture prominent

Output: High-fidelity design mock-up, dark mode, 1920x1080 + mobile (375x812)
```

### 6.7 My Documents Page (`/dashboard/documents`)

```
Design a document management page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Header: "My Documents" + upload button
- Filter bar: All | Receipts | Invoices | Forms | Recently Processed
- Search bar for documents
- Document list/grid view toggle
- Document cards showing:
  - File type icon
  - Filename
  - Extracted amount (if applicable)
  - Category
  - Date uploaded
  - Status badge (Verified, Processing, Needs Review)
  - Actions: View, Download, Delete
- Bulk select for batch operations
- Pagination

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.8 Reports Page (`/dashboard/reports`)

```
Design a reports generation and viewing page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Header: "Reports" + "Generate New Report" button
- Report types: Tax Summary, Expense Report, Credit Report, Custom
- Existing reports list:
  - Report name
  - Type badge
  - Date generated
  - Download PDF button
  - Share button
- Report preview panel (when selected):
  - Summary stats
  - Charts/graphs
  - Detailed breakdown
  - Export options (PDF, CSV)

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.9 API Keys Page (`/dashboard/keys`)

```
Design an API key management page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Header: "API Keys" + "Create New Key" button
- Active keys list:
  - Key name
  - Masked key (sk_live_****8f3a)
  - Copy button
  - Created date
  - Last used
  - Usage meter (2,847 / 10,000)
  - Revoke button
- "Create New Key" modal:
  - Key name input
  - Scopes checkboxes (Read, Write, Admin)
  - Create button
- Warning about keeping keys secure

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.10 Usage Analytics Page (`/dashboard/usage`)

```
Design a usage analytics dashboard for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Header: "Usage" + billing period selector
- Stats row:
  - API Calls (this month): 45,231
  - Percentage of limit: 45%
  - Next billing date
- Usage over time chart (line graph, 30 days)
- Usage by endpoint breakdown:
  - /tax/calculate: 15,234
  - /tax/brackets: 12,456
  - /credit/score: 10,234
  - /rag/chat: 7,307
- Average response time
- Quota upgrade CTA if >80% used

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.11 Settings Page (`/dashboard/settings`)

```
Design an account settings page for "Creditax.ai" — an AI-powered tax and credit intelligence platform for Nigeria.

Requirements:
- Dark background (#0A0F14)
- Left sidebar: Account, Notifications, Security, Billing, API
- Account section:
  - Profile photo upload
  - Name input
  - Email input (with verification badge)
  - Phone input
  - Timezone selector
  - "Save Changes" button
- Notification toggles:
  - Email notifications
  - Push notifications
  - SMS alerts
- Security section:
  - Change password
  - Two-factor auth toggle
  - Active sessions list
- Delete account (danger zone, red text)

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.12 Client Management Page (`/pro/clients`)

```
Design a client management page for tax professionals on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Clients" (47) + "Add Client" button + Export button
- Search bar
- Filter dropdowns: Status (All, Active, Pending), Compliance (All, High, Medium, Low)
- Client table:
  - Checkbox
  - Client name
  - CAC number
  - Status badge
  - Compliance score (94%)
  - Last activity
  - Actions (View, Documents, Reports, Edit)
- Bulk actions: Delete, Export CSV
- Pagination: "Showing 1-10 of 47"

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.13 Client Documents (Pro View) (`/pro/documents`)

```
Design a client documents page for tax professionals on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: Client name + "Upload Document" button
- Filters: All, Receipts, Invoices, Forms, Bank Statements
- Document list:
  - File icon
  - Filename
  - Amount
  - Category
  - Date
  - Status (Verified, Pending, Issue)
  - Download/View actions
- Client info sidebar:
  - Client name, CAC, TIN
  - Compliance score
  - Quick actions
- Share with client toggle

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.14 Bulk Calculations Page (`/pro/calculations`)

```
Design a bulk tax calculations page for tax professionals on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Bulk Calculations"
- Calculation type selector: Income Tax, VAT, WHT
- Client selection:
  - Checkbox list of clients
  - "Select All" / "Clear Selection"
  - Selected count: "3 selected"
- Fiscal year selector
- "Run Calculations" button
- Results section:
  - Per-client breakdown
  - Individual amounts
  - Total estimated tax
  - "Export All" button
  - "Generate Reports" button

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.15 Client Reports (Pro) (`/pro/reports`)

```
Design a client reports page for tax professionals on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Reports" + "Generate Report" button
- Client selector dropdown
- Report types: Tax Summary, Audit Report, Compliance Report, Custom
- Existing reports list:
  - Client name
  - Report type
  - Period (2025)
  - Generated date
  - Download PDF
- Report builder modal:
  - Select client
  - Select report type
  - Select date range
  - Include/exclude sections
  - Generate button

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.16 Verify Client Page (`/pro/verify`)

```
Design a client verification page for tax professionals on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Verify Client"
- Verification type tabs:
  - TIN Verification (Company)
  - BVN Verification (Individual)
  - Tax Compliance Certificate
- Input field for TIN/BVN
- "Verify" button
- Results panel:
  - Status badge (Active/Inactive/Not Found)
  - Business/Individual name
  - Registration number
  - Last filing date
  - Compliance rate
  - "Download Certificate" button
  - "Save to Client" button

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.17 Pro Settings (`/pro/settings`)

```
Design a settings page for tax professionals on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Left sidebar navigation: Profile, Business, Services, Notifications, Billing
- Profile section:
  - Photo upload
  - Name, email, phone
  - Bio/description
- Business section:
  - Business name
  - CAC number
  - FIRS TIN
  - Address
  - Map preview
- Services section:
  - Services offered (checkboxes)
  - Price range
  - Working hours
- Notifications section:
  - Email alerts toggle
  - SMS alerts toggle
  - Client request notifications

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.18 Admin Users Page (`/admin/users`)

```
Design an admin user management page for "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Users" + search + "Add User" button
- Stats row: Total users, Active today, New this week
- User table:
  - Avatar
  - Name
  - Email
  - Role (User, Admin, Super Admin)
  - Status (Active, Suspended)
  - Last active
  - Actions (Edit, Suspend, Delete)
- Filters: Role, Status, Date range
- Export users

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.19 Admin Pro Users Page (`/admin/professionals`)

```
Design an admin tax professional management page for "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Tax Professionals" + search
- Stats row: Total pros, Pending verification, Verified, Rejected
- Status tabs: All | Pending | Verified | Rejected
- Pro table:
  - Photo
  - Business name
  - CAC number
  - Status badge
  - Rating
  - Joined date
  - Actions (View, Verify, Reject)
- Pending verification detail panel:
  - Documents uploaded
  - Verification status per document
  - Approve/Reject buttons

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.20 Knowledge Base Editor (`/admin/kb`)

```
Design a knowledge base markdown editor for super admins on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Left sidebar: Document tree
  - Tax Documents
    - NTA 2023
    - NTAA 2023
    - FIRS VAT Guide
    - WHT Guidelines
  - Expand/collapse folders
- Main area: Split view
  - Left: Markdown editor with syntax highlighting
  - Right: Live preview
- Toolbar: Bold, Italic, Headers, Lists, Code, Link
- Top bar: Document title, Save, Publish/Unpublish, Last saved time
- Bottom bar: Word count, Chunk count, "Re-embed" button

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.21 Audit Log Page (`/admin/audit`)

```
Design an audit log page for super admins on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Audit Log"
- Filters: Date range, User, Action type, Entity
- Log table:
  - Timestamp
  - User (avatar + name)
  - Action (Created, Updated, Deleted, Login, etc.)
  - Entity type (User, Document, TaxPro, etc.)
  - Entity name
  - IP address
  - Details expand
- Export to CSV
- "System-wide changes" filter toggle

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.22 Departments Page (`/admin/departments`)

```
Design a departments management page for super admins on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Departments" + "Add Department" button
- Department cards:
  - Department name
  - Head count
  - Description
  - Active projects
  - Edit/Delete actions
- Add/Edit modal:
  - Department name
  - Description
  - Manager selector
  - Team members multiselect

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.23 Facilities Page (`/admin/facilities`)

```
Design a facilities monitoring page for super admins on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Facilities" + "Add Facility" button
- Live status indicators per facility
- Facility cards:
  - Facility name
  - Location
  - Status (Online/Offline/Warning)
  - Metrics: CPU, Memory, Requests/sec
  - Last checked
- Real-time updating timestamps
- Alert banners for issues
- Add facility modal

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.24 Admin Marketplace Approvals (`/admin/marketplace`)

```
Design a marketplace approval queue for super admins on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Marketplace Approvals" + pending count badge
- Tabs: Pending | Approved | Rejected
- Pending applications list:
  - Photo
  - Business name
  - CAC number
  - Submitted date
  - "View Application" button
- Application detail panel (when selected):
  - Full business details
  - Uploaded documents (CAC cert, FIRS cert, ID)
  - Verification status per document
  - "Approve" button (green)
  - "Reject" button (red)
  - Rejection reason dropdown

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.25 Admin Settings (`/admin/settings`)

```
Design a system settings page for super admins on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Left sidebar: General, API, Security, Integrations, Billing
- General:
  - Site name, logo
  - Support email
  - Maintenance mode toggle
- API Settings:
  - Rate limits
  - Webhook secret
  - Allowed origins
- Security:
  - Password requirements
  - Session timeout
  - 2FA requirements
- Integrations:
  - Mono API key status
  - Mapbox key status
  - Kimchi.dev key status
- Billing:
  - Current plan
  - Usage limits
  - Payment method

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.26 API Explorer (`/developers`)

```
Design an interactive API explorer for developers on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Left sidebar: API endpoints by category (Tax, Credit, Documents, Auth)
- Main area:
  - Endpoint selector dropdown
  - Method badge (GET/POST)
  - Path display
  - Parameters form fields
  - Headers section
  - Request body editor
  - "Send Request" button
- Response panel:
  - Status code
  - Response time
  - JSON response with syntax highlighting
- Code snippet generator:
  - cURL
  - JavaScript
  - Python
  - Go
- "Try in Sandbox" toggle

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.27 Quickstart Page (`/developers/quickstart`)

```
Design a quickstart guide page for developers on "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Quickstart" + language selector (cURL, JavaScript, Python)
- Steps:
  1. Get your API key (with link to dashboard)
  2. Install SDK (code snippet)
  3. Make your first request (full code example)
  4. View response
- Code blocks with syntax highlighting
- Copy button per block
- Progress indicator (Step 1 of 4)
- "Next" / "Previous" navigation
- "View Full Docs" link

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.28 API Reference Page (`/developers/reference`)

```
Design a full API reference page for "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Left sidebar: Endpoint categories (Tax, Credit, Documents, Auth, Marketplace)
- Each endpoint section:
  - Method + Path + Description
  - Authentication required badge
  - Parameters table
  - Request body schema
  - Response schema
  - Example request/response
  - Error codes
- Search bar
- "Try in Sandbox" buttons
- Version selector (v1, v2-beta)

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.29 SDKs Page (`/developers/sdks`)

```
Design an SDKs page for "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Client Libraries"
- SDK cards for each language:
  - JavaScript/TypeScript (Node.js)
  - Python
  - Go
  - Ruby
  - PHP
- Each card:
  - Language icon
  - Package name
  - Version
  - Installation command
  - "View Documentation" link
  - "View on GitHub" link
- Community libraries section
- "Request a library" CTA

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.30 Sandbox Environment (`/developers/sandbox`)

```
Design a sandbox environment page for "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Sandbox" + environment toggle (Sandbox/Production warning)
- "Sandbox" badge in green
- API key display (sandbox key prefixed)
- All endpoints available but marked "SANDBOX"
- Simulated responses:
  - Tax calculations work
  - RAG chat works
  - Document processing works
- "Reset Sandbox Data" button
- Usage limits (unlimited in sandbox)
- "Switch to Production" upgrade CTA

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

### 6.31 Webhooks Page (`/developers/webhooks`)

```
Design a webhooks management page for "Creditax.ai".

Requirements:
- Dark background (#0A0F14)
- Header: "Webhooks" + "Add Endpoint" button
- Webhook endpoints list:
  - URL
  - Events subscribed
  - Status (Active, Failed)
  - Last triggered
  - Success rate %
  - Edit/Delete actions
- Add/Edit modal:
  - Endpoint URL
  - Events multiselect:
    - document.processed
    - credit.score.updated
    - tax.filing.submitted
    - pro.application.received
  - Secret key (auto-generated)
  - "Test Endpoint" button
- Recent deliveries section:
  - Event type
  - Timestamp
  - Status (200 OK, etc.)
  - "View Payload" expand

Output: High-fidelity design mock-up, dark mode, 1920x1080
```

---

## 7. Quick Reference — SuperScale Settings

### Recommended Settings

| Asset Type | Aspect Ratio | Duration | Style |
|------------|--------------|----------|-------|
| Product Mock-ups | 16:9 (desktop), 9:19.5 (mobile) | N/A | Dark mode, high fidelity |
| Explainer Videos | 16:9 | 45-90 sec | Modern, smooth transitions |
| Social Graphics | 1.91:1 (Twitter), 1:1 (Instagram) | N/A | Dark mode, bold text |
| Brand Assets | Vector | N/A | Clean, scalable |

### Common SuperScale Commands

```
# For product mock-ups
/superscale generate mockup --description "[prompt from above]" --style photorealistic --dark-mode true

# For explainer videos
/superscale generate video --script "[script from above]" --voiceover professional --duration [45-90] --format mp4

# For brand assets
/superscale generate logo --brand "Creditax" --style modern --colors "0D7377,32E875,0A0F14"

# For social content
/superscale generate social --template [template-name] --text "[custom text]" --brand creditax
```

---

*End of SuperScale Prompts Guide*