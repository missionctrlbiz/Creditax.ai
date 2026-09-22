# Creditax.ai — Legal & Compliance Foundation (Set in Stone)

**Version:** 1.0
**Date:** September 21, 2026
**Status:** FOUNDATIONAL — changes require explicit founder approval and a changelog entry.
> **Not legal advice.** This document records our compliance posture and obligations
> register. A licensed Nigerian technology lawyer must review it before launch and
> before any enterprise contract is signed.

---

## 1. Company Registration (CAC) — First Gate

1. Register the operating company with the **Corporate Affairs Commission** (Ltd)
   before collecting any payment or signing any client/investor document.
2. The CAC certificate is also an input to our own marketplace trust story and to
   partner due-diligence (banks will ask).
3. Open a corporate bank account + Tax Identification Number (TIN) for the company
   itself — practice what the platform preaches.

## 2. Data Protection: NDPA & NDPC (The Main Production Gate)

Nigeria's **Data Protection Act 2023 (NDPA)** and the **Nigeria Data Protection
Commission (NDPC)** govern everything we hold (BVN verdicts, NIN data, bank tokens,
filings, chat logs).

1. **Register with the NDPC** as a Data Controller/Processor. Given BVN/NIN/bank-data
   processing at scale, assume we qualify as being of **major importance** and register
   accordingly — do not wait to be told.
2. **DPIA before production.** A Data Protection Impact Assessment is required for
   high-risk processing. Ours qualifies (sensitive identity data + financial data +
   automated scoring). Complete the DPIA **before** the main-architecture launch; a
   lighter DPIA-lite review before the MVP demo (which uses seeded/mock data only).
3. **Appoint a Data Protection Officer** (can be outsourced/part-time at our stage,
   must exist on paper with a published contact).
4. **Consent architecture:** granular consent at signup (account), per BVN check
   (consent-based iGree flow — never batch-verify), per bank-link (Mono consent).
   Consent receipts logged and revocable from settings.
5. **Privacy notice + data-subject rights:** plain-language notice (also translated —
   see §5); export/delete self-serve in settings; 72-hour breach notification
   workflow (already in `security-foundation.md`).
6. **Cross-border transfers:** LLM/embedding calls that leave Nigeria need a lawful
   basis + safeguards (provider DPAs, redaction before send — already a locked rule).

**Far-reaching implication, stated plainly:** production launch is *legally gated* on
items 1–4. The demo (mocked data, no real PII) can proceed while registration and the
DPIA run in parallel — but no real user BVN, bank link, or filing may go live before
they complete.

## 3. The FIRS Line — Reframed (No Legal Grey Area)

Old phrasing ("no public FIRS API exists") is retired as a strategy statement because
it reads as if we work around the government. Locked posture:

1. **We do not scrape, impersonate, or unofficially integrate any government system.**
   There is no FIRS integration API, so we build none — all tax content derives from
   **publicly published** law, guides, and circulars, cited per answer.
2. **Licensed-pro review:** every knowledge-base article ships only after Content
   Editor + licensed tax practitioner review (see `roles-and-experience.md`).
3. **Advice disclaimer:** the agent gives *general tax information*, never client-specific
   professional representation. High-stakes matters (audit, objection, appeal) trigger
   mandatory referral to a verified human pro.
4. **Government-investor angle:** for public-sector conversations, position us as a
   *compliance-education and onboarding rail* that increases voluntary filing — an ally
   of revenue collection, never a shadow filing channel.

## 4. The CBN Boundary (Credit) — The Other Bright Line

1. **We are not a licensed credit bureau and must never hold ourselves out as one.**
   Our output is an *indicative Credit Health Score for education and self-improvement*,
   labelled as such on every screen and report.
2. **Official bureau data** (CRC, FirstCentral) comes only via partnership and is
   presented as *their* report, never ours.
3. **We do not lend** from our own balance sheet (already out of scope). Any future
   lending-adjacent feature requires fresh CBN-regime legal review first.

## 5. Language Obligation

- The privacy notice, consent screens, and advice disclaimer must exist in **English,
  Yoruba, Hausa, and Igbo** before production (machine translation is a draft step
  only — a human Editor signs off each, same as KB articles).

## 6. People & Employment

- Written contracts for everyone touching the product: confidentiality, IP assignment
  to the company, and data-handling duties.
- Background checks for Support and any role with user-data read access.
- Quarterly privacy/security briefing for all staff; logged.

## 7. Compliance Roadmap (Locked Order)

| When | Item |
|------|------|
| Now | CAC registration starts; lawyer engaged |
| During demo build | DPIA-lite (mock-data only) + draft privacy notice (EN) |
| Before production | NDPC registration, full DPIA, DPO appointed, 4-language notices, bureau partnership terms, pro-review workflow live |
| Before bank/enterprise deals | Pen test, residency answers, SLA + DPA templates |

---

## Changelog

### v1.0 (September 21, 2026)
- Initial legal foundation: CAC first-gate, NDPA/NDPC registration + DPIA gating (demo may proceed on mocks), FIRS posture reframe, CBN bureau boundary, 4-language notice rule, employment duties, ordered roadmap. Not legal advice — lawyer review required.
