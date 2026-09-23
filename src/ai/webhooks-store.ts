/**
 * b2b-platform — webhook endpoint registry (Track A).
 *
 * In-memory primary + optional PocketBase mirror (the `webhooks` collection,
 * already added by the rag-pipeline phase). Track B: a durable worker
 * (Trigger.dev) consumes these registrations and delivers real events.
 * Every record is `demo_seed: true`.
 */

import { getPb } from '@/lib/pocketbase';
import { probePocketBase, pocketbaseEnabled } from '@/lib/pb-features';

export interface WebhookEndpoint {
  id: string;
  url: string;
  user_id: string;
  events: string[];
  active: boolean;
  secret: string; // masked signing secret
  created_at: string;
  demo_seed: true;
}

const store = new Map<string, WebhookEndpoint>();
let whCounter = 0;

export function maskSecret(raw: string): string {
  return raw.slice(0, 6) + '*'.repeat(16) + raw.slice(-4);
}

export function listWebhooks(): WebhookEndpoint[] {
  return [...store.values()];
}

export function createWebhook(input: { url: string; userId?: string; events?: string[] }): WebhookEndpoint {
  if (!/^https?:\/\//i.test(input.url)) throw new Error('url must be http(s)');
  whCounter += 1;
  const id = `wh-${Date.now().toString(36)}-${whCounter}`;
  const rec: WebhookEndpoint = {
    id,
    url: input.url,
    user_id: input.userId ?? 'demo',
    events: input.events ?? ['document.processed', 'credit.score.updated'],
    active: true,
    secret: maskSecret(`whsec_${Math.random().toString(36).slice(2, 10)}`),
    created_at: new Date().toISOString(),
    demo_seed: true,
  };
  store.set(id, rec);
  if (pocketbaseEnabled()) {
    probePocketBase()
      .then((up) =>
        up
          ? getPb().collection('webhooks').create({
              id,
              url: rec.url,
              user_id: rec.user_id,
              events: JSON.stringify(rec.events),
              active: 1,
              demo_seed: 1,
            })
          : undefined
      )
      .catch(() => {
        /* offline — in-memory only */
      });
  }
  return rec;
}

export function toggleWebhook(id: string): WebhookEndpoint | null {
  const w = store.get(id);
  if (!w) return null;
  w.active = !w.active;
  return w;
}

export function seedDemoWebhooks(): WebhookEndpoint[] {
  if (store.size > 0) return listWebhooks();
  createWebhook({ url: 'https://api.zenithfoods.ng/webhooks/creditax', userId: 'demo', events: ['document.processed', 'credit.score.updated', 'tax.filing.submitted'] });
  createWebhook({ url: 'https://hooks.acme.ng/creditax', userId: 'demo', events: ['report.completed'] });
  return listWebhooks();
}
