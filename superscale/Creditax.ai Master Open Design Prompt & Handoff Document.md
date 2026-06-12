# Creditax.ai — Master Open Design Prompt & Handoff Document


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 1 — PROJECT IDENTITY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Product Name
**Creditax.ai**

## Tagline
"Tax Smart. Borrow Smart."

## One-Line Description
Nigeria's first AI-powered platform that bridges tax compliance and creditworthiness — combining a tax calculation API, AI tax assistant, document OCR, credit scoring, and a marketplace for verified tax professionals.

## Market
Nigeria, West Africa. Primary city: Lagos. Secondary: Abuja, Port Harcourt.

## Product Type
Multi-sided platform with four distinct user surfaces:
1. **Consumer Dashboard** — B2C: SME owners, individuals filing taxes
2. **Tax Professional Portal** — B2B: Accountants and tax consultants
3. **Admin Panel** — Super admins managing the platform
4. **Developer Hub** — API consumers and integration engineers

## Brand Personality
- Trustworthy (like a good accountant)
- Clear (no jargon)
- Optimistic (progress over problems)
- Modern but rooted (African identity + global technology)
- Tone reference: **Stripe meets Nigerian warmth**

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 2 — COMPLETE DESIGN TOKEN SYSTEM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> CRITICAL: Every component must use ONLY semantic tokens (Layer 2), never raw hex values directly. The theme switch changes Layer 2 values only — components update automatically.

## 2.1 — Color Primitives (Source of Truth — Never Use Directly)

```
TEAL SCALE
--primitive-teal-50:   #E8F5F5
--primitive-teal-100:  #C4E4E5
--primitive-teal-200:  #9DD3D4
--primitive-teal-300:  #73C0C2
--primitive-teal-400:  #4DAFB1
--primitive-teal-500:  #1A9497
--primitive-teal-600:  #0D7377   ← PRIMARY BRAND COLOR
--primitive-teal-700:  #0A5B5F
--primitive-teal-800:  #074548
--primitive-teal-900:  #042F30
--primitive-teal-950:  #021E1F

GREEN SCALE
--primitive-green-400: #32E875   ← PRIMARY ACTION / ACCENT
--primitive-green-500: #1DC75A
--primitive-green-600: #18A84C
--primitive-green-700: #12843C
--primitive-green-800: #0D622D

NEUTRAL SCALE
--primitive-slate-0:   #FFFFFF
--primitive-slate-25:  #F8FAFA
--primitive-slate-50:  #F0F5F6
--primitive-slate-100: #DCE8EA
--primitive-slate-200: #AABFC3
--primitive-slate-300: #8899AA
--primitive-slate-400: #6B7A8D
--primitive-slate-500: #526070
--primitive-slate-600: #3A4A5A
--primitive-slate-700: #253340
--primitive-slate-800: #161F28
--primitive-slate-850: #111922   ← CARD BACKGROUND (DARK)
--primitive-slate-900: #0D1117   ← ELEVATED SURFACE (DARK)
--primitive-slate-950: #0A0F14   ← PAGE BACKGROUND (DARK)

STATUS COLORS
Red:   #EF4444 (dark) / #DC2626 (light)
Amber: #F59E0B (dark) / #D97706 (light)
Blue:  #3B82F6 (dark) / #2563EB (light)
```

## 2.2 — Semantic Tokens: DARK MODE (Default)

```css
/* SURFACES — Five depth levels */
--color-surface-base:      #0A0F14   /* Page background */
--color-surface-raised:    #0D1117   /* Nav, sidebar */
--color-surface-overlay:   #111922   /* Cards, panels */
--color-surface-inset:     #161F28   /* Alt table rows */
--color-surface-deep:      #0F161E   /* Deeper insets */

/* TYPOGRAPHY */
--color-text-primary:      #FFFFFF   /* Headlines, values */
--color-text-secondary:    #8899AA   /* Body, descriptions */
--color-text-muted:        #6B7A8D   /* Timestamps, hints */
--color-text-disabled:     #3A4A5A   /* Disabled fields */
--color-text-inverse:      #0A0F14   /* Text on green button */
--color-text-placeholder:  rgba(136,153,170,0.5)

/* BRAND */
--color-brand-primary:     #0D7377   /* Icons, links, tabs, borders */
--color-brand-action:      #32E875   /* Primary CTA, success */
--color-brand-primary-bg:  rgba(13,115,119,0.12)
--color-brand-action-bg:   rgba(50,232,117,0.12)
--color-brand-primary-border: rgba(13,115,119,0.30)
--color-brand-action-border:  rgba(50,232,117,0.30)

/* STATUS */
--color-success:           #32E875
--color-success-bg:        rgba(50,232,117,0.10)
--color-success-border:    rgba(50,232,117,0.28)
--color-success-text:      #32E875
--color-warning:           #F59E0B
--color-warning-bg:        rgba(245,158,11,0.10)
--color-warning-border:    rgba(245,158,11,0.28)
--color-warning-text:      #FBBF24
--color-error:             #EF4444
--color-error-bg:          rgba(239,68,68,0.10)
--color-error-border:      rgba(239,68,68,0.28)
--color-error-text:        #F87171
--color-info:              #3B82F6
--color-info-bg:           rgba(59,130,246,0.10)
--color-info-border:       rgba(59,130,246,0.28)
--color-info-text:         #60A5FA

/* BORDERS */
--color-border-default:    rgba(255,255,255,0.07)
--color-border-subtle:     rgba(255,255,255,0.04)
--color-border-strong:     rgba(255,255,255,0.15)
--color-border-brand:      rgba(13,115,119,0.35)
--color-border-action:     rgba(50,232,117,0.35)

/* INTERACTIONS */
--color-hover-overlay:     rgba(255,255,255,0.04)
--color-active-overlay:    rgba(255,255,255,0.08)
--color-focus-ring:        #0D7377
--color-selection-bg:      rgba(13,115,119,0.25)

/* SHADOWS — Glow-based in dark mode */
--shadow-card:             0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)
--shadow-modal:            0 24px 80px rgba(0,0,0,0.7)
--shadow-btn-action:       0 0 24px rgba(50,232,117,0.25)
--shadow-btn-brand:        0 0 20px rgba(13,115,119,0.3)
```

