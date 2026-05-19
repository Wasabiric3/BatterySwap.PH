'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, Zap } from 'lucide-react';

interface ComingSoonContextValue {
  open: (label?: string) => void;
  close: () => void;
}

const ComingSoonContext = createContext<ComingSoonContextValue | null>(null);

export function useComingSoon() {
  const ctx = useContext(ComingSoonContext);
  if (!ctx) throw new Error('useComingSoon must be used inside <ComingSoonProvider>');
  return ctx;
}

export function ComingSoonProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState<string>('This feature');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const open = useCallback((nextLabel?: string) => {
    setLabel(nextLabel ?? 'This feature');
    setSubmitted(false);
    setEmail('');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <ComingSoonContext.Provider value={{ open, close }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${label} coming soon`}
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={close}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {!submitted ? (
                <>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-volt/30 bg-brand-volt/10 px-3 py-1">
                    <Zap className="h-3 w-3 text-brand-volt" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-volt">
                      Coming Soon
                    </span>
                  </div>

                  <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-3">
                    {label}
                  </h2>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-7">
                    We&apos;re still building this. Drop your email and we&apos;ll let you know the
                    moment it&apos;s ready.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      autoFocus
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-full border border-border bg-card px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:bg-card focus:outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-background hover:bg-brand-green/90 transition-colors"
                    >
                      Notify Me
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/15 border border-brand-green/30">
                    <Check className="h-6 w-6 text-brand-green" strokeWidth={2.5} />
                  </div>
                  <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-3">
                    You&apos;re on the list
                  </h2>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-7">
                    We&apos;ll email <span className="text-foreground">{email}</span> as soon as{' '}
                    {label.toLowerCase()} launches.
                  </p>
                  <button
                    onClick={close}
                    className="rounded-full border border-border px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:bg-card transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ComingSoonContext.Provider>
  );
}
