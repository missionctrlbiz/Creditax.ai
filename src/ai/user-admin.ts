/**
 * P5 F-17b — admin users board (Track A).
 *
 * The admin users tab is wired to real data: an in-memory store seeded from
 * `seedUsers` (demo_seed), with status flips the icon actions already assume
 * (suspend/activate). The board shows the 4 demo role accounts + their tier +
 * locale, and admin actions mutate the store so the UI reflects them live.
 *
 * Track A honesty: every record is demo_seed. Track B swaps the in-memory
 * store for the PocketBase `users` collection (pb-data getUsers) + a real
 * admin-permissioned status change.
 */

import { seedUsers, type DemoUser } from '@/lib/seed/demoSeed';

export type UserStatus = 'active' | 'suspended';

export interface AdminUser extends DemoUser {
  status: UserStatus;
  lastActive: string;
}

let seq = 0;

/** In-memory board, seeded once. */
function seedBoard(): AdminUser[] {
  // Deterministic demo statuses + "last active" offsets so the board looks live.
  const defaults: Record<string, { status: UserStatus; lastActive: string }> = {
    'u-consumer': { status: 'active', lastActive: '2 min ago' },
    'u-pro': { status: 'active', lastActive: '15 min ago' },
    'u-admin': { status: 'active', lastActive: '1 hr ago' },
    'u-author': { status: 'active', lastActive: '3 hr ago' },
  };
  return seedUsers.map((u) => {
    const d = defaults[u.id] ?? { status: 'active' as UserStatus, lastActive: 'just now' };
    return { ...u, status: d.status, lastActive: d.lastActive };
  });
}

const board = new Map<string, AdminUser>(
  seedBoard().map((u) => [u.id, u])
);

/** List the users board (demo-seeded + any live flips). */
export function listUsers(): { users: AdminUser[]; demo_seed: true } {
  return { users: [...board.values()], demo_seed: true };
}

export function getUser(id: string): AdminUser | null {
  return board.get(id) ?? null;
}

/** Flip a user's status (suspend/activate) — the admin icon action. */
export function setStatus(id: string, status: UserStatus): AdminUser | null {
  const u = board.get(id);
  if (!u) return null;
  u.status = status;
  u.lastActive = 'just now';
  board.set(id, u);
  return u;
}

export function suspendUser(id: string): AdminUser | null {
  return setStatus(id, 'suspended');
}

export function activateUser(id: string): AdminUser | null {
  return setStatus(id, 'active');
}

/** Invite a member (P6 collab pre-step; Track A = a demo board row). */
export function inviteUser(input: { email: string; role?: DemoUser['role'] }): AdminUser {
  const id = `u-invite-${++seq}`;
  const user: AdminUser = {
    id,
    email: input.email,
    name: input.email.split('@')[0],
    role: input.role ?? 'consumer',
    tier: 'free',
    locale: 'en',
    status: 'active',
    lastActive: 'invited just now',
    demo_seed: true,
  };
  board.set(id, user);
  return user;
}
