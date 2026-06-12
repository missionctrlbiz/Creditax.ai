'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
            PRICING
          </p>
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-center text-text-secondary text-base md:text-lg max-w-xl mx-auto mb-14">
            Start free. Scale as you grow. No hidden fees.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            <Card className="p-8 flex flex-col">
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Free</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl font-bold text-text-primary">$0</span>
                  <span className="text-sm text-text-secondary">/month</span>
                </div>
                <div className="text-text-secondary text-sm mb-6 min-h-[44px] leading-relaxed">
                  50 queries per day to get started
                </div>
                <div className="h-[1px] bg-brand-primary-border mb-6" />
                <ul className="space-y-3 mb-8 text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> RAG-powered tax Q&A
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 50 queries per day
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Basic document upload (10/month)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Tax health score
                  </li>
                  <li className="flex items-center gap-2.5 text-text-muted">
                    <span className="text-text-muted font-bold">—</span> Credit score access
                  </li>
                  <li className="flex items-center gap-2.5 text-text-muted">
                    <span className="text-text-muted font-bold">—</span> Priority support
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <p className="text-xs text-text-muted mb-3">Community support</p>
                <Link href="/signup" className="block w-full">
                  <Button variant="secondary" fullWidth size="lg">Get Started Free</Button>
                </Link>
              </div>
            </Card>

            <Card accent="green" className="p-8 flex flex-col relative shadow-modal border-brand-action">
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2">
                <span className="bg-brand-action text-text-inverse text-[10px] font-extrabold px-4 py-1.5 rounded-[6px] tracking-wide uppercase shadow-btn-action">
                  Most Popular
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[13px] font-semibold uppercase tracking-wider text-brand-action mb-3">Pro</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl font-bold text-text-primary">$19</span>
                  <span className="text-sm text-text-secondary">/month</span>
                </div>
                <div className="text-text-secondary text-sm mb-6 min-h-[44px] leading-relaxed">
                  500 queries per day for power users
                </div>
                <div className="h-[1px] bg-brand-action-border mb-6" />
                <ul className="space-y-3 mb-8 text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Everything in Free
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 500 queries per day
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Unlimited document uploads
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Priority processing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Credit score access
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Email support
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> No ads
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <p className="text-xs text-text-muted mb-3">Email support</p>
                <Link href="/signup" className="block w-full">
                  <Button size="lg" fullWidth>Start Pro Trial</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8 flex flex-col">
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Enterprise</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl font-bold text-text-primary">Custom</span>
                </div>
                <div className="text-text-secondary text-sm mb-6 min-h-[44px] leading-relaxed">
                  Unlimited everything for organizations
                </div>
                <div className="h-[1px] bg-brand-primary-border mb-6" />
                <ul className="space-y-3 mb-8 text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Everything in Pro
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Unlimited queries
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Dedicated support
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Custom integrations
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> SLA guarantee
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> White-label options
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <p className="text-xs text-text-muted mb-3">Dedicated support</p>
                <Link href="#">
                  <Button variant="secondary" fullWidth size="lg">Contact Sales</Button>
                </Link>
              </div>
            </Card>
          </div>

          <section className="mt-24 max-w-2xl mx-auto">
            <h2 className="text-center text-2xl md:text-3xl font-bold mb-10 tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-surface-overlay rounded-xl p-6 border border-border-default">
                <h3 className="font-semibold text-text-primary mb-2">What counts as a query?</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Each question you ask the RAG chat counts as one query. Document uploads and credit score checks do not count against your limit.
                </p>
              </div>

              <div className="bg-surface-overlay rounded-xl p-6 border border-border-default">
                <h3 className="font-semibold text-text-primary mb-2">Can I upgrade or downgrade anytime?</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing cycle.
                </p>
              </div>

              <div className="bg-surface-overlay rounded-xl p-6 border border-border-default">
                <h3 className="font-semibold text-text-primary mb-2">What payment methods do you accept?</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  We accept all major credit cards via Stripe. Enterprise customers can pay via bank transfer.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}