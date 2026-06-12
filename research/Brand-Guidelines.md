# Creditax.ai — Brand Guidelines

**Version:** 1.0
**Last Updated:** June 11, 2026
**Status:** Living Document

---

## Table of Contents

1. [Brand Foundation](#1-brand-foundation)
2. [Design Principles](#2-design-principles)
3. [Visual Identity](#3-visual-identity)
4. [Typography System](#4-typography-system)
5. [Color System](#5-color-system)
6. [Component Library](#6-component-library)
7. [Motion & Animation](#7-motion--animation)
8. [Coding Conventions](#8-coding-conventions)
9. [Voice & Tone](#9-voice--tone)
10. [Technical Standards](#10-technical-standards)

---

## 1. Brand Foundation

### Brand Essence

**Name:** Creditax.ai
**Tagline:** *(Finalize: "Tax Smart. Borrow Smart." or "Your AI-Powered Tax & Credit Intelligence")*

**Core Value Proposition:** An API-first AI platform bridging tax compliance and creditworthiness — helping Nigerians understand their taxes and access fair financial services.

**Brand Personality:**

| Trait | Description |
|-------|-------------|
| Trustworthy | Like a good accountant — reliable, competent, discreet |
| Clear | No jargon — plain language everyone understands |
| Optimistic | Progress over problems — solutions-focused |
| Modern but Rooted | African identity + global technology |

**Design Mandate:** Design like a premium fintech institution, not a generic tech startup. The interface should feel like it costs N150k to build, not like a free SaaS template.

---

## 2. Design Principles

### Core Design Philosophy

Creditax interfaces must demonstrate **intentionality**. Every visual choice has a reason. We reject template aesthetics and generic defaults.

### The Four Pillars

#### 1. Distinctive Over Default

AI-generated design clusters around three overused looks. Creditax explicitly avoids these:

| Default (Avoid) | Creditax Approach |
|-----------------|-------------------|
| Warm cream (#F4F1EA) + terracotta + serif | Deep teal palette with green accents |
| Near-black + acid-green/acid-vermilion | Sophisticated dark mode with teal gradient |
| Broadsheet-style, hairline rules, zero radius | Purposeful spacing with considered radius |

**Rule:** If your design choice appears in 50% of AI-generated UIs, reconsider it.

#### 2. Typography as Personality

Typography carries the brand's voice. Pair fonts deliberately — not the same families used on every project.

Creditax uses **Inter** for clarity and professionalism, **JetBrains Mono** for technical precision. These choices serve function, not fashion.

#### 3. Structure Encodes Information

Structural devices (numbering, dividers, labels) must encode truth about the content:

- `01 / 02 / 03` sequence markers = only when order genuinely matters
- Section dividers = only when content truly separates
- Eyebrow labels = only when they clarify hierarchy

#### 4. Motion with Purpose

Animation communicates state, never decorates. Every motion answers: "What does this tell the user?"

### The Signature Move

Spend boldness in **one place**. Let one memorable element define the page. Everything else stays quiet and disciplined.

**Creditax Signature:** The upward-trending mark (progress, growth) combined with circular flow (credit, completeness). This mark should appear sparingly but memorably.

---

## 3. Visual Identity

### Logo Usage

#### Primary Logo

- **Background:** `#0A0F14` (dark)
- **Mark:** Teal gradient (`#0D7377` → `#32E875`)
- **Text:** White

#### Light Background Logo

- **Background:** `#F4F9F9` (light)
- **Mark:** Deep Teal (`#0D7377`)
- **Text:** Dark (`#1A2B3C`)

#### Mono Logo (Single Color)

- Single color mark + single color text
- Use when brand colors would compete

#### Clear Space

- Minimum clear space: 1× mark height on all sides
- Never crop, rotate, or alter the logo

#### Logo Dimensions

| Context | Height |
|---------|--------|
| Header | 40px |
| Footer | 24px |
| Favicon | Use mark only |

### Visual Inspiration

```
NOT:                          DO:
- Clip art, cartoons           - Clean geometric forms
- Dated gradients              - Subtle, intentional gradients
- Drop shadows                 - Flat or minimal depth
- Generic "tech startup" blue  - Teal + green (money + trust)
- Nigerian flag dominate       - Accent only (not dominate)
```

---

## 4. Typography System

### Font Stack

```css
PRIMARY:     'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
MONOSPACED:  'JetBrains Mono', 'Fira Code', Consolas, monospace
```

### Type Scale

| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---------|------|--------|------|-------------|----------------|
| **Display** | Inter | 700 | 56px | 1.05 | -0.02em |
| **H1** | Inter | 700 | 48px | 1.1 | -0.02em |
| **H2** | Inter | 700 | 36px | 1.2 | -0.01em |
| **H3** | Inter | 600 | 24px | 1.3 | 0 |
| **H4** | Inter | 600 | 20px | 1.4 | 0 |
| **Lead** | Inter | 400 | 18px | 1.6 | 0 |
| **Body** | Inter | 400 | 16px | 1.6 | 0 |
| **Body Small** | Inter | 400 | 14px | 1.5 | 0 |
| **Caption** | Inter | 400 | 12px | 1.4 | 0.02em |
| **Code** | JetBrains Mono | 400 | 14px | 1.5 | 0 |

### Monospace Usage (JetBrains Mono)

Use exclusively for:

- API endpoints and code snippets
- Tax amounts and calculations
- API keys (masked display)
- Technical documentation
- Data tables with numbers

### Premium Type Pairing Strategy

**Display/Hero:** Large, bold Inter — sets the tone
**Body:** Regular Inter — clarity above all
**Technical:** JetBrains Mono — precision for code/numbers

**Never use:**

- Multiple display fonts competing for attention
- Script or decorative fonts in body copy
- System fonts as primary (Arial, Helvetica defaults)

---

## 5. Color System

### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Deep Teal** | `#0D7377` | 13, 115, 119 | Primary brand, trust, stability |
| **Light Teal** | `#14919B` | 20, 145, 155 | Secondary elements, hover states |
| **Bright Green** | `#32E875` | 50, 232, 117 | CTAs, success, positive associations |

### Backgrounds

| Name | Hex | Usage |
|------|-----|-------|
| **Dark Base** | `#0A0F14` | Premium dark mode, hero sections |
| **Dark Elevated** | `#141A1F` | Cards on dark, elevated surfaces |
| **Light Base** | `#F4F9F9` | Clean backgrounds, cards |
| **White** | `#FFFFFF` | Content areas, inputs |

### Text Colors

| Name | Hex | Contrast Ratio | Usage |
|------|-----|----------------|-------|
| **Primary Text** | `#1A2B3C` | 12.8:1 on white | Main body copy (exceeds AA) |
| **Muted Text** | `#6B7B8C` | 5.9:1 on white | Secondary text (exceeds AA) |
| **White Text** | `#FFFFFF` | On dark backgrounds | Text on dark surfaces |
| **Inverse Text** | `#1A2B3C` | On light backgrounds | Text on light surfaces |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#10B981` | Positive confirmations, savings |
| **Warning** | `#F59E0B` | Caution, pending states |
| **Error** | `#EF4444` | Failures, errors, alerts |
| **Info** | `#3B82F6` | Informational messages |

### Gradients

| Usage | Formula |
|-------|---------|
| **Hero Background** | `linear-gradient(135deg, #0D7377 0%, #14919B 50%, #32E875 100%)` |
| **CTA Primary** | `linear-gradient(135deg, #0D7377 0%, #14919B 100%)` |
| **Dark Mode Card** | `linear-gradient(180deg, #141A1F 0%, #0A0F14 100%)` |

### Accessibility Compliance

- All text/background combinations meet **WCAG AA** (4.5:1 minimum)
- Primary text on light: **12.8:1** ✓
- Muted text on light: **5.9:1** ✓
- All interactive elements have visible focus states

---

## 6. Component Library

### Button System

#### Button Variants

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| **Primary** | `#0D7377` | White | None | Main CTAs |
| **Primary Hover** | `#14919B` | White | None | Hover state |
| **Secondary** | Transparent | `#0D7377` | 1px `#0D7377` | Secondary actions |
| **Accent** | `#32E875` | `#0A0F14` | None | Success, money-related |
| **Ghost** | Transparent | `#6B7B8C` | None | Tertiary actions |
| **Danger** | `#EF4444` | White | None | Destructive actions |

#### Button Anatomy

- **Padding:** `12px 24px` (standard), `12px 16px` (compact)
- **Radius:** `8px` (standard), `6px` (compact), `9999px` (pill)
- **Font:** Inter 600, 14px
- **Transition:** 150ms ease-out

#### Button Hierarchy

1. **Primary CTA** — Most important action, maximum visual weight
2. **Secondary** — Supporting actions, balanced
3. **Ghost** — Minimal, when interface needs breathing room
4. **Danger** — Destructive actions only, used sparingly

### Card System

#### Standard Card

```css
background: #FFFFFF;
border: 1px solid rgba(13, 115, 119, 0.15);
border-radius: 8px;
padding: 24px;
box-shadow: 0 4px 24px rgba(13, 115, 119, 0.08);
```

#### Dark Mode Card

```css
background: linear-gradient(180deg, #141A1F 0%, #0A0F14 100%);
border: 1px solid rgba(13, 115, 119, 0.2);
border-radius: 8px;
padding: 24px;
```

#### Card Hover State

```css
box-shadow: 0 8px 40px rgba(13, 115, 119, 0.12);
transform: translateY(-2px);
```

### Input System

#### Text Input

```css
background: #FFFFFF;
border: 1px solid rgba(13, 115, 119, 0.25);
border-radius: 6px;
padding: 12px 16px;
font: Inter 400, 16px;
transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
```

#### Input States

| State | Border | Shadow |
|-------|--------|--------|
| **Default** | `rgba(13, 115, 119, 0.25)` | None |
| **Focus** | `#32E875` | `0 0 0 3px rgba(50, 232, 117, 0.15)` |
| **Error** | `#EF4444` | `0 0 0 3px rgba(239, 68, 68, 0.15)` |
| **Disabled** | `rgba(13, 115, 119, 0.1)` | None |

### Code Block

```css
background: #0A0F14;
border: 1px solid rgba(13, 115, 119, 0.2);
border-radius: 8px;
padding: 20px;
font: 'JetBrains Mono', monospace, 14px;
color: #E2E8F0;
```

### Icon System

- **Library:** Lucide or Phosphor (consistent 24px, stroke-based)
- **Stroke Width:** 1.5px (light), 2px (standard)
- **Size Scale:** 16px (inline), 20px (buttons), 24px (standard), 32px (feature)

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, icon margins |
| `--space-2` | 8px | Component internal spacing |
| `--space-3` | 16px | Between related elements |
| `--space-4` | 24px | Section gaps, card padding |
| `--space-5` | 32px | Major section padding |
| `--space-6` | 48px | Page section margins |
| `--space-8` | 64px | Hero sections |
| `--space-12` | 96px | Large section breaks |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Inputs, small buttons |
| `--radius-md` | 8px | Cards, standard elements |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Feature cards |
| `--radius-full` | 9999px | Pills, avatars, badges |

---

## 7. Motion & Animation

### Motion Principles

1. **Purposeful:** Animation communicates state, never decorates
2. **Quick:** 150-300ms for micro-interactions
3. **Smooth:** Ease-out for entrances, ease-in for exits
4. **Reduced Motion:** Respect `prefers-reduced-motion`

### Standard Animations

| Trigger | Property | Duration | Easing |
|---------|----------|----------|--------|
| Button hover | `transform: scale(1.02)` | 150ms | ease-out |
| Card hover | `box-shadow`, `transform: translateY(-2px)` | 200ms | ease-out |
| Modal open | `opacity`, `transform: scale(0.95 → 1)` | 250ms | ease-out |
| Page transitions | `opacity` | 200ms | ease-out |
| Loading | `opacity` pulse/shimmer | infinite | ease-in-out |
| Success | `transform: scale(1.05 → 1)` + checkmark | 300ms | spring |

### Entrance Animations

Elements should fade in with subtle movement. Never appear statically:

```css
/* Recommended entrance */
animation: fadeUp 600ms cubic-bezier(0.32, 0.72, 0, 1) forwards;

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Prohibited Motion

- **No parallax scrolling** — accessibility issue
- **No excessive motion** that delays user action
- **No layout-triggering animations** — animate `transform` and `opacity` only
- **No default easing** (`linear`, generic `ease-in-out`)

### Stagger Pattern

For lists and grids, stagger entrance animations:

```css
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 75ms; }
.item:nth-child(3) { animation-delay: 150ms; }
.item:nth-child(4) { animation-delay: 225ms; }
/* Continue in 75ms increments */
```

---

## 8. Coding Conventions

### General Principles

1. **Semantic HTML** — Use elements for their intended purpose
2. **CSS Custom Properties** — Define all tokens as variables
3. **Mobile-First** — Build for smallest viewport, enhance upward
4. **Accessibility First** — Keyboard navigable, screen reader friendly

### CSS Architecture

#### Variable Definitions

```css
:root {
  /* Colors */
  --color-primary: #0D7377;
  --color-primary-light: #14919B;
  --color-accent: #32E875;
  --color-bg-dark: #0A0F14;
  --color-bg-light: #F4F9F9;
  --color-text: #1A2B3C;
  --color-text-muted: #6B7B8C;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(13, 115, 119, 0.06);
  --shadow-md: 0 4px 24px rgba(13, 115, 119, 0.08);
  --shadow-lg: 0 8px 40px rgba(13, 115, 119, 0.12);

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 200ms ease-out;
  --transition-slow: 300ms ease-out;
}
```

#### Naming Conventions

```css
/* BEM-inspired naming */
.block {}
.block__element {}
.block--modifier {}

/* Component naming */
.button {}
.button--primary {}
.button__icon {}

/* Utility naming */
.text-primary {}
.bg-dark {}
.flex-center {}
```

#### Specificity Rules

- Keep specificity low and predictable
- Prefer class selectors over element selectors
- Avoid `!important` except for utility classes
- Never let element selectors override component styles

### TypeScript Conventions

#### Naming

```typescript
// Variables and functions: camelCase
const userName = 'Taiwo';
function calculateTax() {}

// Types and interfaces: PascalCase
interface UserProfile {}
type TaxBracket = { min: number; max: number; rate: number; }

// Constants: UPPER_SNAKE_CASE
const MAX_API_REQUESTS = 100;

// Files: kebab-case
// user-profile.ts, tax-calculator.ts
```

#### Component Structure

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import type { User } from '@/types';

// 2. Type definitions
interface ComponentProps {
  user: User;
  onUpdate: (user: User) => void;
}

// 3. Component function
export function UserProfile({ user, onUpdate }: ComponentProps) {
  // 4. Hooks
  const [isEditing, setIsEditing] = useState(false);

  // 5. Effects
  useEffect(() => {
    // effect logic
  }, []);

  // 6. Handlers
  const handleSave = () => {
    // handler logic
  };

  // 7. Render
  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
}
```

### API Conventions

#### Endpoint Structure

```
/api/v1/{resource}/{action}
```

Examples:

```
POST /api/v1/auth/verify
POST /api/v1/tax/calculate
GET  /api/v1/tax/brackets
POST /api/v1/api-keys
```

#### Response Format

```typescript
// Success
{
  "success": true,
  "data": { /* resource data */ },
  "meta": { /* pagination, etc. */ }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": { /* optional field-level errors */ }
  }
}
```

#### Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid API key) |
| 403 | Forbidden (valid key but no permission) |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Internal Server Error |

### File Structure

```
src/
├── api/                    # API routes
│   └── v1/
│       ├── auth/
│       ├── tax/
│       └── index.ts
├── components/             # React components
│   ├── ui/                # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── features/          # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
│   ├── api.ts
│   └── format.ts
├── styles/                 # Global styles
│   ├── variables.css
│   └── global.css
└── types/                  # TypeScript type definitions
```

---

## 9. Voice & Tone

### Core Voice Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| **Clear** | Use simple words | "Your tax is N12,500" not "Your aggregate tax liability..." |
| **Direct** | Get to the point | Skip filler phrases |
| **Reassuring** | Calm, confident | "You're on track" not "You're behind" |
| **Human** | Helpful colleague | Not a government website |

### Writing Guidelines

#### Say This, Not That

| Avoid | Prefer |
|-------|--------|
| "Tax compliance is mandatory under the Nigeria Tax Administration Act" | "You need to file by this date. Here's how." |
| "Your query could not be processed at this time" | "Something went wrong. Try again in a moment." |
| "Utilize our platform to maximize your tax efficiency" | "Save more on your taxes with these tips." |
| "We are pleased to inform you..." | Skip entirely — get to the point |
| "Kindly be advised that..." | "Please..." or just state what you need |

#### Error Messages

| Situation | Message |
|-----------|---------|
| API rate limit | "Too many requests. Slow down and try again in a moment." |
| Invalid input | "Check that again — [field] doesn't look right." |
| Server error | "Something broke on our end. We're fixing it." |
| Auth failure | "That API key isn't working. Check your dashboard." |
| Not found | "We couldn't find that. It may have been deleted or moved." |

#### Empty States

| Context | Message |
|---------|---------|
| No documents | "No receipts yet. Upload your first receipt to get started." |
| No API keys | "No API keys yet. Create one to start integrating." |
| No transactions | "No transactions found. Add a transaction to see your tax summary." |

### Microcopy Rules

1. **Be specific** — "Save changes" not "Submit"
2. **Action verbs** — Buttons state what happens: "Publish", "Delete", "Calculate"
3. **Consistent vocabulary** — Same word for same concept throughout
4. **No jargon** — Plain language for everyone
5. **Positive framing** — Tell users what they *can* do

---

## 10. Technical Standards

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **API Response (p95)** | < 500ms | Server response time |
| **Uptime** | 99.5% | Monthly target |

### Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest 2 | Full |
| Firefox | Latest 2 | Full |
| Safari | Latest 2 | Full |
| Edge | Latest 2 | Full |
| Mobile Safari | Latest 2 | Full |
| Chrome Mobile | Latest 2 | Full |

### Accessibility Requirements

- **WCAG 2.1 AA** compliance minimum
- All interactive elements keyboard accessible
- Focus states visible (green ring: `2px solid #32E875`)
- Screen reader tested
- Color contrast ratios verified
- `prefers-reduced-motion` respected

### Security Standards

- All API keys expire and rotate
- No sensitive data in URLs
- HTTPS only
- CORS configured for known origins
- Rate limiting on all endpoints
- Input validation on all endpoints
- No secrets in client-side code

### SEO Standards

- Semantic HTML structure
- Meta tags for all pages
- Open Graph tags for social
- Structured data where appropriate
- Sitemap and robots.txt
- Performance-optimized images

---

## Quick Reference

### Color Palette at a Glance

```
Primary:     #0D7377 (Deep Teal)
Secondary:   #14919B (Light Teal)
Accent:      #32E875 (Bright Green)
Dark BG:     #0A0F14
Light BG:    #F4F9F9
Text:        #1A2B3C
Muted:       #6B7B8C
Success:     #10B981
Warning:     #F59E0B
Error:       #EF4444
```

### Key CSS Variables

```css
--color-primary: #0D7377;
--color-accent: #32E875;
--font-sans: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--radius-md: 8px;
--shadow-md: 0 4px 24px rgba(13, 115, 119, 0.08);
```

### Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Document Version: 1.0*
*Last Updated: June 11, 2026*
*Next Review: Monthly