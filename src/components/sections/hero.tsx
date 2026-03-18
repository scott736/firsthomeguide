import { Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LENDCITY } from '@/lib/lendcity';

export default function Hero() {
  return (
    <section className="section-padding relative">
      <div className="relative container">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <div className="flex max-w-3xl flex-1 flex-col items-start gap-5">
            <div className="flex items-center rounded-full border p-1 text-xs">
              <span className="bg-muted rounded-full px-3 py-1">
                Powered by {LENDCITY.name}
              </span>
              <span className="px-3">Updated for 2026 mortgage rules &amp; FHSA limits</span>
            </div>

            <h1 className="text-5xl leading-none tracking-tight text-balance md:text-6xl lg:text-7xl">
              Your complete guide to buying your first home in{' '}
              <span className="text-gradient">Canada</span>
            </h1>

            <p className="text-muted-foreground leading-snug md:text-lg lg:text-xl">
              The free, step-by-step resource that 85% of first-time buyers wish
              existed. From FHSA savings strategies to closing costs by
              province — everything you need, in plain language.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <div className="flex gap-4.5">
              <Button className="flex-1 md:min-w-45" asChild>
                <a href="/guide/welcome/">Start the Free Guide</a>
              </Button>
              <Button className="flex-1 md:min-w-45" variant="outline" asChild>
                <a href="/tools/province-selector">Browse by Province</a>
              </Button>
            </div>
            <a
              href={LENDCITY.bookingUrl}
              className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              Book a Free Call
            </a>
            <div className="text-center text-sm">
              Free education · Expert guidance when you're ready · Updated for 2026
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <img
          src="/images/home/hero.webp"
          alt="FirstHomeGuide.ca — Canada's complete first-time home buyer guide showing mortgage calculator and step-by-step modules"
          fetchpriority="high"
          loading="eager"
          className="ring-foreground/5 mt-10 w-full rounded-xs shadow-2xl ring-6 invert md:mt-20 md:rounded-sm md:px-[1px] md:ring-16 lg:mt-30 dark:invert-0"
          width={1440}
          height={905}
        />
      </div>
    </section>
  );
}