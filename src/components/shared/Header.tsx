'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { AppLogo } from '@/components/shared/AppLogo';
import { JoinListModal } from '@/components/marketing/JoinListModal';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

const NAV = [
  { href: '/#features', key: 'product' },
  { href: '/pricing', key: 'pricing' },
  { href: '/about', key: 'about' },
  { href: '/marketplace', key: 'marketplace' },
  { href: '/developers', key: 'apiDocs' },
  { href: '/blog', key: 'blog' },
] as const;

function NavItems({
  pathname,
  onNavigate,
  className = '',
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useTranslations('nav');
  return (
    <nav className={className}>
      {NAV.map((link) => {
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
            {t(link.key)}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 h-16 flex items-center justify-between px-6 md:px-10 max-w-[1440px] w-full mx-auto bg-surface-base/80 backdrop-blur-md z-50 select-none border-b border-border-subtle">
      <div className="flex items-center gap-2 h-8">
        <AppLogo height={32} />
      </div>

      <NavItems pathname={pathname} className="hidden md:flex gap-7 items-center" />

      <div className="flex items-center gap-3 md:gap-4">
        <LanguageSwitcher className="hidden sm:inline-flex" />
        <ThemeToggle />
        <Link href="/login" className="hidden sm:block">
          <button className="text-text-secondary text-sm bg-transparent border-none p-2 hover:text-text-primary cursor-pointer transition-colors">
            {t('login')}
          </button>
        </Link>
        <JoinListModal
          trigger={
            <Button size="sm" aria-haspopup="dialog">
              {t('joinList')}
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
            {t('login')}
          </Link>
        </div>
      )}
    </header>
  );
}
