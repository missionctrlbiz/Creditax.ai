"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

const calculationTypes = [
  { id: "income", label: "Income Tax", desc: "PITA-compliant personal and corporate tax" },
  { id: "vat", label: "VAT", desc: "Value Added Tax at applicable rates" },
  { id: "wht", label: "WHT", desc: "Withholding Tax on contracts and services" },
];

const fiscalYears = ["2022", "2023", "2024", "2025"];

const clients = [
  { id: 1, name: "Zenith Foods Ltd", compliance: 94 },
  { id: 2, name: "Eko Logistics", compliance: 78 },
  { id: 3, name: "Marina Tech Ltd", compliance: 100 },
  { id: 4, name: "Okafor & Sons", compliance: 85 },
  { id: 5, name: "Sunrise Bakery", compliance: 62 },
  { id: 6, name: "Apex Construction", compliance: 91 },
  { id: 7, name: "Delta Pharmaceuticals", compliance: 45 },
  { id: 8, name: "Golden Investments", compliance: 88 },
];

const results = [
  { 
    id: 1, 
    name: "Zenith Foods Ltd", 
    grossIncome: "₦12,000,000", 
    deductions: "₦2,450,000", 
    taxDue: "₦2,387,500",
    status: "calculated"
  },
  { 
    id: 2, 
    name: "Eko Logistics", 
    grossIncome: "₦8,500,000", 
    deductions: "₦1,200,000", 
    taxDue: "₦1,825,000",
    status: "calculated"
  },
  { 
    id: 3, 
    name: "Marina Tech Ltd", 
    grossIncome: "₦15,000,000", 
    deductions: "₦3,100,000", 
    taxDue: "₦2,985,000",
    status: "calculated"
  },
];

