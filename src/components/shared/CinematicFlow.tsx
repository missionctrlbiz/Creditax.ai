'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * P22 — cinematic scroll engine for the landing page, applied to the whole
 * run (hero → newsletter). Distilled from the gsap-web3gl-scrollytelling
 * skill: scroll is the timeline, every device is position-driven (short scrub
 * ranges), so anchor jumps and deep links always land on a resolved page.
 *
 * Devices (declarative via data-cx attributes; SSR HTML is untouched):
 *
 *   [data-cx="hero"]        load timeline — word-assemble headline, staged
 *                           entrance for badge/sub/CTAs/chips/visual/glow
 *   [data-cx="words"]       headline word reveal (split + blur-to-sharp, scrub)
 *   [data-cx="rise"]        children rise + de-blur in stagger (scrub)
 *   [data-cx="rise-side"]   same, sliding in from the right (flip layouts)
 *   [data-cx="mask"]        clip-path wipe + scale settle on imagery (scrub)
 *   [data-cx="parallax"]    image drifts vertically inside an overscaled frame
 *   [data-cx="pan"]         image pans horizontally inside an overscaled frame
 *   [data-cx="stack-card"]  stacked-card deck: pins at viewport top
 *                           (pinSpacing:false) so the next card slides over
 *                           it; the covered card scales down + dims. Last
 *                           card stays in flow.
 *   [data-cx="settle"]      closing section resolves and holds still
 *   [data-cx="stage"]       pinned horizontal story stage: sticky viewport +
 *                           tall container; [data-cx="track"] is scrubbed
 *                           sideways, [data-cx="progress"] fills a bar
 *   [data-cx="magnetic"]    magnetic buttons (pointer-follow, desktop only)
 *
 * Plus one ambient cursor spotlight over the whole page (pointer:fine only).
 *
 * Pairs with <SmoothScroll /> (Lenis synced to the GSAP ticker). Motion is
 * always-on per the demo owner's explicit ask (the in-app browser reports
 * prefers-reduced-motion: reduce, which suppressed the first attempt); scrub
 * smoothing keeps vestibular impact low.
 */

function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      for (const word of text.split(/(\s+)/)) {
        if (!word.trim()) {
          frag.appendChild(document.createTextNode(word));
          continue;
        }
        const span = document.createElement('span');
        span.className = 'cx-word';
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity, filter';
        span.textContent = word;
        frag.appendChild(span);
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.firstChild) {
      Array.from(node.childNodes).forEach(walk);
    }
  };
  Array.from(el.childNodes).forEach(walk);
}