## 2.3 — Semantic Tokens: LIGHT MODE

```css
/* SURFACES — Perfect inversion: dark bg becomes text, white becomes surface */
--color-surface-base:      #F0F5F6   /* Light teal-tinted page bg */
--color-surface-raised:    #FFFFFF   /* Nav, sidebar: pure white */
--color-surface-overlay:   #FFFFFF   /* Cards: pure white */
--color-surface-inset:     #F8FAFA   /* Alt table rows */
--color-surface-deep:      #F0F5F6

/* TYPOGRAPHY — Dark bg (#0A0F14) becomes primary text */
--color-text-primary:      #0A0F14   /* Headlines: the old dark bg */
--color-text-secondary:    #3A4A5A   /* Body text */
--color-text-muted:        #6B7A8D   /* IDENTICAL to dark mode */
--color-text-disabled:     #8899AA
--color-text-inverse:      #FFFFFF   /* Text on green button */
--color-text-placeholder:  rgba(106,122,141,0.6)

/* BRAND — Teal unchanged; green darkened for WCAG on white */
--color-brand-primary:     #0D7377   /* UNCHANGED — passes WCAG on white */
--color-brand-action:      #1DC75A   /* Darkened 1 step for light bg */
--color-brand-primary-bg:  rgba(13,115,119,0.08)
--color-brand-action-bg:   rgba(29,199,90,0.10)

/* STATUS — All darkened 1 step for WCAG on white */
--color-success:           #18A84C
--color-success-text:      #12843C
--color-warning:           #D97706
--color-warning-text:      #D97706
--color-error:             #DC2626
--color-error-text:        #B91C1C
--color-info:              #2563EB
--color-info-text:         #2563EB

/* BORDERS — Inverted: black opacity instead of white opacity */
--color-border-default:    rgba(0,0,0,0.08)
--color-border-subtle:     rgba(0,0,0,0.04)
--color-border-strong:     rgba(0,0,0,0.18)

/* SHADOWS — Drop-based in light mode (not glow) */
--shadow-card:             0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)
--shadow-modal:            0 20px 60px rgba(0,0,0,0.15)
--shadow-btn-action:       0 4px 14px rgba(18,132,60,0.30)
```

## 2.4 — Typography

```
PRIMARY FONT: Syne (Google Fonts)
Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

CODE FONT: JetBrains Mono (Google Fonts)
Weights: 400 (Regular), 500 (Medium)

TYPE SCALE:
Display:  Syne Bold,     40px, line-height 1.2
H1:       Syne Bold,     32px, line-height 1.25
H2:       Syne Bold,     24px, line-height 1.3
H3:       Syne SemiBold, 20px, line-height 1.35
H4:       Syne SemiBold, 16px, line-height 1.4
Body LG:  Syne Regular,  18px, line-height 1.7
Body:     Syne Regular,  15px, line-height 1.6
Body SM:  Syne Regular,  13px, line-height 1.6
Label:    Syne Medium,   12px, line-height 1.0, letter-spacing 0.12em, UPPERCASE
Code:     JetBrains Mono 400, 13px, line-height 1.7
```

## 2.5 — Spacing System

```
4px   — Micro (icon-to-text)
8px   — Tight (chip gap, small internal)
12px  — Compact (button padding SM)
16px  — Base (card internal gap)
20px  — Comfortable (form field gap)
24px  — Section gap (card to card)
28px  — Card padding standard
32px  — Card padding large
40px  — Section padding
48px  — Page section gap
64px  — Major section gap
80px  — Hero padding
```

## 2.6 — Border Radius

```
pill:   9999px  (pills, tags, badges)
btn:    10px    (buttons)
input:  10px    (form inputs)
card:   16px    (cards, panels)
modal:  20px    (modals, large panels)
badge:  6px     (status badges)
```

