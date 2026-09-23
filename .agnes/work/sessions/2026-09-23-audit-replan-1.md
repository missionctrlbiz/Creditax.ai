# Audit + replan (P7–P12) — 2026-09-23

## What was done
- Full static audit of src/: stub handlers, globals.css health, i18n parity, no-fetch pages, CSS var gaps, button-coverage.
- Replaced lumped p7/p8 with SIX complete-flow phases; committed as e0a4921; keep-alive re-armed to 21:30.

## Key defects found (evidence)
1. **Auth split-brain**: layouts/guards read localStorage mock-auth; real pb-auth (loginAs + role-gate) exists but is consumed only by role-gate itself. Tier has no UI resolution path.
2. **Canvas not wired to the money layer**: /dashboard/chat POSTs {question, locale} only — no userId/tier → server-side quota metering (P4) never fires from UI; referral hardcoded tier:'free'; LIBRARY static array; skill/connector context not shown.
3. **32 no-fetch pages**: all pro/* (7), admin dashboard/professionals/audit/settings, dashboard documents/reports/tax-filing/credit-detail, /status (0 fetches — demo scope 10 broken), pricing/devs static.
4. admin/users EditUserModal onSave = console.log('Saved:') stub.
5. i18n: en missing dashboard.tagline (yo/ha/ig have it). globals.css: no .container, no @keyframes fallback; font-inter/syne/jetbrains-mono vars referenced-but-undefined.
6. login/signup → window.location to ROLE_HOME (works but bypasses router; fine for demo, note for P7).

## Flow order
p7-auth-real → p8-canvas-heart → p9-pro-portal → p10-admin-author → p11-b2b-dev-status → p12-demo-polish
Each = one complete user journey, review-gated, tsc 0 + lint 0.
