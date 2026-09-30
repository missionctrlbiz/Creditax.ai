import { NextResponse, type NextRequest } from 'next/server';
import { createKey, seedDemoKeys, type CreateKeyInput } from '@/ai/api-keys';

/**
 * B2B developer-portal key management (Track A).
 *
 *   GET    /api/v1/api-keys        list keys (demo-seeded on first access)
 *   POST   /api/v1/api-keys        create { name, environment?, scopes?, limit? }
 *   DELETE /api/v1/api-keys/:id    revoke
 *   POST   /api/v1/api-keys/:id/rotate  rotate
 *
 * Track A honesty: keys are deterministic demo secrets, masked; every record
 * carries demo_seed: true. Real issuance + rate-limiting is Track B.
 */
export async function GET() {
  const keys = seedDemoKeys();
  return NextResponse.json({ keys, demo_seed: true });
}

export async function POST(req: NextRequest) {
  let body: CreateKeyInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.name?.trim()) {
    return NextResponse.json({ error: '`name` is required' }, { status: 400 });
  }
  seedDemoKeys();
  const key = createKey(body);
  return NextResponse.json({ key, demo_seed: key.demo_seed });
}

export const dynamic = 'force-dynamic';
