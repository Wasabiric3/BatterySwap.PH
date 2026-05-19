'use client';

import React from 'react';
import { Activity, BatteryCharging, BatteryWarning, Calendar, ChevronRight, Clock, MapPin, QrCode, ShieldCheck, Zap } from 'lucide-react';
import { FadeUp } from '@/components/animations/FadeUp';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <FadeUp>
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-2">
            Welcome Back, <span className="text-brand-volt">Alex</span>
          </h1>
          <p className="text-muted-foreground text-sm font-light">
            Manage your BatterySwap subscription and active batteries.
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Active Battery & QR */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* QR Code Section */}
          <FadeUp delay={0.1}>
            <div className="card-brutal rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-brand-green/5 group-hover:bg-brand-green/10 transition-colors duration-500" />
               <div className="relative z-10 w-full">
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-green mb-6 inline-flex items-center gap-2 border border-brand-green/30 bg-brand-green/10 px-3 py-1 rounded-full">
                    <QrCode className="h-3.5 w-3.5" />
                    Scan to Swap
                  </div>
                  
                  <div className="bg-foreground p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center mb-6">
                    {/* Placeholder for actual QR code image */}
                    <div className="w-full h-full border-4 border-background border-dashed flex items-center justify-center relative">
                        <div className="absolute w-2/3 h-2/3 bg-background" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 10%, 10% 10%, 10% 100%, 0 100%)' }}></div>
                        <div className="absolute w-2/3 h-2/3 bg-background bottom-0 right-0" style={{ clipPath: 'polygon(100% 100%, 0 100%, 0 90%, 90% 90%, 90% 0, 100% 0)' }}></div>
                        <QrCode className="h-16 w-16 text-background" strokeWidth={1} />
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-xs font-light max-w-[200px] mx-auto">
                    Present this code at any BatterySwap station.
                  </p>
               </div>
            </div>
          </FadeUp>

          {/* Active Subscription */}
          <FadeUp delay={0.2}>
             <div className="card-brutal rounded-3xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Plan</div>
                    <div className="text-foreground font-bold text-lg">Pro Commuter</div>
                  </div>
                  <div className="bg-card px-2.5 py-1 rounded-lg text-muted-foreground text-xs font-medium border border-border">
                    Active
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-border pb-4">
                    <span className="text-muted-foreground text-sm font-light">Swaps Remaining</span>
                    <span className="text-xl font-display text-foreground">12 <span className="text-sm text-muted-foreground">/ 20</span></span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border pb-4">
                    <span className="text-muted-foreground text-sm font-light">Renewal Date</span>
                    <span className="text-sm font-medium text-foreground">May 15, 2026</span>
                  </div>
                </div>
                
                <Link href="/pricing" className="block w-full mt-6 py-3 rounded-xl border border-border text-xs font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors text-center">
                  Manage Plan
                </Link>
             </div>
          </FadeUp>
        </div>

        {/* Right Column: Battery Health & History */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Active Battery Health */}
          <FadeUp delay={0.15}>
            <div className="card-brutal rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-brand-volt/10 border border-brand-volt/30 flex items-center justify-center shrink-0">
                  <BatteryCharging className="h-5 w-5 text-brand-volt" />
                </div>
                <div>
                  <h3 className="text-foreground font-bold text-lg uppercase tracking-wide">Current Battery</h3>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">ID: BSW-48V-A7F3</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Charge', value: '78%', icon: Zap, color: 'text-brand-volt' },
                  { label: 'Health', value: '96%', icon: Activity, color: 'text-brand-green' },
                  { label: 'Cycles', value: '142', icon: Clock, color: 'text-foreground' },
                  { label: 'Temp', value: '32°C', icon: ShieldCheck, color: 'text-muted-foreground' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-2xl p-4 flex flex-col">
                    <stat.icon className={`h-4 w-4 mb-3 ${stat.color} opacity-80`} strokeWidth={1.5} />
                    <div className="mt-auto">
                      <div className={`font-display text-2xl tracking-tight ${stat.color}`}>{stat.value}</div>
                      <div className="text-[9px] font-medium tracking-[0.15em] uppercase text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-volt/5 border border-brand-volt/20 rounded-2xl p-4 flex items-start gap-3">
                 <BatteryWarning className="h-5 w-5 text-brand-volt shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Estimated Range: 45km</h4>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Based on your recent riding habits. We recommend swapping before your charge drops below 15%.
                    </p>
                 </div>
              </div>
            </div>
          </FadeUp>

          {/* Recent Swaps */}
          <FadeUp delay={0.25}>
            <div className="card-brutal rounded-3xl p-6 md:p-8">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-foreground font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Recent Swaps
                 </h3>
                 <Link href="/dashboard/history" className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                    View All
                 </Link>
               </div>

               <div className="space-y-3">
                 {[
                   { station: 'SwapHub BGC Central', date: 'Today, 08:42 AM', diff: '+92%', time: '1m 45s' },
                   { station: 'EcoCharge Fort Strip', date: 'Apr 26, 06:15 PM', diff: '+85%', time: '2m 10s' },
                   { station: 'VoltBase McKinley Hill', date: 'Apr 24, 07:30 AM', diff: '+95%', time: '1m 55s' },
                 ].map((swap, idx) => (
                   <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-card hover:border-border transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center shrink-0">
                           <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-brand-green transition-colors" />
                         </div>
                         <div>
                           <div className="text-sm font-medium text-muted-foreground mb-1">{swap.station}</div>
                           <div className="text-xs text-muted-foreground font-light">{swap.date}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="hidden sm:block text-right">
                           <div className="text-sm font-bold text-brand-green">{swap.diff}</div>
                           <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Charge Added</div>
                         </div>
                         <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </FadeUp>

        </div>
      </div>
    </div>
  );
}
