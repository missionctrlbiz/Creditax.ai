'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppShell, ADMIN_NAV, AUTHOR_NAV, type NavItem } from '@/components/shell/AppShell';
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
  // next/navigation usePathname keeps the locale prefix (/en/...); strip it
  // so matches against locale-free nav hrefs and grants are reliable on every
  // load (first client nav, hard reload, back/forward).
  const cleanPath = pathname.replace(/^\/(en|yo|ha|ig)(?=\/|$)/, '');
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

  // P10 — Author is a scoped grant on the admin board: blog workflow +
  // KB editor + publish + audit only (roles-and-experience §1). Admin gets
  // the full board.
  const isAuthor = session?.role === 'author';
  const nav = isAuthor ? AUTHOR_NAV : ADMIN_NAV;

  // Scoped enforcement: an author visiting an admin-only section is bounced
  // to their blog board (same role-gate pattern as the other boards).
  const authorPaths = ['/admin/blog', '/admin/knowledge-base', '/admin/audit'];
  if (isAuthor && !authorPaths.some((p) => cleanPath.startsWith(p))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-text-secondary">
          Your <b>Author</b> grant covers the Blog, Knowledge Base and Audit Log.
        </p>
        <Link href="/admin/blog" className="text-brand-primary font-semibold hover:underline">
          Open your content board →
        </Link>
      </div>
    );
  }

  return (
    <AppShell
      portal="admin"
      nav={nav}
      title={titleFromPath(cleanPath, nav)}
      eyebrow="admin"
      searchPlaceholder={isAuthor ? 'Search posts, KB docs, audit logs…' : 'Search users, pros, logs…'}
    >
      {children}
    </AppShell>
  );
}
