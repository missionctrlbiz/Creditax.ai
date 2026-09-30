'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Clock, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { ApiKeyRecord } from '@/ai/api-keys';

const steps = [
  {
    number: 1,
    title: 'Get API key',
    description: 'Sign up for a Creditax.ai account and get your API key from the dashboard.',
    completed: true,
  },
  {
    number: 2,
    title: 'Install SDK',
    description: 'Install the official Creditax.ai Node.js package using npm or yarn.',
    completed: false,
    current: true,
  },
  {
    number: 3,
    title: 'Make first request',
    description: 'Use the SDK to make your first tax calculation request.',
    completed: false,
  },
  {
    number: 4,
    title: 'View response',
    description: 'Understand the response structure and handle the data.',
    completed: false,
  },
];

const codeBlocks = {
  bash: {
    install: `# Install via npm
npm install @creditax/node

# Or via yarn
yarn add @creditax/node`,
  },
  javascript: `import { CreditaxClient } from '@creditax/node';

const client = new CreditaxClient({
  apiKey: process.env.CREDITAX_API_KEY,
  environment: 'sandbox' // or 'production'
});

// Make your first request
const response = await client.tax.calculate({
  income: 12000000,
  taxYear: 2024,
  state: 'Lagos',
  includeReliefs: true,
  entityType: 'individual'
});

console.log('Tax calculated:', response.data);`,
  python: `from creditax import CreditaxClient
import os

client = CreditaxClient(
    api_key=os.environ.get("CREDITAX_API_KEY"),
    environment="sandbox"  # or "production"
)

# Make your first request
response = client.tax.calculate(
    income=12000000,
    tax_year=2024,
    state="Lagos",
    include_reliefs=True,
    entity_type="individual"
)

print(f"Tax calculated: {response.data}")`,
  go: `package main

import (
    "context"
    "fmt"
    "os"
    creditax "github.com/creditax-ai/creditax-go"
)

func main() {
    client := creditax.NewClient(
        creditax.WithAPIKey(os.Getenv("CREDITAX_API_KEY")),
        creditax.WithEnvironment(creditax.Sandbox),
    )

    resp, err := client.Tax.Calculate(context.Background(), &creditax.TaxRequest{
        Income:         12000000,
        TaxYear:        2024,
        State:          "Lagos",
        IncludeReliefs: true,
        EntityType:     creditax.EntityIndividual,
    })
    if err != nil {
        panic(err)
    }

    fmt.Printf("Tax calculated: %v\\n", resp.Data)
}`,
};

const checklistItems = [
  { text: 'Get API key', done: true },
  { text: 'Install SDK', done: true },
  { text: 'Make first request', done: false },
  { text: 'View response', done: false },
];

const helpfulLinks = [
  { label: 'API Reference', href: '/developers/reference', external: false },
  { label: 'SDK on GitHub', href: 'https://github.com/creditax-ai', external: true },
  { label: 'Join Discord Community', href: 'https://github.com/creditax-ai', external: true },
  { label: 'Get Support', href: '/status', external: false },
];

type Language = 'bash' | 'javascript' | 'python' | 'go';