## 2.7 — Component Token Quick Reference

```
BUTTONS:
  Primary:    bg=brand-action, text=text-inverse, shadow=shadow-btn-action
  Secondary:  bg=transparent, text=brand-primary, border=border-brand
  Ghost:      bg=transparent, text=text-primary, border=border-strong
  Danger:     bg=transparent, text=error-text, border=error-border
  Sizes: SM=h-8, MD=h-10, LG=h-12, XL=h-14

CARDS:
  Base:       bg=surface-overlay, border=border-default, radius=card, shadow=shadow-card
  Teal accent: border-left 4px solid border-brand + bg=brand-primary-bg/40
  Green accent: border 1.5px solid border-action
  Danger:     border 1px solid error-border/20

INPUTS:
  Base:       bg=surface-base, border=border-strong, radius=input, height=48px
  Focus:      border=brand-primary, ring=brand-primary-bg
  Error:      border=error, ring=error-bg

NAV ITEMS:
  Active:     bg=brand-primary-bg, border-left=4px brand-primary, text=text-primary
  Inactive:   text=text-muted, hover=hover-overlay

STATUS BADGES:
  Success:    bg=success-bg, border=success-border, text=success-text
  Warning:    bg=warning-bg, border=warning-border, text=warning-text
  Error:      bg=error-bg, border=error-border, text=error-text
  Info:       bg=info-bg, border=info-border, text=info-text
  Brand:      bg=brand-primary-bg, border=brand-primary-border, text=brand-primary

PROGRESS BARS:
  Track:      bg=surface-inset, height=8px, radius=4px
  Brand fill: bg=brand-primary (teal)
  Action fill: bg=brand-action (green)
  Warning:    bg=warning
  Error:      bg=error

SCORE GAUGE (SVG):
  Track stroke:  surface-inset, strokeWidth=16
  Fill gradient: brand-primary → brand-action (270° arc, rounded caps)
  Arc direction: 135° rotation, counter-clockwise fill
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 3 — LAYOUT SYSTEM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 3.1 — Navigation Structures

### Consumer Dashboard Layout
```
┌──────────────────────────────────────────────────────────┐
│ TOP NAV (64px, surface-raised, border-bottom)            │
│ Logo | Dashboard · Tax Filing · Documents · Credit · Settings | Avatar │
├──────────────┬───────────────────────────────────────────┤
│ LEFT SIDEBAR │                                           │
│ (240px,      │  MAIN CONTENT AREA                       │
│  surface-    │  (padding: 32px 40px)                     │
│  raised,     │                                           │
│  border-right│                                           │
│ )            │                                           │
│              │                                           │
│ Quick Actions│                                           │
│ - Upload Doc │                                           │
│ - Ask Bot    │                                           │
│ - Reports    │                                           │
└──────────────┴───────────────────────────────────────────┘
```

### Pro Portal Layout
```
Same as Consumer Dashboard but:
- Top nav includes "PRO PORTAL" teal badge beside logo
- Sidebar nav: Dashboard / Clients / Calculations / Verify / Settings
- No Quick Actions sidebar — wider content area
```

### Admin Panel Layout
```
┌──────────────────────────────────────────────────────────┐
│ TOP NAV (56px) — "ADMIN" red pill badge visible          │
├────────────────┬─────────────────────────────────────────┤
│ LEFT SIDEBAR   │  MAIN CONTENT                           │
│ (220px)        │                                         │
│                │                                         │
│ Dashboard      │                                         │
│ Users          │                                         │
│ Professionals  │                                         │
│ Knowledge Base │                                         │
│ Audit Log      │                                         │
│ Marketplace    │                                         │
│ Settings       │                                         │
└────────────────┴─────────────────────────────────────────┘
```

### Settings Layout (Consumer + Pro + Admin)
```
Main sidebar + Inner settings sidebar (200px) + Content area
Inner sidebar items: Profile / Notifications / Security / Billing / API
```

### Developer Hub Layout
```
Top bar (56px) — Logo + Breadcrumb + Search + Version selector + Avatar
Left docs sidebar (220px) — endpoint/nav categories
Main content area (55%) — endpoint spec, params, code blocks
Right panel (45%) — table of contents OR try-it console
```

## 3.2 — Page Structure Grid

```
Mobile breakpoints: 375px (SE), 390px (iPhone 14), 428px (Pro Max)
Tablet breakpoint:  768px
Desktop breakpoint: 1280px, 1440px, 1920px

Mobile: Single column, 20px horizontal padding, 16px gaps
Desktop: Fixed sidebar + fluid content, 40px content padding
Max content width: 1400px (centered with auto margins on wider screens)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 4 — COMPLETE SCREEN INVENTORY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Each screen below has a corresponding screenshot in the attached reference files. Match the attached image EXACTLY for layout, spacing, component placement, and color treatment. Screenshots are the ground truth — this text is the specification.

## 4.1 — Public / Marketing Screens

