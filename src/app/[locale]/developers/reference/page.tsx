'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  Braces,
  Check,
  Circle,
  CircleAlert,
  CircleCheck,
  Copy,
  Lock,
  List,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const endpointCategories = [
  {
    category: 'TAX',
    expanded: true,
    endpoints: [
      { method: 'POST', path: '/v2/tax/calculate', name: 'Calculate Tax', auth: true },
      { method: 'GET', path: '/v2/tax/brackets', name: 'Get Tax Brackets', auth: true },
      { method: 'POST', path: '/v2/tax/vat', name: 'Calculate VAT', auth: true },
      { method: 'GET', path: '/v2/tax/wht', name: 'Get WHT Tables', auth: true },
    ],
  },
  {
    category: 'CREDIT',
    expanded: false,
    endpoints: [
      { method: 'GET', path: '/v2/credit/score', name: 'Get Credit Score', auth: true },
      { method: 'POST', path: '/v2/credit/report', name: 'Generate Report', auth: true },
      { method: 'GET', path: '/v2/credit/history', name: 'Get Credit History', auth: true },
    ],
  },
  {
    category: 'DOCUMENTS',
    expanded: false,
    endpoints: [
      { method: 'POST', path: '/v2/documents/upload', name: 'Upload Document', auth: true },
      { method: 'GET', path: '/v2/documents/:id', name: 'Get Document', auth: true },
      { method: 'DELETE', path: '/v2/documents/:id', name: 'Delete Document', auth: true },
    ],
  },
  {
    category: 'AUTH',
    expanded: false,
    endpoints: [
      { method: 'POST', path: '/v2/auth/token', name: 'Get Token', auth: false },
      { method: 'POST', path: '/v2/auth/refresh', name: 'Refresh Token', auth: false },
    ],
  },
  {
    category: 'MARKETPLACE',
    expanded: false,
    endpoints: [
      { method: 'GET', path: '/v2/marketplace/pros', name: 'List Tax Pros', auth: true },
      { method: 'GET', path: '/v2/marketplace/pros/:id', name: 'Get Tax Pro', auth: true },
    ],
  },
];

const allEndpoints = endpointCategories.flatMap((category) => category.endpoints);

/** GET and DELETE share `/v2/documents/:id` — method+path keeps React keys unique. */
const endpointId = (endpoint: { method: string; path: string }) =>
  `${endpoint.method} ${endpoint.path}`;

const parameters = [
  { name: 'income', type: 'number', required: true, description: 'Annual gross income in Naira' },
  { name: 'tax_year', type: 'integer', required: true, description: 'Year for tax calculation (e.g., 2024)' },
  { name: 'state', type: 'string', required: false, description: 'State code (e.g., Lagos, Abuja). Defaults to federal rates.' },
  { name: 'include_reliefs', type: 'boolean', required: false, description: 'Whether to apply tax reliefs and exemptions. Default: true' },
  { name: 'entity_type', type: 'enum', required: false, description: 'Entity type: individual or corporate' },
];

const errorCodes = [
  { code: 400, status: 'Bad Request', message: 'income is required', description: 'Missing required parameter in request body' },
  { code: 401, status: 'Unauthorized', message: 'Invalid API key', description: 'API key is missing, expired, or invalid' },
  { code: 422, status: 'Unprocessable Entity', message: 'Invalid state value', description: 'State parameter must be a valid Nigerian state code' },
  { code: 429, status: 'Too Many Requests', message: 'Rate limit exceeded', description: 'API rate limit reached. Upgrade plan for higher limits.' },
  { code: 500, status: 'Internal Server Error', message: 'Calculation failed', description: 'Unexpected server error. Contact support if persists.' },
];

const requestBodyExample = `{
  "income": 12000000,
  "tax_year": 2024,
  "state": "Lagos",
  "include_reliefs": true,
  "entity_type": "individual"
}`;

