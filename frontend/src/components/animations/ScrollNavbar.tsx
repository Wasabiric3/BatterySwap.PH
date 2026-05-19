'use client';

import { useEffect, useState } from 'react';

interface ScrollNavbarProps {
  children: React.ReactNode;
}

export function ScrollNavbar({ children }: ScrollNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 navbar-glass ${
        scrolled
          ? 'scrolled bg-brand-dark/95'
          : 'bg-brand-dark/60'
      }`}
    >
      {children}
    </header>
  );
}
