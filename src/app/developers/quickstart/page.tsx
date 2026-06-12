'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

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

type Language = 'bash' | 'javascript' | 'python' | 'go';

export default function QuickstartPage() {
  const [activeLanguage, setActiveLanguage] = useState<Language>('javascript');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const currentStep = steps.find((s) => s.current) || steps[1];
  const progressPercent = (currentStep.number / steps.length) * 100;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Quickstart</h1>
          <p className="text-text-secondary text-lg">
            Make your first Creditax.ai API call in under 5 minutes.
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2 mb-8"
            >
              {(['bash', 'javascript', 'python', 'go'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLanguage(lang)}
                  className={`px-4 py-2.5 rounded-btn text-sm font-semibold transition-all ${
                    activeLanguage === lang
                      ? 'bg-brand-primary text-text-inverse shadow-btn-brand'
                      : 'bg-surface-overlay text-text-secondary border border-border-default hover:border-border-strong hover:text-text-primary'
                  }`}
                >
                  {lang === 'bash' && '$ '}{lang === 'javascript' && 'JS '}
                  {lang === 'bash' && 'cURL'}
                  {lang === 'javascript' && 'Node.js'}
                  {lang === 'python' && '🐍 Python'}
                  {lang === 'go' && 'Go'}
                </button>
              ))}
            </motion.div>

            {/* Step Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-text-inverse">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : step.current ? (
                      <div className="w-7 h-7 rounded-full bg-warning-bg border-2 border-warning flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-surface-inset border-2 border-border-default flex items-center justify-center">
                        <span className="text-xs font-bold text-text-muted">{step.number}</span>
                      </div>
                    )}
                    <span className={`text-sm font-medium hidden sm:block ${
                      step.current ? 'text-text-primary' : step.completed ? 'text-text-muted line-through' : 'text-text-muted'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-3 ${
                      step.completed ? 'bg-brand-primary' : 'bg-border-default'
                    }`} />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Active Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.number}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 mb-6 relative overflow-hidden">
                  {/* Background number */}
                  <span className="absolute top-4 right-6 text-[80px] font-bold text-brand-primary/10 select-none">
                    {String(currentStep.number).padStart(2, '0')}
                  </span>

                  <h2 className="text-xl font-bold text-text-primary mb-2">
                    {currentStep.title}
                  </h2>
                  <p className="text-text-secondary mb-6">
                    {currentStep.description}
                  </p>

                  {/* Code Blocks */}
                  <div className="space-y-4 relative z-10">
                    {activeLanguage === 'bash' ? (
                      <>
                        <div className="relative">
                          <div className="absolute top-3 right-3 z-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(codeBlocks.bash.install, 'install')}
                              className="text-text-muted hover:text-text-primary"
                            >
                              {copiedBlock === 'install' ? (
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
                          <div className="p-4 rounded-lg bg-surface-deep border border-border-default font-mono text-sm">
                            <pre className="text-text-primary whitespace-pre-wrap">{codeBlocks.bash.install}</pre>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="absolute top-3 right-3 z-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(codeBlocks[activeLanguage], 'main')}
                              className="text-text-muted hover:text-text-primary"
                            >
                              {copiedBlock === 'main' ? (
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
                          <div className="p-4 rounded-lg bg-surface-deep border border-border-default font-mono text-sm">
                            <pre className="text-text-primary whitespace-pre-wrap">{codeBlocks[activeLanguage]}</pre>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="lg" disabled={currentStep.number === 1}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Step {currentStep.number - 1}: {currentStep.number > 1 ? steps[currentStep.number - 2].title : 'Get API Key'}
              </Button>
              <Button variant="primary" size="lg">
                Step {currentStep.number + 1}: {steps[currentStep.number]?.title || 'Complete'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-72 flex-shrink-0 hidden lg:block"
          >
            <div className="sticky top-24 space-y-6">
              {/* Progress Card */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-text-primary">Progress</span>
                  <Badge variant="brand">Step {currentStep.number} of {steps.length}</Badge>
                </div>
                <div className="h-2 bg-surface-inset rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-brand-primary rounded-full"
                  />
                </div>
              </Card>

              {/* Checklist Card */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Checklist</h3>
                <div className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.done
                          ? 'bg-brand-primary border-brand-primary'
                          : 'border-border-default'
                      }`}>
                        {item.done && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-text-inverse">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Helpful Links */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Helpful Links</h3>
                <div className="space-y-2">
                  <a href="/developers/reference" className="flex items-center justify-between text-sm text-brand-primary hover:underline">
                    API Reference
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a href="https://github.com/creditax-ai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-brand-primary hover:underline">
                    SDK on GitHub
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                  <a href="#" className="flex items-center justify-between text-sm text-brand-primary hover:underline">
                    Join Discord Community
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                  <a href="#" className="flex items-center justify-between text-sm text-brand-primary hover:underline">
                    Get Support
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </Card>

              {/* Time Remaining */}
              <div className="flex items-center gap-2 text-text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="text-sm">~3 min remaining</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}