import { NextResponse } from 'next/server';
import { listInvites, listSharedLinks } from '@/ai/collaboration';

/**
 * P6 F-18 — GET /api/v1/collab → invites + shared links (demo-seeded).
 * Invite/share POSTs live in ./invite and ./share. demo_seed: true.
 */
export async function GET() {
  return NextResponse.json({ ...listInvites(), ...listSharedLinks(), demo_seed: true });
}

export const dynamic = 'force-dynamic';
