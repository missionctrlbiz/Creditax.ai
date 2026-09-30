import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Database,
  FileText,
  EyeOff,
  ShieldCheck,
  Trash2,
  Lock,
  Mail,
  Users,
} from 'lucide-react';

const LAST_UPDATED = 'September 22, 2026';

const sections = [
  {
    id: 'collect',
    icon: Database,
    title: '1. What we collect',
    paragraphs: [
      'Creditax.ai collects the minimum needed to answer your tax questions, calculate liabilities, and score your credit position. That means:',
    ],
    bullets: [
      'Your account email and the portal role you signed up with (personal, professional, or admin).',
      'The documents you upload — invoices, payslips, statements — and the totals extracted from them.',
      'Support messages you send us and anonymised usage data we use to improve the product.',
      'Your consent when you connect a bank account through a read-only open-banking provider such as Mono.',
    ],
    after:
      'We never sell your data, and we do not buy third-party marketing lists to enrich it.',
  },
  {
    id: 'use',
    icon: FileText,
    title: '2. How we use it',
    paragraphs: [
      'Uploaded documents are parsed and chunked so the model can extract totals and answer questions grounded in your own records. Before any text is embedded for retrieval, personally identifiable details are redacted.',
      'Usage data is aggregated — never tied back to you in a report — and is used to fix failures, tune quotas, and measure which features people actually finish.',
      'You control connected accounts. Revoking a bank connection from your dashboard stops further reads and removes the cached statements on the next sync.',
    ],
  },
  {
    id: 'legal',
    icon: EyeOff,
    title: '3. The legal bases we rely on',
    paragraphs: [
      'We process your data because you asked us to (performing the contract), because you consented (for example, a read-only bank connection), or because we have a legitimate interest in keeping the Service secure and reliable. Where Nigerian data-protection law requires consent, we ask for it explicitly and you can withdraw it at any time.',
      'The prototype build runs in a demo environment. Production data-residency and DPIA commitments will be documented before public launch.',
    ],
  },
  {
    id: 'security',
    icon: Lock,
    title: '4. Security',
    paragraphs: [
      'Documents and extracted data are encrypted at rest, and all traffic between your browser and the Service is encrypted in transit. Access to production data is limited to the small number of people who need it to run the platform, and every privileged action is audit-logged.',
      'We retain documents only as long as your account is active or as long as law requires. Delete a document and its extracted totals are purged from the working store on the next cleanup cycle.',
    ],
  },
  {
    id: 'rights',
    icon: Trash2,
    title: '5. Your data rights',
    paragraphs: [
      'You are entitled to ask what we hold about you, to correct it, to get a portable copy, to object to processing, and to have it deleted. Requests are free and we answer within 30 days.',
    ],
    bullets: [
      'Access — see the account, document, and score records we hold for you.',
      'Correction — fix a wrong name, email, or extracted total.',
      'Portability — download your data in a machine-readable format.',
      'Deletion — ask us to erase your account and its documents; we keep only what the law requires.',
      'Objection — opt out of any processing you have not been asked to consent to.',
    ],
    after:
      'To exercise a right, email us from your account address so we can verify the request.',
  },
  {
    id: 'sharing',
    icon: Users,
    title: '6. Who we share data with',
    paragraphs: [
      'Only the processors we need to run the Service: our hosting and database provider, the embedding and model providers that answer your questions, and the open-banking provider you connected. Each processor may use your data only to deliver its service to us, not for its own purposes.',
      'We disclose data to a regulator or authority only when legally compelled, and we will tell you unless we are prohibited from doing so.',
    ],
  },
  {
    id: 'children',
    icon: ShieldCheck,
    title: '7. Children and sensitive data',
    paragraphs: [
      'The Service is not intended for anyone under 18. Do not upload government identity numbers, biometric data, or medical records — we only need the financial figures required to compute your tax position.',
    ],
  },
  {
    id: 'changes',
    icon: FileText,
    title: '8. Changes to this policy',
    paragraphs: [
      'As the product moves out of beta, we may update this policy. When a change affects how your data is handled, we will post the new version here, update the date above, and notify account holders before it takes effect.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1 w-full max-w-[760px] mx-auto px-6 md:px-10 pt-24 pb-16">
        <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
          Legal
        </p>
        <h1 className="mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-[13px] text-text-muted">Last updated: {LAST_UPDATED}</p>

        <Card className="mt-8 p-6 border-brand-primary-border bg-brand-primary-bg">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-action shrink-0 mt-0.5" />
            <div>
              <h2 className="mb-1.5">Prototype notice</h2>
              <p className="text-[14px] leading-relaxed text-text-secondary">
                Creditax.ai is in beta. We collect your email to sign you in, your uploaded
                documents to compute your tax position, and anonymised usage to improve the
                product. We never sell your data.
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
                {section.after && (
                  <p className="text-[14px] text-text-muted">{section.after}</p>
                )}
              </div>
            </section>
          ))}
        </div>

        <Card className="mt-12 p-6 bg-surface-deep">
          <h2 className="mb-2">Contact our privacy team</h2>
          <p className="text-[14px] leading-relaxed text-text-secondary mb-5">
            For data requests or privacy questions, email us from your account address. If you
            are not satisfied with our answer, you may escalate to the Nigerian data-protection
            regulator.
          </p>
          <a
            href="mailto:privacy@creditax.ai"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-action hover:underline"
          >
            <Mail className="w-4 h-4" />
            privacy@creditax.ai
          </a>
        </Card>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/signup">
            <Button variant="primary">Create Account</Button>
          </Link>
          <Link
            href="/terms"
            className="text-[14px] font-semibold text-brand-action hover:underline"
          >
            Read the Terms of Service
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
