import { NextResponse, type NextRequest } from 'next/server';
import { getKey, revokeKey, seedDemoKeys } from '@/ai/api-keys';

/**
 * B2B API-key detail (Track A).
 *
 *   GET    /api/v1/api-keys/:id      fetch a key (404 if unknown)
 *   DELETE /api/v1/api-keys/:id      revoke a key
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  seedDemoKeys();
  const key = getKey(id);
  if (!key) return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  return NextResponse.json({ key, demo_seed: key.demo_seed });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  seedDemoKeys();
  const key = revokeKey(id);
  if (!key) return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  return NextResponse.json({ key, demo_seed: key.demo_seed });
}

export const dynamic = 'force-dynamic';
