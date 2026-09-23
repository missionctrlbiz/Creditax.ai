'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/providers/ThemeProvider';

/** Toaster that follows the active theme (light/dark) instead of a fixed dark chrome. */
export function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme === 'light' ? 'light' : 'dark'}
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--color-surface-overlay)',
          border: '1px solid var(--color-border-default)',
          color: 'var(--color-text-primary)',
        },
      }}
    />
  );
}
