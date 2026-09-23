/**
 * P1 — PocketBase-backed session with 4-role enforcement.
 *
 * roles-and-experience.md §1 locks 8 roles; the demo exercises 4 that have
 * distinct homes: consumer, tax_pro, admin, author. This module is the
 * single source of truth for "what can this role do and where does it land",
 * shared by the board layouts and AccountMenu so role enforcement is real
 * rather than convention-based.
 *
 * It reads the PocketBase `users` record (role + tier + locale) when the P1
 * flag is on, and falls back to the local mock session otherwise. The
 * `role-gate.ts` helpers are pure and unit-testable; this module is the
 * async/IO seam around them.
 */

import PocketBase from 'pocketbase';
import {
  getSession as getMockSession,
  setSession as setMockSession,
  clearSession as clearMockSession,
  logout as mockLogout,
  type PortalRole,
} from '@/lib/mock-auth';
import { ROLE_HOME } from '@/lib/seed/demoSeed';
import { pocketbaseEnabled, probePocketBase } from '@/lib/pb-features';

export type DemoRole = 'consumer' | 'tax_pro' | 'admin' | 'author';

export interface P1Session {
  role: DemoRole;
  email: string;
  name: string;
  tier: string;
  locale: string;
  /** True when the session came from PocketBase, false when from the mock. */
  source: 'pocketbase' | 'mock';
}

/** Map the mock 3-role PortalRole to the 4-role demo space. */
function mockToDemo(role: PortalRole): DemoRole {
  switch (role) {
    case 'personal':
      return 'consumer';
    case 'pro':
      return 'tax_pro';
    case 'admin':
      return 'admin';
    default:
      return 'consumer';
  }
}

function demoToMock(role: DemoRole): PortalRole {
  switch (role) {
    case 'tax_pro':
      return 'pro';
    case 'admin':
      return 'admin';
    case 'author':
      // Author signs into the admin board with a scoped grant (roles doc §1).
      return 'admin';
    case 'consumer':
    default:
      return 'personal';
  }
}

export const DEMO_NAMES: Record<DemoRole, string> = {
  consumer: 'Emeka Okafor',
  tax_pro: 'Ayo Ogundimu',
  admin: 'Super Admin',
  author: 'Nneka Eze',
};

const DEMO_TIER: Record<DemoRole, string> = {
  consumer: 'free',
  tax_pro: 'professional',
  admin: 'enterprise',
  author: 'free',
};

/**
 * Get the current session, preferring PocketBase when enabled + reachable,
 * else the mock. Never throws — a bad session resolves to a consumer fallback.
 */
export async function getP1Session(): Promise<P1Session> {
  if (pocketbaseEnabled()) {
    const ok = await probePocketBase();
    if (ok) {
      try {
        const pb: PocketBase = new PocketBase(
          process.env.NEXT_PUBLIC_POCKETBASE_URL || process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'
        );
        if (pb.authStore.isValid) {
          const rec = pb.authStore.record as Record<string, unknown> | null;
          const role = ((rec?.role as DemoRole) ?? 'consumer') as DemoRole;
          return {
            role,
            email: (rec?.email as string) || 'demo@creditax.ai',
            name: (rec?.name as string) || DEMO_NAMES[role],
            tier: (rec?.tier as string) || DEMO_TIER[role],
            locale: (rec?.locale as string) || 'en',
            source: 'pocketbase',
          };
        }
      } catch {
        /* fall through to mock */
      }
    }
  }
  const mock = getMockSession();
  const role = mockToDemo(mock.role ?? 'personal');
  return {
    role,
    email: mock.email || 'demo@creditax.ai',
    name: DEMO_NAMES[role],
    tier: DEMO_TIER[role],
    locale: 'en',
    source: 'mock',
  };
}

/**
 * Sign in with a chosen demo role. When PocketBase is enabled + reachable,
 * this authenticates against the seeded users record; otherwise it records
 * the mock session (and PB login_log) exactly like the current build.
 * Returns the resolved session + home path for the caller to navigate.
 */
export async function loginAs(role: DemoRole, email: string): Promise<{ session: P1Session; home: string }> {
  if (pocketbaseEnabled()) {
    const ok = await probePocketBase();
    if (ok) {
      try {
        const pb: PocketBase = new PocketBase(
          process.env.NEXT_PUBLIC_POCKETBASE_URL || process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'
        );
        await pb.collection('users').authWithPassword(email, 'demo');
        const rec = pb.authStore.record as Record<string, unknown> | null;
        const resolved = ((rec?.role as DemoRole) ?? role) as DemoRole;
        return {
          session: {
            role: resolved,
            email,
            name: (rec?.name as string) || DEMO_NAMES[resolved],
            tier: (rec?.tier as string) || DEMO_TIER[resolved],
            locale: (rec?.locale as string) || 'en',
            source: 'pocketbase',
          },
          home: ROLE_HOME[resolved],
        };
      } catch {
        /* fall back to mock so the demo never blocks on infra */
      }
    }
  }
  setMockSession(demoToMock(role), email);
  return {
    session: { role, email, name: DEMO_NAMES[role], tier: DEMO_TIER[role], locale: 'en', source: 'mock' },
    home: ROLE_HOME[role],
  };
}

/** Log out across both backends. */
export function logoutP1(): void {
  clearMockSession();
  mockLogout();
}

/** Re-export for import convenience. */
export { ROLE_HOME } from '@/lib/seed/demoSeed';
