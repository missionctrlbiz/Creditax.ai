'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { MapPin, Users, TrendingUp, Shield, Zap, Globe, Mail, Link2, ExternalLink } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const teamMembers = [
  {
    name: 'Chukwuemeka Obi',
    title: 'CEO & Co-Founder',
    bio: 'Former FIRS analyst with 10+ years in tax policy. Built Creditax to bridge the compliance gap for Nigerian SMEs.',
    avatar: 'CO',
  },
  {
    name: 'Adaeze Nwosu',
    title: 'CTO & Co-Founder',
    bio: 'Ex-Stripe engineer. Passionate about using AI to solve Africa\'s financial infrastructure challenges.',
    avatar: 'AN',
  },
  {
    name: 'Tunde Bakare',
    title: 'Head of Tax Intelligence',
    bio: 'Chartered Tax Accountant with deep expertise in Nigerian tax law and FIRS regulations.',
    avatar: 'TB',
  },
  {
    name: 'Chidinma Eze',
    title: 'Head of Product',
    bio: 'Product leader with experience at Flutterwave. Focused on making complex financial tools accessible.',
    avatar: 'CE',
  },
];

const values = [
  {
    icon: Shield,
    title: 'Trust by Default',
    description: 'We build transparency into every product decision. Your financial data is yours, always.',
  },
  {
    icon: Zap,
    title: 'Speed as Respect',
    description: 'We value your time. Every interaction should be fast, clear, and frictionless.',
  },
  {
    icon: Globe,
    title: 'Built for Nigeria',
    description: 'Designed from the ground up for Nigerian businesses, not adapted from foreign markets.',
  },
  {
    icon: TrendingUp,
    title: 'Radical Transparency',
    description: 'No hidden fees, no surprises. We explain exactly how taxes are calculated and why.',
  },
];

const stats = [
  { value: '2,400+', label: 'registered users' },
  { value: '₦2.1B+', label: 'in taxes calculated' },
  { value: '94%', label: 'client compliance rate' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--ambient-glow)' }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="brand" className="mb-6">OUR MISSION</Badge>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
          >
            We're building the financial infrastructure that Nigeria's tax and credit system deserves.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-text-secondary max-w-2xl mx-auto mb-12"
          >
            Creditax.ai was born from a simple frustration: millions of Nigerians are financially capable but invisible to lenders because their economic activity lives outside the formal credit system. We're changing that.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-action mb-1">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Why We Built This */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-text-primary mb-6">Why we built this</h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  Nigeria has 40 million SMEs. Most file taxes through informal channels, paper-based processes, and disconnected systems. When they need credit, banks have no data to evaluate them.
                </p>
                <p>
                  We built Creditax.ai to close this gap — to make tax compliance effortless and turn that compliance into financial identity. Your tax record IS your credit story.
                </p>
                <p>
                  We leverage AI, open banking, and FIRS data to give every Nigerian business the financial visibility it deserves. Not just in Lagos. Everywhere.
                </p>
              </div>
            </motion.div>

            {/* Decorative Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Card className="bg-surface-raised p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🇳🇬</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2 text-text-secondary">
                      <MapPin className="w-4 h-4 text-brand-action" />
                      <span>Lagos: 1,247 users</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-text-secondary">
                      <MapPin className="w-4 h-4 text-brand-action" />
                      <span>Abuja: 423 users</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-text-secondary">
                      <MapPin className="w-4 h-4 text-brand-action" />
                      <span>Port Harcourt: 387 users</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-surface-deep">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-3">The Team</h2>
            <p className="text-text-secondary">Built by Nigerians, for Nigerians.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6 text-center hover:border-border-brand transition-all duration-200 group">
                  <div className="w-20 h-20 rounded-full bg-brand-primary-bg border-2 border-border-brand mx-auto mb-4 flex items-center justify-center text-brand-primary font-bold text-xl group-hover:scale-105 transition-transform">
                    {member.avatar}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{member.name}</h3>
                  <p className="text-sm text-brand-action mb-3">{member.title}</p>
                  <p className="text-xs text-text-muted mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    <button className="text-text-muted hover:text-text-primary transition-colors">
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button className="text-text-muted hover:text-text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-3">What we stand for</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6 hover:border-border-brand transition-all duration-200 h-full">
                  <div className="w-12 h-12 rounded-full bg-brand-action-bg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-brand-action" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{value.title}</h3>
                  <p className="text-sm text-text-muted">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 px-6 bg-surface-deep">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-3">Get in touch</h2>
            <p className="text-text-secondary">Have a question, partnership idea, or press inquiry?</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="First name" placeholder="Chukwuemeka" />
              <Input label="Last name" placeholder="Obi" />
            </div>
            <Input label="Business email" type="email" placeholder="ceo@company.ng" />
            <div className="flex flex-col gap-1.5">
              <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block">
                Message
              </label>
              <textarea
                className="w-full rounded-input px-4 py-3 font-sans text-sm bg-surface-base border border-border-strong text-text-primary placeholder:text-text-placeholder transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary min-h-[120px] resize-none"
                placeholder="Tell us about your inquiry..."
              />
            </div>
            <Button variant="primary" size="xl" fullWidth>
              Send Message
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}