'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  FlaskConical,
  Loader2,
  Play,
  Rocket,
  Search,
  Send,
  TriangleAlert,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const endpoints = [
  {
    category: 'TAX',
    items: [
      { method: 'POST', path: '/v2/tax/calculate', name: 'Calculate Tax', desc: 'Income tax with reliefs & brackets' },
      { method: 'GET', path: '/v2/tax/brackets', name: 'Get Tax Brackets', desc: 'Current PITA bands for a state' },
      { method: 'POST', path: '/v2/tax/vat', name: 'Calculate VAT', desc: 'Output & input VAT breakdown' },
      { method: 'GET', path: '/v2/tax/wht-tables', name: 'WHT Tables', desc: 'Withholding rates by category' },
    ],
  },
  {
    category: 'CREDIT',
    items: [
      { method: 'GET', path: '/v2/credit/score', name: 'Get Credit Score', desc: 'Score from filing + bank signals' },
      { method: 'POST', path: '/v2/credit/report', name: 'Generate Report', desc: 'PDF credit snapshot for lenders' },
    ],
  },
  {
    category: 'DOCUMENTS',
    items: [
      { method: 'POST', path: '/v2/documents/upload', name: 'Upload Document', desc: 'Receipt / invoice extraction' },
      { method: 'GET', path: '/v2/documents/:id', name: 'Get Document', desc: 'Fetch extracted fields' },
    ],
  },
  {
    category: 'AUTH',
    items: [
      { method: 'POST', path: '/v2/auth/token', name: 'Get Token', desc: 'Exchange API key for bearer' },
      { method: 'POST', path: '/v2/auth/refresh', name: 'Refresh Token', desc: 'Rotate a valid token' },
    ],
  },
  {
    category: 'MARKETPLACE',
    items: [
      { method: 'GET', path: '/v2/marketplace/pros', name: 'List Tax Pros', desc: 'Filter by city & service' },
      { method: 'GET', path: '/v2/marketplace/pros/:id', name: 'Get Tax Pro', desc: 'Profile, ratings, contact' },
    ],
  },
];

type ParamDef = {
  key: string;
  type: 'number' | 'text' | 'boolean' | 'enum';
  required?: boolean;
  hint?: string;
  options?: string[];
  default: string | boolean;
};

const PARAMS_BY_PATH: Record<string, ParamDef[]> = {
  '/v2/tax/calculate': [
    { key: 'income', type: 'number', required: true, hint: 'Gross annual income in ₦', default: '12000000' },
    { key: 'tax_year', type: 'number', required: true, hint: 'Assessment year', default: '2024' },
    { key: 'state', type: 'text', hint: 'Lagos, FCT, Rivers…', default: 'Lagos' },
    { key: 'include_reliefs', type: 'boolean', hint: 'CRA + pension relief', default: true },
    { key: 'entity_type', type: 'enum', options: ['individual', 'corporate'], default: 'individual' },
  ],
  '/v2/tax/vat': [
    { key: 'amount', type: 'number', required: true, hint: 'Transaction amount in ₦', default: '2500000' },
    { key: 'type', type: 'enum', options: ['output', 'input'], default: 'output' },
    { key: 'tax_month', type: 'text', hint: 'YYYY-MM', default: '2024-06' },
  ],
  '/v2/credit/score': [
    { key: 'subject_id', type: 'text', required: true, hint: 'BVN or business ID (sandbox)', default: 'sbx_9f2a' },
    { key: 'include_factors', type: 'boolean', default: true },
  ],
};

const DEFAULT_PARAMS: ParamDef[] = PARAMS_BY_PATH['/v2/tax/calculate'];

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
type Endpoint = (typeof endpoints)[0]['items'][0];
type ParamValues = Record<string, string | boolean>;

function methodClasses(method: string) {
  switch (method) {
    case 'GET':
      return 'text-info-text bg-info-bg border-info-border';
    case 'POST':
      return 'text-success-text bg-success-bg border-success-border';
    case 'PUT':
      return 'text-warning-text bg-warning-bg border-warning-border';
    case 'DELETE':
      return 'text-error-text bg-error-bg border-error-border';
    default:
      return 'text-text-secondary bg-surface-inset border-border-default';
  }
}

