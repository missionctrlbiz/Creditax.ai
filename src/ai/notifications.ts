/**
 * P3 F-08 — notifications store (Track A).
 *
 * In-memory bell feed seeded from `seedNotifications` (demo_seed), plus
 * event ingestion so doc-processing and filing deadlines flow into the bell:
 *   - listNotifications(userId)   → seeded feed for a user
 *   - postEvent(userId, event)    → document_processed / filing_deadline / ...
 *   - filingDeadlines(asOf)       → deterministic next 21st-of-month deadlines
 *   - unreadCount(userId)
 *
 * Track A honesty: every record is demo_seed. Track B swaps the in-memory
 * store for the PocketBase `notifications` collection (pb-data getNotificationsFor).
 */

import { seedNotifications, type DemoNotification } from '@/lib/seed/demoSeed';

type NotifKind = DemoNotification['kind'];

interface NewEvent {
  userId?: string;
  kind: NotifKind;
  title: string;
  body: string;
  due?: string;
}

let counter = 0;

/** In-memory event log (demo session lifetime). */
const events: DemoNotification[] = [];

/** Per-user seeded views, initialised lazily. */
const feeds = new Map<string, DemoNotification[]>();

function feedFor(userId: string): DemoNotification[] {
  let feed = feeds.get(userId);
  if (!feed) {
    // Seed feed belongs to the consumer demo user; other roles get an
    // empty-but-live feed (their rows land in P4/P5 boards).
    feed = userId === 'u-consumer' ? [...seedNotifications] : [];
    feeds.set(userId, feed);
  }
  return feed;
}

/** All notifications for a user: seeded feed + events posted this session. */
export function listNotifications(userId = 'u-consumer'): {
  notifications: DemoNotification[];
  unread: number;
  demo_seed: true;
} {
  const posted = events.filter((e) => e.userId === userId);
  const notifications = [...feedFor(userId), ...posted];
  return { notifications, unread: notifications.filter((n) => !n.read).length, demo_seed: true };
}

/** Post an event (e.g. document_processed) into the bell. */
export function postEvent(input: NewEvent): DemoNotification {
  const n: DemoNotification = {
    id: `n-live-${++counter}`,
    userId: input.userId ?? 'u-consumer',
    kind: input.kind,
    title: input.title,
    body: input.body,
    due: input.due,
    read: false,
    demo_seed: true,
  };
  events.push(n);
  return n;
}

export function unreadCount(userId = 'u-consumer'): number {
  const { unread } = listNotifications(userId);
  return unread;
}

// ---------------------------------------------------------------------------
// Filing deadlines — deterministic, computed from the calendar (F-08)
// ---------------------------------------------------------------------------

/**
 * Next 21st of a month (today or later) — VAT + WHT remittance cadence.
 * Pure calendar math, UTC-safe. If today is past the 21st, rolls to next month.
 */
export function nextVatWhtDue(todayIso?: string): { iso: string; daysLeft: number } {
  const today = todayIso ?? new Date().toISOString().slice(0, 10);
  const [y, m, d] = today.split('-').map(Number);
  let yy = y;
  let mm = m;
  if (d > 21) {
    mm += 1;
    if (mm > 12) {
      mm = 1;
      yy += 1;
    }
  }
  const nextIso = `${yy}-${String(mm).padStart(2, '0')}-21`;
  const daysLeft = Math.round(
    (new Date(`${nextIso}T00:00:00Z`).getTime() - new Date(`${today}T00:00:00Z`).getTime()) / 86_400_000
  );
  return { iso: nextIso, daysLeft: Math.max(0, daysLeft) };
}

/** Filing-deadline alerts for the bell (Track A: deterministic demo dates). */
export function filingDeadlines(asOf?: string): Array<{
  id: string;
  label: string;
  due: string;
  daysLeft: number;
  demo_seed: true;
}> {
  const due = nextVatWhtDue(asOf);
  return [
    { id: 'dl-vat', label: 'VAT return due to FIRS', due: due.iso, daysLeft: due.daysLeft, demo_seed: true },
    { id: 'dl-wht', label: 'WHT remittance due to IRS/FIRS', due: due.iso, daysLeft: due.daysLeft, demo_seed: true },
  ];
}
