# Creditax.ai — Pricing & Access Tiers (Set in Stone)

**Version:** 1.0
**Date:** September 21, 2026
**Status:** FOUNDATIONAL — changes require explicit founder approval and a changelog entry.
**Currency rule (locked):** All customer-facing pricing is in **Naira (₦)**. No dollar
pricing anywhere on the site, in docs, or in pitch materials.

---

## 1. Design Principles

1. **Free is a taste, not a meal.** The free tier must deliver one genuine "aha"
   (an answered question, a calculated liability, a starter score) and then require a
   plan after a few actions. Generous free tiers kill conversion.
2. **Paywalls trigger on value, not on curiosity.** Browsing, signup, and the first
   success are free. Repeat usage, verification, and professional tooling are paid.
3. **BVN is never free at steady state.** Every BVN check costs us per call via Mono.
   New accounts get a **one-time teaser: 2 free BVN verifications usable within the
   first 60 days**, then BVN is paid-only (included quota on paid tiers, or pay-per-use).
4. **Quotas are enforced in code, not just written on the pricing page** (§5).

---

## 2. Tiers (Locked)

| | **Free** ₦0 | **Plus** ₦5,000/mo (₦4,000 annual) | **Professional (“Pro”)** ₦25,000/mo (₦20,000 annual) | **Enterprise** Custom |
|---|---|---|---|---|
| Who | Consumers trying us out | Active consumers, freelancers, SMEs | Tax pros & firms | Lenders, fintechs, institutions |
| Agent chat | 5 msgs/day, **60 lifetime cap** | 100 msgs/day | Unlimited fair-use | Pooled / contracted |
| Tax calculations (PAYE/VAT/WHT) | 5/day | 50/day | Unlimited fair-use | Contracted volume |
| Document uploads | 2/day, 10/month cap | 20/day | 100/day + client docs | Contracted |
| Report-chart generations | 2/day | 10/day | Unlimited fair-use | Contracted |
| Credit score | 1 starter snapshot, preview locked after | Full score + daily refresh + simulator | Full + client scores | Portfolio scoring |
| BVN verifications | **0** (+ 2-teaser / 60 days) | 5/mo included | 20/mo included | Contracted |
| Extra BVN lookups | ₦350 each | ₦350 each | ₦300 each | Contracted rate |
| Marketplace contact reveal | Masked until login | Full | Full + priority placement | — |
| Team seats / invites | — (single user) | — (single user) | 3 seats included | SSO + custom |
| Shared canvas links | — | — | ✓ (view/comment) | ✓ |
| Connected apps (Claude, Drive, 2nd brain) | 2 | 10 | Unlimited | Unlimited |
| Pro practice tools (clients, bulk calc, white-label) | — | — | ✓ | ✓ |
| API access | 100 sandbox calls/mo | 5,000 calls/mo | 50,000 calls/mo | Custom + SLA |
| Support | Community | Email (48h) | Priority (24h) | Dedicated + SLA |

**Open item (WIP):** a third-party **bank-as-a-service style offering** (embedded tax/
verification rails for other platforms) is under consideration. It will slot in as an
Enterprise add-on; do not promise it in pitches until scoped.

---

## 3. Unit Costs & CAC per Tier (Locked Method, Revalidate Monthly)

Blended unit costs (September 2026 research: Mono ₦45/BVN lookup, ₦80 NIN, ₦60–500 CAC;
Dojah ~₦90/check; Smile ID ~₦150–750; Prembly ₦100/NIN; grounded AI answer ~₦5 in
tokens). Re-check against real provider bills every month; if any unit moves >20%,
re-cut quotas before changing prices.

| Action | Unit cost | Basis |
|--------|-----------|-------|
| Agent message (grounded) | ₦5 | ~2–4k tokens, budget models + 1 embedding + vector search |
| Tax calculation | ₦3 | Rules engine + logging; cached repeats free for 24h |
| Document upload + extraction | ₦15 | Parse + chunk + embed + extract |
| Report-chart generation | ₦8 | LLM render + data assembly |
| Credit score refresh | ₦5 | Compute only (bank pulls: paid tiers only) |
| BVN verification | ₦90 | Mono lookup + OTP steps + failure buffer (failures billed) |
| TIN / CAC-status lookup | ₦150 | Mono blended range |

### CAC / servicing cost per user

