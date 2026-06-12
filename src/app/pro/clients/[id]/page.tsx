"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

const tabs = ["Overview", "Documents", "Filings", "Reports"];

const documents = [
  { name: "Q1 2025 Invoice #1234", amount: "₦450,000", category: "Invoice", date: "Mar 15, 2025", status: "verified" },
  { name: "Office Supplies Receipt", amount: "₦32,500", category: "Receipt", date: "Mar 12, 2025", status: "verified" },
  { name: "Equipment Purchase", amount: "₦1,200,000", category: "Receipt", date: "Mar 10, 2025", status: "processing" },
  { name: "Client Payment Receipt", amount: "₦2,500,000", category: "Receipt", date: "Mar 8, 2025", status: "verified" },
  { name: "VAT Invoice #5678", amount: "₦180,000", category: "Tax Form", date: "Mar 5, 2025", status: "verified" },
  { name: "Consulting Fee Invoice", amount: "₦850,000", category: "Invoice", date: "Mar 1, 2025", status: "issue" },
  { name: "Bank Statement Feb", amount: "—", category: "Bank Statement", date: "Feb 28, 2025", status: "verified" },
  { name: "Q4 2024 Invoice #1199", amount: "₦620,000", category: "Invoice", date: "Feb 20, 2025", status: "verified" },
];

const documentCategories = [
  { label: "All", count: 18 },
  { label: "Receipts", count: 7 },
  { label: "Invoices", count: 4 },
  { label: "Tax Forms", count: 3 },
  { label: "Bank Statements", count: 4 },
];

const clientData = {
  name: "Zenith Foods Ltd",
  initials: "ZF",
  cac: "RC-248571",
  tin: "1234567-0001",
  location: "Lagos, Nigeria",
  compliance: 94,
  status: "active",
  industry: "Food & Beverage",
  taxYear: "2024",
  assignedPro: "Adaeze Okonkwo",
  email: "finance@zenithfoods.com",
  phone: "+234 801 234 5678",
  registrationDate: "January 15, 2018",
  lastFiling: "March 31, 2025",
};

export default function ClientDetailPage() {
  const _params = useParams();
  const [activeTab, setActiveTab] = useState("Documents");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === "All" || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm">
          <Link 
            href="/pro/clients"
            className="hover:underline"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Clients
          </Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>{clientData.name}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <span style={{ color: 'var(--color-brand-primary)' }}>{activeTab}</span>
        </div>
      </motion.div>

      {/* Client Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-4 mb-6 p-4 rounded-card border"
        style={{ 
          background: 'var(--color-surface-raised)', 
          borderColor: 'var(--color-border-default)' 
        }}
      >
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
          style={{ 
            background: 'var(--color-brand-primary)', 
            color: 'var(--color-text-inverse)' 
          }}
        >
          {clientData.initials}
        </div>
        <div className="flex-1">
          <h1 
            className="text-xl font-bold mb-0.5"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {clientData.name}
          </h1>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            CAC: {clientData.cac} · TIN: {clientData.tin} · {clientData.location}
          </p>
        </div>
        <div className="text-center px-6 border-l" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <p 
            className="text-3xl font-bold"
            style={{ color: 'var(--color-success)' }}
          >
            {clientData.compliance}%
          </p>
          <p 
            className="text-xs uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Compliance
          </p>
        </div>
        <Badge variant="success">● Active</Badge>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 mb-6 border-b"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-3 text-sm font-medium transition-colors"
            style={{ 
              color: activeTab === tab ? 'var(--color-brand-primary)' : 'var(--color-text-muted)' 
            }}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: 'var(--color-brand-primary)' }}
                transition={{ type: "spring", duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - 65% */}
        <div className="lg:col-span-3 space-y-6">
          {/* Document Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-3"
          >
            {documentCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat.label ? 'var(--color-brand-primary)' : 'var(--color-surface-inset)',
                  color: activeCategory === cat.label ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                }}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
            
            <div className="flex-1 min-w-[200px] max-w-xs ml-auto">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="h-10 px-3 rounded-input border text-sm bg-surface-base"
              style={{ 
                borderColor: 'var(--color-border-strong)', 
                color: 'var(--color-text-secondary)',
                background: 'var(--color-surface-base)'
              }}
            >
              <option>Date ↓</option>
              <option>Date ↑</option>
              <option>Amount ↓</option>
              <option>Amount ↑</option>
            </select>

            <Button variant="primary" size="md">
              Upload Document +
            </Button>
          </motion.div>

          {/* Document Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-inset)' }}>
                      <th 
                        className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Document
                      </th>
                      <th 
                        className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Amount
                      </th>
                      <th 
                        className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Category
                      </th>
                      <th 
                        className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Date
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filteredDocs.map((doc, i) => (
                        <motion.tr
                          key={doc.name}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: i * 0.03 }}
                          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                          className="hover:bg-surface-inset transition-colors"
                        >
                          <td 
                            className="py-3 px-4 font-medium"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {doc.name}
                          </td>
                          <td 
                            className="py-3 px-4 font-mono text-sm"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {doc.amount}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="brand">{doc.category}</Badge>
                          </td>
                          <td 
                            className="py-3 px-4 text-sm"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {doc.date}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                doc.status === 'verified' ? 'success' :
                                doc.status === 'processing' ? 'warning' : 'error'
                              }
                            >
                              {doc.status === 'verified' ? '✓ Verified' :
                               doc.status === 'processing' ? '⏳ Processing' : '⚠ Issue'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <button 
                              className="text-sm font-medium hover:underline"
                              style={{ color: 'var(--color-brand-primary)' }}
                            >
                              View
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - 35% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-5">
              <h3 
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Client Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Industry</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{clientData.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Tax Year</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{clientData.taxYear}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Assigned Pro</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{clientData.assignedPro}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Email</span>
                  <span style={{ color: 'var(--color-brand-primary)' }}>{clientData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Phone</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{clientData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Registration</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{clientData.registrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Last Filing</span>
                  <span style={{ color: 'var(--color-success)' }}>{clientData.lastFiling}</span>
                </div>
              </div>

              {/* Compliance Bar */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Compliance Score
                  </span>
                  <span 
                    className="text-sm font-bold"
                    style={{ color: 'var(--color-success)' }}
                  >
                    {clientData.compliance}%
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--color-surface-inset)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clientData.compliance}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--color-success)' }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-5">
              <h3 
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="secondary" size="md" fullWidth className="justify-start">
                  Calculate Tax Liability
                </Button>
                <Button variant="primary" size="md" fullWidth className="justify-start">
                  Generate Compliance Report
                </Button>
                <Button variant="ghost" size="md" fullWidth className="justify-start">
                  Message Client
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Share Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-5">
              <h3 
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Share Settings
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Allow client to view
                  </p>
                  <p 
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Client can see their documents and reports
                  </p>
                </div>
                <button
                  className="w-12 h-6 rounded-full relative transition-colors"
                  style={{ background: 'var(--color-surface-inset)' }}
                >
                  <div 
                    className="w-5 h-5 rounded-full absolute top-0.5 left-0.5 transition-transform"
                    style={{ background: 'var(--color-text-muted)' }}
                  />
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}