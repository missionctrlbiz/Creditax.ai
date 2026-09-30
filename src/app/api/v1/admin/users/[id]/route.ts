import { NextResponse, type NextRequest } from 'next/server';
import { getUser, updateUser, setStatus } from '@/ai/user-admin';
import type { UserStatus } from '@/ai/user-admin';

/**
 * P5 F-17b — GET /api/v1/admin/users/:id — look up one user for the edit modal.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getUser(id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user, demo_seed: true });
}

/**
 * P12 — PATCH /api/v1/admin/users/:id — persist the edit-modal's changes
 * (name/email/tier/locale/status) through the user-admin store. demo_seed.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: {
    name?: string;
    email?: string;
    tier?: string;
    locale?: string;
    status?: UserStatus;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const user = getUser(id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  updateUser(id, {
    name: body.name,
    email: body.email,
    tier: body.tier as never,
    locale: body.locale as never,
  });
  if (body.status) {
    setStatus(id, body.status);
  }
  const updated = getUser(id);
  return NextResponse.json({ user: updated, demo_seed: true });
}

export const dynamic = 'force-dynamic';
