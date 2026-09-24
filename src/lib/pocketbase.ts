'use client';

import { useCallback, useState } from 'react';
import PocketBase from 'pocketbase';

/**
 * PocketBase helpers for the demo build (Track A).
 * Collections used by the UI:
 *   - waitlist  : { email, source }         — "Join the list" + newsletter
 *   - login_log : { email, role }           — every direct login, for reference
 *
 * When PocketBase is unreachable (local dev without the binary),
 * records are queued in localStorage under `creditax_pb_queue` and
 * flushed on the next successful call — UX never blocks on infra.
 */

const PB_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ||
  process.env.POCKETBASE_URL ||
  process.env.NEXT_PUBLIC_POCKETBASE_FALLBACK_URL ||
  'http://127.0.0.1:8090';

const QUEUE_KEY = 'creditax_pb_queue';

let client: PocketBase | null = null;

export function getPb(): PocketBase {
  if (!client) client = new PocketBase(PB_URL);
  return client;
}

export type QueueEntry =
  | { collection: 'waitlist'; email: string; source: string }
  | { collection: 'login_log'; email: string; role: string };

function readQueue(): QueueEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(QUEUE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function writeQueue(entries: QueueEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(entries));
}

async function flushQueue(pb: PocketBase): Promise<void> {
  const entries = readQueue();
  if (entries.length === 0) return;
  const remaining: QueueEntry[] = [];
  for (const entry of entries) {
    try {
      await pb.collection(entry.collection).create(entry);
    } catch {
      remaining.push(entry);
    }
  }
  writeQueue(remaining);
}

function isDuplicate(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'data' in err &&
    typeof (err as { data?: { data?: Record<string, unknown> } }).data?.data?.email !== 'undefined'
  );
}

export type CaptureResult = 'saved' | 'duplicate' | 'queued';

/** Save an email to the waitlist collection. Falls back to local queue. */
export async function captureWaitlistEmail(
  email: string,
  source: 'header' | 'newsletter' | 'footer'
): Promise<CaptureResult> {
  const pb = getPb();
  try {
    await flushQueue(pb);
    await pb.collection('waitlist').create({ email: email.toLowerCase().trim(), source });
    return 'saved';
  } catch (err) {
    if (isDuplicate(err)) return 'duplicate';
    // PB unreachable → queue locally, still succeed from the user's POV.
    const queue = readQueue();
    if (!queue.some((q) => q.collection === 'waitlist' && q.email === email.toLowerCase().trim())) {
      queue.push({ collection: 'waitlist', email: email.toLowerCase().trim(), source });
      writeQueue(queue);
    }
    return 'queued';
  }
}

/** Record a direct login (email + chosen portal) for personal reference. */
export async function recordLogin(email: string, role: string): Promise<void> {
  const pb = getPb();
  try {
    await flushQueue(pb);
    await pb.collection('login_log').create({
      email: email.toLowerCase().trim(),
      role,
    });
  } catch {
    const queue = readQueue();
    queue.push({ collection: 'login_log', email: email.toLowerCase().trim(), role });
    writeQueue(queue);
  }
}

/** Test connectivity — used by dev tooling, never blocks UI. */
export async function pingPocketBase(): Promise<boolean> {
  try {
    const res = await fetch(`${PB_URL}/api/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

export function useAsyncCapture() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setState('loading');
    try {
      await fn();
      setState('done');
      return true;
    } catch {
      setState('error');
      return false;
    }
  }, []);

  return { state, run, reset: () => setState('idle') };
}
