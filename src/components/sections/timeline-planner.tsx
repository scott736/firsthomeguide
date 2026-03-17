'use client';

import { useMemo, useState } from 'react';

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Info,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (n: number) =>
  n.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const fmtFull = (n: number) =>
  n.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIMELINE_OPTIONS = [
  { value: '6', label: '6 months' },
  { value: '12', label: '1 year' },
  { value: '18', label: '18 months' },
  { value: '24', label: '2 years' },
  { value: '36', label: '3 years' },
  { value: '48', label: '4 years' },
  { value: '60', label: '5 years' },
];

const EMPLOYMENT_TYPES = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'contract', label: 'Contract' },
];

const PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland & Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

const FHSA_STATUS_OPTIONS = [
  { value: 'none', label: "Haven't opened one yet" },
  { value: 'this-year', label: 'Opened this year' },
  { value: '1-year', label: 'Opened 1 year ago' },
  { value: '2-plus', label: 'Opened 2+ years ago' },
];

const CREDIT_SCORE_OPTIONS = [
  { value: 'below-600', label: 'Below 600' },
  { value: '600-649', label: '600-649' },
  { value: '650-679', label: '650-679' },
  { value: '680-719', label: '680-719' },
  { value: '720-plus', label: '720+' },
];

const FHSA_ANNUAL_MAX = 8_000;
const FHSA_LIFETIME_MAX = 40_000;
const FHSA_MONTHLY = Math.round(FHSA_ANNUAL_MAX / 12);
const HBP_MAX = 60_000;

type MilestoneCategory =
  | 'Savings'
  | 'Credit'
  | 'Documentation'
  | 'Shopping'
  | 'Closing';

interface Milestone {
  month: number;
  action: string;
  category: MilestoneCategory;
  amount?: string;
  phase: number;
}

