'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type SettingsSection = 'profile' | 'branding' | 'services' | 'notifications' | 'billing';

export default function ProSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    clientUpdates: true,
    deadlineReminders: true,
  });

  const sections = [
    { id: 'profile' as const, label: 'Profile' },
    { id: 'branding' as const, label: 'Branding' },
    { id: 'services' as const, label: 'Services' },
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'billing' as const, label: 'Billing' },
  ];

  const services = [
    'Personal Income Tax',
    'Business Tax Filing',
    'VAT Returns',
    'Tax Audit Support',
    'Company Secretarial',
    'Tax Planning & Advisory',
  ];

  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Personal Income Tax',
    'Business Tax Filing',
    'VAT Returns',
  ]);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'var(--ambient-glow)' }} />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold font-sans tracking-tight text-text-primary mb-2">
            Settings
          </h1>
          <p className="text-text-secondary">
            Manage your professional profile and preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-[220px] flex-shrink-0"
          >
            <Card className="p-3">
              <nav className="flex flex-row lg:flex-col gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      px-4 py-2.5 rounded-[10px] text-sm font-medium text-left
                      transition-all duration-150 cursor-pointer
                      ${
                        activeSection === section.id
                          ? 'bg-brand-primary-bg text-brand-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
                      }
                    `}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </Card>
          </motion.aside>

          {/* Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-8">
                    <h2 className="text-lg font-bold text-text-primary mb-1">Profile</h2>
                    <p className="text-text-muted text-sm mb-8">
                      Your public profile information as shown in the marketplace.
                    </p>

                    {/* Profile Photo */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border-default">
                      <div className="w-[80px] h-[80px] rounded-full bg-brand-primary flex items-center justify-center text-text-inverse text-2xl font-bold">
                        AO
                      </div>
                      <div>
                        <p className="text-text-primary font-semibold mb-1">Adaeze Obi & Associates</p>
                        <div className="flex gap-3">
                          <button className="text-brand-primary text-sm hover:underline cursor-pointer">
                            Change photo
                          </button>
                          <span className="text-text-muted">·</span>
                          <button className="text-text-muted text-sm hover:text-text-secondary cursor-pointer">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <Input label="Business Name" defaultValue="Adaeze Obi & Associates" />
                      <Input label="Owner/Principal Name" defaultValue="Adaeze Obi" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="CAC Registration Number" defaultValue="RC-1234567" />
                        <Input label="FIRS TIN" defaultValue="1234567-0001" />
                      </div>

                      <Input label="Business Address" defaultValue="15 Admiralty Way, Lekki Phase 1, Lagos" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="City" defaultValue="Lagos" />
                        <Input label="Years of Experience" defaultValue="8" type="number" />
                      </div>

                      <Input label="Email" type="email" defaultValue="adaeze@greenleaf.ng" />
                      <Input label="Phone" defaultValue="+234 812 345 6789" />
                      <Input label="WhatsApp (optional)" defaultValue="+234 812 345 6789" />
                      <Input label="Website (optional)" defaultValue="https://greenleaf.ng" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border-default">
                      <Button variant="primary">Save Changes</Button>
                      <span className="text-text-muted text-sm">No unsaved changes</span>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'branding' && (
                <motion.div
                  key="branding"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-8">
                    <h2 className="text-lg font-bold text-text-primary mb-1">Branding</h2>
                    <p className="text-text-muted text-sm mb-8">
                      Customize how your practice appears to clients.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-3">
                          Logo
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-card bg-surface-inset border border-border-default flex items-center justify-center">
                            <span className="text-text-muted text-xs">No logo</span>
                          </div>
                          <Button variant="secondary" size="sm">Upload Logo</Button>
                        </div>
                      </div>

                      <Input
                        label="Practice Tagline"
                        placeholder="Expert tax services for individuals and businesses"
                      />

                      <div>
                        <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-3">
                          About Your Practice
                        </label>
                        <textarea
                          className="w-full h-32 rounded-input px-4 py-3 font-sans text-sm
                            bg-surface-base border border-border-strong text-text-primary
                            placeholder:text-text-placeholder
                            transition-all duration-150
                            focus:outline-none focus:ring-2
                            focus:ring-[var(--color-focus-ring)]
                            focus:border-brand-primary resize-none"
                          placeholder="Tell potential clients about your expertise, approach, and what makes your practice unique..."
                          defaultValue="GreenLeaf Tax Services has been helping Nigerian businesses and individuals navigate tax compliance for over 8 years. We specialize in corporate tax, VAT returns, and tax planning for SMEs."
                        />
                      </div>

                      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border-default">
                        <Button variant="primary">Save Changes</Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-8">
                    <h2 className="text-lg font-bold text-text-primary mb-1">Services</h2>
                    <p className="text-text-muted text-sm mb-8">
                      Select the services you offer. This helps clients find you in the marketplace.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {services.map((service) => (
                        <label
                          key={service}
                          className={`
                            flex items-center gap-3 p-4 rounded-card border cursor-pointer transition-all
                            ${
                              selectedServices.includes(service)
                                ? 'border-brand-primary bg-brand-primary-bg'
                                : 'border-border-default hover:border-[var(--color-border-strong)]'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={() => toggleService(service)}
                            className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                          />
                          <span className="text-text-primary text-sm">{service}</span>
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <Input label="Minimum Fee (₦)" type="number" defaultValue="50000" />
                      <Input label="Maximum Fee (₦)" type="number" defaultValue="500000" />
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border-default">
                      <Button variant="primary">Save Changes</Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-8">
                    <h2 className="text-lg font-bold text-text-primary mb-1">Notifications</h2>
                    <p className="text-text-muted text-sm mb-8">
                      Control how you receive updates and alerts.
                    </p>

                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Email Notifications', desc: 'New client inquiries, messages, and updates' },
                        { key: 'push', label: 'Push Notifications', desc: 'Real-time alerts on your device' },
                        { key: 'clientUpdates', label: 'Client Document Updates', desc: 'When clients upload or update documents' },
                        { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'FIRS filing deadline alerts' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-4 border-b border-border-default last:border-0">
                          <div>
                            <p className="text-text-primary font-medium">{item.label}</p>
                            <p className="text-text-muted text-sm">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                            className={`
                              w-12 h-6 rounded-full transition-all duration-200 cursor-pointer relative
                              ${notifications[item.key as keyof typeof notifications] ? 'bg-brand-primary' : 'bg-surface-inset'}
                            `}
                          >
                            <div
                              className={`
                                absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200
                                ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}
                              `}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'billing' && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-8">
                    <h2 className="text-lg font-bold text-text-primary mb-1">Billing</h2>
                    <p className="text-text-muted text-sm mb-8">
                      Manage your subscription and payment methods.
                    </p>

                    <div className="p-6 rounded-card border border-border-default mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-text-primary font-semibold">Current Plan</p>
                          <p className="text-text-muted text-sm">Your subscription details</p>
                        </div>
                        <Badge variant="brand">Pro Portal</Badge>
                      </div>
                      <div className="text-text-secondary text-sm">
                        <p>₦25,000/month · Billed monthly</p>
                        <p className="text-text-muted mt-1">Next billing date: July 12, 2025</p>
                      </div>
                    </div>

                    <Button variant="secondary">Manage Subscription</Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}