'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileText,
  FolderOpen,
  Upload,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CountUp } from '@/components/ui/CountUp';
import { QuickCalculator } from '@/components/marketing/QuickCalculator';

/** Semi-circular gauge with animated draw + count-up figure. */
function Gauge({
  value,
  max,
  label,
  caption,
  variant = 'brand',
}: {
  value: number;
  max: number;
  label: string;
  caption: string;
  variant?: 'brand' | 'action';
}) {
  const reduce = useReducedMotion();
  // Avoid SSR/client float drift (Math.cos differs at ~1e-15 between runtimes).
  const round = (n: number) => Math.round(n * 100) / 100;
  const pct = Math.min(value / max, 1);
  // Arc geometry: 200x100 viewBox, semicircle from (20,90) to (180,90)
  const angle = Math.PI * (1 - pct);
  const x = round(100 + 80 * Math.cos(angle));
  const y = round(90 - 80 * Math.sin(angle));
  const stroke = variant === 'action' ? 'var(--color-brand-action)' : 'var(--color-brand-primary)';
  const gid = `gauge-${variant}-${label.replace(/\s+/g, '')}`;

  // Start the draw only after mount so server HTML and first client paint match
  // (framer-motion pathLength otherwise hydrates as strokeDasharray "1 1" vs "0 1").
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="text-text-muted text-[11px] font-semibold tracking-wider uppercase mb-4">{label}</div>
      <div className="relative w-full h-[104px] flex items-end justify-center">
        <svg viewBox="0 0 200 104" className="w-[190px] h-[100px]" aria-hidden>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0D7377" />
              <stop offset="100%" stopColor="#32E875" />
            </linearGradient>
          </defs>
          <path d="M20 90 A80 80 0 0 1 180 90" fill="none" stroke="var(--color-border-subtle)" strokeWidth="14" strokeLinecap="round" />
          <motion.path
            d={`M20 90 A80 80 0 0 1 ${x} ${y}`}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="14"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: mounted ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <circle cx={x} cy={y} r="5" fill={stroke} className="drop-shadow-[0_0_6px_rgba(50,232,117,0.5)]" />
        </svg>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center">
          <div className="font-mono text-[34px] font-bold text-text-primary leading-none stat-number">
            <CountUp end={value} duration={1.4} />
          </div>
          <div className="text-[10px] text-text-muted mt-1">{caption}</div>
        </div>
      </div>
    </Card>
  );
}