const responseSchema = `{
  "success": true,
  "data": {
    "tax_year": 2024,
    "gross_income": 12000000,
    "total_reliefs": 300000,
    "taxable_income": 11700000,
    "tax_brackets": [
      { "bracket": "0 - 300,000", "rate": "0%", "tax": 0 },
      { "bracket": "300,001 - 600,000", "rate": "7%", "tax": 21000 }
    ],
    "total_tax": 2349000,
    "effective_rate": "19.58%",
    "take_home": 9651000
  },
  "request_id": "req_7x9k2m4n6p8",
  "processing_time_ms": 142
}`;

const tocLinks = [
  { id: 'authentication', label: 'Authentication' },
  { id: 'parameters', label: 'Parameters' },
  { id: 'request-body', label: 'Request Body' },
  { id: 'response', label: 'Response' },
  { id: 'error-codes', label: 'Error Codes' },
];

const sectionHeading = 'flex items-center gap-2 mb-4';

export default function ReferencePage() {
  const [activeEndpoint, setActiveEndpoint] = useState(
    endpointCategories[0].endpoints[0]
  );
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-info-bg text-info-text border-info-border';
      case 'POST': return 'bg-success-bg text-success-text border-success-border';
      case 'PUT': return 'bg-warning-bg text-warning-text border-warning-border';
      case 'DELETE': return 'bg-error-bg text-error-text border-error-border';
      default: return 'bg-surface-inset text-text-secondary border-border-default';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div>
        <h1>API Reference</h1>
        <p className="mt-2 max-w-2xl text-lg text-text-secondary">
          Endpoint-by-endpoint documentation for the Creditax.ai API — authentication, parameters,
          request and response shapes, and error codes.
        </p>
      </div>

      <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
        {/* Content column */}
        <div className="min-w-0 flex-1">
          {/* Endpoint header */}
          <motion.div
            key={endpointId(activeEndpoint)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-5">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-sm font-bold px-3 py-1.5 rounded border ${getMethodColor(activeEndpoint.method)}`}>
                  {activeEndpoint.method}
                </span>
                <code className="min-w-0 break-all font-mono text-lg text-text-primary">
                  {activeEndpoint.path}
                </code>
                {activeEndpoint.auth && (
                  <Badge variant="info">
                    <Lock size={12} aria-hidden />
                    Auth Required
                  </Badge>
                )}
              </div>
              <p className="text-text-secondary">
                Calculate income tax for an individual or corporate entity based on Nigerian tax law.
                Supports all 36 states and the FCT with accurate withholding tax calculations.
              </p>

              {/* Endpoint switcher — horizontally contained on mobile */}
              <div className="mt-5 overflow-x-auto">
                <div className="flex min-w-max gap-2 pb-1" role="group" aria-label="Endpoints">
                  {allEndpoints.map((endpoint) => {
                    const isActive = endpointId(activeEndpoint) === endpointId(endpoint);
                    return (
                      <button
                        key={endpointId(endpoint)}
                        type="button"
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => setActiveEndpoint(endpoint)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-btn text-[13px] whitespace-nowrap transition-colors border ${
                          isActive
                            ? 'bg-brand-primary-bg text-brand-primary border-brand-primary-border'
                            : 'bg-surface-inset text-text-secondary border-border-default hover:text-text-primary hover:border-border-strong'
                        }`}
                      >
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <span className="font-mono">{endpoint.path}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Authentication */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            id="authentication"
            className="mb-10 scroll-mt-20"
          >
            <h2 className={sectionHeading}>
              <Lock size={20} className="text-brand-primary" aria-hidden />
              Authentication
            </h2>
            <Card className="border-l-4 border-l-warning p-4">
              <div className="flex items-start gap-3">
                <CircleAlert size={20} className="text-warning-text shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-warning-text">Bearer Token Required</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Include your API key in the Authorization header as a Bearer token.
                  </p>
                  <code className="block mt-2 p-2 rounded bg-surface-deep text-sm font-mono text-text-primary overflow-x-auto whitespace-pre">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Parameters */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            id="parameters"
            className="mb-10 scroll-mt-20"
          >
            <h2 className={sectionHeading}>
              <List size={20} className="text-brand-primary" aria-hidden />
              Request Parameters
            </h2>
            <Card className="max-w-full overflow-hidden">
              <div className="overflow-x-auto overscroll-contain">
                <table className="min-w-[42rem]">
                  <thead>
                    <tr className="border-b border-border-default bg-surface-inset">
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Parameter</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Type</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Required</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param, index) => (
                      <motion.tr
                        key={param.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-border-default last:border-0 hover:bg-[var(--color-hover-overlay)] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <code className="text-sm font-mono text-brand-primary">{param.name}</code>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-text-secondary">{param.type}</span>
                        </td>
                        <td className="px-4 py-3">
                          {param.required ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary">
                              <CircleCheck size={12} aria-hidden />
                              Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                              <Circle size={12} aria-hidden />
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{param.description}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.section>

          {/* Request body */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            id="request-body"
            className="mb-10 scroll-mt-20"
          >
            <h2 className={sectionHeading}>
              <Braces size={20} className="text-brand-primary" aria-hidden />
              Request Body
            </h2>
            <Card className="overflow-hidden p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-inset">
                <span className="text-sm font-semibold text-text-primary">Example Request</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(requestBodyExample, 'request')}>
                  {copiedBlock === 'request' ? (
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
              </div>
              <div className="bg-surface-deep p-4">
                <pre className="overflow-x-auto text-[12px] font-mono text-text-primary whitespace-pre">
                  {requestBodyExample}
                </pre>
              </div>
            </Card>
          </motion.section>

          {/* Response */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            id="response"
            className="mb-10 scroll-mt-20"
          >
            <h2 className={sectionHeading}>
              <Activity size={20} className="text-brand-primary" aria-hidden />
              Response
            </h2>
            <Card className="overflow-hidden p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-inset">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">200 OK</span>
                  <Badge variant="success">Success</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(responseSchema, 'response')}>
                  {copiedBlock === 'response' ? (
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
              </div>
              <div className="bg-surface-deep p-4">
                <pre className="overflow-x-auto text-[12px] font-mono text-text-primary whitespace-pre">
                  {responseSchema}
                </pre>
              </div>
            </Card>
          </motion.section>

          {/* Error codes */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            id="error-codes"
            className="mb-10 scroll-mt-20"
          >
            <h2 className={sectionHeading}>
              <CircleAlert size={20} className="text-brand-primary" aria-hidden />
              Error Codes
            </h2>
            <Card className="max-w-full overflow-hidden">
              <div className="overflow-x-auto overscroll-contain">
                <table className="min-w-[46rem]">
                  <thead>
                    <tr className="border-b border-border-default bg-surface-inset">
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Code</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Status</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Message</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorCodes.map((error, index) => (
                      <motion.tr
                        key={error.code}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-border-default last:border-0 hover:bg-[var(--color-hover-overlay)] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Badge variant="error">{error.code}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-text-primary">{error.status}</td>
                        <td className="px-4 py-3">
                          <code className="text-sm font-mono text-error-text">{error.message}</code>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{error.description}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.section>
        </div>

        {/* Right rail */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full shrink-0 xl:sticky xl:top-20 xl:w-64"
        >
          <div className="space-y-6">
            {/* Table of contents */}
            <Card className="p-4">
              <p className="text-sm font-semibold text-text-primary mb-3">On this page</p>
              <nav className="space-y-1">
                {tocLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="block text-sm text-text-muted hover:text-brand-primary transition-colors py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </Card>

            {/* Try in sandbox */}
            <Button variant="primary" size="lg" fullWidth>
              <Play size={16} aria-hidden />
              Try in Sandbox
            </Button>

            {/* Related endpoints */}
            <Card className="p-4">
              <p className="text-sm font-semibold text-text-primary mb-3">Related Endpoints</p>
              <div className="space-y-2">
                <Link href="/developers/sandbox" className="block text-sm font-mono text-brand-primary hover:underline">
                  POST /v2/tax/vat
                </Link>
                <Link href="/developers/sandbox" className="block text-sm font-mono text-brand-primary hover:underline">
                  GET /v2/tax/brackets
                </Link>
                <Link href="/developers/sandbox" className="block text-sm font-mono text-brand-primary hover:underline">
                  GET /v2/tax/wht
                </Link>
              </div>
            </Card>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
