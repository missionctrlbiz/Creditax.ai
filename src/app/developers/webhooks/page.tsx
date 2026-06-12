'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const webhookEndpoints = [
  {
    id: '1',
    url: 'https://api.zenithfoods.ng/webhooks/creditax',
    status: 'active',
    events: ['document.processed', 'credit.score.updated', 'tax.filing.submitted'],
    lastTriggered: '14 min ago',
    successRate: '99.1%',
    avgResponse: '234ms',
  },
  {
    id: '2',
    url: 'https://hooks.ekologistics.ng/tax-events',
    status: 'failed',
    events: ['pro.application.received', 'document.processed'],
    lastTriggered: '3 hrs ago',
    successRate: '67.3%',
    avgResponse: '1.2s',
    lastError: '502 Bad Gateway',
    consecutiveFailures: 3,
  },
];

const availableEvents = [
  { id: 'document.processed', label: 'document.processed', description: 'Triggered when a document is processed' },
  { id: 'credit.score.updated', label: 'credit.score.updated', description: 'Triggered when a credit score is updated' },
  { id: 'tax.filing.submitted', label: 'tax.filing.submitted', description: 'Triggered when a tax filing is submitted' },
  { id: 'pro.application.received', label: 'pro.application.received', description: 'Triggered when a pro application is received' },
  { id: 'user.registered', label: 'user.registered', description: 'Triggered when a new user registers' },
];

const recentDeliveries = [
  { id: '1', event: 'document.processed', timestamp: '2 min ago', status: 200, responseTime: '234ms' },
  { id: '2', event: 'credit.score.updated', timestamp: '8 min ago', status: 200, responseTime: '189ms' },
  { id: '3', event: 'tax.filing.submitted', timestamp: '14 min ago', status: 200, responseTime: '312ms' },
  { id: '4', event: 'document.processed', timestamp: '22 min ago', status: 200, responseTime: '267ms' },
  { id: '5', event: 'pro.application.received', timestamp: '3 hrs ago', status: 502, responseTime: '1.2s' },
  { id: '6', event: 'document.processed', timestamp: '3 hrs ago', status: 502, responseTime: '1.1s' },
  { id: '7', event: 'document.processed', timestamp: '4 hrs ago', status: 502, responseTime: '1.3s' },
];

export default function WebhooksPage() {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['document.processed', 'credit.score.updated']);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [signingSecret, setSigningSecret] = useState('whsec_••••••••••••••••••••••••');
  const [showSecret, setShowSecret] = useState(false);

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId]
    );
  };

  const regenerateSecret = () => {
    const randomPart = Math.random().toString(36).substring(2, 30);
    setSigningSecret(`whsec_${randomPart}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Webhooks</h1>
            <p className="text-text-secondary">
              Receive real-time notifications when events occur in your account.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddPanel(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Endpoint
          </Button>
        </motion.div>

        {/* Endpoint Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {webhookEndpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card
                className={`p-5 ${
                  endpoint.status === 'active'
                    ? 'border-l-4 border-l-success'
                    : 'border-l-4 border-l-error'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      endpoint.status === 'active' ? 'bg-success' : 'bg-error'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      endpoint.status === 'active' ? 'text-success-text' : 'text-error-text'
                    }`}>
                      {endpoint.status === 'active' ? 'Active' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error-text hover:text-error-text hover:bg-error-bg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </div>

                {/* URL */}
                <code className="block text-sm font-mono text-text-primary mb-4 break-all">
                  {endpoint.url}
                </code>

                {/* Event Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {endpoint.events.map((event) => (
                    <span
                      key={event}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-brand-primary-bg text-brand-primary border border-brand-primary-border font-mono"
                    >
                      {event}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                  <span>Last triggered: {endpoint.lastTriggered}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={endpoint.successRate >= '95%' ? 'text-success-text' : 'text-error-text'}>
                    Success rate: {endpoint.successRate}
                  </span>
                  <span className="text-text-muted">Avg response: {endpoint.avgResponse}</span>
                </div>

                {/* Error Strip for Failed */}
                {endpoint.status === 'failed' && (
                  <div className="mt-4 p-3 rounded-lg bg-error-bg border border-error-border">
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-error-text flex-shrink-0 mt-0.5">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-error-text">
                          {endpoint.consecutiveFailures} consecutive failures detected
                        </p>
                        <p className="text-xs text-error-text/80 mt-1">
                          Last error: {endpoint.lastError}. Check your endpoint URL and server status.
                        </p>
                        <button className="text-xs text-error-text underline mt-2">
                          View Error Logs →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Deliveries */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Recent Deliveries</h2>
              <p className="text-sm text-text-muted">Last 24 hours</p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-inset">
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Event</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Timestamp</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Response</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted"></th>
                </tr>
              </thead>
              <tbody>
                {recentDeliveries.map((delivery, index) => (
                  <motion.tr
                    key={delivery.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-b border-border-default last:border-0 hover:bg-[var(--color-hover-overlay)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="text-sm font-mono text-brand-primary">{delivery.event}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{delivery.timestamp}</td>
                    <td className="px-4 py-3">
                      <Badge variant={delivery.status === 200 ? 'success' : 'error'}>
                        {delivery.status} {delivery.status === 200 ? 'OK' : ''}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{delivery.responseTime}</td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        View Payload
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </Card>
        </motion.section>

        {/* Add Endpoint Slide Panel */}
        <AnimatePresence>
          {showAddPanel && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddPanel(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />

              {/* Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface-raised border-l border-border-default z-50 overflow-y-auto"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary">Add Webhook Endpoint</h2>
                    <button
                      onClick={() => setShowAddPanel(false)}
                      className="p-2 hover:bg-[var(--color-hover-overlay)] rounded-lg transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    {/* Endpoint URL */}
                    <Input
                      label="Endpoint URL"
                      placeholder="https://your-server.com/webhooks"
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      hint="The URL that will receive webhook POST requests"
                    />

                    {/* Subscribe to Events */}
                    <div>
                      <label className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block mb-3">
                        Subscribe to Events
                      </label>
                      <div className="space-y-3">
                        {availableEvents.map((event) => (
                          <label
                            key={event.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-surface-inset border border-border-default cursor-pointer hover:border-border-strong transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => toggleEvent(event.id)}
                              className="mt-0.5 w-4 h-4 rounded border-border-strong bg-surface-base text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
                            />
                            <div>
                              <code className="text-sm font-mono text-brand-primary">{event.label}</code>
                              <p className="text-xs text-text-muted mt-0.5">{event.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Signing Secret */}
                    <div>
                      <label className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block mb-2">
                        Signing Secret
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 rounded-lg bg-surface-inset border border-border-default">
                          <code className="text-sm font-mono text-text-primary">
                            {showSecret ? signingSecret : 'whsec_••••••••••••••••••••••••'}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? (
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
                        <Button variant="ghost" size="sm" onClick={regenerateSecret}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path d="M23 4v6h-6M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                          </svg>
                        </Button>
                      </div>
                      <p className="text-xs text-text-muted mt-2">
                        We'll sign all payloads with this secret. Verify in your server using HMAC-SHA256.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                      <Button variant="secondary" size="lg" fullWidth>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                          <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Test Endpoint
                      </Button>
                      <Button variant="primary" size="lg" fullWidth>
                        Save Endpoint
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}