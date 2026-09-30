'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { captureWaitlistEmail, type CaptureResult } from '@/lib/pocketbase';

export function JoinListModal({ trigger, onClose }: { trigger: React.ReactNode; onClose?: () => void }) {
  const t = useTranslations('waitlist');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<CaptureResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await captureWaitlistEmail(email, 'header');
      setResult(res);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Optional parent hook (e.g. close the mobile menu that holds this trigger).
      onClose?.();
      // Reset shortly after close so the exit animation isn't jarring
      setTimeout(() => {
        setStatus('idle');
        setResult(null);
        setEmail('');
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[400px]">
        {status === 'success' ? (
          <div className="py-3 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-brand-action-bg border border-brand-action-border grid place-items-center">
              <Check size={22} className="text-brand-action" />
            </div>
            <DialogTitle className="text-lg mb-2">
              {result === 'duplicate' ? t('successDuplicate') : t('success')}
            </DialogTitle>
            <DialogDescription>
              {result === 'duplicate' ? t('note') : t('successDesc')}
            </DialogDescription>
            <Button
              variant="secondary"
              size="md"
              className="mt-5"
              onClick={() => handleOpenChange(false)}
            >
              {t('done')}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail size={18} className="text-brand-primary" />
                {t('title')}
              </DialogTitle>
              <DialogDescription>{t('desc')}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                required
                autoFocus
                placeholder={t('placeholder')}
                aria-label={t('placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" fullWidth size="lg" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Joining…
                  </>
                ) : (
                  'Notify me at launch →'
                )}
              </Button>
              {status === 'error' && (
                <p className="text-xs text-error-text text-center">{t('error')}</p>
              )}
            </form>

            <p className="text-[11px] text-text-muted text-center mt-3">{t('note')}</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
