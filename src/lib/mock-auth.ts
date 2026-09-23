'use client';

// Mock session for the 57-screen UI prototype (no backend auth on this branch).
// Stores the chosen portal role + email in localStorage so login, logout and
// portal switching work site-wide for click-through review.

export type PortalRole = 'personal' | 'pro' | 'admin' | 'author';

export const ROLE_HOME: Record<PortalRole, string> = {
  personal: '/dashboard',
  pro: '/pro/dashboard',
  admin: '/admin/dashboard',
  // Author signs into the admin board with a scoped content grant (roles doc §1).
  author: '/admin/dashboard',
};

export const ROLE_LABEL: Record<PortalRole, string> = {
  personal: 'Personal',
  pro: 'Tax Pro',
  admin: 'Admin',
  author: 'Author',
};

const ROLE_KEY = 'creditax_role';
const EMAIL_KEY = 'creditax_email';
// Language preference lives on the (mock) user profile per product-foundation.md §9.
const LOCALE_KEY = 'creditax_locale_pref';

export type LocaleCode = 'en' | 'yo' | 'ha' | 'ig';

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export function setSession(role: PortalRole, email: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ROLE_KEY, role);
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function setLocalePreference(locale: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LOCALE_KEY, locale);
}

export function getLocalePreference(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(LOCALE_KEY);
}

export function getSession(): { role: PortalRole | null; email: string | null } {
  if (!canUseStorage()) return { role: null, email: null };
  const role = window.localStorage.getItem(ROLE_KEY) as PortalRole | null;
  const email = window.localStorage.getItem(EMAIL_KEY);
  if (role !== 'personal' && role !== 'pro' && role !== 'admin' && role !== 'author') {
    return { role: null, email };
  }
  return { role, email };
}

export function clearSession(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
}

export function logout(): void {
  clearSession();
  if (canUseStorage()) {
    window.location.href = '/login';
  }
}
