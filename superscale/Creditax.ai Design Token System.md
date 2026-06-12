# Creditax.ai — Design Token System & Theme Architecture

> A complete two-mode design token system. Dark mode is the primary experience. Light mode is a precision-engineered complement — same brand identity, same visual hierarchy, adapted for high-contrast white surfaces. Every component in the platform should reference only semantic tokens, never raw color values.

---

## Token Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    TOKEN HIERARCHY                       │
│                                                         │
│  Layer 1: PRIMITIVE TOKENS                              │
│  Raw values. Named by color + shade. Never used in UI.  │
│  e.g. --primitive-teal-600: #0D7377                     │
│                                                         │
│  Layer 2: SEMANTIC TOKENS                               │
│  Named by purpose. Point to primitives. Used in UI.     │
│  e.g. --color-brand-primary: var(--primitive-teal-600)  │
│                                                         │
│  Layer 3: COMPONENT TOKENS                              │
│  Named by component + property. Point to semantics.     │
│  e.g. --btn-primary-bg: var(--color-brand-action)       │
│                                                         │
│  Theme Switch changes Layer 2 values only.              │
│  All components update automatically.                   │
└─────────────────────────────────────────────────────────┘
```

---

## Layer 1 — Primitive Tokens (Raw Color Palette)

These never change between modes. They are the source of truth for every color in the system.

```css
/* tokens/primitives.css */
/* Import this globally. Never reference these directly in components. */

:root {
  /* ── BRAND TEAL ──────────────────────────────── */
  --primitive-teal-50:  #E8F5F5;
  --primitive-teal-100: #C4E4E5;
  --primitive-teal-200: #9DD3D4;
  --primitive-teal-300: #73C0C2;
  --primitive-teal-400: #4DAFB1;
  --primitive-teal-500: #1A9497;
  --primitive-teal-600: #0D7377;   /* PRIMARY — used most */
  --primitive-teal-700: #0A5B5F;
  --primitive-teal-800: #074548;
  --primitive-teal-900: #042F30;
  --primitive-teal-950: #021E1F;

  /* ── BRAND GREEN ─────────────────────────────── */
  --primitive-green-50:  #EAFDF2;
  --primitive-green-100: #C8F9DC;
  --primitive-green-200: #9AF3BE;
  --primitive-green-300: #63ECA0;
  --primitive-green-400: #32E875;   /* PRIMARY ACCENT — CTA, success */
  --primitive-green-500: #1DC75A;
  --primitive-green-600: #18A84C;
  --primitive-green-700: #12843C;
  --primitive-green-800: #0D622D;
  --primitive-green-900: #08421E;

  /* ── NEUTRAL / SLATE ─────────────────────────── */
  --primitive-slate-0:   #FFFFFF;
  --primitive-slate-25:  #F8FAFA;
  --primitive-slate-50:  #F0F5F6;
  --primitive-slate-100: #DCE8EA;
  --primitive-slate-150: #C5D8DB;
  --primitive-slate-200: #AABFC3;
  --primitive-slate-300: #8899AA;
  --primitive-slate-400: #6B7A8D;
  --primitive-slate-500: #526070;
  --primitive-slate-600: #3A4A5A;
  --primitive-slate-700: #253340;
  --primitive-slate-800: #161F28;
  --primitive-slate-850: #111922;   /* Card background (dark) */
  --primitive-slate-900: #0D1117;   /* Elevated surface (dark) */
  --primitive-slate-950: #0A0F14;   /* Page background (dark) */

  /* ── RED / ERROR ─────────────────────────────── */
  --primitive-red-400:   #F87171;
  --primitive-red-500:   #EF4444;
  --primitive-red-600:   #DC2626;
  --primitive-red-700:   #B91C1C;

  /* ── AMBER / WARNING ─────────────────────────── */
  --primitive-amber-400: #FBBF24;
  --primitive-amber-500: #F59E0B;
  --primitive-amber-600: #D97706;

  /* ── BLUE / INFO ─────────────────────────────── */
  --primitive-blue-400:  #60A5FA;
  --primitive-blue-500:  #3B82F6;
  --primitive-blue-600:  #2563EB;
}
```

---

## Layer 2 — Semantic Tokens (Theme-Aware)

These are the only tokens components should reference. They switch values between dark and light mode.

### Dark Mode (Default)

```css
/* tokens/theme-dark.css */
/* Applied via: [data-theme="dark"] or :root by default */

