'use client';

import React, { useState } from 'react';
import {
  MapPin, BatteryCharging, Clock, Car, CreditCard, QrCode,
  ChevronLeft, Check, Zap, CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore, BatteryType, PaymentMethod } from '@/lib/store/booking.store';
import Link from 'next/link';

const STEPS = [
  { n: 1, icon: MapPin,        label: 'Station'  },
  { n: 2, icon: BatteryCharging, label: 'Battery' },
  { n: 3, icon: Clock,         label: 'Slot'     },
  { n: 4, icon: Car,           label: 'Vehicle'  },
  { n: 5, icon: CreditCard,    label: 'Payment'  },
  { n: 6, icon: QrCode,        label: 'Confirm'  },
];

const MOCK_STATIONS = [
  { id: 1, name: 'SwapHub BGC Central',       address: 'Bonifacio High Street Central, BGC', availableSlots: 9 },
  { id: 2, name: 'SwapPoint BHS South',        address: 'Bonifacio High Street South, BGC',  availableSlots: 3 },
  { id: 3, name: 'EcoCharge Fort Strip',       address: 'Fort Strip, 5th Ave, BGC',           availableSlots: 5 },
  { id: 4, name: 'GreenRide SM Aura',          address: 'SM Aura Premier, McKinley Pkwy',    availableSlots: 11 },
  { id: 6, name: 'SwapDock Uptown Mall',       address: 'Uptown Bonifacio, 9th Ave, BGC',    availableSlots: 7 },
  { id: 7, name: 'ChargeNode Market! Market!', address: 'Market! Market!, 26th St, BGC',     availableSlots: 14 },
];

const MOCK_VEHICLES = [
  { id: 'v1', nickname: 'My E-Bike',        type: 'E-Bike',     plateOrSerial: 'EB-2024-0012' },
  { id: 'v2', nickname: 'Work Scooter',     type: 'E-Scooter',  plateOrSerial: 'ABC-1234' },
];

const BATTERY_TYPES: { value: BatteryType; label: string; desc: string }[] = [
  { value: '48V', label: '48V Standard', desc: 'Entry-level e-bikes & scooters' },
  { value: '60V', label: '60V Mid-Range', desc: 'Mid-power e-bikes & cargo bikes' },
  { value: '72V', label: '72V High-Power', desc: 'Performance e-bikes & e-motorcycles' },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'gcash',  label: 'GCash',       icon: '💙' },
  { value: 'maya',   label: 'Maya',         icon: '💚' },
  { value: 'card',   label: 'Credit / Debit Card', icon: '💳' },
  { value: 'cash',   label: 'Cash at Station',     icon: '💵' },
];

function generateSlots(): { time: Date; available: boolean }[] {
  const slots: { time: Date; available: boolean }[] = [];
  const base = new Date();
  base.setMinutes(0, 0, 0);
  base.setHours(base.getHours() + 1);
  for (let i = 0; i < 16; i++) {
    const t = new Date(base.getTime() + i * 30 * 60000);
    slots.push({ time: t, available: Math.random() > 0.35 });
  }
  return slots;
}

const SLOTS = generateSlots();

function fmt(d: Date) {
  return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
}

/* ── Step panels ───────────────────────────────────────────── */

