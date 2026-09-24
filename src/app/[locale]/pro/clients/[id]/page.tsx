"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Download,
  Eye,
  FileText,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ProClient } from "@/ai/pro-portal";

const tabs = ["Overview", "Documents", "Filings", "Reports"] as const;
type Tab = (typeof tabs)[number];

interface ClientProfile {
  id: number;
  name: string;
  cac: string;
  tin: string;
  location: string;
  compliance: number;
  status: "active" | "alert" | "pending";
  industry: string;
  taxYear: string;
  assignedPro: string;
  email: string;
  phone: string;
  registrationDate: string;
  lastFiling: string;
}

const clientRoster: ClientProfile[] = [
  {
    id: 1, name: "Zenith Foods Ltd", cac: "RC-248571", tin: "1234567-0001",
    location: "Ikeja, Lagos, Nigeria", compliance: 94, status: "active",
    industry: "Food & Beverage", taxYear: "2024", assignedPro: "Adaeze Okonkwo",
    email: "finance@zenithfoods.com", phone: "+234 801 234 5678",
    registrationDate: "January 15, 2018", lastFiling: "March 31, 2025",
  },
  {
    id: 2, name: "Eko Logistics", cac: "RC-189432", tin: "9876543-0002",
    location: "Apapa, Lagos, Nigeria", compliance: 78, status: "alert",
    industry: "Logistics", taxYear: "2024", assignedPro: "Adaeze Okonkwo",
    email: "admin@ekologistics.ng", phone: "+234 802 555 0182",
    registrationDate: "March 2, 2016", lastFiling: "April 12, 2025",
  },
  {
    id: 3, name: "Marina Tech Ltd", cac: "RC-301287", tin: "5678901-0003",
    location: "Victoria Island, Lagos", compliance: 100, status: "active",
    industry: "Technology", taxYear: "2024", assignedPro: "Adaeze Okonkwo",
    email: "hello@marinatech.io", phone: "+234 803 777 4410",
    registrationDate: "July 19, 2019", lastFiling: "March 28, 2025",
  },
  {
    id: 4, name: "Okafor & Sons", cac: "RC-145678", tin: "2345678-0004",
    location: "Onitsha, Anambra", compliance: 85, status: "active",
    industry: "Trading", taxYear: "2024", assignedPro: "Adaeze Okonkwo",
    email: "contact@okaforandsons.com", phone: "+234 806 222 9031",
    registrationDate: "November 8, 2012", lastFiling: "March 30, 2025",
  },
  {
    id: 5, name: "Sunrise Bakery", cac: "RC-298761", tin: "3456789-0005",
    location: "Surulere, Lagos, Nigeria", compliance: 62, status: "pending",
    industry: "Food & Beverage", taxYear: "2024", assignedPro: "Adaeze Okonkwo",
    email: "bake@sunrisebakery.ng", phone: "+234 807 100 2245",
    registrationDate: "February 27, 2021", lastFiling: "April 18, 2025",
  },
];

const documents = [
  { id: 1, name: "Q1 2025 Invoice #1234", amount: "₦450,000", category: "Invoice", date: "Mar 15, 2025", status: "verified" },
  { id: 2, name: "Office Supplies Receipt", amount: "₦32,500", category: "Receipt", date: "Mar 12, 2025", status: "verified" },
  { id: 3, name: "Equipment Purchase", amount: "₦1,200,000", category: "Receipt", date: "Mar 10, 2025", status: "processing" },
  { id: 4, name: "Client Payment Receipt", amount: "₦2,500,000", category: "Receipt", date: "Mar 8, 2025", status: "verified" },
  { id: 5, name: "VAT Invoice #5678", amount: "₦180,000", category: "Tax Form", date: "Mar 5, 2025", status: "verified" },
  { id: 6, name: "Consulting Fee Invoice", amount: "₦850,000", category: "Invoice", date: "Mar 1, 2025", status: "issue" },
  { id: 7, name: "Bank Statement Feb", amount: "—", category: "Bank Statement", date: "Feb 28, 2025", status: "verified" },
  { id: 8, name: "Q4 2024 Invoice #1199", amount: "₦620,000", category: "Invoice", date: "Feb 20, 2025", status: "verified" },
];

const documentCategories = [
  { label: "All", count: 18 },
  { label: "Receipts", count: 7 },
  { label: "Invoices", count: 4 },
  { label: "Tax Forms", count: 3 },
  { label: "Bank Statements", count: 4 },
];

