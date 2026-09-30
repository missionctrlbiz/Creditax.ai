'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { captureWaitlistEmail } from '@/lib/pocketbase';

export function NewsletterSection() {
  const t = useTranslations('sections');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || status === 'loading') return;
    setStatus('loading');
    try {
      await captureWaitlistEmail(email, 'newsletter');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="py-16 md:py-20 border-t border-border-subtle bg-surface-raised">
      <div data-cx="settle" className="max-w-[720px] mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.1em] bg-brand-action text-text-inverse mb-4">
          <Send className="w-3 h-3" />
          {t('newsEyebrow')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          {t('newsTitle')}
        </h2>
        <p className="text-text-secondary text-sm mb-7 max-w-md mx-auto leading-relaxed">
          {t('newsSub')}
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-success-border bg-success-bg px-5 py-4 max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 text-success-text shrink-0" />
            <p className="text-sm text-success-text font-medium text-left">
              {t('newsSuccess')}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsPlaceholder')}
              aria-label={t('newsPlaceholder')}
              className="h-12 flex-1 rounded-xl px-4 text-sm bg-surface-base border border-border-strong text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="h-12 px-6 rounded-xl text-sm font-semibold bg-brand-action text-text-inverse shadow-btn-action hover:brightness-105 active:brightness-95 transition-all whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                t('newsCta')
              )}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-error-text mt-3">{t('newsError')}</p>
        )}
      </div>
    </section>
  );
}
