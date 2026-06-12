'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

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
  const [apiKey, setApiKey] = useState('sk_sandbox_****************************2b91');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rotateKey = () => {
    const randomPart = Math.random().toString(36).substring(2, 10);
    setApiKey(`sk_sandbox_****************************${randomPart.slice(-4)}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Sandbox Environment</h1>
          <p className="text-text-secondary text-lg">
            Test the Creditax.ai API without affecting real data or incurring costs.
          </p>
        </motion.div>

        {/* Environment Toggle Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-action animate-pulse" />
                  <span className="text-xl font-bold text-text-primary">SANDBOX</span>
                </div>
                <span className="text-text-muted">ENVIRONMENT</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEnvMode('sandbox')}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    envMode === 'sandbox'
                      ? 'bg-success-bg text-success-text border border-success-border'
                      : 'bg-surface-inset text-text-muted border border-border-default hover:border-border-strong'
                  }`}
                >
                  Sandbox
                </button>
                <button
                  onClick={() => setEnvMode('production')}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    envMode === 'production'
                      ? 'bg-brand-action-bg text-brand-action border border-border-action'
                      : 'bg-surface-inset text-text-muted border border-border-default hover:border-border-strong'
                  }`}
                >
                  Production
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-warning-bg border border-warning-border flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-warning-text flex-shrink-0 mt-0.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm text-warning-text">
                Switching to Production uses real data and real API credits.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Sandbox API Key */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">Your Sandbox API Key</h2>
          <Card className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <code className="text-lg font-mono text-text-primary break-all">
                  {showKey ? apiKey : 'sk_sandbox_****************************••••'}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(apiKey)}
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-success-text">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={rotateKey}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                  Rotate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-sm text-text-muted mt-3">
              This key is for testing only. It never charges real money or affects real data.
            </p>
          </Card>
        </motion.section>

        {/* Capabilities Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">Sandbox Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-5 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-text-primary">{cap.title}</h3>
                    <Badge variant="success">SANDBOX</Badge>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {cap.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-2 text-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-success-text">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
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
        </motion.section>

        {/* Sample Test Data */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">Sample Test Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test TINs */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Test TINs</h3>
              <div className="space-y-3">
                {testTINs.map((item, index) => (
                  <motion.div
                    key={item.tin}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-inset"
                  >
                    <code className="text-sm font-mono text-brand-primary">{item.tin}</code>
                    <span className="text-xs text-text-muted text-right">{item.description}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Test Incomes */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Test Incomes</h3>
              <div className="space-y-3">
                {testIncomes.map((item, index) => (
                  <motion.div
                    key={item.amount}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-inset"
                  >
                    <code className="text-sm font-mono text-brand-action">{item.amount}</code>
                    <span className="text-xs text-text-muted text-right">{item.description}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card className="p-5 border-[var(--color-error-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-error-text">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Reset Sandbox Data</h3>
                  <p className="text-xs text-text-muted">Delete all sandbox test records and start fresh.</p>
                </div>
              </div>
              <Button variant="danger" size="md">
                Reset Sandbox
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </Card>
        </motion.section>

        {/* Upgrade CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-gradient-to-r from-brand-primary-bg to-brand-action-bg border-brand-primary-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-brand-action">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Ready for Production?</h3>
                  <p className="text-sm text-text-secondary">
                    Switch to a live API key to go live. Pro plan includes 100,000 calls/month.
                  </p>
                </div>
              </div>
              <Button variant="primary" size="xl">
                Upgrade to Pro
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}