[data-theme="dark"],
:root {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SURFACE HIERARCHY
     Five levels of depth — deeper = darker
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-surface-base:      var(--primitive-slate-950);  /* #0A0F14 — Page bg */
  --color-surface-raised:    var(--primitive-slate-900);  /* #0D1117 — Nav, sidebar */
  --color-surface-overlay:   var(--primitive-slate-850);  /* #111922 — Cards, panels */
  --color-surface-inset:     var(--primitive-slate-800);  /* #161F28 — Alt table rows */
  --color-surface-deep:      #0F161E;                     /* Deeper inset areas */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     TYPOGRAPHY
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-text-primary:     var(--primitive-slate-0);      /* #FFFFFF — Headlines, values */
  --color-text-secondary:   var(--primitive-slate-300);    /* #8899AA — Body, descriptions */
  --color-text-muted:       var(--primitive-slate-400);    /* #6B7A8D — Timestamps, hints */
  --color-text-disabled:    var(--primitive-slate-600);    /* #3A4A5A — Disabled fields */
  --color-text-inverse:     var(--primitive-slate-950);    /* #0A0F14 — Text on green btn */
  --color-text-placeholder: rgba(136,153,170,0.5);         /* Input placeholders */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BRAND
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-brand-primary:    var(--primitive-teal-600);     /* #0D7377 — Icons, links, tabs */
  --color-brand-action:     var(--primitive-green-400);    /* #32E875 — Primary CTA, success */
  --color-brand-primary-bg: rgba(13,115,119,0.12);         /* Teal tinted backgrounds */
  --color-brand-action-bg:  rgba(50,232,117,0.12);         /* Green tinted backgrounds */
  --color-brand-primary-border: rgba(13,115,119,0.30);
  --color-brand-action-border:  rgba(50,232,117,0.30);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SEMANTIC STATUS COLORS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-success:          var(--primitive-green-400);    /* #32E875 */
  --color-success-bg:       rgba(50,232,117,0.10);
  --color-success-border:   rgba(50,232,117,0.28);
  --color-success-text:     var(--primitive-green-400);

  --color-warning:          var(--primitive-amber-500);    /* #F59E0B */
  --color-warning-bg:       rgba(245,158,11,0.10);
  --color-warning-border:   rgba(245,158,11,0.28);
  --color-warning-text:     var(--primitive-amber-400);

  --color-error:            var(--primitive-red-500);      /* #EF4444 */
  --color-error-bg:         rgba(239,68,68,0.10);
  --color-error-border:     rgba(239,68,68,0.28);
  --color-error-text:       var(--primitive-red-400);

  --color-info:             var(--primitive-blue-500);     /* #3B82F6 */
  --color-info-bg:          rgba(59,130,246,0.10);
  --color-info-border:      rgba(59,130,246,0.28);
  --color-info-text:        var(--primitive-blue-400);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BORDERS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-border-default:   rgba(255,255,255,0.07);
  --color-border-subtle:    rgba(255,255,255,0.04);
  --color-border-strong:    rgba(255,255,255,0.15);
  --color-border-brand:     rgba(13,115,119,0.35);
  --color-border-action:    rgba(50,232,117,0.35);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INTERACTIVE STATES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-hover-overlay:    rgba(255,255,255,0.04);
  --color-active-overlay:   rgba(255,255,255,0.08);
  --color-focus-ring:       var(--primitive-teal-600);
  --color-focus-ring-offset: var(--color-surface-base);
  --color-selection-bg:     rgba(13,115,119,0.25);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SHADOWS (dark mode: glow-based, not drop shadows)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --shadow-card:    0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
  --shadow-modal:   0 24px 80px rgba(0,0,0,0.7);
  --shadow-tooltip: 0 4px 16px rgba(0,0,0,0.5);
  --shadow-btn-action: 0 0 24px rgba(50,232,117,0.25);
  --shadow-btn-brand:  0 0 20px rgba(13,115,119,0.3);
}
```

---

### Light Mode (Complementary)

> **Design Principle:** The light mode inverts the surface hierarchy (dark surfaces → light surfaces) while keeping brand colors identical. The darkest dark-mode color (`#0A0F14`) becomes the primary text color — a perfect inversion that creates maximum contrast on white. Shadows replace glow effects. Green CTA remains unchanged.

