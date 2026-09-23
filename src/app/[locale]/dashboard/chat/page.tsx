'use client';

import { useState, useRef, type FormEvent } from 'react';
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
  FileText,
  Link2,
  MessageCircle,
  Paperclip,
  Phone,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { SKILLS, runSkill as runSkillLocal, type SkillMeta, type SkillResult } from '@/ai/skills';
import { buildReferralCard, type ReferralCard } from '@/ai/referral';
import { fmtNaira } from '@/ai/tax-rules';
import type {
  WhtRecoveryResult,
  TccResult,
  NoticeExplainerResult,
  InvoiceWhtResult,
} from '@/ai/skills';

interface CanvasCard {
  id: string;
  kind: 'user' | 'answer' | 'filing' | 'referral' | 'skill';
  content: string;
  sources?: string[];
  added?: boolean;
  /** How the answer was produced (P2 Track A honesty): live RAG vs offline fallback. */
  demoSeed?: boolean;
  /** P3 F-20: skill chip → canvas result card payload. */
  skill?: SkillResult;
  /** P3 F-09: live verified-pro referral (masked → revealed by tier). */
  referral?: ReferralCard;
}

interface LibraryDoc {
  id: string;
  name: string;
  meta: string;
  icon: 'pdf' | 'img' | 'sheet';
}

const LIBRARY: LibraryDoc[] = [
  { id: 'paye', name: 'PAYE_Certificate_2024.pdf', meta: 'Extracted · ₦4,800,000', icon: 'pdf' },
  { id: 'stmt', name: 'Bank_Statement_May2025.pdf', meta: 'Extracted · ₦2,400,000', icon: 'pdf' },
  { id: 'receipt', name: 'Generator_Fuel_Receipt.jpg', meta: 'Extracted · ₦180,000 · Operations', icon: 'img' },
  { id: 'vat', name: 'VAT_Invoice_Zenith_Jun2025.pdf', meta: 'Extracted · ₦620,500', icon: 'pdf' },
];

/** Markdown canned answers — render through react-markdown with citation chips. */
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

Your *PAYE_Certificate_2024.pdf* is in the library — attach it and I'll compute your relief.`,
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

For anything deeper, a verified pro on the [Marketplace](/marketplace) can help — I'll surface one below the answer.`;

const FALLBACK_SOURCES = ['Demo set'];

const FILING_STEPS = ['Review figures', 'Attach documents', 'Add to 2025 filing'];

