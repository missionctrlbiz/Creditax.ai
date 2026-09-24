/**
 * b2b-platform — API key management (Track A).
 *
 * In-memory primary (deterministic demo keys survive the click-through) with
 * optional PocketBase persistence (the `api_keys` collection). Keys are
 * generated with a stable, masked shape so the UI can reveal/copy without
 * ever exposing a full live secret in a demo. `demo_seed: true` everywhere.
 *
 * Track B: the same interface backs real key issuance + the deferred
 * core-api rate-limit (100 req/min per key).
 */

import { getPb } from '@/lib/pocketbase';
import { probePocketBase, pocketbaseEnabled } from '@/lib/pb-features';

export type KeyEnvironment = 'live' | 'test';

export interface ApiKeyRecord {
  id: string;
  name: string;
  /** Masked form, e.g. sk_live_****************************8f3a. */
  key: string;
  environment: KeyEnvironment;
  scopes: string[];
  status: 'active' | 'revoked';
  usage: number;
  limit: number; // Infinity encoded as -1 on the wire
  created_by: string;
  created_at: string;
  last_used: string;
  demo_seed: true;
}

export interface CreateKeyInput {
  name: string;
  environment?: KeyEnvironment;
  scopes?: string[];
  limit?: number;
  createdBy?: string;
}

const store = new Map<string, ApiKeyRecord>();
let counter = 0;

function mask(raw: string): string {
  const prefix = raw.slice(0, 8); // sk_live_ / sk_test_
  const suffix = raw.slice(-4);
  return `${prefix}${'*'.repeat(24)}${suffix}`;
}

// Deterministic per-counter key (stable demo); Track B replaces with crypto.
function makeKey(environment: KeyEnvironment, n: number): string {
  const body = (0x5eed000000000000 + n * 0x0123456789abcdef).toString(16);
  return `sk_${environment === 'live' ? 'live' : 'test'}_${body}`;
}

/** Fire-and-forget PocketBase mirror; in-memory store is the source of truth. */
function persist(record: Omit<ApiKeyRecord, 'demo_seed'>): void {
  if (!pocketbaseEnabled()) return;
  probePocketBase()
    .then((up) => {
      if (!up) return;
      return getPb().collection('api_keys').create({
        id: record.id,
        name: record.name,
        key: record.key,
        environment: record.environment,
        scopes: JSON.stringify(record.scopes),
        status: record.status,
        usage: record.usage,
        limit: record.limit,
        created_by: record.created_by,
        last_used: record.last_used,
        demo_seed: 1,
      });
    })
    .catch(() => {
      /* offline — in-memory only */
    });
}

export function listKeys(): ApiKeyRecord[] {
  return [...store.values()].sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
}

export function getKey(id: string): ApiKeyRecord | null {
  return store.get(id) ?? null;
}

export function createKey(input: CreateKeyInput): ApiKeyRecord {
  counter += 1;
  const environment: KeyEnvironment = input.environment ?? 'live';
  const id = `key-${Date.now().toString(36)}-${counter}`;
  const raw = makeKey(environment, counter);
  const record: ApiKeyRecord = {
    id,
    name: input.name,
    key: mask(raw),
    environment,
    scopes: input.scopes ?? ['Read', 'Write'],
    status: 'active',
    usage: 0,
    limit: input.limit ?? Infinity,
    created_by: input.createdBy ?? 'demo',
    created_at: new Date().toISOString(),
    last_used: 'never',
    demo_seed: true,
  };
  store.set(id, record);
  persist(record);
  return record;
}

/**
 * Bump a stored key's usage + last_used when an admitted request passes the
 * rate limiter. Keys are masked, so we match on the last 4 chars — the caller
 * passes the bearer it saw on the wire. No-op if the key is unknown.
 */
export function bumpUsage(rawKey: string): ApiKeyRecord | null {
  if (rawKey.length < 4) return null;
  const suffix = rawKey.slice(-4);
  for (const record of store.values()) {
    if (record.key.endsWith(suffix)) {
      record.usage += 1;
      record.last_used = 'just now';
      return record;
    }
  }
  return null;
}

export function revokeKey(id: string): ApiKeyRecord | null {
  const k = store.get(id);
  if (!k) return null;
  k.status = 'revoked';
  store.set(id, k);
  return k;
}

export function rotateKey(id: string): ApiKeyRecord | null {
  const k = store.get(id);
  if (!k || k.status === 'revoked') return null;
  counter += 1;
  k.key = mask(makeKey(k.environment, counter));
  k.last_used = 'just now';
  store.set(id, k);
  return k;
}

let seeded = false;

/** Seed two demo keys on first access so the click-through shows content. */
export function seedDemoKeys(): ApiKeyRecord[] {
  if (seeded) return listKeys();
  seeded = true;
  const a = createKey({ name: 'Production Key', environment: 'live', scopes: ['Read', 'Write'], limit: 10000, createdBy: 'Emeka Obi' });
  a.usage = 8431;
  const b = createKey({ name: 'Development Key', environment: 'test', scopes: ['Read'], limit: Infinity, createdBy: 'Emeka Obi' });
  b.usage = 234;
  return listKeys();
}