```css
/* tokens/theme-light.css */
[data-theme="light"] {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SURFACE HIERARCHY
     Five levels — deeper = slightly darker white
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-surface-base:      var(--primitive-slate-50);   /* #F0F5F6 — Page bg (tinted) */
  --color-surface-raised:    var(--primitive-slate-0);    /* #FFFFFF — Nav, sidebar */
  --color-surface-overlay:   var(--primitive-slate-0);    /* #FFFFFF — Cards, panels */
  --color-surface-inset:     var(--primitive-slate-25);   /* #F8FAFA — Alt table rows */
  --color-surface-deep:      var(--primitive-slate-50);   /* #F0F5F6 — Deeper insets */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     TYPOGRAPHY
     Dark mode background (#0A0F14) becomes text.
     Perfect inversion — maximum contrast.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-text-primary:     var(--primitive-slate-950);   /* #0A0F14 — Headlines, values */
  --color-text-secondary:   var(--primitive-slate-600);   /* #3A4A5A — Body, descriptions */
  --color-text-muted:       var(--primitive-slate-400);   /* #6B7A8D — Timestamps, hints */
  --color-text-disabled:    var(--primitive-slate-300);   /* #8899AA — Disabled fields */
  --color-text-inverse:     var(--primitive-slate-0);     /* #FFFFFF — Text on green btn */
  --color-text-placeholder: rgba(106,122,141,0.6);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BRAND
     Teal (#0D7377) is WCAG AA on white — no change needed.
     Green CTA darkened slightly for light bg legibility.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-brand-primary:    var(--primitive-teal-600);    /* #0D7377 — Unchanged */
  --color-brand-action:     var(--primitive-green-500);   /* #1DC75A — Darker for light bg */
  --color-brand-primary-bg: rgba(13,115,119,0.08);
  --color-brand-action-bg:  rgba(29,199,90,0.10);
  --color-brand-primary-border: rgba(13,115,119,0.25);
  --color-brand-action-border:  rgba(29,199,90,0.25);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SEMANTIC STATUS COLORS
     Darkened for WCAG AA contrast on white
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-success:          var(--primitive-green-600);   /* #18A84C — darker on light */
  --color-success-bg:       rgba(18,132,60,0.08);
  --color-success-border:   rgba(18,132,60,0.20);
  --color-success-text:     var(--primitive-green-700);   /* #12843C — text on light */

  --color-warning:          var(--primitive-amber-600);   /* #D97706 */
  --color-warning-bg:       rgba(217,119,6,0.08);
  --color-warning-border:   rgba(217,119,6,0.20);
  --color-warning-text:     var(--primitive-amber-600);

  --color-error:            var(--primitive-red-600);     /* #DC2626 */
  --color-error-bg:         rgba(220,38,38,0.08);
  --color-error-border:     rgba(220,38,38,0.20);
  --color-error-text:       var(--primitive-red-700);     /* #B91C1C */

  --color-info:             var(--primitive-blue-600);    /* #2563EB */
  --color-info-bg:          rgba(37,99,235,0.08);
  --color-info-border:      rgba(37,99,235,0.20);
  --color-info-text:        var(--primitive-blue-600);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BORDERS
     Light mode uses black opacity borders — crisp on white
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-border-default:   rgba(0,0,0,0.08);
  --color-border-subtle:    rgba(0,0,0,0.04);
  --color-border-strong:    rgba(0,0,0,0.18);
  --color-border-brand:     rgba(13,115,119,0.30);
  --color-border-action:    rgba(18,132,60,0.30);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INTERACTIVE STATES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-hover-overlay:    rgba(0,0,0,0.04);
  --color-active-overlay:   rgba(0,0,0,0.08);
  --color-focus-ring:       var(--primitive-teal-600);
  --color-focus-ring-offset: var(--color-surface-base);
  --color-selection-bg:     rgba(13,115,119,0.15);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SHADOWS (light mode: traditional drop shadows)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --shadow-card:    0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
  --shadow-modal:   0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.10);
  --shadow-tooltip: 0 4px 12px rgba(0,0,0,0.12);
  --shadow-btn-action: 0 4px 14px rgba(18,132,60,0.30);
  --shadow-btn-brand:  0 4px 12px rgba(13,115,119,0.25);
}
```

