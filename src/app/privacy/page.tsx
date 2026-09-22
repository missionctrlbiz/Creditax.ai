'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16">
      <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">Legal</p>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
      <p className="text-text-secondary leading-relaxed mb-6">
        Prototype notice: Creditax.ai is in beta. We collect your email to sign you in,
        your uploaded documents to compute your tax position, and anonymised usage to improve
        the product. We never sell your data.
      </p>
      <Card className="p-6 mb-6">
        <h2 className="font-semibold text-text-primary mb-2">What we store</h2>
        <ul className="text-text-secondary text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Account email and portal role</li>
          <li>Documents you upload and their extracted totals</li>
          <li>Support messages you send us</li>
        </ul>
      </Card>
      <Link href="/signup">
        <Button variant="primary">Create Account →</Button>
      </Link>
    </div>
  );
}
