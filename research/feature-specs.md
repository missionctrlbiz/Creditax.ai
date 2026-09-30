# Creditax.ai — Feature Specs: Skills & Staged Bets (Set in Stone)

**Version:** 1.0
**Date:** September 21, 2026
**Status:** FOUNDATIONAL — changes require explicit founder approval and a changelog entry.
**Concept:** A **Skill** is a guided mini-workflow inside the agent — surfaced as a chat
chip above the textarea (or auto-suggested by the RAG layer when intent matches). Each
Skill has a fixed input → output contract, a credit cost, and a tier gate. Skills are
how the platform grows without growing UI complexity.

**Chip convention:** short label + icon, e.g. `🧾 Recover my WHT`. Tapping a chip opens
the Skill with its first question pre-loaded. The RAG engine may also inject the chip
mid-conversation when it detects matching intent.

---

## A. MVP + PRODUCT Skills (build now, demo on camera)

### Skill 01 — 🧾 WHT Credit Recovery (idea #6)
- **Problem:** Clients deduct WHT from vendors who never claim the credit notes.
- **Flow:** User uploads contracts + payment advices → Skill matches deductions to
  missing credit notes → outputs a dated claim schedule + "send to my pro" action.
- **Output:** claim schedule card (period, client, amount, status) pinned to canvas.
- **Money:** 5% success fee on recovered credits via pro filing, or flagship Pro-tier
  feature. Highest-revenue-first bet.
- **Cost:** 5 credits per scan (upload extraction + matching pass).
- **Demo beat:** seeded vendor with ₦480,000 unclaimed → schedule appears → referral.

### Skill 02 — 📜 TCC Readiness Pack (idea #1)
- **Problem:** Tax Clearance Certificates unlock contracts, visas, and loans, but
  assembling one is a paper chase.
- **Flow:** "What do you need the TCC for?" → live readiness tracker → missing-document
  checklist → one-click assembled bundle + deadline countdown.
- **Output:** readiness % card + downloadable bundle index.
- **Money:** ₦2,500 pay-per-pack or Plus feature; renews yearly (recurring by nature).
- **Cost:** 3 credits per readiness assessment; bundle assembly 5.

### Skill 03 — 👥 Ajo / Cooperative Ledger (idea #4)
- **Problem:** Esusu/ajo income is invisible to lenders.
- **Flow:** Create group → log contributions/payouts weekly → member view shows
  personal verifiable-income record → feeds the member's credit score factors.
- **Output:** group ledger card + per-member income certificate.
- **Money:** ₦100–200/member/month billed to the cooperative. Moat-feeder: manufactures
  the proprietary compliance-credit dataset.
- **Cost:** 2 credits per ledger entry batch; certificate 3.

### Skill 04 — 🏢 Employer Compliance Badge (idea #9)
- **Problem:** SMEs can't prove PAYE compliance to staff, regulators, or hires.
- **Flow:** Connect payroll / upload schedule → monthly audit pass → badge + report.
- **Output:** dated "PAYE-Compliant" badge card + regulator-ready report (white-label).
- **Money:** ₦200–500/employee/month. Turns a cost center into a recruiting asset.
- **Cost:** 10 credits per monthly audit run.

---

## B. More Skills (same chip rail — ship in waves)

### Skill 05 — 🏠 Rent WHT Autopilot (idea #2)
Track tenancies → auto-compute 10% WHT per rent payment → reminders + receipts for
landlord and tenant. **Money:** per-unit annual fee to property managers. **Cost:** 2/schedule.

### Skill 06 — 💼 Salary-Structure Optimizer (idea #3)
"How is your salary split?" → models gross vs. allowance mixes within legal reliefs →
shows lawful PAYE saving + compliant payslip template. **Money:** ₦1,500/report or
employer seats. **Cost:** 4/optimization.

### Skill 07 — 📩 Notice Translator (idea #5)
Forward any FIRS/state-IRS SMS, email, or notice photo → plain-language (or local
language) explanation + escalating deadline countdown. **Money:** 1 free/month, Plus
for unlimited. **Cost:** 2/notice.

### Skill 08 — 🧮 Invoice WHT Checker (new)
Paste any vendor invoice amount + type → instant "deduct ₦X, remit by [date], code [Y]"
verdict before you pay. Prevents the unclaimed-credit problem at source (pairs with
Skill 01). **Money:** Plus feature; free 3/day teaser. **Cost:** 2/check (calc credit).

### Skill 09 — 🏪 BN or Ltd? Quiz (new)
"Should I register a Business Name or Limited company?" → 5-question guided quiz
(cost, liability, CIT vs. personal tax, contracts ambition) → recommendation + CAC
fee estimate + next-step checklist. **Money:** free (acquisition magnet), pro referral
on "I want to register" intent. **Cost:** 2/quiz.

### Skill 10 — 💷 Payslip Decoder (new)
Upload any payslip → every line explained (gross, reliefs, PAYE band applied, pension,
NHIS) + error flags ("your relief looks under-claimed"). **Money:** free 2/month,
Plus unlimited. Natural upsell into Skill 06. **Cost:** 3/decode.

---

## C. FUTURE Features (detail in the investor paper / future spec — not MVP)

1. **Filing Rooms (#7)** — seasonal live cohort filing (virtual + via pro partners),
   per-seat revenue split with hosts. Needs marketplace supply first.
2. **Diaspora Tax Desk (#8)** — USD-priced concierge tier ($29/mo) for Nigerians abroad
   with Nigerian income. Needs disclaimers + double-taxation KB depth first.
3. **Score-Gated Offers (#10)** — lenders/merchants post pre-approved offers to
   above-threshold users; affiliate fee per funded offer. Needs score credibility +
   partner pipeline first.

Each ships only after its stated prerequisite is true. Full specs (unit economics,
screens, partner terms) belong in the academic-style paper, not here.

---

## Changelog

### v1.0 (September 21, 2026)
- Initial spec: Skills concept + chips convention; MVP Skills 01–04 (WHT recovery, TCC pack, ajo ledger, employer badge); wave-two Skills 05–10 (rent WHT, salary optimizer, notice translator + 3 new: invoice checker, BN-vs-Ltd quiz, payslip decoder); future bets 7/8/10 deferred to paper.
