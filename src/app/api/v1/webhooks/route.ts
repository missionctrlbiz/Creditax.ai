import { NextResponse, type NextRequest } from 'next/server';
import { createWebhook, seedDemoWebhooks } from '@/ai/webhooks-store';

/**
 * B2B webhook endpoint registry (Track A).
 *
 *   GET  /api/v1/webhooks            list registered endpoints (demo-seeded)
 *   POST /api/v1/webhooks            register { url, userId?, events? }
 *   POST /api/v1/webhooks/:id/toggle enable/disable
 *
 * Delivery is the Track B worker's job; the registry shape is complete and
 * demo-able. demo_seed: true.
 */
export async function GET() {
  const endpoints = seedDemoWebhooks();
  return NextResponse.json({ endpoints, demo_seed: true });
}

export async function POST(req: NextRequest) {
  let body: { url?: string; userId?: string; events?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  seedDemoWebhooks();
  if (!body.url || !/^https?:\/\//i.test(body.url)) {
    return NextResponse.json({ error: '`url` must be an http(s) endpoint' }, { status: 400 });
  }
  try {
    const endpoint = createWebhook({ url: body.url, userId: body.userId, events: body.events });
    return NextResponse.json({
      endpoint,
      demo_seed: endpoint.demo_seed,
      note: 'Delivery requires the Track B background worker.',
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to register webhook' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
