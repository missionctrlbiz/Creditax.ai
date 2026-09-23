import { NextResponse, type NextRequest } from 'next/server';
import { listNotifications, filingDeadlines, postEvent, unreadCount } from '@/ai/notifications';
import type { DemoNotification } from '@/lib/seed/demoSeed';

type NotifKind = DemoNotification['kind'];
const VALID_KINDS: NotifKind[] = ['filing_deadline', 'document_processed', 'score_change', 'pro_referral'];

/**
 * P3 F-08 — notifications + filing-deadline alerts.
 *
 *   GET  /api/v1/notifications             bell feed for a user + unread count
 *   GET  /api/v1/notifications/deadlines   deterministic next 21st-of-month
 *   POST /api/v1/notifications             post an event (e.g. document_processed)
 *
 * Track A: in-memory + seeded, demo_seed: true. Track B = PocketBase
 * `notifications` collection (pb-data getNotificationsFor).
 */

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') ?? 'u-consumer';
  const feed = listNotifications(userId);
  return NextResponse.json({
    notifications: feed.notifications,
    unread: feed.unread,
    deadlines: filingDeadlines(),
    demo_seed: true,
  });
}

export async function POST(req: NextRequest) {
  let body: { userId?: string; event?: { kind?: string; title?: string; body?: string; due?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const e = body.event ?? {};
  if (!e.kind || !VALID_KINDS.includes(e.kind as NotifKind)) {
    return NextResponse.json(
      { error: '`event.kind` must be one of: ' + VALID_KINDS.join(', ') },
      { status: 400 }
    );
  }
  if (!e.title || !e.body) {
    return NextResponse.json({ error: '`event.title` and `event.body` are required' }, { status: 400 });
  }
  const n = postEvent({ userId: body.userId, kind: e.kind as NotifKind, title: e.title, body: e.body, due: e.due });
  return NextResponse.json({ notification: n, unread: unreadCount(n.userId), demo_seed: true });
}
