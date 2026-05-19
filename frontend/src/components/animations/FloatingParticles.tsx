'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 12 : 30;

    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      color: Math.random() > 0.6
        ? 'rgba(0, 196, 140, 0.6)'
        : Math.random() > 0.5
          ? 'rgba(245, 196, 0, 0.4)'
          : 'rgba(255, 255, 255, 0.2)',
    }));

    setParticles(generated);

    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Fade out from 1 to 0 between 0px and 500px scroll
  const opacity = Math.max(0, 1 - scrollY / 500);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity, willChange: 'opacity' }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
