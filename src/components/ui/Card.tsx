import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'teal' | 'green' | 'red' | 'amber' | 'none';
  elevated?: boolean;
}

export function Card({ className, accent = 'none', elevated = false, ...props }: CardProps) {
  const accentMap = {
    teal:  'border-l-4 border-l-border-brand bg-brand-primary-bg/40',
    green: 'border-border-action border-1.5',
    red:   'border-[var(--color-error-border)] border-1.5',
    amber: 'border-[var(--color-warning-border)] border-1.5',
    none:  'border-border-default',
  };

  return (
    <div
      className={cn(
        'bg-surface-overlay rounded-card border shadow-card',
        'transition-all duration-150',
        accentMap[accent],
        elevated && 'shadow-modal',
        className
      )}
      {...props}
    />
  );
}