export default function CalculationsPage() {
  const [calcType, setCalcType] = useState("income");
  const [fiscalYear, setFiscalYear] = useState("2024");
  const [selectedClients, setSelectedClients] = useState<number[]>([1, 2, 3]);
  const [clientSearch, setClientSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [expandedResult, setExpandedResult] = useState<number | null>(1);

  const toggleClient = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedClients(clients.map((c) => c.id));
  };

  const clearSelection = () => {
    setSelectedClients([]);
  };

  const runCalculations = () => {
    setShowResults(true);
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const totalTaxDue = results.reduce((sum, r) => {
    const value = parseInt(r.taxDue.replace(/[₦,]/g, ''));
    return sum + value;
  }, 0);

  const avgEffectiveRate = 21.3;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Bulk Calculations
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Run tax calculations for multiple clients at once.
        </p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calculation Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="p-5">
              <h3 
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Calculation Type
              </h3>
              <div className="space-y-3">
                {calculationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCalcType(type.id)}
                    className="w-full p-4 rounded-lg border text-left transition-all"
                    style={{
                      borderColor: calcType === type.id ? 'var(--color-brand-primary)' : 'var(--color-border-default)',
                      background: calcType === type.id ? 'var(--color-brand-primary-bg)' : 'transparent',
                    }}
                  >
                    <p 
                      className="font-medium"
                      style={{ color: calcType === type.id ? 'var(--color-brand-primary)' : 'var(--color-text-primary)' }}
                    >
                      {type.label}
                    </p>
                    <p 
                      className="text-sm mt-0.5"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {type.desc}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Fiscal Year */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-5">
              <h3 
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Fiscal Year
              </h3>
              <div className="flex gap-2">
                {fiscalYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setFiscalYear(year)}
                    className="px-4 py-2 rounded-btn text-sm font-medium transition-all"
                    style={{
                      background: fiscalYear === year ? 'var(--color-brand-primary)' : 'var(--color-surface-inset)',
                      color: fiscalYear === year ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Client Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Select Clients
                </h3>
                <Badge variant="brand">{selectedClients.length} selected</Badge>
              </div>
              
              <div className="flex gap-2 mb-4">
                <button
                  onClick={selectAll}
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--color-brand-primary)' }}
                >
                  Select All
                </button>
                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                <button
                  onClick={clearSelection}
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Clear Selection
                </button>
              </div>

              <div className="mb-4">
                <Input
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
              </div>

              <div 
                className="space-y-2 max-h-64 overflow-y-auto pr-2"
                style={{ scrollbarWidth: 'thin' }}
              >
                {filteredClients.map((client) => (
                  <label
                    key={client.id}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-surface-inset"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: 'var(--color-brand-primary)' }}
                    />
                    <span 
                      className="flex-1 text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {client.name}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ 
                        color: client.compliance >= 80 ? 'var(--color-success)' : 
                               client.compliance >= 60 ? 'var(--color-warning)' : 'var(--color-error)'
                      }}
                    >
                      {client.compliance}%
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Run Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              variant="primary" 
              size="xl" 
              fullWidth
              onClick={runCalculations}
              disabled={selectedClients.length === 0}
            >
              RUN CALCULATIONS →
            </Button>
            <p 
              className="text-center text-sm mt-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Estimated time: ~{Math.ceil(selectedClients.length * 2.5)} seconds for {selectedClients.length} clients
            </p>
          </motion.div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-5 h-full">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-96 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'var(--color-surface-inset)' }}
                      >
                        <span className="text-2xl">📊</span>
                      </div>
                      <p 
                        className="font-medium mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        No calculations yet
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Select clients and run calculations to see results
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 
                          className="font-semibold"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          Calculation Results — Income Tax {fiscalYear}
                        </h3>
                        <p 
                          className="text-sm"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Run at {new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          ↓ Export All
                        </Button>
                        <Button variant="primary" size="sm">
                          Generate Reports
                        </Button>
                      </div>
                    </div>

                    {/* Results List */}
                    <div className="space-y-3 mb-6">
                      {results.map((result) => (
                        <div
                          key={result.id}
                          className="border rounded-lg overflow-hidden"
                          style={{ borderColor: 'var(--color-border-default)' }}
                        >
                          {/* Result Header */}
                          <button
                            onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-surface-inset transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ 
                                  background: 'var(--color-brand-primary-bg)', 
                                  color: 'var(--color-brand-primary)' 
                                }}
                              >
                                {result.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </div>
                              <span 
                                className="font-medium"
                                style={{ color: 'var(--color-text-primary)' }}
                              >
                                {result.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span 
                                className="font-mono font-bold"
                                style={{ color: 'var(--color-success)' }}
                              >
                                {result.taxDue}
                              </span>
                              <Badge variant="success">✓ Calculated</Badge>
                              <span style={{ color: 'var(--color-text-muted)' }}>
                                {expandedResult === result.id ? '▲' : '▼'}
                              </span>
                            </div>
                          </button>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {expandedResult === result.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div 
                                  className="p-4 pt-0 grid grid-cols-3 gap-4"
                                  style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                                >
                                  <div>
                                    <p 
                                      className="text-xs uppercase tracking-wider mb-1"
                                      style={{ color: 'var(--color-text-muted)' }}
                                    >
                                      Gross Income
                                    </p>
                                    <p 
                                      className="font-mono font-medium"
                                      style={{ color: 'var(--color-text-primary)' }}
                                    >
                                      {result.grossIncome}
                                    </p>
                                  </div>
                                  <div>
                                    <p 
                                      className="text-xs uppercase tracking-wider mb-1"
                                      style={{ color: 'var(--color-text-muted)' }}
                                    >
                                      Total Deductions
                                    </p>
                                    <p 
                                      className="font-mono font-medium"
                                      style={{ color: 'var(--color-brand-primary)' }}
                                    >
                                      {result.deductions}
                                    </p>
                                  </div>
                                  <div>
                                    <p 
                                      className="text-xs uppercase tracking-wider mb-1"
                                      style={{ color: 'var(--color-text-muted)' }}
                                    >
                                      Tax Due
                                    </p>
                                    <p 
                                      className="font-mono font-bold"
                                      style={{ color: 'var(--color-success)' }}
                                    >
                                      {result.taxDue}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* Totals Footer */}
                    <div 
                      className="p-4 rounded-lg"
                      style={{ background: 'var(--color-surface-inset)' }}
                    >
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p 
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            Clients Calculated
                          </p>
                          <p 
                            className="text-xl font-bold"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {results.length}
                          </p>
                        </div>
                        <div>
                          <p 
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            Total Estimated Tax
                          </p>
                          <p 
                            className="text-xl font-bold font-mono"
                            style={{ color: 'var(--color-success)' }}
                          >
                            ₦{totalTaxDue.toLocaleString('en-NG')}
                          </p>
                        </div>
                        <div>
                          <p 
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            Avg Effective Rate
                          </p>
                          <p 
                            className="text-xl font-bold"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {avgEffectiveRate}%
                          </p>
                        </div>
                      </div>
                      <Button variant="primary" size="lg" fullWidth>
                        Generate {results.length} Reports →
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}