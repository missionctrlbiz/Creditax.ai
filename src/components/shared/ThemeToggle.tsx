'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Responsive theme control: on mobile it is a compact 44px icon button
 * (sun/moon only — keeps the mobile header row slim); from sm up it is the
 * sliding pill switch. The mobile icon shows the mode you'd switch TO.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextIcon = theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative grid place-items-center bg-surface-inset border border-border transition-all duration-200 cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-2 focus:ring-[var(--color-focus-ring-offset)]',
        // mobile: round icon button · desktop: pill switch
        'w-11 h-11 rounded-full sm:w-12 sm:h-6 sm:rounded-full'
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Mobile: icon only */}
      <span className="sm:hidden text-text-primary">{nextIcon}</span>

      {/* Desktop: sliding knob */}
      <span
        className={cn(
          'hidden sm:flex absolute left-0.5 top-0.5 w-5 h-5 rounded-full',
          'items-center justify-center bg-brand-primary text-text-inverse transition-transform duration-200',
          theme === 'light' ? 'translate-x-6' : 'translate-x-0'
        )}
      >
        {theme === 'dark' ? <Moon size={10} /> : <Sun size={10} />}
      </span>
    </button>
  );
}
