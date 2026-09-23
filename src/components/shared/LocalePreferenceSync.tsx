'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { getLocalePreference } from '@/lib/mock-auth';

/**
 * Honors the stored language preference: a returning user who last browsed in
 * Yoruba lands on the localized route instead of the default English one.
 */
export function LocalePreferenceSync() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const pref = getLocalePreference();
    if (pref && pref !== locale) {
      router.replace(pathname, { locale: pref });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
