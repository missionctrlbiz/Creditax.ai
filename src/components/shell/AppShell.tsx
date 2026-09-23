'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Calculator,
  CreditCard,
  FileText,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  History,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Upload,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { AppLogo } from '@/components/shared/AppLogo';
import { AccountMenu } from '@/components/shared/AccountMenu';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { getSession, type PortalRole } from '@/lib/mock-auth';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  /** i18n key under the `shell` namespace (nav labels + header title). */
  labelKey?: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const ICONS = {
  dashboard: <LayoutDashboard size={18} />,
  chat: <MessageSquare size={18} />,
  filing: <FileText size={18} />,
  documents: <FolderOpen size={18} />,
  upload: <Upload size={18} />,
  credit: <CreditCard size={18} />,
  reports: <BarChart3 size={18} />,
  usage: <History size={18} />,
  keys: <KeyRound size={18} />,
  settings: <Settings size={18} />,
  home: <Home size={18} />,
  clients: <UsersRound size={18} />,
  calculator: <Calculator size={18} />,
  verify: <ShieldCheck size={18} />,
  apply: <Inbox size={18} />,
  users: <Users size={18} />,
  pros: <GraduationCap size={18} />,
  marketplace: <ShoppingBag size={18} />,
  knowledge: <Sparkles size={18} />,
  audit: <History size={18} />,
  help: <HelpCircle size={18} />,
};

export const PERSONAL_NAV: NavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { href: '/dashboard/chat', labelKey: 'taxAssistant', label: 'Tax Assistant', icon: ICONS.chat },
  { href: '/dashboard/tax-filing', labelKey: 'taxFiling', label: 'Tax Filing', icon: ICONS.filing },
  { href: '/dashboard/documents', labelKey: 'documents', label: 'Documents', icon: ICONS.documents },
  { href: '/dashboard/documents/upload', labelKey: 'upload', label: 'Upload', icon: ICONS.upload },
  { href: '/dashboard/credit', labelKey: 'credit', label: 'Credit', icon: ICONS.credit },
  { href: '/dashboard/reports', labelKey: 'reports', label: 'Reports', icon: ICONS.reports },
  { href: '/dashboard/usage', labelKey: 'usage', label: 'Usage', icon: ICONS.usage },
  { href: '/dashboard/keys', labelKey: 'apiKeys', label: 'API Keys', icon: ICONS.keys },
  { href: '/dashboard/settings', labelKey: 'settings', label: 'Settings', icon: ICONS.settings },
];

