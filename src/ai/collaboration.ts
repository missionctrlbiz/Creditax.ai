/**
 * P6 F-18 — collaboration preview (Track A, product-foundation §10).
 *
 * Two mocked-but-real-shaped flows:
 *   - Paid-workspace invites: only plus/pro/enterprise tiers may invite a
 *     member; each invite has a token + status (pending/accepted/revoked).
 *   - Shared-canvas links: a conversation is shared read-only (view) or
 *     comment; the link renders a read-only preview + a signup CTA for
 *     non-users (the /share/[slug] page).
 *
 * In-memory over `seedInvites` / `seedSharedLinks` (demo_seed), optional
 * PocketBase mirror (pb-data). Track B = real email delivery + workspace
 * membership + per-link access enforcement.
 */

import {
  seedInvites,
  seedSharedLinks,
  seedConversation,
  type DemoInvite,
  type DemoSharedLink,
  type DemoMessage,
  type Tier,
} from '@/lib/seed/demoSeed';

const PAID_TIERS: Tier[] = ['plus', 'professional', 'enterprise'];

export interface InviteInput {
  workspaceId?: string;
  email: string;
  role?: 'member' | 'viewer';
  tier?: Tier;
}

/**
 * Invite a member. Paid-only (product-foundation §10): free tier is refused
 * with a 403-shaped result so the UI can show the upgrade wall (P4 F-13).
 */
export function inviteMember(input: InviteInput):
  | { ok: true; invite: DemoInvite }
  | { ok: false; reason: string; upgradeTo: Tier } {
  const tier = input.tier ?? 'free';
  if (!PAID_TIERS.includes(tier)) {
    return { ok: false, reason: 'Workspace invites are a paid feature', upgradeTo: 'plus' };
  }
  const invite: DemoInvite = {
    id: `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    workspaceId: input.workspaceId ?? 'ws-pro',
    email: input.email,
    role: input.role ?? 'member',
    token: `tok_${Math.random().toString(36).slice(2, 8)}`,
    status: 'pending',
    tier,
    demo_seed: true,
  };
  return { ok: true, invite };
}

/** List invites for a workspace (seeded + session-created). */
export function listInvites(workspaceId = 'ws-pro'): { invites: DemoInvite[]; demo_seed: true } {
  return { invites: seedInvites.filter((i) => i.workspaceId === workspaceId), demo_seed: true };
}

// ---------------------------------------------------------------------------
// Shared-canvas links (read-only preview + signup CTA)
// ---------------------------------------------------------------------------

let linkSeq = 0;

/**
 * Create a shared-canvas link. Only paid tiers can share (product-foundation
 * §10 "Shared canvas links — paid"). Returns a demo slug + the viewer access.
 */
export function createSharedLink(input: {
  conversationId?: string;
  access?: 'view' | 'comment';
  tier?: Tier;
}):
  | { ok: true; link: DemoSharedLink }
  | { ok: false; reason: string; upgradeTo: Tier } {
  const tier = input.tier ?? 'free';
  if (!PAID_TIERS.includes(tier)) {
    return { ok: false, reason: 'Sharing a canvas link is a paid feature', upgradeTo: 'plus' };
  }
  const link: DemoSharedLink = {
    id: `sl-${Date.now().toString(36)}-${++linkSeq}`,
    userId: 'u-pro',
    conversationId: input.conversationId ?? 'cv-pro-1',
    urlSlug: `share_${Math.random().toString(36).slice(2, 8)}`,
    access: input.access ?? 'view',
    demo_seed: true,
  };
  return { ok: true, link };
}

export function listSharedLinks(): { links: DemoSharedLink[]; demo_seed: true } {
  return { links: seedSharedLinks, demo_seed: true };
}

/**
 * Resolve a share slug to a read-only preview payload (the /share/[slug] page).
 * Unknown slugs fall back to the seeded conversation so the demo link always
 * renders.
 */
export function resolveSharedLink(slug: string): {
  link: DemoSharedLink;
  conversation: DemoMessage[];
  access: 'view' | 'comment';
  isSignupCta: boolean;
  demo_seed: true;
} {
  const seed = seedSharedLinks[0];
  const link = seedSharedLinks.find((l) => l.urlSlug === slug) ?? seed;
  return {
    link,
    conversation: seedConversation,
    access: link.access,
    isSignupCta: true, // non-user viewers always see the signup CTA (Track A)
    demo_seed: true,
  };
}
