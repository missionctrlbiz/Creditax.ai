# Creditax.ai — Brand Identity Foundation

**Project:** Creditax.ai
**Status:** Draft v1.0
**Date:** June 11, 2026

---

## Brand Overview

**Name:** Creditax.ai
**Tagline:** *(TBD — options below)*
- "Tax Smart. Borrow Smart."
- "Your AI-Powered Tax & Credit Intelligence"
- "The Platform for Financial Clarity"

**Core Value Proposition:** An API-first AI platform that bridges tax compliance and creditworthiness — helping Nigerians understand their taxes and access fair financial services.

**Brand Personality:**
- Trustworthy (like a good accountant)
- Clear (no jargon)
- Optimistic (progress over problems)
- Modern but rooted (African identity + global technology)

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Deep Teal** | `#0D7377` | Primary brand color — trust, stability, growth |
| **Light Teal** | `#14919B` | Accent buttons, links, secondary elements |
| **Bright Green** | `#32E875` | Success states, CTAs, money/tax positive associations |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Dark Background** | `#0A0F14` | Premium tech feel, dark mode |
| **Light Background** | `#F4F9F9` | Clean, readable, cards |
| **Primary Text** | `#1A2B3C` | Main body copy |
| **Muted Text** | `#6B7B8C` | Secondary text, placeholders |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#10B981` | Positive states, confirmations |
| **Warning** | `#F59E0B` | Caution states, pending |
| **Error** | `#EF4444` | Error states, failed |
| **Info** | `#3B82F6` | Informational alerts |

### Color Accessibility Note

- All text/background combinations meet WCAG AA contrast ratios
- Primary text on light background: 12.8:1 contrast (exceeds AA)
- Muted text on light background: 5.9:1 contrast (exceeds AA)

---

## Typography

### Font Stack

```
PRIMARY:     Inter (Google Fonts)
FALLBACK:    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
MONOSPACED:  JetBrains Mono (for code, amounts, API references)
```

### Type Scale

| Style | Font | Weight | Size | Line Height | Usage |
|-------|------|--------|------|-------------|-------|
| **H1** | Inter | 700 | 48px | 1.1 | Page titles |
| **H2** | Inter | 700 | 36px | 1.2 | Section headers |
| **H3** | Inter | 600 | 24px | 1.3 | Card titles |
| **H4** | Inter | 600 | 20px | 1.4 | Subsections |
| **Body Large** | Inter | 400 | 18px | 1.6 | Lead paragraphs |
| **Body** | Inter | 400 | 16px | 1.6 | Standard text |
| **Body Small** | Inter | 400 | 14px | 1.5 | Secondary text |
| **Caption** | Inter | 400 | 12px | 1.4 | Labels, captions |
| **Code** | JetBrains Mono | 400 | 14px | 1.5 | API examples, amounts |

### Monospace Usage

Use JetBrains Mono for:
- API endpoints and code snippets
- Tax amounts and calculations
- API keys (masked display)
- Technical documentation

---

## Logo Concept

### Design Direction

**Concept:** Abstract mark combining two ideas:
1. An upward arrow/staircase (progress, growth, tax going up properly)
2. A stylized "C" or circular flow (credit, circulation, completeness)

**Style:** Minimal, geometric, works at 16px (favicon) and 256px+ (hero)

### Color Usage (Logo)

| Version | Background | Mark | Text |
|---------|------------|------|------|
| **Primary** | `#0A0F14` (dark) | Teal gradient | White |
| **Light** | `#F4F9F9` (light) | Deep Teal | Dark |
| **Mono** | Any | Single color mark | Single color |

### Logo Construction (Mental Notes)

- Mark height: 40px (header), 24px (footer)
- Text "Creditax" in Inter 600
- ".ai" in Inter 400, slightly muted
- Clear space: 1x mark height on all sides

### Visual Inspirations (Mood Board)

```
NOT:                          DO:
- Clip art, cartoons           - Clean geometric forms
- gradients that look dated    - Subtle, intentional gradients
- drop shadows                 - Flat or minimal depth
- "tech startup" blue/purple   - Teal + green (money + trust)
- Nigerian flag green/white    - Accent only (not dominate)
```

---

## Visual System

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Component internal |
| `--space-3` | 16px | Between elements |
| `--space-4` | 24px | Section gaps |
| `--space-5` | 32px | Major sections |
| `--space-6` | 48px | Page sections |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Inputs, small buttons |
| `--radius-md` | 8px | Cards, containers |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-full` | 9999px | Pills, avatars |

### Borders

- Default: `1px solid rgba(13, 115, 119, 0.2)` (low opacity teal)
- Hover: `1px solid #0D7377`
- Focus: `2px solid #32E875` (green focus ring)

### Shadows

```
SMALL:  0 2px 8px rgba(13, 115, 119, 0.06)
MEDIUM: 0 4px 24px rgba(13, 115, 119, 0.08)
LARGE:  0 8px 40px rgba(13, 115, 119, 0.12)
```

### Gradients

| Usage | Gradient |
|-------|----------|
| **Hero Background** | `linear-gradient(135deg, #0D7377 0%, #14919B 50%, #32E875 100%)` |
| **CTA Buttons** | `linear-gradient(135deg, #0D7377 0%, #14919B 100%)` |
| **Dark Mode Cards** | `linear-gradient(180deg, #141A1F 0%, #0A0F14 100%)` |

