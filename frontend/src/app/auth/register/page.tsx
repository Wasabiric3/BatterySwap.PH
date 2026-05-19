'use client';

import React, { useState } from 'react';
import { Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);

const VEHICLE_TYPES = ['E-Bike', 'E-Scooter', 'E-Motorcycle', 'Electric Car'];
const BATTERY_TYPES = ['48V', '60V', '72V', 'Not sure'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [batteryType, setBatteryType] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DottedSurface className="opacity-30" />

      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Zap className="h-5 w-5 text-foreground fill-foreground" />
          <span className="text-sm font-bold tracking-tight text-foreground uppercase">
            BatterySwap <span className="text-muted-foreground">PH</span>
          </span>
        </Link>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((n) => (
              <React.Fragment key={n}>
                <div className={`h-2 w-2 rounded-full transition-all duration-300 ${n <= step ? 'bg-brand-green w-6' : 'bg-border'}`} />
              </React.Fragment>
            ))}
          </div>

          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl uppercase tracking-tight text-foreground mb-2">
              {step === 1 ? 'Create Account' : 'Your Vehicle'}
            </h1>
            <p className="text-muted-foreground text-sm font-light">
              {step === 1 ? 'Join BatterySwap PH and ride without limits.' : 'Tell us about your e-vehicle so we can match batteries.'}
            </p>
          </div>

          <div className="card-brutal rounded-3xl p-6 space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan dela Cruz"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Philippine Mobile</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-3 rounded-xl border border-border bg-card text-sm text-muted-foreground font-mono">+63</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9XX XXX XXXX"
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none font-mono transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors" />
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity mt-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">Vehicle Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VEHICLE_TYPES.map((v) => (
                      <button key={v} onClick={() => setVehicleType(v)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${
                          vehicleType === v ? 'border-brand-green/50 bg-brand-green/10 text-brand-green' : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                        }`}>
                        {vehicleType === v && <Check className="h-3 w-3 shrink-0" />}
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">Battery Voltage</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BATTERY_TYPES.map((b) => (
                      <button key={b} onClick={() => setBatteryType(b)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${
                          batteryType === b ? 'border-brand-green/50 bg-brand-green/10 text-brand-green' : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                        }`}>
                        {batteryType === b && <Check className="h-3 w-3 shrink-0" />}
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => setAgree((v) => !v)}
                    className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${agree ? 'bg-brand-green border-brand-green' : 'border-border'}`}
                  >
                    {agree && <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />}
                  </div>
                  <span className="text-xs text-muted-foreground font-light leading-relaxed">
                    I agree to the <Link href="#" className="text-foreground hover:underline">Terms of Service</Link> and{' '}
                    <Link href="#" className="text-foreground hover:underline">Privacy Policy</Link> (RA 10173).
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors">Back</button>
                  <button disabled={!agree}
                    className="flex-1 py-3 rounded-full bg-brand-green text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                    Create Account
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground font-light mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-foreground font-medium hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
