'use client';

import React, { Suspense, useState } from 'react';
import { Zap, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);

function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const sendOtp = () => setOtpSent(true);

  const handleLogin = () => {
    document.cookie = 'session=dev; path=/; max-age=86400';
    const from = searchParams.get('from') || '/dashboard';
    window.location.href = from;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DottedSurface className="opacity-30" />

      {/* Header */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
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
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl uppercase tracking-tight text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm font-light">Log in to manage your swaps and battery profile.</p>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-full border border-border bg-card p-1 mb-6">
            {(['email', 'otp'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase transition-all ${
                  mode === m ? 'bg-foreground text-background' : 'text-muted-foreground'
                }`}
              >
                {m === 'email' ? 'Email' : 'Phone OTP'}
              </button>
            ))}
          </div>

          <div className="card-brutal rounded-3xl p-6 space-y-4">
            {mode === 'email' ? (
              <>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1.5">
                    <Link href="#" className="text-[10px] font-mono text-muted-foreground hover:text-foreground tracking-wide">Forgot password?</Link>
                  </div>
                </div>

                <button onClick={handleLogin} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity mt-2">
                  Log In <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Philippine Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-3 rounded-xl border border-border bg-card text-sm text-muted-foreground font-mono">+63</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9XX XXX XXXX"
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none font-mono transition-colors"
                    />
                  </div>
                </div>
                {!otpSent ? (
                  <button onClick={sendOtp}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
                    <Phone className="h-4 w-4" /> Send OTP
                  </button>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">6-Digit OTP</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="______"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none font-mono tracking-[0.5em] text-center transition-colors"
                      />
                      <div className="text-center mt-1.5">
                        <button onClick={sendOtp} className="text-[10px] font-mono text-muted-foreground hover:text-foreground tracking-wide">Resend OTP</button>
                      </div>
                    </div>
                    <button onClick={handleLogin} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
                      Verify & Log In <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">or</span></div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border text-sm text-foreground hover:bg-card transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground font-light mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-foreground font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
