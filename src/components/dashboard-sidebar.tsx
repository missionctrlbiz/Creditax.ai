'use client';

import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react';
import { DashboardNav } from './dashboard-nav';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  collapsed?: boolean;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
}

export function DashboardSidebar({
  collapsed = false,
  userName = 'Emeka O.',
  userEmail = 'emeka@creditax.ai',
  userInitials = 'EO',
}: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-surface-raised border-r border-border-default transition-all duration-300',
        'max-lg:translate-x-full',
        collapsed ? 'w-[72px]' : 'w-[250px]'
      )}
    >
      <div className={cn('flex items-center h-16 px-4', collapsed ? 'justify-center' : 'gap-3')}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-text-inverse" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-text-primary tracking-tight">
              Creditax
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <DashboardNav collapsed={collapsed} />
      </div>

      <div className={cn('p-3 border-t border-border-default', collapsed && 'p-2')}>
        {!collapsed ? (
          <div className="bg-surface-overlay rounded-xl p-4 border border-border-default">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-[13px] font-bold text-text-inverse">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-text-primary truncate">{userName}</p>
                <p className="text-[11px] text-text-muted truncate">{userEmail}</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-[12px] font-medium text-text-secondary border border-border-default hover:bg-[var(--color-hover-overlay)] hover:text-text-primary transition-all">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-[13px] font-bold text-text-inverse cursor-pointer hover:opacity-90 transition-opacity">
              {userInitials}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}