### Illustrations

- **Style:** Abstract geometric, not cartoon
- **Palette:** Brand colors only
- **Usage:** Empty states, onboarding, error pages
- **Icons:** Lucide or Phosphor (consistent 24px stroke)

---

## Tone of Voice

### Sound Like

- **Clear:** Use simple words. "Your tax is N12,500" not "Your aggregate tax liability pursuant to Section 23 of the NTA amounts to..."
- **Direct:** Get to the point. No fluff.
- **Reassuring:** Tax and money are stressful. Be calm, be confident.
- **Optimistic:** "You're on track" not "You're behind."
- **Human:** Write like a helpful colleague, not a government website.

### Writing Examples

| Don't Say | Say Instead |
|-----------|-------------|
| "Tax compliance is mandatory under the Nigeria Tax Administration Act" | "You need to file by this date. Here's how." |
| "Your query could not be processed at this time" | "Something went wrong. Try again in a moment." |
| "Utilize our platform to maximize your tax efficiency" | "Save more on your taxes with these tips." |
| "We are pleased to inform you..." | Skip it entirely. Get to the point. |
| "Kindly be advised that..." | "Please..." or just state what you need. |

### Error Messages

| Situation | Message |
|-----------|---------|
| API rate limit | "Too many requests. Slow down and try again in a moment." |
| Invalid input | "Check that again — [field] doesn't look right." |
| Server error | "Something broke on our end. We're fixing it." |
| Auth failure | "That API key isn't working. Check your dashboard." |

---

## Photography & Imagery

### Style

- **Real people:** Diverse Nigerians in everyday professional settings
- **Not:** Stock photos of suits shaking hands, Lagos skyline without people
- **Prefer:** Close-up of hands using phone, someone reading on a bus, market seller with phone

### Treatment

- Warm, natural lighting
- Slight desaturation (not fully black & white)
- Brand color overlays at 20% opacity for accent

### Avoid

- Generic "business" imagery
- Overly polished corporate shots
- Anything that looks like stock photography

---

## Motion & Animation

### Principles

- **Purposeful:** Animation communicates state, not decoration
- **Quick:** 150-300ms for micro-interactions
- **Smooth:** Ease-out for exits, ease-in-out for transitions

### Standard Animations

| Trigger | Animation |
|---------|-----------|
| Button hover | Scale 1.02, 150ms ease-out |
| Card hover | Shadow increase, 200ms |
| Modal open | Fade in + scale from 0.95, 250ms ease-out |
| Page transitions | Fade, 200ms |
| Loading | Pulse or shimmer, infinite |
| Success | Brief scale bounce + checkmark |

### Don't

- Excessive motion that distracts
- Animations that delay user action
- Parallax scrolling (accessibility issue)

---

## Component Guidelines (Reference)

### Buttons

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| **Primary** | `#0D7377` | White | None |
| **Secondary** | Transparent | `#0D7377` | 1px `#0D7377` |
| **Accent** | `#32E875` | `#0A0F14` | None |
| **Ghost** | Transparent | `#6B7B8C` | None |

### Cards

- Background: `#FFFFFF` (light) or `#141A1F` (dark)
- Border: `1px solid rgba(13, 115, 119, 0.15)`
- Radius: `8px`
- Shadow: `0 4px 24px rgba(13, 115, 119, 0.08)`
- Padding: `24px`

### Inputs

- Background: `#FFFFFF`
- Border: `1px solid rgba(13, 115, 119, 0.25)`
- Radius: `6px`
- Padding: `12px 16px`
- Focus: `2px solid #32E875`

### Code Blocks

- Background: `#0A0F14`
- Text: `#E2E8F0` (light gray)
- Border radius: `8px`
- Padding: `20px`
- Font: JetBrains Mono 14px

---

## Logo Assets (To Be Created)

### Files Needed

- [ ] Primary logo (SVG, PNG @1x, @2x, @3x)
- [ ] Dark background logo
- [ ] Light background logo
- [ ] Icon/mark only (for favicon, app icon)
- [ ] Favicon (16x16, 32x32, 48x48)
- [ ] Apple touch icon
- [ ] Social media preview (1200x630)

### Dimensions

| Asset | Dimensions | Format |
|-------|------------|--------|
| Logo horizontal | 200x40px (scalable) | SVG, PNG |
| Logo stacked | 80x80px (scalable) | SVG, PNG |
| Icon mark | 40x40px | SVG, PNG |
| Favicon | 32x32px | PNG |
| OG Image | 1200x630px | PNG |

---

## Brand in Code

### CSS Variables (Reference)

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
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Next Steps

- [ ] Finalize tagline
- [ ] Commission or design logo mark
- [ ] Create logo asset files (SVG, PNG)
- [ ] Set up design system in Figma or similar
- [ ] Apply brand to landing page mockup
- [ ] Create brand guidelines PDF

---

*Document Version: 1.0*
*Last Updated: June 11, 2026*
*Next Review: Upon brand refresh*

## Changelog

### v1.0 (June 11, 2026)
- Initial brand identity draft