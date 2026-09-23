/**
 * P6 F-19 — external AI connectors preview (Track A, product-foundation §10).
 *
 * A connector links an external app (Google Drive, Claude, ChatGPT, Notion,
 * a second brain) so a user can prompt *with* it as context. Free tier
 * includes 2 connectors; paid tiers more (pricing-and-access §2 /
 * CONNECTORS_PER_TIER). Track A mocks the "connect" (no real OAuth); the
 * connection is stored in-memory over `seedConnectors` (demo_seed) so the
 * dashboard "Connected apps" + "2 connectors included" story is real on-camera.
 *
 * The "connected as prompt context" part is demonstrated by a `promptContext`
 * helper that returns the connected apps' display names — the chat canvas can
 * surface them as context chips. Track B = real OAuth + per-app token scoping.
 */

import {
  seedConnectors,
  CONNECTORS_PER_TIER,
  type DemoConnector,
  type ConnectorService,
  type Tier,
} from '@/lib/seed/demoSeed';

const SERVICES: Array<{ service: ConnectorService; displayName: string; description: string }> = [
  { service: 'google_drive', displayName: 'Google Drive', description: 'Read documents as prompt context' },
  { service: 'claude', displayName: 'Claude (Anthropic)', description: 'Bring Claude notes into the agent' },
  { service: 'chatgpt', displayName: 'ChatGPT', description: 'Reference ChatGPT threads' },
  { service: 'notion', displayName: 'Notion', description: 'Link Notion pages' },
  { service: 'second_brain', displayName: 'Second Brain', description: 'Personal knowledge base' },
];

export function listServices(): Array<{ service: ConnectorService; displayName: string; description: string }> {
  return SERVICES;
}

let seq = 0;

/**
 * Connect a service for a user. Enforces the per-tier connector cap: when the
 * user already has `CONNECTORS_PER_TIER[tier]` connected, return ok:false so
 * the UI shows the "You have your 2 free connectors" wall (P4).
 */
export function connectService(input: { userId?: string; service: ConnectorService; tier?: Tier }):
  | { ok: true; connector: DemoConnector; used: number; cap: number }
  | { ok: false; reason: string; used: number; cap: number; upgradeTo?: Tier } {
  const tier = input.tier ?? 'free';
  const cap = CONNECTORS_PER_TIER[tier];
  const used = seedConnectors.filter((c) => c.userId === (input.userId ?? 'u-consumer') && c.status === 'connected').length;

  if (cap !== Infinity && used >= cap) {
    const nextUp: Tier = tier === 'free' ? 'plus' : 'professional';
    return { ok: false, reason: `Free includes ${cap} connectors — connect more on ${nextUp}`, used, cap, upgradeTo: nextUp };
  }

  const connector: DemoConnector = {
    id: `c-${Date.now().toString(36)}-${++seq}`,
    userId: input.userId ?? 'u-consumer',
    service: input.service,
    displayName: SERVICES.find((s) => s.service === input.service)?.displayName ?? input.service,
    scope: 'read',
    status: 'connected',
    demo_seed: true,
  };
  return { ok: true, connector, used: used + 1, cap };
}

export function listConnectors(userId = 'u-consumer'): { connectors: DemoConnector[]; demo_seed: true } {
  return { connectors: seedConnectors.filter((c) => c.userId === userId), demo_seed: true };
}

/** The connected app display names — surfaced as prompt-context chips. */
export function promptContext(userId = 'u-consumer'): { service: string; displayName: string }[] {
  return seedConnectors
    .filter((c) => c.userId === userId && c.status === 'connected')
    .map((c) => ({ service: c.service, displayName: c.displayName }));
}

/** Connector status for the dashboard (F-19 "free shows 2 included"). */
export function connectorStatus(userId = 'u-consumer', tier: Tier = 'free') {
  const cap = CONNECTORS_PER_TIER[tier];
  const used = seedConnectors.filter((c) => c.userId === userId && c.status === 'connected').length;
  return {
    used,
    cap,
    remaining: cap === Infinity ? -1 : Math.max(0, cap - used),
    unlimited: cap === Infinity,
    demo_seed: true,
  };
}
