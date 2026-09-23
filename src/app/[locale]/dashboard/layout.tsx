'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppShell, PERSONAL_NAV, type NavItem } from '@/components/shell/AppShell';
import { getSession } from '@/lib/mock-auth';

function titleFromPath(pathname: string, nav: NavItem[]): string {
  const match = nav
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? 'Dashboard';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // P1 role-gate: only the consumer role lives here; pro/admin/author bounce
  // to their own board. Rendered after mount so SSR and client stay in sync.
  const [gate, setGate] = useState<'loading' | 'ok' | 'bounced'>('loading');
  useEffect(() => {
    const s = getSession();
    // author/admin/pro have their own boards; consumer (or unsigned) stays here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGate(s.role === 'pro' || s.role === 'admin' ? 'bounced' : 'ok');
  }, []);

  if (gate === 'bounced') {
    const s = getSession();
    const home = s.role === 'pro' ? '/pro/dashboard' : '/admin/dashboard';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-text-secondary">This dashboard is for the <b>Personal</b> portal.</p>
        <Link href={home} className="text-brand-primary font-semibold hover:underline">Go to your portal →</Link>
      </div>
    );
  }
  if (gate === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">Loading…</div>;
  }

  return (
    <AppShell
      portal="personal"
      nav={PERSONAL_NAV}
      title={titleFromPath(pathname, PERSONAL_NAV)}
      eyebrow="personal"
    >
      {children}
    </AppShell>
  );
}
