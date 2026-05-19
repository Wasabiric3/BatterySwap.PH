'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  colorR: number;
  colorG: number;
  colorB: number;
  isGlowing: boolean;
  currentSize: number;
  currentAlpha: number;
  pulseOffset: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef<Dot[][]>([]);

  const initDots = useCallback((w: number, h: number) => {
    const spacing = 45; // Spacing between dots in the grid
    const dots2D: Dot[][] = [];

    const cols = Math.ceil(w / spacing);
    const rows = Math.ceil(h / spacing);

    // Center the grid
    const offsetX = (w - (cols * spacing)) / 2 + spacing / 2;
    const offsetY = (h - (rows * spacing)) / 2 + spacing / 2;

    for (let i = 0; i <= cols; i++) {
      const col: Dot[] = [];
      for (let j = 0; j <= rows; j++) {
        const x = i * spacing + offsetX;
        const y = j * spacing + offsetY;

        col.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: 1.2, // Small base size
          alpha: 0.15, // Low base opacity for the minimal grid look
          colorR: 255,
          colorG: 255,
          colorB: 255,
          isGlowing: false,
          currentSize: 1.2,
          currentAlpha: 0.15,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
      dots2D.push(col);
    }
    dotsRef.current = dots2D;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initDots(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      
      const interactionRadius = 150; // Radius of mouse interaction

      // Phase 1: Update dot positions and calculate colors
      const time = Date.now() * 0.002;
      for (let i = 0; i < dotsRef.current.length; i++) {
        for (let j = 0; j < dotsRef.current[i].length; j++) {
          const dot = dotsRef.current[i][j];

          let targetX = dot.baseX;
          let targetY = dot.baseY;

          dot.colorR = 255;
          dot.colorG = 255;
          dot.colorB = 255;
          dot.isGlowing = false;
          const pulse = Math.sin(time + dot.pulseOffset);
          
          // Subtle breathing: adjust size by +/- 0.3 and alpha by +/- 0.05
          dot.currentSize = dot.size + pulse * 0.3;
          dot.currentAlpha = dot.alpha + pulse * 0.05;

          // Random twinkle/shimmer effect
          if (Math.random() > 0.998) {
            dot.currentAlpha += 0.4;
            dot.currentSize += 1.5;
          }

          if (!prefersReducedMotion && mx !== -9999) {
            const dx = dot.baseX - mx;
            const dy = dot.baseY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < interactionRadius) {
              const force = (interactionRadius - dist) / interactionRadius;
              
              // Interaction overrides and amplifies the pulse
              dot.currentSize = dot.size + force * 3 + Math.abs(pulse) * force * 2;
              dot.currentAlpha = dot.alpha + force * 0.8;
              
              const pushFactor = force * 15;
              targetX = dot.baseX + (dx / dist) * pushFactor;
              targetY = dot.baseY + (dy / dist) * pushFactor;
              
              dot.isGlowing = true;
              
              // Gradient from brand-green (#00C48C) to brand-volt (#F5C400)
              const ratio = dot.baseX / w; 
              dot.colorR = Math.round(0 * (1 - ratio) + 245 * ratio);
              dot.colorG = 196;
              dot.colorB = Math.round(140 * (1 - ratio) + 0 * ratio);
            }
          }

          dot.x += (targetX - dot.x) * 0.15;
          dot.y += (targetY - dot.y) * 0.15;
        }
      }

      // Phase 2: Draw lines
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      for (let i = 0; i < dotsRef.current.length; i++) {
        for (let j = 0; j < dotsRef.current[i].length; j++) {
           const dot = dotsRef.current[i][j];
           
           if (i < dotsRef.current.length - 1) {
              const rightDot = dotsRef.current[i+1][j];
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(rightDot.x, rightDot.y);
              
              if (dot.isGlowing || rightDot.isGlowing) {
                const alpha = Math.max(dot.currentAlpha || 0, rightDot.currentAlpha || 0) * 0.5;
                const r = dot.isGlowing ? dot.colorR : rightDot.colorR;
                const g = dot.isGlowing ? dot.colorG : rightDot.colorG;
                const b = dot.isGlowing ? dot.colorB : rightDot.colorB;
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              } else {
                ctx.strokeStyle = `rgba(255, 255, 255, 0.04)`; // Extremely faint lines
              }
              ctx.stroke();
           }
           
           if (j < dotsRef.current[i].length - 1) {
              const bottomDot = dotsRef.current[i][j+1];
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(bottomDot.x, bottomDot.y);
              
              if (dot.isGlowing || bottomDot.isGlowing) {
                const alpha = Math.max(dot.currentAlpha || 0, bottomDot.currentAlpha || 0) * 0.5;
                const r = dot.isGlowing ? dot.colorR : bottomDot.colorR;
                const g = dot.isGlowing ? dot.colorG : bottomDot.colorG;
                const b = dot.isGlowing ? dot.colorB : bottomDot.colorB;
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              } else {
                ctx.strokeStyle = `rgba(255, 255, 255, 0.04)`;
              }
              ctx.stroke();
           }
        }
      }

      // Phase 3: Draw dots — non-glowing first (no shadow), then glowing (with shadow)
      // Batching by shadow state avoids expensive per-dot context switches.
      ctx.shadowBlur = 0;
      for (let i = 0; i < dotsRef.current.length; i++) {
        for (let j = 0; j < dotsRef.current[i].length; j++) {
          const dot = dotsRef.current[i][j];
          if (dot.isGlowing) continue;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.currentSize || dot.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${dot.currentAlpha})`;
          ctx.fill();
        }
      }
      for (let i = 0; i < dotsRef.current.length; i++) {
        for (let j = 0; j < dotsRef.current[i].length; j++) {
          const dot = dotsRef.current[i][j];
          if (!dot.isGlowing) continue;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(${dot.colorR},${dot.colorG},${dot.colorB},0.8)`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.currentSize || dot.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dot.colorR},${dot.colorG},${dot.colorB},${dot.currentAlpha})`;
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initDots]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
}
