'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-12 h-6 rounded-full
        bg-surface-inset border border-border
        transition-all duration-200
        focus:outline-none focus:ring-2
        focus:ring-[var(--color-focus-ring)]
        focus:ring-offset-2
        focus:ring-[var(--color-focus-ring-offset)]
      "
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Knob */}
      <span className={`
        absolute left-0.5 top-0.5 w-5 h-5 rounded-full
        flex items-center justify-center
        bg-brand-primary text-text-inverse
        transition-transform duration-200
        ${theme === 'light' ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {theme === 'dark'
          ? <Moon size={10} />
          : <Sun size={10} />
        }
      </span>
    </button>
  );
}