| Tier | Typical user / month | Heavy (p90) user / month | Max exposure | Verdict |
|------|----------------------|--------------------------|--------------|---------|
| **Free** (acquisition) | ~₦370 (20 chats, 10 calcs, 4 uploads, teaser share) | ~₦900 | **~₦1,500** (60-chat lifetime cap + daily caps bind) | Inside the **₦2,000 CAC envelope** ✓ |
| **Plus** ₦5,000 | ~₦2,250 (200 msgs, 60 calcs, 30 uploads, 5 BVN, charts, refreshes) | ~₦4,000 | Daily caps + fair-use backstop | ~55% margin typical, ~20% heavy |
| **Professional** ₦25,000 | ~₦6,700 (400 msgs, 300 bulk calcs, 100 uploads, 20 BVN, reports) | ~₦12,000 | Fair-use + per-client sanity checks | ~73% margin typical, ~50% heavy |
| **Enterprise** | Cost-plus contracted | Floor margin contractual | Contract caps | Never below 60% margin |

**Payback read:** at a ₦400 average free-user cost, one Plus conversion (₦5,000 ×
~55% ≈ ₦2,750 contribution) pays for ~7 acquired free users. Target: ≥1 Plus conversion
per 10 active free users within 90 days. BVN pay-per-use (₦350 vs ₦90 cost) is the
highest-margin line — push it at every identity-gated moment.

**Guardrails (locked):** validate 11-digit BVN format before calling Mono; charge
credits only on provider success; throttle retries; fair-use clause on all
“unlimited” quotas with abuse monitoring and admin override (audit-logged).

## 4. Internal Credit Accounting (How Quotas Are Counted)

| Action | Credits | Notes |
|--------|---------|-------|
| Agent message (grounded answer) | 1 | Counts on assistant reply, not on send |
| Tax calculation | 2 | Cached identical inputs for 24h don't re-charge |
| Document upload + extraction | 3 | Failed extractions refund |
| Report-chart generation | 2 | |
| Credit score refresh | 2 | |
| BVN verification | 25 | Always charged on provider call; teaser covers first 2 |
| TIN/CAC-status lookup | 5 | |
| API call (partner) | 1 per call | Webhooks retries don't re-charge |

Daily quotas reset at 00:00 WAT. Monthly quotas reset on billing anniversary.
Lifetime free cap (60 chat credits) is shown as a progress bar to nudge conversion.

---

## 5. Conversion Mechanics (Free → Paid)

1. **First-session win (free):** signup → ask 1 question → upload 1 document → starter
   score. All achievable inside free limits.
2. **Second-session wall:** the 6th chat message or calculation, or 3rd upload in a
   day hits an upgrade card naming the exact limit ("You've used today's 5 free chats —
   Plus gives you 100/day for ₦5,000/mo").
3. **BVN as the paid hook:** identity verification and TCC-adjacent flows require BVN;
   the 60-day teaser creates the habit, pay-per-use (₦350) captures one-off demand.
4. **Annual discount:** 20% off (₦4,000 / ₦20,000) to pull cash forward.

---

## 6. Enforcement (Must Be Built, Not Documented-Only)

- Quota middleware on every metered endpoint + server-side (never trust the client).
- Per-user daily/monthly/lifetime counters in the database (PocketBase demo: `quotas`
  collection; main architecture: Supabase table — see `mvp-demo-plan.md`).
- Hard stop with upgrade CTA at cap; no silent overages except contracted Enterprise.
- Usage page (`/dashboard/usage`) shows real counters per tier.
- Admin can grant/override quota; every override is audit-logged.

---

## Changelog

### v1.2 (September 21, 2026)
- Collaboration quotas locked: paid-only invites (3 Pro seats, SSO Enterprise) and canvas sharing; connectors on all tiers (2/10/unlimited).

### v1.1 (September 21, 2026)
- Competitor research baked in (Mono ₦45, Dojah ~₦90, Smile ID ~₦150–750, Prembly ₦100, YouVerify custom): new §3 unit costs + CAC-per-tier table with ₦2,000 free envelope, payback target, BVN guardrails; free quotas raised (5 calcs/day, 60 lifetime chats); Professional labelled “Pro”.

### v1.0 (September 21, 2026)
- Initial pricing foundation: Naira-only rule, 4 tiers with tight conversion-driven free limits, BVN zero-free + 60-day 2-teaser, credit accounting table, conversion mechanics, enforcement rules. BaaS offering noted as open WIP.