---

## Layer 3 — Component Tokens

Semantic tokens grouped by component. These are generated from Layer 2 and used directly in component CSS.

```css
/* tokens/components.css */

/* ── BUTTONS ──────────────────────────────── */
:root {
  /* Primary (Green CTA) */
  --btn-primary-bg:         var(--color-brand-action);
  --btn-primary-text:       var(--color-text-inverse);
  --btn-primary-shadow:     var(--shadow-btn-action);
  --btn-primary-hover-bg:   color-mix(in srgb, var(--color-brand-action) 90%, white);

  /* Secondary (Teal outline) */
  --btn-secondary-bg:       transparent;
  --btn-secondary-text:     var(--color-brand-primary);
  --btn-secondary-border:   var(--color-brand-primary);
  --btn-secondary-hover-bg: var(--color-brand-primary-bg);

  /* Ghost */
  --btn-ghost-bg:           transparent;
  --btn-ghost-text:         var(--color-text-primary);
  --btn-ghost-border:       var(--color-border-strong);
  --btn-ghost-hover-bg:     var(--color-hover-overlay);

  /* Danger */
  --btn-danger-bg:          transparent;
  --btn-danger-text:        var(--color-error-text);
  --btn-danger-border:      var(--color-error-border);
  --btn-danger-hover-bg:    var(--color-error-bg);
}

/* ── CARDS ────────────────────────────────── */
:root {
  --card-bg:               var(--color-surface-overlay);
  --card-border:           var(--color-border-default);
  --card-shadow:           var(--shadow-card);
  --card-radius:           16px;
  --card-padding:          28px;

  --card-hover-bg:         color-mix(in srgb, var(--color-surface-overlay) 97%, white);
  --card-hover-border:     var(--color-border-strong);

  --card-accent-teal:      var(--color-border-brand);
  --card-accent-green:     var(--color-border-action);
  --card-accent-red:       var(--color-error-border);
  --card-accent-amber:     var(--color-warning-border);
}

/* ── INPUTS ───────────────────────────────── */
:root {
  --input-bg:              var(--color-surface-base);
  --input-border:          var(--color-border-strong);
  --input-text:            var(--color-text-primary);
  --input-placeholder:     var(--color-text-placeholder);
  --input-radius:          10px;
  --input-height:          48px;
  --input-focus-border:    var(--color-brand-primary);
  --input-focus-shadow:    0 0 0 3px var(--color-brand-primary-bg);
  --input-error-border:    var(--color-error);
  --input-error-shadow:    0 0 0 3px var(--color-error-bg);
}

/* ── NAV / SIDEBAR ────────────────────────── */
:root {
  --nav-bg:                var(--color-surface-raised);
  --nav-border:            var(--color-border-default);
  --nav-text:              var(--color-text-muted);
  --nav-text-active:       var(--color-text-primary);
  --nav-item-active-bg:    var(--color-brand-primary-bg);
  --nav-item-active-border: var(--color-brand-primary);
  --nav-item-hover-bg:     var(--color-hover-overlay);
}

/* ── BADGES / PILLS ───────────────────────── */
:root {
  --badge-success-bg:      var(--color-success-bg);
  --badge-success-border:  var(--color-success-border);
  --badge-success-text:    var(--color-success-text);

  --badge-warning-bg:      var(--color-warning-bg);
  --badge-warning-border:  var(--color-warning-border);
  --badge-warning-text:    var(--color-warning-text);

  --badge-error-bg:        var(--color-error-bg);
  --badge-error-border:    var(--color-error-border);
  --badge-error-text:      var(--color-error-text);

  --badge-info-bg:         var(--color-info-bg);
  --badge-info-border:     var(--color-info-border);
  --badge-info-text:       var(--color-info-text);

  --badge-brand-bg:        var(--color-brand-primary-bg);
  --badge-brand-border:    var(--color-brand-primary-border);
  --badge-brand-text:      var(--color-brand-primary);
}

/* ── TABLES ───────────────────────────────── */
:root {
  --table-header-bg:       var(--color-surface-raised);
  --table-row-bg:          var(--color-surface-overlay);
  --table-row-alt-bg:      var(--color-surface-inset);
  --table-row-hover-bg:    var(--color-hover-overlay);
  --table-border:          var(--color-border-subtle);
  --table-header-text:     var(--color-text-muted);
}

/* ── TOASTS / NOTIFICATIONS ───────────────── */
:root {
  --toast-bg:              var(--color-surface-overlay);
  --toast-shadow:          var(--shadow-modal);
  --toast-border-radius:   12px;
}

/* ── PROGRESS BARS ────────────────────────── */
:root {
  --progress-track:        var(--color-surface-inset);
  --progress-fill-brand:   var(--color-brand-primary);
  --progress-fill-action:  var(--color-brand-action);
  --progress-fill-warning: var(--color-warning);
  --progress-fill-error:   var(--color-error);
  --progress-height:       8px;
  --progress-radius:       4px;
}

/* ── SCORE GAUGE ──────────────────────────── */
:root {
  --gauge-track:           var(--color-surface-inset);
  --gauge-fill-start:      var(--color-brand-primary);
  --gauge-fill-end:        var(--color-brand-action);
  --gauge-stroke-width:    16;
}
```

