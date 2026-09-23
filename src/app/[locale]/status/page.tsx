'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
} from 'lucide-react';

type StatusKind = 'operational' | 'degraded' | 'down';

const STATUS_META: Record<
  StatusKind,
  { label: string; icon: typeof CheckCircle2; badge: 'success' | 'warning' | 'error' }
> = {
  operational: { label: 'Operational', icon: CheckCircle2, badge: 'success' },
  degraded: { label: 'Degraded', icon: AlertTriangle, badge: 'warning' },
  down: { label: 'Down', icon: XCircle, badge: 'error' },
};

type Service = {
  name: string;
  status: StatusKind;
  uptime: string;
  detail: string;
  /** Deterministic demo sample of daily uptime percentages (oldest → newest). */
  history: number[];
  expandable: boolean;
};

const services: Service[] = [
  {
    name: 'API Server',
    status: 'operational',
    uptime: '99.97%',
    detail: 'Median response 280ms across the tax-calculation endpoint.',
    history: [100, 100, 99.99, 100, 100, 100, 99.98, 100, 100, 100],
    expandable: false,
  },
  {
    name: 'RAG Chat Engine',
    status: 'operational',
    uptime: '99.91%',
    detail: 'Grounded answers from the tax corpus, cited on every response.',
    history: [100, 99.95, 100, 100, 99.9, 100, 100, 100, 100, 100],
    expandable: false,
  },
  {
    name: 'Document Processing',
    status: 'degraded',
    uptime: '99.89%',
    detail:
      'Elevated latency on PDF extraction since 14:22 UTC. Uploads still complete, just slower.',
    history: [100, 100, 100, 99.8, 96.4, 93.1, 94.2, 97.5, 98.1, 99.2],
    expandable: true,
  },
  {
    name: 'Auth System',
    status: 'operational',
    uptime: '100%',
    detail: 'Direct-email sign-in and portal role routing healthy.',
    history: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    expandable: false,
  },
  {
    name: 'Marketplace API',
    status: 'operational',
    uptime: '99.82%',
    detail: 'Professional listings and verification statuses live.',
    history: [100, 99.9, 100, 99.6, 100, 100, 99.7, 100, 100, 100],
    expandable: false,
  },
];

type Incident = {
  title: string;
  status: 'resolved' | 'investigating';
  kind: 'success' | 'warning' | 'error';
  date: string;
  duration: string;
  note: string;
};