interface SavingsDataPoint {
  month: number;
  label: string;
  fhsa: number;
  rrsp: number;
  other: number;
  taxRefund: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Category badge colors
// ---------------------------------------------------------------------------

function categoryColor(category: MilestoneCategory): string {
  switch (category) {
    case 'Savings':
      return 'border-chart-1/30 bg-chart-1/10 text-chart-1';
    case 'Credit':
      return 'border-chart-2/30 bg-chart-2/10 text-chart-2';
    case 'Documentation':
      return 'border-chart-3/30 bg-chart-3/10 text-chart-3';
    case 'Shopping':
      return 'border-chart-4/30 bg-chart-4/10 text-chart-4';
    case 'Closing':
      return 'border-primary/30 bg-primary/10 text-primary';
  }
}

function categoryIcon(category: MilestoneCategory) {
  switch (category) {
    case 'Savings':
      return DollarSign;
    case 'Credit':
      return CreditCard;
    case 'Documentation':
      return FileText;
    case 'Shopping':
      return Search;
    case 'Closing':
      return Home;
  }
}

// ---------------------------------------------------------------------------
// Affordability calculation (matching stress-test approach)
// ---------------------------------------------------------------------------

function calcAffordablePrice(
  annualIncome: number,
  monthlyDebt: number,
  downPayment: number,
): number {
  // Stress test rate: higher of 5.25% or contract + 2%
  const stressRate = 5.25 / 100;
  const semiAnnual = stressRate / 2;
  const effectiveMonthly = Math.pow(1 + semiAnnual, 1 / 6) - 1;
  const n = 25 * 12;

  const monthlyIncome = annualIncome / 12;

  // GDS: 39% of gross income for housing costs
  const maxGdsPayment = monthlyIncome * 0.39;
  // Subtract estimated property tax ($300/mo) and heating ($150/mo)
  const maxMortgagePaymentGds = maxGdsPayment - 300 - 150;

  // TDS: 44% of gross income for all debt
  const maxTdsPayment = monthlyIncome * 0.44;
  const maxMortgagePaymentTds = maxTdsPayment - monthlyDebt - 300 - 150;

  const maxMonthlyPayment = Math.max(
    0,
    Math.min(maxMortgagePaymentGds, maxMortgagePaymentTds),
  );

  // Reverse mortgage payment formula to get max principal
  const maxPrincipal =
    effectiveMonthly === 0
      ? maxMonthlyPayment * n
      : (maxMonthlyPayment * (Math.pow(1 + effectiveMonthly, n) - 1)) /
        (effectiveMonthly * Math.pow(1 + effectiveMonthly, n));

  // Account for CMHC insurance on the mortgage
  // For simplicity, assume 5% down => 4% CMHC premium
  // maxPrincipal = (price - downPayment) * 1.04
  // price = maxPrincipal / 1.04 + downPayment
  const price = maxPrincipal / 1.04 + downPayment;

  return Math.max(0, price);
}

// ---------------------------------------------------------------------------
// Marginal tax rate estimation by province (simplified)
// ---------------------------------------------------------------------------

function estimateMarginalTaxRate(
  annualIncome: number,
  province: string,
): number {
  // Simplified federal + provincial marginal rates for common income brackets
  // This is an approximation for estimating FHSA/RRSP refund value
  let federalRate: number;
  if (annualIncome <= 55_867) federalRate = 0.15;
  else if (annualIncome <= 111_733) federalRate = 0.205;
  else if (annualIncome <= 154_906) federalRate = 0.26;
  else if (annualIncome <= 220_000) federalRate = 0.29;
  else federalRate = 0.33;

  // Provincial rate approximations (middle bracket for most earners)
  const provRates: Record<string, number> = {
    AB: 0.1,
    BC: 0.0706,
    MB: 0.1275,
    NB: 0.094,
    NL: 0.087,
    NS: 0.0879,
    NT: 0.059,
    NU: 0.04,
    ON: 0.0505,
    PE: 0.098,
    QC: 0.15,
    SK: 0.105,
    YT: 0.064,
  };
  const provincialRate = provRates[province] ?? 0.1;

  return federalRate + provincialRate;
}

// ---------------------------------------------------------------------------
// Custom chart tooltip
// ---------------------------------------------------------------------------

interface ChartTooltipPayload {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TimelinePlanner() {
  // Inputs
  const [timelineMonths, setTimelineMonths] = useState('24');
  const [annualIncome, setAnnualIncome] = useState(80_000);
  const [currentSavings, setCurrentSavings] = useState(20_000);
  const [monthlySavings, setMonthlySavings] = useState(1_500);
  const [employmentType, setEmploymentType] = useState('salaried');
  const [withPartner, setWithPartner] = useState(false);
  const [province, setProvince] = useState('ON');
  const [fhsaStatus, setFhsaStatus] = useState('none');
  const [creditScore, setCreditScore] = useState('720-plus');
  const [preApproved, setPreApproved] = useState(false);

  const months = parseInt(timelineMonths, 10);

