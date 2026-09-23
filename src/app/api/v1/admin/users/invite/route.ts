import { NextResponse, type NextRequest } from 'next/server';
import { inviteUser, listUsers } from '@/ai/user-admin';
import type { SeedRole } from '@/lib/seed/demoSeed';

const ROLES: SeedRole[] = ['consumer', 'tax_pro', 'admin', 'author'];

/**
 * P5 F-17b — POST /api/v1/admin/users/invite — invite a member to the board.
 *
 * P6-collab pre-step: adds a demo-seeded user row (Track A). Body:
 * { email, role? }. Track B = a real invites collection + email delivery.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; role?: SeedRole } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return NextResponse.json({ error: 'a valid `email` is required' }, { status: 400 });
  }
  const role = body.role && ROLES.includes(body.role) ? body.role : 'consumer';
  const user = inviteUser({ email: body.email, role });
  const { users } = listUsers();
  return NextResponse.json({ invited: user, total: users.length, demo_seed: true });
}

export const dynamic = 'force-dynamic';
