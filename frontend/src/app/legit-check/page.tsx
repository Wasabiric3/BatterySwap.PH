'use client';

import React, { useState } from 'react';
import {
  ScanLine, ShieldCheck, ShieldAlert, ShieldX,
  AlertTriangle, CheckCircle2, XCircle, Search,
  Flag, Hash,
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

type VerificationStatus = 'authentic' | 'unregistered' | 'flagged';

interface VerificationResult {
  serial: string;
  status: VerificationStatus;
  manufacturer: string;
  model: string;
  productionDate: string;
  warrantyExpiry: string;
  checks: { label: string; ok: boolean; note?: string }[];
}

const STATUS_CONFIG: Record<VerificationStatus, {
  icon: React.ElementType; label: string; headline: string;
  color: string; bg: string; border: string;
}> = {
  authentic:    { icon: ShieldCheck, label: 'Authentic',    headline: 'Battery Verified',     color: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green/30' },
  unregistered: { icon: ShieldAlert, label: 'Unregistered', headline: 'Not in Registry',      color: 'text-brand-volt',  bg: 'bg-brand-volt/10',  border: 'border-brand-volt/30'  },
  flagged:      { icon: ShieldX,     label: 'Flagged',      headline: 'Stolen / Tampered',    color: 'text-brand-red',   bg: 'bg-brand-red/10',   border: 'border-brand-red/30'   },
};

const MOCK_DB: Record<string, VerificationResult> = {
  'BSW-48V-A7F3-2024': {
    serial: 'BSW-48V-A7F3-2024',
    status: 'authentic',
    manufacturer: 'BatterySwap PH',
    model: '48V 20Ah LiFePO4',
    productionDate: 'January 2024',
    warrantyExpiry: 'January 2026',
    checks: [
      { label: 'Manufacturer match',          ok: true  },
      { label: 'Serial not recalled',         ok: true  },
      { label: 'Not reported stolen',         ok: true  },
      { label: 'Seal integrity verified',     ok: true  },
      { label: 'Warranty valid',              ok: true  },
    ],
  },
  'BSW-60V-C2D8-2023': {
    serial: 'BSW-60V-C2D8-2023',
    status: 'unregistered',
    manufacturer: 'Unknown',
    model: '60V (unverified)',
    productionDate: 'Unknown',
    warrantyExpiry: 'N/A',
    checks: [
      { label: 'Manufacturer match',      ok: false, note: 'Not in partner database' },
      { label: 'Serial not recalled',     ok: true  },
      { label: 'Not reported stolen',     ok: true  },
      { label: 'Seal integrity verified', ok: false, note: 'Could not verify' },
      { label: 'Warranty valid',          ok: false, note: 'No warranty record found' },
    ],
  },
  'XX-STOLEN-0001': {
    serial: 'XX-STOLEN-0001',
    status: 'flagged',
    manufacturer: 'BatterySwap PH',
    model: '72V 30Ah',
    productionDate: 'March 2023',
    warrantyExpiry: 'Voided',
    checks: [
      { label: 'Manufacturer match',      ok: true  },
      { label: 'Serial not recalled',     ok: false, note: 'Recalled — safety defect' },
      { label: 'Not reported stolen',     ok: false, note: 'Reported stolen Apr 2024' },
      { label: 'Seal integrity verified', ok: false, note: 'Tamper seal broken' },
      { label: 'Warranty valid',          ok: false, note: 'Voided due to tampering' },
    ],
  },
};

export default function LegitCheckPage() {
  const [serial, setSerial] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSerial, setReportSerial] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const verify = () => {
    const trimmed = serial.trim().toUpperCase();
    if (!trimmed) { setError('Please enter a battery serial number.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const match = MOCK_DB[trimmed];
      setResult(match ?? {
        serial: trimmed,
        status: 'unregistered',
        manufacturer: 'Unknown',
        model: 'Unverified',
        productionDate: 'Unknown',
        warrantyExpiry: 'N/A',
        checks: [
          { label: 'Manufacturer match',      ok: false, note: 'Not found in database' },
          { label: 'Serial not recalled',     ok: true  },
          { label: 'Not reported stolen',     ok: true  },
          { label: 'Seal integrity verified', ok: false, note: 'Could not verify remotely' },
          { label: 'Warranty valid',          ok: false, note: 'No record found' },
        ],
      });
      setLoading(false);
    }, 1200);
  };

  const cfg = result ? STATUS_CONFIG[result.status] : null;

  return (
    <>
      <SiteHeader />
      <DottedSurface className="opacity-40" />

      <main className="relative isolate flex-1 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-3xl">

          <FadeUp>
            <div className="mb-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green mb-4 block">
                Legit Check
              </span>
              <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-3">
                Verify a Battery
              </h1>
              <p className="text-muted-foreground text-base font-light max-w-lg">
                Scan or enter any battery serial number to check authenticity, recall status, and stolen battery registry.
              </p>
            </div>
          </FadeUp>

          {/* Input */}
          <FadeUp delay={0.08}>
            <div className="card-brutal rounded-3xl p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center shrink-0">
                  <ScanLine className="h-5 w-5 text-brand-green" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground uppercase tracking-wide">Serial Number Lookup</div>
                  <div className="text-xs text-muted-foreground font-light">Enter manually or scan QR/barcode</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && verify()}
                    placeholder="e.g. BSW-48V-A7F3-2024"
                    className="w-full pl-10 pr-4 py-3.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none font-mono transition-colors"
                  />
                </div>
                <button
                  onClick={verify}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
                >
                  <Search className="h-4 w-4" />
                  {loading ? 'Checking…' : 'Verify'}
                </button>
              </div>
              {error && <p className="text-brand-red text-xs mt-3 font-light">{error}</p>}
              <p className="text-muted-foreground text-[10px] font-mono mt-3 tracking-wide">
                Try: BSW-48V-A7F3-2024 · BSW-60V-C2D8-2023 · XX-STOLEN-0001
              </p>
            </div>
          </FadeUp>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="card-brutal rounded-3xl p-10 flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
                <p className="text-muted-foreground text-sm font-light">Checking manufacturer database…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && cfg && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">

                {/* Status banner */}
                <div className={`rounded-3xl p-6 md:p-8 border ${cfg.bg} ${cfg.border}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`h-14 w-14 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                      <cfg.icon className={`h-7 w-7 ${cfg.color}`} />
                    </div>
                    <div>
                      <div className={`text-[10px] font-bold tracking-[0.2em] uppercase ${cfg.color} mb-1`}>{cfg.label}</div>
                      <h2 className="font-display text-3xl uppercase tracking-tight text-foreground">{cfg.headline}</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Serial',      value: result.serial },
                      { label: 'Manufacturer', value: result.manufacturer },
                      { label: 'Model',       value: result.model },
                      { label: 'Warranty',    value: result.warrantyExpiry },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-background/50 rounded-xl p-3">
                        <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-foreground mb-1">{label}</div>
                        <div className="text-xs font-medium text-foreground truncate">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Checks */}
                  <div className="space-y-2">
                    {result.checks.map((c) => (
                      <div key={c.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground font-light">{c.label}</span>
                        <div className="flex items-center gap-2">
                          {c.note && <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">{c.note}</span>}
                          {c.ok
                            ? <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-green"><CheckCircle2 className="h-3.5 w-3.5" /> OK</span>
                            : <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-red"><XCircle className="h-3.5 w-3.5" /> Fail</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report stolen CTA */}
                {result.status !== 'flagged' && (
                  <div className="card-brutal rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-brand-volt shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-foreground uppercase tracking-wide">Know this battery is stolen?</div>
                        <div className="text-xs text-muted-foreground font-light">Help protect the community.</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setReportSerial(result.serial); setReportOpen(true); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-brand-red/40 text-brand-red text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-brand-red/10 transition-colors shrink-0"
                    >
                      <Flag className="h-3.5 w-3.5" /> Report
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Report stolen modal */}
          <AnimatePresence>
            {reportOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <button type="button" onClick={() => setReportOpen(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close" />
                <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                  className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
                  {!reportSent ? (
                    <>
                      <h2 className="font-display text-2xl uppercase tracking-tight text-foreground mb-2">Report Stolen Battery</h2>
                      <p className="text-muted-foreground text-sm font-light mb-6">
                        Serial: <span className="font-mono text-foreground">{reportSerial}</span>
                      </p>
                      <div className="space-y-3 mb-6">
                        <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none" />
                        <input type="text" placeholder="Contact number (PH)" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none" />
                        <textarea placeholder="Describe the incident…" rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none resize-none" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setReportOpen(false)} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors">Cancel</button>
                        <button onClick={() => setReportSent(true)} className="flex-1 py-3 rounded-full bg-brand-red text-white text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">Submit Report</button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/15 border border-brand-green/30">
                        <CheckCircle2 className="h-7 w-7 text-brand-green" />
                      </div>
                      <h2 className="font-display text-2xl uppercase tracking-tight text-foreground mb-3">Report Submitted</h2>
                      <p className="text-sm text-muted-foreground font-light mb-6">Our team will investigate within 24 hours.</p>
                      <button onClick={() => { setReportOpen(false); setReportSent(false); }}
                        className="rounded-full border border-border px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:bg-card transition-colors">
                        Close
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