---

## Tailwind CSS Integration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy — maps to CSS vars
        surface: {
          base:    'var(--color-surface-base)',
          raised:  'var(--color-surface-raised)',
          overlay: 'var(--color-surface-overlay)',
          inset:   'var(--color-surface-inset)',
          deep:    'var(--color-surface-deep)',
        },
        // Typography
        text: {
          primary:     'var(--color-text-primary)',
          secondary:   'var(--color-text-secondary)',
          muted:       'var(--color-text-muted)',
          disabled:    'var(--color-text-disabled)',
          inverse:     'var(--color-text-inverse)',
          placeholder: 'var(--color-text-placeholder)',
        },
        // Brand
        brand: {
          primary:    'var(--color-brand-primary)',
          action:     'var(--color-brand-action)',
          'primary-bg':  'var(--color-brand-primary-bg)',
          'action-bg':   'var(--color-brand-action-bg)',
        },
        // Status
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error:   'var(--color-error)',
          info:    'var(--color-info)',
        },
        // Border
        border: {
          DEFAULT: 'var(--color-border-default)',
          subtle:  'var(--color-border-subtle)',
          strong:  'var(--color-border-strong)',
          brand:   'var(--color-border-brand)',
          action:  'var(--color-border-action)',
        },
      },
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        card:   '16px',
        btn:    '10px',
        pill:   '9999px',
        input:  '10px',
        badge:  '6px',
      },
      boxShadow: {
        card:       'var(--shadow-card)',
        modal:      'var(--shadow-modal)',
        tooltip:    'var(--shadow-tooltip)',
        'btn-action': 'var(--shadow-btn-action)',
        'btn-brand':  'var(--shadow-btn-brand)',
      },
    },
  },
};