const SIGNALS = [
  { id: 'vat', label: 'VAT return due', detail: '21 Jul · 5 days left', tone: 'warning' as const, progress: 82 },
  { id: 'paye', label: 'PAYE schedule ready', detail: 'Confirmed with 4 documents', tone: 'success' as const, progress: 100 },
  { id: 'wht', label: 'WHT credit note', detail: 'Awaiting Zenith receipt', tone: 'info' as const, progress: 45 },
];

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const [currentDate, setCurrentDate] = useState('Thursday, 12 June 2026');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentDate(new Date().toLocaleDateString('en-NG', options));
  }, []);

  return (
    <div>
      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1>{t('welcome')}, Emeka</h1>
        <span className="text-text-secondary text-sm font-mono bg-surface-overlay border border-border-default px-3.5 py-1.5 rounded-[10px]">
          {currentDate}
        </span>
      </div>

      {/* Stats Grid — every figure counts up on load */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Gauge value={78} max={100} label={t('taxHealth')} caption="of 100 · Good" />
        <Gauge value={720} max={850} label={t('creditScore')} caption="VantageScore · +15 this month" variant="action" />

        {/* Filing progress card */}
        <Card className="p-6 flex flex-col h-full">
          <div className="text-text-muted text-[11px] font-semibold tracking-wider uppercase mb-4">{t('filing2025')}</div>
          <div className="flex items-stretch gap-5 flex-1">
            {/* Vertical progress bar */}
            <div className="w-2 rounded-full bg-surface-inset relative flex-shrink-0 overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-brand-primary to-brand-action"
                initial={{ height: 0 }}
                animate={{ height: '60%' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[34px] font-bold text-text-primary leading-none stat-number">
                  <CountUp end={60} suffix="%" duration={1.4} />
                </div>
                <div className="text-xs text-warning-text mt-2.5 flex items-center gap-1.5">
                  <BellRing size={13} className="flex-shrink-0" />
                  3 {t('docsNeeded')}
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mt-3">
                {['Bank Statement', 'PAYE Receipt', 'Utility Bill'].map((doc) => (
                  <span
                    key={doc}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border border-border-strong text-text-secondary bg-surface-raised"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link href="/dashboard/tax-filing">
          <Card className="p-5 hover:border-brand-primary transition-colors cursor-pointer h-full group">
            <div className="flex items-center justify-between">
              <div className="text-brand-primary font-semibold text-sm mb-1">{t('continueFiling')}</div>
              <ArrowUpRight size={15} className="text-text-muted group-hover:text-brand-primary transition-colors" />
            </div>
            <p className="text-text-muted text-xs leading-relaxed">60% complete · 3 {t('docsNeeded')}</p>
          </Card>
        </Link>
        <Link href="/dashboard/reports">
          <Card className="p-5 hover:border-brand-primary transition-colors cursor-pointer h-full group">
            <div className="flex items-center justify-between">
              <div className="text-brand-primary font-semibold text-sm mb-1">{t('viewOutputs')}</div>
              <ArrowUpRight size={15} className="text-text-muted group-hover:text-brand-primary transition-colors" />
            </div>
            <p className="text-text-muted text-xs leading-relaxed">Summaries, expense and credit reports</p>
          </Card>
        </Link>
        <Link href="/dashboard/credit">
          <Card className="p-5 hover:border-brand-primary transition-colors cursor-pointer h-full group">
            <div className="flex items-center justify-between">
              <div className="text-brand-primary font-semibold text-sm mb-1">{t('checkCredit')}</div>
              <ArrowUpRight size={15} className="text-text-muted group-hover:text-brand-primary transition-colors" />
            </div>
            <p className="text-text-muted text-xs leading-relaxed">720 VantageScore · +15 this month</p>
          </Card>
        </Link>
      </div>

      {/* Filing signals — refined, purposeful motion */}
      <Card className="p-6 md:p-7 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">Filing signals</h2>
          <Badge variant="brand">Live demo feed</Badge>
        </div>
        <div className="flex flex-col gap-3">
          {SIGNALS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-4 p-3.5 rounded-btn border border-border-subtle bg-surface-overlay"
            >
              <span className="relative w-8 h-8 rounded-full bg-brand-primary-bg grid place-items-center shrink-0">
                {s.tone === 'success' ? (
                  <CheckCircle2 size={15} className="text-success-text" />
                ) : s.tone === 'warning' ? (
                  <CalendarClock size={15} className="text-warning-text" />
                ) : (
                  <CreditCard size={15} className="text-info-text" />
                )}
                {s.tone === 'warning' && (
                  <span className="absolute inset-0 rounded-full border-2 border-warning/40 motion-safe:animate-ping" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-text-primary">{s.label}</div>
                <div className="text-[11px] text-text-muted">{s.detail}</div>
              </div>
              <div className="w-28 hidden sm:block">
                <div className="h-1.5 rounded-full bg-surface-inset overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      s.tone === 'warning' ? 'bg-warning' : s.tone === 'success' ? 'bg-success' : 'bg-info'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                  />
                </div>
              </div>
              <span className="font-mono text-[12px] text-text-secondary w-10 text-right">{s.progress}%</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* P2 — Quick tax calculator (F-06 / demo scope 5) */}
      <div className="mb-6">
        <QuickCalculator />
      </div>

      {/* Activity Card */}
      <Card className="p-6 md:p-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">{t('recentActivity')}</h2>
          <Link href="/dashboard/reports" className="text-brand-primary text-xs font-semibold hover:underline">
            {t('viewAll')} →
          </Link>
        </div>

        <div className="flex flex-col">
          {[
            {
              id: 'score',
              icon: <CheckCircle2 size={14} />,
              tone: 'bg-brand-action-bg text-brand-action',
              text: (
                <>
                  <strong className="text-text-primary font-medium">{t('taxHealth').replace(/^\w/, (c) => c.toUpperCase())}</strong> updated to
                  <span className="font-mono"> 78/100</span>
                </>
              ),
              time: '2 hours ago',
            },
            {
              id: 'doc',
              icon: <Upload size={14} />,
              tone: 'bg-brand-primary-bg text-brand-primary',
              text: (
                <>
                  Document uploaded: <strong className="text-text-primary font-medium">Bank_Statement.pdf</strong>
                </>
              ),
              time: 'Yesterday',
            },
            {
              id: 'credit',
              icon: <CheckCircle2 size={14} />,
              tone: 'bg-brand-action-bg text-brand-action',
              text: (
                <>
                  <strong className="text-text-primary font-medium">{t('creditScore')}</strong> increased by{' '}
                  <span className="font-mono text-brand-action">+15</span> points
                </>
              ),
              time: '3 days ago',
            },
            {
              id: 'chat',
              icon: <FileText size={14} />,
              tone: 'bg-brand-primary-bg text-brand-primary',
              text: (
                <>
                  AI Tax Assistant answered:{' '}
                  <strong className="text-text-primary font-medium">VAT deduction query</strong>
                </>
              ),
              time: '5 days ago',
            },
            {
              id: 'account',
              icon: <FolderOpen size={14} />,
              tone: 'bg-surface-inset text-text-muted',
              text: (
                <>
                  <strong className="text-text-primary font-medium">Account</strong> created and verified
                </>
              ),
              time: 'Jun 1, 2026',
            },
          ].map((row, i) => (
            <div
              key={row.id}
              className={`flex items-center gap-4 py-4 ${i < 4 ? 'border-b border-border-subtle' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full grid place-items-center flex-shrink-0 ${row.tone}`}>
                {row.icon}
              </div>
              <div className="flex-1 text-[13px] text-text-secondary">{row.text}</div>
              <div className="text-[12px] text-text-muted font-mono flex-shrink-0">{row.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