  // ---------------------------------------------------------------------------
  // Calculations
  // ---------------------------------------------------------------------------
  const plan = useMemo(() => {
    const marginalRate = estimateMarginalTaxRate(annualIncome, province);

    // FHSA calculations
    const fhsaAlreadyOpen = fhsaStatus !== 'none';
    const shouldOpenFhsa = months >= 6; // Only meaningful if 6+ months to contribute

    // Determine existing FHSA contributions based on status
    let existingFhsaBalance = 0;
    let fhsaYearsOpen = 0;
    switch (fhsaStatus) {
      case 'this-year':
        existingFhsaBalance = 0; // just opened, assume minimal contributions
        fhsaYearsOpen = 0;
        break;
      case '1-year':
        existingFhsaBalance = FHSA_ANNUAL_MAX;
        fhsaYearsOpen = 1;
        break;
      case '2-plus':
        existingFhsaBalance = FHSA_ANNUAL_MAX * 2;
        fhsaYearsOpen = 2;
        break;
    }

    // Calculate month-by-month FHSA contributions
    const fhsaRoomRemaining = FHSA_LIFETIME_MAX - existingFhsaBalance;
    // Carry-forward room: if opened but not maxed previous years
    const fhsaContribRoom =
      fhsaStatus === '1-year'
        ? FHSA_ANNUAL_MAX * 2 - existingFhsaBalance
        : fhsaStatus === '2-plus'
          ? FHSA_ANNUAL_MAX * 3 - existingFhsaBalance
          : fhsaAlreadyOpen
            ? FHSA_ANNUAL_MAX
            : shouldOpenFhsa
              ? FHSA_ANNUAL_MAX
              : 0;

    // Monthly FHSA budget (capped at what's available)
    const maxFhsaMonthly = fhsaRoomRemaining > 0 ? FHSA_MONTHLY : 0;

    // Allocate monthly savings across buckets
    const closingCostsFund = Math.round(monthlySavings * 0.1);
    const emergencyFund = Math.round(monthlySavings * 0.1);
    const investableSavings = monthlySavings - closingCostsFund - emergencyFund;

    const fhsaMonthly = Math.min(maxFhsaMonthly, investableSavings);
    const remainingAfterFhsa = investableSavings - fhsaMonthly;

    // RRSP for HBP
    const rrspMonthly = Math.min(
      remainingAfterFhsa,
      Math.round(HBP_MAX / Math.max(months, 1)),
    );
    const otherSavingsMonthly = remainingAfterFhsa - rrspMonthly;

    // Build savings projection
    const savingsData: SavingsDataPoint[] = [];
    let runningFhsa = existingFhsaBalance;
    let runningRrsp = 0;
    let runningOther = currentSavings;
    let runningTaxRefund = 0;
    let totalFhsaContributed = 0;
    let totalRrspContributed = 0;

    // Track annual contributions for tax refund calculation
    let yearlyFhsaContrib = 0;
    let yearlyRrspContrib = 0;

    for (let m = 0; m <= months; m++) {
      if (m > 0) {
        // FHSA contribution (respect annual and lifetime caps)
        const fhsaThisMonth =
          runningFhsa < FHSA_LIFETIME_MAX && yearlyFhsaContrib < FHSA_ANNUAL_MAX
            ? Math.min(
                fhsaMonthly,
                FHSA_LIFETIME_MAX - runningFhsa,
                FHSA_ANNUAL_MAX - yearlyFhsaContrib,
              )
            : 0;
        runningFhsa += fhsaThisMonth;
        yearlyFhsaContrib += fhsaThisMonth;
        totalFhsaContributed += fhsaThisMonth;

        // RRSP contribution (cap at HBP max)
        const rrspThisMonth =
          runningRrsp < HBP_MAX
            ? Math.min(rrspMonthly, HBP_MAX - runningRrsp)
            : 0;
        runningRrsp += rrspThisMonth;
        yearlyRrspContrib += rrspThisMonth;
        totalRrspContributed += rrspThisMonth;

        // Other savings
        runningOther += otherSavingsMonthly + closingCostsFund + emergencyFund;

        // Tax refunds every April (month 4, 16, 28, 40, 52)
        // Simplified: assume filing gets refund for previous year's contributions
        if (m % 12 === 4 && m > 4) {
          const refund =
            (yearlyFhsaContrib + yearlyRrspContrib) * marginalRate;
          runningTaxRefund += refund;
          // Reset yearly tracking
          yearlyFhsaContrib = 0;
          yearlyRrspContrib = 0;
        }
      }

      const total = runningFhsa + runningRrsp + runningOther + runningTaxRefund;
      savingsData.push({
        month: m,
        label: m === 0 ? 'Now' : `Month ${m}`,
        fhsa: Math.round(runningFhsa),
        rrsp: Math.round(runningRrsp),
        other: Math.round(runningOther),
        taxRefund: Math.round(runningTaxRefund),
        total: Math.round(total),
      });
    }

    // Final totals
    const finalSavings =
      runningFhsa + runningRrsp + runningOther + runningTaxRefund;

    // Estimated tax refund on all contributions
    const estimatedTotalRefund =
      (totalFhsaContributed + totalRrspContributed) * marginalRate;

    // Affordable price calculation
    const totalDownPayment = finalSavings * 0.85; // Reserve 15% for closing costs
    const affordablePrice = calcAffordablePrice(
      annualIncome * (withPartner ? 1.5 : 1),
      0,
      totalDownPayment,
    );

    // Down payment as percentage of affordable price
    const dpPct =
      affordablePrice > 0 ? (totalDownPayment / affordablePrice) * 100 : 0;

    // Timeline feasibility
    const minDownPayment = affordablePrice * 0.05;
    const isFeasible = totalDownPayment >= minDownPayment;
    const savingsAsPercentOfPrice =
      affordablePrice > 0 ? (totalDownPayment / affordablePrice) * 100 : 0;

    // Generate milestones
    const milestones: Milestone[] = [];
    const needsCreditWork =
      creditScore === 'below-600' ||
      creditScore === '600-649' ||
      creditScore === '650-679';

    // Phase 1: Foundation (Months 1-3)
    if (!fhsaAlreadyOpen && shouldOpenFhsa) {
      milestones.push({
        month: 1,
        action: 'Open a First Home Savings Account (FHSA)',
        category: 'Savings',
        phase: 1,
      });
    }

    milestones.push({
      month: 1,
      action: 'Set up automatic savings transfers to your FHSA and savings accounts',
      category: 'Savings',
      amount: `${fmt(monthlySavings)}/month`,
      phase: 1,
    });

    if (needsCreditWork) {
      milestones.push({
        month: 1,
        action:
          'Check credit report for errors and dispute any inaccuracies',
        category: 'Credit',
        phase: 1,
      });
      milestones.push({
        month: 1,
        action:
          'Start improving credit score: pay down utilization below 30%, avoid new credit applications',
        category: 'Credit',
        phase: 1,
      });
    } else {
      milestones.push({
        month: 1,
        action: 'Pull your credit report to confirm your score',
        category: 'Credit',
        phase: 1,
      });
    }

    if (employmentType === 'self-employed') {
      milestones.push({
        month: 1,
        action:
          'Start gathering Notices of Assessment (NOAs) — lenders require 2 years of tax filings',
        category: 'Documentation',
        phase: 1,
      });
      milestones.push({
        month: 2,
        action:
          'Review write-offs with your accountant — reducing deductions increases provable income',
        category: 'Documentation',
        phase: 1,
      });
    }

    if (employmentType === 'contract') {
      milestones.push({
        month: 1,
        action:
          'Gather contract history and income documentation for mortgage application',
        category: 'Documentation',
        phase: 1,
      });
    }

    milestones.push({
      month: 2,
      action: 'Build or top up your emergency fund (3 months of expenses)',
      category: 'Savings',
      phase: 1,
    });

    milestones.push({
      month: 3,
      action: 'Research housing market and prices in your target area',
      category: 'Shopping',
      phase: 1,
    });

    // Phase 2: Savings & Preparation (Middle period)
    if (months >= 12) {
      // Monthly FHSA contributions milestone
      if (shouldOpenFhsa) {
        milestones.push({
          month: 4,
          action: `Continue monthly FHSA contributions`,
          category: 'Savings',
          amount: `${fmt(fhsaMonthly)}/month toward ${fmt(FHSA_ANNUAL_MAX)}/year max`,
          phase: 2,
        });
      }

      if (rrspMonthly > 0) {
        milestones.push({
          month: 4,
          action: 'Contribute to RRSP for the Home Buyers\' Plan (HBP)',
          category: 'Savings',
          amount: `${fmt(rrspMonthly)}/month`,
          phase: 2,
        });
      }

      if (withPartner) {
        milestones.push({
          month: 4,
          action:
            'Coordinate FHSA/RRSP strategy with your partner — both can use HBP and FHSA independently',
          category: 'Savings',
          phase: 2,
        });
      }

      // Tax refund reinvestment
      if (months >= 16) {
        milestones.push({
          month: Math.min(16, months - 3),
          action:
            'File taxes and reinvest your FHSA/RRSP tax refund into your down payment savings',
          category: 'Savings',
          amount: `Est. refund: ${fmt(Math.round(estimatedTotalRefund * 0.5))}`,
          phase: 2,
        });
      }

      // Quarterly credit check reminders
      const creditCheckMonths = [6, 12, 18, 24, 30, 36, 42, 48, 54].filter(
        (m) => m < months - 3 && m > 3,
      );
      for (const m of creditCheckMonths.slice(0, 3)) {
        milestones.push({
          month: m,
          action: 'Check credit score — monitor for improvement and catch issues early',
          category: 'Credit',
          phase: 2,
        });
      }
    }

    // Phase 3: Getting Ready (3-6 months before target)
    const phase3Start = Math.max(4, months - 6);

    if (!preApproved) {
      milestones.push({
        month: phase3Start,
        action: 'Contact a mortgage broker and start the pre-approval process',
        category: 'Documentation',
        phase: 3,
      });
      milestones.push({
        month: phase3Start + 1,
        action: 'Get your mortgage pre-approval letter',
        category: 'Documentation',
        phase: 3,
      });
    }

    milestones.push({
      month: phase3Start + 1,
      action: 'Start attending open houses to understand market pricing',
      category: 'Shopping',
      phase: 3,
    });

    milestones.push({
      month: phase3Start + 1,
      action: 'Identify 2-3 target neighbourhoods within your budget',
      category: 'Shopping',
      phase: 3,
    });

    milestones.push({
      month: phase3Start + 2,
      action: 'Interview 2-3 buyer\'s real estate agents',
      category: 'Shopping',
      phase: 3,
    });

    // Phase 4: Active Search (2-3 months before target)
    const phase4Start = Math.max(phase3Start + 2, months - 3);

    milestones.push({
      month: phase4Start,
      action: 'Finalize your buyer\'s agent and begin active home search',
      category: 'Shopping',
      phase: 4,
    });

    milestones.push({
      month: phase4Start,
      action: 'Get home insurance quotes from 2-3 providers',
      category: 'Documentation',
      phase: 4,
    });

    milestones.push({
      month: phase4Start,
      action: 'Identify and retain a real estate lawyer',
      category: 'Documentation',
      phase: 4,
    });

    if (runningRrsp > 0) {
      milestones.push({
        month: Math.max(phase4Start, months - 3),
        action:
          'Initiate RRSP HBP withdrawal (funds must sit in RRSP for 90 days before withdrawal)',
        category: 'Savings',
        amount: fmt(Math.round(runningRrsp)),
        phase: 4,
      });
    }

    // Phase 5: Closing (Final month)
    milestones.push({
      month: months - 1,
      action: 'Submit your offer, negotiate conditions, and proceed to closing',
      category: 'Closing',
      phase: 5,
    });

    milestones.push({
      month: months,
      action: 'Withdraw FHSA funds for your home purchase (tax-free)',
      category: 'Savings',
      amount: fmt(Math.round(runningFhsa)),
      phase: 5,
    });

    milestones.push({
      month: months,
      action: 'Arrange movers, set up utilities, and forward mail',
      category: 'Closing',
      phase: 5,
    });

    milestones.push({
      month: months,
      action: 'Closing day — keys in hand!',
      category: 'Closing',
      phase: 5,
    });

    // Sort milestones by month
    milestones.sort((a, b) => a.month - b.month || a.phase - b.phase);

    // Warnings
    const warnings: string[] = [];
    if (savingsAsPercentOfPrice < 5) {
      warnings.push(
        `Your projected savings (${fmt(Math.round(totalDownPayment))}) would cover only ${savingsAsPercentOfPrice.toFixed(1)}% of the estimated affordable price. Consider extending your timeline or increasing monthly savings.`,
      );
    }
    if (needsCreditWork) {
      warnings.push(
        'Your credit score may need improvement before you can qualify for the best mortgage rates. Focus on paying down debt and making all payments on time.',
      );
    }
    if (
      employmentType === 'self-employed' &&
      months < 24
    ) {
      warnings.push(
        'Self-employed borrowers typically need 2 years of tax filings (NOAs). If you haven\'t filed for 2 years yet, consider extending your timeline.',
      );
    }
    if (fhsaStatus === 'none' && months <= 6) {
      warnings.push(
        'Opening an FHSA with only 6 months of contributions may yield limited benefit. It\'s still worth opening for the tax deduction and carry-forward room.',
      );
    }

    return {
      milestones,
      savingsData,
      finalSavings: Math.round(finalSavings),
      totalDownPayment: Math.round(totalDownPayment),
      affordablePrice: Math.round(affordablePrice),
      dpPct,
      isFeasible,
      warnings,
      estimatedTotalRefund: Math.round(estimatedTotalRefund),
      allocation: {
        fhsa: fhsaMonthly,
        rrsp: rrspMonthly,
        emergency: emergencyFund,
        closingCosts: closingCostsFund,
        other: otherSavingsMonthly,
      },
    };
  }, [
    timelineMonths,
    annualIncome,
    currentSavings,
    monthlySavings,
    employmentType,
    withPartner,
    province,
    fhsaStatus,
    creditScore,
    preApproved,
    months,
  ]);

