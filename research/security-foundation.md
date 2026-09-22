# Creditax.ai — Security Foundation (Set in Stone)

**Version:** 1.0
**Date:** September 21, 2026
**Status:** FOUNDATIONAL — changes require explicit founder approval and a changelog entry.
**Scope:** The full product — web app, APIs, background jobs, admin, marketplace, mobile web.

---

## 1. What We Protect (Data Classification)

| Level | Examples | Rule |
|-------|----------|------|
| **Restricted** | BVN, NIN, TIN, bank logins/tokens, passwords, API secrets | Never stored raw unless unavoidable; encrypted; minimal access; full audit |
| **Confidential** | Bank statements, payslips, invoices, tax filings, credit factors, client lists | Encrypted at rest + in transit; owner + explicitly granted roles only |
| **Internal** | Support tickets, pro verification docs under review, usage counters | Staff roles only |
| **Public** | Blog, docs, verified pro business profiles (name, services — not phone/email) | Freely servable; still rate-limited |

**Locked rules:**
1. **Raw BVN/NIN are never persisted.** Verification calls Mono, we store only the
   verdict (`match`/`no-match`), provider reference, timestamp, and last-3-digits
   hint for user recognition. The number itself lives in request memory only.
2. **Bank credentials are never seen by us.** Mono read-only tokens only; tokens are
   encrypted and revocable from `/dashboard/keys`.
3. **Marketplace contact details (phone/email/WhatsApp) render only to logged-in
   users**, and are excluded from public HTML/JSON for crawlers (anti-scrape rule).
4. **PII is redacted before embedding.** Names, numbers, and account identifiers are
   stripped before any text reaches Vertex AI / embeddings or LLM logs.

---

## 2. Threat Model (Who We're Defending Against)

| Threat | Example | Primary controls |
|--------|---------|------------------|
| Account takeover | Credential stuffing, magic-link interception | Magic-link expiry (15 min), single-use tokens, rate-limited auth, lockout, Google OAuth option |
| Data theft / IDOR | Guessing document/report IDs | Unpredictable IDs, ownership checks on every read, RLS/rules per collection |
| Scrapers & crawlers | Harvesting pro contacts, pricing, user content | robots.txt + meta noindex on app routes, auth-gated contacts, rate limits, WAF/bot rules, no PII in SSR payloads |
| Malicious bots | Spam signups, quota draining, fake pro applications | Turnstile/CAPTCHA on signup + apply forms, email verification, application review queue |
| AI-specific abuse | Prompt injection to leak KB/system prompts, jailbreaks for disallowed advice | System-prompt separation, output citation enforcement, refusal paths for legal-representation requests, query logging |
| Payment fraud | Stolen cards on Plus/Pro signup | Paystack/Flutterwave 3DS, webhook signature verification, no card data on our servers |
| Insider misuse | Staff viewing user docs | Role least-privilege (§3), audit log on every admin read of user data |
| Ransomware/loss | DB/file loss | Daily encrypted backups, tested restore, versioned storage |

---

## 3. Controls by Layer

**Auth & sessions:** Supabase Auth (main) / PocketBase auth (demo) — magic link +
Google; sessions httpOnly secure cookies; 15-minute magic-link TTL; admin actions
re-require recent authentication for destructive operations.

**Transport & storage:** TLS everywhere (HSTS); AES-256 at rest (providers' defaults +
encrypted secrets in env/Vault); separate keys per environment; secrets never in git
(enforced by pre-commit secret scan).

**Access control:** role matrix in `roles-and-experience.md` enforced server-side;
every admin view of another user's data writes an audit-log entry (who, what, when).

**Abuse & bots:** global rate limits (auth 5/min/IP, chat per quota, public API
per-key limits); Turnstile on signup/login/apply; WAF rules for known scraper
signatures; marketplace contact masking (§1.3).

**AI safety:** RAG answers must include citations or carry a low-confidence flag;
confidence < threshold triggers pro-referral instead of a definitive answer; all
prompts/responses logged without PII for review.

**Compliance:** NDPR-aligned — lawful basis (consent at signup), data-subject rights
(export/delete in settings), breach response plan (assess → contain → notify NDPC +
affected users within 72h), FIRS content reviewed by licensed pros before publishing
KB articles.

---

## 4. Enterprise Answers (For Pitches)

- Data residency: Nigeria-region hosting available on Enterprise.
- SSO/SAML and audit exports: Enterprise tier.
- Annual access review + penetration test before any bank partnership goes live.
- Incident contact and SLA defined in Enterprise contracts, mirrored on `/status`.

---

## Changelog

### v1.0 (September 21, 2026)
- Initial security foundation: data classification with 4 locked PII rules (no raw BVN storage, Mono read-only, gated marketplace contacts, pre-embedding redaction), threat model incl. crawlers/bot/AI abuse, layered controls, NDPR/breach rules, enterprise answers.
