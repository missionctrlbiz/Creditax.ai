'use client';

import { usePathname } from 'next/navigation';
import { AppShell, PERSONAL_NAV, type NavItem } from '@/components/shell/AppShell';

function titleFromPath(pathname: string, nav: NavItem[]): string {
  const match = nav
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? 'Dashboard';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      portal="personal"
      nav={PERSONAL_NAV}
      title={titleFromPath(pathname, PERSONAL_NAV)}
      eyebrow="Personal"
    >
      {children}
    </AppShell>
  );
}
