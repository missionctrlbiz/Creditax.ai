"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileBadge,
  FileCheck2,
  FileUp,
  Hash,
  Info,
  Loader2,
  Search,
  ShieldCheck,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import type { ProVerification } from "@/ai/pro-portal";

type StepId = "lookup" | "details" | "certificate" | "submit";

const steps: { id: StepId; label: string; icon: typeof Hash }[] = [
  { id: "lookup", label: "Registry Lookup", icon: Hash },
  { id: "details", label: "Business Details", icon: Building2 },
  { id: "certificate", label: "Certificate", icon: FileUp },
  { id: "submit", label: "Review & Submit", icon: ClipboardCheck },
];

const verificationTypes = [
  { id: "tin", label: "TIN (Company)", icon: Building2 },
  { id: "bvn", label: "BVN (Individual)", icon: User },
  { id: "compliance", label: "Tax Compliance Certificate", icon: FileBadge },
];

interface VerificationResult {
  name: string;
  cac: string;
  tin: string;
  registrationType: string;
  status: string;
  address: string;
  lastFilingDate: string;
  filingStatus: string;
  complianceRate: number;
  outstandingLiabilities: string;
}

const verificationResults: Record<string, VerificationResult> = {
  tin: {
    name: "Zenith Foods Ltd",
    cac: "RC-248571",
    tin: "1234567-0001",
    registrationType: "Limited Liability Company",
    status: "active",
    address: "14 Oba Akran Avenue, Ikeja, Lagos",
    lastFilingDate: "March 31, 2025",
    filingStatus: "On time",
    complianceRate: 94,
    outstandingLiabilities: "₦0",
  },
  bvn: {
    name: "Adaeze Okonkwo",
    cac: "—",
    tin: "—",
    registrationType: "Individual",
    status: "active",
    address: "Lagos, Nigeria",
    lastFilingDate: "April 30, 2025",
    filingStatus: "On time",
    complianceRate: 91,
    outstandingLiabilities: "₦0",
  },
  compliance: {
    name: "Zenith Foods Ltd",
    cac: "RC-248571",
    tin: "1234567-0001",
    registrationType: "Limited Liability Company",
    status: "active",
    address: "14 Oba Akran Avenue, Ikeja, Lagos",
    lastFilingDate: "March 31, 2025",
    filingStatus: "On time",
    complianceRate: 94,
    outstandingLiabilities: "₦0",
  },
};

const typeMeta: Record<string, { inputLabel: string; placeholder: string; hint: string }> = {
  tin: {
    inputLabel: "CAC Registration Number",
    placeholder: "RC-248571",
    hint: "Format: RC-1234567 — assigned by the Corporate Affairs Commission",
  },
  bvn: {
    inputLabel: "Bank Verification Number",
    placeholder: "12345678901",
    hint: "Format: 11-digit BVN assigned by CBN",
  },
  compliance: {
    inputLabel: "TIN or CAC Number",
    placeholder: "1234567-0001",
    hint: "Format: 8-digit FIRS TIN (1234567-0001) or CAC number (RC-248571)",
  },
};

