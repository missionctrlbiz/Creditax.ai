'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { LogoGraphic } from '@/components/shared/LogoGraphic';
import { setSession, ROLE_HOME, type PortalRole } from '@/lib/mock-auth';
import { recordLogin } from '@/lib/pocketbase';

const ROLES: { value: PortalRole; title: string; description: string }[] = [
  { value: 'personal', title: 'Personal', description: 'Dashboard, filing, credit' },
  { value: 'pro', title: 'Tax Pro', description: 'Clients, verify, calculations' },
  { value: 'admin', title: 'Admin', description: 'Users, audit, marketplace' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<PortalRole>('personal');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const loginEmail = email || 'demo@creditax.ai';
    await recordLogin(loginEmail, role);
    setSession(role, loginEmail);
    window.location.href = ROLE_HOME[role];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Theme Toggle Positioned in Top Corner */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Panel: Brand Panel (Hidden on Mobile) */}
      <div className="bg-surface-base flex flex-col items-center justify-center relative p-10 max-md:hidden select-none">
        {/* Decorative concentric background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-no-repeat bg-contain pointer-events-none opacity-50"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'80\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.08\' stroke-width=\'1\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'60\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.06\' stroke-width=\'.8\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'40\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.05\' stroke-width=\'.6\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'20\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.04\' stroke-width=\'.4\'/%3E%3Cpath d=\'M100 20 L180 70 L180 130 L100 180 L20 130 L20 70Z\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.04\' stroke-width=\'.5\'/%3E%3Cpath d=\'M100 40 L160 80 L160 120 L100 160 L40 120 L40 80Z\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.03\' stroke-width=\'.4\'/%3E%3C/svg%3E")'
          }}
        />

        {/* Back to home (home link #1) */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Full-size animated hero mark (home link #2) */}
        <Link
          href="/"
          className="relative z-10 block w-[380px] lg:w-[440px] mx-auto transition-opacity hover:opacity-90"
          aria-label="Back to home"
        >
          <LogoGraphic className="w-full" />
        </Link>

        {/* Tagline */}
        <div className="relative z-10 mt-4 text-center font-display text-2xl lg:text-3xl font-bold tracking-tight">
          <span className="text-brand-primary">Tax Smart.</span>{' '}
          <span className="text-brand-action">Borrow Smart.</span>
        </div>
      </div>

      {/* Right Panel: Form Panel */}
      <div className="bg-surface-raised flex flex-col items-center justify-center p-10 relative min-h-screen max-sm:px-5">
        <div className="bg-surface-overlay border border-border-default rounded-[20px] p-10 w-full max-w-[400px] shadow-card">
          <h1 className="text-3xl font-bold mb-2 font-sans tracking-tight">Welcome back</h1>
          <p className="text-text-secondary text-[15px] mb-6">Sign in to your account.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="you@company.com"
              label="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="text-text-primary text-sm font-medium mb-2">Sign in as</div>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    aria-pressed={role === r.value}
                    className={`rounded-[10px] border p-3 text-left transition-all cursor-pointer ${
                      role === r.value
                        ? 'border-brand-primary bg-brand-primary-bg/40 ring-2 ring-brand-primary'
                        : 'border-border-strong bg-transparent hover:border-text-muted'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${role === r.value ? 'text-brand-primary' : 'text-text-primary'}`}>
                      {r.title}
                    </div>
                    <div className="text-text-muted text-[11px] mt-1 leading-snug">{r.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="xl" disabled={submitting}>
              Login →
            </Button>
          </form>

          <p className="text-text-muted text-xs text-center mt-3">
            Demo build — any email works.
          </p>

          <p className="text-text-secondary text-sm text-center mt-6">
            Don&apos;t have an account? <Link href="/signup" className="text-brand-primary font-semibold hover:underline">Sign up →</Link>
          </p>
        </div>
        <div className="absolute bottom-6 text-text-muted text-xs text-center">
          © 2026 Creditax.ai · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </div>
  );
}
