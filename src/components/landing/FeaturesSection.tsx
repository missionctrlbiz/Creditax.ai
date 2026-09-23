'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export function FeaturesSection() {
  const t = useTranslations('sections');
  const FEATURES = [
    {
      title: t('f1Title'),
      body: t('f1Body'),
      href: '/pricing',
      img: '/images/icons/icon-tax-calc.png',
      alt: 'Tax calculator icon',
      mock: (
        <div className="bg-surface-base rounded-[10px] p-4 border border-border-subtle mt-auto">
          <div className="font-mono text-[12px] leading-relaxed">
            <span className="text-text-muted">{'{'}</span><br />
            &nbsp;&nbsp;<span className="text-brand-primary">&quot;tax&quot;</span>: <span className="text-brand-action">&quot;4,800,000&quot;</span>,<br />
            &nbsp;&nbsp;<span className="text-brand-primary">&quot;rate&quot;</span>: <span className="text-brand-action">0.07</span><br />
            <span className="text-text-muted">{'}'}</span>
          </div>
        </div>
      ),
    },
    {
      title: t('f2Title'),
      body: t('f2Body'),
      href: '/dashboard/chat',
      img: '/images/icons/icon-ai-assistant.png',
      alt: 'AI assistant icon',
      mock: (
        <div className="bg-surface-base rounded-[10px] p-4 border border-border-subtle mt-auto flex flex-col gap-2.5">
          <div className="p-2.5 px-3 rounded-[10px] text-[12px] leading-relaxed bg-brand-primary-bg text-text-primary self-start border-l-2 border-brand-primary">
            Can I claim VAT on imported goods?
          </div>
          <div className="p-2.5 px-3 rounded-[10px] text-[12px] leading-relaxed bg-surface-overlay text-text-secondary self-end border border-border-subtle">
            Under Section 8 of the VAT Act, imported goods are subject to 7.5% VAT...
          </div>
        </div>
      ),
    },
    {
      title: t('f3Title'),
      body: t('f3Body'),
      href: '/dashboard/credit',
      img: '/images/icons/icon-credit-health.png',
      alt: 'Credit health icon',
      mock: (
        <div className="bg-surface-base rounded-[10px] p-4 border border-border-subtle mt-auto">
          <div className="w-full h-16 relative">
            <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <path d="M15 55 A50 50 0 0 1 105 55" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" strokeLinecap="round" />
              <path d="M15 55 A50 50 0 0 1 88 22" fill="none" stroke="url(#gFeat)" strokeWidth="10" strokeLinecap="round" />
              <defs>
                <linearGradient id="gFeat" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0D7377" />
                  <stop offset="100%" stopColor="#32E875" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-1">
              <div className="text-[18px] font-bold text-text-primary leading-none">742</div>
              <div className="text-[9px] text-brand-action">Good Standing</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('f4Title'),
      body: t('f4Body'),
      href: '/dashboard/tax-filing',
      img: '/images/icons/icon-filing.png',
      alt: 'Tax filing icon',
      mock: null,
    },
    {
      title: t('f5Title'),
      body: t('f5Body'),
      href: '/dashboard/documents',
      img: '/images/icons/icon-documents.png',
      alt: 'Documents icon',
      mock: null,
    },
    {
      title: t('f6Title'),
      body: t('f6Body'),
      href: '/marketplace',
      img: '/images/icons/icon-marketplace.png',
      alt: 'Marketplace icon',
      mock: null,
    },
  ];

  return (
    <section id="features" className="py-20 md:py-24 border-t border-border-subtle bg-surface-base">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
          {t('featuresEyebrow')}
        </p>
        <h2 className="text-center text-[1.75rem] md:text-[2rem] font-bold mb-4 tracking-tight">
          {t('featuresTitle')}
        </h2>
        <p className="text-center text-text-secondary text-base max-w-[560px] mx-auto">
          {t('featuresSub')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link href={f.href} className="block h-full group">
                <Card className="p-6 h-full flex flex-col gap-4 transition-transform duration-200 group-hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-14 h-14 rounded-[14px] bg-brand-primary-bg border border-brand-primary-border grid place-items-center overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.img} alt={f.alt} className="w-11 h-11 object-contain" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5">{f.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{f.body}</p>
                  </div>
                  {f.mock}
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
