"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Plus,
  Trash2,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ProClient } from "@/ai/pro-portal";

interface Client {
  id: number;
  name: string;
  cac: string;
  tin: string;
  compliance: number;
  lastActivity: string;
  status: "active" | "alert" | "pending";
}

/** Map the store's ProClient (string id) to the page's numeric Client shape. */
function toClient(p: ProClient): Client {
  return {
    id: Number(p.id),
    name: p.name,
    cac: p.cac,
    tin: p.tin,
    compliance: p.compliance,
    lastActivity: p.lastActivity,
    status: p.status,
  };
}

const allClients: Client[] = [
  { id: 1, name: "Zenith Foods Ltd", cac: "RC-248571", tin: "1234567-0001", compliance: 94, lastActivity: "2 min ago", status: "active" },
  { id: 2, name: "Eko Logistics", cac: "RC-189432", tin: "9876543-0002", compliance: 78, lastActivity: "15 min ago", status: "alert" },
  { id: 3, name: "Marina Tech Ltd", cac: "RC-301287", tin: "5678901-0003", compliance: 100, lastActivity: "1 hr ago", status: "active" },
  { id: 4, name: "Okafor & Sons", cac: "RC-145678", tin: "2345678-0004", compliance: 85, lastActivity: "3 hr ago", status: "active" },
  { id: 5, name: "Sunrise Bakery", cac: "RC-298761", tin: "3456789-0005", compliance: 62, lastActivity: "5 hr ago", status: "pending" },
  { id: 6, name: "Apex Construction", cac: "RC-167234", tin: "4567890-0006", compliance: 91, lastActivity: "1 day ago", status: "active" },
  { id: 7, name: "Delta Pharmaceuticals", cac: "RC-289034", tin: "5678902-0007", compliance: 45, lastActivity: "2 days ago", status: "alert" },
  { id: 8, name: "Golden Investments", cac: "RC-345671", tin: "6789012-0008", compliance: 88, lastActivity: "3 days ago", status: "active" },
  { id: 9, name: "Horizon Logistics", cac: "RC-198723", tin: "7890123-0009", compliance: 73, lastActivity: "4 days ago", status: "pending" },
  { id: 10, name: "Ibrahim & Co", cac: "RC-256789", tin: "8901234-0010", compliance: 96, lastActivity: "5 days ago", status: "active" },
  { id: 11, name: "Jasmine Textiles", cac: "RC-312456", tin: "9012345-0011", compliance: 67, lastActivity: "1 week ago", status: "pending" },
  { id: 12, name: "Kano Ventures", cac: "RC-278934", tin: "0123456-0012", compliance: 82, lastActivity: "1 week ago", status: "active" },
];

const statusOptions = ["All", "Active", "Pending", "Alert"];
const complianceOptions = ["All", "High (80%+)", "Medium (60-79%)", "Low (<60%)"];

