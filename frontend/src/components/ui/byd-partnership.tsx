'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';
import { useComingSoon } from '@/components/ui/coming-soon-modal';

const BYD_MODELS = [
  {
    name: 'BYD Han EV',
    range: '521 km',
    power: '380 kW',
    tag: 'Flagship Sedan',
    colorFrom: '#0d1f3c',
    colorMid: '#0a1220',
    accentColor: '#4F8EF7',
    slideDir: -1,
  },
  {
    name: 'BYD Seal',
    range: '570 km',
    power: '390 kW',
    tag: 'Sports Sedan',
    colorFrom: '#1a0a2e',
    colorMid: '#100a1a',
    accentColor: '#A855F7',
    slideDir: 0,
  },
  {
    name: 'BYD Atto 3',
    range: '420 km',
    power: '150 kW',
    tag: 'Compact SUV',
    colorFrom: '#0a2a1e',
    colorMid: '#08120e',
    accentColor: '#00C48C',
    slideDir: 1,
  },
];

/* ── Inline SVG car silhouette (generic side-profile) ── */
function CarSilhouette({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 280 80"
      className="w-full max-w-[220px] opacity-40 group-hover:opacity-70 transition-opacity duration-500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 54 C10 54 25 54 40 54 L55 54 C60 54 62 50 70 38 C78 26 95 22 130 22 C165 22 188 26 200 38 C208 46 214 54 220 54 L240 54 C250 54 260 50 265 46 L270 44 L270 54 L10 54 Z"
        fill={color}
        opacity="0.6"
      />
      <ellipse cx="68" cy="54" rx="16" ry="10" fill={color} opacity="0.9" />
      <ellipse cx="68" cy="54" rx="8" ry="5" fill="hsl(var(--background))" />
      <ellipse cx="202" cy="54" rx="16" ry="10" fill={color} opacity="0.9" />
      <ellipse cx="202" cy="54" rx="8" ry="5" fill="#080808" />
      {/* Windshield */}
      <path
        d="M90 38 C95 28 110 24 130 24 C148 24 162 28 168 38"
        stroke={color}
        strokeWidth="2"
        opacity="0.5"
      />
      {/* Headlight */}
      <rect x="258" y="44" width="10" height="4" rx="2" fill={color} opacity="0.9" />
      {/* Taillight */}
      <rect x="14" y="44" width="10" height="4" rx="2" fill={color} opacity="0.6" />
    </svg>
  );
}

interface BYDPartnershipProps {
  /** When true the section sits at the top of the page; scroll offset is adjusted accordingly */
  heroMode?: boolean;
}

