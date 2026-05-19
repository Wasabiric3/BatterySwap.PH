'use client';

import React, { useState } from 'react';
import {
  Activity, BatteryCharging, ThermometerSun, Zap,
  FileCheck, Download, AlertTriangle, CheckCircle2,
  Clock, TrendingDown, Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FadeUp } from '@/components/animations/FadeUp';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);

type HealthStatus = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';

const STATUS_MAP: Record<HealthStatus, { label: string; color: string; bg: string; bar: string }> = {
  EXCELLENT: { label: 'Excellent', color: 'text-brand-green',    bg: 'bg-brand-green/10 border-brand-green/30',  bar: 'bg-brand-green' },
  GOOD:      { label: 'Good',      color: 'text-brand-green',    bg: 'bg-brand-green/10 border-brand-green/30',  bar: 'bg-brand-green' },
  FAIR:      { label: 'Fair',      color: 'text-brand-volt',     bg: 'bg-brand-volt/10 border-brand-volt/30',    bar: 'bg-brand-volt' },
  POOR:      { label: 'Poor',      color: 'text-orange-400',     bg: 'bg-orange-400/10 border-orange-400/30',    bar: 'bg-orange-400' },
  CRITICAL:  { label: 'Critical',  color: 'text-brand-red',      bg: 'bg-brand-red/10 border-brand-red/30',      bar: 'bg-brand-red' },
};

const MOCK_RESULTS = [
  {
    serial: 'BSW-48V-A7F3-2024',
    healthScore: 94,
    status: 'EXCELLENT' as HealthStatus,
    cycleCount: 142,
    capacity: 96.2,
    internalResistance: 18,
    cellBalance: 0.012,
    tempRange: '22–38°C',
    lastChecked: 'Today, 09:42 AM',
    recommendation: 'Battery is in excellent condition. No action needed.',
    checks: [
      { label: 'Manufacturer Match',     ok: true  },
      { label: 'Cycle count within spec',ok: true  },
      { label: 'Cell voltage balanced',  ok: true  },
      { label: 'Thermal profile normal', ok: true  },
      { label: 'No tamper flags',        ok: true  },
    ],
    history: [88, 89, 90, 91, 91, 92, 93, 94],
  },
  {
    serial: 'BSW-60V-C2D8-2023',
    healthScore: 67,
    status: 'FAIR' as HealthStatus,
    cycleCount: 489,
    capacity: 71.3,
    internalResistance: 34,
    cellBalance: 0.048,
    tempRange: '24–52°C',
    lastChecked: 'Yesterday, 04:15 PM',
    recommendation: 'Monitor closely. Schedule replacement within 60 days.',
    checks: [
      { label: 'Manufacturer Match',      ok: true  },
      { label: 'Cycle count within spec', ok: false },
      { label: 'Cell voltage balanced',   ok: false },
      { label: 'Thermal profile normal',  ok: false },
      { label: 'No tamper flags',         ok: true  },
    ],
    history: [85, 82, 78, 76, 73, 71, 69, 67],
  },
];

function RadialGauge({ score, status }: { score: number; status: HealthStatus }) {
  const cfg = STATUS_MAP[status];
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" strokeWidth="10" className="stroke-border" />
        <motion.circle
          cx="70" cy="70" r={r} fill="none" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`${cfg.bar.replace('bg-', 'stroke-')}`}
          style={{ stroke: status === 'EXCELLENT' || status === 'GOOD' ? 'hsl(var(--accent-green))' : status === 'FAIR' ? 'hsl(var(--accent-yellow))' : status === 'POOR' ? '#fb923c' : '#FF4757' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={`font-display text-4xl tracking-tight ${cfg.color}`}>{score}%</div>
        <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-foreground mt-0.5">{cfg.label}</div>
      </div>
    </div>
  );
}

function SparkLine({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data) - 2;
  const w = 120, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" strokeWidth="2" className="stroke-brand-green" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min)) * h;
        return i === data.length - 1 ? (
          <circle key={i} cx={x} cy={y} r="3" className="fill-brand-green" />
        ) : null;
      })}
    </svg>
  );
}

