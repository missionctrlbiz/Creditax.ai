'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import {
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Link2,
  ExternalLink,
  Send,
  MapPin,
} from 'lucide-react';

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

const stats = [
  { value: '9', label: 'tax types covered' },
  { value: '₦2.1B+', label: 'in taxes calculated' },
  { value: '94%', label: 'client compliance rate' },
];

const storySections = [
  {
    id: 'why',
    eyebrow: 'The problem',
    title: 'Why we built this',
    body: [
      'Nigeria has 40 million SMEs. Most file taxes through informal channels, paper-based processes, and disconnected systems. When they need credit, banks have no data to evaluate them.',
      'We built Creditax.ai to close that gap — to make tax compliance effortless and turn that compliance into financial identity. Your tax record is your credit story.',
      'We combine AI, open banking, and FIRS-adjacent data so every Nigerian business gets the financial visibility it deserves. Not just in Lagos. Everywhere.',
    ],
    image: '/images/sections/section-consumer.jpg',
    alt: 'Nigerian professional reviewing tax documents at a bright desk',
    points: [
      { icon: MapPin, label: 'Lagos', value: '1,247 users' },
      { icon: MapPin, label: 'Abuja', value: '423 users' },
      { icon: MapPin, label: 'Port Harcourt', value: '387 users' },
    ],
  },
  {
    id: 'credit',
    eyebrow: 'The insight',
    title: 'Compliance is the missing credit signal',
    body: [
      'Traditional scoring looks at balances and BVN loan history. It misses the 60% of the economy that trades in cash and across multiple accounts.',
      'A three-year filing streak predicts repayment better than a six-month balance spike — and compliance is the one factor a business can improve in thirty days.',
      'That is why Creditax Score = f(income, stability, savings rate, debt burden, compliance).',
    ],
    image: '/images/sections/section-credit-growth.jpg',
    alt: 'Upward credit growth chart with green accents',
    points: [
      { icon: TrendingUp, label: 'Score', value: 'Refreshed daily' },
      { icon: Shield, label: 'Grounding', value: 'NTA, NTAA, FIRS' },
      { icon: Zap, label: 'Response', value: 'Median 280ms' },
    ],
  },
];

const teamMembers = [
  {
    name: 'Chukwuemeka Obi',
    title: 'CEO & Co-Founder',
    bio: 'Former FIRS analyst with 10+ years in tax policy. Built Creditax to bridge the compliance gap for Nigerian SMEs.',
  },
  {
    name: 'Adaeze Nwosu',
    title: 'CTO & Co-Founder',
    bio: 'Ex-Stripe engineer. Passionate about using AI to solve Africa’s financial infrastructure challenges.',
  },
  {
    name: 'Tunde Bakare',
    title: 'Head of Tax Intelligence',
    bio: 'Chartered Tax Accountant with deep expertise in Nigerian tax law and FIRS regulations.',
  },
  {
    name: 'Chidinma Eze',
    title: 'Head of Product',
    bio: 'Product leader with experience at Flutterwave. Focused on making complex financial tools accessible.',
  },
];

const values = [
  {
    icon: Shield,
    title: 'Trust by Default',
    description:
      'We build transparency into every product decision. Your financial data is yours, always.',
  },
  {
    icon: Zap,
    title: 'Speed as Respect',
    description: 'We value your time. Every interaction should be fast, clear, and frictionless.',
  },
  {
    icon: Globe,
    title: 'Built for Nigeria',
    description:
      'Designed from the ground up for Nigerian businesses, not adapted from foreign markets.',
  },
  {
    icon: TrendingUp,
    title: 'Radical Transparency',
    description:
      'No hidden fees, no surprises. We explain exactly how taxes are calculated and why.',
  },
];

