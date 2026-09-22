'use client';

import Link from 'next/link';
import { AppLogo } from '@/components/shared/AppLogo';
import { JoinListModal } from '@/components/marketing/JoinListModal';
import { Button } from '@/components/ui/Button';

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'API Docs', href: '/developers' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/about#contact' },
      { label: 'Contact', href: '/about#contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Quickstart', href: '/developers/quickstart' },
      { label: 'Reference', href: '/developers/reference' },
      { label: 'Sandbox', href: '/developers/sandbox' },
      { label: 'For tax pros', href: '/pro/apply' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-surface-raised border-t border-border-default pt-14 pb-8 w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12 border-b border-border-subtle">
          <div className="col-span-2">
            <AppLogo height={30} />
            <p className="text-text-secondary text-sm mt-3 font-display tracking-wide">
              Tax Smart. Borrow Smart.
            </p>
            <p className="text-text-muted text-[13px] mt-4 max-w-[260px] leading-relaxed">
              Know what you owe, file it right, and turn your tax record into credit lenders trust.
            </p>
            <div className="mt-5">
              <JoinListModal
                trigger={
                  <Button variant="secondary" size="sm" aria-haspopup="dialog">
                    Join the list
                  </Button>
                }
              />
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted mb-4 font-sans">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">© 2026 Creditax.ai · Built for Nigeria</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-text-muted text-xs hover:text-text-secondary">
              Privacy
            </Link>
            <Link href="/terms" className="text-text-muted text-xs hover:text-text-secondary">
              Terms
            </Link>
            <Link href="/status" className="text-text-muted text-xs hover:text-text-secondary">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
