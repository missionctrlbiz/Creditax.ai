import { NextResponse } from 'next/server';
import { getConversationStore } from '@/ai/rag/conversations';

/**
 * GET /api/v1/conversations/:userId — list a user's conversations.
 *
 * Returns the user's conversation list (id, title, message count). Track A:
 * when offline this is served by the in-memory store (seeded demo thread
 * included); `backend` + `demo_seed` make that explicit.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const store = await getConversationStore();
  const list = await store.list(userId);
  return NextResponse.json({
    userId,
    backend: store.backend,
    demo_seed: store.backend !== 'pocketbase',
    conversations: list.map((c) => ({
      id: c.id,
      title: c.title ?? null,
      messages: c.messages.length,
      lastMessage: c.messages.length ? c.messages[c.messages.length - 1].text.slice(0, 120) : null,
    })),
  });
}

export const dynamic = 'force-dynamic';
