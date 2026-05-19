'use client';

import { ChevronDown } from 'lucide-react';
import { FadeUp } from '@/components/animations/FadeUp';

const FAQS = [
  {
    q: 'What happens if I exceed my monthly swap limit?',
    a: 'You keep swapping — we bill the overage on your next invoice. Starter is ₱8 per extra swap, Pro is ₱5 per extra swap. Enterprise plans include unlimited swaps.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrade or downgrade anytime from your dashboard. Upgrades prorate immediately; downgrades take effect on your next billing cycle.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No setup fee on any plan. Your first month starts when your first station is activated.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'GCash, Maya, and all major Philippine credit and debit cards. Enterprise customers can be invoiced monthly with bank transfer or PDC.',
  },
  {
    q: "What's included in the Free Diagnostic Check?",
    a: 'Every free diagnostic runs cycle count, capacity retention, internal resistance, cell balance, and temperature history. You get a shareable PDF report every time.',
  },
  {
    q: 'How does Enterprise white-label work?',
    a: 'We deploy the platform under your brand and custom domain, with your logo, colors, and copy. You still get full access to the swap network, diagnostics, and legit-check APIs.',
  },
];

export function PricingFAQ() {
  return (
    <section className="relative z-10 py-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-4">
              Frequently Asked
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Everything you need to know before you pick a plan.
            </p>
          </div>
        </FadeUp>

        <div className="space-y-3">
          {FAQS.map((item, idx) => (
            <FadeUp key={idx} delay={idx * 0.05}>
              <details className="group rounded-2xl border border-border bg-card overflow-hidden">
                <summary className="list-none flex items-center justify-between gap-4 cursor-pointer px-6 py-5 hover:bg-card transition-colors">
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {item.q}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 group-open:rotate-180"
                    strokeWidth={2}
                  />
                </summary>
                <div className="px-6 pb-5 -mt-1">
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </details>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
