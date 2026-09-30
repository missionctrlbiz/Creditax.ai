import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, FileText, Users, AlertTriangle, Mail } from 'lucide-react';

const LAST_UPDATED = 'September 22, 2026';

const sections = [
  {
    id: 'scope',
    icon: FileText,
    title: '1. What this document covers',
    paragraphs: [
      'These Terms of Service govern your use of the Creditax.ai website, dashboard, API, and marketplace (the “Service”). By creating an account or using the API, you agree to them. If you use the Service on behalf of a business, that business accepts these terms.',
      'Creditax.ai is a prototype build. Features, quotas, and marketplace listings shown here are illustrative and may change without notice while the product is in beta.',
    ],
  },
  {
    id: 'advice',
    icon: AlertTriangle,
    title: '2. Not licensed tax advice',
    paragraphs: [
      'Creditax.ai provides general tax information for Nigeria. It is not licensed tax, legal, or accounting advice, and no output from the Service — a calculation, an answer from the knowledge base, or a credit score — should be treated as a substitute for a qualified professional.',
      'Always confirm filings, thresholds, and remittance codes with a verified professional before submitting to FIRS or your State Internal Revenue Service. Where the Service shows a source or section reference, check that source directly before relying on it.',
    ],
  },
  {
    id: 'account',
    icon: Users,
    title: '3. Your account and fair use',
    paragraphs: [
      'You are responsible for activity under your account. Keep your sign-in details secure and tell us promptly if you believe access has been lost.',
      'To keep the free tier sustainable, we ask that you use it fairly:',
    ],
    bullets: [
      'One account per person during beta — shared accounts break quota accounting.',
      'Do not upload documents you do not own or have permission to process.',
      'Do not abuse the APIs, rate limits, or verification lookups, or resell access without an agreement.',
      'Do not use the Service to file misleading returns or to misrepresent any business to a lender.',
    ],
  },
  {
    id: 'marketplace',
    icon: ShieldCheck,
    title: '4. Marketplace professionals',
    paragraphs: [
      'Professionals listed in the marketplace are independent practitioners. Creditax.ai verifies their CAC registration and reviews their certificate upload, but does not employ them, set their fees, or guarantee the outcome of their work.',
      'Contact details, prices, and reviews shown in the demo build are sample data. When the marketplace is live, verify the professional’s badges before engaging them, and keep your own record of any engagement.',
    ],
  },
  {
    id: 'plans',
    icon: FileText,
    title: '5. Plans, quotas, and payments',
    paragraphs: [
      'Plan names, quotas, and prices are published on the pricing page in Naira (₦). Free-tier limits are enforced in code; paid quotas reset on your billing anniversary.',
      'Where a plan charges per lookup (for example BVN verifications), the charge applies only when the provider lookup succeeds. You can upgrade, downgrade, or cancel at any time from your dashboard, with changes taking effect at the end of the current period.',
    ],
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    title: '6. Liability',
    paragraphs: [
      'The Service is provided “as is”. To the maximum extent permitted by Nigerian law, Creditax.ai is not liable for indirect or consequential loss, lost profits, penalties assessed by a tax authority, or credit decisions made by a lender using information produced by the Service.',
      'Nothing in these terms limits liability for fraud, wilful misconduct, or any liability that cannot be limited by law.',
    ],
  },
  {
    id: 'changes',
    icon: FileText,
    title: '7. Changes to these terms',
    paragraphs: [
      'We may update these terms as the product moves out of beta. When a change is material, we will post the updated version here and update the “last updated” date. Continuing to use the Service after that date means you accept the revised terms.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1 w-full max-w-[760px] mx-auto px-6 md:px-10 pt-24 pb-16">
        <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
          Legal
        </p>
        <h1 className="mb-3 tracking-tight">Terms of Service</h1>
        <p className="text-[13px] text-text-muted">Last updated: {LAST_UPDATED}</p>

        <Card className="mt-8 p-6 border-warning-border bg-warning-bg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-text shrink-0 mt-0.5" />
            <div>
              <h2 className="mb-1.5">Prototype notice</h2>
              <p className="text-[14px] leading-relaxed text-text-secondary">
                Creditax.ai provides general tax information for Nigeria, not licensed tax
                advice. Confirm filings with a verified professional before submitting to FIRS
                or your State IRS.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.id}>
              <div className="flex items-start gap-3 mb-4">
                <span className="w-9 h-9 rounded-full bg-brand-action-bg flex items-center justify-center shrink-0">
                  <section.icon className="w-4 h-4 text-brand-action" />
                </span>
                <h2 className="pt-1.5">{section.title}</h2>
              </div>
              <div className="space-y-4 text-[15px] leading-[1.8] text-text-secondary">
                {section.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 pl-1">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand-action shrink-0"
                          aria-hidden
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <Card className="mt-12 p-6 bg-surface-deep">
          <h2 className="mb-2">Questions about these terms</h2>
          <p className="text-[14px] leading-relaxed text-text-secondary mb-5">
            Email us and we will answer in plain English. If you need to report abuse of the
            Service, include the account or endpoint involved.
          </p>
          <a
            href="mailto:legal@creditax.ai"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-action hover:underline"
          >
            <Mail className="w-4 h-4" />
            legal@creditax.ai
          </a>
        </Card>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/marketplace">
            <Button variant="primary">Find a Verified Pro</Button>
          </Link>
          <Link
            href="/privacy"
            className="text-[14px] font-semibold text-brand-action hover:underline"
          >
            Read the Privacy Policy
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
