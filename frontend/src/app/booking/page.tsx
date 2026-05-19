'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { FadeUp } from '@/components/animations/FadeUp';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);

const BookingWizard = dynamic(
  () => import('@/components/booking/BookingWizard').then((m) => ({ default: m.BookingWizard })),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
);

export default function BookingPage() {
  return (
    <>
      <SiteHeader />
      <DottedSurface className="opacity-40" />
      <main className="relative isolate flex-1 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <FadeUp>
            <div className="mb-10 text-center">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green mb-4 block">
                Book a Swap
              </span>
              <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-3">
                Reserve Your Battery
              </h1>
              <p className="text-muted-foreground text-base font-light max-w-md mx-auto">
                Select a station, pick your slot, and ride in under 2 minutes.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="card-brutal rounded-3xl p-6 md:p-10">
              <BookingWizard />
            </div>
          </FadeUp>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
