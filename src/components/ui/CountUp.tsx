'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  /** Target value to animate to */
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Locale formatting (thousands separators) */
  format?: boolean;
  className?: string;
  /** Restart animation each time it re-enters the viewport */
  once?: boolean;
}

function formatValue(value: number, decimals: number, format: boolean): string {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  const rounded = Math.round(value);
  return format ? rounded.toLocaleString('en-NG') : String(rounded);
}

/**
 * Animates a number from `start` to `end` when it enters the viewport.
 * Respects prefers-reduced-motion (snaps to end value on the next frame).
 */
export function CountUp({
  end,
  start = 0,
  duration = 1.6,
  decimals = 0,
  prefix = '',
  suffix = '',
  format = true,
  className,
  once = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px' });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(start);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    if (reduceMotion) {
      // Defer to the next frame to avoid a synchronous setState in the effect body.
      frameRef.current = requestAnimationFrame(() => setValue(end));
      return () => cancelAnimationFrame(frameRef.current);
    }

    let startTime: number | null = null;
    const delta = end - start;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + delta * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isInView, end, start, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatValue(value, decimals, format)}
      {suffix}
    </span>
  );
}
