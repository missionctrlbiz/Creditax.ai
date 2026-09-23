import { NextResponse, type NextRequest } from 'next/server';
import { getConversationStore } from '@/ai/rag/conversations';

/**
 * POST /api/v1/conversations — create a conversation for a user.
 *
 * Body: { userId: string, title?: string }
 * Returns: { conversationId, backend }
 *
 * Track A honesty: when the PocketBase flag is off this uses the in-memory
 * store (lost on restart); `backend` in the response makes that explicit.
 */
export async function POST(req: NextRequest) {
  let body: { userId?: string; title?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const userId = (body.userId ?? '').trim();
  if (!userId) {
    return NextResponse.json({ error: '`userId` is required' }, { status: 400 });
  }
  const store = await getConversationStore();
  const id = await store.create(userId, body.title);
  return NextResponse.json({
    conversationId: id,
    backend: store.backend,
    demo_seed: store.backend !== 'pocketbase',
  });
}

export const dynamic = 'force-dynamic';
