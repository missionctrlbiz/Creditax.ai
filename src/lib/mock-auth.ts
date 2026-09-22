'use client';

// Mock session for the 57-screen UI prototype (no backend auth on this branch).
// Stores the chosen portal role + email in localStorage so login, logout and
// portal switching work site-wide for click-through review.

export type PortalRole = 'personal' | 'pro' | 'admin';

export const ROLE_HOME: Record<PortalRole, string> = {
  personal: '/dashboard',
  pro: '/pro/dashboard',
  admin: '/admin/dashboard',
};

export const ROLE_LABEL: Record<PortalRole, string> = {
  personal: 'Personal',
  pro: 'Tax Pro',
  admin: 'Admin',
};

const ROLE_KEY = 'creditax_role';
const EMAIL_KEY = 'creditax_email';

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export function setSession(role: PortalRole, email: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ROLE_KEY, role);
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function getSession(): { role: PortalRole | null; email: string | null } {
  if (!canUseStorage()) return { role: null, email: null };
  const role = window.localStorage.getItem(ROLE_KEY) as PortalRole | null;
  const email = window.localStorage.getItem(EMAIL_KEY);
  if (role !== 'personal' && role !== 'pro' && role !== 'admin') {
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