const statusVariant: Record<Client["status"], "success" | "warning" | "error"> = {
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

function downloadCsv(rows: Client[], fileName: string) {
  const header = "Name,CAC Number,TIN,Status,Compliance %,Last Activity";
  const body = rows.map((c) =>
    [c.name, c.cac, c.tin, c.status, String(c.compliance), c.lastActivity].join(",")
  );
  const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(allClients);
  const [live, setLive] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [complianceFilter, setComplianceFilter] = useState("All");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // P9 — hydrate the client book from the pro store (demo_seed); offline keeps
  // the allClients fallback so the list is never empty.
  useEffect(() => {
    let active = true;
    fetch("/api/v1/pro/clients?proId=u-pro")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { clients?: ProClient[] } | null) => {
        if (!active || !d?.clients?.length) return;
        setClients(d.clients.map(toClient));
        setLive(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.cac.toLowerCase().includes(search.toLowerCase()) ||
      client.tin.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || client.status === statusFilter.toLowerCase();

    const matchesCompliance =
      complianceFilter === "All" ||
      (complianceFilter === "High (80%+)" && client.compliance >= 80) ||
      (complianceFilter === "Medium (60-79%)" && client.compliance >= 60 && client.compliance < 80) ||
      (complianceFilter === "Low (<60%)" && client.compliance < 60);

    return matchesSearch && matchesStatus && matchesCompliance;
  });

  const totalPages = Math.ceil(filteredClients.length / perPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const toggleClient = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedClients.length === paginatedClients.length && paginatedClients.length > 0) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients.map((c) => c.id));
    }
  };

  const deleteSelected = () => {
    setClients((prev) => prev.filter((c) => !selectedClients.includes(c.id)));
    setSelectedClients([]);
    setCurrentPage(1);
  };

  const exportSelected = () => {
    const rows = clients.filter((c) => selectedClients.includes(c.id));
    downloadCsv(rows, "creditax-clients.csv");
  };

  const showingFrom = filteredClients.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const showingTo = Math.min(currentPage * perPage, filteredClients.length);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icons/icon-team-invite.png"
            alt=""
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          <h1>Clients</h1>
          <Badge variant="brand">{clients.length}</Badge>
          {live && <Badge variant="info">live · demo_seed</Badge>}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => downloadCsv(filteredClients, "creditax-clients.csv")}
          >
            <Download size={15} />
            Export CSV
          </Button>
          <Link href="/pro/verify">
            <Button variant="primary" size="md">
              <Plus size={15} />
              Add Client
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[220px] max-w-md">
          <Input
            placeholder="Search clients, CAC, TIN..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter by status"
          className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm font-medium"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          value={complianceFilter}
          onChange={(e) => {
            setComplianceFilter(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter by compliance"
          className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm font-medium"
        >
          {complianceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <span className="text-sm text-text-muted ml-auto">
          Showing {showingFrom}–{showingTo} of {filteredClients.length}
        </span>
      </motion.div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedClients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 flex flex-wrap items-center gap-3">
              <span className="font-medium text-text-primary">
                {selectedClients.length} clients selected
              </span>
              <Button variant="secondary" size="sm" onClick={exportSelected}>
                <Download size={14} />
                Export CSV
              </Button>
              <Button variant="danger" size="sm" onClick={deleteSelected}>
                <Trash2 size={14} />
                Delete Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setSelectedClients([])}
                aria-label="Clear selection"
              >
                <X size={14} />
                Clear
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-inset">
                  <th className="py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedClients.length === paginatedClients.length && paginatedClients.length > 0}
                      onChange={toggleAll}
                      aria-label="Select all clients on this page"
                      className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">CAC Number</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Compliance</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Last Activity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 px-4 text-center text-sm text-text-muted">
                      No clients match your filters. Try a different search or filter.
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((client) => {
                    const tone = complianceTone(client.compliance);
                    return (
                      <tr
                        key={client.id}
                        className="border-b border-border-subtle last:border-0 hover:bg-hover-overlay transition-colors"
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => toggleClient(client.id)}
                            aria-label={`Select ${client.name}`}
                            className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/images/avatars/avatar-${String((client.id % 10) + 1).padStart(2, "0")}.png`}
                              alt=""
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border-subtle"
                            />
                            <span className="text-sm font-medium text-text-primary">{client.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-text-secondary">{client.cac}</td>
                        <td className="py-3 px-4">
                          <Badge variant={statusVariant[client.status]}>
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden bg-surface-inset">
                              <div
                                className={cn("h-full rounded-full", toneBarClass[tone])}
                                style={{ width: `${client.compliance}%` }}
                              />
                            </div>
                            <span className={cn("text-sm font-mono font-medium", toneTextClass[tone])}>
                              {client.compliance}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-muted">{client.lastActivity}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/pro/clients/${client.id}`}
                              aria-label={`View ${client.name}`}
                              title="View"
                              className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              aria-label={`Edit ${client.name}`}
                              title="Edit"
                              onClick={() =>
                                toast(`Edit ${client.name} (demo)`, {
                                  description: "Client profile editing lands in the Track B pro workspace.",
                                })
                              }
                              className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              aria-label={`More actions for ${client.name}`}
                              title="More actions"
                              onClick={() =>
                                toast(`More actions for ${client.name} (demo)`, {
                                  description: "Client management menu lands on Track B.",
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

          {/* Table Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border-default bg-surface-inset">
            <span className="text-sm text-text-muted">
              Showing {showingFrom}–{showingTo} of {filteredClients.length} clients
            </span>

            <div className="flex items-center gap-2">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Clients per page"
                className="h-8 px-2 rounded text-sm border border-border-default bg-surface-base text-text-secondary"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                      className={cn(
                        "w-8 h-8 rounded-btn text-sm font-medium transition-colors cursor-pointer",
                        currentPage === pageNum
                          ? "bg-brand-primary text-text-inverse"
                          : "text-text-secondary hover:bg-hover-overlay"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
