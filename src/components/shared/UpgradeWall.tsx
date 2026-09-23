'use client';

import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Tier } from '@/ai/quota';

export interface UpgradeHint {
  to: Tier;
  message: string;
}

/**
 * P4 F-12 — named-limit upgrade wall.
 *
 * Shown when the quota engine blocks an action (403 from /api/v1/quota/meter or
 * the chat route). Names the exact limit hit + the named-plan price (₦, per
 * pricing-and-access §5 "You've used today's 5 free chats — Plus gives you
 * 100/day for ₦5,000/mo"). "Upgrade" POSTs to /api/v1/quota/tier (mock flip +
 * toast; real PSP is Track B).
 */
export function UpgradeWall({
  hint,
  onUpgrade,
  onDismiss,
}: {
  hint: UpgradeHint;
  onUpgrade?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="self-start w-full max-w-[460px] rounded-card border border-brand-primary-border bg-brand-primary-bg/40 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 rounded-lg bg-brand-primary text-text-inverse grid place-items-center">
          <Lock size={14} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
          Upgrade to continue
        </p>
      </div>
      <p className="text-sm text-text-primary leading-relaxed mb-1">{hint.message}</p>
      <p className="text-[11px] text-text-muted mb-3">demo_seed · upgrade is a mock tier flip (Paystack/Flutterwave is Track B)</p>
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={onUpgrade}>
          <Sparkles size={13} /> Upgrade to {hint.to}
        </Button>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Maybe later
          </Button>
        )}
      </div>
    </motion.div>
  );
}
