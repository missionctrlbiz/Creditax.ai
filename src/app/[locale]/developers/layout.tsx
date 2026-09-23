'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Braces,
  Calculator,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  FlaskConical,
  KeyRound,
  Menu,
  Rocket,
  Search,
  ShieldCheck,
  Terminal,
  Webhook,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AppLogo } from '@/components/shared/AppLogo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
}

interface NavGroup {
  title: string;
  items: NavLink[];
}

/** Locales served by the [locale] segment — used to match nav state. */
const LOCALES = ['en', 'yo', 'ha', 'ig'];

const NAV_ICONS = {
  rocket: <Rocket size={16} aria-hidden />,
  terminal: <Terminal size={16} aria-hidden />,
  sandbox: <FlaskConical size={16} aria-hidden />,
  tax: <Calculator size={16} aria-hidden />,
  credit: <CreditCard size={16} aria-hidden />,
  document: <FileText size={16} aria-hidden />,
  auth: <KeyRound size={16} aria-hidden />,
  sdk: <Braces size={16} aria-hidden />,
  webhook: <Webhook size={16} aria-hidden />,
};

const navCategories = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Quickstart', href: '/developers/quickstart', icon: NAV_ICONS.rocket },
      { name: 'API Explorer', href: '/developers', icon: NAV_ICONS.terminal },
      { name: 'Sandbox', href: '/developers/sandbox', icon: NAV_ICONS.sandbox },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { name: 'Tax Endpoints', href: '/developers/reference', icon: NAV_ICONS.tax },
      { name: 'Credit Endpoints', href: '/developers/reference', icon: NAV_ICONS.credit },
      { name: 'Document Endpoints', href: '/developers/reference', icon: NAV_ICONS.document },
      { name: 'Auth Endpoints', href: '/developers/reference', icon: NAV_ICONS.auth },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'SDKs', href: '/developers/sdks', icon: NAV_ICONS.sdk },
      { name: 'Webhooks', href: '/developers/webhooks', icon: NAV_ICONS.webhook },
    ],
  },
];

const BREADCRUMB_LABELS: Record<string, string> = {
  '/developers': 'API Explorer',
  '/developers/quickstart': 'Quickstart',
  '/developers/reference': 'API Reference',
  '/developers/sandbox': 'Sandbox',
  '/developers/sdks': 'SDKs',
  '/developers/webhooks': 'Webhooks',
};

/** `/en/developers/quickstart` → `/developers/quickstart` */
function routeFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return `/${segments.slice(1).join('/')}`;
  }
  return pathname || '/';
}

const SIDEBAR_WIDTH = 260;

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const route = routeFromPathname(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Getting Started': true,
    'API Reference': true,
    'Tools': true,
  });

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Paths that own the current route (one page can back several nav links).
  const activePaths = new Set<string>();
  navCategories.forEach((category) =>
    category.items.forEach((item) => {
      if (route === item.href || (item.href !== '/developers' && route.startsWith(`${item.href}/`))) {
        activePaths.add(item.href);
      }
    })
  );

  // Highlight the first link that owns the route so the sidebar reads cleanly.
  const navGroups: NavGroup[] = navCategories.map((category) => ({
    title: category.title,
    items: category.items.map((item) => {
      const isActivePath = activePaths.has(item.href);
      const active = isActivePath && !activePaths.has(`marked:${item.href}`);
      if (isActivePath) activePaths.add(`marked:${item.href}`);
      return { ...item, active };
    }),
  }));

  const sidebarContent = (
    <>
      {/* Logo lives in the sidebar (same pattern as AppShell admin) */}
      <div className="h-14 flex items-center px-4 border-b border-border-default shrink-0">
        <AppLogo height={28} />
      </div>

      <nav aria-label="Developer portal" className="flex-1 overflow-y-auto p-4">
        {navGroups.map((category) => (
          <div key={category.title} className="mb-6 last:mb-0">
            <button
              type="button"
              onClick={() => toggleCategory(category.title)}
              aria-expanded={!!expandedCategories[category.title]}
              className="flex items-center justify-between w-full text-left mb-2 px-2 py-1 rounded-lg hover:bg-[var(--color-hover-overlay)] transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">
                {category.title}
              </span>
              <ChevronDown
                size={16}
                className={`text-text-muted transition-transform duration-200 ${
                  expandedCategories[category.title] ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </button>

            <AnimatePresence initial={false}>
              {expandedCategories[category.title] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5">
                    {category.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        aria-current={item.active ? 'page' : undefined}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                          transition-colors duration-150
                          ${
                            item.active
                              ? 'bg-brand-primary-bg text-brand-primary border-l-2 border-brand-primary'
                              : 'text-text-secondary hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
                          }
                        `}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Sandbox mode indicator */}
      <div className="p-4 border-t border-border-default shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-bg border border-success-border">
          <ShieldCheck size={14} className="text-success-text shrink-0" aria-hidden />
          <span className="text-[12px] font-semibold text-success-text">SANDBOX MODE</span>
        </div>
        <p className="text-[11px] text-text-muted mt-2 px-1">Safe to test — no real data affected</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Desktop sidebar — full height, starts at the top (admin pattern) */}
      <aside className="fixed top-0 left-0 bottom-0 z-40 hidden lg:flex flex-col w-[260px] bg-surface-raised border-r border-border-default overflow-hidden select-none">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[260px] flex flex-col bg-surface-raised border-r border-border-default lg:hidden overflow-hidden"
            >
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-3 z-10 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] cursor-pointer"
              >
                <X size={16} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column — header sits after the sidebar */}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 h-14 bg-surface-raised border-b border-border-default">
          <div className="flex h-full items-center gap-3 px-4 sm:px-6">
            {/* Collapsible toggle — first, before the breadcrumb (admin pattern) */}
            <button
              type="button"
              aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 -ml-1 rounded-btn text-text-secondary hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-colors cursor-pointer lg:hidden"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb — after the sidebar edge */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
              <Link
                href="/developers"
                className="text-text-muted hover:text-text-secondary transition-colors shrink-0"
              >
                Developers
              </Link>
              <ChevronRight size={14} className="text-text-muted shrink-0" aria-hidden />
              <span className="font-medium text-text-primary truncate">
                {BREADCRUMB_LABELS[route] ?? 'API Docs'}
              </span>
            </nav>

            <div className="flex-1" />

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 h-9 w-52 lg:w-64 px-3 rounded-btn bg-surface-inset border border-border-subtle text-text-muted focus-within:border-brand-primary transition-colors">
              <Search size={14} aria-hidden />
              <input
                type="search"
                aria-label="Search endpoints, parameters"
                placeholder="Search endpoints..."
                className="bg-transparent border-none outline-none text-xs w-full text-text-primary placeholder:text-text-placeholder"
              />
            </div>

            {/* Version */}
            <div className="hidden lg:flex items-center gap-1 h-9 px-2 rounded-btn bg-surface-inset border border-border-subtle">
              <Badge variant="brand">v2.1.0</Badge>
              <ChevronDown size={14} className="text-text-muted" aria-hidden />
            </div>

            {/* Far end: language · theme · Get API Key (opposite the toggle) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher className="hidden sm:inline-flex" />
              <ThemeToggle />
              <Button
                variant="primary"
                size="sm"
                className="h-9 whitespace-nowrap"
              >
                Get API Key
              </Button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-3.5rem)]">
          <div className="mx-auto w-full max-w-[1240px] px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
