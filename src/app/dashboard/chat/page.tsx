'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CANNED: { match: string[]; reply: string }[] = [
  {
    match: ['vat', 'value added'],
    reply:
      'Under the Nigeria VAT Act, VAT is charged at 7.5% on most goods and services. VAT-registered businesses file monthly returns with FIRS by the 21st of the following month. Upload your invoices on the Documents page to track deductible input VAT.',
  },
  {
    match: ['paye', 'pay as you earn', 'salary'],
    reply:
      'PAYE is deducted by your employer under the Personal Income Tax Act using the graduated bands (7%–24%) plus the consolidated relief allowance (₦200,000 + 20% of gross, or 1% of gross — whichever is higher). Ask your employer for your PAYE receipt and upload it to boost your Tax Health Score.',
  },
  {
    match: ['wht', 'withholding'],
    reply:
      'Withholding Tax in Nigeria ranges from 5%–10% depending on the transaction (rent, dividends, professional fees, etc.). The payer remits it to FIRS/State IRS and issues you a WHT credit note, which you can track under Documents.',
  },
  {
    match: ['tin', 'tax identification'],
    reply:
      'Your TIN is issued by FIRS (companies) or your State IRS (individuals). You need it for filing, bank transactions and CAC registration. Verify a TIN instantly in the Pro portal under Verify.',
  },
];

const FALLBACK =
  'Great question. In this prototype the bot answers from a small demo set — try asking about VAT, PAYE, WHT or TIN. For anything deeper, a verified pro on the Marketplace can help.';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello Emeka. I'm your AI Tax Assistant (demo). Ask me about Nigerian VAT, PAYE, WHT or TIN — or upload a document and I'll reference it.",
    },
  ]);
  const [draft, setDraft] = useState('');

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const hit = CANNED.find((c) => c.match.some((m) => lower.includes(m)));
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text },
      { role: 'assistant', content: hit ? hit.reply : FALLBACK },
    ]);
    setDraft('');
  };

  return (
    <div className="p-8 md:p-10 max-w-[860px] mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">AI Tax Assistant</h1>
        <p className="text-text-secondary text-sm mt-1">
          Demo bot — answers from a small built-in set.{' '}
          <Link href="/marketplace" className="text-brand-primary font-semibold hover:underline">
            Find a pro for real advice →
          </Link>
        </p>
      </div>

      <Card className="flex-1 p-6 flex flex-col gap-4 mb-4 min-h-[320px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-primary text-text-inverse rounded-br-md'
                  : 'bg-surface-overlay border border-border-default text-text-primary rounded-bl-md'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </Card>

      <form onSubmit={send} className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Ask about VAT, PAYE, WHT, TIN…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary">
          Send →
        </Button>
      </form>
    </div>
  );
}
