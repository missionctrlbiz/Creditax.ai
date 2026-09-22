'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plusPrice = billingPeriod === 'monthly' ? '₦5,000' : '₦4,000';
  const proPrice = billingPeriod === 'monthly' ? '₦25,000' : '₦20,000';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-16 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
            PRICING
          </p>
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-center text-text-secondary text-base md:text-lg max-w-[560px] mx-auto">
            Start free. Scale as you grow. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center my-10">
            <div className="flex items-center bg-surface-overlay rounded-lg p-1 border border-border-default select-none">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  billingPeriod === 'monthly'
                    ? 'bg-brand-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary bg-transparent'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer relative ${
                  billingPeriod === 'annual'
                    ? 'bg-brand-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary bg-transparent'
                }`}
              >
                Annual
                <span className="absolute top-[-10px] right-[-14px] bg-brand-action-bg border border-brand-action-border text-brand-action text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1280px] mx-auto items-stretch">
            {/* Free Plan */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Free</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl font-bold text-text-primary">₦0</span>
                  <span className="text-sm text-text-secondary">/month</span>
                </div>
                <div className="text-text-secondary text-sm mb-6 min-h-[40px] leading-relaxed">
                  Taste the platform — ask, upload, see your starter score
                </div>
                <div className="h-[1px] bg-brand-primary-border mb-6" />
                <ul className="space-y-3 mb-8 text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 5 agent chats/day
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 5 tax calculations/day
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 2 uploads/day (10/month)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Starter credit snapshot
                  </li>
                  <li className="flex items-center gap-2.5 text-text-disabled line-through opacity-60">
                    <span className="text-text-muted font-bold">✗</span> BVN verification (paid)
                  </li>
                </ul>
              </div>
              <Link href="/login" className="w-full">
                <Button variant="ghost" fullWidth size="md">Start Free</Button>
              </Link>
            </Card>

            {/* Plus Plan */}
            <Card accent="green" className="p-8 flex flex-col justify-between md:-translate-y-2 relative shadow-modal border-1.5 border-brand-action">
              <div className="absolute top-[-12px] left-1/2 -translate-x-1/2">
                <span className="bg-brand-action text-text-inverse text-[10px] font-extrabold px-3 py-1 rounded-[6px] tracking-wide uppercase shadow-sm">
                  MOST POPULAR
                </span>
              </div>
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wider text-brand-action mb-3 mt-2">Plus</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-text-primary">{plusPrice}</span>
                  <span className="text-sm text-text-secondary">/month</span>
                </div>
                <div className="text-text-secondary text-sm mb-6 min-h-[40px] leading-relaxed">
                  For freelancers, employees & active SMEs
                </div>
                <div className="h-[1px] bg-brand-action-border mb-6" />
                <ul className="space-y-3 mb-8 text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 100 agent chats/day
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 50 tax calculations/day
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 20 uploads/day + reports
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Full score + daily refresh
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 5 BVN verifications/month
                  </li>
                </ul>
              </div>
              <Link href="/login" className="w-full">
                <Button variant="primary" fullWidth size="lg">Go Plus →</Button>
              </Link>
            </Card>

            {/* Professional Plan */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Professional</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-text-primary">{proPrice}</span>
                  <span className="text-sm text-text-secondary">/month</span>
                </div>
                <div className="text-text-secondary text-sm mb-6 min-h-[40px] leading-relaxed">
                  For tax pros & firms — clients, bulk tools, reports
                </div>
                <div className="h-[1px] bg-brand-primary-border mb-6" />
                <ul className="space-y-3 mb-8 text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Everything in Plus
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Client management + bulk calc
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> 20 BVN verifications/month
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> White-label client reports
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Priority support (24h)
                  </li>
                </ul>
              </div>
              <Link href="/pro/apply" className="w-full">
                <Button variant="secondary" fullWidth size="md">Apply as a Pro</Button>
              </Link>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Enterprise</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl font-bold text-text-primary">Custom</span>
                </div>
                <div className="text-text-secondary text-sm mb-6 min-h-[40px] leading-relaxed">
                  For lenders, fintechs & large organisations
                </div>
                <div className="h-[1px] bg-brand-primary-border mb-6" />
                <ul className="space-y-3 mb-8 text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Unlimited API calls
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Dedicated infrastructure
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> Custom rate limits
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> White-label option
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-brand-action font-bold">✓</span> SLA + dedicated support
                  </li>
                </ul>
              </div>
              <Link href="/login" className="w-full">
                <Button variant="secondary" fullWidth size="md">Talk to Sales</Button>
              </Link>
            </Card>
          </div>

          {/* Feature Comparison Table */}
          <div id="comparison" className="mt-20 max-w-[1080px] mx-auto scroll-mt-24">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8">Full feature comparison</h2>
            <div className="relative overflow-x-auto border border-border-default rounded-xl bg-surface-overlay shadow-card">
              <table className="w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="border-b border-border-default bg-surface-raised font-mono text-xs uppercase text-text-muted">
                    <th className="p-4.5 pl-6 font-semibold">Feature</th>
                    <th className="p-4.5 text-center font-semibold text-brand-action bg-[rgba(50,232,117,0.03)]">Free</th>
                    <th className="p-4.5 text-center font-semibold text-brand-action bg-[rgba(50,232,117,0.03)]">Plus</th>
                    <th className="p-4.5 text-center font-semibold">Professional</th>
                    <th className="p-4.5 text-center font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-text-secondary">
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Agent chats</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">5/day</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">100/day</td>
                    <td className="p-4 text-center">Unlimited*</td>
                    <td className="p-4 text-center">Contracted</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Tax calculations</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">3/day</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">50/day</td>
                    <td className="p-4 text-center">Unlimited*</td>
                    <td className="p-4 text-center">Contracted</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Document upload</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">2/day</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">20/day</td>
                    <td className="p-4 text-center">100/day</td>
                    <td className="p-4 text-center">Contracted</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Credit Health Score</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">Snapshot</td>
                    <td className="p-4 text-center text-brand-action bg-[rgba(50,232,117,0.03)] font-bold">✓ Daily</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓ + clients</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓ Portfolio</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">BVN verification</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">Paid only</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">5/month</td>
                    <td className="p-4 text-center">20/month</td>
                    <td className="p-4 text-center">Contracted</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Pro tools (clients, bulk calc)</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">—</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">—</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">White-label reports</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">—</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">—</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Team invites & shared canvas</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">—</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">—</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓</td>
                    <td className="p-4 text-center text-brand-action font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Connected apps (Claude, Drive…)</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">2</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">10</td>
                    <td className="p-4 text-center">Unlimited</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">API access</td>
                    <td className="p-4 text-center font-mono bg-[rgba(50,232,117,0.03)]">100/mo</td>
                    <td className="p-4 text-center font-mono bg-[rgba(50,232,117,0.03)]">5k/mo</td>
                    <td className="p-4 text-center font-mono">50k/mo</td>
                    <td className="p-4 text-center">Custom + SLA</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-6 font-medium text-text-primary">Support</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">Community</td>
                    <td className="p-4 text-center bg-[rgba(50,232,117,0.03)]">Email</td>
                    <td className="p-4 text-center">Priority 24h</td>
                    <td className="p-4 text-center text-brand-action font-bold">Dedicated</td>
                  </tr>
                </tbody>
              </table>
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-surface-overlay to-transparent pointer-events-none" />
            </div>
            <p className="text-center mt-5 text-xs text-text-muted max-w-[720px] mx-auto leading-relaxed">
              *Unlimited means generous fair-use limits. New accounts get 2 free BVN verifications
              to use within 60 days; after that BVN is ₦350 per lookup (Professional: ₦300).
            </p>
            <a href="#comparison" className="block text-center mt-4 text-brand-primary text-sm font-semibold hover:underline">
              View full comparison →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
