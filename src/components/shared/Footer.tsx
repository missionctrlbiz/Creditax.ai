'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface-raised border-t border-border-default py-10 w-full">
      <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Creditax.ai" className="h-7" />
          </div>
          <div className="text-text-secondary text-[13px] mt-1 font-sans">
            Tax Smart. Borrow Smart.
          </div>
        </div>
        <div className="flex gap-6 flex-wrap justify-center">
          <Link href="#" className="text-text-secondary text-[13px] hover:text-text-primary transition-colors">About</Link>
          <Link href="#" className="text-text-secondary text-[13px] hover:text-text-primary transition-colors">Blog</Link>
          <Link href="/pricing" className="text-text-secondary text-[13px] hover:text-text-primary transition-colors">Pricing</Link>
          <Link href="#" className="text-text-secondary text-[13px] hover:text-text-primary transition-colors">API Docs</Link>
          <Link href="#" className="text-text-secondary text-[13px] hover:text-text-primary transition-colors">Status</Link>
          <Link href="#" className="text-text-secondary text-[13px] hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="#" className="text-text-secondary text-[13px] hover:text-text-primary transition-colors">Terms</Link>
        </div>
        <div className="text-text-muted text-xs">
          © 2026 Creditax.ai
        </div>
      </div>
    </footer>
  );
}
