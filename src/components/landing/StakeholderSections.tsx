'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { BrandedImage } from '@/components/shared/BrandedImage';

type Stakeholder = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  img: string;
  alt: string;
  flip?: boolean;
};

export function StakeholderSections() {
  const t = useTranslations('sections');
  const STAKEHOLDERS: Stakeholder[] = [
    {
      id: 'consumers',
      eyebrow: t('stake1Eyebrow'),
      title: t('stake1Title'),
      body: t('stake1Body'),
      ctaLabel: t('stake1Cta'),
      ctaHref: '#join',
      img: '/images/sections/section-consumer.jpg',
      alt: 'Nigerian professional reviewing tax documents at a bright desk',
    },
    {
      id: 'tax-pros',
      eyebrow: t('stake2Eyebrow'),
      title: t('stake2Title'),
      body: t('stake2Body'),
      ctaLabel: t('stake2Cta'),
      ctaHref: '/pro/apply',
      img: '/images/sections/section-taxpro.jpg',
      alt: 'Tax professional meeting with a client in a modern office',
      flip: true,
    },
    {
      id: 'partners',
      eyebrow: t('stake3Eyebrow'),
      title: t('stake3Title'),
      body: t('stake3Body'),
      ctaLabel: t('stake3Cta'),
      ctaHref: '/developers',
      img: '/images/sections/section-partners.jpg',
      alt: 'Abstract network of secure API connections',
    },
    {
      id: 'credit',
      eyebrow: t('stake4Eyebrow'),
      title: t('stake4Title'),
      body: t('stake4Body'),
      ctaLabel: t('stake4Cta'),
      ctaHref: '/dashboard/credit',
      img: '/images/sections/section-credit-growth.jpg',
      alt: 'Upward credit growth chart with green accents',
      flip: true,
    },
    {
      id: 'receipts',
      eyebrow: t('stake5Eyebrow'),
      title: t('stake5Title'),
      body: t('stake5Body'),
      ctaLabel: t('stake5Cta'),
      ctaHref: '/dashboard/documents',
      img: '/images/sections/section-receipts.jpg',
      alt: 'Stack of receipts and invoices being processed',
    },
    {
      id: 'sme',
      eyebrow: t('stake6Eyebrow'),
      title: t('stake6Title'),
      body: t('stake6Body'),
      ctaLabel: t('stake6Cta'),
      ctaHref: '/pricing',
      img: '/images/sections/section-sme.jpg',
      alt: 'Small business owner running tax and payroll tasks on a laptop',
      flip: true,
    },
  ];
  return (
    <>
      {STAKEHOLDERS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`py-20 md:py-24 border-t border-border-subtle ${
            i % 2 === 1 ? 'bg-surface-raised' : ''
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                s.flip ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55 }}
              >
                <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
                  {s.eyebrow}
                </p>
                <h2 className="text-[1.75rem] md:text-[2rem] font-bold tracking-tight mb-4 max-w-[520px]">
                  {s.title}
                </h2>
                <p className="text-text-secondary text-base leading-relaxed max-w-[480px] mb-7">
                  {s.body}
                </p>
                {s.ctaHref === '#join' ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      document
                        .querySelector<HTMLButtonElement>('header button[aria-haspopup="dialog"]')
                        ?.click();
                    }}
                  >
                    {s.ctaLabel}
                  </Button>
                ) : (
                  <Link href={s.ctaHref}>
                    <Button variant={s.id === 'partners' ? 'secondary' : 'primary'} size="lg">
                      {s.ctaLabel}
                    </Button>
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="relative"
              >
                <BrandedImage
                  src={s.img}
                  alt={s.alt}
                  className="rounded-[20px] border border-border-default shadow-card aspect-[4/3] bg-surface-inset"
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