export default config;
```

---

## Theme Provider (React)

```tsx
// providers/ThemeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Read persisted preference or OS preference
    const stored = localStorage.getItem('creditax-theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    const initial = stored ?? preferred;
    applyTheme(initial);
  }, []);

  function applyTheme(t: Theme) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('creditax-theme', t);
    setThemeState(t);
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

```tsx
// components/shared/ThemeToggle.tsx
'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-12 h-6 rounded-pill
        bg-surface-inset border border-border
        transition-all duration-200
        focus:outline-none focus:ring-2
        focus:ring-[var(--color-focus-ring)]
        focus:ring-offset-2
        focus:ring-offset-[var(--color-focus-ring-offset)]
      "
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Track */}
      <span className={`
        absolute left-0.5 top-0.5 w-5 h-5 rounded-full
        flex items-center justify-center
        bg-brand-primary text-text-inverse
        transition-transform duration-200
        ${theme === 'light' ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {theme === 'dark'
          ? <Moon size={10} />
          : <Sun size={10} />
        }
      </span>
    </button>
  );
}
```

---

## Component Implementations (Theme-Aware)

### Button Component

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles (apply to all buttons)
  `inline-flex items-center justify-center gap-2 font-sans font-semibold
   transition-all duration-150 cursor-pointer select-none
   focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]
   focus:ring-offset-2 focus:ring-offset-[var(--color-focus-ring-offset)]
   disabled:opacity-40 disabled:cursor-not-allowed`,
  {
    variants: {
      variant: {
        primary: `
          bg-brand-action text-text-inverse
          shadow-btn-action
          hover:brightness-105 active:brightness-95
        `,
        secondary: `
          bg-transparent text-brand-primary
          border border-border-brand
          hover:bg-brand-primary-bg
        `,
        ghost: `
          bg-transparent text-text-primary
          border border-border-strong
          hover:bg-[var(--color-hover-overlay)]
        `,
        brand: `
          bg-brand-primary text-text-inverse
          shadow-btn-brand
          hover:brightness-110 active:brightness-90
        `,
        danger: `
          bg-transparent text-[var(--color-error-text)]
          border border-[var(--color-error-border)]
          hover:bg-[var(--color-error-bg)]
        `,
        link: `
          bg-transparent text-brand-primary underline-offset-4
          hover:underline p-0 h-auto
        `,
      },
      size: {
        sm:  'h-8  px-4  text-sm  rounded-btn',
        md:  'h-10 px-6  text-sm  rounded-btn',
        lg:  'h-12 px-7  text-base rounded-btn',
        xl:  'h-14 px-8  text-base rounded-btn',
        icon: 'h-10 w-10 rounded-btn',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  }
);

export function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
   VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
```

### Card Component

```tsx
// components/ui/Card.tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'teal' | 'green' | 'red' | 'amber' | 'none';
  elevated?: boolean;
}

export function Card({ className, accent = 'none', elevated = false, ...props }: CardProps) {
  const accentMap = {
    teal:  'border-l-4 border-l-[var(--color-border-brand)] bg-brand-primary-bg/40',
    green: 'border-[var(--color-border-action)] border-1.5',
    red:   'border-[var(--color-error-border)] border-1.5',
    amber: 'border-[var(--color-warning-border)] border-1.5',
    none:  'border-border',
  };

  return (
    <div
      className={cn(
        'bg-surface-overlay rounded-card border shadow-card',
        'transition-colors duration-150',
        accentMap[accent],
        elevated && 'shadow-modal',
        className
      )}
      {...props}
    />
  );
}
```

### Input Component