function buildBodySnippet(path: string, values: ParamValues, defs: ParamDef[]) {
  const lines = defs.map((def) => {
    const v = values[def.key];
    if (def.type === 'boolean') return `    "${def.key}": ${Boolean(v)}`;
    if (def.type === 'number') return `    "${def.key}": ${Number(v) || 0}`;
    return `    "${def.key}": ${JSON.stringify(String(v ?? ''))}`;
  });
  return `POST ${path}\n{\n${lines.join(',\n')}\n}`;
}

function buildCurl(path: string, values: ParamValues, defs: ParamDef[]) {
  const body = JSON.stringify(
    Object.fromEntries(
      defs.map((d) => [
        d.key,
        d.type === 'boolean' ? Boolean(values[d.key]) : d.type === 'number' ? Number(values[d.key]) || 0 : String(values[d.key] ?? ''),
      ])
    ),
    null,
    2
  );
  return `curl -X POST https://api.creditax.ai${path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${body}'`;
}

/** Lightweight JSON pretty-printer with key/string/number colors. */
function JsonHighlight({ value }: { value: unknown }) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  const parts = text.split('\n');
  return (
    <pre className="text-[12px] font-mono leading-[1.65] text-text-primary whitespace-pre">
      {parts.map((line, i) => {
        const keyMatch = line.match(/^(\s*)"([^"]+)":\s*(.*)$/);
        if (keyMatch) {
          const [, indent, key, rest] = keyMatch;
          let valueNode: React.ReactNode = rest;
          if (rest.startsWith('"')) {
            valueNode = <span className="text-brand-action">{rest}</span>;
          } else if (rest === 'true' || rest === 'false' || rest === 'null') {
            valueNode = <span className="text-info-text">{rest}</span>;
          } else if (/^-?\d/.test(rest)) {
            valueNode = <span className="text-warning-text">{rest}</span>;
          }
          return (
            <span key={i}>
              {indent}
              <span className="text-brand-primary">&quot;{key}&quot;</span>: {valueNode}
              {'\n'}
            </span>
          );
        }
        return (
          <span key={i} className="text-text-secondary">
            {line}
            {'\n'}
          </span>
        );
      })}
    </pre>
  );
}