export function BYDPartnership({ heroMode = false }: BYDPartnershipProps) {
  const { open } = useComingSoon();
  const [revealed, setRevealed] = useState(false);

  return (
    <section
      id="byd-partnership"
      className={`relative overflow-hidden ${heroMode ? 'pt-28 pb-32' : 'py-32 border-t border-border'}`}
    >
      {/* Ambient background glow — fades in on reveal */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(ellipse, rgba(0,196,140,0.07) 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] left-[20%] w-[500px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(ellipse, rgba(79,142,247,0.05) 0%, transparent 70%)' }} />
      </motion.div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        {/* ── Coming soon badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-14"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-green/80">
              Partnership Announcement — Coming Soon
            </span>
          </div>
        </motion.div>

        {/* ── BYD Logo Reveal ── */}
        <div className="relative flex justify-center items-center mb-10 select-none">
          {/* BYD text — fires on viewport entry */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 1.12, filter: 'blur(28px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            onViewportEnter={() => setRevealed(true)}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow layer behind text */}
            <div
              className="absolute inset-0 blur-[60px] rounded-full pointer-events-none"
              style={{ background: 'rgba(0,196,140,0.18)', transform: 'scaleX(1.4) scaleY(0.6)' }}
            />

            {/* Main BYD text */}
            <h1
              className="font-display leading-none tracking-tighter text-foreground relative z-10"
              style={{ fontSize: 'clamp(7rem, 22vw, 18rem)' }}
            >
              BYD
            </h1>

            {/* One-shot spotlight sweep on reveal */}
            {revealed && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden>
                <motion.div
                  className="absolute inset-y-0 w-28"
                  initial={{ x: '-120%' }}
                  animate={{ x: '320%' }}
                  transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" />
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Overlay that lifts away on reveal */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: revealed ? 0 : 1 }}
            transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
            style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.96) 100%)' }}
          />
        </div>

        {/* ── Headline & description ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-5"
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl uppercase tracking-tight text-foreground">
            Partnering With{' '}
            <span className="text-brand-green">BYD</span>{' '}
            Electric Vehicles
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-muted-foreground text-base max-w-xl mx-auto mb-12 font-light leading-relaxed"
        >
          We&apos;re thrilled to announce our upcoming partnership with BYD — one of the world&apos;s leading
          electric vehicle manufacturers. A new era of e-mobility is coming to the Philippines.
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="flex justify-center mb-24"
        >
          <button
            onClick={() => open('BYD Partnership')}
            className="px-8 py-4 rounded-full bg-brand-green text-background font-bold text-sm tracking-wide uppercase hover:bg-brand-green/90 active:scale-95 transition-all duration-300"
          >
            Notify Me
          </button>
        </motion.div>

        {/* ── BYD Documentation Block ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 border border-border rounded-2xl overflow-hidden"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/30">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green">
              — Partnership Brief · Confidential Draft
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">REF: BSW-BYD-2025-001</span>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
            {[
              { label: 'Founded', value: '1995', sub: 'Shenzhen, China' },
              { label: 'Global EV Rank', value: '#1', sub: 'Worldwide 2023' },
              { label: '2023 Sales', value: '1.57M', sub: 'Units delivered' },
              { label: 'Markets', value: '70+', sub: 'Countries served' },
            ].map((s) => (
              <div key={s.label} className="px-6 py-5 bg-card/20">
                <div className="font-display text-2xl text-foreground tracking-tight">{s.value}</div>
                <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-brand-green mt-1">{s.label}</div>
                <div className="text-[10px] text-muted-foreground font-light mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Body text */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="px-6 py-6 bg-card/10">
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                BYD Co., Ltd. — <span className="text-foreground font-medium">&ldquo;Build Your Dreams&rdquo;</span> — is the
                world&apos;s largest electric vehicle manufacturer and a global leader in rechargeable battery
                technology. With over 30 years of R&D, BYD&apos;s proprietary{' '}
                <span className="text-brand-green">Blade Battery</span> technology delivers industry-leading
                safety, longevity, and energy density — making it the ideal partner for BatterySwap PH&apos;s
                next-generation swap infrastructure.
              </p>
            </div>
            <div className="px-6 py-6 bg-card/10">
              <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">Key Technologies</div>
              <div className="space-y-2">
                {[
                  { tech: 'Blade Battery (LFP)', note: 'Zero thermal runaway risk' },
                  { tech: 'e-Platform 3.0', note: '1000V high-voltage architecture' },
                  { tech: 'iTAC System', note: 'Intelligent Torque Adaptation' },
                  { tech: 'DiLink 4.0', note: 'Rotating ADAS infotainment' },
                ].map((t) => (
                  <div key={t.tech} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-foreground font-medium">{t.tech}</span>
                    <span className="text-[10px] text-muted-foreground font-light text-right">{t.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section label before cars ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">Compatible Models</span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* ── BYD EV Model Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BYD_MODELS.map((model, idx) => {
            const xInitial = model.slideDir < 0 ? -70 : model.slideDir > 0 ? 70 : 0;
            const yInitial = model.slideDir === 0 ? 50 : 0;

            return (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, x: xInitial, y: yInitial }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 1,
                  delay: idx * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
              >
                <div
                  className="group relative rounded-2xl overflow-hidden border border-border hover:border-border transition-colors duration-500 cursor-pointer"
                  style={{
                    background: `linear-gradient(145deg, ${model.colorFrom}, ${model.colorMid}, hsl(var(--background)))`,
                  }}
                >
                  {/* Visual area */}
                  <div className="relative h-52 flex flex-col items-center justify-center overflow-hidden px-6 pt-6">
                    {/* Floor glow */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 rounded-full blur-[35px] opacity-35 group-hover:opacity-60 transition-opacity duration-500"
                      style={{ background: model.accentColor }}
                    />
                    {/* Ceiling ambient */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                      style={{ background: model.accentColor }}
                    />

                    {/* Car silhouette */}
                    <CarSilhouette color={model.accentColor} />

                    {/* Tag pill */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <span
                        className="text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border whitespace-nowrap"
                        style={{
                          borderColor: `${model.accentColor}40`,
                          color: model.accentColor,
                          background: `${model.accentColor}12`,
                        }}
                      >
                        {model.tag}
                      </span>
                    </div>
                  </div>

                  {/* Info area */}
                  <div className="p-6 border-t border-border">
                    <div className="flex items-start justify-between mb-5">
                      <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
                        {model.name}
                      </h3>
                      <ChevronRight
                        className="h-4 w-4 mt-0.5 transition-all duration-300 group-hover:translate-x-1"
                        style={{ color: model.accentColor, opacity: 0.7 }}
                        strokeWidth={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                          Range
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-2xl tracking-tight text-foreground">
                            {model.range.replace(' km', '')}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-light">km</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                          Power
                        </div>
                        <div className="flex items-baseline gap-1">
                          <Zap className="h-3.5 w-3.5 mt-1" style={{ color: model.accentColor }} strokeWidth={2} />
                          <span className="font-display text-2xl tracking-tight text-foreground">
                            {model.power.replace(' kW', '')}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-light">kW</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
