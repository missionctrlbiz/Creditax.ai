'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import {
  Check,
  X,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

type Plan = {
  id: string;
  name: string;
  monthly: string;
  annual: string;
  priceNote: string;
  blurb: string;
  cta: { label: string; href: string };
  highlight?: 'free' | 'popular';
  features: { label: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthly: '₦0',
    annual: '₦0',
    priceNote: 'forever · no card required',
    blurb: 'Taste the platform — ask, upload, and see your starter score.',
    cta: { label: 'Start Free', href: '/signup' },
    highlight: 'free',
    features: [
      { label: '5 agent chats per day', included: true },
      { label: '5 tax calculations per day', included: true },
      { label: '2 document uploads per day (10/month)', included: true },
      { label: 'Starter credit snapshot', included: true },
      { label: 'BVN verification (paid only)', included: false },
      { label: 'Unmasked marketplace contacts', included: false },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    monthly: '₦5,000',
    annual: '₦4,000',
    priceNote: 'per month · annual saves 20%',
    blurb: 'For freelancers, employees, and active SMEs.',
    cta: { label: 'Go Plus', href: '/signup' },
    highlight: 'popular',
    features: [
      { label: '100 agent chats per day', included: true },
      { label: '50 tax calculations per day', included: true },
      { label: '20 uploads per day + reports', included: true },
      { label: 'Full score with daily refresh', included: true },
      { label: '5 BVN verifications per month', included: true },
      { label: 'Full marketplace contact details', included: true },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthly: '₦25,000',
    annual: '₦20,000',
    priceNote: 'per month · annual saves 20%',
    blurb: 'For tax pros and firms — clients, bulk tools, reports.',
    cta: { label: 'Apply as a Pro', href: '/pro/apply' },
    features: [
      { label: 'Everything in Plus', included: true },
      { label: 'Client management + bulk calculations', included: true },
      { label: '20 BVN verifications per month', included: true },
      { label: 'White-label client reports', included: true },
      { label: '3 team seats included', included: true },
      { label: 'Priority support (24h)', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: 'Custom',
    annual: 'Custom',
    priceNote: 'contracted volume + SLA',
    blurb: 'For lenders, fintechs, and large organisations.',
    cta: { label: 'Talk to Sales', href: '/login' },
    features: [
      { label: 'Unlimited API calls', included: true },
      { label: 'Dedicated infrastructure', included: true },
      { label: 'Custom rate limits', included: true },
      { label: 'White-label option', included: true },
      { label: 'Portfolio scoring', included: true },
      { label: 'SLA + dedicated support', included: true },
    ],
  },
];

type Cell =
  | { kind: 'check' }
  | { kind: 'dash' }
  | { kind: 'text'; value: string; mono?: boolean };

const COMPARISON: { feature: string; cells: Cell[] }[] = [
  {
    feature: 'Agent chats',
    cells: [
      { kind: 'text', value: '5/day' },
      { kind: 'text', value: '100/day' },
      { kind: 'text', value: 'Fair-use' },
      { kind: 'text', value: 'Contracted' },
    ],
  },
  {
    feature: 'Tax calculations',
    cells: [
      { kind: 'text', value: '5/day' },
      { kind: 'text', value: '50/day' },
      { kind: 'text', value: 'Fair-use' },
      { kind: 'text', value: 'Contracted' },
    ],
  },
  {
    feature: 'Document uploads',
    cells: [
      { kind: 'text', value: '2/day' },
      { kind: 'text', value: '20/day' },
      { kind: 'text', value: '100/day' },
      { kind: 'text', value: 'Contracted' },
    ],
  },
  {
    feature: 'Credit Health Score',
    cells: [
      { kind: 'text', value: 'Snapshot' },
      { kind: 'text', value: 'Daily refresh' },
      { kind: 'text', value: 'Daily + clients' },
      { kind: 'text', value: 'Portfolio' },
    ],
  },
  {
    feature: 'BVN verifications',
    cells: [
      { kind: 'text', value: '0 + 2 teaser' },
      { kind: 'text', value: '5/mo' },
      { kind: 'text', value: '20/mo' },
      { kind: 'text', value: 'Contracted' },
    ],
  },
  {
    feature: 'Marketplace contacts',
    cells: [
      { kind: 'text', value: 'After login' },
      { kind: 'check' },
      { kind: 'check' },
      { kind: 'check' },
    ],
  },
  {
    feature: 'Team seats & invites',
    cells: [
      { kind: 'dash' },
      { kind: 'dash' },
      { kind: 'text', value: '3 seats' },
      { kind: 'text', value: 'SSO' },
    ],
  },
  {
    feature: 'Shared canvas links',
    cells: [{ kind: 'dash' }, { kind: 'dash' }, { kind: 'check' }, { kind: 'check' }],
  },
  {
    feature: 'Connected apps',
    cells: [
      { kind: 'text', value: '2' },
      { kind: 'text', value: '10' },
      { kind: 'text', value: 'Unlimited' },
      { kind: 'text', value: 'Unlimited' },
    ],
  },
  {
    feature: 'API calls',
    cells: [
      { kind: 'text', value: '100/mo', mono: true },
      { kind: 'text', value: '5k/mo', mono: true },
      { kind: 'text', value: '50k/mo', mono: true },
      { kind: 'text', value: 'Custom + SLA' },
    ],
  },
  {
    feature: 'Support',
    cells: [
      { kind: 'text', value: 'Community' },
      { kind: 'text', value: 'Email 48h' },
      { kind: 'text', value: 'Priority 24h' },
      { kind: 'text', value: 'Dedicated' },
    ],
  },
];

const FAQS = [
  {
    q: 'Is the Free tier really free?',
    a: 'Yes. Free is ₦0 forever with no card required. It is deliberately tight — five chats and five calculations a day — so you can feel the product before you pay for it.',
  },
  {
    q: 'What happens when I hit a free limit?',
    a: 'You get an upgrade card naming the exact limit you reached, for example “You’ve used today’s 5 free chats — Plus gives you 100/day for ₦5,000/mo”. Nothing is deleted; you simply continue tomorrow or upgrade.',
  },
  {
    q: 'How does BVN verification work?',
    a: 'New accounts get 2 free BVN verifications usable within the first 60 days. After that BVN is paid-only: ₦350 per lookup on Free and Plus, or included in the monthly quota on Professional (20/month at ₦300 each).',
  },
  {
    q: 'Can I pay annually?',
    a: 'Yes — annual billing saves 20%. Plus is ₦4,000 and Professional is ₦20,000 when billed yearly, instead of ₦5,000 and ₦25,000 monthly.',
  },
  {
    q: 'Are prices shown in Naira?',
    a: 'Always. Every plan, quota, and per-lookup fee on Creditax is quoted in Naira (₦) so there is no FX surprise. Annual and monthly figures are both in ₦.',
  },
  {
    q: 'Can I cancel or change plans?',
    a: 'Upgrade, downgrade, or cancel at any time from the dashboard. Changes take effect at the end of the current billing period with no lock-in.',
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
    transition: { staggerChildren: 0.08 },
  },
};

function ComparisonCell({ cell }: { cell: Cell }) {
  if (cell.kind === 'check') {
    return (
      <span className="inline-flex justify-center">
        <Check className="w-4 h-4 text-success-text" aria-label="Included" />
      </span>
    );
  }
  if (cell.kind === 'dash') {
    return <span className="text-text-disabled">—</span>;
  }
  return (
    <span className={cell.mono ? 'font-mono tabular-nums text-text-primary' : 'text-text-secondary'}>
      {cell.value}
    </span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
      >
        <span className="text-[15px] font-semibold text-text-primary group-hover:text-brand-action transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-text-muted transition-transform duration-200 ${
            open ? 'rotate-180 text-brand-action' : ''
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 pr-8 text-[14px] leading-relaxed text-text-secondary">{a}</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1">
        {/* ── Header ── */}
        <section className="pt-24 pb-10 px-6 md:px-10">
          <motion.div
            className="max-w-[1440px] mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeInUp}
              className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4"
            >
              Pricing
            </motion.p>
            <motion.h1 variants={fadeInUp} className="mb-4 tracking-tight">
              Start free. Pay only when it works.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary max-w-[620px] mx-auto"
            >
              Every plan is priced in Naira. The free tier is a real taste of the product —
              ask a question, calculate a liability, see your starter score — with no card
              required.
            </motion.p>

            {/* Billing toggle */}
            <motion.div variants={fadeInUp} className="flex justify-center mt-9">
              <div className="inline-flex items-center bg-surface-overlay rounded-input p-1 border border-border-default select-none">
                <button
                  type="button"
                  onClick={() => setAnnual(false)}
                  aria-pressed={!annual}
                  className={`px-5 py-2 rounded-btn text-sm font-medium transition-all cursor-pointer ${
                    !annual
                      ? 'bg-brand-primary text-text-inverse shadow-btn-brand'
                      : 'text-text-secondary hover:text-text-primary bg-transparent'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setAnnual(true)}
                  aria-pressed={annual}
                  className={`px-5 py-2 rounded-btn text-sm font-medium transition-all cursor-pointer inline-flex items-center gap-2 ${
                    annual
                      ? 'bg-brand-primary text-text-inverse shadow-btn-brand'
                      : 'text-text-secondary hover:text-text-primary bg-transparent'
                  }`}
                >
                  Annual
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-badge ${
                      annual
                        ? 'bg-brand-action text-text-inverse'
                        : 'bg-brand-action-bg border border-brand-action-border text-brand-action'
                    }`}
                  >
                    −20%
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Plan cards ── */}
        <section className="px-6 md:px-10 pb-4">
          <motion.div
            className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {PLANS.map((plan) => {
              const price = annual ? plan.annual : plan.monthly;
              const isFree = plan.highlight === 'free';
              const isPopular = plan.highlight === 'popular';
              return (
                <motion.div key={plan.id} variants={fadeInUp} className="h-full">
                  <Card
                    className={`p-7 h-full flex flex-col ${
                      isFree ? 'border-border-action shadow-modal' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h2 className="mb-0 flex items-center gap-2">
                        {plan.id === 'enterprise' && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src="/images/icons/icon-api.png"
                            alt=""
                            width={22}
                            height={22}
                            className="w-[22px] h-[22px] object-contain"
                          />
                        )}
                        {plan.name}
                      </h2>
                      {isFree && (
                        <Badge variant="success">
                          <Sparkles className="w-3 h-3" />
                          Free forever
                        </Badge>
                      )}
                      {isPopular && <Badge variant="brand">Most popular</Badge>}
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-mono text-text-primary font-bold tabular-nums">
                        {price}
                      </span>
                      {plan.id !== 'enterprise' && (
                        <span className="text-sm text-text-secondary">
                          {annual ? '/mo, billed yearly' : '/month'}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-text-muted mb-5">{plan.priceNote}</p>

                    <p className="text-text-secondary text-sm leading-relaxed mb-6 min-h-[44px]">
                      {plan.blurb}
                    </p>

                    <div className="h-px bg-border-subtle mb-6" />

                    <ul className="space-y-3 mb-8 text-sm text-text-secondary flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature.label} className="flex items-start gap-2.5">
                          {feature.included ? (
                            <Check className="w-4 h-4 mt-0.5 text-brand-action shrink-0" />
                          ) : (
                            <X className="w-4 h-4 mt-0.5 text-text-disabled shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-text-disabled'}>
                            {feature.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.cta.href} className="w-full">
                      <Button
                        variant={isFree || isPopular ? 'primary' : 'ghost'}
                        fullWidth
                        size="md"
                      >
                        {plan.cta.label}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── Feature comparison ── */}
        <section id="comparison" className="px-6 md:px-10 pt-16 pb-4 scroll-mt-24">
          <div className="max-w-[1080px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="mb-3 tracking-tight">Full feature comparison</h2>
              <p className="text-text-secondary max-w-[560px] mx-auto text-sm">
                Quotas reset daily at 00:00 WAT; monthly quotas reset on your billing
                anniversary.
              </p>
            </motion.div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm text-left">
                  <thead>
                    <tr className="bg-surface-inset text-[11px] uppercase tracking-wider text-text-muted font-mono">
                      <th scope="col" className="p-4 pl-6 font-semibold">
                        Feature
                      </th>
                      {PLANS.map((plan, i) => (
                        <th
                          key={plan.id}
                          scope="col"
                          className={`p-4 text-center font-semibold ${
                            i <= 1 ? 'text-brand-action bg-brand-action-bg' : 'text-text-secondary'
                          }`}
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {COMPARISON.map((row) => (
                      <tr key={row.feature} className="hover:bg-surface-inset/60 transition-colors">
                        <td className="p-4 pl-6 font-medium text-text-primary">{row.feature}</td>
                        {row.cells.map((cell, i) => (
                          <td
                            key={i}
                            className={`p-4 text-center ${
                              i <= 1 ? 'bg-brand-action-bg' : ''
                            }`}
                          >
                            <ComparisonCell cell={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <p className="text-center mt-5 text-xs text-text-muted max-w-[760px] mx-auto leading-relaxed">
              “Fair-use” means generous limits with abuse monitoring rather than an unmetered
              pipeline. New accounts get 2 free BVN verifications within 60 days; after that
              BVN is ₦350 per lookup (Professional: ₦300). All figures in Naira.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 md:px-10 pt-16 pb-4">
          <div className="max-w-[820px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="mb-3 tracking-tight">Frequently asked questions</h2>
              <p className="text-text-secondary text-sm">
                Straight answers on limits, billing, and verification.
              </p>
            </motion.div>
            <Card className="px-6 py-2">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </Card>
          </div>
        </section>

        {/* ── CTA row ── */}
        <section className="px-6 md:px-10 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-[1080px] mx-auto p-8 md:p-10 bg-gradient-to-br from-brand-primary-bg via-surface-raised to-brand-action-bg border-brand-primary-border">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-action-bg flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-brand-action" />
                  </div>
                  <div>
                    <h2 className="mb-2 tracking-tight">Your tax record is your credit story</h2>
                    <p className="text-text-secondary text-sm max-w-[520px]">
                      Create a free account to calculate liabilities, ask grounded tax
                      questions, and see your starter credit snapshot — all in Naira, no card
                      required.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Link href="/signup">
                    <Button variant="primary" size="lg">
                      <Zap className="w-4 h-4" />
                      Create free account
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="ghost" size="lg">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
              <p className="mt-6 text-[11px] text-text-muted">
                Demo build — plans and quotas shown here are illustrative and no payment is
                taken.
              </p>
            </Card>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
