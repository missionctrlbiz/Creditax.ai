import { NextResponse, type NextRequest } from 'next/server';
import { runRag, type RagResult, type RagTurn } from '@/ai/rag';
import { getConversationStore } from '@/ai/rag/conversations';
import { registerChatWebhook } from '@/ai/rag/webhooks';

/**
 * POST /api/v1/chat — grounded tax answer (P2 base + P1 multi-turn / async).
 *
 * Body:
 *   {
 *     question: string,
 *     locale?: 'en' | 'yo' | 'ha' | 'ig',
 *     topK?: number,
 *     conversationId?: string,        // P1: load recent turns for context
 *     userId?: string,                // P1: scope + persist the conversation
 *     history?: { role: 'user'|'assistant', text: string }[],  // P1: explicit context
 *     webhookUrl?: string             // P1: register an async delivery stub
 *   }
 *
 * Returns: RagResult + `conversationId` (when P1 context was applied) +
 * `webhook` (when P1 async was requested).
 *
 * Track A honesty: `demo_seed` is true whenever the answer came from the
 * offline fallbacks rather than a live LLM + embeddings provider. Webhook
 * delivery is always flagged `delivered: false` (stub).
 */
export async function POST(req: NextRequest) {
  let body: {
    question?: string;
    locale?: string;
    topK?: number;
    conversationId?: string;
    userId?: string;
    history?: RagTurn[];
    webhookUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const question = (body.question ?? '').trim();
  if (!question) {
    return NextResponse.json({ error: '`question` is required' }, { status: 400 });
  }

  const locale = ['en', 'yo', 'ha', 'ig'].includes(body.locale ?? '') ? body.locale : 'en';
  const topK = Math.min(8, Math.max(1, body.topK ?? 5));

  // P1 multi-turn: resolve history from the conversation store when a
  // conversationId + userId are supplied, else fall back to the explicit
  // `history` array the client sent.
  const store = await getConversationStore();
  let conversationId = body.conversationId;
  let history: RagTurn[] = [];
  if (conversationId && body.userId) {
    history = (await store.recent(conversationId, 4)).map((m) => ({ role: m.role, text: m.text }));
  } else if (body.history?.length) {
    history = body.history.slice(-4);
    if (!conversationId && body.userId) {
      conversationId = await store.create(body.userId, question.slice(0, 40));
    }
  }

  const result: RagResult = await runRag(question, locale, topK, history, conversationId);

  // P1: persist the exchange so the next turn has real context.
  if (conversationId && body.userId) {
    await store.append(conversationId, { role: 'user', text: question });
    await store.append(conversationId, {
      role: 'assistant',
      text: result.answer,
      sources: result.citations,
      kind: 'answer',
    });
  }

  const res = await NextResponse.json({ ...result, conversationId: conversationId ?? null });

  // P1 async: register a webhook stub (no delivery in Track A).
  if (body.webhookUrl) {
    try {
      const { registration, delivery } = await registerChatWebhook({
        url: body.webhookUrl,
        userId: body.userId,
        events: ['chat.completed'],
      });
      res.headers.set('X-Creditax-Webhook-Id', registration.id);
      res.headers.set('X-Creditax-Webhook-Delivered', String(delivery.delivered));
      res.headers.set('X-Creditax-Webhook-Demo', String(delivery.demo_seed));
    } catch {
      res.headers.set('X-Creditax-Webhook-Error', 'invalid url');
    }
  }

  return res;
}

export const dynamic = 'force-dynamic';
