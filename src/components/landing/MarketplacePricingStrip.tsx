'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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
  const n = useTranslations('nav');
  return (
    <section className="py-20 md:py-24 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 space-y-20">
        {/* Marketplace teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-3">
                {t('marketEyebrow')}
              </p>
              <h2 className="text-[1.75rem] md:text-[2rem] font-bold tracking-tight">
                {t('marketTitle')}
              </h2>
              <p className="text-text-secondary text-sm mt-2 max-w-[520px]">{t('marketSub')}</p>
            </div>
            <Link href="/marketplace" className="text-sm font-semibold text-brand-primary hover:underline shrink-0">
              {t('marketCta')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
            <div className="relative rounded-card overflow-hidden border border-border-default bg-surface-inset min-h-[240px] shadow-card">
              <BrandedImage
                src="/images/marketplace/map-lagos.png"
                alt="Stylized map of Lagos with professional pins"
                className="absolute inset-0 w-full h-full opacity-90"
                badgeSize={32}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-surface-overlay border border-border-default text-[12px] font-medium text-text-primary shadow-card">
                <MapPin size={14} className="text-brand-action" />
                Lagos metro · demo pins
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEASER_PROS.map((pro) => (
                <Link key={pro.id} href={`/marketplace/${pro.id}`} className="group">
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
                    <p className="font-mono text-[12px] text-brand-primary font-semibold">{pro.price}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] border border-border-default bg-surface-raised p-8 md:p-10 shadow-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-3">
                {t('pricingEyebrow')}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                {t('pricingTitle')}
              </h2>
              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <Badge variant="brand">Free forever tier</Badge>
                <span className="font-mono text-4xl font-bold text-text-primary">₦0</span>
                <span className="text-text-secondary text-sm">/month to start</span>
              </div>
              <p className="text-text-secondary text-sm max-w-[480px] leading-relaxed">
                Daily agent chats, tax calculations, and uploads on the free plan.
                Plus and Pro unlock BVN verification, bulk tools, and higher limits —
                all priced in naira.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Link href="/pricing">
                <Button variant="primary" size="lg" fullWidth>
                  {t('pricingCta')}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="lg" fullWidth>
                  {n('login')}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
