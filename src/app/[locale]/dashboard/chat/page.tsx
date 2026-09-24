'use client';

/**
 * P8 — /dashboard/chat as the INFINITE CANVAS (roles-and-experience.md §3.2,
 * mvp-demo-plan G-03 Track A, demo scope #4/#12). Not a chatbot thread:
 *
 *   • A pannable + zoomable board (Miro / Google-Flow style). Documents,
 *     agent answers, skill results, referrals, filing actions, quota walls and
 *     share links are all CARDS placed at world coordinates on a dot-grid stage.
 *   • The composer (input + Skills chip rail, feature-specs) docks beneath the
 *     viewport and undocks into the left sidebar as cards accumulate (§3.2.1).
 *   • Sidebar uploads → live library (P8: real store reads), attach pins a
 *     document into the next turn (§3.2.3).
 *   • Referral cards are tier-aware (P8 exit 3); the 5th free chat is a 403
 *     from the server-side quota engine and renders as a wall card (P8 exit 1).
 *   • Share spawns a read-only /share/<slug> link card (P6 F-18, scope 11).
 *   • Language follows the user: the agent answers in the active locale
 *     (EN/YO/HA/IG, §3.2.7, P8 exit 4).
 */

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  Bot,
  Check,
  Clock,
  Crosshair,
  FileText,
  Link2,
  Lock,
  Maximize2,
  MessageCircle,
  Minus,
  Paperclip,
  Phone,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { toast } from 'sonner';
import { SKILLS, runSkill as runSkillLocal, type SkillMeta, type SkillResult } from '@/ai/skills';
import { buildReferralCard, type ReferralCard } from '@/ai/referral';
import { fmtNaira } from '@/ai/tax-rules';
import { getSession } from '@/lib/auth';
import { seedUsers } from '@/lib/seed/demoSeed';
import type { Tier } from '@/lib/seed/demoSeed';
import type {
  WhtRecoveryResult,
  TccResult,
  NoticeExplainerResult,
  InvoiceWhtResult,
} from '@/ai/skills';

// ---------------------------------------------------------------------------
// Canvas data model — every element on the board is a positioned card
// ---------------------------------------------------------------------------

type CardKind = 'user' | 'answer' | 'filing' | 'referral' | 'skill' | 'wall' | 'share' | 'thinking';

interface CanvasCard {
  id: string;
  kind: CardKind;
  content: string;
  /** World-coordinate top-left on the board stage. */
  pos: { x: number; y: number };
  /** World-coordinate width the card should occupy. */
  width: number;
  sources?: string[];
  /** How the answer was produced (P2 Track A honesty): live RAG vs offline fallback. */
  demoSeed?: boolean;
  /** P3 F-20: skill chip → canvas result card payload (pinned to canvas). */
  skill?: SkillResult;
  /** P3 F-09 / P8: live verified-pro referral (masked → revealed by real tier). */
  referral?: ReferralCard;
  /** P8: live quota upgrade wall (5th free chat metered-blocked on the server). */
  wall?: { message: string; to: string };
  /** P8: attached document pinned into the next turn as context. */
  attachedDoc?: LiveDoc;
  /** P6 F-18: shared-canvas link card (read-only URL + tier gate). */
  shareLink?: { url: string; access: string; ok: boolean; upgradeTo?: string };
}

/** P8 — a *live* processed document from the store (replaces the static LIBRARY). */
interface LiveDoc {
  id: string;
  name: string;
  format: string;
  status: string;
  amount?: number;
  category?: string;
  period?: string;
  group: 'receipt' | 'invoice' | 'tax-form';
}

interface LiveQuota {
  userId: string;
  tier: string;
  credits: { today: number; budget: number; remaining: number };
  chats: { today: number; cap: number; lifetime: number; lifetimeCap: number };
  upgradeHint: { to: string; message: string } | null;
}

interface Me {
  userId: string;
  tier: string;
  email: string;
  name: string;
  loggedIn: boolean;
}

interface ConnectorChip {
  service: string;
  displayName: string;
}

/** Board metrics. */
const CARD_W = 360;
const USER_W = 280;
const GAP_X = 340; // next column (USER_W or CARD_W + 40 gutter, rounded)
const LANE_Y = 250; // rows on the board
const MIN_Z = 0.4;
const MAX_Z = 2.5;

/** Markdown canned answers — offline fallback when the RAG endpoint is unreachable. */
const CANNED: { match: string[]; reply: string; sources: string[]; referral?: boolean }[] = [
  {
    match: ['vat', 'value added'],
    reply: `Under the Nigeria VAT Act, **VAT is charged at 7.5%** on most goods and services.

- **Filing:** monthly returns to FIRS by the **21st** of the following month
- **Input VAT:** deductible when you hold a valid tax invoice
- **Exempt:** basic food items, medical products, education

Want me to check the deductible VAT from your uploaded invoices?`,
    sources: ['FIRS VAT Guide (demo)', 'Nigeria VAT Act §8 (demo)'],
  },
  {
    match: ['paye', 'pay as you earn', 'salary'],
    reply: `**PAYE** is deducted by your employer under the Personal Income Tax Act.

| Item | Value |
|---|---|
| Graduated bands | 7% – 24% |
| Consolidated Relief Allowance | ₦200,000 + 20% of gross |
| Minimum CRA | 1% of gross |

Your *PAYE_Certificate_2024.pdf* is in the library — pin it on the board and I'll compute your relief.`,
    sources: ['Personal Income Tax Act (demo)', 'FIRS PAYE Guide (demo)'],
  },
  {
    match: ['wht', 'withholding'],
    reply: `**Withholding Tax** in Nigeria ranges from **5%–10%** by transaction:

- Rent — 10%
- Dividends — 10%
- Professional fees — 10% (individual) / 5% (company)
- Contracts — 5%

The payer remits it and issues you a **WHT credit note** you can track under Documents.`,
    sources: ['WHT Circulars (demo)'],
  },
  {
    match: ['tin', 'tax identification'],
    reply: `Your **TIN** is issued by FIRS (companies) or your State IRS (individuals). You need it for filing, bank transactions, and CAC registration.

Attach a document or ask me to verify a TIN — verification opens the Pro portal in this demo.`,
    sources: ['FIRS TIN Guide (demo)'],
    referral: true,
  },
];

