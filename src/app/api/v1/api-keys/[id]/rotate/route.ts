import { NextResponse } from 'next/server';
import { rotateKey, seedDemoKeys } from '@/ai/api-keys';

/**
 * POST /api/v1/api-keys/:id/rotate — rotate a key's secret (Track A demo).
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  seedDemoKeys();
  const key = rotateKey(id);
  if (!key) return NextResponse.json({ error: 'Key not found or already revoked' }, { status: 404 });
  return NextResponse.json({ key, demo_seed: key.demo_seed });
}

export const dynamic = 'force-dynamic';