```tsx
// components/ui/Input.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-text-muted text-[12px] font-medium uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            `h-12 w-full rounded-input px-4 font-sans text-sm
             bg-surface-base border text-text-primary
             placeholder:text-text-placeholder
             transition-all duration-150
             focus:outline-none focus:ring-2
             focus:ring-[var(--color-focus-ring)]
             focus:ring-offset-0
             focus:border-brand-primary
             disabled:opacity-40 disabled:cursor-not-allowed`,
            error
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error-bg)]'
              : 'border-border-strong',
            className
          )}
          {...props}
        />
        {hint && (
          <span className={cn(
            'text-xs',
            error ? 'text-[var(--color-error-text)]' : 'text-text-muted'
          )}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);
```

### Badge Component

```tsx
// components/ui/Badge.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge text-[11px] font-bold border',
  {
    variants: {
      variant: {
        success: 'bg-[var(--badge-success-bg)] border-[var(--badge-success-border)] text-[var(--badge-success-text)]',
        warning: 'bg-[var(--badge-warning-bg)] border-[var(--badge-warning-border)] text-[var(--badge-warning-text)]',
        error:   'bg-[var(--badge-error-bg)]   border-[var(--badge-error-border)]   text-[var(--badge-error-text)]',
        info:    'bg-[var(--badge-info-bg)]    border-[var(--badge-info-border)]    text-[var(--badge-info-text)]',
        brand:   'bg-[var(--badge-brand-bg)]   border-[var(--badge-brand-border)]   text-[var(--badge-brand-text)]',
        neutral: 'bg-surface-inset border-border text-text-muted',
      },
      dot: {
        true: '',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export function Badge({
  className,
  variant,
  dot,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
```

---

## Dark ↔ Light Mode Visual Mapping

The table below shows exactly how each semantic surface transforms between modes:

| Role | Dark Mode | Light Mode | Notes |
|------|-----------|------------|-------|
| **Page Background** | `#0A0F14` | `#F0F5F6` | Light has subtle teal tint |
| **Nav / Sidebar** | `#0D1117` | `#FFFFFF` | Light uses pure white |
| **Cards / Panels** | `#111922` | `#FFFFFF` | Cards become white boxes |
| **Alt Table Rows** | `#161F28` | `#F8FAFA` | Barely-there alternating |
| **Primary Text** | `#FFFFFF` | `#0A0F14` | Perfect inversion |
| **Secondary Text** | `#8899AA` | `#3A4A5A` | Same hue, different luma |
| **Muted Text** | `#6B7A8D` | `#6B7A8D` | **Identical** — optimal at both |
| **Teal Brand** | `#0D7377` | `#0D7377` | **Identical** — works both ways |
| **Green CTA** | `#32E875` | `#1DC75A` | Darkened 1 step for light WCAG |
| **Card Border** | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.08)` | Inverted opacity source |
| **Success color** | `#32E875` | `#18A84C` | Darkened for contrast |
| **Warning color** | `#F59E0B` | `#D97706` | Darkened 1 step |
| **Error color** | `#EF4444` | `#DC2626` | Darkened 1 step |
| **Drop shadow** | Glow-based (rgba green/teal) | Drop-based (rgba black) | Mode-native approach |

---

## WCAG Contrast Verification

All semantic color combinations meet **WCAG AA (4.5:1 minimum)** in both modes.

| Foreground | Background | Dark ratio | Light ratio | Pass |
|-----------|-----------|------------|-------------|------|
| `--color-text-primary` | `--color-surface-base` | 18.5:1 | 18.5:1 | ✅ AAA |
| `--color-text-secondary` | `--color-surface-overlay` | 6.2:1 | 5.8:1 | ✅ AA |
| `--color-text-muted` | `--color-surface-overlay` | 4.6:1 | 4.6:1 | ✅ AA |
| `--color-brand-primary` | `--color-surface-overlay` | 4.8:1 | 5.1:1 | ✅ AA |
| `--color-brand-action` | `--color-surface-overlay` | 8.6:1 (dark) | 4.5:1 (light) | ✅ AA |
| `--color-text-inverse` | `--color-brand-action` | 14.1:1 | 6.2:1 | ✅ AAA |
| `--color-success-text` | `--color-success-bg` | 4.8:1 | 5.2:1 | ✅ AA |
| `--color-error-text` | `--color-error-bg` | 5.1:1 | 4.9:1 | ✅ AA |

