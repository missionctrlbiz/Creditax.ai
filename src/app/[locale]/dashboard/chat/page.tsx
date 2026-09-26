'use client';

/**
 * P18 — /dashboard/chat rebuilt around the conversation first (user spec:
 * "a chat that docks to the sidebar after the first message").
 *
 *   • Empty state = centered hero composer (roles-and-experience.md §3.1
 *     empty-state composer, demo beat 1–2).
 *   • After the first message the chat DOCKS into a left sidebar: a real
 *     agent thread (user ↔ agent messages with sources + honesty badge) with
 *     the composer pinned beneath it (§3.2.1 "single agent thread").
 *   • The canvas holds ARTIFACTS only — skill results, verified-pro
 *     referrals, filing actions, share links — auto-arranged in a clean grid
 *     and tagged with the turn that produced them. Plain answers stay in the
 *     thread; nothing dumps onto the board uninvited.
 *   • Multi-turn is real: the POST carries the server conversationId so the
 *     P1 history store grounds every follow-up (chat route P1).
 *   • The agent answers from the live LLM + RAG pipeline (P13); when no
 *     provider is reachable the server's offline synthesizer answers and the
 *     message is honestly badged "demo answer".
 */

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  Check,
  Clock,
  FileText,
  LayoutDashboard,
  Paperclip,
  Phone,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  SquarePen,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
// Data model — a thread of messages + a board of artifacts
// ---------------------------------------------------------------------------

type ThreadMsg =
  | {
      id: string;
      role: 'user';
      turn: number;
      text: string;
      doc?: LiveDoc;
    }
  | {
      id: string;
      role: 'agent';
      turn: number;
      text: string;
      sources: string[];
      demoSeed: boolean;
      /** Titles of artifacts this turn pinned to the canvas. */
      pinned: string[];
    }
  | {
      id: string;
      role: 'wall';
      turn: number;
      message: string;
      to: string;
    };

type Artifact =
  | { id: string; turn: number; kind: 'skill'; label: string; skill: SkillResult; demoSeed: boolean }
  | { id: string; turn: number; kind: 'referral'; referral: ReferralCard }
  | { id: string; turn: number; kind: 'filing' }
  | {
      id: string;
      turn: number;
      kind: 'share';
      shareLink: { url: string; access: string; ok: boolean; upgradeTo?: string };
    };

/** P8 — a *live* processed document from the store. */
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

/** A filing-action artifact only lands when the question is about filing —
 *  a plain "what is the VAT rate" never spawns one (P18 fix). */
const FILING_INTENT = /\b(fil(e|ed|ing)|returns?|submit|deadline|annual|assess)\b/i;

const FILING_STEPS = ['Review figures', 'Attach documents', 'Add to 2025 filing'];

/** Unique citations, capped — retrieval often returns overlapping chunks of
 *  the same document and the old card rendered the same source twice. */
function dedupeSources(sources: string[]): string[] {
  return [...new Set(sources)].slice(0, 4);
}

// ---------------------------------------------------------------------------
// Skill result bodies (shared by artifact cards)
// ---------------------------------------------------------------------------

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

