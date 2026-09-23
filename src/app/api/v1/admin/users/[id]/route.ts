import { NextResponse, type NextRequest } from 'next/server';
import { getUser } from '@/ai/user-admin';

/**
 * P5 F-17b — GET /api/v1/admin/users/:id — look up one user for the edit modal.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getUser(id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user, demo_seed: true });
}

export const dynamic = 'force-dynamic';
