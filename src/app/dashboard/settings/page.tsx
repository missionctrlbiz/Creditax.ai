'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Upload, Camera, X, Check, AlertTriangle, Loader2 } from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'billing' | 'api';

interface ProfileFormData {
  fullName: string;
  phone: string;
}

interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  marketing: boolean;
  tokenWarnings: boolean;
}

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full',
        'transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-brand-action' : 'bg-white/20'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md',
          'transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0.5',
          'mt-0.5'
        )}
      />
    </button>
  );
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-card shadow-modal',
        type === 'success' ? 'bg-success-bg border border-success-border' : 'bg-error-bg border border-error-border'
      )}
    >
      {type === 'success' ? (
        <Check className="w-5 h-5 text-success-text" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-error-text" />
      )}
      <span className={type === 'success' ? 'text-success-text' : 'text-error-text'}>
        {message}
      </span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (confirmation !== 'DELETE') return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1500));
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-raised border border-error-border rounded-card p-6 w-full max-w-md mx-4 shadow-modal"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error-bg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error-text" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Delete Account</h3>
                <p className="text-sm text-text-muted">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-text-secondary text-sm mb-4">
              All your data will be permanently deleted. This includes:
            </p>
            <ul className="text-text-muted text-sm mb-4 space-y-1 list-disc list-inside">
              <li>Your profile information</li>
              <li>Chat history and documents</li>
              <li>Credit reports and tax records</li>
              <li>API keys and access</li>
            </ul>

            <div className="mb-6">
              <Input
                label="Type DELETE to confirm"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirm}
                className="flex-1"
                disabled={confirmation !== 'DELETE' || isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Account'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    marketing: false,
    tokenWarnings: true,
  });

  const [billing] = useState({
    plan: 'Free Plan',
    cycleEnd: 'July 12, 2026',
    usedTokens: 23,
    totalTokens: 50,
  });

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || 'Emeka Obi',
      phone: user?.user_metadata?.phone || '+234 812 345 6789',
    },
  });

  const securityForm = useForm<SecurityFormData>();

  const tabs = [
    { id: 'profile' as const, label: 'Profile' },
    { id: 'security' as const, label: 'Security' },
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'billing' as const, label: 'Billing' },
    { id: 'api' as const, label: 'API Keys' },
  ];

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Profile update:', data);
    showToast('Profile updated successfully', 'success');
    setIsSubmitting(false);
  };

  const handleSecuritySubmit = async (data: SecurityFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (data.newPassword && data.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Password update:', data);
    showToast('Password updated successfully', 'success');
    securityForm.reset();
    setIsSubmitting(false);
  };

  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    await new Promise((r) => setTimeout(r, 500));
    showToast('Notification preferences updated', 'success');
  };

  const handleUpgradeToPro = () => {
    window.location.href = '/pricing';
  };

  const handleManageSubscription = async () => {
    showToast('Opening billing portal...', 'success');
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Open Stripe portal');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    showToast('Account deletion is disabled in demo', 'error');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-text-muted text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-56 flex-shrink-0 p-3">
          <nav className="flex flex-row lg:flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2.5 rounded-[10px] text-sm font-medium text-left transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                  activeTab === tab.id
                    ? 'bg-brand-primary text-text-inverse'
                    : 'text-text-muted hover:text-text-primary hover:bg-hover-overlay'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block mt-6 pt-4 border-t border-border-default">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-4 py-2.5 rounded-[10px] text-sm font-medium text-left text-error-text hover:bg-error-bg transition-all duration-150"
            >
              Delete Account
            </button>
          </div>
        </Card>

        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-text-primary mb-1">Profile</h2>
                  <p className="text-text-muted text-sm mb-6">
                    Update your personal information and profile photo
                  </p>

                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-border-default">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-text-inverse text-2xl font-bold">
                        {getInitials(profileForm.getValues('fullName') || 'User')}
                      </div>
                      <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <Button variant="secondary" size="sm">
                        <Upload className="w-4 h-4" />
                        Change Photo
                      </Button>
                      <span className="text-text-muted text-xs">JPG, PNG or GIF. Max 2MB.</span>
                    </div>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-5">
                    <Input
                      label="Full Name"
                      {...profileForm.register('fullName')}
                      placeholder="Enter your full name"
                    />

                    <div className="space-y-1.5">
                      <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || 'emeka.obi@zenithfoods.ng'}
                        readOnly
                        className="h-12 w-full rounded-input px-4 font-sans text-sm bg-surface-inset border border-border-strong text-text-muted cursor-not-allowed"
                        placeholder="Enter your email"
                      />
                      <span className="text-[11px] text-text-muted">Email cannot be changed</span>
                    </div>

                    <Input
                      label="Phone Number (Optional)"
                      {...profileForm.register('phone')}
                      placeholder="+234 XXX XXX XXXX"
                    />

                    <div className="flex items-center gap-4 pt-4">
                      <Button type="submit" variant="brand" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </span>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                      <span className="text-text-muted text-sm">No unsaved changes</span>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-text-primary mb-1">Security</h2>
                  <p className="text-text-muted text-sm mb-6">
                    Update your password to keep your account secure
                  </p>

                  <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-5">
                    <Input
                      label="Current Password"
                      type="password"
                      {...securityForm.register('currentPassword')}
                      placeholder="Enter current password"
                    />

                    <Input
                      label="New Password"
                      type="password"
                      {...securityForm.register('newPassword')}
                      placeholder="Enter new password"
                      hint="Leave blank to keep current password"
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      {...securityForm.register('confirmPassword')}
                      placeholder="Confirm new password"
                    />

                    <div className="flex items-center gap-4 pt-4">
                      <Button type="submit" variant="brand" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-text-primary mb-1">Notifications</h2>
                  <p className="text-text-muted text-sm mb-6">
                    Choose what updates you receive from Creditax.ai
                  </p>

                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-5 border-b border-border-default">
                      <div className="flex-1 pr-4">
                        <p className="text-text-primary font-medium">Email Notifications</p>
                        <p className="text-text-muted text-sm">Receive updates about new features and changes</p>
                      </div>
                      <ToggleSwitch
                        checked={notifications.emailNotifications}
                        onChange={(v) => handleNotificationChange('emailNotifications', v)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-5 border-b border-border-default">
                      <div className="flex-1 pr-4">
                        <p className="text-text-primary font-medium">Marketing Emails</p>
                        <p className="text-text-muted text-sm">Get tips, best practices, and promotional content</p>
                      </div>
                      <ToggleSwitch
                        checked={notifications.marketing}
                        onChange={(v) => handleNotificationChange('marketing', v)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-5">
                      <div className="flex-1 pr-4">
                        <p className="text-text-primary font-medium">Token Limit Warnings</p>
                        <p className="text-text-muted text-sm">Alert when approaching your daily token limit</p>
                      </div>
                      <ToggleSwitch
                        checked={notifications.tokenWarnings}
                        onChange={(v) => handleNotificationChange('tokenWarnings', v)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-text-primary mb-1">Billing</h2>
                  <p className="text-text-muted text-sm mb-6">
                    Manage your subscription and usage
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-card bg-surface-inset">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-primary font-semibold">{billing.plan}</span>
                          {billing.plan === 'Free Plan' && (
                            <Badge variant="warning">Free</Badge>
                          )}
                          {billing.plan === 'Pro Plan' && (
                            <Badge variant="success">Pro</Badge>
                          )}
                        </div>
                        <p className="text-text-muted text-sm">
                          Current billing cycle ends: {billing.cycleEnd}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-card bg-surface-inset">
                      <p className="text-text-primary font-medium mb-3">Usage Summary</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-border-default overflow-hidden">
                          <div
                            className="h-full bg-brand-action rounded-full transition-all duration-500"
                            style={{ width: `${(billing.usedTokens / billing.totalTokens) * 100}%` }}
                          />
                        </div>
                        <span className="text-text-muted text-sm font-mono">
                          {billing.usedTokens}/{billing.totalTokens} tokens
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {billing.plan === 'Free Plan' ? (
                        <Button variant="brand" onClick={handleUpgradeToPro}>
                          Upgrade to Pro
                        </Button>
                      ) : (
                        <Button variant="brand" onClick={handleManageSubscription}>
                          Manage Subscription
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-text-primary mb-1">API Keys</h2>
                  <p className="text-text-muted text-sm mb-6">
                    Manage your API keys for programmatic access
                  </p>

                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-inset flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-text-primary font-semibold mb-2">API Keys Coming Soon</h3>
                    <p className="text-text-muted text-sm max-w-sm">
                      We are working on providing API key access for developers. Check back soon for updates.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeTab !== 'api' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-card border border-error-border bg-error-bg/30"
              >
                <h3 className="text-error-text font-semibold mb-1">Danger Zone</h3>
                <p className="text-text-muted text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                  Delete Account
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}