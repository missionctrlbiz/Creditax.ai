import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const hasError = typeof error === 'string' ? !!error : error;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            `h-12 w-full rounded-input px-4 font-sans text-sm
             bg-surface-base border text-text-primary
             placeholder:text-text-placeholder
             transition-all duration-150
             focus:outline-none focus:ring-2
             focus:ring-[var(--color-focus-ring)]
             focus:ring-offset-0
             focus:border-brand-primary
             disabled:opacity-40 disabled:cursor-not-allowed`,
            hasError
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error-bg)]'
              : 'border-border-strong',
            className
          )}
          {...props}
        />
        {hint && typeof error === 'string' ? (
          <span className="text-xs text-error-text">{error}</span>
        ) : hint ? (
          <span className="text-xs text-text-muted">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
