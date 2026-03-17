'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Award, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// All 47 module pages (excludes welcome, FAQ, glossary, module landing pages)
// ---------------------------------------------------------------------------

const MODULE_PAGES: string[] = [
  // Module 1: Are You Ready? (5 pages)
  '/guide/1-are-you-ready/1-first-time-buyer/',
  '/guide/1-are-you-ready/2-rent-vs-buy/',
  '/guide/1-are-you-ready/3-credit-score/',
  '/guide/1-are-you-ready/4-stress-test/',
  '/guide/1-are-you-ready/5-financial-checklist/',
  // Module 2: Saving Smart (6 pages)
  '/guide/2-saving-smart/1-fhsa/',
  '/guide/2-saving-smart/2-rrsp-hbp/',
  '/guide/2-saving-smart/3-combined-strategy/',
  '/guide/2-saving-smart/4-tfsa/',
  '/guide/2-saving-smart/5-saving-timelines/',
  '/guide/2-saving-smart/6-common-mistakes/',
  // Module 3: Down Payments & Mortgages (7 pages)
  '/guide/3-down-payments-mortgages/1-down-payment-rules/',
  '/guide/3-down-payments-mortgages/2-cmhc-insurance/',
  '/guide/3-down-payments-mortgages/3-fixed-vs-variable/',
  '/guide/3-down-payments-mortgages/4-amortization/',
  '/guide/3-down-payments-mortgages/5-pre-approval/',
  '/guide/3-down-payments-mortgages/6-gds-tds-ratios/',
  '/guide/3-down-payments-mortgages/7-choosing-provider/',
  // Module 4: Government Programs (7 pages)
  '/guide/4-government-programs/1-federal-programs/',
  '/guide/4-government-programs/2-ontario/',
  '/guide/4-government-programs/3-british-columbia/',
  '/guide/4-government-programs/4-alberta-prairies/',
  '/guide/4-government-programs/5-quebec/',
  '/guide/4-government-programs/6-atlantic-canada/',
  '/guide/4-government-programs/7-program-comparison/',
  // Module 5: Finding a Home (6 pages)
  '/guide/5-finding-a-home/1-working-with-realtor/',
  '/guide/5-finding-a-home/2-reading-mls-listings/',
  '/guide/5-finding-a-home/3-condo-vs-freehold/',
  '/guide/5-finding-a-home/4-showings-guide/',
  '/guide/5-finding-a-home/5-school-catchment/',
  '/guide/5-finding-a-home/6-red-flags/',
  // Module 6: Making an Offer (6 pages)
  '/guide/6-making-an-offer/1-purchase-agreement/',
  '/guide/6-making-an-offer/2-conditions/',
  '/guide/6-making-an-offer/3-bidding-wars/',
  '/guide/6-making-an-offer/4-home-inspection/',
  '/guide/6-making-an-offer/5-deposits/',
  '/guide/6-making-an-offer/6-offer-mistakes/',
  // Module 7: Closing the Deal (7 pages)
  '/guide/7-closing-the-deal/1-closing-costs-overview/',
  '/guide/7-closing-the-deal/2-cost-breakdown/',
  '/guide/7-closing-the-deal/3-land-transfer-tax/',
  '/guide/7-closing-the-deal/4-real-estate-lawyer/',
  '/guide/7-closing-the-deal/5-title-insurance/',
  '/guide/7-closing-the-deal/6-closing-day/',
  '/guide/7-closing-the-deal/7-closing-example/',
  // Module 8: Life After Closing (8 pages)
  '/guide/8-life-after-closing/1-emergency-fund/',
  '/guide/8-life-after-closing/2-property-taxes/',
  '/guide/8-life-after-closing/3-home-insurance/',
  '/guide/8-life-after-closing/4-mortgage-renewal/',
  '/guide/8-life-after-closing/5-home-maintenance/',
  '/guide/8-life-after-closing/6-energy-efficiency/',
  '/guide/8-life-after-closing/7-building-equity/',
  '/guide/8-life-after-closing/8-congratulations/',
];

