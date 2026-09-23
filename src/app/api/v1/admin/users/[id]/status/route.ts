import { NextResponse, type NextRequest } from 'next/server';
import { getUser, setStatus } from '@/ai/user-admin';

/**
 * P5 F-17b — POST /api/v1/admin/users/:id/status — flip a user's status.
 *
 * Body: { status: 'active' | 'suspended' }. The admin Ban/Activate icon
 * actions already assume this; Track A mutates the in-memory board so the UI
 * reflects it live. demo_seed: true. Track B = PocketBase `users` + a real
 * permission-checked status change.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getUser(id)) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  let body: { status?: 'active' | 'suspended' } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (body.status !== 'active' && body.status !== 'suspended') {
    return NextResponse.json({ error: '`status` must be "active" or "suspended"' }, { status: 400 });
  }
  const user = setStatus(id, body.status);
  return NextResponse.json({ user, demo_seed: true });
}

export const dynamic = 'force-dynamic';
