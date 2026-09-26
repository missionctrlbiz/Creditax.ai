'use client';

import { useTranslations } from 'next-intl';
import { CountUp } from '@/components/ui/CountUp';
import { Landmark, Gauge, Languages, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** P21 — the stat strip was plain mono figures; now each stat carries an icon
 *  chip, a display-face figure (Syne via .stat-number) and a gradient rule.
 *  The languages stat renders stacked language chips (avatar style) instead of
 *  a bare "4". */
function LangStack() {
  const langs = ['EN', 'YO', 'HA', 'IG'];
  return (
    <div className="stat-number flex items-center justify-center text-[2rem] md:text-[2.25rem]" aria-label="4 languages: English, Yoruba, Hausa, Igbo">
      {langs.map((l, i) => (
        <span
          key={l}
          className={`inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-surface-raised bg-brand-primary-bg text-brand-primary font-sans text-[12px] md:text-[13px] font-bold ${
            i > 0 ? '-ml-3' : ''
          } ${i === 0 ? 'bg-surface-overlay text-text-primary' : ''}`}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

export function StatsSection() {
  const t = useTranslations('sections');
  const STATS: Array<{
    end: number;
    suffix: string;
    label: string;
    decimals: number;
    icon: LucideIcon;
    custom?: 'langs';
  }> = [
    { end: 9, suffix: '', label: t('stat1Label'), decimals: 0, icon: Landmark },
    { end: 2.5, suffix: 's', label: t('stat2Label'), decimals: 1, icon: Gauge },
    { end: 4, suffix: '', label: t('stat3Label'), decimals: 0, icon: Languages, custom: 'langs' },
    { end: 99.9, suffix: '%', label: t('stat4Label'), decimals: 1, icon: ShieldCheck },
  ];
  return (
    <section className="py-16 md:py-20 border-t border-border-subtle bg-surface-raised">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div
          data-cx="rise"
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1100px] mx-auto text-center"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-brand-primary-bg border border-brand-primary-border grid place-items-center text-brand-primary">
                <s.icon size={15} aria-hidden />
              </span>
              {s.custom === 'langs' ? (
                <LangStack />
              ) : (
                <div className="stat-number text-[2rem] md:text-[2.25rem] text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-action">
                  <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} duration={1.4} />
                </div>
              )}
              <p className="text-text-secondary text-[13px] max-w-[180px] leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
