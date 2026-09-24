# Demo-Screenshot Inventory (P12 — prep manifest)

Real browser captures only — **no mocks** (mvp-demo-plan §5: "After
Demo-Stable — Real Captures, Not Mocks"). One file per entry, captured at:

- Desktop: 1440×900 (primary, feeds pitch deck)
- Mobile: 375×812 (key flows: onboarding, upload, chat, marketplace)

File naming: `<section><n>-<slug>.png`, e.g. `B02-canvas-first-answer-desktop.png`.
Every capture MUST show the `demo_seed` badge or live badge where the data is
simulated (Track A honesty rule).

> **Capture status:** DONE (fa-5, 2026-09-24) — **37/37** real browser captures
> (desktop 1440×900 + mobile 375×812 key flows) via
> `scripts/capture-demo-screenshots.mjs` (Playwright + system Chrome against
> `npm run dev`). See `CAPTURE-STATUS.md` for the per-id checklist. Sections
> map 1:1 to the 8-minute demo script beats (mvp-demo-plan §4).

## A — Landing + Signup (beats 0–1)
| # | Entry | Route | State to capture |
|---|-------|-------|------------------|
| A1 | Landing hook | `/` | "Tax Smart. Borrow Smart." hero + 2024 reform pain copy |
| A2 | Free signup | `/signup` → redirect to `/dashboard` | empty-state dashboard, composer visible |
| A3 | 4-role logins | `/login` | consumer / pro / admin / author homes (4 separate captures) |

## B — Dashboard + Infinite Canvas (beats 1–3)
| # | Entry | Route | State to capture |
|---|-------|-------|------------------|
| B1 | Canvas empty | `/dashboard/chat` | pannable board, docked composer, library sidebar |
| B2 | First cited answer | `/dashboard/chat` | seeded grounded answer card + citations, live badge |
| B3 | Upload + attach | `/dashboard/documents/upload` → canvas | extraction preview card, doc pinned into next turn |
| B4 | Skills v1 | `/dashboard/chat` | 🧾📜📩🧮 chips above composer + result card (WHT recovery shown) |
| B5 | Quota wall | `/dashboard/chat` | 6th free chat → 403 upgrade wall card (`/pricing` CTA) |

## C — Credit + Pricing/Money (beats 4, 8)
| # | Entry | Route | State to capture |
|---|-------|-------|------------------|
| C1 | Credit snapshot | `/dashboard/credit` | seeded score + factor list, "filing streak" callout |
| C2 | Usage page | `/dashboard/usage` | real quota counters (4/5 day, 54/60 lifetime style) |
| C3 | Pricing tiers | `/pricing` | ₦0 / ₦5,000 / ₦25,000 tiers, BVN row |

## D — Marketplace (beat 5)
| # | Entry | Route | State to capture |
|---|-------|-------|------------------|
| D1 | Search + filters | `/marketplace` | verified badge, geo filters |
| D2 | Pro profile | `/marketplace/<proId>` | masked contact (free tier) → revealed (logged-in paid tier) |
| D3 | Referral from chat | canvas → `/marketplace/<proId>` | tier-aware referral card + WhatsApp reveal |

## E — Pro Portal (beat 6)
| # | Entry | Route | State to capture |
|---|-------|-------|------------------|
| E1 | Pro dashboard | `/pro/dashboard` | live client book + bulk-calc summary (demo_seed) |
| E2 | Client detail | `/pro/clients/<id>` | live application/verification status |
| E3 | Bulk calculations | `/pro/calculations` | run result across client book |
| E4 | Verification | `/pro/verify` | stepper + recent checks live state |

## F — Admin + Author (beat 6)
| # | Entry | Route | State to capture |
|---|-------|-------|------------------|
| F1 | Admin dashboard | `/admin/dashboard` | live aggregate stat cards |
| F2 | Approval queue | `/admin/professionals` | 3 pending applications, detail panel + bulk bar |
| F3 | KB publish money shot | `/admin/knowledge-base` → `/dashboard/chat` | publish → `/api/v1/admin/kb` audit log → chat answer improves |
| F4 | Author scoped board | author login | KB + Audit only (scope enforcement) |
| F5 | Users board | `/admin/users` | live users, edit modal PATCH, CSV export |

## G — Status + Developers (beat 7–8)
| # | Entry | Route | State to capture |
|---|-------|-------|------------------|
| G1 | Status all-green | `/status` | 5 services operational, all-resolved incidents |
| G2 | Quickstart + sandbox | `/developers/quickstart`, `/developers/sandbox` | live sandbox key + reset/rotate wired |
| G3 | API reference | `/developers/reference` | endpoint switcher + "Try in Sandbox" → sandbox |
| G4 | Webhooks | `/developers/webhooks` | endpoint cards + add panel save |
| G5 | Collab preview | `/share/<slug>` + invites | read-only canvas link + signup CTA, Drive connector chip |
