'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { FadeUp } from '@/components/animations/FadeUp';
import { SiteFooter } from '@/components/ui/site-footer';
import { SiteHeader } from '@/components/ui/site-header';
import { BYDPartnership } from '@/components/ui/byd-partnership';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);

const BRANDS = [
  {
    name: 'Hatasu E-Bikes',
    description: 'Pioneering affordable and durable electric bikes designed for Filipino urban commuters.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jonson E-Bikes',
    description: 'Trusted manufacturer of reliable e-bikes built for the diverse roads and terrain of the Philippines.',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kuromake E-Bikes',
    description: 'Crafting high-performance electric bikes with a bold aesthetic for the modern Filipino rider.',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Redstar E-Bikes',
    description: 'Delivering powerful and stylish e-bikes that redefine urban mobility across Metro Manila.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Nwow E-Bikes',
    description: 'Innovative electric bikes engineered for the next wave of sustainable transportation in the Philippines.',
    image: 'https://images.unsplash.com/photo-1571007387322-73a4e70e6d0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Krinco E-Bikes',
    description: 'Specializing in versatile e-bikes and e-trikes built to handle the demands of Philippine roads.',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PartnersPage() {
  return (
    <>
      <SiteHeader />

      <DottedSurface />

      <main className="flex-1 relative">

        {/* ── E-Bike Brand Partners ── */}
        <section className="pt-10 pb-48">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">

            <FadeUp>
              <div className="text-center pt-20 pb-16">
                <span className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-brand-green mb-6">
                  Our Brand Network
                </span>
                <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground leading-none mb-5 max-w-3xl mx-auto">
                  Trusted by the Leading E-Bike Brands
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-base font-light leading-relaxed">
                  Proudly working alongside the industry&apos;s top names in sustainable urban mobility across the Philippines.
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {BRANDS.map((brand, i) => (
                <FadeUp key={brand.name} delay={i * 0.08}>
                  <div className="group bg-card backdrop-blur-md border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-brand-green/40 hover:shadow-[0_8px_40px_rgba(0,196,140,0.15)]" style={{ willChange: 'transform' }}>
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={i === 0}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-foreground font-bold text-base tracking-wide mb-2">
                        {brand.name}
                      </h3>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed">
                        {brand.description}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

          </div>
        </section>

        {/* ── BYD Partnership ── */}
        <BYDPartnership />

      </main>

      <SiteFooter />
    </>
  );
}
