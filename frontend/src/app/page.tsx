'use client';

import React from 'react';
import {
  BatteryCharging,
  MapPin,
  CalendarCheck,
  Zap,
  Activity,
  ShieldCheck,
  Bike,
  ArrowUpRight,
  ChevronDown,
  FileCheck,
  ScanLine,
} from 'lucide-react';

import dynamic from 'next/dynamic';
import { FadeUp, StaggeredHeadline, AnimateIn } from '@/components/animations/FadeUp';
import { RippleButton } from '@/components/animations/RippleButton';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { useComingSoon } from '@/components/ui/coming-soon-modal';
import Link from 'next/link';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);

const BGC_STATIONS = [
  { id: 1, name: 'SwapHub BGC Central', address: 'Bonifacio High Street Central, BGC', slots: 12 },
  { id: 2, name: 'SwapPoint BHS South', address: 'Bonifacio High Street South, BGC', slots: 8 },
  { id: 3, name: 'EcoCharge Fort Strip', address: 'Fort Strip, BGC', slots: 5 },
  { id: 4, name: 'GreenRide SM Aura', address: 'SM Aura Premier, BGC', slots: 15 },
  { id: 5, name: 'VoltBase McKinley Hill', address: 'McKinley Hill, BGC', slots: 6 },
  { id: 6, name: 'SwapDock Uptown Mall', address: 'Uptown Bonifacio Mall, BGC', slots: 10 },
  { id: 7, name: 'ChargeNode Market! Market!', address: 'Market! Market!, BGC', slots: 20 },
];