const TOTAL_MODULE_PAGES = MODULE_PAGES.length;
const STORAGE_KEY = 'fhg-guide-progress';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVisitedPages(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CompletionCertificate() {
  const [mounted, setMounted] = useState(false);
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());

  useEffect(() => {
    setVisitedPages(getVisitedPages());
    setMounted(true);
  }, []);

  const completedModulePages = useMemo(
    () => MODULE_PAGES.filter((p) => visitedPages.has(p)).length,
    [visitedPages],
  );

  const isComplete = completedModulePages >= TOTAL_MODULE_PAGES;
  const progressPercent = Math.round(
    (completedModulePages / TOTAL_MODULE_PAGES) * 100,
  );

  const supportsShare =
    typeof navigator !== 'undefined' && !!navigator.share;

  const shareText =
    "I just completed all 8 modules of the FirstHomeGuide.ca Home Buyer Education Program! 47 topics covering everything from saving strategies to closing day across all 10 provinces.";

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'FirstHomeGuide.ca - Certificate of Completion',
      text: shareText,
      url: 'https://firsthomeguide.ca/guide/welcome/',
    };

    if (supportsShare) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          toast.error('Sharing failed');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`,
        );
        toast.success('Achievement copied to clipboard');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    }
  }, [supportsShare]);

  const handleDownload = useCallback(() => {
    window.print();
  }, []);

  if (!mounted) return null;

  // -------------------------------------------------------------------------
  // Progress card (not yet complete)
  // -------------------------------------------------------------------------

  if (!isComplete) {
    return (
      <div className="not-content my-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Award className="size-5 text-muted-foreground" />
              </span>
              <div>
                <CardTitle className="text-base">
                  Complete all 8 modules to earn your certificate
                </CardTitle>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {completedModulePages} of {TOTAL_MODULE_PAGES} topics completed
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall progress</span>
                <span className="font-medium tabular-nums">
                  {progressPercent}%
                </span>
              </div>
              <div
                className="bg-muted h-2.5 w-full overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Guide progress: ${completedModulePages} of ${TOTAL_MODULE_PAGES} topics completed`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Certificate (complete)
  // -------------------------------------------------------------------------

  const completionDate = formatDate(new Date());

  return (
    <>
      {/* Print-specific styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              /* Hide everything except the certificate */
              body > *:not(#completion-certificate-wrapper),
              header, footer, nav, aside,
              [data-slot="sidebar"],
              [data-slot="header"],
              .site-title,
              .sidebar,
              .right-sidebar,
              .pagination-links,
              .mobile-menu-toggle {
                display: none !important;
              }

              #completion-certificate-wrapper {
                position: fixed;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                padding: 2rem;
              }

              #completion-certificate {
                border: 3px solid #7c3aed !important;
                border-radius: 12px !important;
                padding: 3rem 2.5rem !important;
                max-width: 700px;
                width: 100%;
                box-shadow: none !important;
                background: white !important;
                color: #1a1a1a !important;
              }

              #completion-certificate * {
                color: #1a1a1a !important;
              }

              .certificate-gradient-text {
                background: linear-gradient(135deg, #7c3aed, #a855f7, #ec4899) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
              }

              .certificate-actions {
                display: none !important;
              }

              .certificate-decorative-border {
                border-color: #7c3aed !important;
                opacity: 1 !important;
              }

              @page {
                size: landscape;
                margin: 0.5in;
              }
            }
          `,
        }}
      />

      <div id="completion-certificate-wrapper" className="not-content my-8">
        {/* Decorative gradient border wrapper */}
        <div
          className={cn(
            'rounded-xl p-[3px]',
            'bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3',
          )}
        >
          <Card
            id="completion-certificate"
            className="rounded-[9px] border-0 bg-card"
          >
            <CardHeader className="items-center pb-0 text-center">
              {/* Logo */}
              <p className="text-muted-foreground mb-2 text-sm font-medium tracking-wider uppercase">
                FirstHomeGuide.ca
              </p>

              {/* Trophy icon */}
              <span
                className={cn(
                  'flex size-16 items-center justify-center rounded-full',
                  'bg-gradient-to-br from-chart-1/15 via-chart-2/15 to-chart-3/15',
                )}
              >
                <Award className="size-8 text-chart-1" />
              </span>

              {/* Title */}
              <CardTitle className="mt-4 text-2xl sm:text-3xl">
                <span className="text-gradient certificate-gradient-text">
                  Certificate of Completion
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 pt-2 text-center">
              <div className="mx-auto max-w-md space-y-3">
                <p className="text-foreground leading-relaxed">
                  This certifies that you have completed all 8 modules of the{' '}
                  <span className="font-semibold">
                    FirstHomeGuide.ca Home Buyer Education Program
                  </span>
                </p>

                <p className="text-muted-foreground text-sm">
                  47 topics covered across all 10 provinces
                </p>
              </div>

              {/* Decorative divider */}
              <div className="mx-auto flex w-full max-w-xs items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <span className="text-muted-foreground text-xs">
                  {completionDate}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
            </CardContent>

            <CardFooter className="certificate-actions flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={handleShare} className="gap-2">
                <Share2 className="size-4" />
                Share Your Achievement
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="size-4" />
                Download Certificate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
