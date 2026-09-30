import { NextResponse, type NextRequest } from 'next/server';
import { runRag, type RagResult, type RagTurn } from '@/ai/rag';
import { getConversationStore } from '@/ai/rag/conversations';
import { registerChatWebhook } from '@/ai/rag/webhooks';
import { meter, type MeteredAction, type Tier } from '@/ai/quota';
import { getDocument } from '@/ai/documents';
import { fmtNaira } from '@/ai/tax-rules';
import { guard } from '@/lib/rate-limit';

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
 *     webhookUrl?: string,          // P1: register an async delivery stub
 *     docId?: string,               // P8: id of an attached (live) document to pin as context
 *     loggedIn?: boolean           // P8: tier-aware referral reveal (pricing §2)
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
  // P19: chat POST was unmetered at the transport level (only user quota);
  // share the in-memory 100 req/min window with the other public endpoints.
  const limited = guard(req);
  if (limited) return limited;

  let body: {
    question?: string;
    locale?: string;
    topK?: number;
    conversationId?: string;
    userId?: string;
    tier?: Tier;
    meteredAction?: MeteredAction;
    history?: RagTurn[];
    webhookUrl?: string;
    docId?: string;
    loggedIn?: boolean;
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

  // P4 F-11 — server-side credit enforcement: meter the action when a user is
  // present. On a cap-hit we short-circuit with a 403 upgrade wall (F-12).
  // Anonymous demo chat (no userId) stays un-metered so the demo never dead-ends.
  const userId = body.userId;
  const metered: MeteredAction = body.meteredAction ?? 'chat';
  if (userId) {
    const gate = meter(userId, metered, { tier: body.tier });
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: gate.reason,
          blocked: true,
          upgrade: gate.status.upgradeHint,
          status: gate.status,
          demo_seed: true,
        },
        { status: 403, headers: { 'X-Creditax-Quota': gate.reason ?? 'limit' } }
      );
    }
  }

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

  // P8 canvas — an attached document's extracted fields are pinned into the
  // next turn as labeled context. The client sends a live doc id from the
  // library; we resolve it server-side so the attachment is real, not a constant.
  let docContext: string | undefined;
  if (body.docId) {
    const doc = getDocument(body.docId);
    if (doc) {
      docContext =
        `${doc.name} (${doc.format}, ${doc.group}) · status ${doc.status}` +
        (doc.amount != null ? ` · amount ${fmtNaira(doc.amount)}` : '') +
        (doc.category ? ` · category ${doc.category}` : '') +
        (doc.period ? ` · period ${doc.period}` : '') +
        (doc.warning ? ` · ${doc.warning}` : '');
    }
  }

  const result: RagResult = await runRag(question, locale, topK, history, conversationId, docContext);

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
