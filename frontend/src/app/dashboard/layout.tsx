'use client';

import React from 'react';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { DottedSurface } from '@/components/ui/dotted-surface';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="relative isolate flex-1 min-h-screen pt-24 pb-12">
        <DottedSurface className="opacity-40" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
