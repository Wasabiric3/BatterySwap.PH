'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { ScrollNavbar } from '@/components/animations/ScrollNavbar';

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Find Station', href: '/stations'    },
  { label: 'Book a Swap',  href: '/booking'     },
  { label: 'Diagnostics',  href: '/diagnostics' },
  { label: 'Legit Check',  href: '/legit-check' },
  { label: 'Pricing',      href: '/pricing'     },
  { label: 'Partners',     href: '/partners'    },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <ScrollNavbar>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="BatterySwap PH – Home" className="flex items-center gap-2.5">
            <Zap className="h-6 w-6 text-foreground fill-foreground" />
            <span className="text-base font-bold tracking-tight text-foreground uppercase">
              BatterySwap <span className="text-muted-foreground">PH</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[11px] font-medium tracking-[0.2em] uppercase hover:text-foreground transition-colors duration-300 ${
                  pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/dashboard"
              className={`text-[11px] font-medium tracking-[0.2em] uppercase hover:text-foreground transition-colors duration-300 ${
                pathname.startsWith('/dashboard') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/auth/register"
              className="text-[11px] font-bold tracking-[0.15em] uppercase bg-foreground text-background px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute inset-x-0 top-16 z-50 bg-background border-b border-border shadow-2xl"
            >
              <nav className="container mx-auto px-6 py-6 flex flex-col gap-1">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className={`text-sm font-medium tracking-wide uppercase py-3 border-b border-border transition-colors ${
                      pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-5">
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="w-full py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-muted transition-colors text-center"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="w-full py-3 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ScrollNavbar>
  );
}
