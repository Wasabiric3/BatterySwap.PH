'use client';

import { useEffect, useRef, useState } from 'react';

export function ScrollBackgroundLayers() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);
  const activeSectionRef = useRef('hero');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeId = activeSectionRef.current;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeId = entry.target.id;
          }
        });

        if (maxRatio > 0 && activeId !== activeSectionRef.current) {
          activeSectionRef.current = activeId;
          setActiveSection(activeId);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    const sections = document.querySelectorAll('section[id], footer[id]');
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  // Parallax offset: background moves slightly with scroll to create depth
  const parallaxOffset = scrollY * 0.3;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
      <div 
        style={{ 
          transform: `translateY(${parallaxOffset}px)`, 
          willChange: 'transform' 
        }}
        className="absolute inset-0 w-full h-[150vh] -top-[25vh]"
      >
        {/* Layer 1: Hero */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out hero-aurora"
          style={{ opacity: activeSection === 'hero' ? 1 : 0 }}
        >
          {/* Radial glow pulse behind headline */}
          <div className="hero-glow-pulse" aria-hidden="true"></div>
        </div>
        
        {/* Layer 2: How It Works */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 'how-it-works' ? 1 : 0,
            background: 'linear-gradient(to bottom, #0A1A12, #0D2018, #111A14)',
          }}
        >
          {/* Subtle green electric glow top edge */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[rgba(0,196,140,0.08)] to-transparent" />
        </div>

        {/* Layer 3: Features */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 'features' ? 1 : 0,
            background: 'linear-gradient(to bottom, #0F0F0F, #111111, #1A1A0D)',
          }}
        >
          {/* Faint yellow radial glow bottom center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_bottom,rgba(245,196,0,0.03)_0%,transparent_70%)]" />
        </div>

        {/* Layer 4: Stations */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 'stations' ? 1 : 0,
            background: 'linear-gradient(to bottom, #0D0F1A, #0D1117, #111828)',
          }}
        >
          {/* Faint city grid lines pattern */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Layer 5: Footer */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-background"
          style={{ opacity: activeSection === 'footer' ? 1 : 0 }}
        >
          {/* Green horizontal line glow at top */}
          <div className="absolute top-[25vh] left-0 right-0 h-[1px] bg-[#00C48C] opacity-20 shadow-[0_0_20px_2px_#00C48C]" />
        </div>
      </div>
    </div>
  );
}