export function CinematicFlow() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile URL-bar show/hide resizes the viewport constantly; without this
    // every resize fires a full ScrollTrigger.refresh mid-scroll (jank).
    ScrollTrigger.config({ ignoreMobileResize: true });

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // ── Hero: cinematic load sequence ────────────────────────────────
      // fromTo (NOT from): end-states are explicit, so even if two effect
      // setups ever overlap (StrictMode/HMR remount, throttled ticker), every
      // run resolves to VISIBLE. A `.from()` records its end-state from the
      // live DOM — if a previous run left targets mid-flight at opacity ~0,
      // the new run would "complete" to hidden and the hero would flash then
      // disappear forever. That is the exact failure this guards against.
      const hero = document.querySelector<HTMLElement>('[data-cx="hero"]');
      if (hero) {
        const h1 = hero.querySelector('h1');
        if (h1 && !h1.dataset.cxSplit) {
          // Mark BEFORE splitting so a re-entrant setup can never nest spans.
          h1.dataset.cxSplit = '1';
          splitWords(h1);
        }
        const heroTargets = hero.querySelectorAll('[data-cx-hero], .cx-word');
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(hero.querySelectorAll('[data-cx-hero="glow"]'),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' })
          .fromTo(hero.querySelectorAll('[data-cx-hero="badge"]'),
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 }, '-=1.1')
          .fromTo(hero.querySelectorAll('.cx-word'),
            { y: '0.7em', opacity: 0, filter: 'blur(8px)' },
            { y: '0em', opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.045 }, '-=0.4')
          .fromTo(hero.querySelectorAll('[data-cx-hero="sub"]'),
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
          .fromTo(hero.querySelectorAll('[data-cx-hero="ctas"]'),
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 }, '-=0.45')
          .fromTo(hero.querySelectorAll('[data-cx-hero="chips"]'),
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
          .fromTo(hero.querySelectorAll('[data-cx-hero="visual"]'),
            { scale: 0.92, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8');
        // Leave the DOM clean after the run: no lingering inline opacity /
        // transform / blur (cheaper compositing, no stale hidden states).
        // Scoped to GSAP-injected props only — splitWords' own
        // display/will-change on .cx-word is preserved.
        const settleHero = () => {
          gsap.set(heroTargets, { clearProps: 'opacity,visibility,transform,filter,scale' });
        };
        tl.eventCallback('onComplete', settleHero);
        // Safety net, timer-based (rAF-independent): if the ticker ever
        // stalls or the timeline is interrupted, the hero can never be left
        // hidden — force-resolve visibility a beat after the run's duration.
        const safety = window.setTimeout(settleHero, 4000);
        cleanups.push(() => window.clearTimeout(safety));
      }

      // ── Headline word reveals (scrubbed → jump-proof) ────────────────
      gsap.utils.toArray<HTMLElement>('[data-cx="words"]').forEach((node) => {
        if (!node.dataset.cxSplit) {
          splitWords(node);
          node.dataset.cxSplit = '1';
        }
        const words = node.querySelectorAll('.cx-word');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { y: '0.6em', opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'none',
            stagger: 0.05,
            scrollTrigger: { trigger: node, start: 'top 88%', end: 'top 52%', scrub: 0.5 },
          }
        );
      });

      // ── Staged rises: children of the node, staggered ────────────────
      const rise = (selector: string, fromVars: gsap.TweenVars) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((node) => {
          gsap.fromTo(
            Array.from(node.children),
            { ...fromVars, opacity: 0, filter: 'blur(6px)' },
            {
              x: 0,
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'none',
              stagger: 0.06,
              scrollTrigger: { trigger: node, start: 'top 90%', end: 'top 55%', scrub: 0.5 },
            }
          );
        });
      };
      rise('[data-cx="rise"]', { y: 28 });
      // Side-slides read cramped on narrow screens — phones get a rise.
      const narrow = window.innerWidth < 1024;
      rise('[data-cx="rise-side"]', narrow ? { y: 28 } : { x: 56 });

      // ── Imagery devices ──────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-cx="mask"]').forEach((node) => {
        gsap.fromTo(
          node,
          { clipPath: 'inset(14% 10% 14% 10% round 20px)', scale: 1.06 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 20px)',
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top 92%', end: 'top 42%', scrub: 0.6 },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-cx="parallax"]').forEach((node) => {
        gsap.set(node, { scale: 1.15 });
        gsap.fromTo(
          node,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-cx="pan"]').forEach((node) => {
        gsap.set(node, { scale: 1.12 });
        gsap.fromTo(
          node,
          { xPercent: -3.5 },
          {
            xPercent: 3.5,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          }
        );
      });

      // ── Stacked card deck (For Individuals → For SMEs) ───────────────
      // Desktop (lg+) only: each card pins at the viewport top with
      // pinSpacing:false so the next card slides over it; the covered card
      // recedes (scale + dim) while the incoming one travels up. The last
      // card stays in flow so the run resolves instead of pinning forever.
      // On mobile the cards flow vertically with the standard reveals —
      // pinning a card taller than a phone viewport pushes its content out
      // of view before the next card covers it (scroll-craft: mobile is
      // restructured, not shrunk).
      const stackCards = gsap.utils.toArray<HTMLElement>('[data-cx="stack-card"]');
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        stackCards.forEach((card, i) => {
          if (i === stackCards.length - 1) return;
          ScrollTrigger.create({
            trigger: card,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
            // Force fixed pinning: on touch-capable browsers ST defaults to
            // transform pinning, which translates pinned cards a full
            // viewport down and lets sections slide UNDER each other.
            pinType: 'fixed',
            anticipatePin: 1,
          });
          const next = stackCards[i + 1];
          // Scale the inner wrapper, never the pinned card itself — the
          // recede tween must not write transform on the pinned element.
          gsap.fromTo(
            card.querySelector('[data-cx="stack-inner"]') ?? card,
            { scale: 1 },
            {
              scale: 0.95,
              ease: 'none',
              scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.5 },
            }
          );
          gsap.fromTo(
            card,
            { filter: 'brightness(1)' },
            {
              filter: 'brightness(0.65)',
              ease: 'none',
              scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.5 },
            }
          );
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-cx="settle"]').forEach((node) => {
        gsap.fromTo(
          node,
          { y: 40, scale: 0.97, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top 88%', end: 'top 48%', scrub: 0.5 },
          }
        );
      });

      // ── Pinned horizontal story stage ────────────────────────────────
      // ScrollTrigger pin (position:fixed) instead of CSS sticky — the
      // page-level overflow-x rules make sticky unreliable in Chromium.
      // Desktop only: the stage is hidden below lg (mobile gets the
      // vertical stack), and a trigger on a display:none element is garbage.
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-cx="stage"]').forEach((stage) => {
          const inner = stage.querySelector<HTMLElement>('[data-cx="stage-inner"]');
          const track = stage.querySelector<HTMLElement>('[data-cx="track"]');
          if (!inner || !track) return;
          const panels = track.children.length;
          if (panels < 2) return;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: '+=250%',
            scrub: 0.6,
            pin: inner,
            pinType: 'fixed',
            anticipatePin: 1,
            },
          });
          tl.to(track, { xPercent: (-100 * (panels - 1)) / panels, ease: 'none' }, 0);
          const progress = stage.querySelector<HTMLElement>('[data-cx="progress"]');
          if (progress) {
            tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
          }
        });
      });

      // ── Pointer polish: magnetic buttons + cursor spotlight ─────────
      if (window.matchMedia('(pointer: fine)').matches) {
        // NOTE: previously this shadowed the outer `cleanups` array, so the
        // listeners + spotlight div leaked on every effect remount (dev
        // StrictMode / HMR stacked duplicate fixed overlays). Push one
        // combined disposer to the outer array instead.
        const pointerCleanups: Array<() => void> = [];
        cleanups.push(() => pointerCleanups.forEach((fn) => fn()));

        gsap.utils.toArray<HTMLElement>('[data-cx="magnetic"]').forEach((btn) => {
          const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
          const move = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.3);
            yTo((e.clientY - r.top - r.height / 2) * 0.3);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          btn.addEventListener('mousemove', move);
          btn.addEventListener('mouseleave', leave);
          pointerCleanups.push(() => {
            btn.removeEventListener('mousemove', move);
            btn.removeEventListener('mouseleave', leave);
          });
        });

        const spot = document.createElement('div');
        spot.setAttribute('aria-hidden', 'true');
        spot.style.cssText = [
          'position:fixed',
          'top:0',
          'left:0',
          'width:640px',
          'height:640px',
          'pointer-events:none',
          'z-index:40',
          'mix-blend-mode:screen',
          'border-radius:50%',
          'background:radial-gradient(circle, rgba(13,115,119,0.14) 0%, rgba(50,232,117,0.05) 45%, transparent 70%)',
        ].join(';');
        document.body.appendChild(spot);
        gsap.set(spot, { xPercent: -50, yPercent: -50, x: -9999, y: -9999 });
        const sx = gsap.quickTo(spot, 'x', { duration: 0.55, ease: 'power3.out' });
        const sy = gsap.quickTo(spot, 'y', { duration: 0.55, ease: 'power3.out' });
        const spotMove = (e: MouseEvent) => {
          sx(e.clientX);
          sy(e.clientY);
        };
        window.addEventListener('mousemove', spotMove);
        pointerCleanups.push(() => {
          window.removeEventListener('mousemove', spotMove);
          spot.remove();
        });
      }
    });

      // ── Late-layout hardening ──────────────────────────────────────
      // Pin + scrub positions are measured at setup; webfont swaps and
      // late image decodes shift layout afterwards, which strands LATER
      // triggers (mid-deck onward) at stale positions — cards that never
      // pin or never reveal. Re-measure once everything settles.
      const lateRefresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', lateRefresh);
      cleanups.push(() => window.removeEventListener('load', lateRefresh));
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(lateRefresh).catch(() => {});
      }

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  // Debug/automation handle: lets headless checks read trigger state.
  useLayoutEffect(() => {
    (window as unknown as { __cxDebug?: () => unknown }).__cxDebug = () => ({
      triggers: ScrollTrigger.getAll().map((t) => ({
        start: Math.round(t.start),
        end: Math.round(t.end),
        progress: +t.progress.toFixed(3),
        pinned: !!(t as { pin?: unknown }).pin,
        isActive: t.isActive,
        pinType: (t as unknown as { pinType?: string }).pinType,
        spacer: !!(t as unknown as { spacer?: unknown }).spacer,
      })),
      scrollY: Math.round(window.scrollY),
      isTouch: ScrollTrigger.isTouch !== 0,
    });
  }, []);

  return null;
}
