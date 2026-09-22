'use client';

import { usePathname } from 'next/navigation';
import { AppShell, PRO_NAV, type NavItem } from '@/components/shell/AppShell';

function titleFromPath(pathname: string, nav: NavItem[]): string {
  const match = nav
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? 'Dashboard';
}

export default function ProLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      portal="pro"
      nav={PRO_NAV}
      title={titleFromPath(pathname, PRO_NAV)}
      eyebrow="Pro Portal"
    >
      {children}
    </AppShell>
  );
}