| # | Screen | Route | Screenshot Reference |
|---|--------|-------|---------------------|
| P01 | Landing Page Hero (Desktop) | `/` | See: "Hero Section - Desktop" |
| P02 | Landing Page Hero (Mobile) | `/` | See: "Hero Section - Mobile" |
| P03 | Features Section | `/` (scroll) | See: "Features Section" |
| P04 | Pricing Page | `/pricing` | See: "Pricing Page" |
| P05 | Login Page | `/login` | See: "Auth - Login Page" |
| P06 | Signup Page | `/signup` | See: "Auth - Signup Page" |
| P07 | About Page | `/about` | See: "About Page" |
| P08 | Blog Listing | `/blog` | See: "Blog Listing Page" |
| P09 | Status Page | `/status` | See: "System Status Page" |
| P10 | Marketplace Listing | `/marketplace` | See: "Marketplace Listing Page" |
| P11 | Pro Public Profile | `/marketplace/[id]` | See: "Tax Pro Public Profile" |
| P12 | API Docs Page | `/docs` | See: "API Docs Page" |

## 4.2 — Consumer Dashboard Screens

| # | Screen | Route | Screenshot Reference |
|---|--------|-------|---------------------|
| D01 | Main Dashboard | `/dashboard` | See: "B2C Consumer Dashboard" |
| D02 | Credit Score Overview | `/dashboard/credit` | See: "Credit Score Detail Page" |
| D03 | Tax Filing Wizard (Desktop) | `/dashboard/tax-filing/[step]` | See: "Tax Filing Wizard - Desktop" |
| D04 | Tax Filing Wizard (Mobile) | Same | See: "Tax Filing Wizard - Mobile" |
| D05 | Document Upload (Desktop) | `/dashboard/documents/upload` | See: "Document Upload - Desktop" |
| D06 | Document Upload (Mobile) | Same | See: "Document Upload - Mobile" |
| D07 | My Documents | `/dashboard/documents` | See: "My Documents Page" |
| D08 | Reports | `/dashboard/reports` | See: "Reports Page" |
| D09 | Settings | `/dashboard/settings` | See: "Settings Page" |
| D10 | API Keys | `/dashboard/keys` | See: "API Keys Page" |
| D11 | Usage Analytics | `/dashboard/usage` | See: "Usage Analytics Page" |
| D12 | Empty State — Documents | `/dashboard/documents` (empty) | See: "Empty State - Documents" |
| D13 | Empty State — Credit | `/dashboard/credit` (empty) | See: "Empty State - Credit Score" |
| D14 | Onboarding Welcome | (first-time UX) | See: "Onboarding - Welcome Screen" |
| D15 | Onboarding Carousel | (first-time UX) | See: "Onboarding - 3-Step Carousel" |

## 4.3 — Pro Portal Screens

| # | Screen | Route | Screenshot Reference |
|---|--------|-------|---------------------|
| PR01 | Pro Dashboard | `/pro/dashboard` | See: "B2B Pro Dashboard" |
| PR02 | Client Management | `/pro/clients` | See: "Client Management Page" |
| PR03 | Client Detail | `/pro/clients/[id]` | See: "Tax Pro Client Detail" |
| PR04 | Client Documents | `/pro/clients/[id]/documents` | See: "Client Documents Pro View" |
| PR05 | Bulk Calculations | `/pro/calculations` | See: "Bulk Calculations Page" |
| PR06 | Client Reports | `/pro/reports` | See: "Client Reports - Pro" |
| PR07 | Verify Client | `/pro/verify` | See: "Verify Client Page" |
| PR08 | Pro Settings | `/pro/settings` | See: "Pro Settings Page" |
| PR09 | Application Step 1 & 2 | `/pro/apply` | See: "Application Flow - Steps 1 & 2" |
| PR10 | Application Step 3 & 4 | `/pro/apply` | See: "Application Flow - Steps 3 & 4" |
| PR11 | Application Step 5 | `/pro/apply` | See: "Application Flow - Step 5 Verification" |

## 4.4 — Admin Panel Screens

| # | Screen | Route | Screenshot Reference |
|---|--------|-------|---------------------|
| A01 | Admin Dashboard | `/admin/dashboard` | See: "Admin Dashboard" |
| A02 | Users Management | `/admin/users` | See: "Admin Users Page" |
| A03 | Pro Users | `/admin/professionals` | See: "Admin Pro Users Page" |
| A04 | Marketplace Approvals | `/admin/marketplace` | See: "Marketplace Approvals" |
| A05 | Audit Log | `/admin/audit` | See: "Audit Log Page" |
| A06 | Knowledge Base Editor | `/admin/knowledge-base` | See: "Knowledge Base Editor" |
| A07 | Departments | `/admin/departments` | See: "Departments Page" |
| A08 | Facilities | `/admin/facilities` | See: "Facilities Monitoring Page" |
| A09 | Admin Settings | `/admin/settings` | See: "Admin System Settings" |

## 4.5 — Developer Hub Screens

