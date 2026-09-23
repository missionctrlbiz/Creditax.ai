import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'yo', 'ha', 'ig'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