export const PRO_NAV: NavItem[] = [
  { href: '/pro/dashboard', labelKey: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { href: '/pro/clients', labelKey: 'clients', label: 'Clients', icon: ICONS.clients },
  { href: '/pro/calculations', labelKey: 'bulkCalcs', label: 'Bulk Calculations', icon: ICONS.calculator },
  { href: '/pro/verify', labelKey: 'verify', label: 'Verify (CAC/TIN)', icon: ICONS.verify },
  { href: '/pro/apply', labelKey: 'applications', label: 'Applications', icon: ICONS.apply },
  { href: '/pro/settings', labelKey: 'settings', label: 'Settings', icon: ICONS.settings },
];

export const ADMIN_NAV: NavItem[] = [
  { href: '/admin/dashboard', labelKey: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { href: '/admin/users', labelKey: 'users', label: 'Users', icon: ICONS.users },
  { href: '/admin/professionals', labelKey: 'professionals', label: 'Professionals', icon: ICONS.pros, badge: 3 },
  { href: '/admin/marketplace', labelKey: 'marketplace', label: 'Marketplace', icon: ICONS.marketplace },
  { href: '/admin/knowledge-base', labelKey: 'knowledgeBase', label: 'Knowledge Base', icon: ICONS.knowledge },
  { href: '/admin/audit', labelKey: 'auditLog', label: 'Audit Log', icon: ICONS.audit },
  { href: '/admin/settings', labelKey: 'settings', label: 'Settings', icon: ICONS.settings },
];

const COLLAPSE_KEY = 'creditax-sidebar-collapsed';

interface AppShellProps {
  portal: PortalRole;
  nav: NavItem[];
  /** Page title shown in the header (next to the toggle) */
  title: string;
  /** Optional breadcrumb/eyebrow above the title */
  eyebrow?: string;
  /** Optional compact search field in the header (admin) */
  searchPlaceholder?: string;
  children: React.ReactNode;
}

/**
 * Shared chrome for personal / pro / admin boards:
 *  - collapsible sidebar (persisted) with lucide icons + active states
 *  - decluttered single-row header: [toggle][title] … [search][theme][bell][avatar]
 *  - mobile drawer
 *  - avatar-only account menu (AccountMenu)
 */
export function AppShell({ portal, nav, title, eyebrow, searchPlaceholder, children }: AppShellProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const { theme, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Session read only after mount — SSR must match client HTML (hydration fix).
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = getSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionEmail(s.email);
    setMounted(true);
  }, []);

  // Hydrate collapse state after mount (deferred to avoid sync setState in effect)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === '1');
    });
    return () => cancelAnimationFrame(id);
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      window.localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      return next;
    });
  }

  // Close the mobile drawer on navigation (deferred one frame)
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawerOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const sidebarWidth = collapsed ? 68 : 240;

  const sidebarContent = (
    <>
      {/* Logo row — aligned with header line (h-16); AppLogo links home itself */}
      <div
        className={cn(
          'h-16 flex items-center px-4 border-b border-border-subtle shrink-0',
          collapsed && 'justify-center px-0'
        )}
      >
        <AppLogo height={collapsed ? 24 : 28} />
      </div>

      {/* Portal badge */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-badge text-[10px] font-bold tracking-wider uppercase bg-brand-primary-bg border border-brand-primary-border text-brand-primary">
            {portal === 'personal' ? t('shell.personal') : portal === 'pro' ? t('shell.proPortal') : t('shell.admin')}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5" aria-label="Main">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            const label = item.labelKey ? t(`shell.${item.labelKey}`) : item.label;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? label : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 h-10 px-3 rounded-btn text-sm font-medium transition-colors duration-150',
                    collapsed && 'justify-center px-0',
                    active
                      ? 'bg-brand-primary-bg text-brand-primary border border-brand-primary-border'
                      : 'text-text-secondary hover:text-text-primary hover:bg-hover-overlay border border-transparent'
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1">{label}</span>
                      {item.badge != null && (
                        <span className="min-w-5 h-5 px-1 rounded-full bg-warning-bg border border-warning-border text-warning-text text-[10px] font-bold grid place-items-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer: help + collapse */}
      <div className="p-2.5 border-t border-border-subtle space-y-1 shrink-0">
        <Link
          href="/marketplace"
          title={collapsed ? t('shell.marketplace') : undefined}
          className={cn(
            'flex items-center gap-3 h-9 px-3 rounded-btn text-[13px] text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <ShoppingBag size={16} />
          {!collapsed && <span>{t('shell.marketplace')}</span>}
        </Link>
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? t('shell.collapse') : t('shell.collapse')}
          className={cn(
            'w-full flex items-center gap-3 h-9 px-3 rounded-btn text-[13px] text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && <span>{t('shell.collapse')}</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed top-0 left-0 bottom-0 z-40 hidden lg:flex flex-col bg-surface-raised border-r border-border-default select-none overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[240px] flex flex-col bg-surface-raised border-r border-border-default lg:hidden"
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-hover-overlay cursor-pointer"
              >
                <X size={16} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-[var(--shell-sidebar)]" style={{ ['--shell-sidebar' as string]: `${sidebarWidth}px` }}>
        {/* Header — decluttered single row */}
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-surface-raised/90 backdrop-blur-md border-b border-border-default">
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => (window.innerWidth < 1024 ? setDrawerOpen(true) : toggleCollapsed())}
            className="p-2 rounded-btn text-text-secondary hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex items-baseline gap-2.5">
            {eyebrow && (
              <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                {t(`shell.${eyebrow}`)}
              </span>
            )}
            <h1 className="text-[15px] sm:text-base font-semibold text-text-primary truncate">
              {nav.find((item) => item.label === title && item.labelKey)
                ? t(`shell.${nav.find((item) => item.label === title && item.labelKey)!.labelKey}`)
                : title}
            </h1>
          </div>

          <div className="flex-1" />

          {searchPlaceholder && (
            <div className="hidden md:flex items-center gap-2 h-9 px-3 w-56 rounded-btn bg-surface-inset border border-border-subtle text-text-muted focus-within:border-brand-primary transition-colors">
              <Search size={14} />
              <input
                type="search"
                placeholder={t('shell.search')}
                aria-label={t('shell.search')}
                className="bg-transparent border-none outline-none text-xs w-full text-text-primary placeholder:text-text-placeholder"
              />
            </div>
          )}

          <LanguageSwitcher className="hidden sm:inline-flex" />

          <button
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
            className="p-2 rounded-btn text-text-secondary hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* P3 F-08 — live notification bell (feed + filing-deadline countdowns) */}
          <NotificationBell />

          <div className="flex items-center gap-2.5 pl-1 border-l border-border-subtle ml-1">
            <div className="hidden sm:flex flex-col items-end leading-tight mr-0.5">
              <span className="text-[13px] font-medium text-text-primary">
                {portal === 'admin' ? t('auth.admin') + ' O.' : portal === 'pro' ? 'Ayo Ogundimu' : 'Emeka O.'}
              </span>
              <span className="text-[10px] text-text-muted truncate max-w-[140px]">
                {mounted && sessionEmail ? sessionEmail : 'demo@creditax.ai'}
              </span>
            </div>
            <AccountMenu defaultRole={portal} size={34} />
          </div>
        </header>

        {/* Page — consistent gutter on every data page; content stops well
            before the page edge so tables never run past the viewport */}
        <main className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-6">
          <div className="app-main">{children}</div>
        </main>
      </div>
    </div>
  );
}