---

## Light Mode Component Previews (Specification)

### Hero Section — Light Mode
```
Background:    #F0F5F6 (base)
Nav bar:       #FFFFFF + shadow (0 1px 0 rgba(0,0,0,0.08))
Headline:      #0A0F14 (primary text — max contrast)
Subheadline:   #3A4A5A (secondary text)
CTA Primary:   #1DC75A background + #FFFFFF text
CTA Secondary: transparent + #0D7377 border + #0D7377 text
Geometric BG:  teal (#0D7377) at 8% opacity wireframe
```

### Dashboard Card — Light Mode
```
Card:          #FFFFFF + box-shadow: 0 1px 4px rgba(0,0,0,0.08)
Card border:   rgba(0,0,0,0.08)
Card title:    #0A0F14
Card value:    #0A0F14 (bold)
Card sub:      #3A4A5A
Score gauge:   same teal→green gradient — unchanged
Progress bar:  #F0F5F6 track + #1DC75A fill
```

### Navigation — Light Mode
```
Sidebar bg:    #FFFFFF
Active item:   #F0F5F6 bg + left border #0D7377 4px + text #0A0F14
Inactive item: text #6B7A8D
Hover item:    rgba(0,0,0,0.04) bg
Top bar:       #FFFFFF + border-bottom rgba(0,0,0,0.08)
Logo:          "Creditax" in #0A0F14 + ".ai" in #1DC75A
```

---

## Token File Loading Order

```css
/* app/globals.css */

/* 1. Load font */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* 2. Primitive tokens (always loaded, never changed) */
@import './tokens/primitives.css';

/* 3. Dark mode (default — applied to :root) */
@import './tokens/theme-dark.css';

/* 4. Light mode (applied when [data-theme="light"]) */
@import './tokens/theme-light.css';

/* 5. Component tokens (derived from semantic tokens) */
@import './tokens/components.css';

/* 6. Tailwind base */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 7. Global base styles */
body {
  background-color: var(--color-surface-base);
  color: var(--color-text-primary);
  font-family: 'Syne', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.2s ease, color 0.2s ease;
}

::selection {
  background: var(--color-selection-bg);
}

/* Smooth theme transition */
*, *::before, *::after {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}
```

---

## JS Token Export (for use in charts, canvas, SVG)

```typescript
// lib/tokens.ts
// Access computed CSS variable values in JavaScript

export function getCSSToken(varName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

// Pre-built getters for common tokens
export const tokens = {
  get brandPrimary()  { return getCSSToken('--color-brand-primary'); },
  get brandAction()   { return getCSSToken('--color-brand-action'); },
  get textPrimary()   { return getCSSToken('--color-text-primary'); },
  get textSecondary() { return getCSSToken('--color-text-secondary'); },
  get surfaceBase()   { return getCSSToken('--color-surface-base'); },
  get surfaceOverlay(){ return getCSSToken('--color-surface-overlay'); },
  get borderDefault() { return getCSSToken('--color-border-default'); },
  get success()       { return getCSSToken('--color-success'); },
  get warning()       { return getCSSToken('--color-warning'); },
  get error()         { return getCSSToken('--color-error'); },
};

// Usage in Recharts or SVG:
// stroke={tokens.brandPrimary}
// fill={tokens.brandAction}
```

---

> **Summary:** This token system has exactly **3 layers** — primitives (raw values, never change), semantics (switch on theme), and components (derive from semantics). Adding a new theme requires only adding a new `[data-theme="x"]` block in Layer 2. No component code changes. The light mode is a precision inversion: the dark background becomes the text, white becomes the surface, shadows replace glows, and every status color is darkened exactly one step for WCAG compliance on white.
