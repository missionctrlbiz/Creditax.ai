'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  RotateCw,
  Trash2,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { ApiKeyRecord } from '@/ai/api-keys';

const capabilities = [
  {
    title: 'Tax Calculations',
    features: [
      { name: 'Income Tax', status: 'simulated', available: true },
      { name: 'VAT Calculator', status: 'simulated', available: true },
      { name: 'WHT Tables', status: 'real', available: true },
    ],
    description: 'All tax calculation endpoints use simulated data in sandbox mode.',
  },
  {
    title: 'AI Tax Assistant',
    features: [
      { name: 'Full RAG responses', status: 'active', available: true },
      { name: 'All FIRS documents available', status: 'active', available: true },
    ],
    description: 'The AI assistant uses real FIRS document knowledge base.',
  },
  {
    title: 'Document OCR',
    features: [
      { name: 'OCR extraction', status: 'simulated', available: true },
      { name: 'Sample documents provided', status: 'active', available: true },
      { name: 'Amount extraction works', status: 'active', available: true },
    ],
    description: 'Document processing uses sample data for testing.',
  },
];

const testTINs = [
  { tin: '123456789012', description: 'Individual with standard income' },
  { tin: '987654321098', description: 'Corporate entity, high income' },
  { tin: '456789012345', description: 'Individual with multiple income streams' },
];

const testIncomes = [
  { amount: '₦2,400,000', description: 'Entry-level salary (Lagos)' },
  { amount: '₦12,000,000', description: 'Mid-level salary (Lagos)' },
  { amount: '₦50,000,000', description: 'Senior executive (Abuja)' },
];

