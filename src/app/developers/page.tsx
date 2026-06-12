'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const endpoints = [
  {
    category: 'TAX',
    expanded: true,
    items: [
      { method: 'POST', path: '/v2/tax/calculate', name: 'Calculate Tax' },
      { method: 'GET', path: '/v2/tax/brackets', name: 'Get Tax Brackets' },
      { method: 'POST', path: '/v2/tax/vat', name: 'Calculate VAT' },
      { method: 'GET', path: '/v2/tax/wht-tables', name: 'WHT Tables' },
    ],
  },
  {
    category: 'CREDIT',
    expanded: false,
    items: [
      { method: 'GET', path: '/v2/credit/score', name: 'Get Credit Score' },
      { method: 'POST', path: '/v2/credit/report', name: 'Generate Report' },
    ],
  },
  {
    category: 'DOCUMENTS',
    expanded: false,
    items: [
      { method: 'POST', path: '/v2/documents/upload', name: 'Upload Document' },
      { method: 'GET', path: '/v2/documents/:id', name: 'Get Document' },
    ],
  },
  {
    category: 'AUTH',
    expanded: false,
    items: [
      { method: 'POST', path: '/v2/auth/token', name: 'Get Token' },
      { method: 'POST', path: '/v2/auth/refresh', name: 'Refresh Token' },
    ],
  },
  {
    category: 'MARKETPLACE',
    expanded: false,
    items: [
      { method: 'GET', path: '/v2/marketplace/pros', name: 'List Tax Pros' },
      { method: 'GET', path: '/v2/marketplace/pros/:id', name: 'Get Tax Pro' },
    ],
  },
];

const codeSnippets = {
  curl: `curl -X POST https://api.creditax.ai/v2/tax/calculate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "income": 12000000,
    "tax_year": 2024,
    "state": "Lagos",
    "include_reliefs": true,
    "entity_type": "individual"
  }'`,
  javascript: `import { CreditaxClient } from '@creditax/node';

const client = new CreditaxClient({
  apiKey: process.env.CREDITAX_API_KEY,
  environment: 'sandbox'
});

const response = await client.tax.calculate({
  income: 12000000,
  taxYear: 2024,
  state: 'Lagos',
  includeReliefs: true,
  entityType: 'individual'
});

console.log(response.data);`,
  python: `from creditax import CreditaxClient

client = CreditaxClient(
    api_key=os.environ.get("CREDITAX_API_KEY"),
    environment="sandbox"
)

response = client.tax.calculate(
    income=12000000,
    tax_year=2024,
    state="Lagos",
    include_reliefs=True,
    entity_type="individual"
)

print(response.data)`,
  go: `package main

import (
    "context"
    creditax "github.com/creditax-ai/creditax-go"
)

func main() {
    client := creditax.NewClient(
        creditax.WithAPIKey(os.Getenv("CREDITAX_API_KEY")),
        creditax.WithEnvironment("sandbox"),
    )

    resp, err := client.Tax.Calculate(context.Background(), &creditax.TaxRequest{
        Income:         12000000,
        TaxYear:        2024,
        State:          "Lagos",
        IncludeReliefs: true,
        EntityType:     "individual",
    })
}`,
};

const sampleResponse = {
  success: true,
  data: {
    tax_year: 2024,
    gross_income: 12000000,
    total_reliefs: 300000,
    taxable_income: 11700000,
    tax_brackets: [
      { bracket: '0 - 300,000', rate: '0%', tax: 0 },
      { bracket: '300,001 - 600,000', rate: '7%', tax: 21000 },
      { bracket: '600,001 - 1,100,000', rate: '11%', tax: 55000 },
      { bracket: '1,100,001 - 1,600,000', rate: '15%', tax: 75000 },
      { bracket: '1,600,001 - 3,200,000', rate: '19%', tax: 304000 },
      { bracket: 'Above 3,200,000', rate: '22%', tax: 1894000 },
    ],
    total_tax: 2349000,
    effective_rate: '19.58%',
    take_home: 9651000,
  },
  request_id: 'req_7x9k2m4n6p8',
  processing_time_ms: 142,
};

type TabKey = 'params' | 'headers' | 'body' | 'auth';
type Language = 'curl' | 'javascript' | 'python' | 'go';

