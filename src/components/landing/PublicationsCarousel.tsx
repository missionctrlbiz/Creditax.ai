'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { blogPosts } from '@/data/blog';

const PUBLICATIONS = blogPosts.slice(0, 6).map((p) => ({
  id: p.id,
  slug: p.slug,
  category: p.category,
  title: p.title,
  excerpt: p.excerpt,
  source: 'Creditax Journal',
  date: p.date,
}));

export function PublicationsCarousel() {
  const t = useTranslations('sections');
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Seed button state one frame later to avoid sync setState in the effect body
    const id = requestAnimationFrame(() => onSelect());
    emblaApi.on('select', onSelect);
    return () => {
      cancelAnimationFrame(id);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 md:py-24 border-t border-border-subtle overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-3">
              {t('pubsEyebrow')}
            </p>
            <h2 className="text-[1.75rem] md:text-[2rem] font-bold tracking-tight">
              {t('pubsTitle')}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
            >
              {t('pubsCta')} <ArrowUpRight size={15} />
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous publications"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                className="w-10 h-10 rounded-btn border border-border-default grid place-items-center text-text-secondary hover:text-text-primary hover:bg-hover-overlay disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next publications"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                className="w-10 h-10 rounded-btn border border-border-default grid place-items-center text-text-secondary hover:text-text-primary hover:bg-hover-overlay disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {PUBLICATIONS.map((p) => (
              <div
                key={p.id}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
              >
                <Link href={`/blog/${p.slug}`} className="block group h-full">
                  <article className="h-full rounded-card border border-border-default bg-surface-overlay p-6 shadow-card flex flex-col gap-3 transition-transform duration-200 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-primary">
                        {p.category}
                      </span>
                      <span className="text-text-muted text-[11px]">{p.date}</span>
                    </div>
                    <h3 className="text-base font-semibold leading-snug line-clamp-3 group-hover:text-brand-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 flex-1">
                      {p.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                      <span className="text-text-muted text-[12px]">{p.source}</span>
                      <ArrowUpRight
                        size={15}
                        className="text-text-muted group-hover:text-brand-primary transition-colors"
                      />
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link href="/blog" className="text-sm font-semibold text-brand-primary hover:underline">
            {t('pubsCta')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
