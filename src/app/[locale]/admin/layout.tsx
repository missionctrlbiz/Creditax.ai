'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppShell, ADMIN_NAV, type NavItem } from '@/components/shell/AppShell';
import { getSession } from '@/lib/auth';
import type { UnifiedSession } from '@/lib/auth';

function titleFromPath(pathname: string, nav: NavItem[]): string {
  const match = nav
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? 'Dashboard';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // P7 role-gate: single session source (pb-auth with mock fallback via
  // src/lib/auth.ts). Admin + Author (scoped content grant) live here.
  const [gate, setGate] = useState<'loading' | 'ok' | 'bounced'>('loading');
  const [session, setSession] = useState<UnifiedSession | null>(null);

  useEffect(() => {
    let active = true;
    getSession().then((s) => {
      if (!active) return;
      setSession(s);
      setGate(s.role === 'admin' || s.role === 'author' ? 'ok' : 'bounced');
    });
    return () => {
      active = false;
    };
  }, []);

  if (gate === 'bounced') {
    const home = session?.role === 'tax_pro' ? '/pro/dashboard' : '/dashboard';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-text-secondary">This board requires <b>Admin</b> or <b>Author</b> access.</p>
        <Link href={home} className="text-brand-primary font-semibold hover:underline">Go to your portal →</Link>
      </div>
    );
  }
  if (gate === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">Loading…</div>;
  }

  return (
    <AppShell
      portal="admin"
      nav={ADMIN_NAV}
      title={titleFromPath(pathname, ADMIN_NAV)}
      eyebrow="admin"
      searchPlaceholder="Search users, pros, logs…"
    >
      {children}
    </AppShell>
  );
}