  // Input handler
  const handleNumericInput = (
    raw: string,
    min: number,
    max: number,
    setter: (v: number) => void,
  ) => {
    const v = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!isNaN(v)) setter(clamp(v, min, max));
    else if (raw === '') setter(0);
  };

  // Phase labels
  const phaseLabel = (phase: number): string => {
    switch (phase) {
      case 1:
        return 'Foundation';
      case 2:
        return 'Savings & Preparation';
      case 3:
        return 'Getting Ready';
      case 4:
        return 'Active Search';
      case 5:
        return 'Closing';
      default:
        return '';
    }
  };

  return (
    <section className="section-padding">
      <div className="container max-w-screen-xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-3 md:mb-14">
          <Badge variant="outline" className="gap-1.5">
            <Calendar className="size-3" />
            Personalized Planner
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Your Home Buying{' '}
            <span className="text-gradient">Timeline</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Enter your financial situation and get a personalized month-by-month
            action plan for buying your first home in Canada.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          {/* ---------------------------------------------------------------- */}
          {/* LEFT: Inputs                                                     */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="size-5 text-chart-1" />
                  Your Situation
                </CardTitle>
                <CardDescription>
                  Tell us about your timeline and finances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Target timeline */}
                <div className="space-y-2">
                  <Label>I want to buy in...</Label>
                  <Select
                    value={timelineMonths}
                    onValueChange={setTimelineMonths}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Annual income */}
                <div className="space-y-2">
                  <Label htmlFor="tp-income">
                    Annual Household Income (gross)
                  </Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="tp-income"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={annualIncome.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(
                          e.target.value,
                          0,
                          1_000_000,
                          setAnnualIncome,
                        )
                      }
                    />
                  </div>
                </div>

