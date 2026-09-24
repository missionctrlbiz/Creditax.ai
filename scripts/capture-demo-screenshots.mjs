/**
 * fa-5 — Demo screenshot capture A–G (desktop 1440×900 + mobile 375×812 key flows).
 * Run: node scripts/capture-demo-screenshots.mjs
 * Requires: dev server on :3000, Google Chrome (playwright channel).
 */
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT = path.resolve('assets/demo-screenshots');
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 812 };

/** @type {Array<{id:string,url:string,session?:{role:string,email:string},full?:boolean,wait?:string,mobile?:boolean,note?:string}>} */
const SHOTS = [
  // A — Landing + Signup
  { id: 'A01-landing-hook-desktop', url: '/en/', full: true },
  { id: 'A02-free-signup-desktop', url: '/en/signup' },
  { id: 'A03a-login-consumer-desktop', url: '/en/login' },
  { id: 'A03b-login-pro-desktop', url: '/en/login' },
  { id: 'A03c-login-admin-desktop', url: '/en/login' },
  { id: 'A03d-login-author-desktop', url: '/en/login' },
  { id: 'A02b-signup-mobile', url: '/en/signup', mobile: true },

  // B — Dashboard + Canvas
  { id: 'B01-canvas-empty-desktop', url: '/en/dashboard/chat', session: { role: 'personal', email: 'demo@creditax.ai' } },
  { id: 'B02-first-cited-answer-desktop', url: '/en/dashboard/chat', session: { role: 'personal', email: 'demo@creditax.ai' }, wait: 'text=Sources' },
  { id: 'B03-upload-attach-desktop', url: '/en/dashboard/documents/upload', session: { role: 'personal', email: 'demo@creditax.ai' } },
  { id: 'B04-skills-v1-desktop', url: '/en/dashboard/chat', session: { role: 'personal', email: 'demo@creditax.ai' } },
  { id: 'B05-quota-wall-desktop', url: '/en/dashboard/chat', session: { role: 'personal', email: 'demo@creditax.ai' }, note: 'seed hits wall on 5th free chat' },
  { id: 'B01-canvas-mobile', url: '/en/dashboard/chat', session: { role: 'personal', email: 'demo@creditax.ai' }, mobile: true },
  { id: 'B02-answer-mobile', url: '/en/dashboard/chat', session: { role: 'personal', email: 'demo@creditax.ai' }, mobile: true },

  // C — Credit + Pricing/Money
  { id: 'C01-credit-snapshot-desktop', url: '/en/dashboard/credit', session: { role: 'personal', email: 'demo@creditax.ai' } },
  { id: 'C02-usage-desktop', url: '/en/dashboard/usage', session: { role: 'personal', email: 'demo@creditax.ai' } },
  { id: 'C03-pricing-tiers-desktop', url: '/en/pricing' },

  // D — Marketplace
  { id: 'D01-search-filters-desktop', url: '/en/marketplace' },
  { id: 'D02-pro-profile-desktop', url: '/en/marketplace/akinwale-associates' },
  { id: 'D03-referral-from-chat-desktop', url: '/en/dashboard/chat', session: { role: 'personal', email: 'demo@creditax.ai' } },
  { id: 'D01-search-mobile', url: '/en/marketplace', mobile: true },

  // E — Pro Portal
  { id: 'E01-pro-dashboard-desktop', url: '/en/pro/dashboard', session: { role: 'pro', email: 'pro@creditax.ai' } },
  { id: 'E02-client-detail-desktop', url: '/en/pro/clients', session: { role: 'pro', email: 'pro@creditax.ai' } },
  { id: 'E03-bulk-calculations-desktop', url: '/en/pro/calculations', session: { role: 'pro', email: 'pro@creditax.ai' } },
  { id: 'E04-verification-desktop', url: '/en/pro/verify', session: { role: 'pro', email: 'pro@creditax.ai' } },

  // F — Admin + Author
  { id: 'F01-admin-dashboard-desktop', url: '/en/admin/dashboard', session: { role: 'admin', email: 'admin@creditax.ai' } },
  { id: 'F02-approval-queue-desktop', url: '/en/admin/professionals', session: { role: 'admin', email: 'admin@creditax.ai' } },
  { id: 'F03-kb-publish-desktop', url: '/en/admin/knowledge-base', session: { role: 'admin', email: 'admin@creditax.ai' } },
  { id: 'F04-author-scoped-board-desktop', url: '/en/admin/knowledge-base', session: { role: 'author', email: 'author@creditax.ai' } },
  { id: 'F05-users-board-desktop', url: '/en/admin/users', session: { role: 'admin', email: 'admin@creditax.ai' } },

  // G — Status + Developers
  { id: 'G01-status-all-green-desktop', url: '/en/status' },
  { id: 'G02a-quickstart-desktop', url: '/en/developers/quickstart' },
  { id: 'G02b-sandbox-desktop', url: '/en/developers/sandbox' },
  { id: 'G03-api-reference-desktop', url: '/en/developers/reference' },
  { id: 'G04-webhooks-desktop', url: '/en/developers/webhooks' },
  { id: 'G05-collab-share-desktop', url: '/en/share/share_7f3a9c' },
  { id: 'G01-status-mobile', url: '/en/status', mobile: true },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  for (const shot of SHOTS) {
    const viewport = shot.mobile ? MOBILE : DESKTOP;
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
      locale: 'en-NG',
      colorScheme: 'light',
    });
    const page = await context.newPage();
    try {
      // Seed mock session before app scripts run.
      await page.addInitScript((session) => {
        if (!session) return;
        localStorage.setItem('creditax_role', session.role);
        localStorage.setItem('creditax_email', session.email);
        localStorage.setItem('creditax_locale_pref', 'en');
      }, shot.session ?? null);

      await page.goto(`${BASE}${shot.url}`, { waitUntil: 'networkidle', timeout: 45000 });
      // Allow framer-motion / data fetch to settle.
      await page.waitForTimeout(1200);
      if (shot.wait) {
        try {
          await page.waitForSelector(shot.wait, { timeout: 4000 });
        } catch {
          /* optional marker missing — still capture */
        }
      }
      const file = path.join(OUT, `${shot.id}.png`);
      await page.screenshot({ path: file, fullPage: !!shot.full });
      results.push({ id: shot.id, ok: true, file: path.relative(process.cwd(), file) });
      console.log(`✓ ${shot.id}`);
    } catch (err) {
      results.push({ id: shot.id, ok: false, error: String(err).slice(0, 200) });
      console.error(`✗ ${shot.id}: ${err}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok);
  const summary = [
    `# Capture status — fa-5 (${new Date().toISOString().slice(0, 10)})`,
    '',
    `Captured **${ok}/${results.length}** (desktop 1440×900, mobile 375×812 key flows).`,
    `Failures: ${fail.length ? fail.map((f) => f.id).join(', ') : 'none'}.`,
    '',
    ...results.map((r) => `- ${r.ok ? 'x' : ' '} ${r.id}${r.ok ? '' : ` — ${r.error}`}`),
    '',
  ].join('\n');
  await writeFile(path.join(OUT, 'CAPTURE-STATUS.md'), summary);
  console.log(`\n${ok}/${results.length} captured → ${OUT}`);
  if (fail.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
