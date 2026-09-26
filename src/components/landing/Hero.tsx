'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { LogoGraphic } from '@/components/shared/LogoGraphic';
import { JoinListModal } from '@/components/marketing/JoinListModal';

/** P22 — cinematic hero: ambient brand glow, word-assembled headline and a
 *  staged entrance driven by <CinematicFlow /> via data-cx attributes; CTAs
 *  are magnetic (pointer-fine devices only). SSR HTML is untouched. */
export function Hero() {
  const t = useTranslations();
  const CHIPS = [t('hero.chip1'), t('hero.chip2'), t('hero.chip3'), t('hero.chip4')];
  return (
    <section data-cx="hero" className="relative pt-6 pb-12 md:pt-10 md:pb-16 overflow-hidden">
      {/* Ambient glow — brand teal falling off to action green, never animated per-frame */}
      <div
        data-cx-hero="glow"
        aria-hidden
        className="absolute -top-48 right-[-12%] w-[760px] h-[760px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(13,115,119,0.18) 0%, rgba(50,232,117,0.06) 42%, transparent 68%)',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-[40%_60%] items-center">
        {/* Left: consumer-first hero content */}
        <div className="relative z-10 max-w-[620px]">
          <div
            data-cx-hero="badge"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-primary-bg border border-brand-primary-border rounded-full text-[11px] font-bold uppercase tracking-[0.12em] text-brand-primary mb-7"
          >
            <span className="w-1.5 h-1.5 bg-brand-action rounded-full animate-pulse" />
            {t('hero.badge')}
          </div>

          <h1
            data-cx-hero="headline"
            className="font-display text-[2.5rem] md:text-[3.25rem] font-bold leading-[1.08] mb-5 tracking-tight"
          >
            {t('hero.title1')}
            <br />
            <span className="text-brand-action">{t('hero.title2')}</span>
          </h1>

          <p
            data-cx-hero="sub"
            className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-[520px] mb-8"
          >
            {t('hero.sub')}
          </p>

          <div data-cx-hero="ctas" className="flex gap-4 flex-wrap">
            <span data-cx="magnetic" className="inline-block">
              <JoinListModal
                trigger={
                  <Button variant="primary" size="lg" aria-haspopup="dialog">
                    {t('hero.cta')}
                  </Button>
                }
              />
            </span>
            <span data-cx="magnetic" className="inline-block">
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  {t('hero.login')}
                </Button>
              </Link>
            </span>
          </div>

          <ul
            data-cx-hero="chips"
            className="flex flex-wrap gap-2 mt-8"
          >
            {CHIPS.map((chip) => (
              <li
                key={chip}
                className="px-3 py-1.5 rounded-full border border-border-subtle bg-surface-raised text-[12px] font-medium text-text-secondary font-mono"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: previous-view LogoNetwork graphic */}
        <div data-cx-hero="visual" className="relative w-full min-h-[300px] md:min-h-[400px] max-md:mt-12 overflow-visible">
          <div className="absolute top-1/2 left-1/2 md:left-auto md:right-0 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 w-[380px] md:w-[600px] lg:w-[680px] aspect-square md:-mr-24 pointer-events-none">
            <LogoGraphic className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