                {/* Current savings */}
                <div className="space-y-2">
                  <Label htmlFor="tp-savings">
                    Current Savings (total liquid)
                  </Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="tp-savings"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={currentSavings.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(
                          e.target.value,
                          0,
                          5_000_000,
                          setCurrentSavings,
                        )
                      }
                    />
                  </div>
                </div>

                {/* Monthly savings */}
                <div className="space-y-2">
                  <Label htmlFor="tp-monthly">Monthly Amount You Can Save</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="tp-monthly"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={monthlySavings.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(
                          e.target.value,
                          0,
                          50_000,
                          setMonthlySavings,
                        )
                      }
                    />
                  </div>
                </div>

                {/* Employment type */}
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select
                    value={employmentType}
                    onValueChange={setEmploymentType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((e) => (
                        <SelectItem key={e.value} value={e.value}>
                          {e.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Buying solo or with partner */}
                <div className="flex items-center gap-3">
                  <Label className="cursor-pointer text-sm">
                    Buying with a partner?
                  </Label>
                  <Button
                    variant={withPartner ? 'default' : 'outline'}
                    size="xs"
                    onClick={() => setWithPartner((v) => !v)}
                  >
                    {withPartner ? 'Yes' : 'No'}
                  </Button>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <Label>Province / Territory</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="size-5 text-chart-2" />
                  Financial Readiness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* FHSA status */}
                <div className="space-y-2">
                  <Label>FHSA Status</Label>
                  <Select value={fhsaStatus} onValueChange={setFhsaStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FHSA_STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Credit score */}
                <div className="space-y-2">
                  <Label>Credit Score Range</Label>
                  <Select value={creditScore} onValueChange={setCreditScore}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CREDIT_SCORE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pre-approved */}
                <div className="flex items-center gap-3">
                  <Label className="cursor-pointer text-sm">
                    Have you been pre-approved?
                  </Label>
                  <Button
                    variant={preApproved ? 'default' : 'outline'}
                    size="xs"
                    onClick={() => setPreApproved((v) => !v)}
                  >
                    {preApproved ? 'Yes' : 'No'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT: Results                                                   */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            <Tabs defaultValue="timeline">
              <TabsList className="w-full">
                <TabsTrigger value="timeline" className="flex-1">
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="savings" className="flex-1">
                  Savings Plan
                </TabsTrigger>
              </TabsList>

              {/* ------- Timeline Tab ------- */}
              <TabsContent value="timeline" className="mt-6 space-y-6">
                {/* Summary Card */}
                <Card className="border-chart-1/20 bg-chart-1/5">
                  <CardContent className="py-2">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <p className="text-muted-foreground text-sm">
                        Your personalized plan
                      </p>
                      <p className="text-gradient text-3xl font-bold tracking-tight md:text-4xl">
                        {months}-month plan
                      </p>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">
                          Projected Savings
                        </p>
                        <p className="text-lg font-semibold">
                          {fmt(plan.finalSavings)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">
                          Est. Affordable Price
                        </p>
                        <p className="text-lg font-semibold">
                          {fmt(plan.affordablePrice)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">
                          Down Payment
                        </p>
                        <p className="text-lg font-semibold">
                          {fmt(plan.totalDownPayment)}{' '}
                          <span className="text-muted-foreground text-xs font-normal">
                            ({plan.dpPct.toFixed(1)}%)
                          </span>
                        </p>
                      </div>
                    </div>

                    {plan.isFeasible ? (
                      <div className="mt-4 flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
                        <CheckCircle2 className="size-4 shrink-0" />
                        Your timeline looks realistic based on your savings rate
                        and income.
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="size-4 shrink-0" />
                        This timeline may be aggressive. Consider saving more or
                        extending your target date.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Visual Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Month-by-Month Action Plan
                    </CardTitle>
                    <CardDescription>
                      {plan.milestones.length} milestones across 5 phases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {(() => {
                        let lastPhase = 0;
                        return plan.milestones.map((milestone, index) => {
                          const showPhaseHeader =
                            milestone.phase !== lastPhase;
                          lastPhase = milestone.phase;
                          const Icon = categoryIcon(milestone.category);

                          return (
                            <div key={index}>
                              {showPhaseHeader && (
                                <div
                                  className={cn(
                                    'mb-4 flex items-center gap-2',
                                    index > 0 && 'mt-6',
                                  )}
                                >
                                  <span className="bg-chart-1/15 text-chart-1 inline-flex size-6 items-center justify-center rounded-full text-xs font-bold">
                                    {milestone.phase}
                                  </span>
                                  <span className="text-sm font-semibold">
                                    {phaseLabel(milestone.phase)}
                                  </span>
                                </div>
                              )}

                              <div className="flex gap-4 pb-4">
                                {/* Timeline dot and line */}
                                <div className="relative flex flex-col items-center">
                                  <div className="bg-background border-input z-10 grid size-8 place-items-center rounded-full border">
                                    <Icon className="text-muted-foreground size-3.5" />
                                  </div>
                                  {index < plan.milestones.length - 1 && (
                                    <div className="absolute top-8 h-[calc(100%-1.5rem)] w-px bg-[repeating-linear-gradient(to_bottom,var(--input)_0px,var(--input)_4px,transparent_4px,transparent_8px)]" />
                                  )}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1 pb-2">
                                  <div className="mb-1 flex flex-wrap items-center gap-2">
                                    <span className="text-muted-foreground text-xs font-medium">
                                      {milestone.month === 0
                                        ? 'Now'
                                        : `Month ${milestone.month}`}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        'text-[10px]',
                                        categoryColor(milestone.category),
                                      )}
                                    >
                                      {milestone.category}
                                    </Badge>
                                  </div>
                                  <p className="text-sm leading-relaxed">
                                    {milestone.action}
                                  </p>
                                  {milestone.amount && (
                                    <p className="text-chart-1 mt-1 text-xs font-medium">
                                      {milestone.amount}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                {plan.warnings.length > 0 && (
                  <Card className="border-amber-500/20 bg-amber-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="size-5" />
                        Things to Consider
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {plan.warnings.map((warning, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300"
                        >
                          <Info className="mt-0.5 size-3.5 shrink-0" />
                          <p>{warning}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* ------- Savings Plan Tab ------- */}
              <TabsContent value="savings" className="mt-6 space-y-6">
                {/* Savings Projection Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Savings Projection</CardTitle>
                    <CardDescription>
                      Cumulative savings growth over your {months}-month timeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72 w-full sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={plan.savingsData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border)"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            interval={Math.max(
                              0,
                              Math.floor(months / 6) - 1,
                            )}
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            tickFormatter={(v: number) =>
                              `$${(v / 1000).toFixed(0)}k`
                            }
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Legend
                            verticalAlign="bottom"
                            formatter={(value: string) => (
                              <span className="text-foreground text-sm">
                                {value}
                              </span>
                            )}
                          />
                          <Area
                            type="monotone"
                            dataKey="fhsa"
                            name="FHSA"
                            stackId="1"
                            stroke="var(--chart-1)"
                            fill="var(--chart-1)"
                            fillOpacity={0.3}
                          />
                          <Area
                            type="monotone"
                            dataKey="rrsp"
                            name="RRSP (HBP)"
                            stackId="1"
                            stroke="var(--chart-2)"
                            fill="var(--chart-2)"
                            fillOpacity={0.3}
                          />
                          <Area
                            type="monotone"
                            dataKey="other"
                            name="Other Savings"
                            stackId="1"
                            stroke="var(--chart-3)"
                            fill="var(--chart-3)"
                            fillOpacity={0.3}
                          />
                          <Area
                            type="monotone"
                            dataKey="taxRefund"
                            name="Tax Refunds"
                            stackId="1"
                            stroke="var(--chart-4)"
                            fill="var(--chart-4)"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Savings Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Savings Allocation</CardTitle>
                    <CardDescription>
                      Recommended split of your {fmt(monthlySavings)}/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        label: 'FHSA',
                        value: plan.allocation.fhsa,
                        color: 'bg-chart-1',
                        note: `Up to ${fmt(FHSA_ANNUAL_MAX)}/year`,
                      },
                      {
                        label: 'RRSP (HBP)',
                        value: plan.allocation.rrsp,
                        color: 'bg-chart-2',
                        note: `Up to ${fmt(HBP_MAX)} lifetime`,
                      },
                      {
                        label: 'Emergency Fund',
                        value: plan.allocation.emergency,
                        color: 'bg-chart-3',
                        note: 'Target 3 months of expenses',
                      },
                      {
                        label: 'Closing Costs Fund',
                        value: plan.allocation.closingCosts,
                        color: 'bg-chart-4',
                        note: 'Typically 1.5-4% of purchase price',
                      },
                      {
                        label: 'General Savings',
                        value: plan.allocation.other,
                        color: 'bg-muted-foreground',
                        note: 'Additional down payment savings',
                      },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'inline-block size-2.5 rounded-full',
                                row.color,
                              )}
                            />
                            <span>{row.label}</span>
                          </div>
                          <span className="font-medium">
                            {fmtFull(row.value)}/mo
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 pl-[18px] text-xs">
                          {row.note}
                        </p>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>Total Monthly</span>
                      <span>{fmtFull(monthlySavings)}/mo</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Projected Totals at Purchase</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        label: 'Current Savings',
                        value: fmt(currentSavings),
                      },
                      {
                        label: `New Savings (${months} months)`,
                        value: fmt(monthlySavings * months),
                      },
                      {
                        label: 'Est. Tax Refunds (FHSA + RRSP)',
                        value: fmt(plan.estimatedTotalRefund),
                      },
                      {
                        label: 'Total Available',
                        value: fmt(plan.finalSavings),
                        bold: true,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex items-center justify-between text-sm',
                          'bold' in row &&
                            row.bold &&
                            'border-t pt-3 font-semibold',
                        )}
                      >
                        <span className="text-muted-foreground">
                          {row.label}
                        </span>
                        <span>{row.value}</span>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Available for Down Payment (~85%)
                        </span>
                        <span className="font-medium">
                          {fmt(plan.totalDownPayment)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Reserved for Closing Costs (~15%)
                        </span>
                        <span className="font-medium">
                          {fmt(
                            Math.round(plan.finalSavings * 0.15),
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 text-sm font-semibold">
                        <span>Est. Affordable Purchase Price</span>
                        <span>{fmt(plan.affordablePrice)}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground flex items-start gap-1.5 pt-2 text-xs">
                      <Info className="mt-0.5 size-3 shrink-0" />
                      Affordable price based on stress test at 5.25%, 25-year
                      amortization, 39% GDS / 44% TDS ratios
                      {withPartner ? ' (1.5x income for dual-income household)' : ''}.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
