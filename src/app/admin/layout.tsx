'use client';

import { usePathname } from 'next/navigation';
import { AppShell, ADMIN_NAV, type NavItem } from '@/components/shell/AppShell';

function titleFromPath(pathname: string, nav: NavItem[]): string {
  const match = nav
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? 'Dashboard';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      portal="admin"
      nav={ADMIN_NAV}
      title={titleFromPath(pathname, ADMIN_NAV)}
      eyebrow="Admin"
      searchPlaceholder="Search users, pros, logs…"
    >
      {children}
    </AppShell>
  );
}
