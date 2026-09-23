import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'teal' | 'green' | 'red' | 'amber' | 'none';
  elevated?: boolean;
}

export function Card({ className, accent = 'none', elevated = false, ...props }: CardProps) {
  const accentMap = {
    teal: 'border-l-4 border-l-border-brand bg-brand-primary-bg/40',
    green: 'border-2 border-border-action',
    red: 'border-2 border-error-border',
    amber: 'border-2 border-warning-border',
    none: 'border border-border-default',
  };

  return (
    <div
      className={cn(
        'bg-surface-overlay rounded-card shadow-card',
        'transition-all duration-150',
        accentMap[accent],
        elevated && 'shadow-modal',
        className
      )}
      {...props}
    />
  );
}
