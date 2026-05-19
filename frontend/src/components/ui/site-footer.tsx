'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { useComingSoon } from '@/components/ui/coming-soon-modal';

type FooterLink = { label: string; href?: string; modal?: string };

const FOOTER_LINKS: FooterLink[] = [
  { label: 'Find a Station', href: '/#stations' },
  { label: 'Book a Swap', modal: 'Booking' },
  { label: 'Diagnostics', href: '/#diagnostics' },
  { label: 'Legit Check', href: '/#legit-check' },
  { label: 'Pricing Plans', href: '/pricing' },
  { label: 'Fleet Solutions', modal: 'Fleet Solutions' },
];

export function SiteFooter() {
  const { open } = useComingSoon();

  return (
    <footer id="footer" className="relative z-10 border-t border-border py-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-foreground fill-foreground" />
            <span className="text-sm font-bold tracking-tight text-foreground uppercase">
              BatterySwap <span className="text-muted-foreground">PH</span>
            </span>
          </Link>

          <nav className="flex items-center gap-8 flex-wrap justify-center">
            {FOOTER_LINKS.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => open(item.modal)}
                  className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <p className="text-muted-foreground text-[10px] tracking-wide">
            &copy; {new Date().getFullYear()} BatterySwap PH
          </p>
        </div>
      </div>
    </footer>
  );
}
