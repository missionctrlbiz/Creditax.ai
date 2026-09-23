/**
 * P7 — Unified auth spine: single source of truth for session management.
 *
 * Consolidates pb-auth + mock-auth. Layout guards (dashboard/pro/admin) read
 * from THIS module, never localStorage directly: role + tier always resolve
 * from the same object. PocketBase is preferred when enabled + reachable;
 * the mock (localStorage) is the fallback so the demo never blocks on infra.
 */

import { getP1Session, loginAs, logoutP1, type P1Session, type DemoRole } from '@/lib/pb-auth';
import {
  getSession as getMockSession,
  setSession as setMockSession,
  clearSession as clearMockSession,
  logout as mockLogout,
  getLocalePreference as getMockLocalePref,
  setLocalePreference as setMockLocalePref,
  type PortalRole,
} from '@/lib/mock-auth';
import { ROLE_HOME } from '@/lib/seed/demoSeed';

// Re-export for backward compatibility
export type { DemoRole, P1Session };
export type { PortalRole };
export type { LocaleCode } from '@/lib/mock-auth';
export { ROLE_HOME };

export interface UnifiedSession {
  role: DemoRole;
  email: string;
  name: string;
  tier: string;
  locale: string;
  /** True when the session came from PocketBase, false when from the mock. */
  source: 'pocketbase' | 'mock';
}

/**
 * Get the current unified session, preferring PocketBase when enabled +
 * reachable, else the mock. Never throws — a bad session resolves to the
 * consumer fallback. This is the ONLY thing layout guards should call.
 */
export async function getSession(): Promise<UnifiedSession> {
  const s: P1Session = await getP1Session();
  return s;
}

/**
 * Sign in with a chosen demo role. When PocketBase is enabled + reachable,
 * this authenticates against the seeded users record; otherwise it records
 * the mock session. Returns the resolved session + home path.
 */
export async function signIn(role: DemoRole, email: string): Promise<{ session: UnifiedSession; home: string }> {
  return await loginAs(role, email);
}

/** Log out across both backends. */
export function logout(): void {
  logoutP1();
  mockLogout();
}

/** Set the user's locale preference (localStorage for mock sessions; PB users keep record locale). */
export function setLocalePreference(locale: string): void {
  setMockLocalePref(locale);
}

/** Get the user's locale preference from localStorage. */
export function getLocalePreference(): string | null {
  return getMockLocalePref();
}

/**
 * Legacy compatibility: read the raw mock session (localStorage only).
 * Preferred: getSession() / signIn() above.
 */
export { getMockSession, setMockSession, clearMockSession };

/**
 * Layout guard helper: can this unified session access a route?
 * role + tier both resolve from the same session object.
 */
export function canAccessRoute(session: UnifiedSession, requiredRole?: DemoRole, requiredTier?: string): boolean {
  if (requiredRole && session.role !== requiredRole) return false;
  if (requiredTier && session.tier !== requiredTier) return false;
  return true;
}


