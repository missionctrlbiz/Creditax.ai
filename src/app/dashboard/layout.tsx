'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/chat': 'Tax Chat',
  '/dashboard/documents': 'Documents',
  '/dashboard/usage': 'Usage',
  '/dashboard/settings': 'Settings',
  '/dashboard/credit': 'Credit Score',
  '/dashboard/reports': 'Reports',
  '/dashboard/tax-filing': 'Tax Filing',
  '/dashboard/keys': 'API Keys',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tokenUsage] = useState({ used: 23, limit: 50 });

  const pageTitle = routeTitles[pathname] || 'Dashboard';

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)]">
      <DashboardSidebar collapsed={false} />

      <div className="lg:ml-[250px] flex flex-col min-h-screen">
        <DashboardHeader
          title={pageTitle}
          tokensUsed={tokenUsage.used}
          tokenLimit={tokenUsage.limit}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          menuOpen={sidebarOpen}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-surface-raised border-r border-border-default transition-all duration-300 lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DashboardSidebar collapsed={false} />
        </div>

        <main className="flex-1 p-6 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}