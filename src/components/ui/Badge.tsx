import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge text-[11px] font-bold border',
  {
    variants: {
      variant: {
        success: 'bg-success-bg border-success-border text-success-text',
        warning: 'bg-warning-bg border-warning-border text-warning-text',
        error: 'bg-error-bg border-error-border text-error-text',
        info: 'bg-info-bg border-info-border text-info-text',
        brand: 'bg-brand-primary-bg border-brand-primary-border text-brand-primary',
      },
    },
    defaultVariants: {
      variant: 'brand',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