/** Agent markdown (thread message body). */
function AgentMarkdown({ text }: { text: string }) {
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
            <div className="overflow-x-auto my-2">
              <table className="text-[13px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left px-3 py-1.5 border-b border-border-default text-text-muted font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-3 py-1.5 border-b border-border-subtle text-text-secondary">{children}</td>,
        }}
      >
        {text}
      </ReactMarkdown>
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

  const [messages, setMessages] = useState<ThreadMsg[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [pinnedDoc, setPinnedDoc] = useState<LiveDoc | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // — P8 data hydration —
  const [me, setMe] = useState<Me>({ userId: 'u-consumer', tier: 'free', email: '', name: '', loggedIn: false });
  const [library, setLibrary] = useState<LiveDoc[]>([]);
  const [quota, setQuota] = useState<LiveQuota | null>(null);
  const [connectors, setConnectors] = useState<ConnectorChip[]>([]);

  const idRef = useRef(0);
  const nextId = () => `m${++idRef.current}`;
  const threadRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const autoAskedRef = useRef(false);

  const docked = messages.length > 0;

  // — P8: resolve the signed-in demo account (pb-auth with mock fallback). —
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

  // §3.1 dashboard-first composer handoff: /dashboard/chat?q=… auto-asks the
  // question once (read from window.location so no Suspense boundary needed).
  // The one-shot guard is set inside the rAF (StrictMode double-mounts run
  // this effect twice; cancelling the frame there would swallow the ask).
  useEffect(() => {
    if (autoAskedRef.current || thinking) return;
    const q = new URLSearchParams(window.location.search).get('q')?.trim();
    if (!q || !me.userId) return;
    requestAnimationFrame(() => {
      if (autoAskedRef.current) return;
      autoAskedRef.current = true;
      // Strip the query from the URL so a refresh doesn't re-ask it.
      window.history.replaceState({}, '', window.location.pathname);
      setThinking(true);
      void ask(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.userId]);

  // Keep the newest message + artifact in view.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, thinking]);
  useEffect(() => {
    if (artifacts.length > 0) {
      canvasRef.current?.scrollTo({ top: canvasRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [artifacts.length]);

  // Close the attach popover on outside click / Escape.
  useEffect(() => {
    if (!attachOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!attachRef.current?.contains(e.target as Node)) setAttachOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAttachOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [attachOpen]);

  // ————————————————————————————————————————————————————————————
  // Actions
  // ————————————————————————————————————————————————————————————

  /**
   * Ask the grounded agent. The POST carries {userId, locale, tier, docId,
   * conversationId} so the server meters the turn (403 → wall in the thread)
   * and multi-turn history is real. The answer stays IN THE THREAD; only
   * genuine artifacts (filing intent, referral) pin to the canvas.
   */
  async function ask(text: string) {
    const doc = pinnedDoc;
    const turn = turnCount + 1;
    setTurnCount(turn);
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', turn, text, doc: doc ?? undefined }]);

    let answer: string | null = null;
    let sources: string[] = [];
    let demoSeed = true;
    let liveConfidence: number | undefined;
    let blocked: { message: string; to: string } | null = null;

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
          conversationId,
        }),
      });
      if (res.status === 403) {
        const data = (await res.json().catch(() => ({}))) as {
          status?: LiveQuota;
          upgrade?: { to: string; message: string } | null;
        };
        blocked = {
          message: data.upgrade?.message ?? 'You have hit your free limit.',
          to: data.upgrade?.to ?? 'plus',
        };
        if (data.status) setQuota(data.status);
      } else if (res.ok) {
        const data = (await res.json()) as {
          answer?: string;
          citations?: string[];
          confidence?: number;
          demo_seed?: boolean;
          conversationId?: string | null;
        };
        if (data.answer) {
          answer = data.answer;
          sources = dedupeSources(data.citations ?? []);
          demoSeed = !!data.demo_seed;
          liveConfidence = data.confidence;
        }
        if (data.conversationId) setConversationId(data.conversationId);
        await refreshQuota();
      }
    } catch {
      toast.error(t('errorNetwork'));
      setThinking(false);
      setPinnedDoc(null);
      return;
    }

    if (blocked) {
      setMessages((prev) => [...prev, { id: nextId(), role: 'wall', turn, message: blocked.message, to: blocked.to }]);
      setPinnedDoc(null);
      setDraft('');
      setThinking(false);
      return;
    }

    // No live answer (and no server fallback body) — keep the turn honest.
    if (!answer) {
      toast.error(t('errorNetwork'));
      setThinking(false);
      setPinnedDoc(null);
      return;
    }

    // Artifacts ONLY when they genuinely apply to this turn.
    const newArtifacts: Artifact[] = [];
    const pinned: string[] = [];

    if (FILING_INTENT.test(text)) {
      newArtifacts.push({ id: nextId(), turn, kind: 'filing' });
      pinned.push(t('filingAction'));
    }

    const referral = buildReferralCard({
      text,
      confidence: liveConfidence,
      tier: (me.tier || 'free') as Tier,
      loggedIn: me.loggedIn,
    });
    if (referral) {
      newArtifacts.push({ id: nextId(), turn, kind: 'referral', referral });
      pinned.push(t('verifiedPro'));
    }

    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: 'agent',
        turn,
        text: answer,
        sources,
        demoSeed,
        pinned,
      },
    ]);
    if (newArtifacts.length > 0) setArtifacts((prev) => [...prev, ...newArtifacts]);
    setPinnedDoc(null);
    setDraft('');
    setThinking(false);
  }

  /**
   * P3 F-20 — run a Skill chip. Live API first (P4 quota engine meters it);
   * deterministic local fallback when offline. The result card pins to the
   * canvas; the thread records the run.
   */
  async function runSkillChip(skill: SkillMeta, input: { amount?: number; paymentType?: string; vendor?: string; purpose?: string; notice?: string }) {
    if (thinking) return;
    setThinking(true);
    const turn = turnCount + 1;
    setTurnCount(turn);
    const userText = `${skill.label} — ${skill.oneLiner}`;
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', turn, text: userText }]);

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

    if (upgradedTo || blockedReason) {
      const to = upgradedTo ?? 'plus';
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'wall',
          turn,
          message: blockedReason ?? `${skill.label} requires the ${to} tier.`,
          to,
        },
      ]);
    } else if (result) {
      setArtifacts((prev) => [...prev, { id: nextId(), turn, kind: 'skill', label: skill.label, skill: result, demoSeed: true }]);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'agent',
          turn,
          text: `**${skill.label}** — ${t('pinnedToCanvas')}.`,
          sources: [],
          demoSeed: true,
          pinned: [skill.label],
        },
      ]);
    }
    setThinking(false);
  }

  /** P6 F-18 — share the canvas: a read-only link artifact pins to the board
   *  (free tier → upgrade wall in the thread instead). */
  async function shareCanvas() {
    try {
      const res = await fetch('/api/v1/collab/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: me.tier || 'free', access: 'view' }),
      });
      const data = await res.json();
      if (res.ok) {
        setArtifacts((prev) => [
          ...prev,
          {
            id: nextId(),
            turn: turnCount || 1,
            kind: 'share',
            shareLink: { url: String(data.url), access: 'view', ok: true },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'wall',
            turn: turnCount || 1,
            message: data.error ?? `Sharing is a paid feature — upgrade to ${data.upgradeTo ?? 'Plus'}.`,
            to: data.upgradeTo ?? 'plus',
          },
        ]);
      }
    } catch {
      setArtifacts((prev) => [
        ...prev,
        {
          id: nextId(),
          turn: turnCount || 1,
          kind: 'share',
          shareLink: { url: '/share/share_7f3a9c', access: 'view', ok: true },
        },
      ]);
    }
  }

  /** New chat: back to the hero composer with a clean board. */
  function newChat() {
    setMessages([]);
    setArtifacts([]);
    setTurnCount(0);
    setConversationId(null);
    setPinnedDoc(null);
    setDraft('');
  }

  /** P8 — pin a live document into the next turn's context. */
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
  // Composer (shared hero + dock)
  // ————————————————————————————————————————————————————————————

  const composer = (compact: boolean) => (
    <form onSubmit={send} className="rounded-card border border-border-default bg-surface-overlay shadow-card p-3">
      {/* P3 F-20 — Skills chip rail */}
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
        {/* Attach popover trigger — library lives here, not floating over cards */}
        <div className="relative shrink-0" ref={attachRef}>
          <Button
            type="button"
            variant="ghost"
            size={compact ? 'sm' : 'md'}
            aria-label={t('attach')}
            title={t('attach')}
            aria-expanded={attachOpen}
            onClick={() => setAttachOpen((v) => !v)}
            className={pinnedDoc ? 'border-brand-action-border text-brand-action' : undefined}
          >
            <Paperclip size={compact ? 13 : 15} />
          </Button>
          <AnimatePresence>
            {attachOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute bottom-full mb-2 left-0 w-[300px] max-w-[80vw] z-30 rounded-card border border-border-default bg-surface-overlay shadow-modal p-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">{t('library')} · {library.length}</p>
                <ul className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                  {library.map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        onClick={() => attach(doc)}
                        title={t('attach')}
                        aria-label={`${t('attach')}: ${doc.name}`}
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
                  {library.length === 0 && <li className="text-[12px] text-text-muted py-2">—</li>}
                </ul>
                {connectors.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border-subtle">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">{t('connectedContext')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {connectors.map((c) => (
                        <span key={c.service} className="px-2 py-0.5 rounded-badge bg-surface-inset border border-border-subtle text-[10px] font-medium text-text-secondary">
                          {c.displayName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Link href="/dashboard/documents/upload" className="block mt-3">
                  <Button variant="secondary" size="sm" fullWidth>
                    <Paperclip size={13} /> {t('upload')}
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
          className="flex-1 min-w-0 h-10 rounded-btn bg-surface-base border border-border-strong px-4 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-colors"
        />
        <Button type="submit" variant="primary" size={compact ? 'sm' : 'md'} aria-label={t('send')} disabled={thinking}>
          {thinking ? <Sparkles size={14} className="animate-pulse" /> : <Send size={14} />}
          <span className="hidden sm:inline">{t('send')}</span>
        </Button>
      </div>
    </form>
  );

  /** Live-quota line under the docked composer (pricing §4: the lifetime bar
   *  is "shown to nudge conversion" — render it, not just the numbers). */
  const quotaLine = quota && (
    <div className="mt-2 px-1">
      <p className="text-[11px] text-text-muted">
        {t('chatsToday')}{' '}
        <span className="font-semibold text-text-secondary">
          {quota.chats.today}
          {quota.chats.cap !== -1 ? ` / ${quota.chats.cap}` : ''}
        </span>{' '}
        · {t('lifetime')} {quota.chats.lifetime}
        {quota.chats.lifetimeCap !== -1 ? ` / ${quota.chats.lifetimeCap}` : ''} · {quota.tier}
        {quota.upgradeHint && <span className="text-brand-action"> — {quota.upgradeHint.message}</span>}
      </p>
      {quota.chats.lifetimeCap !== -1 && (
        <div className="mt-1.5 h-1 rounded-full bg-surface-inset overflow-hidden" title={`${quota.chats.lifetime} / ${quota.chats.lifetimeCap}`}>
          <div
            className="h-full rounded-full bg-brand-action transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.round((quota.chats.lifetime / quota.chats.lifetimeCap) * 100))}%` }}
          />
        </div>
      )}
    </div>
  );

  // ————————————————————————————————————————————————————————————
  // Render
  // ————————————————————————————————————————————————————————————

  return (
    <div className={`flex ${docked ? 'flex-col lg:flex-row' : 'flex-col'} gap-4 h-[calc(100vh-7rem)] min-h-[540px]`}>
      {/* ── Docked chat sidebar (after the first message) ── */}
      {docked && (
        <aside className="w-full lg:w-[380px] shrink-0 lg:border-r lg:border-border-subtle lg:pr-4 flex flex-col min-h-0" aria-label={t('title')}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-full bg-brand-primary text-text-inverse grid place-items-center shrink-0">
                <Bot size={15} />
              </span>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-text-primary truncate">{t('title')}</h1>
                <p className="text-[11px] text-text-muted truncate">{t('threadHint')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button variant="ghost" size="sm" onClick={newChat} title={t('newChat')} aria-label={t('newChat')}>
                <SquarePen size={14} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => void shareCanvas()}>
                <Share2 size={13} /> <span className="hidden xl:inline">{t('share')}</span>
              </Button>
            </div>
          </div>

          {/* Thread */}
          <div ref={threadRef} className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3" aria-live="polite">
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-card border border-brand-primary-border bg-brand-primary-bg/60 px-3.5 py-2.5">
                    {m.doc && (
                      <span className="mb-1.5 inline-flex items-center gap-1 text-[10px] text-text-muted">
                        <Paperclip size={10} /> {m.doc.name}
                      </span>
                    )}
                    <p className="text-sm leading-relaxed text-text-primary">{m.text}</p>
                  </div>
                </div>
              ) : m.role === 'agent' ? (
                <div key={m.id} className="flex justify-start">
                  <div className="max-w-[92%] rounded-card border border-border-default bg-surface-overlay px-3.5 py-3">
                    <AgentMarkdown text={m.text} />
                    {m.pinned.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {m.pinned.map((p) => (
                          <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-brand-action-bg border border-brand-action-border text-[10px] font-medium text-text-secondary">
                            <LayoutDashboard size={10} className="text-brand-action" /> {p}
                          </span>
                        ))}
                        <span className="text-[10px] text-text-muted">{t('pinnedToCanvas')}</span>
                      </div>
                    )}
                    {(m.sources.length > 0 || m.demoSeed) && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2.5 pt-2.5 border-t border-border-subtle">
                        {m.sources.length > 0 && (
                          <>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{t('sources')}:</span>
                            {m.sources.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-badge bg-brand-primary-bg text-brand-primary text-[10px] font-medium">
                                {s}
                              </span>
                            ))}
                          </>
                        )}
                        {m.demoSeed && (
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
                </div>
              ) : (
                // Quota upgrade wall — rendered in the thread, not on the board
                <div key={m.id} className="rounded-card border border-brand-action-border bg-brand-action-bg px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-action mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck size={13} /> {t('freeLimitReached')}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">{m.message}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Link href="/pricing">
                      <Button variant="primary" size="sm">
                        {t('upgradeTo', { tier: m.to === 'plus' ? 'Plus' : m.to })}
                      </Button>
                    </Link>
                    <span className="text-[10px] text-text-muted">{t('demoBilling')}</span>
                  </div>
                </div>
              )
            )}
            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-card border border-border-default bg-surface-overlay px-3.5 py-3" aria-live="polite">
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
            )}
          </div>

          {/* Composer pinned beneath the thread */}
          <div className="pt-3">
            {composer(true)}
            {quotaLine}
          </div>
        </aside>
      )}

      {/* ── Hero state: centered composer before the first message ── */}
      {!docked && (
        <section className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="max-w-xl">
            <h1 className="flex items-center justify-center gap-2.5 text-2xl sm:text-3xl font-bold text-text-primary">
              <Sparkles size={24} className="text-brand-action" aria-hidden />
              {t('title')}
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              {t('threadHint')}{' '}
              <Link href="/marketplace" className="text-brand-primary font-semibold hover:underline">
                {t('findPro')}
              </Link>
            </p>
          </div>
          <div className="w-full max-w-[640px]">{composer(false)}</div>
          {quotaLine}
          <p className="text-[11px] text-text-muted max-w-md">{t('emptyHint')}</p>
        </section>
      )}

      {/* ── Canvas: artifacts only, auto-arranged (docked state) ── */}
      {docked && (
        <section className="flex-1 min-w-0 flex flex-col min-h-0" aria-label={t('canvas')}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <LayoutDashboard size={15} className="text-brand-action" aria-hidden />
              {t('canvas')}
              <Badge variant="info">{artifacts.length}</Badge>
            </h2>
          </div>
          <div
            ref={canvasRef}
            data-canvas-bg
            className="flex-1 min-h-0 overflow-y-auto rounded-card border border-border-subtle bg-surface-inset/40 p-4"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--color-border-default) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            {artifacts.length === 0 ? (
              <div className="h-full min-h-[240px] grid place-items-center">
                <p className="text-[13px] text-text-muted text-center max-w-xs">{t('canvasEmpty')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 items-start">
                <AnimatePresence initial={false}>
                  {artifacts.map((a) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                    >
                      <ArtifactCard artifact={a} t={t} td={td} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArtifactCard — skill results, referrals, filing actions, share links
// ---------------------------------------------------------------------------

function ArtifactCard({
  artifact,
  t,
  td,
}: {
  artifact: Artifact;
  t: ReturnType<typeof useTranslations>;
  td: ReturnType<typeof useTranslations>;
}) {
  const head = (icon: React.ReactNode, label: string, accent: string) => (
    <div className="flex items-center gap-2 mb-3">
      <span className={accent}>{icon}</span>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <Badge variant="brand" className="ml-auto shrink-0">
        {t('turn', { n: artifact.turn })}
      </Badge>
    </div>
  );

  if (artifact.kind === 'skill') {
    return (
      <Card className="p-4" accent="teal">
        {head(<Sparkles size={13} />, artifact.label, 'text-brand-primary')}
        {renderSkillBody(artifact.skill)}
        {artifact.demoSeed && (
          <p className="text-[10px] text-text-muted mt-2">demo_seed · output is illustrative, not live data</p>
        )}
      </Card>
    );
  }

  if (artifact.kind === 'filing') {
    return (
      <Card className="p-4">
        {head(<Check size={13} />, t('filingAction'), 'text-brand-action')}
        <ol className="space-y-2 mb-4">
          {FILING_STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-2.5 text-sm text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-brand-primary-bg text-brand-primary text-[10px] font-bold grid place-items-center shrink-0">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => toast('Added to your 2025 filing', { description: 'Demo build — the filing draft now includes these figures.' })}>
            <Check size={14} /> {t('addToFiling')}
          </Button>
          <Link href="/dashboard/tax-filing">
            <Button variant="ghost" size="sm">
              <Clock size={14} /> {td('continueFiling')}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (artifact.kind === 'referral') {
    const live = artifact.referral;
    return (
      <Card className="p-4" accent="green">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={15} className="text-brand-action" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{t('verifiedPro')}</p>
          <Badge variant="brand" className="ml-auto shrink-0">
            {t('turn', { n: artifact.turn })}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/avatars/avatar-01.png" alt="" width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-border-subtle" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary truncate">{live.pro.name}</p>
            <p className="text-[11px] text-text-muted">
              {live.pro.city}, {live.pro.state} · {live.pro.rating} ★ ({live.pro.reviewCount})
            </p>
          </div>
          <Link href={`/marketplace/${live.pro.slug}`} className="shrink-0">
            <Button variant="secondary" size="sm">{t('viewProfile')}</Button>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {live.contact.masked ? (
            <span className="text-[11px] text-text-muted">
              <span className="text-text-primary font-medium">+234••• •••0••</span> — {t('maskedNote')}
            </span>
          ) : (
            live.contact.phone && (
              <Link href={`tel:${live.contact.phone.replace(/[^+\d]/g, '')}`} aria-label="Call pro (demo)">
                <Button variant="secondary" size="sm">
                  <Phone size={13} /> {live.contact.phone}
                </Button>
              </Link>
            )
          )}
          <span className="text-[10px] text-text-muted">{t('demoNote')}</span>
        </div>
      </Card>
    );
  }

  // share
  const s = artifact.shareLink;
  return (
    <Card className="p-4" accent="teal">
      {head(<Share2 size={13} />, `${t('share')} · ${s.access}`, 'text-brand-primary')}
      <p className="text-[12px] font-mono text-text-secondary break-all">{s.url}</p>
      <div className="mt-3 flex items-center gap-2">
        <Link href={s.url} target="_blank" rel="noreferrer">
          <Button variant="secondary" size="sm">{t('openPreview')}</Button>
        </Link>
        <span className="text-[10px] text-text-muted">demo_seed</span>
      </div>
    </Card>
  );
}