const recentSearches = ["RC-248571", "0987654-0002", "5432198-0003"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VerifyPage() {
  const [activeType, setActiveType] = useState("tin");
  const [queryInput, setQueryInput] = useState("RC-248571");
  const [step, setStep] = useState<StepId>("lookup");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [certificate, setCertificate] = useState<{ name: string; size: string } | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  // P9 — the pro's live verification record (own CAC + per-client checks).
  const [liveVerif, setLiveVerif] = useState<ProVerification | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/pro/verify?proId=u-pro")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ProVerification | null) => {
        if (!active || !d) return;
        setLiveVerif(d);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const meta = typeMeta[activeType];

  const handleVerify = () => {
    setIsVerifying(true);
    window.setTimeout(() => {
      setIsVerifying(false);
      setResult(verificationResults[activeType]);
      setStep("details");
    }, 1200);
  };

  const handleCertificateFile = (file: { name: string; size: number }) => {
    setCertificate({ name: file.name, size: formatFileSize(file.size) });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleCertificateFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCertificateFile(file);
  };

  const resetFlow = () => {
    setStep("lookup");
    setResult(null);
    setCertificate(null);
    setSubmittedAt(null);
  };

  const handleSubmit = () => {
    setSubmittedAt(
      new Date().toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1>Verify Client</h1>
        <p className="text-text-muted text-sm mt-1">
          Verify Nigerian business registrations and tax compliance status via CAC and FIRS records.
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div variants={item}>
        <Card className="p-4 flex flex-wrap items-center gap-3 border-info-border bg-info-bg">
          <Info size={16} className="text-info-text flex-shrink-0" />
          <p className="flex-1 min-w-[240px] text-sm text-text-secondary">
            Verification queries count toward your API usage. Each TIN/BVN lookup uses 1 API call. Results are cached for 24 hours.
          </p>
          <Link
            href="/pro/settings"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline flex-shrink-0"
          >
            View Usage
            <ArrowUpRight size={14} />
          </Link>
        </Card>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={item}>
        <Card className="p-5">
          <ol className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isComplete = i < currentStepIndex;
              const isActive = i === currentStepIndex;
              return (
                <li
                  key={s.id}
                  aria-current={isActive ? "step" : undefined}
                  className="flex items-center gap-3 md:flex-1 last:flex-none"
                >
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                      ${isComplete
                        ? "bg-brand-primary text-text-inverse"
                        : isActive
                        ? "bg-brand-primary text-text-inverse ring-4 ring-brand-primary/30"
                        : "bg-surface-inset text-text-muted"}
                    `}
                  >
                    {isComplete ? <Check size={16} /> : <StepIcon size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isActive || isComplete ? "text-text-primary" : "text-text-muted"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="text-xs text-text-muted">Step {i + 1} of {steps.length}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block flex-1 h-px bg-border-default mx-4" />
                  )}
                </li>
              );
            })}
          </ol>
        </Card>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* ── Step 1: Registry Lookup ── */}
        {step === "lookup" && (
          <motion.div
            key="lookup"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h2 className="font-semibold text-text-primary mb-4">Verification Type</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {verificationTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      aria-pressed={activeType === type.id}
                      className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-badge text-sm font-medium border transition-colors cursor-pointer
                        ${activeType === type.id
                          ? "bg-brand-primary-bg border-brand-primary-border text-brand-primary"
                          : "bg-surface-inset border-transparent text-text-secondary hover:border-border-strong"}
                      `}
                    >
                      <TypeIcon size={14} />
                      {type.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <Input
                  label={meta.inputLabel}
                  placeholder={meta.placeholder}
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  hint={meta.hint}
                  className="font-mono"
                />

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleVerify}
                  disabled={isVerifying || queryInput.trim().length === 0}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Verify
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Recent Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQueryInput(search)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-badge text-sm font-mono bg-surface-inset border border-border-subtle text-text-secondary hover:border-border-strong transition-colors cursor-pointer"
                    >
                      <Search size={12} />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 flex items-center justify-center min-h-[320px] border-dashed">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-surface-inset">
                  <ShieldCheck size={24} className="text-text-muted" />
                </div>
                <p className="font-medium text-text-primary mb-1">No verification result yet</p>
                <p className="text-sm text-text-muted max-w-[260px]">
                  Enter a CAC number or TIN and run the lookup to pull registry records.
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Step 2: Business Details ── */}
        {step === "details" && result && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-text-inverse font-bold">
                    {result.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-text-primary truncate">{result.name}</h2>
                  <p className="text-sm text-text-muted font-mono">{result.cac}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Registration Type", value: result.registrationType, mono: false },
                  { label: "CAC Number", value: result.cac, mono: true },
                  { label: "TIN", value: result.tin, mono: true },
                  { label: "Last Filing", value: `${result.lastFilingDate} · ${result.filingStatus}`, mono: false },
                  { label: "Outstanding Liabilities", value: result.outstandingLiabilities, mono: true },
                  { label: "Registered Address", value: result.address, mono: false },
                ].map((field) => (
                  <div key={field.label} className="p-3 rounded-btn bg-surface-inset">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{field.label}</p>
                    <p className={`text-sm font-medium text-text-primary ${field.mono ? "font-mono" : ""}`}>
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-btn bg-surface-inset flex items-center gap-3">
                <span className="text-sm text-text-muted">Compliance rate</span>
                <div className="flex-1 h-1.5 rounded-full bg-surface-deep overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: `${result.complianceRate}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-bold text-success-text">
                  {result.complianceRate}%
                </span>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-center">
              <h2 className="font-semibold text-text-primary mb-2">Confirm these details</h2>
              <p className="text-sm text-text-muted mb-6">
                Registry records are pulled from CAC and FIRS. If the details look correct, continue to attach the
                CAC certificate for the client file.
              </p>
              <div className="space-y-3">
                <Button variant="primary" size="lg" fullWidth onClick={() => setStep("certificate")}>
                  Confirm &amp; Continue
                  <ChevronRight size={16} />
                </Button>
                <Button variant="ghost" size="lg" fullWidth onClick={() => setStep("lookup")}>
                  <ChevronLeft size={16} />
                  Run Another Lookup
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Step 3: Certificate ── */}
        {step === "certificate" && result && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h2 className="font-semibold text-text-primary mb-4">CAC Certificate</h2>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`
                  rounded-card border-2 border-dashed h-[220px] flex flex-col items-center justify-center
                  text-center p-8 transition-colors relative overflow-hidden
                  ${dragOver ? "border-brand-primary bg-brand-primary-bg" : "border-border-strong hover:border-brand-primary/60"}
                `}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/dashboard/verify-empty.png"
                  alt=""
                  aria-hidden
                  className="absolute right-6 bottom-4 w-20 h-20 object-contain opacity-30 pointer-events-none hidden md:block"
                />
                <input
                  type="file"
                  id="certificate-input"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-brand-primary mb-4">
                  <Upload size={40} strokeWidth={1.4} />
                </div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  Drag &amp; drop the certificate here
                </p>
                <p className="text-xs text-text-muted mb-3">or</p>
                <label
                  htmlFor="certificate-input"
                  className="inline-flex items-center gap-1.5 px-5 h-10 rounded-btn border border-border-brand text-brand-primary font-semibold text-sm cursor-pointer hover:bg-brand-primary-bg transition-colors relative z-10"
                >
                  <FileUp size={14} />
                  Browse Files
                </label>
                <p className="text-xs text-text-muted mt-3">PDF, JPG or PNG · max 10 MB</p>
              </div>

              <AnimatePresence>
                {certificate && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 rounded-btn bg-success-bg border border-success-border flex items-center gap-3"
                  >
                    <FileCheck2 size={18} className="text-success-text flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{certificate.name}</p>
                      <p className="text-xs text-success-text">{certificate.size} · ready to attach</p>
                    </div>
                    <button
                      onClick={() => setCertificate(null)}
                      aria-label="Remove certificate"
                      title="Remove"
                      className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                    >
                      <XCircle size={15} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card className="p-6 flex flex-col justify-center">
              <h2 className="font-semibold text-text-primary mb-2">Attach for {result.name}</h2>
              <p className="text-sm text-text-muted mb-6">
                The certificate is stored with the client file and shown on the audit trail. You can continue without
                one and attach it later.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep("submit")}
                >
                  {certificate ? "Attach & Continue" : "Continue Without Certificate"}
                  <ChevronRight size={16} />
                </Button>
                <Button variant="ghost" size="lg" fullWidth onClick={() => setStep("details")}>
                  <ChevronLeft size={16} />
                  Back to Details
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Step 4: Review & Submit ── */}
        {step === "submit" && result && (
          <motion.div
            key="submit"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h2 className="font-semibold text-text-primary mb-4">Submission Summary</h2>
              <div className="space-y-3">
                {[
                  { label: "Verification Type", value: verificationTypes.find((t) => t.id === activeType)!.label },
                  { label: "Query", value: queryInput },
                  { label: "Business", value: result.name },
                  { label: "CAC Number", value: result.cac },
                  { label: "Certificate", value: certificate ? `${certificate.name} (${certificate.size})` : "Not attached" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">{row.label}</span>
                    <span className="text-right font-medium text-text-primary break-all">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex items-center gap-3">
                {submittedAt ? (
                  <>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-badge text-sm font-medium bg-warning-bg border border-warning-border text-warning-text">
                      <Clock size={14} />
                      Pending review
                    </span>
                    <span className="text-xs text-text-muted">Submitted {submittedAt}</span>
                  </>
                ) : (
                  <p className="text-sm text-text-muted">
                    Submit to queue this verification for review. Reviews usually complete within 24 hours.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-center">
              <h2 className="font-semibold text-text-primary mb-2">Submit verification</h2>
              <p className="text-sm text-text-muted mb-6">
                Once submitted, the verification appears in the client file and the audit log with a pending status.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={submittedAt !== null}
                >
                  {submittedAt ? (
                    <>
                      <CheckCircle2 size={16} />
                      Submitted
                    </>
                  ) : (
                    <>
                      <ClipboardCheck size={16} />
                      Submit for Verification
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="lg" fullWidth onClick={() => setStep("certificate")}>
                  <ChevronLeft size={16} />
                  Back to Certificate
                </Button>
                <Button variant="ghost" size="lg" fullWidth onClick={resetFlow}>
                  Start a New Verification
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Reference Cards — P9: live per-client checks from the verify store */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text-primary">Recent Verification Status</h2>
          {liveVerif && (
            <Badge variant="info">
              CAC {liveVerif.cacNumber} · {liveVerif.status} · {liveVerif.cacLookup}
            </Badge>
          )}
        </div>
        {liveVerif ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {liveVerif.clientChecks.map((chk) => {
              const tone =
                chk.result === "matched"
                  ? { border: "border-success-border", bg: "bg-success-bg", text: "text-success-text", label: "Verified", icon: CheckCircle2 }
                  : chk.result === "not_found"
                    ? { border: "border-warning-border", bg: "bg-warning-bg", text: "text-warning-text", label: "Pending", icon: Clock }
                    : { border: "border-error-border", bg: "bg-error-bg", text: "text-error-text", label: "Mismatch", icon: XCircle };
              const Icon = tone.icon;
              return (
                <Card key={chk.client} className={`p-4 ${tone.border} ${tone.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className={tone.text} />
                    <span className={`text-sm font-semibold ${tone.text}`}>
                      {tone.label} · {chk.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-text-primary">{chk.client}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {chk.result === "matched" ? "registry match confirmed" : chk.result === "not_found" ? "record not found — resubmit" : "details mismatch — review required"}
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-success-border bg-success-bg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-success-text" />
                <span className="text-sm font-semibold text-success-text">Verified</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Zenith Foods Ltd</p>
              <p className="text-xs text-text-muted mt-0.5">RC-248571 · verified Jun 18, 2025</p>
            </Card>
            <Card className="p-4 border-warning-border bg-warning-bg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-warning-text" />
                <span className="text-sm font-semibold text-warning-text">Pending</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Eko Logistics</p>
              <p className="text-xs text-text-muted mt-0.5">RC-189432 · awaiting certificate</p>
            </Card>
            <Card className="p-4 border-error-border bg-error-bg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={16} className="text-error-text" />
                <span className="text-sm font-semibold text-error-text">Rejected</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Delta Pharmaceuticals</p>
              <p className="text-xs text-text-muted mt-0.5">RC-289034 · CAC number not found</p>
            </Card>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