const filings = [
  { id: 1, period: "Q1 2025", type: "VAT Return", due: "Jun 21, 2025", status: "filed" },
  { id: 2, period: "Q1 2025", type: "WHT Remittance", due: "Jun 21, 2025", status: "filed" },
  { id: 3, period: "FY 2024", type: "Company Income Tax", due: "Jun 30, 2025", status: "draft" },
  { id: 4, period: "FY 2024", type: "Annual Return", due: "Jul 15, 2025", status: "pending" },
];

const reports = [
  { id: 1, name: "Compliance Summary — Q1 2025", generated: "Jun 18, 2025", size: "412 KB" },
  { id: 2, name: "VAT Position — May 2025", generated: "Jun 10, 2025", size: "288 KB" },
  { id: 3, name: "Annual Tax Estimate — FY 2025", generated: "May 30, 2025", size: "534 KB" },
];

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

const statusVariant: Record<ClientProfile["status"], "success" | "warning" | "error"> = {
  active: "success",
  pending: "warning",
  alert: "error",
};

const complianceTone = (value: number) =>
  value >= 80 ? "success" : value >= 60 ? "warning" : "error";

const toneBarClass: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

const toneTextClass: Record<string, string> = {
  success: "text-success-text",
  warning: "text-warning-text",
  error: "text-error-text",
};

const docStatusConfig: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "text-success-text",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    className: "text-warning-text",
  },
  issue: {
    label: "Issue",
    icon: AlertTriangle,
    className: "text-error-text",
  },
};

