'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { getSession as getUnifiedSession } from '@/lib/auth';
import type { Tier } from '@/lib/seed/demoSeed';
import { contactRevealPolicy, maskPhone, maskEmail, type RevealPolicy } from '@/ai/contact-gate';

/** Valid tiers — an unexpected session tier string resolves to free (masked). */
const TIER_SET: ReadonlySet<string> = new Set(['free', 'plus', 'professional', 'enterprise']);
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Clock,
  Users,
  FileText,
  TrendingUp,
  CalendarClock,
} from 'lucide-react';

const DEMO_TOAST = 'Demo build — contact actions are mocked';

type Service = { name: string; turnaround: string; price: string };
type Review = { name: string; rating: number; date: string; text: string };
type Highlight = { icon: typeof FileText; title: string; body: string };
type Pro = {
  id: string;
  name: string;
  verified: boolean;
  cac: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  location: string;
  memberSince: string;
  responseTime: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  about: string[];
  services: Service[];
  highlights: Highlight[];
  reviews: Review[];
};

const PROS: Record<string, Pro> = {
  'adaeze-consulting': {
    id: 'adaeze-consulting',
    name: 'Adaeze Consulting Ltd',
    verified: true,
    cac: 'RC 1487221',
    image: '/images/marketplace/pro-team-01.jpg',
    rating: 4.9,
    reviewCount: 127,
    distance: '2.3 km',
    location: 'Lagos Island, Lagos',
    memberSince: 'March 2022',
    responseTime: 'Usually replies within 2 hours',
    address: '15 Adeola Odeku Street, Victoria Island, Lagos',
    phone: '+234 801 234 5678',
    email: 'hello@adaezeconsulting.ng',
    website: 'https://adaezeconsulting.ng',
    about: [
      'Adaeze Consulting Ltd is a tax and financial advisory firm serving Nigerian SMEs and startups. The team of chartered accountants has helped hundreds of businesses navigate the complexities of Nigerian tax law, from company income tax to VAT compliance and payroll.',
      'They specialise in corporate income tax, VAT compliance, payroll processing, and tax audit support, with a working knowledge of FIRS regulations that keeps clients compliant while optimising their tax positions.',
    ],
    services: [
      { name: 'Income Tax Filing', turnaround: '3–5 days', price: '₦25,000' },
      { name: 'VAT Returns (Monthly)', turnaround: '1–2 days', price: '₦15,000' },
      { name: 'Corporate Income Tax', turnaround: '7–10 days', price: '₦45,000' },
      { name: 'Payroll Processing', turnaround: '2–3 days', price: '₦20,000/mo' },
      { name: 'Tax Audit Support', turnaround: 'As needed', price: '₦75,000' },
    ],
    highlights: [
      {
        icon: FileText,
        title: 'FIRS-Certified Team',
        body: 'Every filing is reviewed by a chartered tax professional.',
      },
      {
        icon: TrendingUp,
        title: '98% On-Time Delivery',
        body: 'Deadlines are tracked per engagement, not per inbox.',
      },
      {
        icon: Users,
        title: '127 Client Businesses',
        body: 'Trusted by SMEs across Lagos, Abuja, and Port Harcourt.',
      },
    ],
    reviews: [
      {
        name: 'Emeka J.',
        rating: 5,
        date: 'Jun 2025',
        text: 'Adaeze Consulting transformed our tax filing process. Professional, responsive, and thorough.',
      },
      {
        name: 'Chidinma O.',
        rating: 5,
        date: 'May 2025',
        text: 'They handled our VAT returns seamlessly and identified savings we did not know existed.',
      },
      {
        name: 'Tunde B.',
        rating: 4,
        date: 'Apr 2025',
        text: 'Great service overall. Quick turnaround on our CIT filing — communication could be faster during peak periods.',
      },
    ],
  },
  'lagos-tax-partners': {
    id: 'lagos-tax-partners',
    name: 'Lagos Tax Partners',
    verified: true,
    cac: 'RC 2096334',
    image: '/images/marketplace/pro-team-02.jpg',
    rating: 4.8,
    reviewCount: 89,
    distance: '5.1 km',
    location: 'Ikoyi, Lagos',
    memberSince: 'August 2021',
    responseTime: 'Usually replies within 4 hours',
    address: '42 Bourdillon Road, Ikoyi, Lagos',
    phone: '+234 802 555 0143',
    email: 'contact@lagostaxpartners.ng',
    website: 'https://lagostaxpartners.ng',
    about: [
      'Lagos Tax Partners is a mid-size practice focused on transfer pricing documentation and audit defence for growing companies operating across Nigerian states.',
      'The team pairs a former FIRS reviewer with two chartered accountants, giving clients a clear line from the numbers to the regulator.',
    ],
    services: [
      { name: 'Corporate Income Tax', turnaround: '5–7 days', price: '₦45,000' },
      { name: 'Transfer Pricing Pack', turnaround: '10–14 days', price: '₦180,000' },
      { name: 'Audit Defence', turnaround: 'Scoped', price: '₦250,000' },
      { name: 'Annual Returns Review', turnaround: '3 days', price: '₦35,000' },
    ],
    highlights: [
      {
        icon: FileText,
        title: 'Contemporaneous Documentation',
        body: 'Transfer pricing files prepared to FIRS expectations.',
      },
      {
        icon: ShieldCheck,
        title: 'Audit Track Record',
        body: 'Supported 40+ FIRS audits with no penalties upheld.',
      },
      {
        icon: Users,
        title: 'Two-State Coverage',
        body: 'Handles filings for Lagos and Oyo state IRS offices.',
      },
    ],
    reviews: [
      {
        name: 'Aisha B.',
        rating: 5,
        date: 'May 2025',
        text: 'Their transfer pricing file answered every FIRS question before it was asked.',
      },
      {
        name: 'Kelechi N.',
        rating: 4,
        date: 'Mar 2025',
        text: 'Solid audit support. Detailed work, though onboarding paperwork took a week.',
      },
    ],
  },
  'quicktax-nigeria': {
    id: 'quicktax-nigeria',
    name: 'QuickTax Nigeria',
    verified: true,
    cac: 'RC 3321900',
    image: '/images/marketplace/pro-team-03.jpg',
    rating: 4.6,
    reviewCount: 203,
    distance: '1.8 km',
    location: 'Yaba, Lagos',
    memberSince: 'January 2023',
    responseTime: 'Usually replies within 1 hour',
    address: '7 Herbert Macaulay Way, Yaba, Lagos',
    phone: '+234 803 771 9902',
    email: 'support@quicktax.ng',
    website: 'https://quicktax.ng',
    about: [
      'QuickTax Nigeria runs a high-volume filing desk for VAT, PAYE, and withholding tax — built for solo founders and small teams who need filings done quickly and cheaply.',
      'Standard packages are fixed-price with a published turnaround, so you know the cost before you upload a single document.',
    ],
    services: [
      { name: 'VAT Returns (Monthly)', turnaround: 'Same day', price: '₦8,000' },
      { name: 'PAYE Schedule', turnaround: '1 day', price: '₦10,000' },
      { name: 'WHT Remittance', turnaround: '1 day', price: '₦9,500' },
      { name: 'Filing Catch-Up (per year)', turnaround: '2–4 days', price: '₦30,000' },
    ],
    highlights: [
      {
        icon: Clock,
        title: 'Same-Day VAT Desk',
        body: 'Monthly VAT returns filed before 6pm WAT on weekdays.',
      },
      {
        icon: FileText,
        title: 'Fixed Published Prices',
        body: 'No hourly surprises — every package is priced upfront.',
      },
      {
        icon: Users,
        title: '200+ Small Businesses',
        body: 'Mostly sole traders and teams under ten people.',
      },
    ],
    reviews: [
      {
        name: 'Bisi A.',
        rating: 5,
        date: 'Jun 2025',
        text: 'Filed three months of VAT in one afternoon for less than my accountant charged for one.',
      },
      {
        name: 'Ifeanyi U.',
        rating: 4,
        date: 'Apr 2025',
        text: 'Fast and affordable. Support replies quickly, but I wish reports were more detailed.',
      },
    ],
  },
  'emeka-associates': {
    id: 'emeka-associates',
    name: 'Emeka & Associates',
    verified: true,
    cac: 'RC 1170455',
    image: '/images/marketplace/pro-team-04.jpg',
    rating: 4.7,
    reviewCount: 56,
    distance: '8.4 km',
    location: 'Lekki, Lagos',
    memberSince: 'October 2020',
    responseTime: 'Usually replies within 6 hours',
    address: '18 Admiralty Way, Lekki Phase 1, Lagos',
    phone: '+234 805 220 4471',
    email: 'hello@emekaassociates.ng',
    website: 'https://emekaassociates.ng',
    about: [
      'Emeka & Associates is a two-partner practice handling company income tax and personal income tax for owner-managed businesses and consultants.',
      'Clients tend to stay for years: the practice keeps filing histories, reconciliations, and tax clearance certificates in one place.',
    ],
    services: [
      { name: 'Corporate Income Tax', turnaround: '7–10 days', price: '₦45,000' },
      { name: 'Personal Income Tax (PITA)', turnaround: '3–5 days', price: '₦25,000' },
      { name: 'TCC Renewal', turnaround: '5 days', price: '₦40,000' },
      { name: 'Books Catch-Up', turnaround: 'Scoped', price: '₦60,000' },
    ],
    highlights: [
      {
        icon: FileText,
        title: 'TCC Specialists',
        body: 'Tax clearance certificates renewed without a chase.',
      },
      {
        icon: CalendarClock,
        title: 'Filing Calendar Managed',
        body: 'FIRS and state IRS deadlines tracked for every client.',
      },
      {
        icon: Users,
        title: 'Owner-Managed Focus',
        body: 'Built for businesses with one or two decision-makers.',
      },
    ],
    reviews: [
      {
        name: 'Ngozi E.',
        rating: 5,
        date: 'Feb 2025',
        text: 'They hold my TCC current every year — I have not thought about it since 2022.',
      },
      {
        name: 'Segun O.',
        rating: 4,
        date: 'Jan 2025',
        text: 'Careful work on my PITA filing. Slow in December when everyone files at once.',
      },
    ],
  },
  'abuja-tax-clinic': {
    id: 'abuja-tax-clinic',
    name: 'Abuja Tax Clinic',
    verified: true,
    cac: 'RC 4155882',
    image: '/images/marketplace/pro-team-05.jpg',
    rating: 4.5,
    reviewCount: 41,
    distance: '12.6 km',
    location: 'Garki, Abuja',
    memberSince: 'June 2023',
    responseTime: 'Usually replies within 8 hours',
    address: '23 Aminu Kano Crescent, Wuse II, Abuja',
    phone: '+234 806 100 8823',
    email: 'hello@abujataxclinic.ng',
    website: 'https://abujataxclinic.ng',
    about: [
      'Abuja Tax Clinic serves NGOs, contractors, and government suppliers in the FCT, where documentation for engagements and contract audits matters as much as the returns themselves.',
      'The practice runs structured workshops for in-house finance teams alongside its filing work.',
    ],
    services: [
      { name: 'PAYE Schedule', turnaround: '1–2 days', price: '₦12,000' },
      { name: 'WHT Remittance', turnaround: '2 days', price: '₦14,000' },
      { name: 'Contractor Tax Review', turnaround: '5 days', price: '₦55,000' },
      { name: 'Finance Team Workshop', turnaround: 'Half day', price: '₦150,000' },
    ],
    highlights: [
      {
        icon: FileText,
        title: 'Contractor Documentation',
        body: 'Returns and schedules audit-ready for contract reviews.',
      },
      {
        icon: Users,
        title: 'NGO & FCT Experience',
        body: 'Works with FCT-IRS filing rules and exemption reliefs.',
      },
      {
        icon: TrendingUp,
        title: 'Team Training',
        body: 'In-house finance staff trained on PAYE and WHT basics.',
      },
    ],
    reviews: [
      {
        name: 'Halima Y.',
        rating: 5,
        date: 'Mar 2025',
        text: 'They trained our finance team and cleaned up two years of withholding tax records.',
      },
      {
        name: 'David I.',
        rating: 4,
        date: 'Dec 2024',
        text: 'Knowledgeable on FCT filings. Response is same-day unless they are in workshop season.',
      },
    ],
  },
  'island-advisory': {
    id: 'island-advisory',
    name: 'Island Advisory Group',
    verified: false,
    cac: 'RC 5288110 (pending check)',
    image: '/images/marketplace/office-01.jpg',
    rating: 4.3,
    reviewCount: 18,
    distance: '3.4 km',
    location: 'Victoria Island, Lagos',
    memberSince: 'April 2024',
    responseTime: 'Usually replies within 24 hours',
    address: '9 Kofo Abayomi Street, Victoria Island, Lagos',
    phone: '+234 807 664 2209',
    email: 'team@islandadvisory.ng',
    website: 'https://islandadvisory.ng',
    about: [
      'Island Advisory Group is a newer practice handling VAT compliance and bookkeeping for retail and hospitality businesses on the Island.',
      'Verification is still in progress with the admin team — the CAC certificate upload is under review.',
    ],
    services: [
      { name: 'VAT Returns (Monthly)', turnaround: '2 days', price: '₦6,500' },
      { name: 'Bookkeeping', turnaround: 'Monthly', price: '₦45,000/mo' },
      { name: 'Records Clean-Up', turnaround: 'Scoped', price: '₦50,000' },
    ],
    highlights: [
      {
        icon: FileText,
        title: 'Retail & Hospitality',
        body: 'Daily sales reconciliations and VAT schedules.',
      },
      {
        icon: Clock,
        title: 'Verification Pending',
        body: 'CAC certificate is with the Creditax review queue.',
      },
      {
        icon: Users,
        title: 'Growing Client Base',
        body: 'Eighteen reviewed engagements since April 2024.',
      },
    ],
    reviews: [
      {
        name: 'Amaka T.',
        rating: 4,
        date: 'May 2025',
        text: 'Good bookkeeping support for our restaurant group. Still waiting on their verified badge.',
      },
    ],
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

function ContactIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-11 h-11 rounded-btn border border-border-strong bg-surface-inset text-text-secondary hover:text-brand-action hover:border-border-brand flex items-center justify-center transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  const dims = size === 'sm' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${dims} ${i <= Math.round(rating) ? 'text-warning fill-current' : 'text-text-disabled'}`}
        />
      ))}
    </span>
  );
}

export default function ProProfilePage() {
  const params = useParams();
  const rawId = params?.proId;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? '');
  const pro = PROS[id];

  // P5 F-14b — contact gating (Marketplace contact reveal, pricing-and-access §2).
  // P7/P8: read the unified session after mount (PB with mock fallback) so the
  // reveal uses the viewer's REAL tier, never a role→tier heuristic.
  const [viewer, setViewer] = useState<{ loggedIn: boolean; tier: Tier }>({
    loggedIn: false,
    tier: 'free',
  });
  useEffect(() => {
    let active = true;
    getUnifiedSession().then((s) => {
      if (!active) return;
      const tier = (TIER_SET.has(s.tier) ? s.tier : 'free') as Tier;
      setViewer({ loggedIn: true, tier });
    });
    return () => {
      active = false;
    };
  }, []);

  const policy: RevealPolicy = contactRevealPolicy({ loggedIn: viewer.loggedIn, tier: viewer.tier });
  const shownPhone = policy.revealed ? pro.phone : maskPhone(pro.phone);
  const shownEmail = policy.revealed ? pro.email : maskEmail(pro.email);

  const showDemoToast = () => {
    if (!policy.revealed) {
      toast(`Contact is masked — ${policy.hint}`, {
        description: 'Sign in at a paid tier to reveal phone, email and WhatsApp.',
      });
      return;
    }
    toast(DEMO_TOAST, {
      description: 'Real contact details unlock once the marketplace backend ships.',
    });
  };

  if (!pro) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-base">
        <Header />
        <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-10 py-20 text-center">
          <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
            Marketplace
          </p>
          <h1 className="mb-3">This profile is not in the demo set</h1>
          <p className="text-text-secondary max-w-[520px] mx-auto">
            The demo build ships six verified professionals. Browse the marketplace to find
            one of them.
          </p>
          <Link href="/marketplace" className="inline-block mt-8">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const similar = Object.values(PROS).filter((p) => p.id !== pro.id).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-10 pt-8 pb-16">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        {/* ── Hero ── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mt-5"
        >
          <motion.div variants={fadeInUp}>
            <Card className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pro.image}
                  alt={`${pro.name} team photo`}
                  width={128}
                  height={128}
                  className="w-28 h-28 lg:w-32 lg:h-32 rounded-card object-cover border border-border-strong shrink-0"
                />

                <div className="flex-1 min-w-0">
                  {pro.verified ? (
                    <Badge variant="success" className="mb-3">
                      <ShieldCheck className="w-3 h-3" />
                      Creditax Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="mb-3">
                      Verification Pending
                    </Badge>
                  )}
                  <h1 className="mb-2">{pro.name}</h1>
                  <p className="font-mono text-[12px] text-text-muted">
                    CAC {pro.cac}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <StarRating rating={pro.rating} />
                      <span className="font-mono tabular-nums text-text-primary">
                        {pro.rating.toFixed(1)}
                      </span>
                      <span className="text-text-muted">({pro.reviewCount} reviews)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-action" />
                      {pro.location} · {pro.distance}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="w-4 h-4 text-brand-action" />
                      Member since {pro.memberSince}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-action" />
                      {pro.responseTime}
                    </span>
                  </div>
                </div>

                {/* Contact actions — F-14b gate: masked until logged-in at a paid tier */}
                <div className="lg:w-[260px] shrink-0 lg:text-right">
                  <div className="flex lg:justify-end items-center gap-2.5">
                    <ContactIconButton
                      label={policy.revealed ? `Call ${pro.name}` : `Call ${pro.name} (masked)`}
                      onClick={showDemoToast}
                    >
                      <Phone className="w-4 h-4" />
                    </ContactIconButton>
                    <ContactIconButton
                      label={policy.revealed ? `Email ${pro.name}` : `Email ${pro.name} (masked)`}
                      onClick={showDemoToast}
                    >
                      <Mail className="w-4 h-4" />
                    </ContactIconButton>
                    <ContactIconButton
                      label={policy.revealed ? `WhatsApp ${pro.name}` : `WhatsApp ${pro.name} (masked)`}
                      onClick={showDemoToast}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </ContactIconButton>
                  </div>
                  <button
                    type="button"
                    onClick={showDemoToast}
                    className="mt-4 h-11 w-full rounded-btn bg-brand-action text-text-inverse font-semibold shadow-btn-action hover:brightness-105 active:brightness-95 transition-all cursor-pointer"
                  >
                    Request Consultation
                  </button>
                  <p className="mt-2 text-[11px] text-text-muted">
                    {policy.revealed ? (
                      <>Contact revealed · {policy.hint}</>
                    ) : (
                      <>
                        <span className="font-medium text-text-primary">{policy.hint}</span>
                        {' — '}demo build, actions are mocked.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.section>

        {/* ── Body ── */}
        <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
          {/* Main column */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* About */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <h2 className="mb-3">About</h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-text-secondary">
                  {pro.about.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Services & pricing */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                  <div>
                    <h2 className="mb-1">Services & Pricing</h2>
                    <p className="text-[13px] text-text-muted">
                      Starting prices in Naira. Final quotes depend on scope.
                    </p>
                  </div>
                  <Badge variant="brand">All prices in ₦</Badge>
                </div>
                <div className="overflow-x-auto rounded-card border border-border-subtle">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-surface-inset text-[11px] uppercase tracking-wider text-text-muted font-mono">
                        <th scope="col" className="p-3.5 pl-4 font-semibold">
                          Service
                        </th>
                        <th scope="col" className="p-3.5 font-semibold">
                          Turnaround
                        </th>
                        <th scope="col" className="p-3.5 pr-4 font-semibold text-right">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {pro.services.map((service) => (
                        <tr key={service.name} className="hover:bg-surface-inset/60 transition-colors">
                          <td className="p-3.5 pl-4 font-medium text-text-primary">
                            {service.name}
                          </td>
                          <td className="p-3.5 text-text-secondary">{service.turnaround}</td>
                          <td className="p-3.5 pr-4 text-right font-mono font-semibold text-brand-action tabular-nums whitespace-nowrap">
                            {service.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h2 className="mb-0">Reviews</h2>
                  <span className="inline-flex items-center gap-2 text-[13px] text-text-muted">
                    <StarRating rating={pro.rating} />
                    <span className="font-mono tabular-nums">
                      {pro.rating.toFixed(1)} average from {pro.reviewCount} reviews
                    </span>
                  </span>
                </div>
                <div className="space-y-4">
                  {pro.reviews.map((review, index) => (
                    <div
                      key={review.name}
                      className="rounded-card border border-border-subtle bg-surface-inset p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2.5">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/images/avatars/avatar-${String((index % 10) + 1).padStart(2, '0')}.png`}
                            alt=""
                            width={40}
                            height={40}
                            loading="lazy"
                            className="w-10 h-10 rounded-full object-cover border border-border-default"
                          />
                          <div>
                            <p className="text-[13px] font-semibold text-text-primary">
                              {review.name}
                            </p>
                            <p className="text-[11px] text-text-muted">{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="xs" />
                      </div>
                      <p className="text-[14px] leading-relaxed text-text-secondary">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-text-muted">
                  Demo build — reviews are illustrative sample data.
                </p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Contact details */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <h2 className="mb-4">Contact</h2>
                <dl className="space-y-3 text-[13px]">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-brand-action mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-text-muted text-[11px] uppercase tracking-wider">
                        Phone
                      </dt>
                      <dd className="font-mono text-text-primary">{shownPhone}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-brand-action mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-text-muted text-[11px] uppercase tracking-wider">
                        Email
                      </dt>
                      <dd className="font-mono text-text-primary break-all">{shownEmail}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-brand-action mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-text-muted text-[11px] uppercase tracking-wider">
                        Website
                      </dt>
                      <dd>
                        <a
                          href={pro.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-brand-action hover:underline break-all"
                        >
                          {pro.website.replace('https://', '')}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-action mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-text-muted text-[11px] uppercase tracking-wider">
                        Office
                      </dt>
                      <dd className="text-text-primary">{pro.address}</dd>
                    </div>
                  </div>
                </dl>
              </Card>
            </motion.div>

            {/* Location — static image, no map requests */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <h2 className="mb-4">Location</h2>
                <div className="relative h-40 rounded-card overflow-hidden border border-border-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/marketplace/map-lagos.png"
                    alt="Static map showing the professional's area in Lagos"
                    width={1280}
                    height={716}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-pill bg-surface-overlay/90 border border-border-strong px-2.5 py-1 text-[11px] text-text-secondary backdrop-blur-sm">
                    <MapPin className="w-3 h-3 text-brand-action" />
                    {pro.distance} away
                  </span>
                </div>
                <p className="mt-3 text-[12px] text-text-muted">
                  Static preview — live map and directions arrive with the full map build.
                </p>
              </Card>
            </motion.div>

            {/* Highlights */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6 bg-surface-deep">
                <h2 className="mb-4">Why {pro.name}?</h2>
                <div className="space-y-4">
                  {pro.highlights.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-action-bg flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-brand-action" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary">
                          {item.title}
                        </p>
                        <p className="text-[12px] text-text-muted">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Similar pros ── */}
        <motion.section
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="mb-1">Similar professionals</h2>
              <p className="text-[13px] text-text-muted">
                Other verified pros on the Creditax marketplace.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="text-[13px] font-semibold text-brand-action hover:underline shrink-0"
            >
              View all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similar.map((other) => (
              <motion.div key={other.id} variants={fadeInUp}>
                <Card className="h-full p-5 hover:border-border-brand transition-colors">
                  <Link href={`/marketplace/${other.id}`} className="group block">
                    <div className="flex items-center gap-3.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={other.image}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        className="w-14 h-14 rounded-full object-cover border border-border-strong"
                      />
                      <div className="min-w-0">
                        <h3 className="truncate group-hover:text-brand-action transition-colors">
                          {other.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-[12px] text-text-muted">
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-warning fill-current" />
                            <span className="font-mono tabular-nums">
                              {other.rating.toFixed(1)}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="font-mono tabular-nums">{other.distance}</span>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {other.services.slice(0, 3).map((service) => (
                        <span
                          key={service.name}
                          className="px-2 py-0.5 rounded-badge border border-border-subtle bg-surface-inset text-[11px] font-medium text-text-secondary"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3.5 font-mono text-[13px] text-brand-action tabular-nums">
                      From {other.services[0].price}
                    </p>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
