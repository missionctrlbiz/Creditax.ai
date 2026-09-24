/**
 * fa-6 — landscape investor deck (PPTX) consuming fa-5 captures.
 * Run: node scripts/build-investor-deck.mjs
 * Output: research/creditax-investor-deck.pptx
 */
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// pptxgenjs dual package: exports.import points at .es.js without type:module,
// so Node loads it as CJS and fails. Use the explicit require condition.
const require = createRequire(import.meta.url);
const pptxgen = require('pptxgenjs');

const OUT = path.resolve('research/creditax-investor-deck.pptx');
const SHOTS = path.resolve('assets/demo-screenshots');
const CROP_DIR = path.resolve('assets/demo-screenshots/_deck-crops');

const BRAND = {
  teal: '0D7377',
  tealMid: '14919B',
  green: '32E875',
  dark: '0A0F14',
  light: 'F4F9F9',
  white: 'FFFFFF',
  muted: '8AA0A8',
  body: 'C8D4D8',
};

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.333 × 7.5
pptx.author = 'Creditax.ai';
pptx.company = 'Creditax.ai';
pptx.subject = 'Investor pitch deck';
pptx.title = 'Creditax.ai — Investor Deck';
pptx.lang = 'en-NG';

function footer(slide, n, total) {
  slide.addText(
    [
      { text: 'Creditax.ai', options: { color: BRAND.muted, fontFace: 'Arial', fontSize: 9 } },
      { text: `  ·  demo_seed UI until live cutover  ·  ${n}/${total}`, options: { color: BRAND.muted, fontFace: 'Arial', fontSize: 9 } },
    ],
    { x: 0.5, y: 7.1, w: 12.3, h: 0.28, margin: 0 }
  );
}

function bgDark(slide) {
  slide.background = { color: BRAND.dark };
}

function title(slide, text, y = 0.45) {
  slide.addText(text, {
    x: 0.55, y, w: 12.2, h: 0.7,
    fontFace: 'Arial', fontSize: 30, bold: true,
    color: BRAND.white, margin: 0,
  });
}

function accentBar(slide, y = 1.15) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y, w: 1.4, h: 0.06,
    fill: { color: BRAND.green },
    line: { color: BRAND.green },
  });
}

function bullets(slide, items, opts = {}) {
  const text = items.map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 14 }, breakLine: true } }));
  slide.addText(text, {
    x: opts.x ?? 0.7,
    y: opts.y ?? 1.45,
    w: opts.w ?? 11.9,
    h: opts.h ?? 5.2,
    fontFace: 'Arial',
    fontSize: opts.fontSize ?? 16,
    color: opts.color ?? BRAND.body,
    lineSpacingMultiple: opts.lineSpacingMultiple ?? 1.25,
    margin: 6,
    valign: 'top',
    paraSpaceAfter: opts.paraSpaceAfter ?? 8,
  });
}

/** Crop/scale a capture into a deck-friendly path (max width ~2200px, top crop for fullpage). */
async function prepImage(srcName, destName, { cropTopRatio = 1, maxW = 2000 } = {}) {
  await mkdir(CROP_DIR, { recursive: true });
  const src = path.join(SHOTS, srcName);
  const dest = path.join(CROP_DIR, destName);
  const py = `
from PIL import Image
im = Image.open(${JSON.stringify(src)})
w, h = im.size
if ${cropTopRatio} < 1:
    h = max(1, int(h * ${cropTopRatio}))
    im = im.crop((0, 0, w, h))
if im.size[0] > ${maxW}:
    ratio = ${maxW} / im.size[0]
    im = im.resize((${maxW}, max(1, int(im.size[1] * ratio))), Image.Resampling.LANCZOS)
im.save(${JSON.stringify(dest)}, optimize=True)
`;
  execFileSync('python3', ['-c', py]);
  return dest;
}