| # | Screen | Route | Screenshot Reference |
|---|--------|-------|---------------------|
| DEV01 | API Explorer | `/developers` | See: "API Explorer" |
| DEV02 | Quickstart | `/developers/quickstart` | See: "Developer Quickstart" |
| DEV03 | API Reference | `/developers/reference` | See: "API Reference Page" |
| DEV04 | SDKs | `/developers/sdks` | See: "SDKs / Client Libraries Page" |
| DEV05 | Sandbox | `/developers/sandbox` | See: "Sandbox Environment" |
| DEV06 | Webhooks | `/developers/webhooks` | See: "Webhooks Management" |

## 4.6 — Notification & Component System

| # | Component | Screenshot Reference |
|---|-----------|---------------------|
| C01 | Toast Notifications (all 4 types) | See: "Notification & Toast System" |
| C02 | Inline Notifications (all 4 types) | Same |
| C03 | Status Badges | Same |
| C04 | Mobile Navigation Patterns | See: "Mobile Navigation Patterns" |

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 5 — COMPONENT SPECIFICATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.1 — Core Component Library

Build these components first. All other screens compose from them.

### Button
```
Variants: primary | secondary | ghost | brand | danger | link
Sizes:    SM (h-8, px-4) | MD (h-10, px-6) | LG (h-12, px-7) | XL (h-14, px-8) | icon (h-10 w-10)
States:   default | hover | active | focus | disabled (opacity-40)
Full-width variant: w-full
Focus ring: 2px ring at color-focus-ring, offset at surface-base
```

### Card
```
Variants: default | teal-accent | green-accent | amber-accent | red-accent | danger-zone
Base:     bg=surface-overlay, border=1px border-default, radius=card(16px), shadow=shadow-card
Padding:  28px standard, 24px compact, 32px large
Hover state: border transitions to border-strong
```

### Input + Textarea
```
Height:   48px (input), variable (textarea)
Padding:  0 16px
Radius:   10px
States:   default | focus (teal border + ring) | error (red border + ring) | disabled
Labels:   12px gray, uppercase, letter-spacing 0.12em, above the field
Hints:    12px below the field (gray or red depending on state)
Inline badge: e.g., "✓ Verified" green pill inside input right side
```

### Badge / Status Pill
```
Height:    auto (padding 3px 10px)
Radius:    6px (badge) or 9999px (pill)
Font:      11px Syne Bold, uppercase
Dot:       Optional 6px filled circle (current color) prepended
Required variants: success | warning | error | info | brand | neutral | "Live" | "PRO" | "ADMIN"
```

### Data Table
```
Header:    bg=surface-raised, text=text-muted 12px uppercase, letter-spacing 0.08em
Rows:      Alternating surface-overlay / surface-inset, 56-64px height
Hover:     Row bg shifts by hover-overlay
Selected:  Subtle teal tint (brand-primary-bg), teal checkbox
Borders:   1px border-subtle between rows
Checkboxes: Left-most column, teal when checked
Actions column: right-aligned, "View" teal link + icon links
Pagination: centered below, active page in teal pill
```

### Score Gauge (SVG Component)
```
Full circle: 270° visible arc (rotated 135°)
Stroke width: 16px
Track: surface-inset (#1E2A35 in dark)
Fill: linear gradient teal(0%) → green(100%)
End caps: round (strokeLinecap="round")
Center text: score value (Syne Bold 48px), label below (gray 13px)
Size: 200px diameter (standard), 80px (mini/card)
```

### Progress Bar
```
Container: surface-inset bg, 8px height, radius 4px, full width
Fill:      Variants — brand (teal) | action (green) | warning (amber) | error (red)
          Gradient option: teal → green (or teal → amber for warning threshold)
Label:     Percentage shown right-aligned above bar in matching color
```

### Toggle Switch
```
Track:  40px × 20px, radius pill, gray when off, teal when on
Thumb:  16px circle, white, translates 20px right when on
Label:  right of switch, gray 13px when off, text-primary when on
```

### Toast Notification
```
Position:   Top-right, 16px from edge, stacked with 8px gap
Width:      380px max, full-width on mobile
Structure:  surface-overlay bg, 4px left border (status color), radius 12px, shadow-modal
            Left: status icon circle (32px) | Center: title (SemiBold 14px) + subtitle (gray 13px) | Right: dismiss ✕
Progress:   4px status-colored bar at bottom, animates from 100% to 0 over dismiss timeout
Auto-dismiss: 5 seconds
```

### Code Block
```
Background:  surface-raised (#0D1117)
Radius:      10-12px
Padding:     20px 24px
Border:      1px border-default
Language tab: top-left, gray 11px monospace
Copy button: top-right, "📋 Copy" teal small pill (28px)
Font:        JetBrains Mono 13px, line-height 1.7

Syntax colors:
  Keywords/HTTP methods: #3B82F6 (blue)
  Strings/values:        #32E875 (green)
  Object keys/properties:#0D7377 (teal)
  Comments:              #4A5568 (gray)
  Brackets/punctuation:  #FFFFFF (white)
  Numbers:               #3B82F6 (blue)
```

