import { NextResponse } from 'next/server';
import { toggleWebhook, seedDemoWebhooks } from '@/ai/webhooks-store';

/** POST /api/v1/webhooks/:id/toggle — enable/disable a webhook endpoint. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  seedDemoWebhooks();
  const w = toggleWebhook(id);
  if (!w) return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  return NextResponse.json({ endpoint: w, demo_seed: w.demo_seed });
}

export const dynamic = 'force-dynamic';