export default function DiagnosticsPage() {
  const [serial, setSerial] = useState('');
  const [result, setResult] = useState<typeof MOCK_RESULTS[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runDiagnostic = () => {
    const trimmed = serial.trim().toUpperCase();
    if (!trimmed) { setError('Please enter a battery serial number.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const match = MOCK_RESULTS.find((r) => r.serial === trimmed);
      setResult(match ?? {
        ...MOCK_RESULTS[0],
        serial: trimmed,
        healthScore: Math.floor(Math.random() * 30 + 60),
        status: 'GOOD',
      });
      setLoading(false);
    }, 1400);
  };

  return (
    <>
      <SiteHeader />
      <DottedSurface className="opacity-40" />

      <main className="relative isolate flex-1 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl">

          <FadeUp>
            <div className="mb-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green mb-4 block">
                Battery Diagnostics
              </span>
              <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-3">
                Check Your Battery
              </h1>
              <p className="text-muted-foreground text-base font-light max-w-lg">
                Enter a battery serial number to get a full health report — cycle count, capacity, cell balance, and more.
              </p>
            </div>
          </FadeUp>

          {/* Serial input */}
          <FadeUp delay={0.08}>
            <div className="card-brutal rounded-3xl p-6 md:p-8 mb-8">
              <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Battery Serial Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runDiagnostic()}
                  placeholder="e.g. BSW-48V-A7F3-2024"
                  className="flex-1 px-5 py-3.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none font-mono transition-colors"
                />
                <button
                  onClick={runDiagnostic}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
                >
                  <Search className="h-4 w-4" />
                  {loading ? 'Scanning…' : 'Run Diagnostic'}
                </button>
              </div>
              {error && <p className="text-brand-red text-xs mt-3 font-light">{error}</p>}
              <p className="text-muted-foreground text-[10px] font-mono mt-3 tracking-wide">
                Try: BSW-48V-A7F3-2024 or BSW-60V-C2D8-2023
              </p>
            </div>
          </FadeUp>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-brutal rounded-3xl p-10 flex flex-col items-center justify-center gap-4"
              >
                <div className="h-12 w-12 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
                <p className="text-muted-foreground text-sm font-light">Running full diagnostic scan…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Header card */}
                <div className="card-brutal rounded-3xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <RadialGauge score={result.healthScore} status={result.status} />
                    <div className="flex-1 text-center md:text-left">
                      <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full border mb-4 ${STATUS_MAP[result.status].bg} ${STATUS_MAP[result.status].color}`}>
                        {result.status}
                      </div>
                      <h2 className="font-display text-2xl uppercase tracking-tight text-foreground mb-1">
                        {result.serial}
                      </h2>
                      <p className="text-muted-foreground text-sm font-light mb-5">{result.recommendation}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: 'Cycles',     value: result.cycleCount,            icon: Clock },
                          { label: 'Capacity',   value: `${result.capacity}%`,        icon: BatteryCharging },
                          { label: 'Resistance', value: `${result.internalResistance}mΩ`, icon: Zap },
                          { label: 'Temp',       value: result.tempRange,             icon: ThermometerSun },
                        ].map(({ label, value, icon: Icon }) => (
                          <div key={label} className="bg-card border border-border rounded-xl p-3">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground mb-2" strokeWidth={1.5} />
                            <div className="font-display text-xl text-foreground">{value}</div>
                            <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-foreground mt-0.5">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checks + sparkline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="card-brutal rounded-2xl p-6">
                    <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">Diagnostic Checks</h3>
                    <div className="space-y-3">
                      {result.checks.map((c) => (
                        <div key={c.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground font-light">{c.label}</span>
                          {c.ok
                            ? <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-green"><CheckCircle2 className="h-3.5 w-3.5" /> Pass</span>
                            : <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-red"><AlertTriangle className="h-3.5 w-3.5" /> Flag</span>
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-brutal rounded-2xl p-6 flex flex-col">
                    <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">Health Trend</h3>
                    <div className="flex-1 flex flex-col justify-between">
                      <SparkLine data={result.history} />
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <TrendingDown className={`h-4 w-4 ${result.history[0] > result.history[result.history.length - 1] ? 'text-brand-volt rotate-180' : 'text-brand-green'}`} />
                        <span className="text-xs text-muted-foreground font-light">
                          {result.history[result.history.length - 1] >= result.history[0] ? 'Improving over last 8 swaps' : 'Declining — monitor closely'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border">
                      <FileCheck className="h-4 w-4 text-brand-green" />
                      <span className="text-xs font-light text-muted-foreground">
                        Last checked: <span className="text-foreground">{result.lastChecked}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Download */}
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:bg-card transition-colors">
                    <Download className="h-4 w-4" />
                    Download PDF Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
