'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDown, LayoutDashboard, LogOut, Settings, Shield, User } from 'lucide-react';
import { getSession, logout, ROLE_HOME, type PortalRole } from '@/lib/mock-auth';
import { cn } from '@/lib/utils';

const ALL_ROLES: { role: PortalRole; label: string }[] = [
  { role: 'personal', label: 'Personal' },
  { role: 'pro', label: 'Tax Pro' },
  { role: 'admin', label: 'Admin' },
];

const DEMO_NAMES: Record<PortalRole, string> = {
  personal: 'Emeka O.',
  pro: 'Ayo Ogundimu',
  admin: 'Admin O.',
};

function initialsFrom(email: string | null, role: PortalRole): string {
  if (role === 'admin') return 'AO';
  if (email && email !== 'demo@creditax.ai') {
    const local = email.split('@')[0];
    const parts = local.split(/[._-]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return local.slice(0, 2).toUpperCase();
  }
  return role === 'pro' ? 'AO' : 'EO';
}

/**
 * The ONE account menu used across personal, pro and admin boards.
 * Opens only from the circular avatar. Shows demo name + email,
 * portal switchers and log out.
 */
export function AccountMenu({
  defaultRole,
  size = 36,
  className,
}: {
  defaultRole?: PortalRole;
  size?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const session = getSession();
  const role: PortalRole = session.role ?? defaultRole ?? 'personal';
  const name = DEMO_NAMES[role];
  const email = session.email ?? 'demo@creditax.ai';
  const initials = initialsFrom(session.email, role);

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`Account menu — ${name}`}
          aria-haspopup="menu"
          aria-expanded={open}
          className={cn(
            'relative rounded-full ring-2 ring-transparent hover:ring-brand-primary-border',
            'transition-all duration-150 cursor-pointer outline-none',
            'focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]',
            className
          )}
          style={{ width: size, height: size }}
        >
          <span
            className="absolute inset-0 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center font-semibold"
            style={{ fontSize: size * 0.36 }}
          >
            {initials}
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand-action border-2 border-surface-raised" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          sideOffset={10}
          align="end"
          className="z-[80] min-w-[240px] rounded-xl border border-border-default bg-surface-overlay p-1.5 shadow-card data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="px-3 py-2.5 border-b border-border-subtle mb-1">
            <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
            <p className="text-xs text-text-muted truncate">{email}</p>
          </div>

          {ALL_ROLES.map(({ role: r, label }) => {
            const current = r === role;
            return (
              <DropdownMenuPrimitive.Item key={r} asChild>
                <Link
                  href={ROLE_HOME[r]}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer',
                    'text-text-secondary hover:text-text-primary hover:bg-hover-overlay outline-none',
                    current && 'text-brand-primary font-medium bg-brand-primary-bg/50'
                  )}
                >
                  {r === 'personal' && <User size={15} />}
                  {r === 'pro' && <LayoutDashboard size={15} />}
                  {r === 'admin' && <Shield size={15} />}
                  <span className="flex-1">{label} dashboard</span>
                  {current && <span className="w-1.5 h-1.5 rounded-full bg-brand-action" />}
                </Link>
              </DropdownMenuPrimitive.Item>
            );
          })}

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border-subtle" />

          <DropdownMenuPrimitive.Item asChild>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-hover-overlay cursor-pointer outline-none"
            >
              <Settings size={15} /> Settings
            </Link>
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Item asChild>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-error-text hover:bg-error-bg cursor-pointer outline-none data-[highlighted]:text-error-text"
            >
              <LogOut size={15} /> Log out
            </button>
          </DropdownMenuPrimitive.Item>

          <div className="px-3 pt-1.5 pb-1 border-t border-border-subtle mt-1 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Demo build</span>
            <ChevronDown size={12} className="text-text-muted" />
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

/** Display name for the current (or given) demo account — for headers that show it beside the avatar. */
export function AccountName({ defaultRole }: { defaultRole?: PortalRole }) {
  const session = getSession();
  const role: PortalRole = session.role ?? defaultRole ?? 'personal';
  return <span className="text-sm font-medium text-text-primary">{DEMO_NAMES[role]}</span>;
}

export { DEMO_NAMES };
