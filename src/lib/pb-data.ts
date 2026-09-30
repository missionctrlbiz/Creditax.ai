/**
 * P1 — typed data accessors with demo-seed fallback (mvp-demo-plan §2 / G-02).
 *
 * Every accessor reads PocketBase first when the P1 flag is on + reachable,
 * then falls back to the inlined demo seed so the demo always renders. This is
 * the "behaves correctly while knowing nothing real" contract: the UI never
 * sees a missing backend, only labelled seed data.
 *
 * Collections (see pb_migrations/0001_creditax_demo.sql):
 *   users · kb_docs · kb_chunks · professionals · conversations ·
 *   conversation_messages · quotas · notifications · subscriptions
 *
 * Add new readers for the P2–P6 features here so pages stay thin.
 */

import PocketBase from 'pocketbase';
import { probePocketBase, pocketbaseEnabled, pocketbaseUrl } from '@/lib/pb-features';
import {
  seedKbDocs,
  seedProfessionals,
  seedConversation,
  seedQuotas,
  seedNotifications,
  seedUsers,
  type DemoKbDoc,
  type DemoProfessional,
  type DemoMessage,
  type DemoQuota,
  type DemoNotification,
  type DemoUser,
} from '@/lib/seed/demoSeed';

function client(): PocketBase {
  return new PocketBase(pocketbaseUrl());
}

async function reachable(): Promise<boolean> {
  return probePocketBase();
}

// ---------------------------------------------------------------------------
// Knowledge base
// ---------------------------------------------------------------------------

/** Published KB docs (source of truth for P2 RAG ingestion). */
export async function getKbDocs(): Promise<DemoKbDoc[]> {
  if (pocketbaseEnabled() && (await reachable())) {
    try {
      const pb = client();
      const res = await pb.collection('kb_docs').getList(1, 100, {
        filter: 'status = "published"',
        sort: '-updated',
      });
      if (res.items.length > 0) return res.items as unknown as DemoKbDoc[];
    } catch {
      /* fall back to seed */
    }
  }
  return seedKbDocs;
}

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

/** Professionals, optionally filtered by verified-only. */
export async function getProfessionals(opts?: { verifiedOnly?: boolean }): Promise<DemoProfessional[]> {
  const list = opts?.verifiedOnly ? seedProfessionals.filter((p) => p.verified) : seedProfessionals;
  if (pocketbaseEnabled() && (await reachable())) {
    try {
      const pb = client();
      const res = await pb.collection('professionals').getList(1, 100, {
        filter: opts?.verifiedOnly ? 'verified = true' : '',
        sort: '-rating',
      });
      if (res.items.length > 0) return res.items as unknown as DemoProfessional[];
    } catch {
      /* fall back to seed */
    }
  }
  return list;
}

// ---------------------------------------------------------------------------
// Agent conversation (seeded offline; P2 swaps the reader for the RAG loop)
// ---------------------------------------------------------------------------

export async function getConversation(): Promise<DemoMessage[]> {
  if (pocketbaseEnabled() && (await reachable())) {
    try {
      const pb = client();
      const res = await pb.collection('conversation_messages').getList(1, 200, {
        sort: 'created',
      });
      if (res.items.length > 0) return res.items as unknown as DemoMessage[];
    } catch {
      /* fall back to seed */
    }
  }
  return seedConversation;
}

// ---------------------------------------------------------------------------
// Quotas (drive the usage page + upgrade walls)
// ---------------------------------------------------------------------------

export async function getQuotaFor(userId: string): Promise<DemoQuota | null> {
  const seeded = seedQuotas.find((q) => q.userId === userId) ?? seedQuotas[0] ?? null;
  if (pocketbaseEnabled() && (await reachable())) {
    try {
      const pb = client();
      const res = await pb.collection('quotas').getFullList({ filter: `user_id = "${userId}"` });
      if (res.length > 0) return res[0] as unknown as DemoQuota;
    } catch {
      /* fall back to seed */
    }
  }
  return seeded;
}

// ---------------------------------------------------------------------------
// Notifications (bell + dashboard signals)
// ---------------------------------------------------------------------------

export async function getNotificationsFor(userId: string): Promise<DemoNotification[]> {
  const seeded = seedNotifications.filter((n) => n.userId === userId);
  if (pocketbaseEnabled() && (await reachable())) {
    try {
      const pb = client();
      const res = await pb.collection('notifications').getList(1, 100, {
        filter: `user_id = "${userId}"`,
        sort: '-created',
      });
      if (res.items.length > 0) return res.items as unknown as DemoNotification[];
    } catch {
      /* fall back to seed */
    }
  }
  return seeded;
}

// ---------------------------------------------------------------------------
// Users (admin board)
// ---------------------------------------------------------------------------

export async function getUsers(): Promise<DemoUser[]> {
  if (pocketbaseEnabled() && (await reachable())) {
    try {
      const pb = client();
      const res = await pb.collection('users').getList(1, 100);
      if (res.items.length > 0) return res.items as unknown as DemoUser[];
    } catch {
      /* fall back to seed */
    }
  }
  return seedUsers;
}
