import { NextResponse } from 'next/server';
import { listUsers } from '@/ai/user-admin';

/**
 * P5 F-17b — GET /api/v1/admin/users — the admin users board, wired to data.
 *
 * Returns the demo role accounts (seedUsers, demo_seed) with their status +
 * tier + locale. Per-user actions live in `./[id]/route.ts` (GET) and
 * `[id]/status` + `[id]/invite` (POST). Track B swaps the in-memory store for
 * the PocketBase `users` collection.
 */
export async function GET() {
  const { users, demo_seed } = listUsers();
  return NextResponse.json({ users, demo_seed });
}

export const dynamic = 'force-dynamic';
