'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AppLogo } from '@/components/shared/AppLogo';
import { JoinListModal } from '@/components/marketing/JoinListModal';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const t = useTranslations();
  const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t('footer.product'),
      links: [
        { label: t('footer.features'), href: '/#features' },
        { label: t('footer.pricing'), href: '/pricing' },
        { label: t('footer.marketplace'), href: '/marketplace' },
        { label: t('footer.apiDocs'), href: '/developers' },
        { label: t('footer.status'), href: '/status' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), href: '/about' },
        { label: t('footer.blog'), href: '/blog' },
        { label: t('footer.careers'), href: '/about#contact' },
        { label: t('footer.contact'), href: '/about#contact' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.quickstart'), href: '/developers/quickstart' },
        { label: t('footer.reference'), href: '/developers/reference' },
        { label: t('footer.sandbox'), href: '/developers/sandbox' },
        { label: t('footer.forPros'), href: '/pro/apply' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.privacy'), href: '/privacy' },
        { label: t('footer.terms'), href: '/terms' },
        { label: t('footer.security'), href: '/privacy' },
      ],
    },
  ];
  return (
    <footer className="bg-surface-raised border-t border-border-default pt-14 pb-8 w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12 border-b border-border-subtle">
          <div className="col-span-2">
            <AppLogo height={30} />
            <p className="text-text-secondary text-sm mt-3 font-display tracking-wide">
              {t('footer.tagline')}
            </p>
            <p className="text-text-muted text-[13px] mt-4 max-w-[260px] leading-relaxed">
              {t('footer.blurb')}
            </p>
            <div className="mt-5">
              <JoinListModal
                trigger={
                  <Button variant="secondary" size="sm" aria-haspopup="dialog">
                    {t('nav.joinList')}
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
          <p className="text-text-muted text-xs">{t('footer.copy')}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-text-muted text-xs hover:text-text-secondary">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-text-muted text-xs hover:text-text-secondary">
              {t('footer.terms')}
            </Link>
            <Link href="/status" className="text-text-muted text-xs hover:text-text-secondary">
              {t('footer.status')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