### Navigation — Mobile Bottom Tab Bar
```
Height:     80px (46px functional + 34px safe area)
Background: surface-raised (#0D1117)
Border-top: 1px border-default
Tabs:       5 items — Home | Upload (FAB) | Chat | Credit | Profile
Tab active: teal icon + teal label + 4px teal dot indicator
Tab inactive: gray icon + gray label
Upload FAB: 56px circle, green (#32E875), centered, elevated 20px above bar
            Box-shadow: 0 0 24px rgba(50,232,117,0.35)
```

### Empty State Component
```
Structure (vertically centered in container):
  1. Illustration (geometric, brand-colored, 120-160px)
  2. Headline (Syne Bold 22px, white)
  3. Subtext (Syne Regular 15px, gray, max-width 280px, centered)
  4. Primary CTA button (full-width minus margins)
  5. Secondary link (optional)
  6. Tip card (optional, #111922, border-radius 14px)
Tone: Encouraging, action-oriented. Never frustrating.
```

## 5.2 — Screen-Specific Components

### Credit Score Ring
```
Reference screenshot: "Credit Score Detail Page" right column
SVG component with:
- 200px diameter full circle
- 270° arc track + fill
- Gradient: teal → green
- Center: score number (56px Syne Bold), tier label (green 14px), scale label (gray 12px)
- Color scale bar below circle (red → amber → green gradient, 8px height, 120px wide)
- Triangle position marker on scale bar
```

### Document Status Row
```
Reference: "My Documents Page" table rows
Structure: File type icon (36px, colored by type) | filename + metadata | extracted chips | status badge | actions
File type colors: PDF=teal, JPG=amber, Forms=blue
Status: Extracted=green | Processing=amber spinner | Needs Review=amber ⚠ | Failed=red ✗
Extracted data chips: amount (green) | category (teal) | date (gray)
```

### AI Chat Bubble (Tax Filing Wizard)
```
Reference: "Tax Filing Wizard" screens
Card: #111922, border-radius 16px, border-left 4px solid brand-action(green)
Header: constellation icon (20px) + "Creditax AI" teal 12px + timestamp gray 11px
Message: white 14-15px, Syne Regular, line-height 1.6
Action buttons: below message, side by side, green filled + teal outline
```

### Uptime History Bar Chart (Status Page)
```
Reference: "System Status Page" expanded row
30 bars, each 8px wide, 32px height, 3px gap
Green bars = operational days
Amber bar = partial incident day
Red bar = full outage day
X-axis labels: date range
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 6 — INTERACTION SPECIFICATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 6.1 — Transition Timing

```
Default UI transition:  150ms ease
Theme switch:           200ms ease (all color properties)
Modal open:             backdrop 200ms, card 250ms scale + fade (from 0.95 to 1.0)
Toast enter:            slide-in from right 200ms
Toast exit:             slide-out + fade 150ms
Page transitions:       fade 100ms
Sidebar collapse:       250ms
Score gauge fill:       800ms ease-out on mount
Progress bars:          600ms ease-out on mount
Toggle switch:          200ms spring
Hover states:           100ms
Active states:          80ms
```

## 6.2 — Theme Switch

```
Trigger: ThemeToggle component (sun/moon icon pill in top nav)
Method:  document.documentElement.setAttribute('data-theme', 'light'|'dark')
Persist: localStorage key 'creditax-theme'
Default: 'dark'
OS pref: Respect prefers-color-scheme on first visit
Transition: All color CSS variables transition 200ms ease simultaneously
```

## 6.3 — Mobile-Specific Interactions

```
Upload FAB pulse: Subtle ambient glow animation on the upload FAB
  - On upload pages: increased glow (0 0 32px rgba(50,232,117,0.5))
  - On other pages: standard glow (0 0 24px rgba(50,232,117,0.35))

Swipe navigation: Onboarding carousel swipeable
Score gauge: Animates fill from 0 to final value on mount (800ms)
Progress bar: Animates width from 0 to value on mount (600ms)
Pull to refresh: On document list, dashboard stats
```

## 6.4 — Table Interactions

```
Row hover:    rgba(255,255,255,0.04) background overlay
Row click:    Navigate to detail page (or select if in bulk-select mode)
Checkbox:     Click row checkbox or header to select/deselect all
Sort columns: Click column header, shows ↑↓ sort indicator
Expandable:   Click "▶ Details" in audit log to expand diff view below row
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 7 — TECHNICAL IMPLEMENTATION NOTES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 7.1 — Framework & Stack

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript (strict mode)
Styling:        Tailwind CSS v3 with custom config (see token system)
Components:     shadcn/ui as base (headless, accessible)
State:          Zustand (UI state) + TanStack Query v5 (server state)
Forms:          React Hook Form + Zod
Charts:         Recharts (gauges, line charts, bar charts)
Maps:           Mapbox GL JS (marketplace map, location picker)
Code editor:    CodeMirror 6 (KB markdown editor)
Animations:     Framer Motion
Icons:          Lucide React (consistent, tree-shakable)
Fonts:          Google Fonts: Syne + JetBrains Mono (preloaded)
```

## 7.2 — Route Groups (Next.js App Router)

```
app/
├── (public)/           ← No auth required
├── (auth)/             ← Login/signup pages (no sidebar)
├── (dashboard)/        ← USER role and above
├── (pro)/              ← TAX_PRO role
├── (admin)/            ← ADMIN / SUPER_ADMIN role
└── (developers)/       ← USER role and above
```

## 7.3 — Responsive Behavior

```
DESKTOP (≥1280px):  Full sidebar + content layout
TABLET (768-1279px): Collapsible sidebar (icon-only mode)
MOBILE (<768px):    Bottom tab navigation, no sidebar
                    Top bar: hamburger or back arrow only

