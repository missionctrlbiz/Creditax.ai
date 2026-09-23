'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDown, LayoutDashboard, LogOut, Settings, Shield, User } from 'lucide-react';
import { getSession, ROLE_HOME, type PortalRole } from '@/lib/mock-auth';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/utils';

const ALL_ROLES: { role: PortalRole; label: string }[] = [
  { role: 'personal', label: 'Personal' },
  { role: 'pro', label: 'Tax Pro' },
  { role: 'admin', label: 'Admin' },
  { role: 'author', label: 'Author' },
];

const DEMO_NAMES: Record<PortalRole, string> = {
  personal: 'Emeka O.',
  pro: 'Ayo Ogundimu',
  admin: 'Admin O.',
  author: 'Nneka Eze',
};

/** Demo avatar picture per portal (generated images in /public/images/avatars). */
const DEMO_AVATARS: Record<PortalRole, string> = {
  personal: '/images/avatars/avatar-01.png',
  pro: '/images/avatars/avatar-04.png',
  admin: '/images/avatars/avatar-07.png',
  author: '/images/avatars/avatar-05.png',
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
 *
 * Session is read after mount only — SSR renders the default role so
 * client hydration matches (fixes dashboard hydration mismatch).
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
  const [mounted, setMounted] = useState(false);
  const [sessionState, setSessionState] = useState<{ role: PortalRole | null; email: string | null }>({
    role: null,
    email: null,
  });
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionState(getSession());
    setMounted(true);
  }, []);

  const role: PortalRole = mounted && sessionState.role ? sessionState.role : defaultRole ?? 'personal';
  const name = DEMO_NAMES[role];
  const email = mounted && sessionState.email ? sessionState.email : 'demo@creditax.ai';
  const initials = initialsFrom(mounted ? sessionState.email : null, role);
  const avatarSrc = DEMO_AVATARS[role];

  /** Clear the session on both backends (PB + mock), then return to login. */
  function handleLogout() {
    logout();
    if (typeof window !== 'undefined') window.location.href = '/login';
  }

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`Account menu — ${name}`}
          aria-haspopup="menu"
          aria-expanded={open}
          className={cn(
            'relative rounded-full ring-2 ring-transparent hover:ring-brand-primary-border overflow-hidden',
            'transition-all duration-150 cursor-pointer outline-none',
            'focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]',
            className
          )}
          style={{ width: size, height: size }}
        >
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt=""
              width={size}
              height={size}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span
              className="absolute inset-0 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center font-semibold"
              style={{ fontSize: size * 0.36 }}
            >
              {initials}
            </span>
          )}
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
              onClick={handleLogout}
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
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ role: PortalRole | null; email: string | null }>({
    role: null,
    email: null,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(getSession());
    setMounted(true);
  }, []);

  const role: PortalRole = mounted && session.role ? session.role : defaultRole ?? 'personal';
  return <span className="text-sm font-medium text-text-primary">{DEMO_NAMES[role]}</span>;
}

export { DEMO_NAMES, DEMO_AVATARS };
