'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles, Lock, MessageCircle, ArrowRight, ShieldCheck, Bot, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { resolveSharedLink } from '@/ai/collaboration';

/**
 * P6 F-18 — public read-only shared-canvas preview (`/en/share/<slug>`).
 *
 * The "Collaboration preview" demo beat (mvp-demo-plan §3.11, scope 11): a paid
 * workspace shares a canvas via link; a non-user opens it read-only and sees a
 * signup CTA. The canvas content is the seeded conversation (demo_seed). Track B
 * = per-link access enforcement + real workspace membership.
 */
export default function SharedCanvasPage() {
  const t = useTranslations('share');
  const params = useParams();
  const rawSlug = (params?.slug as string | undefined) ?? '';
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  // resolveSharedLink is pure/synchronous — derive the whole view with useMemo.
  const shared = useMemo(() => resolveSharedLink(slug), [slug]);
  const messages = shared.conversation;
  const access = shared.access;
  const owner = 'Ayo Ogundimu';

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1 max-w-[900px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb + read-only notice */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
            {t('backHome')}
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-[13px] font-mono text-text-muted">{slug || 'share_7f3a9c'}</span>
        </div>

        <Card className="p-5 sm:p-6 mb-6 border-brand-action-bg/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="w-10 h-10 rounded-full bg-brand-primary text-text-inverse grid place-items-center shrink-0">
                <ShieldCheck size={18} />
              </span>
              <div className="min-w-0">
                <h1 className="text-text-primary font-semibold truncate">{t('sharedCanvas')}</h1>
                <p className="text-text-muted text-[13px]">
                  {t('sharedBy')} {owner} · {t('readOnly')} ({access})
                </p>
              </div>
              <Badge variant="info" className="ml-auto shrink-0">demo_seed</Badge>
            </div>
          </div>
        </Card>

        {/* Read-only canvas (the shared conversation, seeded) */}
        <Card className="p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={14} className="text-text-muted" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{t('previewCanvas')}</span>
          </div>
          <div className="space-y-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[80%] rounded-2xl rounded-br-md bg-brand-primary text-text-inverse px-4 py-3 text-sm'
                      : 'max-w-[80%] rounded-2xl rounded-bl-md bg-surface-overlay border border-border-default px-4 py-3 text-sm'
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    <span className="text-[11px] opacity-70">{m.role}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.sources.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-badge bg-brand-primary-bg text-brand-primary text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Signup CTA — the collaboration-preview proof (scope 11) */}
        <Card className="p-6 border-brand-primary-border">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="w-9 h-9 rounded-lg bg-brand-action-bg text-brand-action grid place-items-center shrink-0">
                <Sparkles size={17} />
              </span>
              <div className="min-w-0">
                <p className="text-text-primary font-semibold">{t('ctaTitle')}</p>
                <p className="text-text-muted text-[13px]">{t('ctaBody')}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <Link href="/signup">
                <Button variant="primary">
                  {t('ctaSignin')} <ArrowRight size={14} />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary">
                  <MessageCircle size={14} /> {t('ctaFindPro')}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