Card grid:
  Desktop: 3 or 4 columns
  Tablet:  2 columns
  Mobile:  1 column (full width minus 20px margins)

Table → Card list on mobile:
  All data tables become card-list format on mobile
  Each row becomes a card with same info laid out vertically
```

## 7.4 — Accessibility Requirements

```
Color contrast: WCAG AA minimum (4.5:1) for all text
Focus rings:    2px solid brand-primary, 2px offset at surface-base
Keyboard nav:   All interactive elements keyboard-reachable
ARIA labels:    All icon-only buttons require aria-label
Screen readers: Status badges include sr-only text for context
Font size:      Minimum 12px (no smaller, even for labels)
Touch targets:  Minimum 44×44px (Apple HIG) on mobile
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 8 — BRAND ASSET USAGE RULES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 8.1 — Logo Mark (Constellation C)

```
The primary Creditax.ai logo is the Constellation Node mark:
- A network of 11 interconnected dots forming the letter "C"
- 7 dots in deep teal (#0D7377)
- 4 anchor dots in bright green (#32E875) at: topmost point, two arm endpoints, inner curve
- Connecting edges: thin straight lines, teal at 40% opacity
- Available as: full logo (stacked) | combination mark (horizontal) | icon only

WORDMARK TREATMENT:
"Creditax" — Syne Bold, white (dark mode) or #0A0F14 (light mode)
".ai"      — Syne Regular, bright green (#32E875) in BOTH modes — never changes

CLEAR SPACE: Minimum 1x icon height on all sides
MIN SIZE: Icon alone minimum 20px; combination mark minimum 120px wide
DO NOT: Rotate, recolor, distort, add drop shadows, place on busy backgrounds
```

## 8.2 — Iconography

```
Primary icon library: Lucide React
Style: Outline (1.5px stroke), consistent with the brand's geometric aesthetic
Size scale: 14px / 16px / 20px / 24px / 32px
Color: Inherit text color OR brand-primary for highlighted icons
Nav icons: 20px, colored per state (gray inactive → teal active)
Status icons: 20-24px, colored per status (green/amber/red/blue)

Do not mix icon libraries within the same screen.
```

## 8.3 — Illustration Style

```
All illustrations are geometric and abstract — no stock photography, 
no realistic human photography, no clipart.

Illustration palette: brand colors only
  - Primary shapes: teal (#0D7377)
  - Accent: green (#32E875)
  - Background hints: surface-inset (#1E2A35 dark / #F0F5F6 light)
  - No gradients on illustrations (flat fills only)

Types used:
  - Constellation/node networks (background elements, empty states)
  - Geometric data shapes (gauges, charts, graph patterns)
  - Simple icon-scale illustrations (feature cards, empty states)
  - Abstract map silhouettes (Nigeria map on about/identity ads)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 9 — PRIORITY BUILD ORDER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build in this sequence. Each phase depends on the prior phase's components.

```
PHASE 1 — Foundation (Build first, everything depends on these)
  □ Design token CSS file (dark + light)
  □ Tailwind config with semantic token mapping
  □ ThemeProvider + ThemeToggle
  □ Core layout components: TopNav, Sidebar, PageShell
  □ Button (all variants + sizes)
  □ Card (all variants)
  □ Input + Textarea
  □ Badge + Pill
  □ Toggle Switch
  □ Progress Bar

PHASE 2 — Public Pages
  □ Landing Hero (desktop + mobile)
  □ Features Section
  □ Pricing Page
  □ Login Page
  □ Signup Page

PHASE 3 — Consumer Dashboard
  □ Dashboard shell (layout, sidebar, top nav)
  □ Score Gauge component (SVG)
  □ Main Dashboard
  □ Document Upload (desktop + mobile)
  □ My Documents + Document Status Row
  □ Credit Score Detail
  □ Tax Filing Wizard (5 steps)
  □ Reports Page
  □ Settings Page
  □ Empty States (Documents + Credit)
  □ Onboarding (Welcome + Carousel)

