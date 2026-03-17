'use client';

import { useMemo, useState } from 'react';

import {
  AlertTriangle,
  Calculator,
  DollarSign,
  Home,
  Info,
  MapPin,
  Percent,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

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

const fmtDetailed = (n: number) =>
  n.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtPct = (n: number) =>
  `${n.toLocaleString('en-CA', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// CMHC Insurance
// ---------------------------------------------------------------------------

function cmhcRate(downPct: number): number {
  if (downPct >= 20) return 0;
  if (downPct >= 15) return 0.028;
  if (downPct >= 10) return 0.031;
  return 0.04;
}

// ---------------------------------------------------------------------------
// Province type and list
// ---------------------------------------------------------------------------

type Province =
  | 'ON'
  | 'BC'
  | 'AB'
  | 'MB'
  | 'SK'
  | 'QC'
  | 'NB'
  | 'PE'
  | 'NS'
  | 'NL';

const PROVINCES: { value: Province; label: string }[] = [
  { value: 'ON', label: 'Ontario' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'AB', label: 'Alberta' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'QC', label: 'Quebec' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NL', label: 'Newfoundland & Labrador' },
];

// ---------------------------------------------------------------------------
// Monthly payment formula (Canadian semi-annual compounding)
// ---------------------------------------------------------------------------

function monthlyPayment(
  principal: number,
  annualRate: number,
  amortYears: number,
): number {
  if (principal <= 0 || annualRate <= 0) return 0;
  const semiAnnual = annualRate / 100 / 2;
  const effectiveMonthly = Math.pow(1 + semiAnnual, 1 / 6) - 1;
  const n = amortYears * 12;
  if (effectiveMonthly === 0) return principal / n;
  return (
    (principal * effectiveMonthly * Math.pow(1 + effectiveMonthly, n)) /
    (Math.pow(1 + effectiveMonthly, n) - 1)
  );
}

// ---------------------------------------------------------------------------
// Max mortgage from payment (inverse of monthly payment formula)
// ---------------------------------------------------------------------------

function maxMortgageFromPayment(
  maxPayment: number,
  annualRate: number,
  amortYears: number,
): number {
  if (maxPayment <= 0 || annualRate <= 0) return 0;
  const semiAnnual = annualRate / 100 / 2;
  const effectiveMonthly = Math.pow(1 + semiAnnual, 1 / 6) - 1;
  const n = amortYears * 12;
  if (effectiveMonthly === 0) return maxPayment * n;
  return (
    maxPayment *
    ((1 - Math.pow(1 + effectiveMonthly, -n)) / effectiveMonthly)
  );
}

// ---------------------------------------------------------------------------
// Minimum down payment for a price (Canadian rules)
// ---------------------------------------------------------------------------

function minDownPayment(price: number): number {
  if (price <= 500_000) return price * 0.05;
  if (price <= 999_999) return 25_000 + (price - 500_000) * 0.1;
  return price * 0.2;
}

// ---------------------------------------------------------------------------
// Result card sub-component
// ---------------------------------------------------------------------------

function ResultItem({
  icon: Icon,
  label,
  value,
  sublabel,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 transition-colors',
        highlight
          ? 'border-chart-1/30 bg-chart-1/5'
          : 'dark:bg-input/10',
      )}
    >
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-md',
          highlight
            ? 'bg-chart-1/15 text-chart-1'
            : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate text-lg font-semibold tracking-tight">
          {value}
        </p>
        {sublabel && (
          <p className="text-muted-foreground mt-0.5 text-xs">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GDS/TDS visual bar
// ---------------------------------------------------------------------------

function RatioBar({
  label,
  value,
  limit,
  isBinding,
}: {
  label: string;
  value: number;
  limit: number;
  isBinding: boolean;
}) {
  const pct = Math.min(value, limit + 10);
  const overLimit = value > limit;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {label}
          {isBinding && (
            <span className="text-chart-1 ml-1.5 text-xs font-medium">
              (binding constraint)
            </span>
          )}
        </span>
        <span
          className={cn(
            'font-semibold',
            overLimit ? 'text-destructive' : 'text-foreground',
          )}
        >
          {fmtPct(value)}
        </span>
      </div>
      <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            overLimit ? 'bg-destructive' : isBinding ? 'bg-chart-1' : 'bg-chart-2',
          )}
          style={{ width: `${Math.min((pct / (limit + 10)) * 100, 100)}%` }}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        Limit: {fmtPct(limit)}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AffordabilityCalculator() {
  // Inputs
  const [annualIncome, setAnnualIncome] = useState(100_000);
  const [monthlyDebt, setMonthlyDebt] = useState(300);
  const [downPayment, setDownPayment] = useState(50_000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [amortization, setAmortization] = useState(25);
  const [province, setProvince] = useState<Province>('ON');
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.0);
  const [heatingCosts, setHeatingCosts] = useState(150);
  const [condoFeesEnabled, setCondoFeesEnabled] = useState(false);
  const [condoFees, setCondoFees] = useState(400);

  // Derived values
  const calculations = useMemo(() => {
    const income = clamp(annualIncome, 0, 1_000_000);
    const debt = clamp(monthlyDebt, 0, 50_000);
    const dp = clamp(downPayment, 0, 5_000_000);
    const rate = clamp(interestRate, 0.1, 15);
    const heating = clamp(heatingCosts, 0, 1_000);
    const condo = condoFeesEnabled ? clamp(condoFees, 0, 5_000) : 0;
    const taxRate = clamp(propertyTaxRate, 0, 5) / 100;

    const grossMonthly = income / 12;

    // Stress test rate
    const stressRate = Math.max(rate + 2, 5.25);

    // We need to solve iteratively because property tax depends on home price,
    // and CMHC insurance depends on the down payment percentage (which depends on price).
    // We'll use an iterative approach.

    let maxPurchasePrice = 0;
    let bindingConstraint: 'GDS' | 'TDS' = 'GDS';
    let gdsRatio = 0;
    let tdsRatio = 0;
    let maxMortgageAmount = 0;

    // Iterate: try different purchase prices to find the max
    // Start with a rough estimate and refine
    for (let iteration = 0; iteration < 50; iteration++) {
      // For GDS: mortgage_payment + property_tax + heating + 50%*condo <= 0.39 * gross_monthly
      // For TDS: GDS_costs + debt <= 0.44 * gross_monthly

      const gdsMaxForNonMortgage = heating + (condo * 0.5);
      const tdsMaxForNonMortgage = heating + (condo * 0.5) + debt;

      // Max mortgage payment from GDS
      const gdsMaxMortgagePayment = grossMonthly * 0.39 - gdsMaxForNonMortgage;
      // We need to subtract property tax, but it depends on price, so we iterate below

      // Max mortgage payment from TDS
      const tdsMaxMortgagePayment = grossMonthly * 0.44 - tdsMaxForNonMortgage;

      // The mortgage payment must also cover property tax
      // property_tax_monthly = price * taxRate / 12
      // For GDS: payment + price * taxRate / 12 + heating + 0.5 * condo <= 0.39 * grossMonthly
      // payment <= 0.39 * grossMonthly - price * taxRate / 12 - heating - 0.5 * condo
      // And: price = mortgage + dp, mortgage = maxMortgageFromPayment(payment, stressRate, amort)
      // With CMHC: if dp/price < 20%, mortgage = (price - dp) * (1 + cmhcRate)

      // Binary search for max price
      let lo = dp; // minimum price is at least the down payment
      let hi = dp + maxMortgageFromPayment(
        Math.min(gdsMaxMortgagePayment, tdsMaxMortgagePayment),
        stressRate,
        amortization,
      ) * 2; // generous upper bound

      if (hi <= lo) {
        hi = lo + 1;
      }

      for (let bs = 0; bs < 60; bs++) {
        const mid = (lo + hi) / 2;
        const price = mid;
        const dpPct = dp / price * 100;

        // 30-year amort only with 20%+ down
        const effectiveAmort = dpPct < 20 && amortization === 30 ? 25 : amortization;

        const mortgageBeforeInsurance = price - dp;
        const insurance = mortgageBeforeInsurance * cmhcRate(dpPct);
        const totalMortgage = mortgageBeforeInsurance + insurance;

        const mortgagePayment = monthlyPayment(totalMortgage, stressRate, effectiveAmort);
        const propTaxMonthly = price * taxRate / 12;

        const gdsTotal = mortgagePayment + propTaxMonthly + heating + (condo * 0.5);
        const tdsTotal = gdsTotal + debt;

        const gdsOk = gdsTotal <= grossMonthly * 0.39;
        const tdsOk = tdsTotal <= grossMonthly * 0.44;

        if (gdsOk && tdsOk) {
          lo = mid;
        } else {
          hi = mid;
        }
      }

      maxPurchasePrice = Math.floor(lo);
      break;
    }

    // Final calculations with the determined price
    const price = maxPurchasePrice;
    const dpPct = price > 0 ? (dp / price) * 100 : 0;
    const effectiveAmort = dpPct < 20 && amortization === 30 ? 25 : amortization;

    const mortgageBeforeInsurance = Math.max(0, price - dp);
    const insurance = mortgageBeforeInsurance * cmhcRate(dpPct);
    maxMortgageAmount = mortgageBeforeInsurance + insurance;

    const stressPayment = monthlyPayment(maxMortgageAmount, stressRate, effectiveAmort);
    const actualPayment = monthlyPayment(maxMortgageAmount, rate, effectiveAmort);
    const propTaxMonthly = price * taxRate / 12;

    const gdsTotal = stressPayment + propTaxMonthly + heating + (condo * 0.5);
    const tdsTotal = gdsTotal + debt;

    gdsRatio = grossMonthly > 0 ? (gdsTotal / grossMonthly) * 100 : 0;
    tdsRatio = grossMonthly > 0 ? (tdsTotal / grossMonthly) * 100 : 0;

    // Determine binding constraint by checking which one limited the price more
    // Re-check: if we remove GDS constraint, would TDS let us go higher? Or vice versa.
    // Simpler: check which ratio is closer to its limit
    const gdsSlack = 39 - gdsRatio;
    const tdsSlack = 44 - tdsRatio;
    bindingConstraint = gdsSlack <= tdsSlack ? 'GDS' : 'TDS';

    // Check if down payment meets minimum
    const requiredMinDp = minDownPayment(price);
    const dpBelowMin = dp < requiredMinDp - 0.01 && price > 0;

    // Monthly payment breakdown at actual rate
    const monthlyBreakdown = {
      mortgagePI: actualPayment,
      propertyTax: propTaxMonthly,
      heating: heating,
      condoFees: condo,
      total: actualPayment + propTaxMonthly + heating + condo,
    };

    return {
      maxPurchasePrice: price,
      maxMortgage: maxMortgageAmount,
      mortgageBeforeInsurance,
      cmhcPremium: insurance,
      cmhcRateValue: cmhcRate(dpPct),
      dpPct,
      effectiveAmort,
      stressRate,
      stressPayment,
      actualPayment,
      gdsRatio,
      tdsRatio,
      bindingConstraint,
      monthlyBreakdown,
      dpBelowMin,
      requiredMinDp: requiredMinDp,
      grossMonthly,
    };
  }, [
    annualIncome,
    monthlyDebt,
    downPayment,
    interestRate,
    amortization,
    province,
    propertyTaxRate,
    heatingCosts,
    condoFeesEnabled,
    condoFees,
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

  return (
    <section className="section-padding">
      <div className="container max-w-screen-xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-3 md:mb-14">
          <Badge variant="outline" className="gap-1.5">
            <Home className="size-3" />
            Affordability Calculator
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            How much can you{' '}
            <span className="text-gradient">afford?</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Enter your financial details to find your maximum purchase price,
            based on Canadian mortgage stress test rules and GDS/TDS ratios.
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
                  <DollarSign className="size-5 text-chart-1" />
                  Income &amp; Debts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Annual income */}
                <div className="space-y-2">
                  <Label htmlFor="aff-income">Annual Household Income (gross)</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="aff-income"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={annualIncome.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 0, 1_000_000, setAnnualIncome)
                      }
                    />
                  </div>
                </div>

                {/* Monthly debt */}
                <div className="space-y-2">
                  <Label htmlFor="aff-debt">Monthly Debt Payments</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="aff-debt"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={monthlyDebt.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 0, 50_000, setMonthlyDebt)
                      }
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Car loans, student loans, credit cards, lines of credit
                  </p>
                </div>

                {/* Down payment */}
                <div className="space-y-2">
                  <Label htmlFor="aff-dp">Down Payment Saved</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="aff-dp"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={downPayment.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 0, 5_000_000, setDownPayment)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="size-5 text-chart-2" />
                  Mortgage Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Interest rate */}
                <div className="space-y-2">
                  <Label htmlFor="aff-rate">Interest Rate</Label>
                  <div className="relative">
                    <Input
                      id="aff-rate"
                      type="text"
                      inputMode="decimal"
                      value={interestRate}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 0.1, 15, setInterestRate)
                      }
                    />
                    <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Current typical rate: ~4.5%
                  </p>
                </div>

                {/* Amortization */}
                <div className="space-y-2">
                  <Label>Amortization Period</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={amortization === 25 ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setAmortization(25)}
                    >
                      25 years
                    </Button>
                    <Button
                      variant={amortization === 30 ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setAmortization(30)}
                    >
                      30 years
                    </Button>
                  </div>
                  <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
                    <Info className="mt-0.5 size-3 shrink-0" />
                    30-year amortization requires 20%+ down payment.
                  </p>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Select
                    value={province}
                    onValueChange={(v) => setProvince(v as Province)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select province" />
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
                  <MapPin className="size-5 text-chart-3" />
                  Housing Costs
                </CardTitle>
                <CardDescription>
                  Monthly costs factored into your qualification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Property tax rate */}
                <div className="space-y-2">
                  <Label htmlFor="aff-ptax">Estimated Property Tax Rate</Label>
                  <div className="relative">
                    <Input
                      id="aff-ptax"
                      type="text"
                      inputMode="decimal"
                      value={propertyTaxRate}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 0, 5, setPropertyTaxRate)
                      }
                    />
                    <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    % of home value per year (typical: 0.5% - 2%)
                  </p>
                </div>

                {/* Heating costs */}
                <div className="space-y-2">
                  <Label htmlFor="aff-heat">Monthly Heating Costs</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="aff-heat"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={heatingCosts.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 0, 1_000, setHeatingCosts)
                      }
                    />
                  </div>
                </div>

                {/* Condo fees */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="aff-condo-toggle" className="cursor-pointer text-sm">
                      Condo fees?
                    </Label>
                    <Button
                      id="aff-condo-toggle"
                      variant={condoFeesEnabled ? 'default' : 'outline'}
                      size="xs"
                      onClick={() => setCondoFeesEnabled((v) => !v)}
                    >
                      {condoFeesEnabled ? 'Yes' : 'No'}
                    </Button>
                  </div>
                  {condoFeesEnabled && (
                    <div className="relative">
                      <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        type="text"
                        inputMode="numeric"
                        className="pl-9"
                        value={condoFees.toLocaleString('en-CA')}
                        onChange={(e) =>
                          handleNumericInput(e.target.value, 0, 5_000, setCondoFees)
                        }
                      />
                    </div>
                  )}
                  <p className="text-muted-foreground text-xs">
                    50% of condo fees count toward GDS/TDS ratios
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT: Results                                                   */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            {/* Max purchase price highlight */}
            <Card className="border-chart-1/20 bg-chart-1/5">
              <CardContent className="flex flex-col items-center gap-1 py-2 text-center">
                <p className="text-muted-foreground text-sm">
                  You could afford up to
                </p>
                <p className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
                  {fmt(calculations.maxPurchasePrice)}
                </p>
                <p className="text-muted-foreground text-xs">
                  Based on {fmtPct(calculations.stressRate)} stress test rate
                  {' '}&bull;{' '}
                  {calculations.bindingConstraint} is the binding constraint
                </p>
              </CardContent>
            </Card>

            {/* Warnings */}
            {calculations.dpBelowMin && calculations.maxPurchasePrice > 0 && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="flex items-start gap-3 py-1">
                  <div className="bg-destructive/15 text-destructive flex size-9 shrink-0 items-center justify-center rounded-md">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Down payment below minimum
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      For a {fmt(calculations.maxPurchasePrice)} home, the
                      minimum down payment is{' '}
                      <span className="text-foreground font-semibold">
                        {fmt(calculations.requiredMinDp)}
                      </span>
                      . You have {fmt(downPayment)} saved.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key metrics */}
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultItem
                icon={Home}
                label="Maximum Mortgage"
                value={fmt(calculations.maxMortgage)}
                sublabel={
                  calculations.cmhcPremium > 0
                    ? `Includes ${fmt(calculations.cmhcPremium)} CMHC insurance`
                    : 'No CMHC insurance required'
                }
              />
              <ResultItem
                icon={DollarSign}
                label="Your Down Payment"
                value={fmt(downPayment)}
                sublabel={`${fmtPct(calculations.dpPct)} of purchase price`}
              />
              <ResultItem
                icon={Calculator}
                label="Monthly Payment"
                value={fmtDetailed(calculations.monthlyBreakdown.total)}
                sublabel="All housing costs included"
                highlight
              />
              <ResultItem
                icon={ShieldCheck}
                label="CMHC Insurance"
                value={fmt(calculations.cmhcPremium)}
                sublabel={
                  calculations.cmhcRateValue > 0
                    ? `Premium rate: ${(calculations.cmhcRateValue * 100).toFixed(1)}%`
                    : 'Not required (20%+ down)'
                }
                highlight={calculations.cmhcPremium > 0}
              />
            </div>

            {/* Stress test info */}
            <Card>
              <CardContent className="flex items-start gap-3 py-1">
                <div className="bg-chart-2/15 text-chart-2 flex size-9 shrink-0 items-center justify-center rounded-md">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Stress Test Qualification
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    You qualify at{' '}
                    <span className="text-foreground font-semibold">
                      {fmtPct(calculations.stressRate)}
                    </span>{' '}
                    (your rate {fmtPct(interestRate)} + 2%, or 5.25%,
                    whichever is higher).
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Stress test monthly mortgage payment:{' '}
                    {fmtDetailed(calculations.stressPayment)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* GDS / TDS bars */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Debt Service Ratios</CardTitle>
                <CardDescription>
                  Lenders use GDS and TDS to determine how much you can borrow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <RatioBar
                  label="GDS (Gross Debt Service)"
                  value={calculations.gdsRatio}
                  limit={39}
                  isBinding={calculations.bindingConstraint === 'GDS'}
                />
                <RatioBar
                  label="TDS (Total Debt Service)"
                  value={calculations.tdsRatio}
                  limit={44}
                  isBinding={calculations.bindingConstraint === 'TDS'}
                />
              </CardContent>
            </Card>

            {/* Monthly breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Payment Breakdown</CardTitle>
                <CardDescription>
                  At your actual rate of {fmtPct(interestRate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    label: 'Mortgage (principal + interest)',
                    value: fmtDetailed(calculations.monthlyBreakdown.mortgagePI),
                  },
                  {
                    label: 'Property tax',
                    value: fmtDetailed(calculations.monthlyBreakdown.propertyTax),
                  },
                  {
                    label: 'Heating',
                    value: fmtDetailed(calculations.monthlyBreakdown.heating),
                  },
                  ...(condoFeesEnabled
                    ? [
                        {
                          label: 'Condo fees',
                          value: fmtDetailed(calculations.monthlyBreakdown.condoFees),
                        },
                      ]
                    : []),
                  {
                    label: 'Total Monthly Housing Cost',
                    value: fmtDetailed(calculations.monthlyBreakdown.total),
                    bold: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={cn(
                      'flex items-center justify-between text-sm',
                      (row as { bold?: boolean }).bold && 'border-t pt-3 font-semibold',
                    )}
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
