'use client';

import { Phone } from 'lucide-react';

import { LENDCITY } from '@/lib/lendcity';

export function FloatingCta() {
  return (
    <a
      href={LENDCITY.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book a free call with LendCity"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 delay-1000 p-3.5 md:px-5 md:py-3"
    >
      <Phone className="size-5" />
      <span className="hidden md:inline text-sm font-medium">
        Book a Free Call
      </span>
    </a>
  );
}
