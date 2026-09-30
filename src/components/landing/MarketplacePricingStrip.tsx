'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
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

        {/* Pricing preview */}
        <div
          data-cx="settle"
          className="rounded-[20px] border border-border-default bg-surface-raised p-8 md:p-10 shadow-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="eyebrow mb-3">
                {t('pricingEyebrow')}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                {t('pricingTitle')}
              </h2>
              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <Badge variant="brand">Free forever tier</Badge>
                <span className="price-display text-5xl text-text-primary">
                  <span className="naira">₦</span>0
                </span>
                <span className="text-text-secondary text-sm">/month to start</span>
              </div>
              <p className="text-text-secondary text-sm max-w-[480px] leading-relaxed">
                Daily agent chats, tax calculations, and uploads on the free plan.
                Plus and Pro unlock BVN verification, bulk tools, and higher limits —
                all priced in naira.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span data-cx="magnetic" className="block">
                <Link href="/pricing">
                  <Button variant="primary" size="lg" fullWidth>
                    {t('pricingCta')}
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