/** P3 F-20 — render a Skill's fixed I/O contract as a pinned canvas card. */
function SkillCard({ card }: { card: CanvasCard }) {
  const s = card.skill;
  if (!s) {
    return (
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="self-start w-full max-w-[440px] rounded-card border border-border-default bg-surface-overlay p-4"
      >
        <p className="text-sm font-semibold text-text-primary">{card.content}</p>
        <p className="text-[11px] text-text-muted mt-1">This Skill needs more input — try the chat above.</p>
      </motion.div>
    );
  }
  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="self-start w-full max-w-[460px] rounded-card border border-brand-primary-border bg-brand-primary-bg/40 p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary mb-2">
        {card.content}
      </p>
      {renderSkillBody(s)}
      {s.demo_seed && (
        <p className="text-[10px] text-text-muted mt-2">demo_seed · output is illustrative, not live data</p>
      )}
    </motion.div>
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

export default function ChatCanvasPage() {
  const t = useTranslations('chat');
  const td = useTranslations('dashboard');
  const [cards, setCards] = useState<CanvasCard[]>([
    {
      id: 'greeting',
      kind: 'answer',
      content: t('greeting'),
      sources: [t('demoNta')],
    },
  ]);
  const [draft, setDraft] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [thinking, setThinking] = useState(false);
  const locale = useLocale();
  const threadRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const nextId = () => `c${++idRef.current}`;

  function scrollThread() {
    requestAnimationFrame(() => {
      threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
    });
  }

  /**
   * P2: ask the grounded agent. Tries the live RAG endpoint first
   * (`/api/v1/chat`); if it is unreachable (offline demo), it falls back to
   * the CANNED set so the flow still completes. The answer card records how
   * it was produced (demoSeed) for the Track A honesty label.
   */
  async function ask(text: string, opts: { referral?: boolean } = {}) {
    const lower = text.toLowerCase();
    const hit = CANNED.find((c) => c.match.some((m) => lower.includes(m)));
    const canned: { reply: string; sources: string[]; referral?: boolean } = hit
      ? hit
      : { reply: FALLBACK, sources: FALLBACK_SOURCES, referral: true };

    let reply = canned;
    let demoSeed = true;
    let liveConfidence: number | undefined;

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, locale }),
      });
      if (res.ok) {
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
      }
    } catch {
      // Network down — keep the canned fallback so the demo never dead-ends.
    }

    const answer: CanvasCard = {
      id: nextId(),
      kind: 'answer',
      content: reply.reply,
      sources: reply.sources,
      demoSeed,
    };

    // P3 F-09 — live verified-pro referral. Explicit intent (opts/canned) or a
    // detected high-stakes / low-confidence question surfaces a verified pro.
    const explicit = opts.referral || reply.referral;
    const detected = !explicit && buildReferralCard({ text, confidence: liveConfidence, tier: 'free' }) !== null;
    const liveReferral = explicit || detected ? buildReferralCard({ text, confidence: liveConfidence, tier: 'free' }) : null;

    setCards((prev) => [
      ...prev,
      { id: nextId(), kind: 'user', content: text },
      answer,
      // Filing settings & actions surface as a canvas card (roles-and-experience.md §3.2.4)
      { id: nextId(), kind: 'filing', content: JSON.stringify(FILING_STEPS) },
      // Referral trigger (§3.2.5) — live card (masked for free tier) or static fallback
      ...(liveReferral
        ? [{ id: nextId(), kind: 'referral' as const, content: liveReferral.pro.name, referral: liveReferral }]
        : explicit
          ? [{ id: nextId(), kind: 'referral' as const, content: 'Adaeze Consulting Ltd' }]
          : []),
    ]);
    setDraft('');
    setThinking(false);
    scrollThread();
  }

  /**
   * P3 F-20 — run a Skill chip. Tries the live API first (so the P4 quota engine
   * can meter it later); falls back to the deterministic local module when the
   * network is down so the demo never dead-ends. Pushes a `skill` result card.
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
        body: JSON.stringify({ tier: 'free', ...input }),
      });
      const data = await res.json();
      if (res.ok) result = data.result as SkillResult;
      else {
        upgradedTo = data.upgrade_to;
        blockedReason = data.error;
      }
    } catch {
      // Offline — deterministic local run (same contract, demo_seed).
      const local = runSkillLocal(skill.id, input, 'free');
      if (local.ok) result = local.result;
      else blockedReason = local.reason;
    }

    const userText =
      skill.id === 'invoice-wht-check'
        ? `Check WHT on a ${input.paymentType ?? 'payment'} of ${input.amount ?? 0}`
        : skill.oneLiner;

    const newCards: CanvasCard[] = [{ id: nextId(), kind: 'user', content: userText }];
    if (result) {
      newCards.push({ id: nextId(), kind: 'skill', content: skill.label, skill: result, demoSeed: true });
    } else if (upgradedTo) {
      newCards.push({
        id: nextId(),
        kind: 'skill',
        content: `${skill.label} — upgrade required`,
        demoSeed: true,
      });
    } else if (blockedReason) {
      newCards.push({ id: nextId(), kind: 'skill', content: `${skill.label} — ${blockedReason}`, demoSeed: true });
    }
    setCards((prev) => [...prev, ...newCards]);
    setThinking(false);
    scrollThread();
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || thinking) return;
    setThinking(true);
    void ask(text);
  }

  function attach(doc: LibraryDoc) {
    if (thinking) return;
    setThinking(true);
    void ask(`Use ${doc.name} for this calculation.`, { referral: true });
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Canvas header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2">
            <Sparkles size={20} className="text-brand-action" aria-hidden />
            {t('title')}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {t('threadHint')}{' '}
            <Link href="/marketplace" className="text-brand-primary font-semibold hover:underline">
              {t('findPro')}
            </Link>
          </p>
        </div>
        {/* Share / invite / connect — scrollable, never clipped (T19) */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          <LanguageSwitcher className="shrink-0" />
          <Button variant="secondary" size="sm" className="shrink-0">
            <Share2 size={14} /> {t('share')}
          </Button>
          <Button variant="secondary" size="sm" className="shrink-0">
            <Link2 size={14} /> {t('newChat')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 flex-1 min-h-0">
        {/* ── Library sidebar: uploads + attach (canvas spec §3.2.2–3) ── */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLibraryOpen((v) => !v)}
            aria-expanded={libraryOpen}
          >
            <BookOpen size={14} /> {t('chipsLabel')} · {LIBRARY.length}
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {libraryOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className={`flex-col gap-3 ${libraryOpen ? 'flex' : 'hidden'} lg:flex`}
            >
              <Card className="p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Library
                </p>
                <ul className="space-y-1.5">
                  {LIBRARY.map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        onClick={() => attach(doc)}
                        title={`Attach ${doc.name}`}
                        aria-label={`Attach ${doc.name}`}
                        className="w-full flex items-center gap-2.5 p-2 rounded-btn border border-transparent hover:border-brand-primary-border hover:bg-brand-primary-bg/50 transition-colors text-left cursor-pointer group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-brand-primary-bg text-brand-primary grid place-items-center shrink-0">
                          <FileText size={14} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-medium text-text-primary truncate">
                            {doc.name}
                          </span>
                          <span className="block text-[10px] text-text-muted truncate">{doc.meta}</span>
                        </span>
                        <Plus size={14} className="text-text-muted group-hover:text-brand-primary shrink-0" />
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
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Canvas thread + docked composer (§3.2.1) ── */}
        <div className="flex flex-col min-h-0">
          <Card className="p-4 sm:p-5 flex-1 min-h-[380px] flex flex-col">
            <div ref={threadRef} className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
              {cards.map((card) => {
                if (card.kind === 'user') {
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="self-end max-w-[85%] flex items-start gap-2.5"
                    >
                      <div className="rounded-2xl rounded-br-md bg-brand-primary text-text-inverse px-4 py-3 text-sm leading-relaxed">
                        {card.content}
                        {card.content.startsWith('Use ') && (
                          <span className="ml-2 inline-flex items-center gap-1 text-[11px] opacity-80">
                            <Paperclip size={11} /> {t('demoNta')}
                          </span>
                        )}
                      </div>
                      <span className="w-7 h-7 rounded-full bg-surface-inset border border-border-default grid place-items-center shrink-0">
                        <User size={13} className="text-text-muted" />
                      </span>
                    </motion.div>
                  );
                }
                if (card.kind === 'filing') {
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="self-start w-full max-w-[420px] rounded-card border border-border-default bg-surface-overlay p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                        Filing action
                      </p>
                      <ol className="space-y-2 mb-4">
                        {FILING_STEPS.map((step, i) => (
                          <li key={step} className="flex items-center gap-2.5 text-sm text-text-secondary">
                            <span className="w-5 h-5 rounded-full bg-brand-primary-bg text-brand-primary text-[10px] font-bold grid place-items-center">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm">
                          <Check size={14} /> Add to filing
                        </Button>
                        <Link href="/dashboard/tax-filing">
                          <Button variant="ghost" size="sm">
                            <Clock size={14} /> {td('continueFiling')}
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                }
                if (card.kind === 'referral') {
                  const live = card.referral;
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="self-start w-full max-w-[440px] rounded-card border border-brand-action-border bg-brand-action-bg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={15} className="text-brand-action" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                          Verified pro
                        </p>
                        {live && (
                          <span className="ml-auto text-[10px] text-text-muted">
                            {live.contact.masked ? 'masked' : 'full contact'} · {live.contact.reason}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/avatars/avatar-01.png"
                          alt=""
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover border border-border-subtle"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {live ? live.pro.name : card.content}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {live ? `${live.pro.city}, ${live.pro.state}` : 'Lagos Island'} ·{' '}
                            {live ? `${live.pro.rating} ★ (${live.pro.reviewCount})` : '4.9 ★ (127)'}
                          </p>
                        </div>
                        <Link
                          href={live ? `/marketplace/${live.pro.slug}` : '/marketplace/adaeze-consulting'}
                          className="ml-auto shrink-0"
                        >
                          <Badge variant="brand">View</Badge>
                        </Link>
                      </div>
                      {/* Contact actions — masked for free tier, revealed for paid/login (F-09) */}
                      <div className="flex flex-wrap items-center gap-2">
                        {live && live.contact.masked ? (
                          <span className="text-[11px] text-text-muted">
                            Phone <span className="text-text-primary font-medium">+234••• •••0••</span>
                            <span className="ml-2">
                              — full contact on Plus (₦5,000/mo) or when logged in
                            </span>
                          </span>
                        ) : (
                          <>
                            <Button variant="secondary" size="sm" aria-label="Call pro (demo)">
                              <Phone size={13} /> {live?.contact.phone ?? '+2348011000001'}
                            </Button>
                            <Button variant="secondary" size="sm" aria-label="Message pro (demo)">
                              <MessageCircle size={13} /> {live?.contact.whatsapp ?? 'WhatsApp'}
                            </Button>
                          </>
                        )}
                        <span className="text-[10px] text-text-muted self-center">{t('demoNote')}</span>
                      </div>
                    </motion.div>
                  );
                }
                // P3 F-20 — Skill result card (canvas pinned output)
                if (card.kind === 'skill') {
                  return <SkillCard key={card.id} card={card} />;
                }
                // answer card — rich markdown
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="self-start max-w-[88%] flex items-start gap-2.5"
                  >
                    <span className="w-7 h-7 rounded-full bg-brand-primary text-text-inverse grid place-items-center shrink-0">
                      <Bot size={13} />
                    </span>
                    <div className="rounded-2xl rounded-bl-md bg-surface-overlay border border-border-default px-4 py-3">
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
                              <th className="text-left px-3 py-1.5 border-b border-border-default text-text-muted font-semibold">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-3 py-1.5 border-b border-border-subtle text-text-secondary">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {card.content}
                        </ReactMarkdown>
                      </div>
                      {card.sources && card.sources.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-border-subtle">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                            {t('sources')}:
                          </span>
                          {card.sources.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-badge bg-brand-primary-bg text-brand-primary text-[10px] font-medium"
                            >
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
                  </motion.div>
                );
              })}

              {thinking && (
                <div className="self-start flex items-start gap-2.5" aria-live="polite">
                  <span className="w-7 h-7 rounded-full bg-brand-primary text-text-inverse grid place-items-center shrink-0">
                    <Bot size={13} />
                  </span>
                  <div className="rounded-2xl rounded-bl-md bg-surface-overlay border border-border-default px-4 py-3">
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

            {/* Composer — always reachable, docked beneath the canvas */}
            <form onSubmit={send} className="mt-4 pt-4 border-t border-border-subtle">
              {/* P3 F-20 — Skills v1 chip rail (replaces the 4 static quick-asks).
                  Tapping a skill runs it immediately with its demo-seed inputs
                  (feature-specs demo beats); each has a credit cost + tier gate. */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted shrink-0 pr-1">
                  {t('skillsLabel')}:
                </span>
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
                    className="shrink-0 px-3 py-1.5 rounded-full border border-border-subtle bg-surface-raised text-[12px] font-medium text-text-secondary hover:text-text-primary hover:border-brand-primary-border transition-colors cursor-pointer"
                  >
                    {skill.label}
                    <span className="ml-1.5 text-[10px] text-text-muted">· {skill.costCredits}cr</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t('placeholder')}
                  aria-label={t('placeholder')}
                  className="flex-1 h-11 rounded-btn bg-surface-base border border-border-strong px-4 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-colors"
                />
                <Button type="submit" variant="primary" size="lg" aria-label={t('send')}>
                  <Send size={15} />
                  <span className="hidden sm:inline">{t('send')}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
