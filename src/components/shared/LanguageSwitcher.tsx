'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Languages } from 'lucide-react';
import { setLocalePreference } from '@/lib/mock-auth';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'yo', label: 'YO' },
  { code: 'ha', label: 'HA' },
  { code: 'ig', label: 'IG' },
] as const;

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label
      className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-btn border border-border-subtle bg-surface-raised text-text-muted cursor-pointer hover:border-border-default transition-colors ${className}`}
      title="Language"
    >
      <Languages size={14} aria-hidden />
      <span className="sr-only">Language</span>
      <select
        aria-label="Select language"
        value={locale}
        onChange={(e) => {
          // Persist the choice on the profile so the user returns in their language.
          setLocalePreference(e.target.value);
          router.replace(pathname, { locale: e.target.value });
        }}
        className="bg-transparent border-none outline-none text-xs font-semibold text-text-primary cursor-pointer"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
