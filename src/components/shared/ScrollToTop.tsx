'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type LenisHandle = {
  scrollTo: (target: number, options?: { duration?: number }) => void;
};

function getLenis(): LenisHandle | undefined {
  return (window as unknown as { __lenis?: LenisHandle }).__lenis;
}

/**
 * ScrollToTop — floating action that fades in once the reader has moved
 * past the first section (hero) and stays pinned to the viewport corner
 * all the way to the page bottom. Clicking glides back to the top via
 * the Lenis loop when present, otherwise native smooth scroll.
 *
 * Placement is deliberately aligned with the site container rhythm
 * (`px-6 md:px-10`) so the button sits on the same right gutter as the
 * content instead of hugging the raw viewport edge unevenly.
 */
export function ScrollToTop({
  threshold = 600,
  className,
}: {
  /** Scroll distance in px before the button appears. Defaults past hero height. */
  threshold?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setVisible(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: reduceMotion ? 0 : 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={cn(
            'fixed z-[60] bottom-6 right-6 md:bottom-8 md:right-10',
            'flex h-11 w-11 items-center justify-center rounded-full',
            'bg-brand-primary text-text-inverse shadow-modal',
            'border border-border-brand',
            'transition-[filter,transform] duration-150 hover:brightness-110 active:brightness-90 active:scale-95',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
            className
          )}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
