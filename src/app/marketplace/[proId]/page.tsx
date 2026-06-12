'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calendar,
  FileText,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const proData = {
  name: 'Adaeze Consulting Ltd',
  badges: ['CAC Registered', 'FIRS Certified', 'Creditax Verified'],
  location: 'Lagos Island, Lagos',
  distance: '2.3 km from you',
  rating: 4.9,
  reviewCount: 127,
  memberSince: 'March 2022',
  responseTime: 'Usually responds in 2hrs',
  address: '15 Adeola Odeku St, Victoria Island, Lagos',
  phone: '+234 801 234 5678',
  email: 'contact@adaezeconsulting.ng',
  whatsapp: '+234 801 234 5678',
  website: 'https://adaezeconsulting.ng',
  stats: ['127 reviews', '3 yrs exp', '98% on-time'],
  about: `Adaeze Consulting Ltd is a premier tax and financial advisory firm specializing in serving Nigerian SMEs and startups. With over 8 years of combined experience, our team of chartered accountants and tax professionals has helped hundreds of businesses navigate the complexities of Nigerian tax law.

We specialize in corporate income tax, VAT compliance, payroll processing, and tax audit support. Our deep understanding of FIRS regulations and commitment to staying current with regulatory changes ensures our clients remain compliant while optimizing their tax positions.

Our client-first approach means we take the time to understand your business and provide tailored solutions that actually work for your specific situation.`,
  services: [
    { name: 'Income Tax Filing', turnaround: '3–5 days', price: '₦25,000' },
    { name: 'VAT Returns (Monthly)', turnaround: '1–2 days', price: '₦15,000' },
    { name: 'Corporate Income Tax', turnaround: '7–10 days', price: '₦45,000' },
    { name: 'Payroll Processing', turnaround: '2–3 days', price: '₦20,000/mo' },
    { name: 'Tax Audit Support', turnaround: 'As needed', price: '₦75,000' },
  ],
  reviews: [
    {
      name: 'Emeka J.',
      rating: 5,
      date: 'Jun 2025',
      text: 'Adaeze Consulting transformed our tax filing process. Professional, responsive, and thorough. Highly recommended for any Lagos-based business.',
    },
    {
      name: 'Chidinma O.',
      rating: 5,
      date: 'May 2025',
      text: 'They handled our VAT returns seamlessly and identified savings we didn\'t know existed. The team is incredibly knowledgeable about FIRS regulations.',
    },
    {
      name: 'Tunde B.',
      rating: 4,
      date: 'Apr 2025',
      text: 'Great service overall. Quick turnaround on our CIT filing. Would have given 5 stars but communication could be faster during peak periods.',
    },
  ],
};

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

export default function ProProfilePage() {
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');
  const [showFullAbout, setShowFullAbout] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base pb-20">
      {/* Profile Header */}
      <section className="bg-[#0D1117] py-8 px-6 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-6 items-start"
          >
            {/* Avatar */}
            <motion.div variants={fadeInUp}>
              <div className="w-20 h-20 rounded-full bg-brand-action-bg border-2 border-brand-action flex items-center justify-center text-brand-action text-2xl font-bold">
                {proData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeInUp} className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-2">{proData.name}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {proData.badges.map((badge) => (
                  <Badge key={badge} variant="success" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand-action" />
                  {proData.location} · {proData.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  {proData.rating} ({proData.reviewCount} reviews)
                </span>
                <span>Member since {proData.memberSince}</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeInUp} className="text-right">
              <Button variant="primary" size="xl">
                Request Consultation
              </Button>
              <p className="text-xs text-text-muted mt-2 flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
                {proData.responseTime}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 py-4 border-b border-border-subtle sticky top-[64px] bg-surface-base z-30">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-6">
            {(['about', 'services', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-all capitalize ${
                  activeTab === tab
                    ? 'border-brand-action text-brand-action'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Contact & Map */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Contact Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Contact</h3>
                <div className="space-y-3">
                  <Button variant="secondary" size="md" fullWidth>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="secondary" size="md" fullWidth>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="primary" size="md" fullWidth>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="ghost" size="md" fullWidth>
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </Card>

              {/* Mini Map */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Location</h3>
                <div className="bg-surface-deep rounded-card h-40 flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-xs text-text-muted">Victoria Island, Lagos</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{proData.address}</p>
              </Card>

              {/* Stats */}
              <div className="flex flex-wrap gap-2">
                {proData.stats.map((stat) => (
                  <Badge key={stat} variant="brand">
                    {stat}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Center Column - Main Content */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {activeTab === 'about' && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">About</h3>
                  <p className={`text-text-secondary text-sm leading-relaxed ${!showFullAbout && 'line-clamp-6'}`}>
                    {proData.about}
                  </p>
                  {proData.about.length > 200 && (
                    <button
                      onClick={() => setShowFullAbout(!showFullAbout)}
                      className="mt-2 text-brand-action text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      {showFullAbout ? (
                        <>
                          Show less
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Read more
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </Card>
              )}

              {activeTab === 'services' && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Services & Pricing</h3>
                  <div className="space-y-3">
                    {proData.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0"
                      >
                        <div>
                          <p className="text-text-primary font-medium text-sm">{service.name}</p>
                          <p className="text-text-muted text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.turnaround}
                          </p>
                        </div>
                        <p className="text-brand-action font-semibold">{service.price}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {proData.reviews.map((review, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-primary-bg flex items-center justify-center text-brand-primary font-bold text-sm">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-text-primary font-medium text-sm">{review.name}</p>
                            <p className="text-text-muted text-xs">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-warning fill-current' : 'text-text-muted'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm">{review.text}</p>
                    </Card>
                  ))}
                  <button className="text-brand-action text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    See all {proData.reviewCount} reviews
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Right Column - Extra Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-surface-deep">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Why Choose {proData.name}?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-action-bg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-brand-action" />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">FIRS-Certified Team</p>
                      <p className="text-text-muted text-xs">All filings reviewed by chartered tax professionals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-action-bg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-brand-action" />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">98% On-Time Delivery</p>
                      <p className="text-text-muted text-xs">Your deadlines are our priority</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-action-bg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-brand-action" />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">127 Happy Clients</p>
                      <p className="text-text-muted text-xs">Trusted by businesses across Lagos</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-overlay border-t border-border-strong p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-text-primary font-semibold">{proData.name}</p>
            <p className="text-brand-action text-sm">From ₦15,000/filing</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="lg">
              Request Consultation
            </Button>
            <Button variant="ghost" size="lg">
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}