export default function QuickstartPage() {
  const [activeLanguage, setActiveLanguage] = useState<Language>('javascript');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  // P11 — the quickstart's "Get API key" step shows the live sandbox key from
  // the api-keys store (demo_seed), not a hardcoded literal.
  const [sandboxKey, setSandboxKey] = useState<ApiKeyRecord | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/api-keys')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { keys?: ApiKeyRecord[] } | null) => {
        if (!active || !d?.keys) return;
        const test = d.keys.find((k) => k.environment === 'test') ?? d.keys[0];
        if (test) {
          setSandboxKey(test);
          setLive(true);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  // P12 — functional wizard navigation (was a static single step).
  const [stepNumber, setStepNumber] = useState(2);
  const currentStep = steps.find((s) => s.number === stepNumber) || steps[1];
  const progressPercent = (stepNumber / steps.length) * 100;
  const activeCode =
    activeLanguage === 'bash' ? codeBlocks.bash.install : codeBlocks[activeLanguage];

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <h1>Quickstart</h1>
          {live && <Badge variant="success">live · demo_seed</Badge>}
        </div>
        <p className="mt-2 max-w-2xl text-lg text-text-secondary">
          Make your first Creditax.ai API call in under 5 minutes.
        </p>
        {sandboxKey && (
          <div className="mt-3 flex items-center gap-2 rounded-btn border border-border-subtle bg-surface-overlay px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Your sandbox key
            </span>
            <code className="font-mono text-[13px] text-text-primary">{sandboxKey.key}</code>
            <button
              type="button"
              onClick={() => copyToClipboard(sandboxKey.key, 'quickstart-key')}
              className="text-text-muted hover:text-text-primary cursor-pointer"
              aria-label="Copy sandbox key"
            >
              <Copy size={14} />
            </button>
            {copiedBlock === 'quickstart-key' && (
              <span className="text-[11px] text-success-text">copied</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Main column */}
        <div className="min-w-0 flex-1">
          {/* Language selector */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Code language">
            {(['bash', 'javascript', 'python', 'go'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                aria-pressed={activeLanguage === lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-4 py-2.5 rounded-btn text-sm font-semibold transition-colors ${
                  activeLanguage === lang
                    ? 'bg-brand-primary text-text-inverse shadow-btn-brand'
                    : 'bg-surface-overlay text-text-secondary border border-border-default hover:border-border-strong hover:text-text-primary'
                }`}
              >
                {lang === 'bash' ? '$ cURL' : lang === 'javascript' ? 'Node.js' : lang === 'python' ? 'Python' : 'Go'}
              </button>
            ))}
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-3">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center">
                        <Check size={16} className="text-text-inverse" aria-hidden />
                      </div>
                    ) : step.current ? (
                      <div className="w-7 h-7 rounded-full bg-warning-bg border-2 border-warning flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-surface-inset border-2 border-border-default flex items-center justify-center">
                        <span className="text-xs font-bold text-text-muted">{step.number}</span>
                      </div>
                    )}
                    <span
                      className={`text-sm font-medium hidden sm:block ${
                        step.current
                          ? 'text-text-primary'
                          : step.completed
                            ? 'text-text-muted line-through'
                            : 'text-text-muted'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-3 ${step.completed ? 'bg-brand-primary' : 'bg-border-default'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.number}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative mb-6 overflow-hidden p-6">
                {/* Background number */}
                <span
                  className="absolute top-4 right-6 text-[80px] font-bold text-brand-primary/10 select-none"
                  aria-hidden
                >
                  {String(currentStep.number).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <h2 className="mb-2">{currentStep.title}</h2>
                  <p className="mb-6 text-text-secondary">{currentStep.description}</p>

                  {/* Code block */}
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(activeCode, activeLanguage === 'bash' ? 'install' : 'main')
                        }
                        className="text-text-muted hover:text-text-primary"
                      >
                        {copiedBlock === (activeLanguage === 'bash' ? 'install' : 'main') ? (
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
                    <div className="rounded-lg bg-surface-deep border border-border-default font-mono text-sm">
                      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-text-primary whitespace-pre">
                        {activeCode}
                      </pre>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Step navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" size="lg" disabled={currentStep.number === 1} onClick={() => setStepNumber((n) => Math.max(1, n - 1))}>
              <ArrowLeft size={18} aria-hidden />
              <span className="truncate">
                Step {currentStep.number - 1}:{' '}
                {currentStep.number > 1 ? steps[currentStep.number - 2].title : 'Get API Key'}
              </span>
            </Button>
            <Button variant="primary" size="lg" onClick={() => setStepNumber((n) => Math.min(steps.length, n + 1))}>
              <span className="truncate">
                Step {currentStep.number + 1}: {steps[currentStep.number]?.title || 'Complete'}
              </span>
              <ArrowRight size={18} aria-hidden />
            </Button>
          </div>
        </div>

        {/* Right rail */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full shrink-0 lg:sticky lg:top-20 lg:w-72"
        >
          <div className="space-y-6">
            {/* Progress */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-text-primary">Progress</span>
                <Badge variant="brand">
                  Step {currentStep.number} of {steps.length}
                </Badge>
              </div>
              <div className="h-2 bg-surface-inset rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-brand-primary rounded-full"
                />
              </div>
            </Card>

            {/* Checklist */}
            <Card className="p-5">
              <p className="text-sm font-semibold text-text-primary mb-4">Checklist</p>
              <div className="space-y-3">
                {checklistItems.map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        item.done ? 'bg-brand-primary border-brand-primary' : 'border-border-default'
                      }`}
                    >
                      {item.done && <Check size={12} className="text-text-inverse" aria-hidden />}
                    </div>
                    <span className={`text-sm ${item.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Helpful links */}
            <Card className="p-5">
              <p className="text-sm font-semibold text-text-primary mb-4">Helpful Links</p>
              <div className="space-y-2">
                {helpfulLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center justify-between gap-2 text-sm text-brand-primary hover:underline"
                  >
                    <span className="truncate">{link.label}</span>
                    {link.external ? (
                      <ExternalLink size={14} className="shrink-0" aria-hidden />
                    ) : (
                      <ArrowRight size={14} className="shrink-0" aria-hidden />
                    )}
                  </Link>
                ))}
              </div>
            </Card>

            {/* Time remaining */}
            <div className="flex items-center gap-2 text-text-muted">
              <Clock size={16} aria-hidden />
              <span className="text-sm">~3 min remaining</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
