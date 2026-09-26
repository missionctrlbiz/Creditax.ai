/**
 * P1 — per-user conversation history.
 *
 * Two backends mirroring the vector-store pattern:
 *   - PocketBaseConversationStore: `conversations` + `conversation_messages`
 *     collections (pb_migrations/0001).
 *   - InMemoryConversationStore: process-local Map, seeded from
 *     demoSeed.seedConversation. Demo-labeled; lost on restart (Track A).
 *
 * The store is what makes multi-turn context real: the chat route appends
 * each exchange, and the next turn loads the recent history back in.
 */

import { pbServer } from '@/lib/pb-server';
import { probePocketBase, pocketbaseEnabled } from '@/lib/pb-features';
import { seedConversation } from '@/lib/seed/demoSeed';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
  kind?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  messages: ConversationMessage[];
}

export interface ConversationStore {
  readonly backend: 'pocketbase' | 'in-memory';
  create(userId: string, title?: string): Promise<string>;
  append(conversationId: string, msg: Omit<ConversationMessage, 'id'>): Promise<ConversationMessage>;
  get(conversationId: string): Promise<Conversation | null>;
  list(userId: string): Promise<Conversation[]>;
  /** Last n messages, oldest first (multi-turn context window). */
  recent(conversationId: string, n: number): Promise<ConversationMessage[]>;
}

// ---------------------------------------------------------------------------
// In-memory backend (offline default)
// ---------------------------------------------------------------------------

class InMemoryConversationStore implements ConversationStore {
  readonly backend = 'in-memory' as const;
  private convos = new Map<string, { userId: string; title?: string; messages: ConversationMessage[] }>();
  private seeded = false;

  private seed() {
    if (this.seeded) return;
    const msgs = seedConversation.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      text: m.text,
      sources: m.sources,
      kind: m.kind,
    }));
    this.convos.set('conv-demo', { userId: 'u-consumer', title: 'VAT & PAYE help', messages: msgs });
    this.seeded = true;
  }

  async create(userId: string, title?: string): Promise<string> {
    this.seed();
    const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.convos.set(id, { userId, title, messages: [] });
    return id;
  }

  async append(conversationId: string, msg: Omit<ConversationMessage, 'id'>): Promise<ConversationMessage> {
    this.seed();
    const c = this.convos.get(conversationId);
    const m: ConversationMessage = { id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ...msg };
    if (!c) throw new Error(`Conversation ${conversationId} not found`);
    c.messages.push(m);
    return m;
  }

  async get(conversationId: string): Promise<Conversation | null> {
    this.seed();
    const c = this.convos.get(conversationId);
    if (!c) return null;
    return { id: conversationId, user_id: c.userId, title: c.title, messages: [...c.messages] };
  }

  async list(userId: string): Promise<Conversation[]> {
    this.seed();
    return [...this.convos.entries()]
      .filter(([, c]) => c.userId === userId)
      .map(([id, c]) => ({ id, user_id: c.userId, title: c.title, messages: [...c.messages] }));
  }

  async recent(conversationId: string, n: number): Promise<ConversationMessage[]> {
    const c = await this.get(conversationId);
    if (!c) return [];
    return c.messages.slice(-n);
  }
}

// ---------------------------------------------------------------------------
// PocketBase backend
// ---------------------------------------------------------------------------

class PocketBaseConversationStore implements ConversationStore {
  readonly backend = 'pocketbase' as const;

  async create(userId: string, title?: string): Promise<string> {
    const rec = await pbServer().collection('conversations').create({ user_id: userId, title: title ?? '' });
    return rec.id;
  }

  async append(conversationId: string, msg: Omit<ConversationMessage, 'id'>): Promise<ConversationMessage> {
    const rec = await pbServer().collection('conversation_messages').create({
      conversation_id: conversationId,
      role: msg.role,
      kind: msg.kind ?? '',
      text: msg.text,
      sources: msg.sources ? JSON.stringify(msg.sources) : '',
      demo_seed: 1,
    });
    return { id: rec.id, role: msg.role, text: msg.text, sources: msg.sources, kind: msg.kind };
  }

  async get(conversationId: string): Promise<Conversation | null> {
    const pb = pbServer();
    const res = await pb.collection('conversations').getFullList({ filter: `id = "${conversationId}"` });
    if (res.length === 0) return null;
    const conv = res[0];
    const msgs = await pb.collection('conversation_messages').getList(1, 500, {
      filter: `conversation_id = "${conversationId}"`,
      sort: 'created',
    });
    return {
      id: conversationId,
      user_id: conv.user_id,
      title: conv.title,
      messages: msgs.items.map((m: Record<string, unknown>) => ({
        id: m.id as string,
        role: m.role as 'user' | 'assistant',
        text: m.text as string,
        sources: m.sources ? (JSON.parse(String(m.sources)) as string[]) : undefined,
        kind: m.kind as string | undefined,
      })),
    };
  }

  async list(userId: string): Promise<Conversation[]> {
    const pb = pbServer();
    const res = await pb.collection('conversations').getFullList({ filter: `user_id = "${userId}"` });
    const out: Conversation[] = [];
    for (const c of res) {
      const conv = await this.get(c.id);
      if (conv) out.push(conv);
    }
    return out;
  }

  async recent(conversationId: string, n: number): Promise<ConversationMessage[]> {
    const c = await this.get(conversationId);
    if (!c) return [];
    return c.messages.slice(-n);
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

let cached: ConversationStore | null = null;

export async function getConversationStore(): Promise<ConversationStore> {
  if (cached) return cached;
  const usePb = pocketbaseEnabled() && (await probePocketBase());
  cached = usePb ? new PocketBaseConversationStore() : new InMemoryConversationStore();
  return cached;
}

export function resetConversationStore(): void {
  cached = null;
}