const incidents: Incident[] = [
  {
    title: 'Elevated Document Processing Latency',
    status: 'investigating',
    kind: 'warning',
    date: 'June 12, 2025 · 14:22 UTC',
    duration: 'ongoing',
    note: 'Queue depth rose after a batch of large PDF uploads. Mitigation in progress.',
  },
  {
    title: 'RAG Chat Intermittent Timeouts',
    status: 'resolved',
    kind: 'success',
    date: 'June 3, 2025 · 09:10 UTC',
    duration: '23 minutes',
    note: 'Vector search timeouts on one region. Resolved by shifting query routing.',
  },
  {
    title: 'Auth Service Degraded',
    status: 'resolved',
    kind: 'error',
    date: 'May 28, 2025 · 16:41 UTC',
    duration: '41 minutes',
    note: 'Sign-in latency tripled during a provider incident. Resolved with no data loss.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

export default function StatusPage() {
  const [expandedService, setExpandedService] = useState<string | null>('Document Processing');

  const operationalCount = services.filter((s) => s.status === 'operational').length;
  const affected = services.filter((s) => s.status !== 'operational');
  const overallDegraded = affected.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1 w-full max-w-[1080px] mx-auto px-6 md:px-10 pt-24 pb-8">
        {/* ── Header ── */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.p
            variants={fadeInUp}
            className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4"
          >
            Status
          </motion.p>
          <motion.h1 variants={fadeInUp} className="mb-3 tracking-tight">
            System status
          </motion.h1>
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-3 text-[13px] text-text-muted"
          >
            <span className="inline-flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-action" />
              Demo snapshot — June 12, 2025 · 02:00 UTC
            </span>
            <Badge variant="info">Demo build</Badge>
          </motion.div>
          <motion.p variants={fadeInUp} className="mt-3 text-[13px] text-text-muted max-w-[640px]">
            This board is sample data for the demo build. Figures below are illustrative and
            are not a live service guarantee.
          </motion.p>
        </motion.div>

        {/* ── Overall banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-7"
        >
          <Card
            className={`p-6 ${
              overallDegraded
                ? 'border-warning-border bg-warning-bg'
                : 'border-success-border bg-success-bg'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    overallDegraded ? 'bg-warning' : 'bg-success'
                  }`}
                >
                  {overallDegraded ? (
                    <AlertTriangle className="w-6 h-6 text-surface-base" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-surface-base" />
                  )}
                </div>
                <div>
                  <h2
                    className={`mb-1 ${overallDegraded ? 'text-warning-text' : 'text-success-text'}`}
                  >
                    {overallDegraded ? 'Partial degradation' : 'All systems operational'}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {overallDegraded
                      ? `${operationalCount} of ${services.length} services operational — ${affected[0].name} is reporting elevated latency.`
                      : `All ${services.length} services are operating normally.`}
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => toast('Demo build — subscriptions are not wired')}>
                Subscribe to updates
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* ── Service rows ── */}
        <motion.div
          className="mt-6 space-y-3"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {services.map((service) => {
            const meta = STATUS_META[service.status];
            const isExpanded = expandedService === service.name;
            return (
              <motion.div key={service.name} variants={fadeInUp}>
                <Card
                  className={`transition-colors ${
                    isExpanded ? 'border-border-brand' : 'hover:border-border-subtle'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <meta.icon
                        className={`w-5 h-5 shrink-0 ${
                          service.status === 'operational'
                            ? 'text-success-text'
                            : service.status === 'degraded'
                              ? 'text-warning-text'
                              : 'text-error-text'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-text-primary truncate">{service.name}</p>
                        <p className="text-[12px] text-text-muted truncate">{service.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <Badge variant={meta.badge}>{meta.label}</Badge>
                      <span className="font-mono text-[13px] text-text-secondary tabular-nums">
                        {service.uptime}
                      </span>
                      {service.expandable && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedService(isExpanded ? null : service.name)
                          }
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Hide' : 'Show'} uptime detail for ${service.name}`}
                          className="w-8 h-8 rounded-btn border border-border-strong text-text-muted hover:text-text-primary hover:border-border-brand flex items-center justify-center transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {service.expandable && isExpanded && (
                    <div className="px-4 pb-4 border-t border-border-subtle">
                      <div className="flex items-center justify-between gap-3 pt-4 mb-3">
                        <p className="text-[11px] uppercase tracking-wider text-text-muted">
                          Daily uptime · last 10 days (demo sample)
                        </p>
                        <span className="font-mono text-[11px] text-text-muted tabular-nums">
                          min {Math.min(...service.history).toFixed(1)}%
                        </span>
                      </div>
                      <div className="bg-surface-inset rounded-card p-4">
                        <div className="flex items-end gap-1.5 h-20">
                          {service.history.map((value, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t transition-colors ${
                                value < 95
                                  ? 'bg-warning'
                                  : value < 99.9
                                    ? 'bg-info'
                                    : 'bg-success'
                              }`}
                              style={{ height: `${Math.max(6, value - 92) * 11}%` }}
                              title={`Day ${i + 1}: ${value.toFixed(2)}% uptime`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[11px] text-text-muted font-mono tabular-nums">
                          <span>Jun 2</span>
                          <span>Jun 12</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Incident history ── */}
        <motion.section
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <h2 className="mb-1 tracking-tight">Incident history</h2>
            <p className="text-[13px] text-text-muted">
              Sample incidents for the demo build, newest first.
            </p>
          </motion.div>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <motion.div key={incident.title} variants={fadeInUp}>
                <Card className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        {incident.status === 'investigating' ? (
                          <AlertTriangle className="w-4 h-4 text-warning-text shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-success-text shrink-0" />
                        )}
                        <h3 className="truncate">{incident.title}</h3>
                      </div>
                      <p className="text-[13px] text-text-secondary leading-relaxed">
                        {incident.note}
                      </p>
                      <p className="mt-1.5 text-[12px] text-text-muted">{incident.date}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant={
                          incident.status === 'investigating'
                            ? 'warning'
                            : incident.kind === 'error'
                              ? 'error'
                              : 'success'
                        }
                      >
                        {incident.status === 'investigating' ? 'Investigating' : 'Resolved'}
                      </Badge>
                      <span className="font-mono text-[12px] text-text-muted tabular-nums">
                        {incident.duration}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast('Demo build — the full archive is not published yet')}
            >
              View full incident history
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.section>

        {/* ── Subscribe ── */}
        <motion.section
          className="mt-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-primary-bg mx-auto mb-4 flex items-center justify-center">
              <Bell className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="mb-2 tracking-tight">Get notified about incidents</h2>
            <p className="text-text-secondary text-sm mb-6 max-w-[460px] mx-auto">
              Receive email alerts the moment we detect a service disruption. Demo build —
              no mail is sent yet.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                toast('Demo build — alert subscriptions are not wired');
              }}
            >
              <Input
                type="email"
                required
                placeholder="your@email.com"
                aria-label="Email address for status alerts"
                className="flex-1"
              />
              <Button type="submit" variant="brand">
                Subscribe
              </Button>
            </form>
            <p className="text-[11px] text-text-muted mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </Card>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
