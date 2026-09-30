'use client';

import { useTranslations } from 'next-intl';

/** P22 — the how-it-works ritual, rebuilt as the page's signature pinned
 *  scene (gsap-web3gl-scrollytelling): on desktop the section pins for
 *  300vh and the three steps travel horizontally, scrubbed by scroll, with
 *  a progress rule filling underneath. Glassmorphism step cards. On mobile
 *  it restructures into a vertical stack instead of shrinking. All motion
 *  is driven by <CinematicFlow /> via the data-cx stage/track/progress
 *  attributes. */
export function HowItWorks() {
  const t = useTranslations('sections');
  const STEPS = [
    { n: '01', title: t('how1Title'), body: t('how1Body') },
    { n: '02', title: t('how2Title'), body: t('how2Body') },
    { n: '03', title: t('how3Title'), body: t('how3Body') },
  ];
  return (
    <section className="border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-20 md:pt-24">
        <p className="eyebrow text-center mb-4">
          {t('howEyebrow')}
        </p>
        <h2 data-cx="words" className="text-center text-2xl md:text-3xl font-bold tracking-tight">
          {t('howTitle')}
        </h2>
      </div>

      {/* Desktop: pinned horizontal story stage — ScrollTrigger pins the
          viewport-height scene for 250% of scroll (CSS position:sticky is
          broken by the page-level overflow-x rules, so the engine pins it). */}
      <div data-cx="stage" className="hidden lg:block relative mt-6">
        <div data-cx="stage-inner" className="h-screen overflow-hidden flex items-center">
          <ol
            data-cx="track"
            className="flex h-full items-center w-max shrink-0"
          >
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="w-screen h-full shrink-0 flex items-center justify-center px-16 xl:px-24"
              >
                <div className="w-full max-w-[460px] rounded-[24px] border border-border-default bg-surface-overlay/80 backdrop-blur-xl p-10 shadow-card">
                  <span className="font-mono text-[4.5rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-primary/60 to-brand-action/40 block mb-5">
                    {s.n}
                  </span>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{s.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Progress rule — fills as the ritual advances */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[3px] rounded-full bg-border-subtle overflow-hidden">
            <div
              data-cx="progress"
              className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-action"
            />
          </div>
        </div>
      </div>
      {/* Mobile / tablet: vertical stack */}
      <ol
        data-cx="rise"
        className="lg:hidden grid grid-cols-1 gap-6 max-w-[560px] mx-auto px-6 pt-12 pb-20"
      >
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="relative rounded-card border border-border-default bg-surface-overlay p-7 shadow-card"
          >
            <span className="font-mono text-3xl font-bold text-brand-primary/40 block mb-3">
              {s.n}
            </span>
            <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
