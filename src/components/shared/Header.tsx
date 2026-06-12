'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 h-16 flex items-center justify-between px-10 max-w-[1440px] w-full mx-auto bg-surface-base/80 backdrop-blur-md z-50 select-none border-b border-border-subtle">
      <div className="flex items-center gap-2 h-8">
        <Link href="/">
          <img src="/logo.png" alt="Creditax.ai" className="h-8 cursor-pointer" />
        </Link>
      </div>
      <nav className="hidden md:flex gap-8 items-center">
        <Link 
          href="#" 
          className="text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          Product
        </Link>
        <Link 
          href="/pricing" 
          className={`text-sm transition-colors ${
            pathname === '/pricing' 
              ? 'text-text-primary font-semibold' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Pricing
        </Link>
        <Link 
          href="#" 
          className="text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          API Docs
        </Link>
        <Link
          href="/blog"
          className={`text-sm transition-colors ${
            pathname === '/blog'
              ? 'text-text-primary font-semibold'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Blog
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/login">
          <button className="text-text-secondary text-sm bg-transparent border-none p-2 hover:text-text-primary cursor-pointer transition-colors">
            Log in
          </button>
        </Link>
        <Link href="/login">
          <Button size="sm">Get Early Access</Button>
        </Link>
      </div>
    </header>
  );
}
