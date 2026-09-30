export function getCSSToken(varName: string): string {
  if (typeof window === 'undefined') return ''; // Avoid SSR issues
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

export const tokens = {
  get brandPrimary()  { return getCSSToken('--color-brand-primary'); },
  get brandAction()   { return getCSSToken('--color-brand-action'); },
  get textPrimary()   { return getCSSToken('--color-text-primary'); },
  get textSecondary() { return getCSSToken('--color-text-secondary'); },
  get surfaceBase()   { return getCSSToken('--color-surface-base'); },
  get surfaceOverlay(){ return getCSSToken('--color-surface-overlay'); },
  get borderDefault() { return getCSSToken('--color-border-default'); },
  get success()       { return getCSSToken('--color-success'); },
  get warning()       { return getCSSToken('--color-warning'); },
  get error()         { return getCSSToken('--color-error'); },
};
