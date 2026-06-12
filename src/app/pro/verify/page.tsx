"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

const verificationTypes = [
  { id: "tin", label: "TIN Verification (Company)", icon: "🏢" },
  { id: "bvn", label: "BVN Verification (Individual)", icon: "👤" },
  { id: "compliance", label: "Tax Compliance Certificate", icon: "📋" },
];

const recentSearches = [
  "1234567-0001",
  "0987654-0002",
  "5432198-0003",
];

const verificationResult = {
  name: "Zenith Foods Ltd",
  initials: "ZF",
  cac: "RC-248571",
  tin: "1234567-0001",
  status: "active",
  registrationType: "Limited Liability Company",
  lastFilingDate: "March 31, 2025",
  filingStatus: "On time ✓",
  complianceRate: 94,
  outstandingLiabilities: "₦0",
  certificateValidUntil: "December 31, 2025",
  certificateProgress: 85,
};

export default function VerifyPage() {
  const [activeType, setActiveType] = useState("tin");
  const [tinInput, setTinInput] = useState("1234567-0001");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowResult(true);
    }, 1500);
  };

  const _removeRecentSearch = (search: string) => {
    // In real app, would remove from recent searches
    void search; // suppress unused warning
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          🛡 Verify Client
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Verify Nigerian business registrations and tax compliance status via FIRS and CAC APIs.
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="p-4 mb-6" accent="info">
          <div className="flex items-start gap-3">
            <span className="text-lg">ℹ️</span>
            <div className="flex-1">
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Verification queries count toward your API usage. Each TIN/BVN lookup = 1 API call. Results are cached for 24 hours.
              </p>
            </div>
            <a 
              href="#" 
              className="text-sm font-medium hover:underline flex-shrink-0"
              style={{ color: 'var(--color-brand-primary)' }}
            >
              View Usage →
            </a>
          </div>
        </Card>
      </motion.div>

      {/* Verification Type Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        {verificationTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: activeType === type.id ? 'var(--color-text-primary)' : 'var(--color-surface-inset)',
              color: activeType === type.id ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
            }}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </motion.div>

      {/* Query Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Input Panel */}
        <Card className="p-6">
          <h3 
            className="font-semibold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {activeType === 'tin' ? 'Tax Identification Number (TIN)' : 
             activeType === 'bvn' ? 'Bank Verification Number (BVN)' : 
             'Company Registration Number'}
          </h3>

          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="1234567-0001"
                value={tinInput}
                onChange={(e) => setTinInput(e.target.value)}
                className="pr-20"
              />
              <span 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                TIN
              </span>
            </div>

            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {activeType === 'tin' 
                ? 'Format: 8-digit TIN assigned by FIRS. Example: 1234567-0001'
                : activeType === 'bvn'
                ? 'Format: 11-digit BVN assigned by CBN. Example: 12345678901'
                : 'Format: CAC Registration Number. Example: RC-248571'}
            </p>

            <Button 
              variant="primary" 
              size="xl" 
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Verifying...
                </span>
              ) : (
                "Verify →"
              )}
            </Button>
          </div>

          {/* Recent Searches */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <p 
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Recent Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setTinInput(search)}
                  className="px-3 py-1.5 rounded-full text-sm font-mono transition-colors hover:bg-surface-inset"
                  style={{ 
                    background: 'var(--color-surface-inset)', 
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  {search} ×
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results Panel */}
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-6 h-full flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'var(--color-surface-inset)' }}
                  >
                    <span className="text-2xl">🔍</span>
                  </div>
                  <p 
                    className="font-medium mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    No verification result
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Enter a TIN or BVN and click Verify
                  </p>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-6 border-2" style={{ borderColor: 'var(--color-success-border)' }}>
                {/* Result Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ 
                      background: 'var(--color-brand-primary)', 
                      color: 'var(--color-text-inverse)' 
                    }}
                  >
                    {verificationResult.initials}
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {verificationResult.name}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {verificationResult.cac}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="success" className="text-sm px-3 py-1">● Active</Badge>
                    <Badge variant="brand" className="text-xs">FIRS Verified ✓</Badge>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-inset)' }}>
                    <p 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Registration Type
                    </p>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {verificationResult.registrationType}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-inset)' }}>
                    <p 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      CAC Number
                    </p>
                    <p 
                      className="text-sm font-mono font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {verificationResult.cac}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-inset)' }}>
                    <p 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      TIN
                    </p>
                    <p 
                      className="text-sm font-mono font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {verificationResult.tin}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-inset)' }}>
                    <p 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Last Filing Date
                    </p>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-success)' }}
                    >
                      {verificationResult.lastFiling} {verificationResult.filingStatus}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-inset)' }}>
                    <p 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Compliance Rate
                    </p>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-lg font-bold"
                        style={{ color: 'var(--color-success)' }}
                      >
                        {verificationResult.complianceRate}%
                      </span>
                      <div 
                        className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'var(--color-surface-deep)' }}
                      >
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${verificationResult.complianceRate}%`,
                            background: 'var(--color-success)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-inset)' }}>
                    <p 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Outstanding Liabilities
                    </p>
                    <p 
                      className="text-lg font-bold"
                      style={{ color: 'var(--color-success)' }}
                    >
                      {verificationResult.outstandingLiabilities}
                    </p>
                  </div>
                </div>

                {/* Tax Clearance Certificate */}
                <div 
                  className="p-4 rounded-lg mb-6"
                  style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="font-medium"
                      style={{ color: 'var(--color-success-text)' }}
                    >
                      Tax Clearance Certificate
                    </span>
                    <span 
                      className="text-sm"
                      style={{ color: 'var(--color-success-text)' }}
                    >
                      Valid until {verificationResult.certificateValidUntil}
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-surface-inset)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${verificationResult.certificateProgress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--color-success)' }}
                    />
                  </div>
                  <p 
                    className="text-xs mt-2"
                    style={{ color: 'var(--color-success-text)' }}
                  >
                    {verificationResult.certificateProgress}% validity remaining
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="brand" size="md" className="flex-1">
                    ↓ Download Certificate
                  </Button>
                  <Button variant="primary" size="md" className="flex-1">
                    Save to Client File
                  </Button>
                  <Button variant="ghost" size="md">
                    Share with Client
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}