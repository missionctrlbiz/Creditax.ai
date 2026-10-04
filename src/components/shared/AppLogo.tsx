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
 * The single source of truth for the Creditax wordmark — shown on every
 * screen (the shortened mobile CTA gives the header row room).
 * Dark theme → light/monochrome mark (/logo-dark.png).
 * Light theme → teal mark (/logo.png).
 */
export function AppLogo({
  className,
  height = 32,
  linkHome = true,
}: AppLogoProps) {
  const { theme } = useTheme();
  const mounted = useMounted();
  const logoSrc = !mounted || theme === 'dark' ? '/logo-dark.png' : '/logo.png';

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt="Creditax.ai"
      height={height}
      style={{ height }}
      className={cn('w-auto object-contain select-none', className)}
    />
  );

  if (!linkHome) return img;

  return (
    <Link href="/" aria-label="Creditax.ai — back to home" className="inline-flex items-center">
      {img}
    </Link>
  );
}