export default function SandboxPage() {
  const [envMode, setEnvMode] = useState<'sandbox' | 'production'>('sandbox');
  // P11 — the sandbox key hydrates from the api-keys store (the test-environment
  // key), not a hardcoded literal; rotate calls the real rotate endpoint.
  const [testKey, setTestKey] = useState<ApiKeyRecord | null>(null);
  const [live, setLive] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/api-keys')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { keys?: ApiKeyRecord[] } | null) => {
        if (!active || !d?.keys) return;
        const test = d.keys.find((k) => k.environment === 'test') ?? d.keys[0];
        if (test) {
          setTestKey({ ...test, limit: Number(test.limit ?? Infinity) });
          setLive(true);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const apiKey = testKey?.key ?? 'sk_test_****************************2b91';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /** P11 — rotate the sandbox key through the real api-keys rotate endpoint. */
  const rotateKey = () => {
    if (!testKey) return;
    fetch(`/api/v1/api-keys/${testKey.id}/rotate`, { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { key?: ApiKeyRecord } | null) => {
        if (d?.key) setTestKey({ ...d.key, limit: Number(d.key.limit ?? Infinity) });
      })
      .catch(() => {});
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div>
        <h1>Sandbox</h1>
        <p className="mt-2 max-w-2xl text-lg text-text-secondary">
          Test the Creditax.ai API without affecting real data or incurring costs.
        </p>
      </div>

      {/* Environment banner */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-action animate-pulse" />
              <span className="text-xl font-bold text-text-primary">SANDBOX</span>
            </div>
            <span className="text-text-muted">ENVIRONMENT</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-pressed={envMode === 'sandbox'}
              onClick={() => setEnvMode('sandbox')}
              className={`h-10 px-5 rounded-pill text-sm font-semibold transition-colors ${
                envMode === 'sandbox'
                  ? 'bg-success-bg text-success-text border border-success-border'
                  : 'bg-surface-inset text-text-muted border border-border-default hover:border-border-strong'
              }`}
            >
              Sandbox
            </button>
            <button
              type="button"
              aria-pressed={envMode === 'production'}
              onClick={() => setEnvMode('production')}
              className={`h-10 px-5 rounded-pill text-sm font-semibold transition-colors ${
                envMode === 'production'
                  ? 'bg-brand-action-bg text-brand-action border border-border-action'
                  : 'bg-surface-inset text-text-muted border border-border-default hover:border-border-strong'
              }`}
            >
              Production
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-warning-bg border border-warning-border">
          <Zap size={20} className="text-warning-text shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-warning-text">
            Switching to Production uses real data and real API credits.
          </p>
        </div>
      </Card>

      {/* API key — P11: hydrated from the api-keys store (test-env key) */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2>Your Sandbox API Key</h2>
          {live && <Badge variant="success">live · demo_seed</Badge>}
        </div>
        <Card className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <code className="block break-all font-mono text-lg text-text-primary">
                {showKey ? apiKey : testKey?.key ?? 'sk_test_****************************••••'}
              </code>
              {testKey && (
                <p className="mt-1 text-[12px] text-text-muted">
                  {testKey.name} · {testKey.environment} ·{' '}
                  {testKey.usage.toLocaleString('en-NG')} / {testKey.limit === Infinity ? 'unlimited' : testKey.limit.toLocaleString('en-NG')} requests
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey)}>
                {copied ? (
                  <>
                    <Check size={16} className="text-success-text" aria-hidden />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} aria-hidden />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={rotateKey} disabled={!testKey}>
                <RotateCw size={16} aria-hidden />
                Rotate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
              </Button>
            </div>
          </div>
          <p className="mt-3 text-sm text-text-muted">
            This key is for testing only. It never charges real money or affects real data.
          </p>
        </Card>
      </section>

      {/* Capabilities */}
      <section>
        <h2 className="mb-4">Sandbox Capabilities</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3>{cap.title}</h3>
                  <Badge variant="success">SANDBOX</Badge>
                </div>
                <ul className="space-y-2 mb-4">
                  {cap.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-success-text shrink-0" aria-hidden />
                      <span className="text-text-secondary">{feature.name}</span>
                      <span className="text-xs text-text-muted">— {feature.status}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-text-muted">{cap.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sample test data */}
      <section>
        <h2 className="mb-4">Sample Test Data</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-5">
            <p className="text-sm font-semibold text-text-primary mb-4">Test TINs</p>
            <div className="space-y-3">
              {testTINs.map((item, index) => (
                <motion.div
                  key={item.tin}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-1 p-3 rounded-lg bg-surface-inset sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <code className="text-sm font-mono text-brand-primary">{item.tin}</code>
                  <span className="text-xs text-text-muted sm:text-right">{item.description}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-text-primary mb-4">Test Incomes</p>
            <div className="space-y-3">
              {testIncomes.map((item, index) => (
                <motion.div
                  key={item.amount}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-1 p-3 rounded-lg bg-surface-inset sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <code className="text-sm font-mono text-brand-action">{item.amount}</code>
                  <span className="text-xs text-text-muted sm:text-right">{item.description}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <Card accent="red" className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-error-text shrink-0" aria-hidden />
              <div>
                <h3>Reset Sandbox Data</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Delete all sandbox test records and start fresh.
                </p>
              </div>
            </div>
            <Button variant="danger" size="md" className="shrink-0" onClick={() => toast('Sandbox reset (demo)', { description: 'Test records clear on the Track B worker; this is a demo build.' })}>
              Reset Sandbox
              <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </Card>
      </section>

      {/* Upgrade CTA */}
      <section>
        <Card className="bg-gradient-to-r from-brand-primary-bg to-brand-action-bg border-brand-primary-border p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Zap size={24} className="text-brand-action shrink-0" aria-hidden />
              <div>
                <h3>Ready for Production?</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Switch to a live API key to go live. Pro plan includes 100,000 calls/month.
                </p>
              </div>
            </div>
            <Button variant="primary" size="lg" className="shrink-0" onClick={() => { window.location.href = '/pricing'; }}>
              Upgrade to Pro
              <ArrowRight size={18} aria-hidden />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