function Step1() {
  const { station, setStation, next } = useBookingStore();
  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-2">Select Station</h2>
      <p className="text-muted-foreground text-sm font-light mb-6">Choose the BatterySwap hub closest to you.</p>
      <div className="space-y-2">
        {MOCK_STATIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setStation(s); next(); }}
            className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 ${
              station?.id === s.id
                ? 'border-brand-green/50 bg-brand-green/5'
                : 'border-border bg-card hover:border-border/80 hover:bg-card/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-foreground uppercase tracking-wide mb-0.5">{s.name}</div>
                <div className="text-xs text-muted-foreground font-light">{s.address}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-brand-green">{s.availableSlots} slots</span>
                <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2() {
  const { batteryType, setBatteryType, next, back } = useBookingStore();
  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-2">Battery Type</h2>
      <p className="text-muted-foreground text-sm font-light mb-6">Select the voltage matching your vehicle.</p>
      <div className="space-y-3 mb-8">
        {BATTERY_TYPES.map(({ value, label, desc }) => (
          <button
            key={value}
            onClick={() => setBatteryType(value)}
            className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 ${
              batteryType === value
                ? 'border-brand-green/50 bg-brand-green/5'
                : 'border-border bg-card hover:border-border/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-foreground uppercase tracking-wide mb-0.5">{label}</div>
                <div className="text-xs text-muted-foreground font-light">{desc}</div>
              </div>
              {batteryType === value && <CheckCircle2 className="h-5 w-5 text-brand-green" />}
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors">Back</button>
        <button onClick={next} disabled={!batteryType} className="flex-1 py-3 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}

function Step3() {
  const { slotTime, setSlotTime, next, back } = useBookingStore();
  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-2">Pick a Slot</h2>
      <p className="text-muted-foreground text-sm font-light mb-6">{fmtDate(new Date())} — 30-minute intervals</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
        {SLOTS.map(({ time, available }) => {
          const isSelected = slotTime?.getTime() === time.getTime();
          return (
            <button
              key={time.getTime()}
              disabled={!available}
              onClick={() => setSlotTime(time)}
              className={`py-3 rounded-xl text-xs font-bold tracking-wide uppercase border transition-all duration-150 ${
                !available
                  ? 'border-border text-muted-foreground/30 cursor-not-allowed'
                  : isSelected
                  ? 'border-brand-green bg-brand-green/10 text-brand-green'
                  : 'border-border text-foreground hover:border-foreground/30'
              }`}
            >
              {fmt(time)}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 text-[10px] text-muted-foreground font-mono mb-6">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-green inline-block" /> Available</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-border inline-block" /> Taken</span>
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors">Back</button>
        <button onClick={next} disabled={!slotTime} className="flex-1 py-3 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}

function Step4() {
  const { vehicle, setVehicle, batteryType, next, back } = useBookingStore();
  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-2">Your Vehicle</h2>
      <p className="text-muted-foreground text-sm font-light mb-6">Confirm which vehicle you&apos;re swapping for.</p>
      <div className="space-y-3 mb-8">
        {MOCK_VEHICLES.map((v) => (
          <button
            key={v.id}
            onClick={() => setVehicle(v)}
            className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 ${
              vehicle?.id === v.id
                ? 'border-brand-green/50 bg-brand-green/5'
                : 'border-border bg-card hover:border-border/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-foreground uppercase tracking-wide mb-0.5">{v.nickname}</div>
                <div className="text-xs text-muted-foreground font-light">{v.type} · {v.plateOrSerial}</div>
              </div>
              {vehicle?.id === v.id && <CheckCircle2 className="h-5 w-5 text-brand-green" />}
            </div>
          </button>
        ))}
      </div>
      {batteryType && (
        <div className="bg-brand-volt/5 border border-brand-volt/20 rounded-2xl p-4 mb-6 text-xs text-brand-volt font-light">
          <Zap className="h-3.5 w-3.5 inline mr-1.5" />
          Selected battery: <span className="font-bold">{batteryType}</span> — make sure your vehicle is compatible.
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors">Back</button>
        <button onClick={next} disabled={!vehicle} className="flex-1 py-3 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}

function Step5() {
  const { paymentMethod, setPaymentMethod, next, back } = useBookingStore();
  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-2">Payment</h2>
      <p className="text-muted-foreground text-sm font-light mb-6">Choose how you&apos;d like to pay for this swap.</p>
      <div className="space-y-3 mb-8">
        {PAYMENT_METHODS.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setPaymentMethod(value)}
            className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 ${
              paymentMethod === value
                ? 'border-brand-green/50 bg-brand-green/5'
                : 'border-border bg-card hover:border-border/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div className="text-sm font-bold text-foreground uppercase tracking-wide">{label}</div>
              </div>
              {paymentMethod === value && <CheckCircle2 className="h-5 w-5 text-brand-green" />}
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors">Back</button>
        <button
          onClick={() => { next(); }}
          disabled={!paymentMethod}
          className="flex-1 py-3 rounded-full bg-brand-green text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

function Step6() {
  const { station, batteryType, slotTime, vehicle, bookingId, confirmBooking, reset } = useBookingStore();

  React.useEffect(() => {
    if (!bookingId) confirmBooking();
  }, [bookingId, confirmBooking]);

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/15 border border-brand-green/30">
        <Check className="h-8 w-8 text-brand-green" strokeWidth={2.5} />
      </div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-2">Booking Confirmed</h2>
      <p className="text-muted-foreground text-sm font-light mb-8">Show this QR code at the station to begin your swap.</p>

      {/* Fake QR */}
      <div className="bg-foreground p-5 rounded-2xl mx-auto w-44 h-44 flex items-center justify-center mb-6">
        <div className="w-full h-full border-4 border-background border-dashed flex items-center justify-center relative">
          <div className="absolute w-2/3 h-2/3 bg-background" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 10%, 10% 10%, 10% 100%, 0 100%)' }} />
          <div className="absolute w-2/3 h-2/3 bg-background bottom-0 right-0" style={{ clipPath: 'polygon(100% 100%, 0 100%, 0 90%, 90% 90%, 90% 0, 100% 0)' }} />
          <QrCode className="h-12 w-12 text-background" strokeWidth={1} />
        </div>
      </div>

      <div className="text-xs font-mono text-muted-foreground mb-8">{bookingId}</div>

      <div className="card-brutal rounded-2xl p-5 text-left space-y-3 mb-8">
        {[
          { label: 'Station',  value: station?.name ?? '—' },
          { label: 'Battery',  value: batteryType ?? '—' },
          { label: 'Slot',     value: slotTime ? `${fmtDate(slotTime)} · ${fmt(slotTime)}` : '—' },
          { label: 'Vehicle',  value: vehicle?.nickname ?? '—' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-muted-foreground font-light">{label}</span>
            <span className="text-foreground font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard" className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors text-center">
          Go to Dashboard
        </Link>
        <button onClick={reset} className="flex-1 py-3 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
          Book Another
        </button>
      </div>
    </div>
  );
}

const STEP_PANELS = [Step1, Step2, Step3, Step4, Step5, Step6];

export function BookingWizard() {
  const { step } = useBookingStore();
  const Panel = STEP_PANELS[step - 1];

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map(({ n, icon: Icon, label }, idx) => (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center gap-1">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                n < step
                  ? 'bg-brand-green border-brand-green text-background'
                  : n === step
                  ? 'border-foreground text-foreground bg-card'
                  : 'border-border text-muted-foreground bg-card'
              }`}>
                {n < step ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`text-[9px] font-mono tracking-wider uppercase hidden sm:block ${n === step ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 transition-colors duration-300 ${n < step ? 'bg-brand-green' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
        >
          <Panel />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
