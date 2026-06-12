'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const navCategories = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Quickstart', href: '/developers/quickstart', icon: 'rocket' },
      { name: 'API Explorer', href: '/developers', icon: 'terminal' },
      { name: 'Sandbox', href: '/developers/sandbox', icon: 'sandbox' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { name: 'Tax Endpoints', href: '/developers/reference', icon: 'tax' },
      { name: 'Credit Endpoints', href: '/developers/reference', icon: 'credit' },
      { name: 'Document Endpoints', href: '/developers/reference', icon: 'document' },
      { name: 'Auth Endpoints', href: '/developers/reference', icon: 'auth' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'SDKs', href: '/developers/sdks', icon: 'sdk' },
      { name: 'Webhooks', href: '/developers/webhooks', icon: 'webhook' },
    ],
  },
];

const iconPaths: Record<string, string[]> = {
  rocket: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z', 'M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z', 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'],
  terminal: ['M4 17l6-6-6-6', 'M12 19h8'],
  sandbox: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  tax: ['M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'],
  credit: ['M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'],
  document: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6a2 2 0 002 2h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  auth: ['M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
  sdk: ['M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
  webhook: ['M22 12h-4l-3 9L9 3l-3 9H2'],
};

function NavIcon({ name, className = '' }: { name: string; className?: string }) {
  const paths = iconPaths[name] || [];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Getting Started': true,
    'API Reference': true,
    'Tools': true,
  });

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (href: string) => {
    if (href === '/developers') return pathname === '/developers';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-surface-raised border-b border-border-default flex items-center px-4 gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-[var(--color-hover-overlay)] rounded-lg transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Creditax.ai" className="h-7" />
        </Link>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-text-muted">Developers</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-text-muted">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-text-primary font-medium">
            {pathname === '/developers' && 'API Explorer'}
            {pathname === '/developers/quickstart' && 'Quickstart'}
            {pathname === '/developers/reference' && 'API Reference'}
            {pathname === '/developers/sdks' && 'SDKs'}
            {pathname === '/developers/sandbox' && 'Sandbox'}
            {pathname === '/developers/webhooks' && 'Webhooks'}
          </span>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search endpoints, parameters..."
              className="w-full h-9 pl-10 pr-4 rounded-input bg-surface-base border border-border-default text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            />
          </div>
        </div>

        {/* Version selector */}
        <div className="hidden lg:flex items-center gap-2">
          <Badge variant="brand">v2.1.0</Badge>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-text-muted">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Get API Key button */}
        <Button variant="primary" size="sm" className="hidden sm:flex">
          Get API Key
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        <aside
          className={`
            fixed top-14 left-0 bottom-0 z-20
            w-[260px] bg-surface-raised border-r border-border-default
            flex flex-col overflow-hidden
            transition-transform duration-300 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          <nav className="flex-1 overflow-y-auto p-4 pb-20">
            {navCategories.map((category) => (
              <div key={category.title} className="mb-6">
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="flex items-center justify-between w-full text-left mb-2 px-2 py-1 hover:bg-[var(--color-hover-overlay)] rounded-lg transition-colors"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">
                    {category.title}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-4 h-4 text-text-muted transition-transform duration-200 ${expandedCategories[category.title] ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <AnimatePresence>
                  {expandedCategories[category.title] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5">
                        {category.items.map((item) => {
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                                transition-all duration-150
                                ${active
                                  ? 'bg-brand-primary-bg text-brand-primary border-l-2 border-brand-primary ml-[-1px]'
                                  : 'text-text-secondary hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
                                }
                              `}
                            >
                              <NavIcon name={item.icon} className="w-4 h-4 flex-shrink-0" />
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Sandbox mode indicator */}
          <div className="p-4 border-t border-border-default">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-bg border border-success-border">
              <span className="w-2 h-2 rounded-full bg-brand-action animate-pulse" />
              <span className="text-[12px] font-semibold text-success-text">SANDBOX MODE</span>
            </div>
            <p className="text-[11px] text-text-muted mt-2 px-1">Safe to test — no real data affected</p>
          </div>
        </aside>
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-[260px] pt-14 min-h-screen">
        {children}
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
        />
      )}
    </div>
  );
}