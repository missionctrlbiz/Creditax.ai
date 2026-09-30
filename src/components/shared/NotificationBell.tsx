'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CalendarClock, Check, Inbox, TrendingUp, FileCheck2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotifKind = 'filing_deadline' | 'document_processed' | 'score_change' | 'pro_referral';

interface Notif {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  due?: string;
  read: boolean;
  demo_seed?: boolean;
}

interface Deadline {
  id: string;
  label: string;
  due: string;
  daysLeft: number;
}

/**
 * P3 F-08 — notification bell.
 *
 * Fetches `GET /api/v1/notifications` (live: seeded feed + posted events +
 * deterministic filing deadlines). Falls back to a static "no notifications"
 * state when the API is unreachable so the demo never dead-ends. Filing
 * deadlines render as countdowns (next 21st-of-month, VAT + WHT cadence).
 */
const KIND_ICON: Record<NotifKind, typeof Bell> = {
  filing_deadline: CalendarClock,
  document_processed: FileCheck2,
  score_change: TrendingUp,
  pro_referral: Check,
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [unread, setUnread] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/v1/notifications?userId=u-consumer')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        setNotifs(data.notifications ?? []);
        setDeadlines(data.deadlines ?? []);
        setUnread(data.unread ?? 0);
        setLoaded(true);
      })
      .catch(() => {
        // Offline — keep the shell stable; no live feed.
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const items = [...deadlines.map((d) => ({ id: `dl-${d.id}`, kind: 'filing_deadline' as NotifKind, title: d.label, body: `Due ${d.due} · ${d.daysLeft}d left`, read: false, deadline: true })), ...notifs];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-btn text-text-secondary hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-3.5 h-3.5 px-1 rounded-full bg-brand-action text-text-inverse text-[9px] font-bold grid place-items-center border border-surface-raised">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-72 max-w-[calc(100vw-2rem)] rounded-card border border-border-default bg-surface-raised shadow-lg overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Notifications
              </p>
              {loaded && unread > 0 && (
                <span className="text-[10px] text-text-muted">{unread} new</span>
              )}
            </div>

            <ul className="max-h-72 overflow-y-auto">
              {items.length === 0 && (
                <li className="px-3 py-6 text-center">
                  <Inbox size={20} className="mx-auto text-text-muted mb-2" />
                  <p className="text-[12px] text-text-secondary">No notifications</p>
                </li>
              )}
              {items.map((n) => {
                const Icon = KIND_ICON[n.kind] ?? Bell;
                return (
                  <li
                    key={n.id}
                    className={cn(
                      'flex items-start gap-2.5 px-3 py-2.5 border-b border-border-subtle last:border-0',
                      !n.read && 'bg-brand-primary-bg/20'
                    )}
                  >
                    <span className="w-7 h-7 rounded-lg bg-surface-inset grid place-items-center shrink-0 text-brand-primary">
                      <Icon size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-text-primary leading-tight">{n.title}</p>
                      <p className="text-[11px] text-text-muted leading-tight mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {loaded && (
              <p className="px-3 py-1.5 text-[10px] text-text-muted border-t border-border-subtle">
                demo_seed · filing deadlines are computed, not live
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
