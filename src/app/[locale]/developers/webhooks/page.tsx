'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Play,
  Plus,
  RotateCw,
  Send,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import type { WebhookEndpoint } from '@/ai/webhooks-store';

/** Display shape for a webhook endpoint card (delivery stats are demo samples). */
interface EndpointDisplay {
  id: string;
  url: string;
  status: 'active' | 'failed';
  events: string[];
  lastTriggered: string;
  successRate: number;
  avgResponse: string;
  lastError?: string;
  consecutiveFailures?: number;
  secret?: string;
}

// P11 offline fallback — the live /api/v1/webhooks store replaces this on fetch.
const FALLBACK_ENDPOINTS: EndpointDisplay[] = [
  {
    id: '1',
    url: 'https://api.zenithfoods.ng/webhooks/creditax',
    status: 'active',
    events: ['document.processed', 'credit.score.updated', 'tax.filing.submitted'],
    lastTriggered: '14 min ago',
    successRate: 99.1,
    avgResponse: '234ms',
  },
  {
    id: '2',
    url: 'https://hooks.ekologistics.ng/tax-events',
    status: 'failed',
    events: ['pro.application.received', 'document.processed'],
    lastTriggered: '3 hrs ago',
    successRate: 67.3,
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
  const [copiedSecret, setCopiedSecret] = useState(false);
  // P11 — the endpoint list hydrates from the webhooks store; the add panel
  // persists new endpoints through the create endpoint (demo_seed).
  const [endpoints, setEndpoints] = useState(FALLBACK_ENDPOINTS);
  const [live, setLive] = useState(false);
  const [savedEndpoint, setSavedEndpoint] = useState<WebhookEndpoint | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/webhooks')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { endpoints?: WebhookEndpoint[] } | null) => {
        if (!active || !d?.endpoints?.length) return;
        // Map the store records into the card shape (delivery stats stay a
        // demo sample; the registry fields are live).
        setEndpoints(
          d.endpoints.map((w) => ({
            id: w.id,
            url: w.url,
            status: w.active ? 'active' : 'failed',
            events: w.events,
            lastTriggered: 'just now',
            successRate: 99.1,
            avgResponse: '234ms',
            secret: w.secret,
          }))
        );
        setLive(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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

  const copySecret = () => {
    navigator.clipboard.writeText(signingSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  /** P11 — persist a new endpoint through the webhooks store, then show it. */
  const saveEndpoint = () => {
    if (!endpointUrl.trim()) return;
    fetch('/api/v1/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: endpointUrl.trim(), userId: 'demo', events: selectedEvents }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { endpoint?: WebhookEndpoint } | null) => {
        if (d?.endpoint) {
          setSavedEndpoint(d.endpoint);
          setEndpoints((prev) => [
            ...prev,
            {
              id: d.endpoint!.id,
              url: d.endpoint!.url,
              status: 'active',
              events: d.endpoint!.events,
              lastTriggered: 'just now',
              successRate: 100,
              avgResponse: '—',
            },
          ]);
        }
        setEndpointUrl('');
        setShowAddPanel(false);
      })
      .catch(() => {
        /* offline — the demo still closes the panel */
        setEndpointUrl('');
        setShowAddPanel(false);
      });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1>Webhooks</h1>
            {live && <Badge variant="success">live · demo_seed</Badge>}
          </div>
          <p className="mt-2 max-w-2xl text-base text-text-secondary">
            Receive real-time notifications when events occur in your account.
          </p>
          {savedEndpoint && (
            <p className="mt-1.5 text-[13px] text-success-text">
              Endpoint <span className="font-mono">{savedEndpoint.url}</span> registered — delivery
              runs on the Track B background worker.
            </p>
          )}
        </div>
        <Button variant="primary" size="md" onClick={() => setShowAddPanel(true)} className="shrink-0">
          <Plus size={16} aria-hidden />
          Add Endpoint
        </Button>
      </div>

      {/* Endpoint cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {endpoints.map((endpoint, index) => (
          <motion.div
            key={endpoint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Card
              className={`h-full p-5 ${
                endpoint.status === 'active' ? 'border-l-4 border-l-success' : 'border-l-4 border-l-error'
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      endpoint.status === 'active' ? 'bg-success' : 'bg-error'
                    }`}
                    aria-hidden
                  />
                  <span
                    className={`text-sm font-semibold ${
                      endpoint.status === 'active' ? 'text-success-text' : 'text-error-text'
                    }`}
                  >
                    {endpoint.status === 'active' ? 'Active' : 'Failed'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toast('Edit endpoint (demo)', { description: `Event subscriptions for ${endpoint.url} are managed on the Track B worker.` })}>
                    <Pencil size={14} aria-hidden />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error-text hover:bg-error-bg"
                    onClick={() => toast('Endpoint removed (demo)', { description: 'Webhook deletion lands in the Track B webhook registry.' })}
                  >
                    <Trash2 size={14} aria-hidden />
                    Delete
                  </Button>
                </div>
              </div>

              {/* URL */}
              <code className="block mb-4 break-all font-mono text-sm text-text-primary">
                {endpoint.url}
              </code>

              {/* Event pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {endpoint.events.map((event) => (
                  <span
                    key={event}
                    className="text-[11px] px-2.5 py-1 rounded-pill bg-brand-primary-bg text-brand-primary border border-brand-primary-border font-mono"
                  >
                    {event}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <div className="flex items-center gap-1.5">
                  <dt className="text-text-muted">Last triggered:</dt>
                  <dd className="text-text-secondary">{endpoint.lastTriggered}</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <dt className="text-text-muted">Success rate:</dt>
                  <dd className={endpoint.successRate >= 95 ? 'text-success-text' : 'text-error-text'}>
                    {endpoint.successRate.toFixed(1)}%
                  </dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <dt className="text-text-muted">Avg response:</dt>
                  <dd className="text-text-muted">{endpoint.avgResponse}</dd>
                </div>
              </dl>

              {/* Error strip for failed endpoints */}
              {endpoint.status === 'failed' && (
                <div className="mt-4 p-3 rounded-lg bg-error-bg border border-error-border">
                  <div className="flex items-start gap-2">
                    <TriangleAlert size={16} className="text-error-text shrink-0 mt-0.5" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-error-text">
                        {endpoint.consecutiveFailures ? `${endpoint.consecutiveFailures} consecutive failures detected` : 'Delivery failing — endpoint not responding'}
                      </p>
                      <p className="text-xs text-error-text/80 mt-1">
                        {endpoint.lastError
                          ? `Last error: ${endpoint.lastError}. Check your endpoint URL and server status.`
                          : 'Check your endpoint URL and server status.'}
                      </p>
                      <button
                        type="button"
                        className="mt-2 flex items-center gap-1 text-xs font-semibold text-error-text underline cursor-pointer"
                        onClick={() => toast('Error logs (demo)', { description: 'Full delivery logs stream in on the Track B worker.' })}
                      >
                        View Error Logs
                        <ArrowRight size={12} aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent deliveries */}
      <section>
        <div className="mb-4">
          <h2>Recent Deliveries</h2>
          <p className="text-sm text-text-muted">Last 24 hours</p>
        </div>

        <Card className="max-w-full overflow-hidden">
          <div className="overflow-x-auto overscroll-contain">
            <table className="min-w-[44rem]">
              <thead>
                <tr className="border-b border-border-default bg-surface-inset">
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Event</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Timestamp</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Response</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <span className="sr-only">Actions</span>
                  </th>
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
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-brand-primary hover:underline cursor-pointer"
                        onClick={() => toast('Payload inspector (demo)', { description: 'Signed payloads and delivery traces appear with the Track B worker.' })}
                      >
                        <Play size={14} aria-hidden />
                        View Payload
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Add endpoint slide panel */}
      <AnimatePresence>
        {showAddPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddPanel(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-endpoint-title"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface-raised border-l border-border-default z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <h2 id="add-endpoint-title">Add Webhook Endpoint</h2>
                  <button
                    type="button"
                    aria-label="Close panel"
                    onClick={() => setShowAddPanel(false)}
                    className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-colors cursor-pointer"
                  >
                    <X size={18} aria-hidden />
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

                  {/* Subscribe to events */}
                  <div>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block mb-3">
                      Subscribe to Events
                    </span>
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
                            className="mt-0.5 w-4 h-4 rounded border-border-strong bg-surface-base text-brand-primary focus:ring-[var(--color-focus-ring)] focus:ring-offset-0"
                          />
                          <div className="min-w-0">
                            <code className="block text-sm font-mono text-brand-primary">{event.label}</code>
                            <p className="text-xs text-text-muted mt-0.5">{event.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Signing secret */}
                  <div>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block mb-2">
                      Signing Secret
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 p-3 rounded-lg bg-surface-inset border border-border-default">
                        <code className="block text-sm font-mono text-text-primary truncate">
                          {showSecret ? signingSecret : 'whsec_••••••••••••••••••••••••'}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Copy signing secret"
                        onClick={copySecret}
                      >
                        {copiedSecret ? (
                          <Check size={16} className="text-success-text" aria-hidden />
                        ) : (
                          <Copy size={16} aria-hidden />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={showSecret ? 'Hide signing secret' : 'Show signing secret'}
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Regenerate signing secret" onClick={regenerateSecret}>
                        <RotateCw size={16} aria-hidden />
                      </Button>
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      We&apos;ll sign all payloads with this secret. Verify in your server using HMAC-SHA256.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4">
                    <Button variant="secondary" size="lg" fullWidth onClick={() => toast('Test delivery sent (demo)', { description: 'A sample payload is dispatched to the endpoint on the Track B worker.' })}>
                      <Play size={18} aria-hidden />
                      Test Endpoint
                    </Button>
                    <Button variant="primary" size="lg" fullWidth disabled={!endpointUrl.trim()} onClick={saveEndpoint}>
                      Save Endpoint
                      <Send size={18} aria-hidden />
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
