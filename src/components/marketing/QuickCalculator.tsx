/**
 * P2 — Quick Calculator (F-06 / demo-scope item 5).
 *
 * A compact, Naira-only PAYE + VAT calculator for the dashboard home. It POSTs
 * to /api/v1/tax/calculate when the endpoint is reachable and falls back to the
 * pure local `tax-rules` engine when offline, so the demo always shows live
 * figures + FIRS/NTA references. Every figure is a demo seed.
 */

'use client';

import { useState, type FormEvent } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  computePaye,
  computeVat,
  fmtNaira,
} from '@/ai/tax-rules';

type Mode = 'paye' | 'vat';

interface CalcResult {
  mode: Mode;
  lines: { label: string; value: string; accent?: boolean }[];
  reference: string;
  live: boolean;
}

export function QuickCalculator() {
  const [mode, setMode] = useState<Mode>('paye');
  const [gross, setGross] = useState('12000000');
  const [inputVat, setInputVat] = useState('0');
  const [result, setResult] = useState<CalcResult | null>(null);
  const [busy, setBusy] = useState(false);

  function fallbackPaye() {
    const r = computePaye(Number(gross) || 0);
    return {
      lines: [
        { label: 'Gross income', value: fmtNaira(r.gross) },
        { label: 'Consolidated relief', value: `-${fmtNaira(r.cra)}` },
        { label: 'Chargeable income', value: fmtNaira(r.chargeable) },
        { label: 'Monthly PAYE', value: fmtNaira(r.monthlyPaye), accent: true },
        { label: 'Annual PAYE', value: fmtNaira(r.annualPaye) },
        { label: 'Effective rate', value: `${(r.effectiveRate * 100).toFixed(1)}%` },
      ],
      reference: 'NTA 2023 · PIT graduated bands (7%–24%)',
    } as Omit<CalcResult, 'mode' | 'live'>;
  }

  function fallbackVat() {
    const r = computeVat({ grossSales: Number(gross) || 0, inputVat: Number(inputVat) || 0 });
    return {
      lines: [
        { label: 'Net sales (ex VAT)', value: fmtNaira(r.net) },
        { label: 'Output VAT @ 7.5%', value: fmtNaira(r.outputVat) },
        { label: 'Input VAT claimed', value: `-${fmtNaira(r.inputVat)}` },
        { label: 'VAT payable', value: fmtNaira(r.netVatPayable), accent: true },
        { label: 'Filing deadline', value: r.filingDeadline },
      ],
      reference: 'FIRS VAT Guide · 7.5% standard rate',
    } as Omit<CalcResult, 'mode' | 'live'>;
  }

  async function run() {
    setBusy(true);
    const payload =
      mode === 'paye'
        ? { kind: 'paye', gross: Number(gross) }
        : { kind: 'vat', grossSales: Number(gross), inputVat: Number(inputVat) };
    try {
      const res = await fetch('/api/v1/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        setResult({
          mode,
          lines: d.human
            ? Object.entries(d.human).map(([k, v]) => ({ label: titleCase(k), value: String(v), accent: k === 'annual' || k === 'payable' }))
            : [],
          reference: d.reference?.[0] ?? '',
          live: true,
        });
        setBusy(false);
        return;
      }
    } catch {
      /* offline — fall through to the local engine */
    }
    setResult({ mode, live: false, ...(mode === 'paye' ? fallbackPaye() : fallbackVat()) });
    setBusy(false);
  }

  function onForm(e: FormEvent) {
    e.preventDefault();
    void run();
  }

  return (
    <Card className="p-6 md:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-brand-primary-bg text-brand-primary grid place-items-center">
            <Calculator size={16} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-text-primary">Quick tax calculator</h2>
            <p className="text-[11px] text-text-muted">Naira figures · cited to NTA / FIRS</p>
          </div>
        </div>
        <Badge variant="brand">Live demo</Badge>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('paye')}
          aria-pressed={mode === 'paye'}
          className={`px-3 py-1.5 rounded-btn text-sm font-medium border transition-colors cursor-pointer ${
            mode === 'paye'
              ? 'border-brand-primary bg-brand-primary-bg/40 text-brand-primary'
              : 'border-border-strong text-text-secondary hover:border-text-muted'
          }`}
        >
          PAYE
        </button>
        <button
          type="button"
          onClick={() => setMode('vat')}
          aria-pressed={mode === 'vat'}
          className={`px-3 py-1.5 rounded-btn text-sm font-medium border transition-colors cursor-pointer ${
            mode === 'vat'
              ? 'border-brand-primary bg-brand-primary-bg/40 text-brand-primary'
              : 'border-border-strong text-text-secondary hover:border-text-muted'
          }`}
        >
          VAT
        </button>
      </div>

      <form onSubmit={onForm} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm text-text-secondary">
          {mode === 'paye' ? 'Gross annual income (₦)' : 'Gross sales incl. VAT (₦)'}
          <input
            type="number"
            inputMode="numeric"
            value={gross}
            onChange={(e) => setGross(e.target.value)}
            className="mt-1 w-full h-10 rounded-btn bg-surface-base border border-border-strong px-3 font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
          />
        </label>
        {mode === 'vat' && (
          <label className="w-full sm:w-40 text-sm text-text-secondary">
            Input VAT (₦)
            <input
              type="number"
              inputMode="numeric"
              value={inputVat}
              onChange={(e) => setInputVat(e.target.value)}
              className="mt-1 w-full h-10 rounded-btn bg-surface-base border border-border-strong px-3 font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            />
          </label>
        )}
        <Button type="submit" variant="primary" size="md" disabled={busy} className="shrink-0">
          <RefreshCw size={14} className={busy ? 'animate-spin' : ''} /> Calculate
        </Button>
      </form>

      {result && (
        <div className="mt-4 rounded-btn border border-border-subtle bg-surface-overlay p-4">
          <div className="space-y-2">
            {result.lines.map((l) => (
              <div key={l.label} className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-text-muted">{l.label}</span>
                <span
                  className={`font-mono text-[13px] ${l.accent ? 'text-brand-action font-bold text-base' : 'text-text-primary'}`}
                >
                  {l.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-text-muted mt-3 pt-3 border-t border-border-subtle flex items-center justify-between gap-2 flex-wrap">
            <span>Source: {result.reference}</span>
            <span className="text-text-placeholder">{result.live ? 'via /api/v1' : 'offline engine'} · demo seed</span>
          </p>
        </div>
      )}
    </Card>
  );
}

function titleCase(s: string): string {
  const map: Record<string, string> = {
    gross: 'Gross income',
    cra: 'Consolidated relief',
    chargeable: 'Chargeable income',
    monthly: 'Monthly PAYE',
    annual: 'Annual PAYE',
    effectiverate: 'Effective rate',
    net: 'Net sales (ex VAT)',
    outputvat: 'Output VAT @ 7.5%',
    inputvat: 'Input VAT claimed',
    payable: 'VAT payable',
    refund: 'VAT refund',
    deadline: 'Filing deadline',
  };
  return map[s.toLowerCase()] ?? s;
}
