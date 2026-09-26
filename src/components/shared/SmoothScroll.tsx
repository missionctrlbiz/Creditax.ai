'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * P21 — Lenis smooth scrolling for the landing page, wired into GSAP's
 * ticker so ScrollTrigger scrub animations and the wheel share one clock.
 * Native scroll position is preserved (anchors, deep links and the browser
 * UI all keep working); the wheel simply glides instead of stepping.
 *
 * Deliberately ALWAYS-ON: the demo owner explicitly wants the flowing
 * scroll regardless of the OS reduced-motion setting (the in-app browser
 * reports reduce:true, which suppressed the first attempt entirely).
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // Debug/automation handle — lets tests drive the scroll through Lenis's
    // own animation loop instead of fighting it with native jumps.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