const filingVariant: Record<string, "success" | "warning" | "info"> = {
  filed: "success",
  draft: "info",
  pending: "warning",
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = Number(params.id) || 1;
  // P9 — the live client record from the pro store (by id), falling back to
  // the local roster when the API is unreachable or the id is out of range.
  const [liveClient, setLiveClient] = useState<ProClient | null>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(`/api/v1/pro/clients?proId=u-pro&id=${clientId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ProClient | null) => {
        if (!active || !d) return;
        setLiveClient(d);
        setLive(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [clientId]);

  const client = useMemo(
    () =>
      liveClient ??
      clientRoster.find((c) => c.id === clientId) ??
      clientRoster[0],
    [clientId, liveClient]
  );

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === "All" ||
      (activeCategory === "Receipts" && doc.category === "Receipt") ||
      (activeCategory === "Invoices" && doc.category === "Invoice") ||
      (activeCategory === "Tax Forms" && doc.category === "Tax Form") ||
      (activeCategory === "Bank Statements" && doc.category === "Bank Statement");
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tone = complianceTone(client.compliance);

  const infoRows: { label: string; value: string; className?: string }[] = [
    { label: "Industry", value: client.industry },
    { label: "Tax Year", value: client.taxYear },
    { label: "Assigned Pro", value: client.assignedPro },
    { label: "Email", value: client.email, className: "text-brand-primary" },
    { label: "Phone", value: client.phone },
    { label: "Registered", value: client.registrationDate },
    { label: "Last Filing", value: client.lastFiling, className: "text-success-text" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Back link */}
      <motion.div variants={item}>
        <Link
          href="/pro/clients"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronLeft size={14} />
          Back to clients
        </Link>
      </motion.div>

      {/* Client Header */}
      <motion.div variants={item}>
        <Card className="p-5 flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/avatars/avatar-${String((Number(client.id) % 10) + 1).padStart(2, "0")}.png`}
            alt=""
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0 border border-border-subtle"
          />
          <div className="flex-1 min-w-0">
            <h1 className="flex items-center gap-2 truncate">
              {client.name}
              {live && <Badge variant="info">live · demo_seed</Badge>}
            </h1>
            <p className="text-sm text-text-muted mt-0.5 font-mono">
              CAC {client.cac} · TIN {client.tin} · {client.location}
            </p>
          </div>
          <div className="text-center px-6 border-l border-border-subtle">
            <p className={cn("text-2xl font-mono font-bold", toneTextClass[tone])}>
              {client.compliance}%
            </p>
            <p className="text-xs uppercase tracking-wider text-text-muted">Compliance</p>
          </div>
          <Badge variant={statusVariant[client.status]}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
          <div className="flex items-center gap-1">
            <button
              aria-label={`Message ${client.name}`}
              title="Message client"
              onClick={() =>
                toast(`Message drafted for ${client.name}`, {
                  description: "Direct messaging lands in the Track B client inbox.",
                })
              }
              className="p-2 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
            >
              <MessageSquare size={16} />
            </button>
            <button
              aria-label={`Edit ${client.name}`}
              title="Edit client"
              onClick={() =>
                toast(`Edit ${client.name} (demo)`, {
                  description: "Client profile editing lands in the Track B pro workspace.",
                })
              }
              className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
            >
              <Pencil size={16} />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={item}>
        <div className="flex items-center gap-1 border-b border-border-default" role="tablist" aria-label="Client sections">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab
                  ? "text-brand-primary border-brand-primary"
                  : "text-text-muted border-transparent hover:text-text-primary hover:border-border-strong"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Overview ── */}
        {activeTab === "Overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-5">
                <h2 className="font-semibold text-text-primary mb-4">Client Information</h2>
                <div className="space-y-3">
                  {infoRows.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 text-sm">
                      <span className="text-text-muted">{row.label}</span>
                      <span className={cn("text-right text-text-secondary", row.className)}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-muted">Compliance Score</span>
                    <span className={cn("text-sm font-mono font-bold", toneTextClass[tone])}>
                      {client.compliance}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-surface-inset">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${client.compliance}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn("h-full rounded-full", toneBarClass[tone])}
                    />
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/marketplace/office-01.jpg"
                  alt=""
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex items-center gap-2 text-sm text-text-muted">
                  <MapPin size={14} />
                  {client.location}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="p-5">
                <h2 className="font-semibold text-text-primary mb-2">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/pro/calculations">
                    <Button variant="secondary" size="md" fullWidth className="justify-start">
                      <Calculator size={15} />
                      Calculate Tax Liability
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    className="justify-start"
                    onClick={() =>
                      toast(`Compliance report queued for ${client.name}`, {
                        description: 'Report generation runs on the Track B worker; results land in the Reports tab.',
                      })
                    }
                  >
                    <FileText size={15} />
                    Generate Compliance Report
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    className="justify-start"
                    onClick={() =>
                      toast(`Message drafted for ${client.name}`, {
                        description: 'Direct messaging lands in the Track B client inbox.',
                      })
                    }
                  >
                    <MessageSquare size={15} />
                    Message Client
                  </Button>
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="font-semibold text-text-primary mb-4">Recent Filings</h2>
                <div className="space-y-3">
                  {filings.slice(0, 3).map((filing) => (
                    <div key={filing.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-text-primary font-medium">{filing.type}</p>
                        <p className="text-xs text-text-muted">Due {filing.due}</p>
                      </div>
                      <Badge variant={filingVariant[filing.status]}>
                        {filing.status.charAt(0).toUpperCase() + filing.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("Filings")}
                  className="mt-4 text-sm font-medium text-brand-primary hover:underline cursor-pointer"
                >
                  View all filings
                </button>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ── Documents ── */}
        {activeTab === "Documents" && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              {documentCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={cn(
                    "px-3 py-1.5 rounded-badge text-sm font-medium border transition-colors cursor-pointer",
                    activeCategory === cat.label
                      ? "bg-brand-primary-bg border-brand-primary-border text-brand-primary"
                      : "bg-surface-inset border-transparent text-text-secondary hover:border-border-strong"
                  )}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}

              <div className="flex-1 min-w-[200px] max-w-xs ml-auto">
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
              </div>

              <select
                aria-label="Sort documents"
                className="h-10 px-3 rounded-input bg-surface-base border border-border-strong text-text-secondary text-sm font-medium"
              >
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Amount (high to low)</option>
                <option>Amount (low to high)</option>
              </select>

              <Link href="/dashboard/documents/upload">
                <Button variant="primary" size="md">
                  <Upload size={15} />
                  Upload Document
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-default bg-surface-inset">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Document</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 px-4 text-center text-sm text-text-muted">
                          No documents match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc) => {
                        const docStatus = docStatusConfig[doc.status];
                        const StatusIcon = docStatus.icon;
                        return (
                          <tr
                            key={doc.id}
                            className="border-b border-border-subtle last:border-0 hover:bg-hover-overlay transition-colors"
                          >
                            <td className="py-3 px-4 text-sm font-medium text-text-primary">{doc.name}</td>
                            <td className="py-3 px-4 text-sm font-mono text-text-secondary">{doc.amount}</td>
                            <td className="py-3 px-4">
                              <Badge variant="brand">{doc.category}</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-text-muted">{doc.date}</td>
                            <td className="py-3 px-4">
                              <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", docStatus.className)}>
                                <StatusIcon size={13} />
                                {docStatus.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <button
                                  aria-label={`View ${doc.name}`}
                                  title="View"
                                  onClick={() =>
                                    toast(`${doc.name} — viewer (demo)`, {
                                      description: "Document preview opens in the Track B viewer.",
                                    })
                                  }
                                  className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  aria-label={`Download ${doc.name}`}
                                  title="Download"
                                  onClick={() =>
                                    toast(`Downloading ${doc.name} (demo)`, {
                                      description: "Files stream from Backblaze B2 on Track B.",
                                    })
                                  }
                                  className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                                >
                                  <Download size={15} />
                                </button>
                                <button
                                  aria-label={`More actions for ${doc.name}`}
                                  title="More actions"
                                  onClick={() =>
                                    toast(`More actions for ${doc.name} (demo)`, {
                                      description: "Document management menu lands on Track B.",
                                    })
                                  }
                                  className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                                >
                                  <MoreHorizontal size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Filings ── */}
        {activeTab === "Filings" && (
          <motion.div
            key="filings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-default bg-surface-inset">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Period</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Filing</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Due Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filings.map((filing) => (
                      <tr
                        key={filing.id}
                        className="border-b border-border-subtle last:border-0 hover:bg-hover-overlay transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-mono text-text-secondary">{filing.period}</td>
                        <td className="py-3 px-4 text-sm font-medium text-text-primary">{filing.type}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{filing.due}</td>
                        <td className="py-3 px-4">
                          <Badge variant={filingVariant[filing.status]}>
                            {filing.status.charAt(0).toUpperCase() + filing.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              aria-label={`View ${filing.type} filing`}
                              title="View"
                              onClick={() =>
                                toast(`Viewing ${filing.type} filing (demo)`, {
                                  description: "Filing details render in the Track B filing viewer.",
                                })
                              }
                              className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              aria-label={`Download ${filing.type} filing`}
                              title="Download"
                              onClick={() =>
                                toast(`Downloading ${filing.type} filing (demo)`, {
                                  description: "Filing PDFs export from the Track B document pipeline.",
                                })
                              }
                              className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                            >
                              <Download size={15} />
                            </button>
                            <button
                              aria-label={`More actions for ${filing.type} filing`}
                              title="More actions"
                              onClick={() =>
                                toast(`More actions for ${filing.type} (demo)`, {
                                  description: "Filing management menu lands on Track B.",
                                })
                              }
                              className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Reports ── */}
        {activeTab === "Reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {reports.map((report) => (
              <Card key={report.id} className="p-4 flex flex-wrap items-center gap-4">
                <div className="w-10 h-10 rounded-btn bg-brand-primary-bg flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{report.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Generated {report.generated} · {report.size}
                  </p>
                </div>
                <button
                  aria-label={`Download ${report.name}`}
                  title="Download"
                  onClick={() =>
                    toast(`Downloading ${report.name} (demo)`, {
                      description: "Report PDFs export from the Track B document pipeline.",
                    })
                  }
                  className="p-2 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                >
                  <Download size={16} />
                </button>
                <button
                  aria-label={`More actions for ${report.name}`}
                  title="More actions"
                  onClick={() =>
                    toast(`More actions for ${report.name} (demo)`, {
                      description: "Report management menu lands on Track B.",
                    })
                  }
                  className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                >
                  <MoreHorizontal size={16} />
                </button>
              </Card>
            ))}

            <Card className="p-6 flex flex-col items-center text-center border-dashed">
              <div className="w-10 h-10 rounded-full bg-surface-inset flex items-center justify-center mb-3">
                <Plus size={18} className="text-text-muted" />
              </div>
              <p className="text-sm font-medium text-text-primary">Generate a new report</p>
              <p className="text-xs text-text-muted mt-0.5 mb-4">
                Compliance summaries, VAT positions, and annual estimates
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() =>
                  toast(`Compliance report queued for ${client.name}`, {
                    description: 'Report generation runs on the Track B worker; results land in the Reports tab.',
                  })
                }
              >
                <FileText size={15} />
                Generate Compliance Report
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