export default function Home() {
  const { open } = useComingSoon();

  return (
    <>
      <SiteHeader />

      <main className="relative isolate flex-1">
        <DottedSurface />
        <div className="relative z-10">
          {/* ─── HERO ──────────────────────────────────────────────── */}
          <section
            id="hero"
            className="relative min-h-screen flex flex-col justify-center overflow-hidden"
          >
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <AnimateIn delay={0}>
                <div className="flex justify-center mb-12">
                  <span className="ink-accent text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green">
                    Piloting in BGC, Taguig
                  </span>
                </div>
              </AnimateIn>

              <StaggeredHeadline
                words={[
                  { text: 'SWAP.', className: 'text-brand-volt' },
                  { text: ' CHARGE.', className: 'text-foreground' },
                  { text: ' RIDE.', className: 'text-brand-green' },
                ]}
              />

              <AnimateIn delay={0.8}>
                <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-lg mx-auto text-center leading-relaxed font-light">
                  Exchange your depleted e-bike battery for a fully charged one in under 2 minutes —
                  no waiting, no range anxiety.
                </p>
              </AnimateIn>

              <AnimateIn delay={1.0}>
                <div className="flex justify-center mt-10">
                  <Link href="/stations">
                    <RippleButton className="hero-cta flex items-center gap-3 bg-foreground text-background font-bold text-sm tracking-wide uppercase px-8 py-4 rounded-full">
                      Find a Station
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                    </RippleButton>
                  </Link>
                  <Link href="/booking" className="flex items-center gap-3 border border-border text-foreground font-bold text-sm tracking-wide uppercase px-8 py-4 rounded-full hover:bg-card transition-colors">
                    Book a Swap
                  </Link>
                </div>
              </AnimateIn>
            </div>

            <AnimateIn delay={1.5}>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
                <ChevronDown className="h-4 w-4 text-muted-foreground animate-bounce" strokeWidth={1} />
              </div>
            </AnimateIn>
          </section>

          {/* ─── STATS STRIP ─────────────────────────────────────── */}
          <section className="border-t border-b border-border py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: '7', label: 'Active Stations' },
                { value: '< 2', label: 'Min Avg Swap' },
                { value: '100%', label: 'Battery Verified' },
                { value: 'BGC', label: 'Pilot City' },
              ].map((stat, idx) => (
                <FadeUp key={idx} delay={idx * 0.08}>
                  <div className={`flex flex-col items-center text-center py-8 px-4 ${idx < 3 ? 'md:border-r md:border-border' : ''} ${(idx === 0 || idx === 2) ? 'border-r border-border' : ''} ${idx < 2 ? 'border-b md:border-b-0 border-border' : ''}`}>
                    <span className="font-display text-5xl md:text-6xl text-brand-volt tracking-tight leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground mt-3">
                      <span className="text-brand-green mr-1">·</span>{stat.label}
                    </span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          </section>

        {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
          <section id="how-it-works" className="py-28 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeUp>
              <div className="mb-20">
                <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-4">
                  How It Works
                </h2>
                <p className="text-muted-foreground max-w-lg text-base font-light">
                  Four simple steps to keep you moving without the wait.
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: 'Find Station', desc: 'Locate the nearest BatterySwap hub on our live map.' },
                { icon: CalendarCheck, title: 'Book a Slot', desc: 'Reserve your battery in advance to guarantee availability.' },
                { icon: BatteryCharging, title: 'Swap Battery', desc: 'Scan your QR code and swap your battery in 2 minutes.' },
                { icon: Zap, title: 'Ride Again', desc: 'Hit the road with 100% power and zero range anxiety.' },
              ].map((step, idx) => (
                <FadeUp key={idx} delay={idx * 0.12}>
                  <div className="relative card-brutal rounded-2xl p-8 min-h-[220px] group">
                    <span className="text-[11px] font-mono text-brand-green tracking-widest mb-6 block">— 0{idx + 1}</span>
                    <step.icon className="h-5 w-5 text-muted-foreground mb-5 group-hover:text-foreground transition-colors duration-500" strokeWidth={1} />
                    <h3 className="text-base font-bold text-foreground uppercase tracking-wide mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          </section>

        {/* ─── FEATURES ──────────────────────────────────────────── */}
          <section id="features" className="py-28 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeUp>
              <div className="mb-20">
                <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-4">
                  More Than Just a Swap
                </h2>
                <p className="text-muted-foreground max-w-lg text-base font-light">
                  We provide a comprehensive ecosystem for electric mobility in the Philippines.
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Fast Swap Technology',
                  desc: 'Authenticate, unlock, swap, and lock in under 120 seconds. No more waiting hours to charge.',
                },
                {
                  icon: Activity,
                  title: 'Advanced Diagnostics',
                  desc: 'Full health check every swap. View cycle counts, capacity degradation, and health scores.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Instant Legit Check',
                  desc: 'Verifies manufacturer serial numbers and flags tampered or stolen units instantly.',
                },
                {
                  icon: Bike,
                  title: 'E-Bike & EV Ready',
                  desc: 'Multi-voltage stations support 48V e-bikes to 72V electric motorcycles.',
                },
              ].map((feature, idx) => (
                <FadeUp key={idx} delay={idx * 0.1}>
                  <div className="group card-brutal rounded-2xl p-8 h-full flex flex-col items-start border-b-2 border-b-transparent hover:border-b-brand-green/40 transition-all duration-500">
                    <feature.icon
                      className="h-5 w-5 text-muted-foreground mb-6 group-hover:text-brand-volt transition-colors duration-500"
                      strokeWidth={1}
                    />
                    <h3 className="text-base font-bold text-foreground uppercase tracking-wide mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          </section>

        {/* ─── DIAGNOSTICS ───────────────────────────────────────── */}
          <section id="diagnostics" className="py-28 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeUp>
                <div>
                  <span className="ink-accent text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green mb-6">
                    Diagnostics
                  </span>
                  <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-6">
                    Know Your Battery&apos;s Health
                  </h2>
                  <p className="text-muted-foreground text-base font-light leading-relaxed mb-8 max-w-lg">
                    Every swap runs a full diagnostic: cycle count, capacity retention, internal
                    resistance, cell balance, and temperature profile. Get a PDF report after every
                    check and spot issues before they strand you on the road.
                  </p>
                  <button
                    onClick={() => open('Diagnostics Dashboard')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground text-xs font-bold uppercase tracking-[0.15em] hover:bg-card transition-colors"
                  >
                    Try Diagnostics <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="card-brutal rounded-3xl p-8 relative overflow-hidden">
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { label: 'Health Score', value: '94%', tone: 'text-brand-green' },
                      { label: 'Cycle Count', value: '247', tone: 'text-foreground' },
                      { label: 'Capacity', value: '96.2%', tone: 'text-brand-green' },
                      { label: 'Temp Range', value: '22–38°C', tone: 'text-brand-volt' },
                    ].map((m) => (
                      <div key={m.label} className="rounded-2xl bg-card border border-border p-5">
                        <div className={`font-display text-4xl tracking-tight ${m.tone}`}>{m.value}</div>
                        <div className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mt-2">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
                    <FileCheck className="h-4 w-4 text-brand-green" />
                    <span className="text-xs font-light text-muted-foreground">
                      Last report: <span className="text-foreground">Today, 09:42</span>
                    </span>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
          </section>

        {/* ─── LEGIT CHECK ───────────────────────────────────────── */}
          <section id="legit-check" className="py-28 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeUp delay={0.15} className="lg:order-2">
                <div>
                  <span className="ink-accent text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green mb-6">
                    Legit Check
                  </span>
                  <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-6">
                    Verified, Not Counterfeit
                  </h2>
                  <p className="text-muted-foreground text-base font-light leading-relaxed mb-8 max-w-lg">
                    Scan any battery&apos;s serial number against our partner manufacturer database.
                    Instantly flag counterfeits, recalled units, and tampered cells before you buy
                    secondhand or accept a suspicious swap.
                  </p>
                  <button
                    onClick={() => open('Legit Check Scanner')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground text-xs font-bold uppercase tracking-[0.15em] hover:bg-card transition-colors"
                  >
                    Scan a Battery <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </FadeUp>

              <FadeUp className="lg:order-1">
                <div className="card-brutal rounded-3xl p-8 relative overflow-hidden">
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                    <div className="h-12 w-12 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center shrink-0">
                      <ScanLine className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <div className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                        Scanned
                      </div>
                      <div className="font-mono text-sm text-foreground mt-1">BSW-48V-A7F3-2024</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Manufacturer Match', ok: true },
                      { label: 'Serial Not Recalled', ok: true },
                      { label: 'Not Reported Stolen', ok: true },
                      { label: 'Seal Integrity', ok: true },
                    ].map((c) => (
                      <div key={c.label} className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground font-light">{c.label}</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
          </section>

        {/* ─── STATIONS ──────────────────────────────────────────── */}
          <section id="stations" className="py-28 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeUp>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-4">
                    Our Stations
                  </h2>
                  <p className="text-muted-foreground max-w-lg text-base font-light">
                    Currently piloting 7 high-tech swap stations across Bonifacio Global City.
                  </p>
                </div>
                <Link
                  href="/stations"
                  className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  View All Stations <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BGC_STATIONS.map((station, idx) => (
                <FadeUp key={station.id} delay={idx * 0.08}>
                  <div className="station-card rounded-2xl p-6 min-h-[200px] flex flex-col group">
                    <h3 className="font-bold text-base text-foreground uppercase tracking-wide mb-1">
                      {station.name}
                    </h3>
                    <p className="text-muted-foreground text-xs mb-6 font-light">{station.address}</p>

                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{station.slots} slots</span>
                      </div>
                      <Link
                        href="/booking"
                        className="book-btn text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-lg"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              ))}

              <FadeUp delay={0.6}>
                <div className="rounded-2xl border border-dashed border-border p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mb-3" strokeWidth={1.5} />
                  <h3 className="font-bold text-base text-foreground uppercase tracking-wide mb-1">
                    Makati Expansion
                  </h3>
                  <p className="text-muted-foreground text-xs font-light">Coming in Phase 2</p>
                </div>
              </FadeUp>
            </div>
          </div>
          </section>

        {/* ─── WAITLIST CTA ────────────────────────────────────── */}
          <section className="py-28 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeUp>
              <div className="max-w-2xl mx-auto rounded-2xl p-12 md:p-16 border border-border bg-card text-center">
                <span className="ink-accent text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green mb-8 inline-block">
                  Expansion Coming Soon
                </span>

                <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-foreground mt-8 mb-5">
                  Charge Your Future
                </h2>
                <p className="text-muted-foreground text-base font-light max-w-md mx-auto mb-10 leading-relaxed">
                  Be the first to know when BatterySwap PH comes to your city. Join the waitlist now.
                </p>

                <button
                  onClick={() => open('Waitlist')}
                  className="whitespace-nowrap px-8 py-4 rounded-full bg-brand-green text-background font-bold text-sm tracking-wide uppercase hover:bg-brand-green/90 transition-colors duration-300"
                >
                  Join Waitlist
                </button>
                <p className="text-muted-foreground text-[10px] font-mono tracking-[0.2em] uppercase mt-6">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </FadeUp>
          </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