export default function DevelopersPage() {
  const router = useRouter();
  const [envMode, setEnvMode] = useState<'sandbox' | 'production'>('sandbox');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    TAX: true,
    CREDIT: false,
    DOCUMENTS: false,
    AUTH: false,
    MARKETPLACE: false,
  });
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>(endpoints[0].items[0]);
  const [activeTab, setActiveTab] = useState<TabKey>('params');
  const [activeLanguage, setActiveLanguage] = useState<Language>('curl');
  const [endpointQuery, setEndpointQuery] = useState('');
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [responseStatus, setResponseStatus] = useState<{ code: number; time: number } | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [sending, setSending] = useState(false);
  const [paramValues, setParamValues] = useState<ParamValues>(() =>
    Object.fromEntries(DEFAULT_PARAMS.map((d) => [d.key, d.default]))
  );

  const paramDefs = useMemo(
    () => PARAMS_BY_PATH[activeEndpoint.path] ?? DEFAULT_PARAMS,
    [activeEndpoint.path]
  );

  const filteredEndpoints = useMemo(() => {
    const q = endpointQuery.trim().toLowerCase();
    if (!q) return endpoints;
    return endpoints
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.path.toLowerCase().includes(q) ||
            item.method.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [endpointQuery]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const selectEndpoint = (item: Endpoint) => {
    setActiveEndpoint(item);
    setShowResponse(false);
    setResponseStatus(null);
    const defs = PARAMS_BY_PATH[item.path] ?? [];
    setParamValues(Object.fromEntries(defs.map((d) => [d.key, d.default])));
    if (defs.length === 0 && activeTab === 'params') setActiveTab('headers');
    if (defs.length > 0 && (activeTab === 'headers' || activeTab === 'auth')) setActiveTab('params');
  };

  const setParam = (key: string, value: string | boolean) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSendRequest = () => {
    if (sending) return;
    setSending(true);
    setShowResponse(false);
    setResponseStatus(null);
    window.setTimeout(() => {
      setSending(false);
      setResponseStatus({ code: 200, time: 142 });
      setShowResponse(true);
    }, 650);
  };

  const copyToClipboard = (text: string, target: 'response' | 'snippet') => {
    navigator.clipboard.writeText(text);
    if (target === 'response') {
      setCopiedResponse(true);
      window.setTimeout(() => setCopiedResponse(false), 2000);
    } else {
      setCopiedSnippet(true);
      window.setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const liveCurl = buildCurl(activeEndpoint.path, paramValues, paramDefs);
  const displaySnippet =
    activeEndpoint.path === '/v2/tax/calculate' && activeLanguage === 'curl'
      ? liveCurl
      : codeSnippets[activeLanguage];
  const bodyPreview = buildBodySnippet(activeEndpoint.path, paramValues, paramDefs);

  const hasParams = paramDefs.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Pass 1: hierarchy — eyebrow, title, meta, quick jumps ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border border-brand-primary-border bg-brand-primary-bg text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-action" aria-hidden />
              API Explorer
            </span>
            <Badge variant="brand">v2.1.0</Badge>
          </div>
          <h1 className="tracking-tight">Try the sandbox, live</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-text-secondary leading-relaxed">
            Pick an endpoint, set parameters, send a request against the sandbox, then copy the
            snippet into your stack — Node, Python, Go, or curl.
          </p>
          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-mono text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
              base&nbsp;
              <span className="text-text-secondary">https://api.creditax.ai</span>
            </span>
            <span aria-hidden className="text-border-strong">·</span>
            <span>
              p50&nbsp;<span className="text-text-secondary">142ms</span>
            </span>
            <span aria-hidden className="text-border-strong">·</span>
            <span>
              auth&nbsp;<span className="text-text-secondary">Bearer</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-stretch lg:items-end gap-3 shrink-0">
          {/* Segmented environment control */}
          <div
            role="group"
            aria-label="Environment"
            className="inline-flex p-1 rounded-pill bg-surface-inset border border-border-subtle self-start lg:self-auto"
          >
            <button
              type="button"
              aria-pressed={envMode === 'sandbox'}
              onClick={() => setEnvMode('sandbox')}
              className={`flex items-center gap-2 h-8 px-4 rounded-pill text-[13px] font-semibold transition-colors duration-150 cursor-pointer ${
                envMode === 'sandbox'
                  ? 'bg-surface-overlay text-success-text shadow-card border border-success-border'
                  : 'text-text-muted hover:text-text-secondary border border-transparent'
              }`}
            >
              <FlaskConical size={14} aria-hidden />
              Sandbox
            </button>
            <button
              type="button"
              aria-pressed={envMode === 'production'}
              onClick={() => setEnvMode('production')}
              className={`flex items-center gap-2 h-8 px-4 rounded-pill text-[13px] font-semibold transition-colors duration-150 cursor-pointer ${
                envMode === 'production'
                  ? 'bg-brand-action-bg text-brand-action shadow-card border border-brand-action-border'
                  : 'text-text-muted hover:text-text-secondary border border-transparent'
              }`}
            >
              <Zap size={14} aria-hidden />
              Production
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/developers/quickstart">
              <Button variant="ghost" size="sm" className="h-9">
                <Rocket size={14} aria-hidden />
                Quickstart
              </Button>
            </Link>
            <Link href="/developers/reference">
              <Button variant="ghost" size="sm" className="h-9">
                <BookOpen size={14} aria-hidden />
                Reference
              </Button>
            </Link>
            <Link href="/developers/sandbox">
              <Button variant="secondary" size="sm" className="h-9">
                Test data
                <ArrowRight size={14} aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {envMode === 'production' && (
        <div
          role="status"
          className="flex items-start gap-3 p-3.5 rounded-card bg-warning-bg border border-warning-border"
        >
          <TriangleAlert size={16} className="text-warning-text shrink-0 mt-0.5" aria-hidden />
          <p className="text-[13px] text-warning-text leading-relaxed">
            <span className="font-semibold">Production mode.</span> Requests here would hit live
            endpoints with real rate limits. Prefer sandbox while you explore — switch back above.
          </p>
        </div>
      )}

      {/* ── Three panels ── */}
      <div className="flex flex-col gap-4 xl:h-[calc(100vh-16rem)] xl:min-h-[580px] xl:flex-row xl:items-stretch">
        {/* Endpoint navigation */}
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="w-full shrink-0 xl:w-[248px] xl:min-h-0"
          aria-label="Endpoint list"
        >
          <Card className="flex h-full max-h-[440px] flex-col overflow-hidden p-0 xl:max-h-none">
            <div className="border-b border-border-default p-3 space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">
                Endpoints
              </p>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  aria-hidden
                />
                <input
                  type="search"
                  aria-label="Filter endpoints"
                  placeholder="Filter…"
                  value={endpointQuery}
                  onChange={(e) => setEndpointQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-btn bg-surface-base border border-border-default text-[12px] text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-2 min-h-0">
              {filteredEndpoints.length === 0 && (
                <p className="px-3 py-6 text-[13px] text-text-muted text-center">
                  No endpoints match “{endpointQuery}”.
                </p>
              )}
              {filteredEndpoints.map((category) => {
                const isOpen = endpointQuery ? true : expandedCategories[category.category];
                return (
                  <div key={category.category} className="mb-1 last:mb-0">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.category)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-[var(--color-hover-overlay)] transition-colors duration-150 cursor-pointer"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-mono">
                        {category.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] text-text-disabled font-mono">
                          {category.items.length}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-text-muted transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: EASE_OUT }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-0.5 pl-2 pb-1">
                            {category.items.map((item) => {
                              const isActive = activeEndpoint.path === item.path;
                              return (
                                <button
                                  key={item.path}
                                  type="button"
                                  aria-current={isActive ? 'true' : undefined}
                                  onClick={() => selectEndpoint(item)}
                                  title={item.desc}
                                  className={`w-full flex flex-col gap-1 px-2.5 py-2 rounded-lg text-left transition-colors duration-150 cursor-pointer group ${
                                    isActive
                                      ? 'bg-brand-primary-bg border-l-2 border-brand-primary'
                                      : 'border-l-2 border-transparent hover:bg-[var(--color-hover-overlay)]'
                                  }`}
                                >
                                  <span className="flex items-center gap-2 min-w-0">
                                    <span
                                      className={`text-[9px] font-bold px-1 py rounded border font-mono shrink-0 ${methodClasses(item.method)}`}
                                    >
                                      {item.method}
                                    </span>
                                    <span
                                      className={`truncate text-[12.5px] font-medium ${isActive ? 'text-brand-primary' : 'text-text-secondary group-hover:text-text-primary'}`}
                                    >
                                      {item.name}
                                    </span>
                                  </span>
                                  <span className="truncate font-mono text-[10.5px] text-text-muted pl-0.5">
                                    {item.path}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.aside>

        {/* Request builder */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: EASE_OUT }}
          className="flex min-w-0 flex-col gap-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain xl:pr-1"
        >
          {/* Endpoint display */}
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded border font-mono ${methodClasses(activeEndpoint.method)}`}
              >
                {activeEndpoint.method}
              </span>
              <code className="min-w-0 break-all font-mono text-[15px] text-text-primary">
                {activeEndpoint.path}
              </code>
              <span className="ml-auto text-[12px] text-text-muted hidden sm:block">
                {activeEndpoint.desc}
              </span>
            </div>

            {/* Tabs */}
            <div className="mt-4 mb-4 overflow-x-auto border-b border-border-subtle">
              <div className="flex gap-0.5 min-w-max" role="tablist" aria-label="Request sections">
                {(['params', 'headers', 'body', 'auth'] as TabKey[]).map((tab) => {
                  const disabled = tab === 'params' && !hasParams;
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab}
                      disabled={disabled}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-3.5 py-2 text-[13px] font-medium capitalize whitespace-nowrap transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        activeTab === tab
                          ? 'text-brand-primary'
                          : 'text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.span
                          layoutId="reqTab"
                          transition={{ duration: 0.18, ease: EASE_OUT }}
                          className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-brand-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: EASE_OUT }}
                className="space-y-4"
                role="tabpanel"
              >
                {activeTab === 'params' && hasParams && (
                  <div className="grid gap-3">
                    {paramDefs.map((def) => (
                      <div
                        key={def.key}
                        className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4 py-2 border-b border-border-subtle last:border-0 last:pb-0"
                      >
                        <div className="w-full sm:w-44 sm:shrink-0">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block font-mono">
                            {def.key}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <Badge variant={def.required ? 'brand' : 'info'}>
                              {def.required ? 'Required' : 'Optional'}
                            </Badge>
                            <span className="text-[10px] text-text-disabled font-mono uppercase">
                              {def.type}
                            </span>
                          </div>
                          {def.hint && (
                            <p className="text-[11px] text-text-muted mt-1 leading-snug">{def.hint}</p>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {def.type === 'boolean' ? (
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={Boolean(paramValues[def.key])}
                                aria-label={def.key}
                                onClick={() => setParam(def.key, !paramValues[def.key])}
                                className={`w-11 h-6 rounded-full relative transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-overlay ${
                                  paramValues[def.key] ? 'bg-brand-action' : 'bg-surface-inset border border-border-strong'
                                }`}
                              >
                                <span
                                  aria-hidden
                                  className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-150 ${
                                    paramValues[def.key] ? 'translate-x-[20px]' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span className="text-sm text-text-secondary">
                                {paramValues[def.key] ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          ) : def.type === 'enum' && def.options ? (
                            <div className="flex flex-wrap gap-2">
                              {def.options.map((opt) => {
                                const selected = paramValues[def.key] === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => setParam(def.key, opt)}
                                    className={`px-3.5 py-1.5 rounded-btn text-[13px] font-medium font-mono transition-colors duration-150 cursor-pointer ${
                                      selected
                                        ? 'bg-brand-primary-bg text-brand-primary border border-brand-primary-border'
                                        : 'bg-surface-inset text-text-secondary border border-border-default hover:text-text-primary hover:border-border-strong'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <Input
                              type={def.type === 'number' ? 'number' : 'text'}
                              value={String(paramValues[def.key] ?? '')}
                              onChange={(e) => setParam(def.key, e.target.value)}
                              className="h-10 font-mono"
                              aria-label={def.key}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'params' && !hasParams && (
                  <div className="p-4 rounded-lg bg-surface-inset border border-border-subtle">
                    <p className="text-sm text-text-secondary">
                      This endpoint takes no query parameters — path params only. Check the{' '}
                      <Link href="/developers/reference" className="text-brand-primary hover:underline font-medium">
                        reference
                      </Link>{' '}
                      for path arguments.
                    </p>
                  </div>
                )}

                {activeTab === 'headers' && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-inset border border-border-default sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-[12px] font-mono text-text-muted sm:w-40 uppercase tracking-wide">
                        Content-Type
                      </span>
                      <span className="text-sm font-mono text-text-primary">application/json</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-inset border border-border-default sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-[12px] font-mono text-text-muted sm:w-40 uppercase tracking-wide">
                        Authorization
                      </span>
                      <span className="text-sm font-mono break-all text-text-primary">
                        Bearer sk_sandbox_••••••••
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-inset border border-border-default sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-[12px] font-mono text-text-muted sm:w-40 uppercase tracking-wide">
                        X-Creditax-Version
                      </span>
                      <span className="text-sm font-mono text-text-primary">2024-06-01</span>
                    </div>
                  </div>
                )}

                {activeTab === 'body' && (
                  <div className="p-4 rounded-lg bg-surface-deep border border-border-subtle overflow-x-auto">
                    <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-muted mb-2">
                      Request body · live from params
                    </p>
                    <pre className="text-[12px] font-mono text-text-primary whitespace-pre leading-relaxed">
                      {bodyPreview}
                    </pre>
                  </div>
                )}

                {activeTab === 'auth' && (
                  <div className="p-4 rounded-lg bg-warning-bg border border-warning-border">
                    <div className="flex items-start gap-3">
                      <TriangleAlert size={18} className="text-warning-text shrink-0 mt-0.5" aria-hidden />
                      <div>
                        <p className="text-sm font-semibold text-warning-text">Bearer token required</p>
                        <p className="text-sm text-warning-text/85 mt-1 leading-relaxed">
                          Include your API key in the Authorization header:{' '}
                          <code className="font-mono bg-surface-base/50 px-1.5 py-0.5 rounded border border-warning-border/40">
                            Bearer YOUR_API_KEY
                          </code>
                        </p>
                        <Link
                          href="/dashboard/keys"
                          className="inline-flex items-center gap-1 mt-2.5 text-[13px] font-semibold text-warning-text hover:underline"
                        >
                          Get a sandbox key
                          <ArrowRight size={13} aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Send */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSendRequest}
              disabled={sending}
              className="sm:flex-1 active:scale-[0.98] transition-transform duration-100"
            >
              {sending ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden />
                  Send Request
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setShowResponse(false)}
              disabled={!showResponse}
              className="sm:w-auto"
            >
              Clear
            </Button>
          </div>

          {/* Response — empty state + loaded */}
          <AnimatePresence mode="wait" initial={false}>
            {showResponse && responseStatus ? (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="shrink-0"
              >
                <Card className="p-0 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border-default bg-surface-inset/40">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[12px] font-bold px-2 py-0.5 rounded border font-mono ${
                          responseStatus.code === 200
                            ? 'bg-success-bg text-success-text border-success-border'
                            : 'bg-error-bg text-error-text border-error-border'
                        }`}
                      >
                        {responseStatus.code} {responseStatus.code === 200 ? 'OK' : 'Error'}
                      </span>
                      <span className="text-[13px] text-text-muted font-mono">
                        {responseStatus.time}ms
                      </span>
                      <span className="hidden sm:inline text-[13px] text-text-muted font-mono">
                        · application/json
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(sampleResponse, null, 2), 'response')}
                        aria-label={copiedResponse ? 'Response copied' : 'Copy response'}
                      >
                        {copiedResponse ? (
                          <Check size={14} className="text-success-text" aria-hidden />
                        ) : (
                          <Copy size={14} aria-hidden />
                        )}
                        {copiedResponse ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowResponse(false)}
                        aria-label="Dismiss response"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[360px] overflow-auto overscroll-contain p-4 bg-surface-deep">
                    <JsonHighlight value={sampleResponse} />
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="shrink-0"
              >
                <div className="rounded-card border border-dashed border-border-default bg-surface-overlay/50 px-5 py-7 text-center">
                  <div className="mx-auto w-9 h-9 rounded-full bg-brand-primary-bg border border-brand-primary-border grid place-items-center mb-2.5">
                    <Play size={15} className="text-brand-primary" aria-hidden />
                  </div>
                  <p className="text-sm font-semibold text-text-primary mb-1">
                    {sending ? 'Calling sandbox…' : 'No response yet'}
                  </p>
                  <p className="text-[13px] text-text-muted max-w-sm mx-auto leading-relaxed">
                    {sending
                      ? 'Simulating POST with your current parameters.'
                      : 'Hit Send Request to run this call and inspect the JSON payload.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Code snippets */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE_OUT }}
          className="w-full shrink-0 xl:w-[300px] xl:min-h-0"
        >
          <Card className="flex h-full max-h-[560px] flex-col overflow-hidden p-0 xl:max-h-none">
            <div className="flex items-center justify-between px-4 pt-3 pb-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">
                Snippet
              </p>
              <span className="text-[11px] font-mono text-text-disabled">
                {envMode === 'sandbox' ? 'sandbox' : 'live'}
              </span>
            </div>

            {/* Language tabs */}
            <div className="overflow-x-auto border-b border-border-subtle px-2 pt-2">
              <div className="flex min-w-max" role="tablist" aria-label="Snippet language">
                {(['curl', 'javascript', 'python', 'go'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    role="tab"
                    aria-selected={activeLanguage === lang}
                    onClick={() => setActiveLanguage(lang)}
                    className={`px-3 py-2 text-[12px] font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer rounded-t-md ${
                      activeLanguage === lang
                        ? 'text-brand-primary bg-brand-primary-bg'
                        : 'text-text-muted hover:text-text-secondary hover:bg-[var(--color-hover-overlay)]'
                    }`}
                  >
                    {lang === 'javascript' ? 'Node' : lang === 'python' ? 'Python' : lang === 'go' ? 'Go' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code block */}
            <div className="flex-1 min-h-0 overflow-auto overscroll-contain bg-surface-deep p-4 relative group">
              <button
                type="button"
                aria-label={copiedSnippet ? 'Snippet copied' : 'Copy code snippet'}
                onClick={() => copyToClipboard(displaySnippet, 'snippet')}
                className="absolute top-3 right-3 z-10 p-2 rounded-btn bg-surface-overlay border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary-border transition-colors duration-150 cursor-pointer opacity-90 group-hover:opacity-100"
              >
                {copiedSnippet ? (
                  <Check size={14} className="text-success-text" aria-hidden />
                ) : (
                  <Copy size={14} aria-hidden />
                )}
              </button>
              <pre className="text-[12px] font-mono text-text-primary whitespace-pre leading-relaxed pr-8">
                {displaySnippet}
              </pre>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border-default p-3 flex flex-col gap-2">
              <Button variant="secondary" size="md" fullWidth onClick={handleSendRequest} disabled={sending}>
                {sending ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden />
                ) : (
                  <Play size={15} aria-hidden />
                )}
                Run in Sandbox
              </Button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/keys')}
                className="text-[12px] text-text-muted hover:text-brand-primary text-center transition-colors duration-150 cursor-pointer"
              >
                Need a key? Open API Keys →
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
