'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const endpointCategories = [
  {
    category: 'TAX',
    icon: '📊',
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
    icon: '💳',
    expanded: false,
    endpoints: [
      { method: 'GET', path: '/v2/credit/score', name: 'Get Credit Score', auth: true },
      { method: 'POST', path: '/v2/credit/report', name: 'Generate Report', auth: true },
      { method: 'GET', path: '/v2/credit/history', name: 'Get Credit History', auth: true },
    ],
  },
  {
    category: 'DOCUMENTS',
    icon: '📄',
    expanded: false,
    endpoints: [
      { method: 'POST', path: '/v2/documents/upload', name: 'Upload Document', auth: true },
      { method: 'GET', path: '/v2/documents/:id', name: 'Get Document', auth: true },
      { method: 'DELETE', path: '/v2/documents/:id', name: 'Delete Document', auth: true },
    ],
  },
  {
    category: 'AUTH',
    icon: '🔐',
    expanded: false,
    endpoints: [
      { method: 'POST', path: '/v2/auth/token', name: 'Get Token', auth: false },
      { method: 'POST', path: '/v2/auth/refresh', name: 'Refresh Token', auth: false },
    ],
  },
  {
    category: 'MARKETPLACE',
    icon: '🏪',
    expanded: false,
    endpoints: [
      { method: 'GET', path: '/v2/marketplace/pros', name: 'List Tax Pros', auth: true },
      { method: 'GET', path: '/v2/marketplace/pros/:id', name: 'Get Tax Pro', auth: true },
    ],
  },
];

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

export default function ReferencePage() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    TAX: true,
    CREDIT: false,
    DOCUMENTS: false,
    AUTH: false,
    MARKETPLACE: false,
  });
  const [activeEndpoint, setActiveEndpoint] = useState(endpointCategories[0].endpoints[0]);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

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
    <div className="min-h-screen">
      <div className="flex">
        {/* Left Sidebar - Endpoint Tree */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 flex-shrink-0 border-r border-border-default p-4 hidden lg:block"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4 px-2">Endpoints</h3>
          <div className="space-y-1">
            {endpointCategories.map((category) => (
              <div key={category.category}>
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="flex items-center justify-between w-full px-2 py-2 text-left hover:bg-[var(--color-hover-overlay)] rounded-lg transition-colors"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">
                    {category.icon} {category.category}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-4 h-4 text-text-muted transition-transform ${expandedCategories[category.category] ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <AnimatePresence>
                  {expandedCategories[category.category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pl-2">
                        {category.endpoints.map((endpoint) => {
                          const isActive = activeEndpoint.path === endpoint.path;
                          return (
                            <button
                              key={endpoint.path}
                              onClick={() => setActiveEndpoint(endpoint)}
                              className={`
                                w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[13px]
                                transition-all
                                ${isActive
                                  ? 'bg-brand-primary-bg text-brand-primary border-l-2 border-brand-primary ml-[-1px]'
                                  : 'text-text-secondary hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
                                }
                              `}
                            >
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getMethodColor(endpoint.method)}`}>
                                {endpoint.method}
                              </span>
                              <span className="truncate font-mono text-[12px]">{endpoint.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.aside>

        {/* Center Content */}
        <div className="flex-1 p-6 max-w-4xl">
          {/* Endpoint Header */}
          <motion.div
            key={activeEndpoint.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${getMethodColor(activeEndpoint.method)}`}>
                {activeEndpoint.method}
              </span>
              <code className="text-xl font-mono text-text-primary">{activeEndpoint.path}</code>
              {activeEndpoint.auth && (
                <Badge variant="info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Auth Required
                </Badge>
              )}
            </div>
            <p className="text-text-secondary">
              Calculate income tax for an individual or corporate entity based on Nigerian tax law.
              Supports all 36 states and the FCT with accurate withholding tax calculations.
            </p>
          </motion.div>

          {/* Try in Sandbox Button */}
          <div className="mb-8">
            <Button variant="brand" size="md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Try in Sandbox
            </Button>
          </div>

          {/* Authentication Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            id="authentication"
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-brand-primary">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Authentication
            </h2>
            <Card className="p-4 border-l-4 border-l-warning">
              <div className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-warning-text flex-shrink-0 mt-0.5">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-warning-text">Bearer Token Required</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Include your API key in the Authorization header as a Bearer token.
                  </p>
                  <code className="block mt-2 p-2 rounded bg-surface-deep text-sm font-mono text-text-primary">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Parameters Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            id="parameters"
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-brand-primary">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Request Parameters
            </h2>
            <Card className="overflow-hidden">
              <table className="w-full">
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
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{param.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.section>

          {/* Request Body Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            id="request-body"
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-brand-primary">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6a2 2 0 002 2h6" />
              </svg>
              Request Body
            </h2>
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-inset">
                <span className="text-sm font-semibold text-text-primary">Example Request</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(requestBodyExample, 'request')}
                >
                  {copiedBlock === 'request' ? (
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
              </div>
              <div className="p-4 bg-surface-deep">
                <pre className="text-sm font-mono text-text-primary whitespace-pre-wrap">{requestBodyExample}</pre>
              </div>
            </Card>
          </motion.section>

          {/* Response Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            id="response"
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-brand-primary">
                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Response
            </h2>
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-inset">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">200 OK</span>
                  <Badge variant="success">Success</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(responseSchema, 'response')}
                >
                  {copiedBlock === 'response' ? (
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
              </div>
              <div className="p-4 bg-surface-deep">
                <pre className="text-sm font-mono text-text-primary whitespace-pre-wrap">{responseSchema}</pre>
              </div>
            </Card>
          </motion.section>

          {/* Error Codes Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            id="error-codes"
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-brand-primary">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              Error Codes
            </h2>
            <Card className="overflow-hidden">
              <table className="w-full">
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
            </Card>
          </motion.section>
        </div>

        {/* Right Rail */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-64 flex-shrink-0 border-l border-border-default p-4 hidden xl:block"
        >
          <div className="sticky top-24">
            {/* Table of Contents */}
            <Card className="p-4 mb-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">On this page</h3>
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

            {/* Try in Sandbox Button */}
            <Button variant="primary" size="lg" fullWidth className="mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Try in Sandbox
            </Button>

            {/* Related Endpoints */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Related Endpoints</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm font-mono text-brand-primary hover:underline">
                  POST /v2/tax/vat
                </a>
                <a href="#" className="block text-sm font-mono text-brand-primary hover:underline">
                  GET /v2/tax/brackets
                </a>
                <a href="#" className="block text-sm font-mono text-brand-primary hover:underline">
                  GET /v2/tax/wht
                </a>
              </div>
            </Card>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}