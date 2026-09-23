'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

interface BrandedImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Size of the green logo badge in px */
  badgeSize?: number;
  loading?: 'lazy' | 'eager';
}

/**
 * Generated image with the Creditax green logo badge overlaid
 * (bottom-right). Satisfies "images must carry the green logo".
 */
export function BrandedImage({
  src,
  alt,
  className,
  imgClassName,
  badgeSize = 36,
  loading = 'lazy',
}: BrandedImageProps) {
  const { theme } = useTheme();
  const logo = theme === 'light' ? '/logo.png' : '/logo-dark.png';

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={cn('w-full h-full object-cover', imgClassName)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      {/* Green logo badge */}
      <div
        className="absolute bottom-3 right-3 rounded-lg bg-black/55 backdrop-blur-sm border border-white/10 p-1.5 grid place-items-center"
        style={{ width: badgeSize + 12, height: badgeSize + 12 }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt=""
          width={badgeSize}
          height={badgeSize}
          style={{ width: badgeSize, height: badgeSize }}
          className="object-contain"
        />
      </div>
    </div>
  );
}
