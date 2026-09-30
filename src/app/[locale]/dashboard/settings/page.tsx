'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Link2, Users, Share2, Plus, HardDrive, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type SettingsSection = 'account' | 'notifications' | 'security' | 'billing' | 'api' | 'team' | 'connectors';

// P6 F-18/F-19 shapes from the collab + connectors endpoints.
interface CollabData {
  invites: { email: string; role: string; status: string; tier: string }[];
  links: { urlSlug: string; access: string }[];
}
interface ConnectorData {
  connectors: { service: string; displayName: string; status: string }[];
  status: { used: number; cap: number; remaining: number; unlimited: boolean };
  services: { service: string; displayName: string; description: string }[];
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [twoFactor, setTwoFactor] = useState(true);
  const [revoked, setRevoked] = useState<string[]>([]);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    digest: true,
  });

  // P6 — load the collab + connectors boards live (fall back to empty when offline).
  const [collab, setCollab] = useState<CollabData | null>(null);
  const [connectors, setConnectors] = useState<ConnectorData | null>(null);
  const [tier] = useState<'free' | 'plus' | 'professional'>('free');
  const inviteInputRef = useRef<HTMLInputElement>(null);

  function loadCollab() {
    return fetch('/api/v1/collab')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setCollab(d))
      .catch(() => {});
  }
  function loadConnectors(t: 'free' | 'plus' | 'professional') {
    return fetch(`/api/v1/connectors?userId=u-consumer&tier=${t}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setConnectors(d))
      .catch(() => {});
  }
  useEffect(() => {
    loadCollab();
    loadConnectors('free');
  }, []);

  const sections = [
    { id: 'account' as const, label: 'Account' },
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'security' as const, label: 'Security' },
    { id: 'billing' as const, label: 'Billing' },
    { id: 'team' as const, label: 'Team & Sharing' },
    { id: 'connectors' as const, label: 'Connected apps' },
    { id: 'api' as const, label: 'API' },
  ];

  const sessions = [
    { device: 'Chrome on macOS', location: 'Lagos, Nigeria', status: 'Current session', isCurrent: true },
    { device: 'Safari on iPhone 14', location: 'Lagos, Nigeria', status: '2 hours ago', isCurrent: false },
    { device: 'Chrome on Windows', location: 'Abuja, Nigeria', status: '3 days ago', isCurrent: false },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-text-primary mb-2">
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
                onClick={() =>
                  toast('Danger Zone (demo)', {
                    description: 'Account-level actions are mocked in Track A; session revocation and deletion land in Track B.',
                  })
                }
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/avatars/avatar-01.png"
                      alt="Emeka Obi"
                      width={72}
                      height={72}
                      className="w-[72px] h-[72px] rounded-full object-cover border border-border-default"
                    />
                    <div>
                      <p className="text-text-primary font-semibold mb-1">Emeka Obi</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            toast('Photo upload (demo)', {
                              description: 'Avatar uploads land in Cloudinary on Track B.',
                            })
                          }
                          className="text-brand-primary text-sm hover:underline cursor-pointer"
                        >
                          Change photo
                        </button>
                        <span className="text-text-muted">·</span>
                        <button
                          onClick={() =>
                            toast('Photo removed (demo)', {
                              description: 'Avatar removal clears the Cloudinary record on Track B.',
                            })
                          }
                          className="text-text-muted text-sm hover:text-text-secondary cursor-pointer"
                        >
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
                        <CheckCircle2 size={11} /> Verified
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
                    <Button variant="primary" onClick={() => toast('Settings saved', { description: 'Demo build — settings are not persisted in Track A.' })}>
                      Save Changes
                    </Button>
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
                    <div className="flex items-center gap-3.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/icons/icon-security.png"
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain shrink-0"
                      />
                      <div>
                        <h3 className="text-text-primary font-semibold mb-1">Two-Factor Authentication</h3>
                        <p className="text-text-muted text-sm">Authenticator app connected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={twoFactor ? 'success' : 'warning'}>{twoFactor ? 'ON' : 'OFF'}</Badge>
                      <button
                        role="switch"
                        aria-checked={twoFactor}
                        aria-label="Toggle two-factor authentication"
                        onClick={() => setTwoFactor((v) => !v)}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${twoFactor ? 'bg-brand-primary' : 'bg-surface-inset border border-border-default'}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${twoFactor ? 'left-7 bg-white' : 'left-1 bg-text-muted'}`}
                        />
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
                          ) : revoked.includes(session.device) ? (
                            <span className="text-text-muted text-xs">Revoked</span>
                          ) : (
                            <>
                              <span className="text-text-muted text-xs">{session.status}</span>
                              <button
                                onClick={() => {
                                  setRevoked((prev) => [...prev, session.device]);
                                  toast(`${session.device} revoked (demo)`, {
                                    description: 'Session revocation propagates to the auth server on Track B.',
                                  });
                                }}
                                className="text-[var(--color-error-text)] text-xs hover:underline cursor-pointer"
                              >
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

            {activeSection === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-text-primary">Team &amp; Sharing</h2>
                    <Badge variant="info">demo_seed</Badge>
                  </div>
                  <p className="text-text-muted text-sm mb-6">
                    Invite your team and share a canvas link (paid feature, product-foundation §10).
                  </p>

                  {/* F-18 — shared-canvas links */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 className="w-4 h-4 text-text-muted" />
                      <h3 className="text-sm font-semibold text-text-primary">Shared canvas links</h3>
                    </div>
                    <ul className="space-y-2">
                      {(collab?.links ?? [{ urlSlug: 'share_7f3a9c', access: 'view' }]).map((l) => (
                        <li key={l.urlSlug} className="flex items-center gap-3 p-3 rounded-card border border-border-subtle bg-surface-overlay">
                          <Link2 className="w-4 h-4 text-brand-action shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-mono text-text-primary truncate">/share/{l.urlSlug}</p>
                            <p className="text-[11px] text-text-muted">read-only · {l.access}</p>
                          </div>
                          <Badge variant={l.access === 'view' ? 'success' : 'brand'}>{l.access}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* F-18 — workspace invites */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-text-muted" />
                      <h3 className="text-sm font-semibold text-text-primary">Workspace invites</h3>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Input
                        ref={inviteInputRef}
                        placeholder="teammate@firm.ng"
                        className="h-9 flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const v = (e.target as HTMLInputElement).value;
                            if (v) fetch('/api/v1/collab/invite', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ email: v, tier }),
                            }).then(() => loadCollab()).catch(() => {});
                          }
                        }}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const v = inviteInputRef.current?.value?.trim();
                          if (!v) {
                            toast('Enter a teammate email first', { description: 'Invites are a paid feature (Plus / Pro).' });
                            return;
                          }
                          fetch('/api/v1/collab/invite', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: v, tier }),
                          })
                            .then(() => loadCollab())
                            .catch(() => {});
                          toast('Invite sent', { description: 'Workspace invites are a paid feature (Plus / Pro).' });
                        }}
                      >
                        <Plus size={14} /> Invite
                      </Button>
                    </div>
                    <ul className="space-y-1.5">
                      {(collab?.invites ?? []).map((inv) => (
                        <li key={inv.email} className="flex items-center gap-2 text-[12px]">
                          <span className="w-2 h-2 rounded-full bg-brand-action shrink-0" />
                          <span className="text-text-primary font-medium">{inv.email}</span>
                          <span className="text-text-muted">{inv.role}</span>
                          <Badge variant={inv.status === 'accepted' ? 'success' : 'warning'} className="ml-auto">{inv.status}</Badge>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-text-muted mt-3">Invites + canvas sharing are paid features (Plus / Pro).</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'connectors' && (
              <motion.div
                key="connectors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-text-primary">Connected apps</h2>
                    <Badge variant="info">demo_seed</Badge>
                  </div>
                  <p className="text-text-muted text-sm mb-6">
                    Prompt with external tools as context. Free tier includes 2 connectors.
                  </p>

                  {/* F-19 — per-tier cap */}
                  {connectors?.status && (
                    <div className="mb-6 p-3 rounded-card border border-brand-primary-border bg-brand-primary-bg/30">
                      <p className="text-sm text-text-primary">
                        {connectors.status.unlimited
                          ? 'Unlimited connectors on your tier'
                          : `You have ${connectors.status.remaining} of ${connectors.status.cap} connectors left on Free`}
                      </p>
                      <p className="text-[11px] text-text-muted mt-1">Connect more on Plus (₦5,000/mo)</p>
                    </div>
                  )}

                  {/* F-19 — connected services as prompt context */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Prompt context</h3>
                    <div className="flex flex-wrap gap-2">
                      {(connectors?.connectors ?? [{ service: 'google_drive', displayName: 'Google Drive', status: 'connected' }]).map((c) => (
                        <span key={c.service} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-primary-border bg-brand-primary-bg text-brand-primary text-[12px] font-medium">
                          <HardDrive size={13} /> {c.displayName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* F-19 — connect another */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Connect a tool</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(connectors?.services ?? [{ service: 'google_drive', displayName: 'Google Drive', description: 'Read documents as prompt context' }, { service: 'notion', displayName: 'Notion', description: 'Link Notion pages' }]).map((s) => (
                        <button
                          key={s.service}
                          onClick={() => fetch('/api/v1/connectors', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ service: s.service, tier }),
                          }).then(() => loadConnectors(tier)).catch(() => {})}
                          className="p-3 rounded-card border border-border-subtle bg-surface-overlay hover:border-brand-primary-border transition-colors text-left cursor-pointer"
                        >
                          <p className="text-sm font-medium text-text-primary">{s.displayName}</p>
                          <p className="text-[11px] text-text-muted">{s.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
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
            <Button
              variant="danger"
              size="sm"
              onClick={() => toast('Demo build — account deletion is mocked', { description: 'No real data is stored or removed in Track A.' })}
            >
              Delete Account
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}