PHASE 4 — Pro Portal
  □ Pro layout shell (PRO PORTAL badge)
  □ Pro Dashboard
  □ Client Management (table + bulk select)
  □ Client Detail + Documents + Reports
  □ Bulk Calculations
  □ Verify Client
  □ Pro Application (5-step flow)
  □ Pro Settings

PHASE 5 — Admin Panel
  □ Admin layout shell (ADMIN badge)
  □ Admin Dashboard
  □ Users Management
  □ Pro Users + Approval Panel
  □ Marketplace Approvals
  □ Audit Log
  □ Knowledge Base Editor (CodeMirror)
  □ Departments + Facilities + Admin Settings

PHASE 6 — Developer Hub
  □ API Explorer (Postman-style 3-panel)
  □ Quickstart
  □ API Reference
  □ SDKs Page
  □ Sandbox Environment
  □ Webhooks
  □ API Keys + Usage Analytics

PHASE 7 — Mobile
  □ Bottom Tab Bar + FAB
  □ Mobile nav patterns
  □ Responsive adaptation of all Phase 3 screens
  □ Mobile-specific Upload flow

PHASE 8 — Marketing
  □ About Page
  □ Blog Listing
  □ Status Page
  □ Marketplace Listing (with Mapbox map)
  □ Tax Pro Public Profile
  □ Notifications + Toast system
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 10 — SCREENSHOT ATTACHMENT GUIDE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When attaching screenshots to Open Design, organize them in folders matching the screen inventory:

```
/01-public-marketing/
  hero-desktop.png
  hero-mobile.png
  features-section.png
  pricing-page.png
  login-page.png
  signup-page.png
  about-page.png
  blog-listing.png
  status-page.png
  marketplace-listing.png
  pro-public-profile.png
  api-docs-page.png

/02-consumer-dashboard/
  dashboard-main.png
  credit-score-detail.png
  tax-filing-wizard-desktop.png
  tax-filing-wizard-mobile.png
  document-upload-desktop.png
  document-upload-mobile.png
  my-documents.png
  reports-page.png
  settings-page.png
  api-keys-page.png
  usage-analytics.png
  empty-state-documents.png
  empty-state-credit.png
  onboarding-welcome.png
  onboarding-carousel.png

/03-pro-portal/
  pro-dashboard.png
  client-management.png
  client-detail.png
  client-documents.png
  bulk-calculations.png
  client-reports.png
  verify-client.png
  pro-settings.png
  application-steps-1-2.png
  application-steps-3-4.png
  application-step-5.png

/04-admin-panel/
  admin-dashboard.png
  admin-users.png
  admin-pro-users.png
  marketplace-approvals.png
  audit-log.png
  knowledge-base-editor.png
  departments.png
  facilities.png
  admin-settings.png

/05-developer-hub/
  api-explorer.png
  quickstart.png
  api-reference.png
  sdks-page.png
  sandbox-environment.png
  webhooks-management.png

/06-components/
  notification-toast-system.png
  mobile-navigation-patterns.png

/07-brand/
  logo-constellation-node.png
  logo-combination-mark.png
  product-one-pager.png
  api-docs-cover.png

/08-design-tokens/
  (attach the Design Token System markdown document)

/09-technical-docs/
  (attach the Technical Documentation Suite PDF/markdown)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECTION 11 — QUALITY CHECKLIST
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before marking any screen complete, verify:

```
VISUAL FIDELITY
□ Matches attached screenshot closely
□ All colors reference semantic tokens (not hardcoded hex)
□ Typography matches the type scale (font, weight, size, line-height)
□ Spacing matches the spacing system
□ Border radius values correct per component type
□ Icons from Lucide React, correct size and color

DARK MODE
□ Works correctly with [data-theme="dark"] on html element
□ All semantic tokens resolve correctly
□ No hardcoded colors that break in dark mode
□ Shadows are glow-based (not drop-shadow) in dark mode

LIGHT MODE
□ Works correctly with [data-theme="light"]
□ Text is readable (primary = #0A0F14, passes WCAG on white)
□ Green CTA uses darkened shade (#1DC75A) for light bg
□ Borders use black-opacity (not white-opacity)
□ Shadows are drop-based in light mode

RESPONSIVE
□ Desktop layout matches 1920px screenshot
□ Mobile layout works at 375px
□ No horizontal overflow
□ Touch targets ≥ 44×44px
□ Bottom tab bar correct on mobile

ACCESSIBILITY
□ Focus rings visible on keyboard navigation
□ All interactive elements have ARIA labels if icon-only
□ Color contrast meets WCAG AA
□ Form inputs have associated labels

INTERACTIONS
□ Hover states on buttons, rows, cards
□ Active/pressed states on buttons
□ Focus rings on all inputs and buttons
□ Theme toggle switches correctly
□ Transitions use correct timing values
```

---

> **Project:** Creditax.ai
> **Total Screens:** 57 (desktop) + mobile variants
> **Design Sessions:** See attached screenshot archive
> **Technical Docs:** See attached 12-document suite
> **Design Tokens:** See attached token system document
> **Last Updated:** June 2025
> **Build Target:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
