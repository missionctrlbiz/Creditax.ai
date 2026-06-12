"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

const allClients = [
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

const statusOptions = ["All", "Active", "Pending", "Inactive", "Alert"];
const complianceOptions = ["All", "High (80%+)", "Medium (60-79%)", "Low (<60%)"];
const lastActiveOptions = ["All", "Today", "This Week", "This Month", "Overdue"];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [complianceFilter, setComplianceFilter] = useState("All");
  const [lastActiveFilter, setLastActiveFilter] = useState("All");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filteredClients = allClients.filter((client) => {
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
    if (selectedClients.length === paginatedClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients.map((c) => c.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <h1 
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Clients
          </h1>
          <Badge variant="brand">{allClients.length}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="md">
            ↓ Export CSV
          </Button>
          <Button variant="primary" size="md">
            Add Client +
          </Button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-4 mb-6"
      >
        <div className="w-80">
          <Input
            placeholder="Search clients, CAC, TIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-12 px-4 rounded-input border text-sm font-medium bg-surface-base"
          style={{ 
            borderColor: 'var(--color-border-strong)', 
            color: 'var(--color-text-primary)',
            background: 'var(--color-surface-base)'
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          value={complianceFilter}
          onChange={(e) => setComplianceFilter(e.target.value)}
          className="h-12 px-4 rounded-input border text-sm font-medium bg-surface-base"
          style={{ 
            borderColor: 'var(--color-border-strong)', 
            color: 'var(--color-text-primary)',
            background: 'var(--color-surface-base)'
          }}
        >
          {complianceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          value={lastActiveFilter}
          onChange={(e) => setLastActiveFilter(e.target.value)}
          className="h-12 px-4 rounded-input border text-sm font-medium bg-surface-base"
          style={{ 
            borderColor: 'var(--color-border-strong)', 
            color: 'var(--color-text-primary)',
            background: 'var(--color-surface-base)'
          }}
        >
          {lastActiveOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <span 
          className="text-sm ml-auto"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Showing {Math.min((currentPage - 1) * perPage + 1, filteredClients.length)}–{Math.min(currentPage * perPage, filteredClients.length)} of {filteredClients.length}
        </span>
      </motion.div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedClients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Card className="p-4 flex items-center gap-4">
              <span 
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {selectedClients.length} clients selected
              </span>
              <button 
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-brand-primary)' }}
              >
                Export CSV
              </button>
              <button 
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-error)' }}
              >
                Delete Selected
              </button>
              <button 
                className="text-sm font-medium hover:underline ml-auto"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={() => setSelectedClients([])}
              >
                Clear ✕
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-inset)' }}>
                  <th className="py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedClients.length === paginatedClients.length && paginatedClients.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: 'var(--color-brand-primary)' }}
                    />
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Client
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    CAC Number
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Status
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Compliance
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Last Activity
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client, i) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                    className="hover:bg-surface-inset transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => toggleClient(client.id)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: 'var(--color-brand-primary)' }}
                      />
                    </td>
                    <td 
                      className="py-3 px-4 font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {client.name}
                    </td>
                    <td 
                      className="py-3 px-4 text-sm font-mono"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {client.cac}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          client.status === 'active' ? 'success' :
                          client.status === 'alert' ? 'error' :
                          client.status === 'pending' ? 'warning' : 'info'
                        }
                      >
                        ● {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-16 h-1.5 rounded-full overflow-hidden"
                          style={{ background: 'var(--color-surface-deep)' }}
                        >
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${client.compliance}%`,
                              background: client.compliance >= 80 ? 'var(--color-success)' : 
                                         client.compliance >= 60 ? 'var(--color-warning)' : 'var(--color-error)'
                            }}
                          />
                        </div>
                        <span 
                          className="text-sm font-medium"
                          style={{ 
                            color: client.compliance >= 80 ? 'var(--color-success)' : 
                                   client.compliance >= 60 ? 'var(--color-warning)' : 'var(--color-error)'
                          }}
                        >
                          {client.compliance}%
                        </span>
                      </div>
                    </td>
                    <td 
                      className="py-3 px-4 text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {client.lastActivity}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/pro/clients/${client.id}`}
                          className="text-sm font-medium hover:underline"
                          style={{ color: 'var(--color-brand-primary)' }}
                        >
                          View
                        </Link>
                        <button 
                          className="text-sm font-medium hover:underline"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Docs
                        </button>
                        <button 
                          className="text-sm font-medium hover:underline"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Reports
                        </button>
                        <button 
                          className="text-sm font-medium"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          ⋯
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: 'var(--color-border-subtle)', background: 'var(--color-surface-inset)' }}
          >
            <span 
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Showing {Math.min((currentPage - 1) * perPage + 1, filteredClients.length)}–{Math.min(currentPage * perPage, filteredClients.length)} of {filteredClients.length} clients
            </span>
            
            <div className="flex items-center gap-2">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 rounded text-sm border bg-surface-base"
                style={{ 
                  borderColor: 'var(--color-border-default)', 
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-surface-base)'
                }}
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
                >
                  ←
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
                      className="w-8 h-8 rounded text-sm font-medium transition-colors"
                      style={{ 
                        background: currentPage === pageNum ? 'var(--color-brand-primary)' : 'transparent',
                        color: currentPage === pageNum ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'
                      }}
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
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}