'use client';

import React, { useState } from 'react';
import { MapPin, Clock, BatteryCharging, Download, ChevronDown, Filter, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/animations/FadeUp';

const SWAP_HISTORY = [
  { id: 'BSW-TXN-001', station: 'SwapHub BGC Central',       date: '2026-04-29', time: '08:42 AM', duration: '1m 45s', chargeAdded: '+92%', batterySerial: 'BSW-48V-A7F3', batteryType: '48V', amount: '₱49',  status: 'completed' },
  { id: 'BSW-TXN-002', station: 'EcoCharge Fort Strip',       date: '2026-04-26', time: '06:15 PM', duration: '2m 10s', chargeAdded: '+85%', batterySerial: 'BSW-48V-B3C1', batteryType: '48V', amount: '₱49',  status: 'completed' },
  { id: 'BSW-TXN-003', station: 'VoltBase McKinley Hill',     date: '2026-04-24', time: '07:30 AM', duration: '1m 55s', chargeAdded: '+95%', batterySerial: 'BSW-48V-D5E2', batteryType: '48V', amount: '₱49',  status: 'completed' },
  { id: 'BSW-TXN-004', station: 'GreenRide SM Aura',          date: '2026-04-21', time: '12:02 PM', duration: '2m 05s', chargeAdded: '+88%', batterySerial: 'BSW-48V-F7G4', batteryType: '48V', amount: '₱49',  status: 'completed' },
  { id: 'BSW-TXN-005', station: 'SwapDock Uptown Mall',       date: '2026-04-18', time: '09:50 AM', duration: '—',      chargeAdded: '—',    batterySerial: '—',             batteryType: '48V', amount: '₱0',   status: 'cancelled' },
  { id: 'BSW-TXN-006', station: 'SwapPoint BHS South',        date: '2026-04-15', time: '07:00 AM', duration: '1m 50s', chargeAdded: '+90%', batterySerial: 'BSW-48V-H8J5', batteryType: '48V', amount: '₱49',  status: 'completed' },
  { id: 'BSW-TXN-007', station: 'ChargeNode Market! Market!', date: '2026-04-11', time: '06:35 PM', duration: '2m 30s', chargeAdded: '+87%', batterySerial: 'BSW-48V-K2L9', batteryType: '48V', amount: '₱49',  status: 'completed' },
  { id: 'BSW-TXN-008', station: 'SwapHub BGC Central',        date: '2026-04-08', time: '08:05 AM', duration: '1m 40s', chargeAdded: '+94%', batterySerial: 'BSW-48V-M4N3', batteryType: '48V', amount: '₱49',  status: 'completed' },
];

const STATUS_STYLE: Record<string, string> = {
  completed: 'text-brand-green bg-brand-green/10 border-brand-green/30',
  cancelled: 'text-brand-red bg-brand-red/10 border-brand-red/30',
  pending:   'text-brand-volt bg-brand-volt/10 border-brand-volt/30',
};

export default function HistoryPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const filtered = filter === 'all' ? SWAP_HISTORY : SWAP_HISTORY.filter((s) => s.status === filter);
  const totalSwaps = SWAP_HISTORY.filter((s) => s.status === 'completed').length;
  const totalSpent = SWAP_HISTORY.filter((s) => s.status === 'completed').length * 49;
  const avgDuration = '1m 59s';

  return (
    <div className="max-w-3xl mx-auto">
      <FadeUp>
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-2">Swap History</h1>
          <p className="text-muted-foreground text-sm font-light">Complete record of all your battery exchanges.</p>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.08}>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Swaps',   value: totalSwaps,       icon: BatteryCharging },
            { label: 'Total Spent',   value: `₱${totalSpent}`, icon: Calendar        },
            { label: 'Avg Duration',  value: avgDuration,       icon: Clock           },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-brutal rounded-2xl p-4 flex flex-col gap-1">
              <Icon className="h-4 w-4 text-muted-foreground mb-1" strokeWidth={1.5} />
              <div className="font-display text-2xl text-foreground">{value}</div>
              <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Filters + export */}
      <FadeUp delay={0.12}>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(['all', 'completed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-lg border transition-colors ${
                  filter === f ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </FadeUp>

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((swap, idx) => (
            <motion.div
              key={swap.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <button
                onClick={() => setExpanded(expanded === swap.id ? null : swap.id)}
                className="w-full text-left card-brutal rounded-2xl p-5 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground uppercase tracking-wide mb-0.5">{swap.station}</div>
                      <div className="text-xs text-muted-foreground font-mono">{swap.date} · {swap.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-bold text-brand-green hidden sm:block`}>{swap.chargeAdded}</span>
                    <span className={`text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLE[swap.status]}`}>
                      {swap.status}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === swap.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === swap.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Transaction ID', value: swap.id },
                          { label: 'Duration',        value: swap.duration },
                          { label: 'Battery Serial',  value: swap.batterySerial },
                          { label: 'Amount Charged',  value: swap.amount },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-foreground mb-0.5">{label}</div>
                            <div className="text-xs font-medium text-foreground font-mono">{value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
