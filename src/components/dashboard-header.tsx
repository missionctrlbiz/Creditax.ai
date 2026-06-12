'use client';

import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  tokensUsed?: number;
  tokenLimit?: number;
  onMenuClick?: () => void;
  menuOpen?: boolean;
}

function getTokenColor(used: number, limit: number): string {
  const percentage = (used / limit) * 100;
  if (percentage >= 90) return 'text-[var(--color-error-text)] bg-[var(--color-error-bg)]';
  if (percentage >= 70) return 'text-[var(--color-warning-text)] bg-[var(--color-warning-bg)]';
  return 'text-[var(--color-success-text)] bg-[var(--color-success-bg)]';
}

export function DashboardHeader({
  title,
  tokensUsed = 23,
  tokenLimit = 50,
  onMenuClick,
  menuOpen,
}: DashboardHeaderProps) {
  const tokenPercentage = Math.round((tokensUsed / tokenLimit) * 100);

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-raised border-b border-border-default flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--color-hover-overlay)] transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <h1 className="text-lg font-semibold text-text-primary hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-mono font-semibold border',
            getTokenColor(tokensUsed, tokenLimit)
          )}
        >
          <span>{tokensUsed}/{tokenLimit}</span>
          <span className="hidden sm:inline">tokens</span>
          <span className="text-[10px] opacity-70">({tokenPercentage}%)</span>
        </div>
      </div>
    </header>
  );
}