"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Check,
  Download,
  FileText,
  Loader2,
  Play,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type CalcTypeId = "income" | "vat" | "wht";
type RunStatus = "idle" | "running" | "done";

interface BatchRow {
  id: number;
  name: string;
  compliance: number;
  gross: number;
  deductions: number;
}

const calculationTypes: { id: CalcTypeId; label: string; desc: string; rate: number }[] = [
  { id: "income", label: "Income Tax", desc: "PITA-compliant personal and corporate tax", rate: 0.213 },
  { id: "vat", label: "VAT", desc: "Value Added Tax at 7.5% of taxable supplies", rate: 0.075 },
  { id: "wht", label: "WHT", desc: "Withholding Tax on contracts and services", rate: 0.05 },
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

// Deterministic demo figures per client — no Math.random() in render.
const initialFigures: Record<number, { gross: number; deductions: number }> = {
  1: { gross: 12000000, deductions: 2450000 },
  2: { gross: 8500000, deductions: 1200000 },
  3: { gross: 15000000, deductions: 3100000 },
  4: { gross: 6200000, deductions: 890000 },
  5: { gross: 3400000, deductions: 520000 },
  6: { gross: 21500000, deductions: 5600000 },
  7: { gross: 4800000, deductions: 3100000 },
  8: { gross: 9800000, deductions: 1450000 },
};

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

const complianceTone = (value: number) =>
  value >= 80 ? "success" : value >= 60 ? "warning" : "error";

const toneTextClass: Record<string, string> = {
  success: "text-success-text",
  warning: "text-warning-text",
  error: "text-error-text",
};

const ngn = (value: number) => `₦${value.toLocaleString("en-NG")}`;

const initialRows: BatchRow[] = [1, 2, 3].map((id) => {
  const client = clients.find((c) => c.id === id)!;
  const figures = initialFigures[id];
  return {
    id,
    name: client.name,
    compliance: client.compliance,
    gross: figures.gross,
    deductions: figures.deductions,
  };
});

export default function CalculationsPage() {
  const [calcType, setCalcType] = useState<CalcTypeId>("income");
  const [fiscalYear, setFiscalYear] = useState("2024");
  const [rows, setRows] = useState<BatchRow[]>(initialRows);
  const [clientSearch, setClientSearch] = useState("");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [runAt, setRunAt] = useState<string | null>(null);

  const activeType = calculationTypes.find((t) => t.id === calcType)!;

  const taxFor = (row: BatchRow) =>
    Math.max(0, row.gross - row.deductions) * activeType.rate;

  const totals = rows.reduce(
    (acc, row) => ({
      gross: acc.gross + row.gross,
      deductions: acc.deductions + row.deductions,
      taxDue: acc.taxDue + taxFor(row),
    }),
    { gross: 0, deductions: 0, taxDue: 0 }
  );

  const toggleClient = (id: number) => {
    setStatus("idle");
    setRunAt(null);
    setRows((prev) => {
      if (prev.some((r) => r.id === id)) {
        return prev.filter((r) => r.id !== id);
      }
      const client = clients.find((c) => c.id === id)!;
      const figures = initialFigures[id] ?? { gross: 0, deductions: 0 };
      return [
        ...prev,
        {
          id,
          name: client.name,
          compliance: client.compliance,
          gross: figures.gross,
          deductions: figures.deductions,
        },
      ];
    });
  };

  const selectAll = () => {
    setStatus("idle");
    setRunAt(null);
    setRows((prev) => {
      const existing = new Set(prev.map((r) => r.id));
      const additions = clients
        .filter((c) => !existing.has(c.id))
        .map((c) => ({
          id: c.id,
          name: c.name,
          compliance: c.compliance,
          gross: (initialFigures[c.id] ?? { gross: 0 }).gross,
          deductions: (initialFigures[c.id] ?? { deductions: 0 }).deductions,
        }));
      return [...prev, ...additions];
    });
  };

  const clearSelection = () => {
    setRows([]);
    setStatus("idle");
    setRunAt(null);
  };

  const updateRow = (id: number, field: "gross" | "deductions", value: string) => {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: Number.isFinite(parsed) ? parsed : 0 } : r
      )
    );
  };

  const runCalculations = () => {
    if (rows.length === 0) return;
    setStatus("running");
    setRunAt(null);
    // Capture the run timestamp in state (never new Date() in the render body).
    window.setTimeout(() => {
      setStatus("done");
      setRunAt(
        new Date().toLocaleTimeString("en-NG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1200);
  };

  const exportCsv = () => {
    const header = "Client,Gross Income (NGN),Deductions (NGN),Tax Due (NGN)";
    const body = rows.map((r) =>
      [r.name, String(r.gross), String(r.deductions), String(Math.round(taxFor(r)))].join(",")
    );
    const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creditax-bulk-${calcType}-${fiscalYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const lines = [
      `Creditax.ai — Bulk Calculation Report`,
      `Type: ${activeType.label} · Fiscal year: ${fiscalYear}`,
      runAt ? `Run at: ${runAt}` : "Status: draft (not yet run)",
      "",
      ...rows.map(
        (r) =>
          `${r.name}: gross ${ngn(r.gross)} · deductions ${ngn(r.deductions)} · tax due ${ngn(Math.round(taxFor(r)))}`
      ),
      "",
      `Totals (${rows.length} clients): ${ngn(totals.gross)} gross · ${ngn(totals.deductions)} deductions · ${ngn(Math.round(totals.taxDue))} tax due`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creditax-bulk-${calcType}-${fiscalYear}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1>Bulk Calculations</h1>
        <p className="text-text-muted text-sm mt-1">
          Run tax calculations for multiple clients at once — adjust figures per client before running.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calculation Type */}
          <motion.div variants={item}>
            <Card className="p-5">
              <h2 className="font-semibold text-text-primary mb-4">Calculation Type</h2>
              <div className="space-y-3">
                {calculationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCalcType(type.id)}
                    aria-pressed={calcType === type.id}
                    className={cn(
                      "w-full p-4 rounded-btn border text-left transition-colors cursor-pointer",
                      calcType === type.id
                        ? "border-brand-primary bg-brand-primary-bg"
                        : "border-border-default hover:border-border-strong"
                    )}
                  >
                    <p
                      className={cn(
                        "font-medium flex items-center gap-2",
                        calcType === type.id ? "text-brand-primary" : "text-text-primary"
                      )}
                    >
                      {calcType === type.id && <Check size={14} />}
                      {type.label}
                    </p>
                    <p className="text-sm text-text-muted mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Fiscal Year */}
          <motion.div variants={item}>
            <Card className="p-5">
              <h2 className="font-semibold text-text-primary mb-4">Fiscal Year</h2>
              <div className="flex flex-wrap gap-2">
                {fiscalYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setFiscalYear(year)}
                    aria-pressed={fiscalYear === year}
                    className={cn(
                      "px-4 py-2 rounded-btn text-sm font-mono font-medium transition-colors cursor-pointer",
                      fiscalYear === year
                        ? "bg-brand-primary text-text-inverse"
                        : "bg-surface-inset text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Client Selection */}
          <motion.div variants={item}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary">Batch Clients</h2>
                <Badge variant="brand">{rows.length} selected</Badge>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection} disabled={rows.length === 0}>
                  Clear
                </Button>
              </div>

              <div className="mb-4">
                <Input
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1 max-h-64 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <p className="text-sm text-text-muted py-2">No clients match your search.</p>
                ) : (
                  filteredClients.map((client) => (
                    <label
                      key={client.id}
                      className="flex items-center gap-3 p-2 rounded-btn cursor-pointer transition-colors hover:bg-hover-overlay"
                    >
                      <input
                        type="checkbox"
                        checked={rows.some((r) => r.id === client.id)}
                        onChange={() => toggleClient(client.id)}
                        aria-label={`Include ${client.name}`}
                        className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                      />
                      <span className="flex-1 text-sm text-text-primary">{client.name}</span>
                      <span className={cn("text-xs font-mono", toneTextClass[complianceTone(client.compliance)])}>
                        {client.compliance}%
                      </span>
                    </label>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Run Button */}
          <motion.div variants={item}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={runCalculations}
              disabled={rows.length === 0 || status === "running"}
            >
              {status === "running" ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {status === "running" ? "Running..." : "Run Calculations"}
            </Button>
            <p className="text-center text-sm text-text-muted mt-2">
              Estimated time: ~{Math.ceil(rows.length * 2.5)} seconds for {rows.length} clients
            </p>
          </motion.div>
        </div>

        {/* Right Column - Batch Table */}
        <div className="lg:col-span-3">
          <motion.div variants={item}>
            <Card className="overflow-hidden h-full">
              <AnimatePresence mode="wait">
                {rows.length === 0 ? (
                  /* Empty state */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-96 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-surface-inset">
                        <Calculator size={24} className="text-text-muted" />
                      </div>
                      <p className="font-medium text-text-primary mb-1">No batch selected</p>
                      <p className="text-sm text-text-muted">
                        Select clients on the left to build a calculation batch
                      </p>
                    </div>
                  </motion.div>
                ) : status === "running" ? (
                  /* Loading state */
                  <motion.div
                    key="running"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5"
                  >
                    <div className="flex items-center gap-2 mb-6 text-sm font-medium text-text-secondary">
                      <Loader2 size={16} className="animate-spin text-brand-primary" />
                      Running {activeType.label} calculations for {rows.length} clients...
                    </div>
                    <div className="space-y-3">
                      {rows.map((row) => (
                        <div
                          key={row.id}
                          className="h-12 rounded-btn bg-surface-inset animate-pulse"
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  /* Batch table */
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Results Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
                      <div>
                        <h2 className="font-semibold text-text-primary">
                          Batch — {activeType.label} {fiscalYear}
                        </h2>
                        <p className="text-sm text-text-muted mt-0.5">
                          {runAt
                            ? `Run at ${runAt} · effective rate ${(activeType.rate * 100).toFixed(1)}%`
                            : "Results update live — press Run to record a run"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={runCalculations}
                          aria-label="Run calculations"
                          title="Run calculations"
                          className="p-2 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          onClick={exportCsv}
                          aria-label="Export batch as CSV"
                          title="Export CSV"
                          className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={generateReport}
                          aria-label="Generate reports for this batch"
                          title="Generate reports"
                          className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Batch Table */}
                    <div className="overflow-x-auto overscroll-x-contain">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border-default bg-surface-inset">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Client</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Gross Income</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Deductions</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Tax Due</th>
                            <th className="w-10 py-3 px-4">
                              <span className="sr-only">Remove</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-border-subtle last:border-0 hover:bg-hover-overlay transition-colors"
                            >
                              <td className="py-2 px-4">
                                <div className="flex items-center gap-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={`/images/avatars/avatar-${String((row.id % 10) + 1).padStart(2, "0")}.png`}
                                    alt=""
                                    width={28}
                                    height={28}
                                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-border-subtle"
                                  />
                                  <span className="text-sm font-medium text-text-primary">{row.name}</span>
                                </div>
                              </td>
                              <td className="py-2 px-4 text-right">
                                <input
                                  type="number"
                                  value={row.gross}
                                  onChange={(e) => updateRow(row.id, "gross", e.target.value)}
                                  aria-label={`Gross income for ${row.name}`}
                                  className="w-32 h-9 rounded-input bg-surface-base border border-border-strong px-2 text-sm font-mono text-text-primary text-right
                                    focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary"
                                />
                              </td>
                              <td className="py-2 px-4 text-right">
                                <input
                                  type="number"
                                  value={row.deductions}
                                  onChange={(e) => updateRow(row.id, "deductions", e.target.value)}
                                  aria-label={`Deductions for ${row.name}`}
                                  className="w-32 h-9 rounded-input bg-surface-base border border-border-strong px-2 text-sm font-mono text-text-primary text-right
                                    focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary"
                                />
                              </td>
                              <td className="py-2 px-4 text-right text-sm font-mono font-bold text-text-primary whitespace-nowrap">
                                {ngn(Math.round(taxFor(row)))}
                              </td>
                              <td className="py-2 px-4 text-right">
                                <button
                                  onClick={() => toggleClient(row.id)}
                                  aria-label={`Remove ${row.name} from batch`}
                                  title="Remove from batch"
                                  className="p-1.5 rounded-btn text-text-muted hover:text-error-text hover:bg-hover-overlay transition-colors cursor-pointer"
                                >
                                  <X size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* Totals footer — JetBrains Mono via font-mono */}
                        <tfoot>
                          <tr className="bg-surface-inset">
                            <td className="py-3 px-4 text-sm font-medium text-text-primary">
                              Totals ({rows.length} clients)
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-mono font-bold text-text-primary whitespace-nowrap">
                              {ngn(totals.gross)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-mono font-bold text-text-primary whitespace-nowrap">
                              {ngn(totals.deductions)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-mono font-bold text-success-text whitespace-nowrap">
                              {ngn(Math.round(totals.taxDue))}
                            </td>
                            <td className="py-3 px-4" />
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 border-t border-border-default">
                      <span className="text-xs text-text-muted">
                        Clients calculated: <span className="font-mono font-medium text-text-primary">{rows.length}</span>
                      </span>
                      <span className="text-xs text-text-muted">
                        Effective rate: <span className="font-mono font-medium text-text-primary">{(activeType.rate * 100).toFixed(1)}%</span>
                      </span>
                      <span className="text-xs text-text-muted">
                        Total estimated tax: <span className="font-mono font-bold text-success-text">{ngn(Math.round(totals.taxDue))}</span>
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="ml-auto"
                        onClick={exportCsv}
                      >
                        <Download size={14} />
                        Export CSV
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
