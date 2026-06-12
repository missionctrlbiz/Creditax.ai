'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CheckCircle, ChevronDown, ChevronUp, Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const services = [
  { name: 'API Server', status: 'Operational', uptime: '99.97%' },
  { name: 'RAG Chat Engine', status: 'Operational', uptime: '99.91%' },
  { name: 'Document Processing', status: 'Operational', uptime: '99.89%', expanded: true },
  { name: 'Auth System', status: 'Operational', uptime: '100%' },
  { name: 'Marketplace API', status: 'Operational', uptime: '99.82%' },
];

const incidents = [
  {
    title: 'Elevated Document Processing Latency',
    status: 'Resolved',
    date: 'June 3, 2025 · 14:22–15:47 UTC',
    duration: '85 minutes',
  },
  {
    title: 'RAG Chat Intermittent Timeouts',
    status: 'Resolved',
    date: 'May 28, 2025',
    duration: '23 minutes',
  },
  {
    title: 'Auth Service Degraded',
    status: 'Resolved',
    date: 'May 15, 2025',
    duration: '41 minutes',
  },
];

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

export default function StatusPage() {
  const [expandedService, setExpandedService] = useState<string | null>('Document Processing');
  const [activeTab, setActiveTab] = useState<'7d' | '30d' | '90d'>('30d');

  // Generate mock uptime data
  const generateUptimeData = (days: number) => {
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      uptime: Math.random() > 0.05 ? 100 : Math.random() * 80 + 20,
    }));
  };

  const uptimeData = generateUptimeData(activeTab === '7d' ? 7 : activeTab === '30d' ? 30 : 90);

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />
      {/* Page Header */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl font-bold text-text-primary mb-2"
            >
              System Status
            </motion.h1>
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-4 text-sm text-text-muted"
            >
              <span>Last updated: June 12, 2025 · 02:00 UTC</span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Auto-refreshing every 60s
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overall Status Banner */}
      <section className="px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-success-bg border-success-border p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-surface-base" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-success mb-1">All Systems Operational</h2>
                    <p className="text-sm text-text-secondary">No incidents reported in the last 90 days.</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Subscribe to Updates
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Service Rows */}
      <section className="px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {services.map((service, index) => (
              <motion.div key={service.name} variants={fadeInUp}>
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    expandedService === service.name
                      ? 'border-border-brand'
                      : 'hover:border-border-subtle'
                  }`}
                  onClick={() => setExpandedService(expandedService === service.name ? null : service.name)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-text-primary font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-success">● Operational</span>
                        <span className="text-sm text-text-muted">{service.uptime}</span>
                      </div>
                      {service.expanded && (
                        expandedService === service.name ? (
                          <ChevronUp className="w-5 h-5 text-text-muted" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-muted" />
                        )
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {service.expanded && expandedService === service.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 border-t border-border-subtle"
                    >
                      {/* Tabs */}
                      <div className="flex gap-2 pt-4 mb-4">
                        {(['7d', '30d', '90d'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab(tab);
                            }}
                            className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                              activeTab === tab
                                ? 'bg-brand-primary text-text-inverse'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                          >
                            {tab === '7d' ? '7 days' : tab === '30d' ? '30 days' : '90 days'}
                          </button>
                        ))}
                      </div>

                      {/* Uptime Chart */}
                      <div className="bg-surface-deep rounded-card p-4 mb-4">
                        <div className="flex items-end gap-1 h-24">
                          {uptimeData.map((data, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t transition-colors ${
                                data.uptime < 90
                                  ? 'bg-warning'
                                  : 'bg-success'
                              }`}
                              style={{ height: `${data.uptime}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-text-muted">
                          <span>
                            {activeTab === '7d' ? 'Jun 5' : activeTab === '30d' ? 'Jun 1' : 'Mar 15'}
                          </span>
                          <span>Jun 12</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4">
                        <Badge variant="success">99.89% uptime</Badge>
                        <Badge variant="warning">1 incident</Badge>
                        <Badge variant="info">Avg response: 1.2s</Badge>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Incident History */}
      <section className="px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-lg font-semibold text-text-primary mb-4">
              Incident History
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-3">
              {incidents.map((incident, index) => (
                <Card key={index} className="p-4 hover:border-border-subtle transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-text-primary font-medium mb-1">{incident.title}</h3>
                      <p className="text-sm text-text-muted">{incident.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="success">Resolved</Badge>
                      <span className="text-xs text-text-muted">{incident.duration}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
            <motion.button
              variants={fadeInUp}
              className="mt-4 text-brand-action text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View full incident history
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-primary-bg mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Get notified about incidents</h2>
              <p className="text-text-secondary mb-6">
                Receive email or Slack alerts the moment we detect any service disruption.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1"
                />
                <Button variant="brand">Subscribe</Button>
              </div>
              <p className="text-xs text-text-muted mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}