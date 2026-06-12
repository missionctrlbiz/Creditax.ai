'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type SettingsSection = 'account' | 'notifications' | 'security' | 'billing' | 'api';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    digest: true,
  });

  const sections = [
    { id: 'account' as const, label: 'Account' },
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'security' as const, label: 'Security' },
    { id: 'billing' as const, label: 'Billing' },
    { id: 'api' as const, label: 'API' },
  ];

  const sessions = [
    { device: 'Chrome on macOS', location: 'Lagos, Nigeria', status: 'Current session', isCurrent: true },
    { device: 'Safari on iPhone 14', location: 'Lagos, Nigeria', status: '2 hours ago', isCurrent: false },
    { device: 'Chrome on Windows', location: 'Abuja, Nigeria', status: '3 days ago', isCurrent: false },
  ];

  return (
    <div className="p-8 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-text-primary mb-2">
          Settings
        </h1>
        <p className="text-text-secondary text-sm">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-[200px] flex-shrink-0"
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

            {/* Danger Zone */}
            <div className="mt-6 pt-4 border-t border-border-default">
              <button
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-medium text-left
                  text-[var(--color-error-text)] hover:bg-[var(--color-error-bg)] transition-all duration-150 cursor-pointer"
              >
                Danger Zone
              </button>
            </div>
          </Card>
        </motion.aside>

        {/* Content */}
        <div className="flex-1 max-w-[680px]">
          <AnimatePresence mode="wait">
            {activeSection === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-8">
                  <h2 className="text-lg font-bold text-text-primary mb-1">Account</h2>
                  <p className="text-text-muted text-sm mb-8">
                    Manage your personal information and preferences.
                  </p>

                  {/* Profile Photo */}
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border-default">
                    <div className="w-[72px] h-[72px] rounded-full bg-brand-primary flex items-center justify-center text-text-inverse text-2xl font-bold">
                      EO
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold mb-1">Emeka Obi</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="First Name" defaultValue="Emeka" />
                      <Input label="Last Name" defaultValue="Obi" />
                    </div>

                    <div className="relative">
                      <Input
                        label="Email Address"
                        type="email"
                        defaultValue="emeka.obi@zenithfoods.ng"
                      />
                      <Badge variant="success" className="absolute right-3 top-[38px]">
                        ✓ Verified
                      </Badge>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-20">
                        <Input label="Code" defaultValue="+234" />
                      </div>
                      <div className="flex-1">
                        <Input label="Phone Number" defaultValue="812 345 6789" />
                      </div>
                    </div>

                    <Input
                      label="Timezone"
                      defaultValue="Africa/Lagos (WAT, UTC+1)"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border-default">
                    <Button variant="primary">Save Changes</Button>
                    <span className="text-text-muted text-sm">No unsaved changes</span>
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
                    Control how Creditax.ai contacts you.
                  </p>

                  <div className="space-y-4">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between py-4 border-b border-border-default">
                      <div>
                        <p className="text-text-primary font-medium">Email Notifications</p>
                        <p className="text-text-muted text-sm">Tax alerts, filing reminders, document updates</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                        className={`
                          w-12 h-6 rounded-full transition-all duration-200 cursor-pointer relative
                          ${notifications.email ? 'bg-brand-primary' : 'bg-surface-inset'}
                        `}
                      >
                        <div
                          className={`
                            absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200
                            ${notifications.email ? 'left-7' : 'left-1'}
                          `}
                        />
                      </button>
                    </div>

                    {/* Push Notifications */}
                    <div className="flex items-center justify-between py-4 border-b border-border-default">
                      <div>
                        <p className="text-text-primary font-medium">Push Notifications</p>
                        <p className="text-text-muted text-sm">Real-time alerts on your device</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                        className={`
                          w-12 h-6 rounded-full transition-all duration-200 cursor-pointer relative
                          ${notifications.push ? 'bg-brand-primary' : 'bg-surface-inset'}
                        `}
                      >
                        <div
                          className={`
                            absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200
                            ${notifications.push ? 'left-7' : 'left-1'}
                          `}
                        />
                      </button>
                    </div>

                    {/* SMS Alerts */}
                    <div className="flex items-center justify-between py-4 border-b border-border-default">
                      <div>
                        <p className="text-text-primary font-medium">SMS Alerts</p>
                        <p className="text-text-muted text-sm">Critical tax deadlines via SMS</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                        className={`
                          w-12 h-6 rounded-full transition-all duration-200 cursor-pointer relative
                          ${notifications.sms ? 'bg-brand-primary' : 'bg-surface-inset'}
                        `}
                      >
                        <div
                          className={`
                            absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200
                            ${notifications.sms ? 'left-7' : 'left-1'}
                          `}
                        />
                      </button>
                    </div>

                    {/* Weekly Digest */}
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-text-primary font-medium">Weekly Tax Digest</p>
                        <p className="text-text-muted text-sm">Summary of your tax activity every Monday</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, digest: !notifications.digest })}
                        className={`
                          w-12 h-6 rounded-full transition-all duration-200 cursor-pointer relative
                          ${notifications.digest ? 'bg-brand-primary' : 'bg-surface-inset'}
                        `}
                      >
                        <div
                          className={`
                            absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200
                            ${notifications.digest ? 'left-7' : 'left-1'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 2FA Card */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-text-primary font-semibold mb-1">Two-Factor Authentication</h3>
                      <p className="text-text-muted text-sm">Authenticator app connected</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="success">ON</Badge>
                      <button className="w-12 h-6 rounded-full bg-brand-primary relative cursor-pointer">
                        <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Active Sessions */}
                <Card className="p-6">
                  <h3 className="text-text-primary font-semibold mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between py-3 border-b border-border-default last:border-0"
                      >
                        <div>
                          <p className="text-text-primary text-sm font-medium">{session.device}</p>
                          <p className="text-text-muted text-xs">{session.location}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {session.isCurrent ? (
                            <Badge variant="success">Current session</Badge>
                          ) : (
                            <>
                              <span className="text-text-muted text-xs">{session.status}</span>
                              <button className="text-[var(--color-error-text)] text-xs hover:underline cursor-pointer">
                                Revoke
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
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
                  <p className="text-text-secondary">Billing settings coming soon.</p>
                </Card>
              </motion.div>
            )}

            {activeSection === 'api' && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-8">
                  <h2 className="text-lg font-bold text-text-primary mb-1">API</h2>
                  <p className="text-text-muted text-sm mb-8">
                    Manage your API keys and access.
                  </p>
                  <Button variant="secondary" onClick={() => window.location.href = '/dashboard/keys'}>
                    Go to API Keys
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Danger Zone - Always visible at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 border border-[var(--color-error-border)] rounded-card"
          >
            <h3 className="text-[var(--color-error-text)] font-semibold mb-1">Delete Account</h3>
            <p className="text-text-muted text-sm mb-4">
              Permanently delete your account and all data. This cannot be undone.
            </p>
            <Button variant="danger" size="sm">Delete Account</Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}