export default function DevelopersPage() {
  const [envMode, setEnvMode] = useState<'sandbox' | 'production'>('sandbox');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    TAX: true,
    CREDIT: false,
    DOCUMENTS: false,
    AUTH: false,
    MARKETPLACE: false,
  });
  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0].items[0]);
  const [activeTab, setActiveTab] = useState<TabKey>('params');
  const [activeLanguage, setActiveLanguage] = useState<Language>('curl');
  const [responseStatus, setResponseStatus] = useState<{ code: number; time: number } | null>({ code: 200, time: 142 });
  const [showResponse, setShowResponse] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSendRequest = () => {
    setShowResponse(false);
    setTimeout(() => {
      setResponseStatus({ code: 200, time: 142 });
      setShowResponse(true);
    }, 800);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-info-text bg-info-bg border-info-border';
      case 'POST': return 'text-success-text bg-success-bg border-success-border';
      case 'PUT': return 'text-warning-text bg-warning-bg border-warning-border';
      case 'DELETE': return 'text-error-text bg-error-bg border-error-border';
      default: return 'text-text-secondary bg-surface-inset border-border-default';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Sidebar - Endpoint Navigation */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 flex-shrink-0 overflow-y-auto hidden lg:block"
        >
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border-default">
              <h3 className="text-sm font-semibold text-text-primary">Endpoints</h3>
            </div>
            <div className="p-2">
              {endpoints.map((category) => (
                <div key={category.category} className="mb-1">
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-[var(--color-hover-overlay)] rounded-lg transition-colors"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">
                      {category.category}
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
                          {category.items.map((item) => {
                            const isActive = activeEndpoint.path === item.path;
                            return (
                              <button
                                key={item.path}
                                onClick={() => {
                                  setActiveEndpoint(item);
                                  setShowResponse(false);
                                }}
                                className={`
                                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[13px]
                                  transition-all
                                  ${isActive
                                    ? 'bg-brand-primary-bg text-brand-primary border-l-2 border-brand-primary'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
                                  }
                                `}
                              >
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getMethodColor(item.method)}`}>
                                  {item.method}
                                </span>
                                <span className="truncate font-mono text-[12px]">{item.name}</span>
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
          </Card>
        </motion.aside>

        {/* Center Panel - Request Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col min-w-0"
        >
          {/* Environment Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEnvMode('sandbox')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  envMode === 'sandbox'
                    ? 'bg-success-bg text-success-text border border-success-border'
                    : 'bg-surface-overlay text-text-muted border border-border-default hover:border-border-strong'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${envMode === 'sandbox' ? 'bg-brand-action animate-pulse' : 'bg-text-muted'}`} />
                Sandbox
              </button>
              <button
                onClick={() => setEnvMode('production')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  envMode === 'production'
                    ? 'bg-brand-action-bg text-brand-action border border-border-action'
                    : 'bg-surface-overlay text-text-muted border border-border-default hover:border-border-strong'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Production
              </button>
            </div>
          </div>

          {/* Endpoint Display */}
          <Card className="p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-2.5 py-1 rounded ${getMethodColor(activeEndpoint.method)}`}>
                {activeEndpoint.method}
              </span>
              <code className="text-lg font-mono text-text-primary">{activeEndpoint.path}</code>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b border-border-default">
              {(['params', 'headers', 'body', 'auth'] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-all relative ${
                    activeTab === tab
                      ? 'text-brand-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {activeTab === 'params' && (
                  <>
                    <div className="grid gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-40 flex-shrink-0">
                          <label className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block">
                            income
                          </label>
                          <Badge variant="brand" className="mt-1">Required</Badge>
                        </div>
                        <Input
                          type="number"
                          defaultValue="12000000"
                          className="flex-1 font-mono"
                        />
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-40 flex-shrink-0">
                          <label className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block">
                            tax_year
                          </label>
                          <Badge variant="brand" className="mt-1">Required</Badge>
                        </div>
                        <Input
                          type="number"
                          defaultValue="2024"
                          className="flex-1 font-mono"
                        />
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-40 flex-shrink-0">
                          <label className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block">
                            state
                          </label>
                          <Badge variant="info" className="mt-1">Optional</Badge>
                        </div>
                        <Input
                          type="text"
                          defaultValue="Lagos"
                          className="flex-1 font-mono"
                        />
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-40 flex-shrink-0">
                          <label className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block">
                            include_reliefs
                          </label>
                          <Badge variant="info" className="mt-1">Optional</Badge>
                        </div>
                        <div className="flex-1 flex items-center">
                          <button className="w-12 h-6 rounded-full bg-brand-action relative transition-colors">
                            <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow" />
                          </button>
                          <span className="ml-3 text-sm text-text-secondary">Enabled</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-40 flex-shrink-0">
                          <label className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block">
                            entity_type
                          </label>
                          <Badge variant="info" className="mt-1">Optional</Badge>
                        </div>
                        <div className="flex-1 flex gap-2">
                          <button className="px-4 py-2 rounded-btn bg-brand-primary-bg text-brand-primary border border-brand-primary-border text-sm font-medium">
                            individual
                          </button>
                          <button className="px-4 py-2 rounded-btn bg-surface-inset text-text-secondary border border-border-default text-sm font-medium hover:bg-[var(--color-hover-overlay)]">
                            corporate
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'headers' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-inset border border-border-default">
                      <span className="text-sm font-mono text-text-muted w-40">Content-Type</span>
                      <span className="text-sm font-mono text-text-primary">application/json</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-inset border border-border-default">
                      <span className="text-sm font-mono text-text-muted w-40">Authorization</span>
                      <span className="text-sm font-mono text-text-primary">Bearer sk_sandbox_••••••••</span>
                    </div>
                  </div>
                )}

                {activeTab === 'body' && (
                  <div className="p-4 rounded-lg bg-surface-inset border border-border-default font-mono text-sm">
                    <pre className="text-text-primary whitespace-pre-wrap">
{`{
  "income": 12000000,
  "tax_year": 2024,
  "state": "Lagos",
  "include_reliefs": true,
  "entity_type": "individual"
}`}
                    </pre>
                  </div>
                )}

                {activeTab === 'auth' && (
                  <div className="p-4 rounded-lg bg-warning-bg border border-warning-border">
                    <div className="flex items-start gap-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-warning-text flex-shrink-0 mt-0.5">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-warning-text">Bearer Token Required</p>
                        <p className="text-sm text-warning-text/80 mt-1">
                          Include your API key in the Authorization header: <code className="font-mono bg-black/20 px-1 rounded">Bearer YOUR_API_KEY</code>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Send Request Button */}
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={handleSendRequest}
            className="mb-4"
          >
            Send Request
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>

          {/* Response Panel */}
          <AnimatePresence>
            {showResponse && responseStatus && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex-1 overflow-hidden"
              >
                <Card className="p-0 h-full flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-border-default">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold px-2.5 py-1 rounded ${
                        responseStatus.code === 200
                          ? 'bg-success-bg text-success-text border border-success-border'
                          : 'bg-error-bg text-error-text border border-error-border'
                      }`}>
                        {responseStatus.code} {responseStatus.code === 200 ? 'OK' : 'Error'}
                      </span>
                      <span className="text-sm text-text-muted">{responseStatus.time}ms</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      Copy
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <pre className="text-sm font-mono text-text-primary whitespace-pre-wrap">
                      {JSON.stringify(sampleResponse, null, 2)}
                    </pre>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Panel - Code Snippets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-80 flex-shrink-0 hidden xl:block"
        >
          <Card className="p-0 overflow-hidden h-full flex flex-col">
            {/* Language Tabs */}
            <div className="flex border-b border-border-default">
              {(['curl', 'javascript', 'python', 'go'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLanguage(lang)}
                  className={`flex-1 px-3 py-3 text-xs font-semibold capitalize transition-all ${
                    activeLanguage === lang
                      ? 'bg-brand-primary-bg text-brand-primary border-b-2 border-brand-primary'
                      : 'text-text-muted hover:text-text-secondary hover:bg-[var(--color-hover-overlay)]'
                  }`}
                >
                  {lang === 'javascript' ? 'JS' : lang === 'python' ? 'Python' : lang}
                </button>
              ))}
            </div>

            {/* Code Block */}
            <div className="flex-1 overflow-auto p-4 bg-surface-deep">
              <div className="relative">
                <button className="absolute top-2 right-2 p-1.5 rounded bg-brand-primary-bg text-brand-primary hover:bg-brand-primary-border transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                </button>
                <pre className="text-[12px] font-mono text-text-primary whitespace-pre-wrap leading-relaxed">
                  {codeSnippets[activeLanguage]}
                </pre>
              </div>
            </div>

            {/* Run in Sandbox Button */}
            <div className="p-4 border-t border-border-default">
              <Button variant="secondary" size="lg" fullWidth>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Run in Sandbox
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}