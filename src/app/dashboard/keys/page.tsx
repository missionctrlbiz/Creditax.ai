'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: 'live' | 'test';
  scopes: string[];
  createdAt: string;
  lastUsed: string;
  usage: number;
  limit: number;
  createdBy: string;
}

export default function ApiKeysPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [newKey, setNewKey] = useState({
    name: '',
    environment: 'live' as 'live' | 'test',
    scopes: ['Read', 'Write'],
  });

  const apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production Key',
      key: 'sk_live_****************************8f3a',
      environment: 'live',
      scopes: ['Read', 'Write'],
      createdAt: 'Mar 15, 2025',
      lastUsed: '2 hours ago',
      usage: 8431,
      limit: 10000,
      createdBy: 'Emeka Obi',
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'sk_test_****************************2b91',
      environment: 'test',
      scopes: ['Read'],
      createdAt: 'Jan 10, 2025',
      lastUsed: '1 day ago',
      usage: 234,
      limit: Infinity,
      createdBy: 'Emeka Obi',
    },
  ];

  const toggleReveal = (keyId: string) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(keyId)) {
      newRevealed.delete(keyId);
    } else {
      newRevealed.add(keyId);
    }
    setRevealedKeys(newRevealed);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const usagePercent = (usage: number, limit: number) => {
    if (limit === Infinity) return 0;
    return (usage / limit) * 100;
  };

  return (
    <div className="p-8 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-text-primary mb-1">
            API Keys
          </h1>
          <p className="text-text-secondary text-sm">
            Manage your API keys for accessing Creditax.ai services
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + Create New Key
        </Button>
      </div>

      {/* Security Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 rounded-card border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]"
      >
        <p className="text-text-primary text-sm flex items-start gap-2">
          <span className="text-[var(--color-warning)]">⚠</span>
          <span>
            Keep your API keys secure. Never share them in public repositories or client-side code.
            Rotate keys immediately if compromised.{' '}
            <a href="#" className="text-brand-primary hover:underline">
              Learn about API security →
            </a>
          </span>
        </p>
      </motion.div>

      {/* API Keys List */}
      <div className="space-y-6">
        {apiKeys.map((apiKey, index) => (
          <motion.div
            key={apiKey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              accent={apiKey.environment === 'live' ? 'green' : 'teal'}
              className="p-6 hover:border-[var(--color-border-strong)] transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-text-primary font-semibold">{apiKey.name}</h3>
                  <Badge variant={apiKey.environment === 'live' ? 'success' : 'brand'}>
                    {apiKey.environment === 'live' ? 'Live' : 'Test'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReveal(apiKey.id)}
                    className="text-brand-primary"
                  >
                    👁 Reveal
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyKey(apiKey.key)}
                    className="text-text-muted"
                  >
                    {copiedKey === apiKey.key ? '✓ Copied' : '📋 Copy'}
                  </Button>
                </div>
              </div>

              {/* Key */}
              <div className="mb-4">
                <p className="text-text-muted text-xs mb-1">Key</p>
                <p className="text-text-primary font-mono text-sm">
                  {revealedKeys.has(apiKey.id) ? apiKey.key.replace(/[*]/g, 'X') : apiKey.key}
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-text-muted text-xs mb-4">
                <span>Last used: {apiKey.lastUsed}</span>
                <span>·</span>
                <span>Created by: {apiKey.createdBy}</span>
                <span>·</span>
                <span>Scopes: {apiKey.scopes.join(', ')}</span>
              </div>

              {/* Usage */}
              {apiKey.limit !== Infinity ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-text-muted">
                      Usage: {apiKey.usage.toLocaleString()} / {apiKey.limit.toLocaleString()} calls
                    </span>
                    <span className="text-text-secondary">{usagePercent(apiKey.usage, apiKey.limit)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-inset overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercent(apiKey.usage, apiKey.limit)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-action"
                    />
                  </div>
                  <p className="text-text-muted text-xs mt-2">
                    {usagePercent(apiKey.usage, apiKey.limit)}% of monthly limit · Resets July 1 ·{' '}
                    <a href="/pricing" className="text-brand-primary hover:underline">
                      Upgrade for unlimited →
                    </a>
                  </p>
                </div>
              ) : (
                <p className="text-text-muted text-xs mb-4">
                  Usage: {apiKey.usage.toLocaleString()} / unlimited (test key)
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border-default">
                <Button variant="danger" size="sm">Revoke Key</Button>
                <Button variant="ghost" size="sm">Edit Name</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface-raised border-l border-border-default z-50 overflow-y-auto"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-text-primary">Create New API Key</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <Input
                    label="Key Name *"
                    placeholder="My Production App"
                    value={newKey.name}
                    onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  />

                  {/* Environment Toggle */}
                  <div>
                    <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-3">
                      Environment
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewKey({ ...newKey, environment: 'live' })}
                        className={`
                          flex-1 py-2.5 px-4 rounded-[10px] text-sm font-medium transition-all cursor-pointer
                          ${
                            newKey.environment === 'live'
                              ? 'bg-brand-action text-text-inverse'
                              : 'bg-surface-inset text-text-secondary hover:text-text-primary'
                          }
                        `}
                      >
                        Live
                      </button>
                      <button
                        onClick={() => setNewKey({ ...newKey, environment: 'test' })}
                        className={`
                          flex-1 py-2.5 px-4 rounded-[10px] text-sm font-medium transition-all cursor-pointer
                          ${
                            newKey.environment === 'test'
                              ? 'bg-brand-primary text-text-inverse'
                              : 'bg-surface-inset text-text-secondary hover:text-text-primary'
                          }
                        `}
                      >
                        Test
                      </button>
                    </div>
                  </div>

                  {/* Scopes */}
                  <div>
                    <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-3">
                      Scopes
                    </label>
                    <div className="space-y-3">
                      {[
                        { id: 'Read', label: 'Read', desc: 'Access tax calculations and credit data' },
                        { id: 'Write', label: 'Write', desc: 'Upload documents and submit filings' },
                        { id: 'Admin', label: 'Admin', desc: 'Manage keys and account settings' },
                      ].map((scope) => (
                        <label
                          key={scope.id}
                          className="flex items-start gap-3 p-4 rounded-card border border-border-default cursor-pointer hover:border-[var(--color-border-strong)] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={newKey.scopes.includes(scope.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewKey({ ...newKey, scopes: [...newKey.scopes, scope.id] });
                              } else {
                                setNewKey({ ...newKey, scopes: newKey.scopes.filter((s) => s !== scope.id) });
                              }
                            }}
                            className="mt-1 w-4 h-4 rounded accent-brand-primary cursor-pointer"
                          />
                          <div>
                            <p className="text-text-primary text-sm font-medium">{scope.label}</p>
                            <p className="text-text-muted text-xs">{scope.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="p-4 rounded-card border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]">
                    <p className="text-[var(--color-warning-text)] text-sm">
                      ⚠ The key will be shown once. Copy it immediately after creation.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4">
                    <Button variant="primary" fullWidth>
                      Create Key →
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}