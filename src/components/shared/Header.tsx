'use client';

import { useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { AppLogo } from '@/components/shared/AppLogo';
import { JoinListModal } from '@/components/marketing/JoinListModal';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const NAV_LINKS = [
  { href: '/#features', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/developers', label: 'API Docs' },
  { href: '/blog', label: 'Blog' },
];

function NavItems({
  pathname,
  onNavigate,
  className = '',
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav className={className}>
      {NAV_LINKS.map((link) => {
        const active = link.href !== '/#features' && pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`text-sm transition-colors ${
              active
                ? 'text-text-primary font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 h-16 flex items-center justify-between px-6 md:px-10 max-w-[1440px] w-full mx-auto bg-surface-base/80 backdrop-blur-md z-50 select-none border-b border-border-subtle">
      <div className="flex items-center gap-2 h-8">
        <AppLogo height={32} />
      </div>

      <NavItems pathname={pathname} className="hidden md:flex gap-7 items-center" />

      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />
        <Link href="/login" className="hidden sm:block">
          <button className="text-text-secondary text-sm bg-transparent border-none p-2 hover:text-text-primary cursor-pointer transition-colors">
            Log in
          </button>
        </Link>
        <JoinListModal
          trigger={
            <Button size="sm" aria-haspopup="dialog">
              Join the list
            </Button>
          }
        />
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary cursor-pointer"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden border-b border-border-default bg-surface-raised px-6 py-4 flex flex-col gap-4 shadow-card">
          <NavItems
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            className="flex flex-col gap-4"
          />
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Log in
          </Link>
        </div>
      )}
    </header>
  );
}
