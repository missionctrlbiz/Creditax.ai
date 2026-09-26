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

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // ── Hero: cinematic load sequence ────────────────────────────────
      const hero = document.querySelector<HTMLElement>('[data-cx="hero"]');
      if (hero) {
        const h1 = hero.querySelector('h1');
        if (h1 && !h1.dataset.cxSplit) {
          splitWords(h1);
          h1.dataset.cxSplit = '1';
        }
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(hero.querySelectorAll('[data-cx-hero="glow"]'), {
          scale: 0.8,
          opacity: 0,
          duration: 1.4,
          ease: 'power2.out',
        })
          .from(hero.querySelectorAll('[data-cx-hero="badge"]'), {
            y: 14,
            opacity: 0,
            duration: 0.6,
          }, '-=1.1')
          .from(hero.querySelectorAll('.cx-word'), {
            y: '0.7em',
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.8,
            stagger: 0.045,
          }, '-=0.4')
          .from(hero.querySelectorAll('[data-cx-hero="sub"]'), {
            y: 16,
            opacity: 0,
            duration: 0.6,
          }, '-=0.5')
          .from(hero.querySelectorAll('[data-cx-hero="ctas"]'), {
            y: 14,
            opacity: 0,
            duration: 0.6,
          }, '-=0.45')
          .from(hero.querySelectorAll('[data-cx-hero="chips"]'), {
            y: 10,
            opacity: 0,
            duration: 0.5,
          }, '-=0.4')
          .from(hero.querySelectorAll('[data-cx-hero="visual"]'), {
            scale: 0.92,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
          }, '-=0.8');
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
      rise('[data-cx="rise-side"]', { x: 56 });

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
      // Each card pins at the viewport top with pinSpacing:false so the next
      // card slides over it; the covered card recedes (scale + dim) while the
      // incoming one travels up. The last card stays in flow so the run
      // resolves instead of pinning forever.
      const stackCards = gsap.utils.toArray<HTMLElement>('[data-cx="stack-card"]');
      stackCards.forEach((card, i) => {
        if (i === stackCards.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });
        const next = stackCards[i + 1];
        // Scale the inner wrapper, never the pinned card itself — the recede
        // tween must not write transform on the element ScrollTrigger pins.
        gsap.fromTo(
          card.querySelector('[data-cx="stack-inner"]') ?? card,
          { scale: 1 },
          {
            scale: 0.93,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.5 },
          }
        );
        gsap.fromTo(
          card,
          { filter: 'brightness(1)' },
          {
            filter: 'brightness(0.55)',
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.5 },
          }
        );
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
            anticipatePin: 1,
          },
        });
        tl.to(track, { xPercent: (-100 * (panels - 1)) / panels, ease: 'none' }, 0);
        const progress = stage.querySelector<HTMLElement>('[data-cx="progress"]');
        if (progress) {
          tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
        }
      });

      // ── Pointer polish: magnetic buttons + cursor spotlight ─────────
      if (window.matchMedia('(pointer: fine)').matches) {
        const cleanups: Array<() => void> = [];

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
          cleanups.push(() => {
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
        cleanups.push(() => {
          window.removeEventListener('mousemove', spotMove);
          spot.remove();
        });
      }
    });

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
      })),
      scrollY: Math.round(window.scrollY),
    });
  }, []);

  return null;
}
