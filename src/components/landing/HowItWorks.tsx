'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const t = useTranslations('sections');
  const STEPS = [
    { n: '01', title: t('how1Title'), body: t('how1Body') },
    { n: '02', title: t('how2Title'), body: t('how2Body') },
    { n: '03', title: t('how3Title'), body: t('how3Body') },
  ];
  return (
    <section className="py-20 md:py-24 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
          {t('howEyebrow')}
        </p>
        <h2 className="text-center text-[1.75rem] md:text-[2rem] font-bold mb-12 tracking-tight">
          {t('howTitle')}
        </h2>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative rounded-card border border-border-default bg-surface-overlay p-7 shadow-card"
            >
              <span className="font-mono text-3xl font-bold text-brand-primary/40 block mb-3">
                {s.n}
              </span>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
