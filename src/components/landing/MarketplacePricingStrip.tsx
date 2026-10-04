'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MapPin, Star, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BrandedImage } from '@/components/shared/BrandedImage';

const TEASER_PROS = [
  {
    id: 'adaeze-consulting',
    name: 'Adaeze Consulting Ltd',
    rating: 4.9,
    distance: '2.3 km',
    services: 'Income Tax · VAT · Payroll',
    price: 'From ₦15,000/filing',
    img: '/images/marketplace/pro-team-01.jpg',
  },
  {
    id: 'lagos-tax-partners',
    name: 'Lagos Tax Partners',
    rating: 4.8,
    distance: '5.1 km',
    services: 'CIT · Transfer Pricing · Audit',
    price: 'From ₦45,000/filing',
    img: '/images/marketplace/pro-team-02.jpg',
  },
  {
    id: 'quicktax-nigeria',
    name: 'QuickTax Nigeria',
    rating: 4.6,
    distance: '1.8 km',
    services: 'VAT · PAYE · WHT',
    price: 'From ₦8,000/filing',
    img: '/images/marketplace/pro-team-03.jpg',
  },
];

export function MarketplacePricingStrip() {
  const t = useTranslations('sections');
  return (
    <section className="py-20 md:py-24 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 space-y-20">
        {/* Marketplace teaser */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p data-cx="words" className="eyebrow mb-3">
                {t('marketEyebrow')}
              </p>
              <h2 data-cx="words" className="text-2xl md:text-3xl font-bold tracking-tight">
                {t('marketTitle')}
              </h2>
              <p data-cx="settle" className="text-text-secondary text-sm mt-2 max-w-[520px]">{t('marketSub')}</p>
            </div>
            <span data-cx="magnetic" className="inline-block">
              <Link href="/marketplace">
                <Button variant="secondary">
                  <ShieldCheck size={15} aria-hidden />
                  {t('marketCta')}
                </Button>
              </Link>
            </span>
          </div>

          {/* P21: the static Lagos map image is gone — the teaser is now a
              full-width auto-scrolling row of pro cards (pauses on hover,
              respects reduced motion via the global media query). */}
          <div className="marquee-mask marquee-paused overflow-hidden">
            <div className="flex w-max gap-4 animate-marquee">
              {[...TEASER_PROS, ...TEASER_PROS].map((pro, idx) => (
                <Link
                  key={`${pro.id}-${idx}`}
                  href={`/marketplace/${pro.id}`}
                  className="group w-[290px] shrink-0"
                  aria-hidden={idx >= TEASER_PROS.length}
                  tabIndex={idx >= TEASER_PROS.length ? -1 : undefined}
                >
                  <Card className="p-5 h-full flex flex-col gap-2 transition-transform duration-200 group-hover:-translate-y-1 overflow-hidden">
                    <BrandedImage
                      src={pro.img}
                      alt={`${pro.name} team`}
                      className="h-28 -mx-5 -mt-5 mb-1 rounded-none"
                      badgeSize={24}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug group-hover:text-brand-primary transition-colors">
                        {pro.name}
                      </h3>
                      <ShieldCheck size={16} className="text-brand-action shrink-0" aria-label="Verified" />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                      <Star size={12} className="text-brand-action fill-brand-action" />
                      <span className="font-mono">{pro.rating}</span>
                      <span className="text-text-muted">·</span>
                      <MapPin size={12} className="text-text-muted" />
                      <span>{pro.distance}</span>
                    </div>
                    <p className="text-[12px] text-text-muted leading-snug flex-1">{pro.services}</p>
                    <p className="price-figure text-[13px] text-brand-primary">
                      <span className="text-[10px] font-sans font-medium text-text-muted mr-1">From</span>
                      <span className="naira">₦</span>
                      {pro.price.replace(/^From ₦/, '').replace(/\/filing$/, '')}
                      <span className="text-[10px] font-sans font-medium text-text-muted ml-0.5">/filing</span>
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing preview — reimaged as a tier ladder: the visitor sees the
            actual ₦0 → ₦5,000 → ₦25,000 path (real figures from the pricing
            page) instead of a single price + two generic buttons. */}
        <div
          data-cx="settle"
          className="relative rounded-[24px] border border-border-default bg-surface-raised shadow-card overflow-hidden"
        >
          <div
            className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-brand-primary/15 blur-[90px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/70 to-transparent"
            aria-hidden
          />

          <div className="relative p-8 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <p className="eyebrow mb-3">
                {t('pricingEyebrow')}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                {t('pricingTitle')}
              </h2>

              <div className="flex flex-wrap gap-2.5 mb-4" role="list" aria-label="Plans">
                <div
                  role="listitem"
                  className="rounded-[14px] border border-brand-primary-border bg-brand-primary-bg px-4 py-3 min-w-[118px]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mb-1.5">Free</p>
                  <p className="price-figure text-xl text-text-primary leading-none">
                    <span className="naira">₦</span>0
                  </p>
                  <p className="text-[10px] text-text-muted mt-1.5">forever · no card</p>
                </div>
                <div
                  role="listitem"
                  className="rounded-[14px] border border-border-default px-4 py-3 min-w-[118px]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">Plus</p>
                  <p className="price-figure text-xl text-text-primary leading-none">
                    <span className="naira">₦</span>5,000
                    <span className="text-[10px] font-sans text-text-muted ml-0.5">/mo</span>
                  </p>
                  <p className="text-[10px] text-text-muted mt-1.5">freelancers &amp; SMEs</p>
                </div>
                <div
                  role="listitem"
                  className="rounded-[14px] border border-border-default px-4 py-3 min-w-[118px]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">Professional</p>
                  <p className="price-figure text-xl text-text-primary leading-none">
                    <span className="naira">₦</span>25,000
                    <span className="text-[10px] font-sans text-text-muted ml-0.5">/mo</span>
                  </p>
                  <p className="text-[10px] text-text-muted mt-1.5">pros &amp; firms</p>
                </div>
              </div>
              <p className="text-[11px] text-text-muted">
                Annual billing saves 20% on Plus and Professional.
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full lg:w-auto lg:min-w-[240px]">
              <span data-cx="magnetic" className="block">
                <Link href="/pricing">
                  <Button variant="primary" size="lg" fullWidth>
                    {t('pricingCta')}
                    <ArrowUpRight size={16} aria-hidden />
                  </Button>
                </Link>
              </span>
              <Link href="/signup">
                <Button variant="ghost" size="lg" fullWidth>
                  {t('pricingStart')}
                </Button>
              </Link>
              <p className="text-[11px] text-text-muted text-center">{t('pricingStartNote')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
