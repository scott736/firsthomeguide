'use client';

import { useEffect, useState } from 'react';

import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

const STORAGE_KEY = 'fhg-guide-progress';
const DISMISS_KEY = 'fhg-welcome-banner-dismissed';

const ALL_GUIDE_PAGES = [
  '/guide/welcome/',
  '/guide/1-are-you-ready/1-first-time-buyer/',
  '/guide/1-are-you-ready/2-rent-vs-buy/',
  '/guide/1-are-you-ready/3-credit-score/',
  '/guide/1-are-you-ready/4-stress-test/',
  '/guide/1-are-you-ready/5-financial-checklist/',
  '/guide/1-are-you-ready/6-co-buying/',
  '/guide/2-saving-smart/1-fhsa/',
  '/guide/2-saving-smart/2-rrsp-hbp/',
  '/guide/2-saving-smart/3-combined-strategy/',
  '/guide/2-saving-smart/4-tfsa/',
  '/guide/2-saving-smart/5-saving-timelines/',
  '/guide/2-saving-smart/6-common-mistakes/',
  '/guide/3-down-payments-mortgages/1-down-payment-rules/',
  '/guide/3-down-payments-mortgages/2-cmhc-insurance/',
  '/guide/3-down-payments-mortgages/3-fixed-vs-variable/',
  '/guide/3-down-payments-mortgages/4-amortization/',
  '/guide/3-down-payments-mortgages/5-pre-approval/',
  '/guide/3-down-payments-mortgages/6-gds-tds-ratios/',
  '/guide/3-down-payments-mortgages/7-choosing-provider/',
  '/guide/3-down-payments-mortgages/8-self-employed/',
  '/guide/4-government-programs/1-federal-programs/',
  '/guide/4-government-programs/2-ontario/',
  '/guide/4-government-programs/3-british-columbia/',
  '/guide/4-government-programs/4-alberta-prairies/',
  '/guide/4-government-programs/5-quebec/',
  '/guide/4-government-programs/6-atlantic-canada/',
  '/guide/4-government-programs/7-program-comparison/',
  '/guide/4-government-programs/8-territories/',
  '/guide/5-finding-a-home/0-your-team/',
  '/guide/5-finding-a-home/1-working-with-realtor/',
  '/guide/5-finding-a-home/2-reading-mls-listings/',
  '/guide/5-finding-a-home/3-condo-vs-freehold/',
  '/guide/5-finding-a-home/4-showings-guide/',
  '/guide/5-finding-a-home/5-school-catchment/',
  '/guide/5-finding-a-home/6-red-flags/',
  '/guide/5-finding-a-home/7-new-construction/',
  '/guide/6-making-an-offer/1-purchase-agreement/',
  '/guide/6-making-an-offer/2-conditions/',
  '/guide/6-making-an-offer/3-bidding-wars/',
  '/guide/6-making-an-offer/4-home-inspection/',
  '/guide/6-making-an-offer/5-deposits/',
  '/guide/6-making-an-offer/6-offer-mistakes/',
  '/guide/7-closing-the-deal/1-closing-costs-overview/',
  '/guide/7-closing-the-deal/2-cost-breakdown/',
  '/guide/7-closing-the-deal/3-land-transfer-tax/',
  '/guide/7-closing-the-deal/4-real-estate-lawyer/',
  '/guide/7-closing-the-deal/5-title-insurance/',
  '/guide/7-closing-the-deal/6-closing-day/',
  '/guide/7-closing-the-deal/7-closing-example/',
  '/guide/8-life-after-closing/1-emergency-fund/',
  '/guide/8-life-after-closing/2-property-taxes/',
  '/guide/8-life-after-closing/3-home-insurance/',
  '/guide/8-life-after-closing/4-mortgage-renewal/',
  '/guide/8-life-after-closing/5-home-maintenance/',
  '/guide/8-life-after-closing/6-energy-efficiency/',
  '/guide/8-life-after-closing/7-building-equity/',
  '/guide/8-life-after-closing/8-congratulations/',
] as const;

const TOTAL_PAGES = ALL_GUIDE_PAGES.length;

function getVisitedPages(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function getNextUnreadPage(visited: Set<string>): string {
  for (const page of ALL_GUIDE_PAGES) {
    if (!visited.has(page)) return page;
  }
  return ALL_GUIDE_PAGES[0];
}

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export default function WelcomeBackBanner() {
  const [visible, setVisible] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);
  const [nextPage, setNextPage] = useState('/guide/welcome/');

  useEffect(() => {
    if (isDismissed()) return;

    const visited = getVisitedPages();
    const visitedSet = new Set(visited);
    const count = ALL_GUIDE_PAGES.filter((p) => visitedSet.has(p)).length;

    if (count < 2) return;

    setPagesRead(count);
    setNextPage(getNextUnreadPage(visitedSet));
    setVisible(true);
  }, []);

  function handleDismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // sessionStorage may be unavailable
    }
  }

  const progressPercent = Math.round((pagesRead / TOTAL_PAGES) * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              'border-b bg-gradient-to-r from-chart-1/10 to-chart-2/10',
              'relative py-3',
            )}
          >
            <div className="container flex items-center justify-between gap-4">
              {/* Desktop */}
              <div className="hidden flex-1 items-center gap-4 sm:flex">
                <p className="text-sm font-medium">
                  Welcome back! You've read{' '}
                  <span className="text-gradient font-bold">
                    {pagesRead} of {TOTAL_PAGES}
                  </span>{' '}
                  pages.
                </p>
                <a
                  href={nextPage}
                  className="text-accent-foreground inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  Continue reading
                  <ArrowRight className="size-3.5" />
                </a>
              </div>

              {/* Mobile */}
              <a
                href={nextPage}
                className="text-accent-foreground flex flex-1 items-center gap-1.5 text-sm font-medium sm:hidden"
              >
                Welcome back! Continue where you left off
                <ArrowRight className="size-3.5 shrink-0" />
              </a>

              {/* Dismiss */}
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground shrink-0 rounded-sm p-1 transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="container mt-2">
              <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
