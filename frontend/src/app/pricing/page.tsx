'use client';

import React, { useState } from 'react';
import { Zap, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { FadeUp } from '@/components/animations/FadeUp';
import { SiteHeader } from '@/components/ui/site-header';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);
import { SiteFooter } from '@/components/ui/site-footer';
import { PricingFAQ } from '@/components/ui/pricing-faq';
import { PricingCalculator } from '@/components/ui/pricing-calculator';
import { useComingSoon } from '@/components/ui/coming-soon-modal';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { open } = useComingSoon();

  const starterPrice = isAnnual ? '1,199' : '1,499';
  const proPrice = isAnnual ? '3,199' : '3,999';
  const starterSavings = (1499 - 1199) * 12;
  const proSavings = (3999 - 3199) * 12;

  return (
    <>
      <SiteHeader />

      <DottedSurface />

      <main className="flex-1 relative pb-12 pt-10">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <FadeUp>
            <div className="text-center mb-16">
              <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-foreground mb-6">
                Swap More, Worry Less
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-base font-light">
                Choose the perfect plan for your riding style. Cancel anytime.
              </p>

              {/* TOGGLE */}
              <div className="mt-12 flex items-center justify-center gap-4">
                <span className={`text-sm font-medium uppercase tracking-wider ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  aria-label="Toggle annual billing"
                  aria-pressed={isAnnual}
                  className="relative w-16 h-8 rounded-full bg-card p-1 transition-colors duration-300 hover:bg-card"
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-brand-green transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium uppercase tracking-wider ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-sm border border-brand-green/30">
                    -20%
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* PLAN 1 - STARTER */}
            <FadeUp delay={0.1} className="flex">
              <div className="bg-card backdrop-blur-md border border-border rounded-3xl p-8 lg:p-10 flex flex-col w-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-brand-green/50 hover:shadow-[0_0_30px_rgba(0,196,140,0.15)]">
                <div className="mb-8 mt-2">
                  <h3 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2">Basic Commuter</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed min-h-[40px]">
                    Perfect for everyday city commuters needing reliable power for work and errands.
                  </p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium text-muted-foreground">₱</span>
                    <span className="font-display text-6xl text-foreground tracking-tight">{starterPrice}</span>
                    <span className="text-muted-foreground text-sm font-light">/month</span>
                  </div>
                  {isAnnual ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground text-xs line-through">₱1,499/mo</span>
                      <span className="inline-flex items-center rounded-sm border border-brand-green/30 bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                        Save ₱{starterSavings.toLocaleString()}/yr
                      </span>
                    </div>
                  ) : (
                    <div className="h-6"></div>
                  )}
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    { text: 'Up to 15 swaps/month included', included: true, extra: 'then ₱80/swap' },
                    { text: 'Station Booking + QR check-in', included: true },
                    { text: 'Basic battery health stats', included: true },
                    { text: 'GCash + Maya payments', included: true },
                    { text: '1 Free Diagnostic Check/month', included: true },
                    { text: 'Real-time station availability', included: false },
                    { text: 'Priority booking', included: false },
                    { text: 'Legit check (add-on only)', included: false },
                    { text: 'Email support only', included: true },
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      ) : (
                        <span className="text-muted-foreground shrink-0 mt-0 font-bold text-lg leading-5">–</span>
                      )}
                      <div className="flex flex-col">
                        <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'} font-light`}>
                          {feature.text}
                        </span>
                        {feature.extra && (
                          <span className="text-[11px] text-muted-foreground font-light mt-0.5">
                            {feature.extra}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => open('Starter plan sign-up')}
                  className="w-full py-4 rounded-full border border-border text-foreground font-bold text-sm tracking-wide uppercase hover:bg-card transition-colors duration-300 mt-auto"
                >
                  Get Started
                </button>
              </div>
            </FadeUp>

            {/* PLAN 2 - PRO */}
            <FadeUp delay={0.2} className="flex">
              <div className="bg-card backdrop-blur-md border border-brand-green shadow-[0_0_30px_rgba(0,196,140,0.15)] rounded-3xl p-8 lg:p-10 flex flex-col w-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(0,196,140,0.25)]">
                <div className="absolute top-0 right-0 bg-[#F5C400] text-background text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-lg">
                  Most Popular
                </div>

                <div className="mb-8 mt-2">
                  <h3 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2 flex items-center gap-3">
                    Pro Commuter <Zap className="h-5 w-5 text-brand-green fill-brand-green" />
                  </h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed min-h-[40px]">
                    For heavy riders and delivery partners who are always on the road.
                  </p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium text-muted-foreground">₱</span>
                    <span className="font-display text-6xl text-foreground tracking-tight">{proPrice}</span>
                    <span className="text-muted-foreground text-sm font-light">/month</span>
                  </div>
                  {isAnnual ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground text-xs line-through">₱3,999/mo</span>
                      <span className="inline-flex items-center rounded-sm border border-brand-green/30 bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                        Save ₱{proSavings.toLocaleString()}/yr
                      </span>
                    </div>
                  ) : (
                    <div className="h-6"></div>
                  )}
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    { text: 'Up to 30 swaps/month included', included: true, extra: 'then ₱65/swap' },
                    { text: 'Full battery diagnostic + PDF reports', included: true },
                    { text: 'Real-time station availability', included: true },
                    { text: 'Priority booking during peak hours', included: true },
                    { text: 'Legit check included', included: true },
                    { text: 'Push + SMS notifications', included: true },
                    { text: 'Priority chat support', included: true },
                    { text: 'Family sharing (add-on)', included: false },
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      ) : (
                        <span className="text-muted-foreground shrink-0 mt-0 font-bold text-lg leading-5">–</span>
                      )}
                      <div className="flex flex-col">
                        <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'} font-light`}>
                          {feature.text}
                        </span>
                        {feature.extra && (
                          <span className="text-[11px] text-muted-foreground font-light mt-0.5">
                            {feature.extra}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => open('Pro plan sign-up')}
                  className="w-full py-4 rounded-full bg-brand-green text-background font-bold text-sm tracking-wide uppercase hover:bg-brand-green/90 transition-colors duration-300 mt-auto"
                >
                  Get Started
                </button>
              </div>
            </FadeUp>

            {/* PLAN 3 - ENTERPRISE */}
            <FadeUp delay={0.3} className="flex">
              <div className="bg-card backdrop-blur-md border border-border rounded-3xl p-8 lg:p-10 flex flex-col w-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-brand-green/50 hover:shadow-[0_0_30px_rgba(0,196,140,0.15)]">
                <div className="mb-8 mt-2">
                  <h3 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2">Fleet & Business</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed min-h-[40px]">
                    For logistics companies, delivery fleets, and corporate EV partners.
                  </p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-6xl text-foreground tracking-tight">Custom</span>
                  </div>
                  <div className="h-6"></div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    { text: 'Unlimited swaps per rider', included: true },
                    { text: 'Fleet management dashboard', included: true },
                    { text: 'Rider tracking & analytics', included: true },
                    { text: 'E-trike & cargo EV support', included: true },
                    { text: 'Unlimited Free Diagnostic Checks', included: true },
                    { text: 'Full REST API access for integration', included: true },
                    { text: 'Dedicated account manager', included: true },
                    { text: 'SLA: 99.9% uptime guarantee', included: true },
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-light">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => open('Enterprise inquiry')}
                  className="w-full py-4 rounded-full border border-border text-foreground font-bold text-sm tracking-wide uppercase hover:bg-card transition-colors duration-300 mt-auto"
                >
                  Contact Sales
                </button>
              </div>
            </FadeUp>
          </div>

          {/* BOTTOM BANNER */}
          <FadeUp delay={0.5}>
            <div className="mt-16 bg-card backdrop-blur-md border border-border rounded-2xl py-5 px-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-sm text-muted-foreground font-light text-center">
              <span className="text-foreground font-medium flex items-center justify-center gap-2">
                🔋 Free Diagnostic Check on every plan
              </span>
              <span className="hidden md:inline text-muted-foreground font-bold">·</span>
              <span>No setup fee</span>
              <span className="hidden md:inline text-muted-foreground font-bold">·</span>
              <span>Cancel anytime</span>
              <span className="hidden md:inline text-muted-foreground font-bold">·</span>
              <span>Philippine peso billing</span>
            </div>
          </FadeUp>
          {/* CALCULATOR */}
          <FadeUp delay={0.6}>
            <div className="mt-24 max-w-5xl mx-auto">
              <PricingCalculator />
            </div>
          </FadeUp>
        </div>

        <PricingFAQ />
      </main>

      <SiteFooter />
    </>
  );
}
