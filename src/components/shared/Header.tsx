'use client';

import { useState } from 'react';
import { usePathname, Link } from '@/i18n/navigation';
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
  mobile = false,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
  /** Mobile: full-width rows with a 44px tap target and larger text. */
  mobile?: boolean;
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
            className={
              mobile
                ? `min-h-[44px] flex items-center rounded-btn px-2 py-2.5 text-[15px] transition-colors ${
                    active
                      ? 'text-text-primary font-semibold bg-hover-overlay'
                      : 'text-text-secondary hover:text-text-primary hover:bg-hover-overlay'
                  }`
                : `text-sm transition-colors ${
                    active
                      ? 'text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`
            }
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
    <header className="sticky top-0 h-16 flex items-center justify-between px-4 sm:px-6 md:px-10 max-w-[1440px] w-full mx-auto bg-surface-base/80 backdrop-blur-md z-50 select-none border-b border-border-subtle">
      <div className="flex items-center gap-2 h-8">
        <AppLogo height={32} />
      </div>

      <NavItems pathname={pathname} className="hidden md:flex gap-7 items-center" />

      <div className="flex items-center gap-3 md:gap-4">
        <LanguageSwitcher className="hidden sm:inline-flex" />
        <ThemeToggle />
        {/* P20: the Link used to wrap a <button> (invalid interactive-in-
            interactive); style the Link itself instead. */}
        <Link
          href="/login"
          className="hidden sm:block text-text-secondary text-sm p-2 hover:text-text-primary cursor-pointer transition-colors"
        >
          {t('login')}
        </Link>
        <JoinListModal
          trigger={
            <Button size="sm" aria-haspopup="dialog">
              {/* Short label below sm so the mobile header row fits the
                  logo + language + theme + waitlist + burger without
                  crowding; full label from sm up. */}
              <span className="sm:hidden">{t('joinListShort')}</span>
              <span className="hidden sm:inline">{t('joinList')}</span>
            </Button>
          }
        />
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden w-11 h-11 -my-1.5 grid place-items-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover-overlay cursor-pointer"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden border-b border-border-default bg-surface-raised px-4 py-3 flex flex-col shadow-card max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <NavItems
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            mobile
            className="flex flex-col"
          />
          <div className="mt-2 pt-2 border-t border-border-subtle flex flex-col gap-1">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] flex items-center px-2 rounded-btn text-[15px] text-text-secondary hover:text-text-primary hover:bg-hover-overlay transition-colors"
            >
              {t('login')}
            </Link>
            <JoinListModal
              trigger={
                <Button size="md" fullWidth variant="primary">
                  {t('joinList')}
                </Button>
              }
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