function imageSlide(slide, imgPath, caption, n, total, { dark = true } = {}) {
  if (dark) bgDark(slide);
  else slide.background = { color: BRAND.light };
  title(slide, caption);
  accentBar(slide);
  // frame
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 1.4, w: 12.2, h: 5.35,
    fill: { color: dark ? '101820' : 'FFFFFF' },
    line: { color: dark ? '1A2430' : 'D0DEE2', width: 1 },
  });
  slide.addImage({ path: imgPath, x: 0.7, y: 1.55, w: 11.9, h: 5.05, sizing: { type: 'contain', w: 11.9, h: 5.05 } });
  footer(slide, n, total);
}

function twoColImage(slide, left, right, caption, n, total) {
  bgDark(slide);
  title(slide, caption);
  accentBar(slide);
  slide.addImage({ path: left, x: 0.55, y: 1.4, w: 6.0, h: 5.3, sizing: { type: 'contain', w: 6.0, h: 5.3 } });
  slide.addImage({ path: right, x: 6.8, y: 1.4, w: 6.0, h: 5.3, sizing: { type: 'contain', w: 6.0, h: 5.3 } });
  footer(slide, n, total);
}

async function main() {
  const TOTAL = 12;

  // Prep key captures
  const imgLanding = await prepImage('A01-landing-hook-desktop.png', 'landing-top.png', { cropTopRatio: 0.12, maxW: 1800 });
  const imgAnswer = await prepImage('B02-first-cited-answer-desktop.png', 'answer.png');
  const imgCredit = await prepImage('C01-credit-snapshot-desktop.png', 'credit.png');
  const imgPricing = await prepImage('C03-pricing-tiers-desktop.png', 'pricing.png');
  const imgMkt = await prepImage('D01-search-filters-desktop.png', 'marketplace.png');
  const imgPro = await prepImage('E01-pro-dashboard-desktop.png', 'pro.png');
  const imgAdmin = await prepImage('F01-admin-dashboard-desktop.png', 'admin.png');
  const imgStatus = await prepImage('G01-status-all-green-desktop.png', 'status.png');
  const imgUpload = await prepImage('B03-upload-attach-desktop.png', 'upload.png');
  const imgCanvas = await prepImage('B01-canvas-empty-desktop.png', 'canvas.png');

  // 1 — Cover
  {
    const s = pptx.addSlide();
    bgDark(s);
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 13.333, h: 7.5,
      fill: { color: BRAND.dark },
      line: { color: BRAND.dark },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 0.18, h: 7.5,
      fill: { color: BRAND.teal },
      line: { color: BRAND.teal },
    });
    s.addText('Creditax.ai', {
      x: 0.7, y: 2.2, w: 10, h: 1,
      fontFace: 'Arial', fontSize: 48, bold: true, color: BRAND.white, margin: 0,
    });
    s.addText('Nigerian tax compliance, made creditworthy.', {
      x: 0.7, y: 3.3, w: 11, h: 0.6,
      fontFace: 'Arial', fontSize: 24, color: BRAND.green, margin: 0,
    });
    s.addText(
      'AI canvas for tax answers grounded in NTA / NTAA / FIRS  ·  credit health score  ·  verified pro marketplace  ·  partner APIs',
      { x: 0.7, y: 4.1, w: 11.5, h: 0.9, fontFace: 'Arial', fontSize: 15, color: BRAND.body, margin: 0 }
    );
    s.addText('Investor deck  ·  September 2026  ·  Track A demo build', {
      x: 0.7, y: 6.5, w: 10, h: 0.4,
      fontFace: 'Arial', fontSize: 12, color: BRAND.muted, margin: 0,
    });
    footer(s, 1, TOTAL);
  }

  // 2 — Problem
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Problem');
    accentBar(s);
    bullets(s, [
      'Nigeria’s 2024 tax reforms (NTA, NTAA, Capital Gains) left millions of workers, freelancers and SMEs unsure what they owe.',
      'Generic AI tools hallucinate jurisdiction-specific law — no citations, no audit trail, no trust for filing or lending.',
      'Credit underwriting ignores tax compliance data, while lenders still demand BVN/TIN proof without a clean UX.',
      'Tax pros still acquire clients via word-of-mouth; consumers cannot verify who is real.',
      'Developers who need PAYE/VAT/WHT primitives hand-code rules and re-learn them every reform cycle.',
    ], { y: 1.45, fontSize: 16 });
    footer(s, 2, TOTAL);
  }

  // 3 — Solution
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Solution — one platform, four outcomes');
    accentBar(s);
    bullets(s, [
      'Canvas AI agent answers tax questions with citations to published Nigerian law (NTA / NTAA / FIRS guides).',
      'Sidebar document uploads turn receipts, invoices and payslips into structured filing inputs.',
      'Credit health score links compliance + financial signals — the differentiator no tax app owns.',
      'Verified tax professional marketplace: when stakes are high, the agent refers real humans nearby.',
      'Same engines exposed as versioned APIs for fintechs, payroll and ERP partners (B2B2C wedge).',
    ], { y: 1.45, fontSize: 16 });
    footer(s, 3, TOTAL);
  }

  // 4 — Product demo (answer + upload)
  {
    const s = pptx.addSlide();
    twoColImage(s, imgAnswer, imgUpload, 'Product — grounded answer + document pipeline', 4, TOTAL);
    s.addText(
      'Live captures (fa-5). Simulated data is labelled demo_seed until production cutover.',
      { x: 0.55, y: 6.8, w: 12, h: 0.3, fontFace: 'Arial', fontSize: 10, color: BRAND.muted, margin: 0 }
    );
  }

  // 5 — Moat / architecture
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Moat — RAG + compliance–credit flywheel');
    accentBar(s);
    bullets(s, [
      'Dual vector indexes: tax_document_chunks (law Q&A) + tax_professionals_embeddings (marketplace matching).',
      'Deterministic tax calculators (PAYE / VAT / WHT / CIT) sit beside generative answers — figures you can defend.',
      'Compliance activity feeds credit score factors; score visibility drives filing behaviour → more signal.',
      'Legal posture: published law only — no unofficial government-system access; citations on every answer.',
      '4-language product (EN / YO / HA / IG) including agent prompting — distribution moat in Nigeria.',
    ], { y: 1.45, fontSize: 16 });
    footer(s, 5, TOTAL);
  }

  // 6 — Product surfaces gallery
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Product surfaces — consumer, pro, admin');
    accentBar(s);
    s.addImage({ path: imgCredit, x: 0.4, y: 1.35, w: 4.1, h: 2.45, sizing: { type: 'cover', w: 4.1, h: 2.45 } });
    s.addImage({ path: imgMkt, x: 4.6, y: 1.35, w: 4.1, h: 2.45, sizing: { type: 'cover', w: 4.1, h: 2.45 } });
    s.addImage({ path: imgPro, x: 8.8, y: 1.35, w: 4.1, h: 2.45, sizing: { type: 'cover', w: 4.1, h: 2.45 } });
    s.addImage({ path: imgAdmin, x: 0.4, y: 4.0, w: 4.1, h: 2.45, sizing: { type: 'cover', w: 4.1, h: 2.45 } });
    s.addImage({ path: imgPricing, x: 4.6, y: 4.0, w: 4.1, h: 2.45, sizing: { type: 'cover', w: 4.1, h: 2.45 } });
    s.addImage({ path: imgStatus, x: 8.8, y: 4.0, w: 4.1, h: 2.45, sizing: { type: 'cover', w: 4.1, h: 2.45 } });
    const labels = [
      ['Credit snapshot', 0.4], ['Marketplace search', 4.6], ['Pro portal', 8.8],
      ['Admin board', 0.4], ['₦ pricing tiers', 4.6], ['Status — all green', 8.8],
    ];
    for (const [t, x] of labels) {
      s.addText(t, { x, y: 6.5, w: 4.1, h: 0.3, fontFace: 'Arial', fontSize: 11, color: BRAND.muted, align: 'center', margin: 0 });
    }
    footer(s, 6, TOTAL);
  }

  // 7 — Market
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Market — Nigeria first, depth over breadth');
    accentBar(s);
    bullets(s, [
      'P0 consumers & micro/SMEs: “tell me what I owe, help me file, make lenders trust me.”',
      'P1 tax professionals: verified client flow + bulk calc / verification / reports tools.',
      'P2 fintechs, payroll, ERP: maintained Nigerian tax primitives without hand-coded reform debt.',
      'P3 banks & institutions: compliance signals and white-label rails (Enterprise).',
      'No competitor combines tax-compliance AI with credit scoring on published Nigerian law.',
    ], { y: 1.45, fontSize: 16 });
    footer(s, 7, TOTAL);
  }

  // 8 — Business model
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Business model — Naira-only, quota-enforced');
    accentBar(s);
    // tier cards
    const tiers = [
      ['Free ₦0', '5 chats/day · 60 lifetime\nStarter score · 2 BVN teaser\n100 sandbox API calls/mo'],
      ['Plus ₦5,000/mo', '100 chats/day\nFull score + simulator\n5 BVN · 5k API calls'],
      ['Pro ₦25,000/mo', 'Unlimited fair-use\nPractice tools · 3 seats\n50k API · 20 BVN'],
      ['Enterprise', 'Contracted volume\nSSO + SLA\nPortfolio scoring'],
    ];
    tiers.forEach(([h, body], i) => {
      const x = 0.55 + i * 3.2;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.5, w: 3.0, h: 3.6, rectRadius: 0.08,
        fill: { color: i === 1 ? BRAND.teal : '121A22' },
        line: { color: i === 1 ? BRAND.green : '1E2A34', width: 1.5 },
      });
      s.addText(h, { x: x + 0.15, y: 1.7, w: 2.7, h: 0.5, fontFace: 'Arial', fontSize: 16, bold: true, color: BRAND.white, margin: 0 });
      s.addText(body, { x: x + 0.15, y: 2.35, w: 2.7, h: 2.4, fontFace: 'Arial', fontSize: 13, color: BRAND.body, margin: 0, valign: 'top' });
    });
    s.addText(
      'Revenue streams: subscriptions · BVN pay-per-use (₦350) · marketplace take-rate · partner API calls · Enterprise white-label.',
      { x: 0.55, y: 5.4, w: 12.2, h: 0.6, fontFace: 'Arial', fontSize: 14, color: BRAND.green, margin: 0 }
    );
    s.addText(
      'Unit economics (locked method): free CAC envelope ₦2,000 · grounded chat ≈ ₦5 · BVN ≈ ₦90 cost vs ₦350 price · Plus conversion target ≥1 per 10 active free in 90 days.',
      { x: 0.55, y: 6.1, w: 12.2, h: 0.7, fontFace: 'Arial', fontSize: 12, color: BRAND.muted, margin: 0 }
    );
    footer(s, 8, TOTAL);
  }

  // 9 — Traction / build status
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Traction — full-access build green');
    accentBar(s);
    s.addImage({ path: imgStatus, x: 6.6, y: 1.4, w: 6.2, h: 3.6, sizing: { type: 'contain', w: 6.2, h: 3.6 } });
    bullets(s, [
      '20-phase product chain complete; full-access next build exit 0.',
      'Live Mapbox: reverse + search return geo_source=mapbox; raster overlay on marketplace.',
      'Mono host fixed to api.withmono.com (mono-sec-key); demo path fail-closed with mono.attempted.',
      '37 demo screenshots A–G captured (desktop + mobile) for client pitches.',
      'charged:false invariant holds with empty PSP keys (honest not-configured).',
    ], { x: 0.55, y: 1.5, w: 5.8, h: 4.5, fontSize: 14 });
    s.addText(
      'Blocked honestly: Mono live data_source=mono-sandbox needs test_sk_* + sandbox kv/kvn (never committed).',
      { x: 0.55, y: 6.2, w: 12.2, h: 0.5, fontFace: 'Arial', fontSize: 12, color: 'F0C070', margin: 0 }
    );
    footer(s, 9, TOTAL);
  }

  // 10 — Go-to-market
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Go-to-market — Twitter-first + marketplace supply');
    accentBar(s);
    bullets(s, [
      'Launch plan: SuperScale content (explainer, mock-ups, threads) → public launch → marketplace RAG live.',
      'Supply first: onboard verified tax pros (CAC + Mono Lookup + certificate review) before demand spikes.',
      'Developer distribution: sandbox keys, quickstart, status page — partners ship PAYE/VAT without re-implementation.',
      '6-month success metrics: 100 API signups · 25 active API users · first revenue · NPS > 40.',
      'Legal gate: NDPA/DPIA complete before production real-data launch (legal-compliance.md).',
    ], { y: 1.45, fontSize: 16 });
    footer(s, 10, TOTAL);
  }

  // 11 — Team & 3-year sketch
  {
    const s = pptx.addSlide();
    bgDark(s);
    title(s, 'Team & 3-year outlook');
    accentBar(s);
    bullets(s, [
      'Founder-led (solo Phase 0–Track A): full-stack + RAG + payments; hiring plan post-seed (marketplace ops, compliance, AE).',
      'Year 1: Nigeria consumer + pro launch; partner API pilots; NDPA production cutover.',
      'Year 2: portfolio scoring for lenders; Enterprise white-label; expand verification beyond BVN/TIN.',
      'Year 3: regional fintech rails / BaaS add-on (priced only after scoped — pricing-and-access.md open item).',
      'Risk posture: versioned law content, no unofficial FIRS hooks, fail-closed identity, quota abuse controls.',
    ], { y: 1.45, fontSize: 16 });
    footer(s, 11, TOTAL);
  }

  // 12 — Ask
  {
    const s = pptx.addSlide();
    bgDark(s);
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 13.333, h: 7.5,
      fill: { color: BRAND.dark },
      line: { color: BRAND.dark },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 13.333, h: 0.16,
      fill: { color: BRAND.green },
      line: { color: BRAND.green },
    });
    s.addText('The ask', {
      x: 0.7, y: 1.4, w: 10, h: 0.8,
      fontFace: 'Arial', fontSize: 36, bold: true, color: BRAND.white, margin: 0,
    });
    bullets(s, [
      'Capital to move Track A demo → Track B production (Supabase + NDPA DPIA + Mono live + PSP test→live).',
      'Runway for marketplace supply (tax pro onboarding) + first partner API deals.',
      'Use of funds: infra & compliance, BD (lenders/payroll), content/GTM, 2–3 hires.',
      'What we will show next: mono-sandbox data_source flip, PSP test charge path (charged stays false until live), case studies from 4–5 warm leads.',
    ], { x: 0.7, y: 2.4, w: 11.5, h: 3.5, fontSize: 17, color: BRAND.body });
    s.addText('creditax.ai  ·  hello@creditax.ai  ·  investors@creditax.ai', {
      x: 0.7, y: 6.3, w: 11, h: 0.4,
      fontFace: 'Arial', fontSize: 14, color: BRAND.green, margin: 0,
    });
    footer(s, 12, TOTAL);
  }

  await pptx.writeFile({ fileName: OUT });
  await writeFile(
    path.resolve('research/creditax-investor-deck.SOURCES.md'),
    [
      '# Creditax.ai investor deck — sources (fa-6)',
      '',
      `- Output: \`research/creditax-investor-deck.pptx\` (LAYOUT_WIDE landscape)`,
      '- Generator: `scripts/build-investor-deck.mjs` (pptxgenjs)',
      '- Captures: fa-5 `assets/demo-screenshots/*` (crops under `_deck-crops/`, gitignored or small)',
      '- Content: product-foundation.md, pricing-and-access.md, mvp-demo-plan §7, project-roadmap.md, marketing-strategy.md, security/legal notes',
      '- Honesty: slides mark demo_seed UI; Mono live path called out as blocked until test_sk_*',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
    ].join('\n'),
    'utf8'
  );
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
