# Creditax.ai — Roles, Auth & Post-Login Experience (Set in Stone)

**Version:** 1.0
**Date:** September 21, 2026
**Status:** FOUNDATIONAL — changes require explicit founder approval and a changelog entry.

---

## 1. Roles (Locked — 8 Total)

| # | Role | How granted | Home |
|---|------|-------------|------|
| 1 | **Consumer** (personal) | Default at signup | `/dashboard` |
| 2 | **Tax Pro Owner** | Applies via `/pro/apply` → Mono/CAC check → admin approval | `/pro/dashboard` |
| 3 | **Pro Staff** (junior) | Invited by an Owner; scoped to assigned clients | `/pro/dashboard` (scoped) |
| 4 | **Partner / Developer** | Self-serve key creation (sandbox free; production needs Plus+) | `/developers` + `/dashboard/keys` |
| 5 | **Content Author** | Admin grant; writes blog posts (draft only) | `/admin` (blog scope) |
| 6 | **Content Editor** | Admin grant; reviews, edits, publishes posts + KB articles | `/admin` (publish scope) |
| 7 | **Support** | Admin grant; read-only user/pro views + ticket replies | `/admin` (read-only) |
| 8 | **Super Admin** | Founder grant only; everything incl. roles, quotas, settings | `/admin/dashboard` |

### Permission matrix (summary)

| Capability | Consumer | Pro Owner | Pro Staff | Partner | Author | Editor | Support | Admin |
|---|---|---|---|---|---|---|---|---|
| Own workspace (chat, docs, score) | ✓ | ✓ | — | ✓ | ✓ | ✓ | — | ✓ |
| Manage clients / bulk calc / verify | — | ✓ | scoped | — | — | — | view | ✓ |
| White-label reports | — | ✓ (Pro tier) | — | — | — | — | — | ✓ |
| Invite members / share canvas | — | ✓ (own ws) | — | — | — | — | — | ✓ |
| External AI connectors | 2 | 10 | 2 | 10 | 2 | 2 | — | unlim. |
| API keys + usage | sandbox | ✓ | — | ✓ | — | — | — | ✓ |
| Write blog drafts | — | — | — | — | ✓ | ✓ | — | ✓ |
| Publish blog / KB | — | — | — | — | — | ✓ | — | ✓ |
| Approve pros / view PII docs | — | — | — | — | — | — | view* | ✓ |
| Manage users / roles / quotas | — | — | — | — | — | — | — | ✓ |
| Audit log | own | own | own | own keys | own | own | — | full |

\*Support views are watermarked and audit-logged per `security-foundation.md`.

---

## 2. Auth (Locked)

- **Methods:** email magic link (primary) + Google OAuth. **No passwords** — fewer
  credentials to steal, faster mobile onboarding.
- **Signup role choice:** Personal vs. Tax Pro (apply flow) vs. Developer (self-serve).
  No role self-promotion; upgrades go through approval or admin grant.
- **Sessions:** httpOnly secure cookies; 15-minute magic-link TTL; single-use tokens.
- **Prototype note:** current `localStorage` mock-auth is demo-only and must be replaced
  per the track plans in `mvp-demo-plan.md`.

---

## 3. Post-Login Experience (Locked)

### 3.1 First view = Dashboard (not chat)
After login every role lands on **their dashboard**:
- **With activity:** recent chats, uploads, filings, score movement, deadlines, next best action.
- **With no activity (new user):** the dashboard shows a **simple composer card**
  ("Ask a tax question or drop a document to start") that opens the canvas chat —
  one click from empty to working, no dead ends.

### 3.2 Canvas chat (`/dashboard/chat`) — the rich workspace
1. **Single agent thread** per conversation; the textbox docks beneath the canvas and
   undocks into a sidebar as canvas cards accumulate.
2. **Sidebar uploads** — drag-drop receipts/invoices/payslips; extraction preview
   inline; files persist to the user's library.
3. **Attach into canvas** — any library document can be pulled into the active
   conversation as context ("use my March payslip for this calculation").
4. **Filing settings & actions** — filing year, regime toggles (PAYE/VAT/WHT),
   "add to filing", deadline reminders, all as canvas cards.
5. **Referral trigger** — low-confidence answers, audit/appeal topics, or explicit
   asks surface verified marketplace pros with call/WhatsApp/email actions.
6. **Share, invite, connect** — paid workspaces invite members and share canvases by
   link; any tier can attach external AI connectors (Claude, ChatGPT, Notion, Drive)
   as prompt context (quotas in `pricing-and-access.md`).
7. **Language follows the user** — the canvas, prompts, and answers render in the
   workspace language (EN/YO/HA/IG).

### 3.3 Admin sections must explain the product
Every admin screen carries a one-line purpose header tying it to the platform story
(e.g., Knowledge Base: "What the agent is allowed to know"). An admin viewing the
panel cold must understand the product in 60 seconds — **never a bare developer tool.**

---

## Changelog

### v1.1 (September 21, 2026)
- Canvas spec gains share/invite/connect + language-follows-user; permission matrix adds invite/share row and connector quotas (2 free/consumer/pro-staff/author/editor, 10 owner/partner, unlimited admin).

### v1.0 (September 21, 2026)
- Initial roles/experience foundation: 8 locked roles with permission matrix, magic-link + Google auth (no passwords), dashboard-first landing with empty-state composer, canvas chat spec (thread, sidebar uploads, attach, filing actions, referral), admin explainer-header rule.
