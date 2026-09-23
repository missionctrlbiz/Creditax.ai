/**
 * P1 — webhook callback stub for async chat responses.
 *
 * Track A posture: webhooks are *registered* but not *delivered*. The stub
 * records the registration in PocketBase (or in-memory offline) and logs a
 * would-be delivery, so the API surface is complete and demo-able without a
 * real outbound-HTTP worker (Trigger.dev / a durable queue is the Track B
 * delivery layer). Every response is flagged `demo_seed` / `delivered:false`.
 */

import { getPb } from '@/lib/pocketbase';
import { probePocketBase, pocketbaseEnabled } from '@/lib/pb-features';

export interface WebhookRegistration {
  id: string;
  url: string;
  user_id?: string;
  events: string[];
  active: boolean;
  created_at: string;
}

export interface DeliveryResult {
  registered: boolean;
  delivered: false;
  demo_seed: true;
  note: string;
}

let memCounter = 0;

/**
 * Register a webhook endpoint for async chat delivery. Persists the
 * registration (PocketBase `webhooks` collection when reachable, otherwise a
 * demo-only in-memory ack) and returns a stub delivery record.
 *
 * The caller is expected to follow up with a background job in Track B; in
 * Track A this is intentionally a no-op delivery so the demo can show the
 * shape of the response contract without claiming an outbound call happened.
 */
export async function registerChatWebhook(input: {
  url: string;
  userId?: string;
  events?: string[];
}): Promise<{ registration: WebhookRegistration; delivery: DeliveryResult }> {
  const url = (input.url ?? '').trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('webhook.url must be an http(s) URL');
  }

  const id = `wh-${Date.now().toString(36)}-${++memCounter}`;
  const events = input.events?.length ? input.events : ['chat.completed'];

  let registration: WebhookRegistration = {
    id,
    url,
    user_id: input.userId,
    events,
    active: true,
    created_at: new Date().toISOString(),
  };

  if (pocketbaseEnabled() && (await probePocketBase())) {
    try {
      const rec = await getPb().collection('webhooks').create({
        url,
        user_id: input.userId ?? '',
        events: JSON.stringify(events),
        active: 1,
        demo_seed: 1,
      });
      registration = { ...registration, id: rec.id };
    } catch (err) {
      console.warn('[webhooks] PocketBase registration failed; using demo stub', err);
    }
  }

  return {
    registration,
    delivery: {
      registered: true,
      delivered: false,
      demo_seed: true,
      note: 'Demo stub: registration recorded, delivery requires the Track B background worker (Trigger.dev).',
    },
  };
}
