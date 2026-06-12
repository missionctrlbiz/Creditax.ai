import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 font-sans font-semibold
   transition-all duration-150 cursor-pointer select-none
   focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]
   focus:ring-offset-2
   disabled:opacity-40 disabled:cursor-not-allowed`,
  {
    variants: {
      variant: {
        primary: `
          bg-brand-action text-text-inverse
          shadow-btn-action
          hover:brightness-105 active:brightness-95
        `,
        secondary: `
          bg-transparent text-brand-primary
          border border-border-brand
          hover:bg-brand-primary-bg
        `,
        ghost: `
          bg-transparent text-text-primary
          border border-border-strong
          hover:bg-[var(--color-hover-overlay)]
        `,
        brand: `
          bg-brand-primary text-text-inverse
          shadow-btn-brand
          hover:brightness-110 active:brightness-90
        `,
        danger: `
          bg-transparent text-[var(--color-error-text)]
          border border-[var(--color-error-border)]
          hover:bg-[var(--color-error-bg)]
        `,
        link: `
          bg-transparent text-brand-primary underline-offset-4
          hover:underline p-0 h-auto
        `,
      },
      size: {
        sm:  'h-8  px-4  text-xs  rounded-btn',
        md:  'h-10 px-6  text-sm  rounded-btn',
        lg:  'h-12 px-7  text-base rounded-btn',
        xl:  'h-14 px-8  text-base rounded-btn',
        icon: 'h-10 w-10 rounded-btn',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
