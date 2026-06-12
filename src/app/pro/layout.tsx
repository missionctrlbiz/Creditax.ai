"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const navLinks = [
  { href: "/pro/dashboard", label: "Dashboard" },
  { href: "/pro/clients", label: "Clients" },
  { href: "/pro/calculations", label: "Calculations" },
  { href: "/pro/verify", label: "Verify" },
];

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface-base" style={{ background: 'var(--color-surface-base)' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'var(--ambient-glow)' }} />
      
      {/* Top Navigation */}
      <header 
        className="sticky top-0 z-50 border-b"
        style={{ 
          background: 'var(--color-surface-raised)', 
          borderColor: 'var(--color-border-default)' 
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo + Pro Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-brand-primary)' }}
              >
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span 
                className="font-sans font-bold text-lg"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Creditax.ai
              </span>
            </Link>
            <Badge variant="brand">PRO PORTAL</Badge>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-btn text-sm font-medium transition-colors duration-150"
                  style={{ 
                    color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                    background: isActive ? 'var(--color-brand-primary-bg)' : 'transparent',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-btn -z-10"
                      style={{ background: 'var(--color-brand-primary-bg)' }}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Settings
            </Button>
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ 
                background: 'var(--color-brand-primary)', 
                color: 'var(--color-text-inverse)' 
              }}
            >
              AO
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}