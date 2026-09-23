'use client';

import { useTranslations } from 'next-intl';
import { CountUp } from '@/components/ui/CountUp';

export function StatsSection() {
  const t = useTranslations('sections');
  const STATS = [
    { end: 9, suffix: '', label: t('stat1Label'), decimals: 0 },
    { end: 2.5, suffix: 's', label: t('stat2Label'), decimals: 1 },
    { end: 4, suffix: '', label: t('stat3Label'), decimals: 0 },
    { end: 99.9, suffix: '%', label: t('stat4Label'), decimals: 1 },
  ];
  return (
    <section className="py-16 md:py-20 border-t border-border-subtle bg-surface-raised">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1100px] mx-auto text-center">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div className="stat-number font-mono text-[2rem] md:text-[2.25rem] font-bold text-text-primary tracking-tight">
                <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} duration={1.4} />
              </div>
              <p className="text-text-secondary text-[13px] max-w-[180px] leading-snug">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