export default function AboutPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="px-6 md:px-10 pt-24 pb-14">
          <motion.div
            className="max-w-[1440px] mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="brand">Our mission</Badge>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="mt-6 max-w-[880px] tracking-tight">
              We&apos;re building the financial infrastructure that Nigeria&apos;s tax and
              credit system deserves.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 text-[17px] leading-relaxed text-text-secondary max-w-[720px]"
            >
              Creditax.ai was born from a simple frustration: millions of Nigerians are
              financially capable but invisible to lenders because their economic activity
              lives outside the formal credit system. We&apos;re changing that.
            </motion.p>

            <motion.dl
              variants={fadeInUp}
              className="mt-10 flex flex-wrap gap-8 md:gap-16"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <div className="font-mono text-brand-action font-bold tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                  </dd>
                </div>
              ))}
            </motion.dl>
            <p className="mt-4 text-[11px] text-text-muted">
              Demo build — figures above are illustrative.
            </p>
          </motion.div>
        </section>

        {/* ── Story sections ── */}
        {storySections.map((section, i) => (
          <section
            key={section.id}
            className={`px-6 md:px-10 py-14 ${i % 2 === 1 ? 'bg-surface-deep' : ''}`}
          >
            <motion.div
              className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className={i % 2 === 1 ? 'lg:order-2' : undefined}
              >
                <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
                  {section.eyebrow}
                </p>
                <h2 className="mb-5 tracking-tight">{section.title}</h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-text-secondary">
                  {section.body.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {section.points.map((point) => (
                    <span
                      key={point.label}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-pill border border-border-subtle bg-surface-overlay text-[13px] text-text-secondary"
                    >
                      <point.icon className="w-4 h-4 text-brand-action" />
                      {point.label}
                      <span className="font-mono tabular-nums text-text-primary">
                        {point.value}
                      </span>
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className={i % 2 === 1 ? 'lg:order-1' : undefined}
              >
                <div className="relative overflow-hidden rounded-card border border-border-default bg-surface-raised shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={section.image}
                    alt={section.alt}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </section>
        ))}

        {/* ── Team ── */}
        <section className="px-6 md:px-10 py-14">
          <motion.div
            className="max-w-[1280px] mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <h2 className="mb-3 tracking-tight">The team</h2>
              <p className="text-text-secondary">Built by Nigerians, for Nigerians.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div key={member.name} variants={fadeInUp}>
                  <Card className="p-6 text-center hover:border-border-brand transition-colors h-full group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/avatars/avatar-${String((index % 10) + 1).padStart(2, '0')}.png`}
                      alt=""
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 bg-surface-inset border-2 border-border-default group-hover:border-border-brand transition-colors"
                    />
                    <h3 className="mb-1">{member.name}</h3>
                    <p className="text-sm text-brand-action mb-3">{member.title}</p>
                    <p className="text-[13px] leading-relaxed text-text-muted mb-5">
                      {member.bio}
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        aria-label={`${member.name} on LinkedIn`}
                        title="Demo build — social links are not live"
                        onClick={() =>
                          toast('Demo build — social links are not live', {
                            description: `Profiles for ${member.name} ship with the public launch.`,
                          })
                        }
                        className="w-9 h-9 rounded-btn border border-border-strong text-text-muted hover:text-brand-action hover:border-border-brand flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`${member.name} website`}
                        title="Demo build — social links are not live"
                        onClick={() =>
                          toast('Demo build — social links are not live', {
                            description: `Profiles for ${member.name} ship with the public launch.`,
                          })
                        }
                        className="w-9 h-9 rounded-btn border border-border-strong text-text-muted hover:text-brand-action hover:border-border-brand flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Values ── */}
        <section className="px-6 md:px-10 py-14 bg-surface-deep">
          <motion.div
            className="max-w-[1280px] mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <h2 className="mb-3 tracking-tight">What we stand for</h2>
              <p className="text-text-secondary">
                Four principles guide every product decision we make.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <motion.div key={value.title} variants={fadeInUp}>
                  <Card className="p-6 hover:border-border-brand transition-colors h-full">
                    <div className="w-12 h-12 rounded-full bg-brand-action-bg flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-brand-action" />
                    </div>
                    <h3 className="mb-2">{value.title}</h3>
                    <p className="text-[13px] leading-relaxed text-text-muted">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Contact ── */}
        <section className="px-6 md:px-10 py-14">
          <motion.div
            className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="mb-3 tracking-tight">Get in touch</h2>
              <p className="text-text-secondary mb-8 max-w-[480px]">
                Have a question, partnership idea, or press inquiry? Send us a note — we read
                everything.
              </p>
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  toast('Demo build — messages are not delivered', {
                    description: 'The contact form is wired to the launch backend later.',
                  });
                }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="First name" placeholder="Chukwuemeka" />
                  <Input label="Last name" placeholder="Obi" />
                </div>
                <Input label="Business email" type="email" placeholder="ceo@company.ng" />
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="about-message"
                    className="text-text-muted text-[12px] font-semibold uppercase tracking-wider"
                  >
                    Message
                  </label>
                  <textarea
                    id="about-message"
                    rows={5}
                    placeholder="Tell us about your inquiry..."
                    className="w-full rounded-input px-4 py-3 font-sans text-sm bg-surface-base border border-border-strong text-text-primary placeholder:text-text-placeholder transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg">
                  <Send className="w-4 h-4" />
                  Send message
                </Button>
                {sent && (
                  <p className="text-[13px] text-success-text" role="status">
                    Noted — this demo form does not deliver mail yet.
                  </p>
                )}
              </form>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="relative overflow-hidden rounded-card border border-border-default bg-surface-raised shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/sections/section-taxpro.jpg"
                  alt="Tax professional meeting with a client in a modern office"
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <Card className="p-5">
                  <p className="text-[11px] uppercase tracking-wider text-text-muted mb-1">
                    Address
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    12B Adeola Odeku Street, Victoria Island, Lagos, Nigeria
                  </p>
                </Card>
                <Card className="p-5">
                  <p className="text-[11px] uppercase tracking-wider text-text-muted mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:hello@creditax.ai"
                    className="font-mono text-[13px] text-brand-action hover:underline break-all"
                  >
                    hello@creditax.ai
                  </a>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
