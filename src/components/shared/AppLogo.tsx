'use client';

import { useSyncExternalStore } from 'react';
import { Link } from '@/i18n/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface AppLogoProps {
  className?: string;
  /** Rendered height in px (width auto-scales) */
  height?: number;
  /** Wrap in a link back home (default true) */
  linkHome?: boolean;
}

/**
 * The single source of truth for the Creditax brand mark.
 * - Desktop (sm+): full wordmark — dark theme → /logo-dark.png, light → /logo.png.
 * - Mobile (<sm): a compact 1:1 icon — dark theme → /icon-dark.png (white C),
 *   light → /icon.png (green C) — so the header row stays slim and tappable.
 */
export function AppLogo({
  className,
  height = 32,
  linkHome = true,
}: AppLogoProps) {
  const { theme } = useTheme();
  const mounted = useMounted();
  const dark = !mounted || theme === 'dark';
  const wordmarkSrc = dark ? '/logo-dark.png' : '/logo.png';
  const iconSrc = dark ? '/icon-dark.png' : '/icon.png';

  // Mobile 1:1 icon keeps a small fixed height; desktop uses the `height` prop.
  const mobileHeight = Math.min(height, 28);

  const logos = (
    <>
      {/* Mobile: 1:1 icon only. The responsive display classes live on a
          wrapper <span> because a pre-existing unlayered `img { display:block }`
          rule in globals.css overrides Tailwind's layered `hidden` on <img>. */}
      <span className={cn('sm:hidden inline-flex select-none', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt="Creditax.ai"
          width={mobileHeight}
          height={mobileHeight}
          style={{ width: mobileHeight, height: mobileHeight }}
          className="object-contain"
        />
      </span>
      {/* Desktop: full wordmark */}
      <span className={cn('hidden sm:inline-flex select-none', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wordmarkSrc}
          alt="Creditax.ai"
          height={height}
          style={{ height }}
          className="w-auto object-contain"
        />
      </span>
    </>
  );

  if (!linkHome) return <>{logos}</>;

  return (
    <Link href="/" aria-label="Creditax.ai — back to home" className="inline-flex items-center">
      {logos}
    </Link>
  );
}
