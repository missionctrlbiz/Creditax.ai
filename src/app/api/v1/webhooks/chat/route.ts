import { NextResponse, type NextRequest } from 'next/server';
import { registerChatWebhook } from '@/ai/rag/webhooks';

/**
 * POST /api/v1/webhooks/chat — register an async chat-completion webhook.
 *
 * Body: { url: string, userId?: string, events?: string[] }
 *
 * Track A honesty: this registers the webhook and returns a stub delivery
 * record (`delivered: false, demo_seed: true`). Actual outbound delivery is
 * the Track B background worker's job (Trigger.dev). The demo surface is
 * complete — the shape of the response contract is what matters for the
 * client-facing docs.
 */
export async function POST(req: NextRequest) {
  let body: { url?: string; userId?: string; events?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.url || !/^https?:\/\//i.test(body.url)) {
    return NextResponse.json({ error: '`url` must be an http(s) webhook endpoint' }, { status: 400 });
  }
  try {
    const { registration, delivery } = await registerChatWebhook({
      url: body.url,
      userId: body.userId,
      events: body.events,
    });
    return NextResponse.json({
      registration,
      delivery,
      next_steps: 'In Track B a background worker (Trigger.dev) consumes `registration.id` and POSTs the completed chat to `registration.url` on each event in `events`.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to register webhook' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
