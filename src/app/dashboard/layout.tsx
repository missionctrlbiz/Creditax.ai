'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Tax Filing', href: '#' },
    { name: 'Documents', href: '/dashboard/documents/upload' },
    { name: 'Credit', href: '#' },
    { name: 'Settings', href: '#' },
  ];

  return (
    <div className="min-h-screen">
      {/* Sidebar - Desktop Only */}
      <aside className="bg-surface-raised border-r border-border-default p-6 pt-20 pb-6 fixed top-0 left-0 bottom-0 w-[240px] z-20 flex flex-col max-lg:hidden select-none">
        <div className="px-1 mb-8">
          <Link href="/">
            <img src="/logo.png" alt="Creditax.ai" className="h-8 cursor-pointer" />
          </Link>
        </div>
        
        <div className="text-text-muted text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 px-1">
          QUICK ACTIONS
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/documents/upload" className="w-full">
            <button className="flex items-center gap-2.5 w-full h-11 px-3.5 rounded-[10px] text-[13px] font-medium border border-[rgba(13,115,119,0.25)] bg-[rgba(13,115,119,0.12)] text-brand-primary hover:bg-[rgba(13,115,119,0.18)] transition-all cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
                <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
              </svg>
              Upload Document
            </button>
          </Link>
          <button className="flex items-center gap-2.5 w-full h-11 px-3.5 rounded-[10px] text-[13px] font-medium border border-[rgba(50,232,117,0.2)] bg-[rgba(50,232,117,0.1)] text-brand-action hover:bg-[rgba(50,232,117,0.15)] transition-all cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Ask Tax Bot
          </button>
          <button className="flex items-center gap-2.5 w-full h-11 px-3.5 rounded-[10px] text-[13px] font-medium border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-text-primary hover:bg-[rgba(255,255,255,0.07)] transition-all cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-8 4 4 4-10" />
            </svg>
            View Reports
          </button>
        </div>

        <div className="mt-auto pt-6">
          <div className="bg-surface-overlay rounded-xl p-4 border border-border-default">
            <div className="font-semibold text-text-primary text-[13px] mb-1 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tax Tip
            </div>
            <p className="text-text-muted text-[12px] leading-relaxed">
              Upload your PAYE receipt to unlock +8 credit points.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Panel Wrapper */}
      <div className="lg:ml-[240px] pt-16 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 lg:left-[240px] right-0 z-30 bg-surface-raised border-b border-border-default h-16 flex items-center justify-between px-8 select-none">
          <div className="flex items-center gap-2 lg:hidden">
            <img src="/logo.png" alt="Creditax.ai" className="h-8" />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-sm font-semibold py-5 transition-colors relative block cursor-pointer ${
                    isActive 
                      ? 'text-brand-primary' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-primary rounded-[1px]" />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-5 h-5 text-text-secondary relative cursor-pointer hover:text-text-primary transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-[-2px] right-[-2px] width-2 height-2 rounded-full bg-brand-action border border-surface-raised" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-primary rounded-full grid place-items-center text-[13px] font-bold text-text-primary select-none">
                EO
              </div>
              <span className="text-text-primary font-medium text-[13px] hidden sm:block">Emeka O.</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