const FALLBACK = `Great question. In this prototype the assistant answers from a small demo set — try **VAT**, **PAYE**, **WHT**, or **TIN**.

For anything deeper, a verified pro on the [Marketplace](/marketplace) can help — I'll pin one to the board.`;

const FALLBACK_SOURCES = ['Demo set'];

const FILING_STEPS = ['Review figures', 'Attach documents', 'Add to 2025 filing'];

// ---------------------------------------------------------------------------
// Card bodies (shared by the board + the thinking indicator)
// ---------------------------------------------------------------------------

/** P3 F-20 — a Skill's fixed I/O contract, pinned to the canvas. */
function SkillCardBody({ card }: { card: CanvasCard }) {
  const s = card.skill;
  if (!s) {
    return (
      <>
        <p className="text-sm font-semibold text-text-primary">{card.content}</p>
        <p className="text-[11px] text-text-muted mt-1">This Skill needs more input — ask in the composer below.</p>
      </>
    );
  }
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary mb-2">{card.content}</p>
      {renderSkillBody(s)}
      {s.demo_seed && (
        <p className="text-[10px] text-text-muted mt-2">demo_seed · output is illustrative, not live data</p>
      )}
    </div>
  );
}

/** Branch the skill body by its concrete result type. */
function renderSkillBody(s: SkillResult) {
  if (s.skill === 'wht-recovery') {
    const r = s as WhtRecoveryResult;
    return (
      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-text-primary">{fmtNaira(r.totalUnclaimed)}</p>
          <span className="text-[11px] text-text-muted">unclaimed · {r.unclaimedPeriod}</span>
        </div>
        <p className="text-[12px] text-text-secondary mt-1">{r.vendor}</p>
        <ul className="mt-2 space-y-1">
          {r.items.map((it) => (
            <li key={it.period} className="flex items-center justify-between text-[12px] text-text-secondary">
              <span>{it.period} · {it.client}</span>
              <span className="font-medium text-text-primary">
                {fmtNaira(it.amount)} · {it.status.replace(/_/g, ' ')}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-text-secondary mt-2">{r.nextAction}</p>
      </div>
    );
  }
  if (s.skill === 'tcc-readiness') {
    const r = s as TccResult;
    return (
      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-text-primary">{r.readiness}%</p>
          <span className="text-[11px] text-text-muted">ready</span>
        </div>
        <p className="text-[12px] text-text-secondary mt-1">{r.purpose}</p>
        <div className="mt-2 h-2 rounded-full bg-surface-inset overflow-hidden">
          <div className="h-full rounded-full bg-brand-action" style={{ width: `${r.readiness}%` }} />
        </div>
        {r.missingDocs.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {r.missingDocs.map((d) => (
              <li key={d} className="text-[12px] text-text-secondary">
                <span className="text-brand-action mr-1">•</span> {d}
              </li>
            ))}
          </ul>
        )}
        <p className="text-[12px] text-text-secondary mt-2">{r.deadline}</p>
      </div>
    );
  }
  if (s.skill === 'notice-explainer') {
    const r = s as NoticeExplainerResult;
    return (
      <div>
        <p className="text-[12px] text-text-secondary leading-relaxed">{r.plainLanguage}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[12px] font-medium text-brand-primary">
            Due {r.deadline} · {r.daysLeft}d left
          </span>
        </div>
        <ul className="mt-1.5 space-y-0.5">
          {r.actions.map((a) => (
            <li key={a} className="text-[12px] text-text-secondary">
              <span className="text-brand-action mr-1">→</span> {a}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (s.skill === 'invoice-wht-check') {
    const r = s as InvoiceWhtResult;
    return (
      <div>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div>
            <p className="text-text-muted">Gross</p>
            <p className="font-medium text-text-primary">{fmtNaira(r.gross)}</p>
          </div>
          <div>
            <p className="text-text-muted">Withheld</p>
            <p className="font-medium text-text-primary">
              {fmtNaira(r.witheld)} ({Math.round(r.rate * 100)}%)
            </p>
          </div>
          <div>
            <p className="text-text-muted">Net to vendor</p>
            <p className="font-medium text-text-primary">{fmtNaira(r.netToVendor)}</p>
          </div>
          <div>
            <p className="text-text-muted">Code</p>
            <p className="font-medium text-brand-primary">{r.whtCode}</p>
          </div>
        </div>
        <p className="text-[12px] text-text-secondary mt-2">{r.verdict}</p>
      </div>
    );
  }
  return null;
}

function AnswerBody({ card, t }: { card: CanvasCard; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="prose-creditax text-sm leading-relaxed text-text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <Link href={href ?? '#'} className="text-brand-primary font-semibold hover:underline">
              {children}
            </Link>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 max-w-[300px]">
              <table className="text-[13px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left px-3 py-1.5 border-b border-border-default text-text-muted font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-3 py-1.5 border-b border-border-subtle text-text-secondary">{children}</td>,
        }}
      >
        {card.content}
      </ReactMarkdown>
      {card.attachedDoc && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-badge border border-brand-action-border bg-brand-action-bg text-[10px] text-text-secondary">
          <Paperclip size={11} className="text-brand-action" />
          {card.attachedDoc.name}
        </div>
      )}
      {card.sources && card.sources.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-border-subtle">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{t('sources')}:</span>
          {card.sources.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-badge bg-brand-primary-bg text-brand-primary text-[10px] font-medium">
              {s}
            </span>
          ))}
          {card.demoSeed && (
            <span
              className="px-2 py-0.5 rounded-badge bg-surface-inset border border-border-subtle text-text-muted text-[10px] font-medium"
              title="Answered from the offline demo knowledge base (no live LLM)"
            >
              {t('demoAnswer')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChatCanvasPage() {
  const t = useTranslations('chat');
  const td = useTranslations('dashboard');
  const locale = useLocale();

  // — Cards on the board. The greeting anchors the stage at world (60,40). —
  const [cards, setCards] = useState<CanvasCard[]>([
    { id: 'greeting', kind: 'answer', content: t('greeting'), sources: [t('demoNta')], pos: { x: 60, y: 40 }, width: CARD_W },
  ]);
  const [draft, setDraft] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [pinnedDoc, setPinnedDoc] = useState<LiveDoc | null>(null);

  // — Board camera: pan (screen px) + zoom. World = (screen - pan) / zoom. —
  const [cam, setCam] = useState({ x: 40, y: 40, z: 1 });

  // — P8 data hydration —
  const [me, setMe] = useState<Me>({ userId: 'u-consumer', tier: 'free', email: '', name: '', loggedIn: false });
  const [library, setLibrary] = useState<LiveDoc[]>([]);
  const [quota, setQuota] = useState<LiveQuota | null>(null);
  const [connectors, setConnectors] = useState<ConnectorChip[]>([]);
  const [viewportSize, setViewportSize] = useState({ w: 1200, h: 700 });

  const viewportRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const batchRef = useRef(0);
  const nextId = () => `c${++idRef.current}`;
  const panRef = useRef<{ startX: number; startY: number; camX: number; camY: number } | null>(null);
  const cardDragRef = useRef<{ id: string; startX: number; startY: number; orig: { x: number; y: number } } | null>(null);

  // — P8: resolve the signed-in demo account (pb-auth with mock fallback) so the
  //   chat POST carries {userId, locale, tier} and the quota engine meters it. —
  useEffect(() => {
    let active = true;
    getSession().then((s) => {
      if (!active) return;
      const match = seedUsers.find((u) => u.email.toLowerCase() === s.email.toLowerCase());
      const userId =
        match?.id ??
        (s.role === 'tax_pro' ? 'u-pro' : s.role === 'admin' ? 'u-admin' : s.role === 'author' ? 'u-author' : 'u-consumer');
      setMe({
        userId,
        tier: s.tier,
        email: s.email,
        name: s.name,
        loggedIn: s.role !== 'consumer' || s.email !== 'demo@creditax.ai',
      });
    });
    return () => {
      active = false;
    };
  }, []);

  // — P8: live library + quota + connectors, scoped to the resolved user. —
  useEffect(() => {
    let active = true;
    fetch(`/api/v1/documents?userId=${me.userId}`)
      .then((r) => r.json())
      .then((d: { documents?: LiveDoc[] }) => {
        if (!active || !Array.isArray(d.documents)) return;
        setLibrary(d.documents);
      })
      .catch(() => {});
    fetch(`/api/v1/quota?userId=${me.userId}`)
      .then((r) => r.json())
      .then((d: LiveQuota) => {
        if (!active) return;
        setQuota(d);
      })
      .catch(() => {});
    fetch(`/api/v1/connectors?userId=${me.userId}&tier=${me.tier}`)
      .then((r) => r.json())
      .then((d: { context?: ConnectorChip[] }) => {
        if (!active || !Array.isArray(d.context)) return;
        setConnectors(d.context);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [me.userId, me.tier]);

  /** Refresh live quota counters (after a turn/skill metered successfully). */
  const refreshQuota = useCallback(async () => {
    try {
      const r = await fetch(`/api/v1/quota?userId=${me.userId}`);
      setQuota((await r.json()) as LiveQuota);
    } catch {
      /* offline — keep last known counters */
    }
  }, [me.userId]);

  /** Wheel zoom around the cursor (native listener so preventDefault works). */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      setViewportSize({ w: rect.width, h: rect.height });
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const factor = Math.exp(-e.deltaY * 0.0015);
      setCam((c) => {
        const z = Math.min(MAX_Z, Math.max(MIN_Z, c.z * factor));
        const wx = (sx - c.x) / c.z;
        const wy = (sy - c.y) / c.z;
        return { x: sx - wx * z, y: sy - wy * z, z };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  /** Pan handlers on the stage background (drag empty board space). */
  function onStagePointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest('[data-board-card], .board-ui-chrome')) return;
    panRef.current = { startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onStagePointerMove(e: React.PointerEvent) {
    const p = panRef.current;
    if (p) {
      setCam((c) => ({ ...c, x: p.camX + (e.clientX - p.startX), y: p.camY + (e.clientY - p.startY) }));
      return;
    }
    const d = cardDragRef.current;
    if (d) {
      const z = cam.z;
      const nx = d.orig.x + (e.clientX - d.startX) / z;
      const ny = d.orig.y + (e.clientY - d.startY) / z;
      setCards((prev) => prev.map((c) => (c.id === d.id ? { ...c, pos: { x: nx, y: ny } } : c)));
    }
  }
  function onStagePointerUp() {
    panRef.current = null;
    cardDragRef.current = null;
  }
  /** Start dragging a card (its top-left bar). Screen delta ÷ zoom = world delta. */
  function startCardDrag(e: React.PointerEvent, card: CanvasCard) {
    if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;
    cardDragRef.current = { id: card.id, startX: e.clientX, startY: e.clientY, orig: { ...card.pos } };
  }

  /** Zoom buttons (bottom-right chrome). */
  function zoomBy(factor: number) {
    const el = viewportRef.current;
    const rect = el?.getBoundingClientRect();
    const sx = (rect?.width ?? 1200) / 2;
    const sy = (rect?.height ?? 700) / 2;
    setCam((c) => {
      const z = Math.min(MAX_Z, Math.max(MIN_Z, c.z * factor));
      const wx = (sx - c.x) / c.z;
      const wy = (sy - c.y) / c.z;
      return { x: sx - wx * z, y: sy - wy * z, z };
    });
  }
  /** Fit: back to 100% centered on the board's card cluster. */
  function fitBoard() {
    const el = viewportRef.current;
    const rect = el?.getBoundingClientRect();
    const vw = rect?.width ?? 1200;
    const vh = rect?.height ?? 700;
    if (cards.length === 0) return;
    const minX = Math.min(...cards.map((c) => c.pos.x));
    const minY = Math.min(...cards.map((c) => c.pos.y));
    setCam({ x: vw / 2 - (minX + 200), y: vh / 2 - (minY + 150), z: 1 });
  }

  /** World-coordinate anchor for the next batch: viewport centre, lifted so
   *  it clears the docked composer. Batches alternate columns as they land. */
  function spawnAnchor() {
    const rect = viewportRef.current?.getBoundingClientRect();
    const vw = rect?.width ?? viewportSize.w;
    const vh = rect?.height ?? viewportSize.h;
    const cx = (vw / 2 - cam.x) / cam.z;
    const cy = (vh / 2 - cam.y) / cam.z - 80 / cam.z; // lift above the docked composer
    const o = { x: cx - 340, y: cy - 120 };
    o.x += (batchRef.current % 2) * 46;
    o.y += Math.floor(batchRef.current / 2) * 24;
    batchRef.current += 1;
    return o;
  }

  // ————————————————————————————————————————————————————————————
  // Canvas actions (spawn card batches on the board)
  // ————————————————————————————————————————————————————————————

  /**
   * P8: ask the grounded agent. The POST carries {userId, locale, tier, docId}
   * so the server-side quota engine meters it and the 5th free chat short-
   * circuits into a 403 upgrade wall (P8 exit 1). Offline it falls back to
   * the CANNED set; the answer card records how it was produced (demoSeed).
   */
  async function ask(text: string, opts: { referral?: boolean; doc?: LiveDoc } = {}) {
    const doc = opts.doc ?? pinnedDoc;
    const lower = text.toLowerCase();
    const hit = CANNED.find((c) => c.match.some((m) => lower.includes(m)));
    const canned: { reply: string; sources: string[]; referral?: boolean } = hit
      ? hit
      : { reply: FALLBACK, sources: FALLBACK_SOURCES, referral: true };

    let reply = canned;
    let demoSeed = true;
    let liveConfidence: number | undefined;
    let blocked = false;
    let wallMsg: string | undefined;
    let wallTo: string | undefined;

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          locale,
          userId: me.userId,
          tier: me.tier,
          loggedIn: me.loggedIn,
          docId: doc?.id,
        }),
      });
      if (res.status === 403) {
        // P8 live-quota-in-canvas — the free limit is metered-blocked on the
        // server; render the named-limit upgrade wall card on the board.
        const data = (await res.json().catch(() => ({}))) as {
          status?: LiveQuota;
          upgrade?: { to: string; message: string } | null;
        };
        blocked = true;
        wallMsg = data.upgrade?.message ?? 'You have hit your free limit.';
        wallTo = data.upgrade?.to ?? 'plus';
        if (data.status) setQuota(data.status);
      } else if (res.ok) {
        const data = (await res.json()) as {
          answer?: string;
          citations?: string[];
          confidence?: number;
          demo_seed?: boolean;
        };
        if (data.answer) {
          reply = { reply: data.answer, sources: data.citations ?? [] };
          demoSeed = !!data.demo_seed;
          liveConfidence = data.confidence;
        }
        await refreshQuota();
      }
    } catch {
      // Network down — keep the canned fallback so the demo never dead-ends.
    }

    const o = spawnAnchor();
    const userCard: CanvasCard = {
      id: nextId(),
      kind: 'user',
      content: doc ? `Use ${doc.name} — ${text}` : text,
      pos: { x: o.x, y: o.y },
      width: USER_W,
      attachedDoc: doc ?? undefined,
    };

    if (blocked) {
      setCards((prev) => [
        ...prev,
        userCard,
        {
          id: nextId(),
          kind: 'wall',
          content: wallMsg ?? '',
          wall: { message: wallMsg ?? 'You have hit your free limit.', to: wallTo ?? 'plus' },
          pos: { x: o.x + GAP_X, y: o.y },
          width: CARD_W,
          demoSeed: true,
        },
      ]);
      setPinnedDoc(null);
      setDraft('');
      setThinking(false);
      return;
    }

    const answer: CanvasCard = {
      id: nextId(),
      kind: 'answer',
      content: reply.reply,
      sources: reply.sources,
      demoSeed,
      pos: { x: o.x + GAP_X, y: o.y },
      width: CARD_W,
      attachedDoc: doc ?? undefined,
    };

    // P8 tier-aware referral (F-09): reveal is driven by the REAL viewer tier +
    // logged-in state, never a hardcoded 'free'.
    const explicit = opts.referral || reply.referral;
    const card = buildReferralCard({
      text,
      confidence: liveConfidence,
      tier: (me.tier || 'free') as Tier,
      loggedIn: me.loggedIn,
    });
    const liveReferral = explicit || card ? card : null;

    setCards((prev) => [
      ...prev,
      userCard,
      answer,
      // Filing settings & actions surface as a canvas card (§3.2.4)
      {
        id: nextId(),
        kind: 'filing',
        content: JSON.stringify(FILING_STEPS),
        pos: { x: o.x, y: o.y + LANE_Y },
        width: USER_W,
      },
      // Referral trigger (§3.2.5) — live card (masked/revealed by tier) or fallback
      ...(liveReferral
        ? [{
            id: nextId(),
            kind: 'referral' as const,
            content: liveReferral.pro.name,
            referral: liveReferral,
            pos: { x: o.x + GAP_X, y: o.y + LANE_Y },
            width: CARD_W,
          }]
        : explicit
          ? [{ id: nextId(), kind: 'referral' as const, content: 'Adaeze Consulting Ltd', pos: { x: o.x + GAP_X, y: o.y + LANE_Y }, width: CARD_W }]
          : []),
    ]);
    setPinnedDoc(null);
    setDraft('');
    setThinking(false);
  }

  /**
   * P3 F-20 — run a Skill chip. Live API first (P4 quota engine meters it);
   * deterministic local fallback when offline. Result card is pinned to the
   * board next to its input (feature-specs: "pinned to canvas").
   */
  async function runSkillChip(skill: SkillMeta, input: { amount?: number; paymentType?: string; vendor?: string; purpose?: string; notice?: string }) {
    if (thinking) return;
    setThinking(true);
    let result: SkillResult | null = null;
    let upgradedTo: string | undefined;
    let blockedReason: string | undefined;
    try {
      const res = await fetch(`/api/v1/skills/${skill.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: me.tier || 'free', ...input }),
      });
      const data = await res.json();
      if (res.ok) {
        result = data.result as SkillResult;
        await refreshQuota(); // metered skill updates the live counters
      } else {
        upgradedTo = data.upgrade_to;
        blockedReason = data.error;
      }
    } catch {
      const local = runSkillLocal(skill.id, input, (me.tier || 'free') as Tier);
      if (local.ok) result = local.result;
      else blockedReason = local.reason;
    }

    const userText =
      skill.id === 'invoice-wht-check'
        ? `Check WHT on a ${input.paymentType ?? 'payment'} of ${input.amount ?? 0}`
        : skill.oneLiner;

    const o = spawnAnchor();
    const newCards: CanvasCard[] = [
      { id: nextId(), kind: 'user', content: userText, pos: { x: o.x, y: o.y }, width: USER_W },
    ];
    if (result) {
      newCards.push({ id: nextId(), kind: 'skill', content: skill.label, skill: result, pos: { x: o.x + GAP_X, y: o.y }, width: CARD_W, demoSeed: true });
    } else if (upgradedTo) {
      newCards.push({ id: nextId(), kind: 'wall', content: `${skill.label} — upgrade to ${upgradedTo}`, wall: { message: `${skill.label} requires the ${upgradedTo} tier.`, to: upgradedTo }, pos: { x: o.x + GAP_X, y: o.y }, width: CARD_W, demoSeed: true });
    } else if (blockedReason) {
      newCards.push({ id: nextId(), kind: 'wall', content: `${skill.label} — ${blockedReason}`, wall: { message: blockedReason, to: 'plus' }, pos: { x: o.x + GAP_X, y: o.y }, width: CARD_W, demoSeed: true });
    }
    setCards((prev) => [...prev, ...newCards]);
    setThinking(false);
  }

  /** P6 F-18 / scope 11 — share the canvas: a read-only link card is pinned
   *  to the board (free tier → upgrade wall card instead). */
  async function shareCanvas() {
    const o = spawnAnchor();
    const base: Omit<CanvasCard, 'id' | 'kind'> = {
      content: 'Shared canvas',
      pos: { x: o.x, y: o.y },
      width: USER_W,
      demoSeed: true,
    };
    try {
      const res = await fetch('/api/v1/collab/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: me.tier || 'free', access: 'view' }),
      });
      const data = await res.json();
      const linkCard: CanvasCard = {
        ...base,
        id: nextId(),
        kind: res.ok ? 'share' : 'wall',
        shareLink: res.ok
          ? { url: String(data.url), access: 'view', ok: true }
          : { url: '', access: '', ok: false, upgradeTo: data.upgradeTo },
      };
      if (!res.ok) linkCard.content = `Sharing is a paid feature — upgrade to ${data.upgradeTo ?? 'Plus'}`;
      setCards((prev) => [...prev, linkCard]);
    } catch {
      setCards((prev) => [
        ...prev,
        { ...base, id: nextId(), kind: 'share', content: 'Shared canvas (offline)', shareLink: { url: '/share/share_7f3a9c', access: 'view', ok: true } },
      ]);
    }
  }

  /** New chat: clear the stage, keep the greeting anchor. */
  function newChat() {
    setCards([{ id: nextId(), kind: 'answer', content: t('greeting'), sources: [t('demoNta')], pos: { x: 60, y: 40 }, width: CARD_W }]);
    setPinnedDoc(null);
    setCam({ x: 40, y: 40, z: 1 });
    batchRef.current = 0;
  }

  /** P8 — pin a live document into the next turn's context (labeled on the answer). */
  function attach(doc: LiveDoc) {
    setPinnedDoc((prev) => (prev?.id === doc.id ? null : doc));
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || thinking) return;
    setThinking(true);
    void ask(text);
  }

  // ————————————————————————————————————————————————————————————
  // Render
  // ————————————————————————————————————————————————————————————

  const dotSize = 24 * cam.z;
  const zPct = Math.round(cam.z * 100);
  const thinkingPos = thinkingPosFor(cam, viewportSize.w, viewportSize.h);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-[560px]">
      {/* Canvas header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2">
            <Sparkles size={20} className="text-brand-action" aria-hidden />
            {t('title')}
            <Badge variant="info">canvas</Badge>
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {t('threadHint')}{' '}
            <Link href="/marketplace" className="text-brand-primary font-semibold hover:underline">
              {t('findPro')}
            </Link>
          </p>
        </div>
        <div className="board-ui-chrome flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          <LanguageSwitcher className="shrink-0" />
          <Button variant="secondary" size="sm" className="shrink-0" onClick={() => void shareCanvas()}>
            <Share2 size={14} /> {t('share')}
          </Button>
          <Button variant="secondary" size="sm" className="shrink-0" onClick={newChat}>
            <Link2 size={14} /> {t('newChat')}
          </Button>
        </div>
      </div>

      {/* ── The board: pannable/zoomable stage with positioned cards ── */}
      <div className="relative flex-1 min-h-0">
        {/* Stage viewport */}
        <div
          ref={viewportRef}
          className="absolute inset-0 overflow-hidden rounded-card border border-border-subtle bg-surface-inset/40 cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={onStagePointerDown}
          onPointerMove={onStagePointerMove}
          onPointerUp={onStagePointerUp}
          onPointerCancel={onStagePointerUp}
          role="application"
          aria-label="Infinite canvas board"
        >
          {/* Dot-grid that parallax-shifts with the camera */}
          <div
            data-canvas-bg
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--color-border-default) 1px, transparent 1px)',
              backgroundSize: `${dotSize}px ${dotSize}px`,
              backgroundPosition: `${cam.x}px ${cam.y}px`,
              opacity: 0.55,
            }}
          />
          {/* World (transformed card layer) */}
          <div
            className="absolute top-0 left-0"
            style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transformOrigin: '0 0' }}
          >
            {cards.map((card) => (
              <BoardCard key={card.id} card={card} t={t} td={td} onDragStart={startCardDrag} />
            ))}
            {thinking && (
              <div
                data-board-card
                className="absolute w-[300px] rounded-card border border-border-default bg-surface-overlay p-4 shadow-card"
                style={thinkingPos}
              >
                <ThinkingIndicator t={t} />
              </div>
            )}
          </div>

          {/* Left undocked sidebar: library + connectors + credits (§3.2.2) */}
          <div className="board-ui-chrome absolute top-3 left-3 bottom-[132px] w-[248px] max-w-[46vw] z-10 flex flex-col gap-3 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => setLibraryOpen((v) => !v)}
              className="board-ui-chrome self-start flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn border border-border-default bg-surface-overlay text-[12px] font-medium text-text-secondary hover:text-text-primary cursor-pointer"
              aria-expanded={libraryOpen}
            >
              <BookOpen size={13} /> {t('chipsLabel')} · {library.length}
            </button>
            <AnimatePresence initial={false}>
              {libraryOpen && (
                <motion.div
                  key="rail"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col gap-3"
                >
                  {/* Live library — processed documents from the store (P8 exit 2) */}
                  <Card className="p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">Library · live</p>
                    <ul className="space-y-1.5 max-h-[26vh] overflow-y-auto pr-1">
                      {library.map((doc) => (
                        <li key={doc.id}>
                          <button
                            type="button"
                            onClick={() => attach(doc)}
                            title={`Attach ${doc.name}`}
                            aria-label={`Attach ${doc.name}`}
                            aria-pressed={pinnedDoc?.id === doc.id}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-btn border transition-colors text-left cursor-pointer group ${
                              pinnedDoc?.id === doc.id
                                ? 'border-brand-action bg-brand-action-bg/50'
                                : 'border-transparent hover:border-brand-primary-border hover:bg-brand-primary-bg/50'
                            }`}
                          >
                            <span className="w-8 h-8 rounded-lg bg-brand-primary-bg text-brand-primary grid place-items-center shrink-0">
                              <FileText size={14} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[12px] font-medium text-text-primary truncate">{doc.name}</span>
                              <span className="block text-[10px] text-text-muted truncate">
                                {doc.status === 'needs-review' ? 'Review' : 'Extracted'}
                                {doc.amount != null ? ` · ${fmtNaira(doc.amount)}` : ''}
                                {doc.category ? ` · ${doc.category}` : ''}
                              </span>
                            </span>
                            {pinnedDoc?.id === doc.id ? (
                              <Check size={14} className="text-brand-action shrink-0" />
                            ) : (
                              <Plus size={14} className="text-text-muted group-hover:text-brand-primary shrink-0" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <Link href="/dashboard/documents/upload">
                      <Button variant="secondary" size="sm" fullWidth className="mt-3">
                        <Paperclip size={13} /> Upload
                      </Button>
                    </Link>
                  </Card>

                  {/* P8 — connected apps as prompt context (F-19) */}
                  {connectors.length > 0 && (
                    <Card className="p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                        <Zap size={11} className="text-brand-action" /> Connected context
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {connectors.map((c) => (
                          <span key={c.service} className="px-2 py-0.5 rounded-badge bg-surface-inset border border-border-subtle text-[10px] font-medium text-text-secondary">
                            {c.displayName}
                          </span>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* P8 — live quota-in-canvas (real counters, demo_seed) */}
                  {quota && (
                    <Card className="p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Credits · {quota.tier}
                      </p>
                      <p className="text-[12px] text-text-secondary">
                        Chats today{' '}
                        <span className="font-semibold text-text-primary">
                          {quota.chats.today}
                          {quota.chats.cap !== -1 ? ` / ${quota.chats.cap}` : ''}
                        </span>
                        {' · '}
                        lifetime {quota.chats.lifetime}
                        {quota.chats.lifetimeCap !== -1 ? ` / ${quota.chats.lifetimeCap}` : ''}
                      </p>
                      {quota.upgradeHint && (
                        <p className="text-[11px] text-brand-action mt-1.5">{quota.upgradeHint.message}</p>
                      )}
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zoom chrome (bottom-right) */}
          <div className="board-ui-chrome absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-btn border border-border-default bg-surface-overlay p-1 shadow-card">
            <button type="button" onClick={() => zoomBy(1 / 1.25)} aria-label="Zoom out" className="w-7 h-7 grid place-items-center rounded text-text-secondary hover:text-text-primary hover:bg-surface-inset cursor-pointer">
              <Minus size={14} />
            </button>
            <button type="button" onClick={fitBoard} className="min-w-[46px] h-7 px-1.5 grid place-items-center rounded text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-inset cursor-pointer" title="Fit board">
              {zPct}%
            </button>
            <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in" className="w-7 h-7 grid place-items-center rounded text-text-secondary hover:text-text-primary hover:bg-surface-inset cursor-pointer">
              <Plus size={14} />
            </button>
            <button type="button" onClick={fitBoard} aria-label="Fit to board" className="w-7 h-7 grid place-items-center rounded text-text-secondary hover:text-text-primary hover:bg-surface-inset cursor-pointer">
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* ── Docked composer (Miro-style, floats beneath the board) ── */}
        <div className="board-ui-chrome absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[min(680px,calc(100%-56px))]">
          <form onSubmit={send} className="rounded-card border border-border-default bg-surface-overlay shadow-card p-3">
            {/* P3 F-20 — Skills v1 chip rail above the textarea */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted shrink-0 pr-1">{t('skillsLabel')}:</span>
              {SKILLS.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() =>
                    void runSkillChip(skill, {
                      ...(skill.id === 'invoice-wht-check'
                        ? { amount: 240_000, paymentType: 'Goods / services' }
                        : skill.id === 'wht-recovery'
                          ? { vendor: 'Zenith Supplies Ltd' }
                          : {}),
                    })
                  }
                  title={skill.oneLiner}
                  disabled={thinking}
                  className="shrink-0 px-3 py-1.5 rounded-full border border-border-subtle bg-surface-raised text-[12px] font-medium text-text-secondary hover:text-text-primary hover:border-brand-primary-border transition-colors cursor-pointer disabled:opacity-50"
                >
                  {skill.label}
                  <span className="ml-1.5 text-[10px] text-text-muted">· {skill.costCredits}cr</span>
                </button>
              ))}
            </div>
            {/* Pinned document chip (attach-into-canvas, §3.2.3) */}
            {pinnedDoc && (
              <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-btn border border-brand-action-border bg-brand-action-bg">
                <Paperclip size={12} className="text-brand-action shrink-0" />
                <span className="min-w-0 flex-1 text-[11px] text-text-secondary truncate">{pinnedDoc.name}</span>
                <button type="button" onClick={() => setPinnedDoc(null)} aria-label="Unpin document" className="text-text-muted hover:text-text-primary cursor-pointer">
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2.5">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t('placeholder')}
                aria-label={t('placeholder')}
                className="flex-1 h-11 rounded-btn bg-surface-base border border-border-strong px-4 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-colors"
              />
              <Button type="submit" variant="primary" size="lg" aria-label={t('send')} disabled={thinking}>
                {thinking ? <Crosshair size={15} className="animate-pulse" /> : <Send size={15} />}
                <span className="hidden sm:inline">{t('send')}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Transient thinking indicator position: view centre (world coords), lifted
 *  above the docked composer. */
function thinkingPosFor(cam: { x: number; y: number; z: number }, vw: number, vh: number): { left: number; top: number } {
  const cx = (vw / 2 - cam.x) / cam.z;
  const cy = (vh / 2 - cam.y) / cam.z - 80 / cam.z;
  return { left: cx - 150, top: cy - 120 };
}

/** Transient "agent is thinking" card — spawned at view centre while a turn runs. */
function ThinkingIndicator({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex items-start gap-2.5" aria-live="polite">
      <span className="w-7 h-7 rounded-full bg-brand-primary text-text-inverse grid place-items-center shrink-0">
        <Bot size={13} />
      </span>
      <div className="min-w-[220px]">
        <span className="text-sm text-text-muted flex items-center gap-2">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse [animation-delay:300ms]" />
          </span>
          {t('thinkingHint')}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BoardCard — one positioned card on the stage (draggable via its top bar)
// ---------------------------------------------------------------------------

function BoardCard({
  card,
  t,
  td,
  onDragStart,
}: {
  card: CanvasCard;
  t: ReturnType<typeof useTranslations>;
  td: ReturnType<typeof useTranslations>;
  onDragStart: (e: React.PointerEvent, card: CanvasCard) => void;
}) {
  const frame = (children: React.ReactNode, cls: string) => (
    <div
      data-board-card
      className={`absolute rounded-card shadow-card ${cls}`}
      style={{ left: card.pos.x, top: card.pos.y, width: card.width }}
    >
      {/* Drag handle bar */}
      <div
        onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart(e, card);
        }}
        className="flex items-center gap-1.5 px-3.5 pt-2.5 cursor-move active:cursor-grabbing"
        title="Drag to move on the board"
      >
        <span className="flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-border-strong" />
          <span className="w-1 h-1 rounded-full bg-border-strong" />
          <span className="w-1 h-1 rounded-full bg-border-strong" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {card.kind === 'user' ? 'You' : card.kind === 'answer' ? 'Agent' : card.kind === 'filing' ? 'Filing' : card.kind === 'referral' ? 'Referral' : card.kind === 'skill' ? 'Skill' : card.kind === 'wall' ? 'Limit' : card.kind === 'share' ? 'Share' : 'Card'}
        </span>
      </div>
      <div className="px-3.5 pb-3.5 pt-1.5">{children}</div>
    </div>
  );

  if (card.kind === 'user') {
    return frame(
      <div>
        <div className="text-sm leading-relaxed text-text-primary">{card.content}</div>
        {card.attachedDoc && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-text-muted">
            <Paperclip size={11} /> {card.attachedDoc.name}
          </span>
        )}
      </div>,
      'border border-border-default bg-surface-raised'
    );
  }
  if (card.kind === 'wall') {
    return frame(
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-action mb-2 flex items-center gap-1.5">
          <ShieldCheck size={13} /> Free limit reached
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">{card.wall?.message ?? card.content}</p>
        <div className="mt-3 flex items-center gap-2">
          <Link href="/pricing">
            <Button variant="primary" size="sm">
              Upgrade to {card.wall?.to === 'plus' ? 'Plus' : card.wall?.to}
            </Button>
          </Link>
          <span className="text-[10px] text-text-muted">demo_seed · mocked billing</span>
        </div>
      </div>,
      'border border-brand-action-border bg-brand-action-bg'
    );
  }
  if (card.kind === 'share') {
    const s = card.shareLink;
    if (!s?.ok) {
      return frame(
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-action mb-2 flex items-center gap-1.5">
            <Lock size={13} /> Paid feature
          </p>
          <p className="text-sm text-text-secondary">{card.content}</p>
          <div className="mt-3">
            <Link href="/pricing">
              <Button variant="primary" size="sm">Upgrade</Button>
            </Link>
          </div>
        </div>,
        'border border-brand-action-border bg-brand-action-bg'
      );
    }
    return frame(
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary mb-2 flex items-center gap-1.5">
          <Share2 size={13} /> Read-only link ({s.access})
        </p>
        <p className="text-[12px] font-mono text-text-secondary break-all">{s.url}</p>
        <div className="mt-3 flex items-center gap-2">
          <Link href={s.url} target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm">Open preview</Button>
          </Link>
          <span className="text-[10px] text-text-muted">signup CTA inside · demo_seed</span>
        </div>
      </div>,
      'border border-brand-primary-border bg-brand-primary-bg/40'
    );
  }
  if (card.kind === 'filing') {
    return frame(
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">Filing action</p>
        <ol className="space-y-2 mb-4">
          {FILING_STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-2.5 text-sm text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-brand-primary-bg text-brand-primary text-[10px] font-bold grid place-items-center">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => toast('Added to your 2025 filing', { description: 'Demo build — the filing draft now includes these figures.' })}>
            <Check size={14} /> Add to filing
          </Button>
          <Link href="/dashboard/tax-filing">
            <Button variant="ghost" size="sm">
              <Clock size={14} /> {td('continueFiling')}
            </Button>
          </Link>
        </div>
      </div>,
      'border border-border-default bg-surface-overlay'
    );
  }
  if (card.kind === 'referral') {
    const live = card.referral;
    return frame(
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={15} className="text-brand-action" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Verified pro</p>
          {live && (
            <span className="ml-auto text-[10px] text-text-muted">
              {live.contact.masked ? 'masked' : 'full contact'} · {live.contact.reason}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/avatars/avatar-01.png" alt="" width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-border-subtle" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary truncate">{live ? live.pro.name : card.content}</p>
            <p className="text-[11px] text-text-muted">
              {live ? `${live.pro.city}, ${live.pro.state}` : 'Lagos Island'} ·{' '}
              {live ? `${live.pro.rating} ★ (${live.pro.reviewCount})` : '4.9 ★ (127)'}
            </p>
          </div>
          <Link href={live ? `/marketplace/${live.pro.slug}` : '/marketplace/adaeze-consulting'} className="ml-auto shrink-0">
            <Badge variant="brand">View</Badge>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {live && live.contact.masked ? (
            <span className="text-[11px] text-text-muted">
              Phone <span className="text-text-primary font-medium">+234••• •••0••</span>
              <span className="ml-2">— full contact on Plus (₦5,000/mo) or a paid login</span>
            </span>
          ) : (
            <>
              <Link
                href={`tel:${(live?.contact.phone ?? '+2348011000001').replace(/[^+\d]/g, '')}`}
                aria-label="Call pro (demo)"
              >
                <Button variant="secondary" size="sm">
                  <Phone size={13} /> {live?.contact.phone ?? '+2348011000001'}
                </Button>
              </Link>
              <Link
                href={
                  live?.pro.slug
                    ? `/marketplace/${live.pro.slug}`
                    : `/marketplace/adaeze-consulting`
                }
                aria-label="Open pro profile (demo)"
              >
                <Button variant="secondary" size="sm">
                  <MessageCircle size={13} /> {live?.contact.whatsapp ?? 'WhatsApp'}
                </Button>
              </Link>
            </>
          )}
          <span className="text-[10px] text-text-muted self-center">{t('demoNote')}</span>
        </div>
      </div>,
      'border border-brand-action-border bg-brand-action-bg'
    );
  }
  if (card.kind === 'skill') {
    return frame(<SkillCardBody card={card} />, 'border border-brand-primary-border bg-brand-primary-bg/40');
  }
  // answer — agent markdown card
  return frame(<AnswerBody card={card} t={t} />, 'border border-border-default bg-surface-overlay');
}
