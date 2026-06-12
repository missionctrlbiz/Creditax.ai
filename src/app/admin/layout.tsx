'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/professionals', label: 'Professionals', badge: '3', badgeVariant: 'warning' as const, icon: '🎓' },
  { href: '/admin/knowledge-base', label: 'Knowledge Base', icon: '📚' },
  { href: '/admin/audit', label: 'Audit Log', icon: '📋' },
  { href: '/admin/marketplace', label: 'Marketplace', icon: '🏪' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-surface-base">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col bg-surface-raised border-r border-border-default"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border-default">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center flex-shrink-0">
            <span className="text-text-inverse font-bold text-sm">C</span>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span className="font-sans font-bold text-text-primary">Creditax.ai</span>
                <Badge variant="error" className="text-[10px] px-1.5">ADMIN</Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-btn
                      font-sans text-sm font-medium
                      transition-all duration-150
                      ${isActive
                        ? 'bg-brand-primary-bg text-brand-primary border border-brand-primary-border'
                        : 'text-text-secondary hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
                      }
                    `}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between flex-1 min-w-0"
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <Badge variant={item.badgeVariant} className="text-[10px] px-1.5">
                              {item.badge}
                            </Badge>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border-default">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-btn
              text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)]
              transition-all duration-150"
          >
            <span className="text-sm">{sidebarCollapsed ? '→' : '←'}</span>
            {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between gap-4 px-6 h-16 bg-surface-raised border-b border-border-default">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search users, professionals, logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-all duration-150">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--color-error)] text-text-inverse text-[10px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            {/* Avatar */}
            <button className="flex items-center gap-3 p-1.5 rounded-btn hover:bg-[var(--color-hover-overlay)] transition-all duration-150">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-text-inverse font-semibold text-sm">AO</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-text-primary">Admin O.</p>
                <p className="text-xs text-text-muted">Super Admin</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}