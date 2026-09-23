/**
 * role-gate — pure, testable role → access logic (P1 / F-01).
 *
 * Centralises "where can this role go" so boards, AccountMenu and the auth
 * flow all agree. No IO here; `pb-auth.ts` supplies the session, these
 * helpers turn it into decisions.
 */

import type { SeedRole } from '@/lib/seed/demoSeed';

export const ROLES: SeedRole[] = ['consumer', 'tax_pro', 'admin', 'author'];

/** Which top-level board each role lives in. */
export function boardFor(role: SeedRole): 'consumer' | 'pro' | 'admin' {
  switch (role) {
    case 'tax_pro':
      return 'pro';
    case 'admin':
    case 'author':
      return 'admin';
    case 'consumer':
    default:
      return 'consumer';
  }
}

/** Paths a role may reach. Unknown roles get an empty allow-list (fail closed). */
export function allowedPaths(role: SeedRole): string[] {
  switch (role) {
    case 'consumer':
      return ['/dashboard'];
    case 'tax_pro':
      return ['/pro', '/pro/dashboard', '/pro/calculations', '/pro/clients', '/pro/verify', '/pro/apply', '/pro/settings'];
    case 'author':
      // scoped to the admin board's content scopes (blog/KB) + shared nav
      return ['/admin', '/admin/dashboard', '/admin/knowledge-base'];
    case 'admin':
      return ['/admin'];
    default:
      return [];
  }
}

/** True when `path` sits under any of the role's allowed prefixes. */
export function canAccess(role: SeedRole, path: string): boolean {
  return allowedPaths(role).some((p) => path === p || path.startsWith(p + '/'));
}

/** Home per role (mirrors demoSeed.ROLE_HOME). */
export function homeFor(role: SeedRole): string {
  switch (role) {
    case 'consumer':
      return '/dashboard';
    case 'tax_pro':
      return '/pro/dashboard';
    case 'admin':
    case 'author':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
}
