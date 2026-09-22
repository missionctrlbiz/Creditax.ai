'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TermsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16">
      <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">Legal</p>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
      <p className="text-text-secondary leading-relaxed mb-6">
        Prototype notice: Creditax.ai provides general tax information for Nigeria, not licensed
        tax advice. Confirm filings with a verified professional before submitting to FIRS or
        your State IRS.
      </p>
      <Card className="p-6 mb-6">
        <h2 className="font-semibold text-text-primary mb-2">Fair use</h2>
        <ul className="text-text-secondary text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>One account per person during beta</li>
          <li>Don&apos;t upload documents you don&apos;t own</li>
          <li>Don&apos;t abuse the APIs or verification lookups</li>
        </ul>
      </Card>
      <Link href="/marketplace">
        <Button variant="primary">Find a Verified Pro →</Button>
      </Link>
    </div>
  );
}
