'use client';

import { useMemo, useState } from 'react';

import {
  Calculator,
  DollarSign,
  Home,
  Info,
  MapPin,
  Percent,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtPct = (n: number) =>
  `${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

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
// Land Transfer Tax by Province
// ---------------------------------------------------------------------------

interface LttResult {
  tax: number;
  rebate: number;
  net: number;
  note: string;
}

function calcOntarioLTT(price: number, firstTime: boolean): LttResult {
  let tax = 0;
  if (price > 2_000_000) tax += (price - 2_000_000) * 0.025;
  const cap1 = Math.min(price, 2_000_000);
  if (cap1 > 400_000) tax += (cap1 - 400_000) * 0.02;
  const cap2 = Math.min(price, 400_000);
  if (cap2 > 250_000) tax += (cap2 - 250_000) * 0.015;
  const cap3 = Math.min(price, 250_000);
  if (cap3 > 55_000) tax += (cap3 - 55_000) * 0.01;
  tax += Math.min(price, 55_000) * 0.005;

  const rebate = firstTime ? Math.min(tax, 4_000) : 0;
  return {
    tax,
    rebate,
    net: tax - rebate,
    note: firstTime
      ? 'First-time buyers receive up to $4,000 rebate (homes up to $368,000 pay no LTT).'
      : '',
  };
}

function calcBCLTT(price: number, firstTime: boolean): LttResult {
  let tax = 0;
  if (price > 2_000_000) tax += (price - 2_000_000) * 0.03;
  const cap1 = Math.min(price, 2_000_000);
  if (cap1 > 200_000) tax += (cap1 - 200_000) * 0.02;
  tax += Math.min(price, 200_000) * 0.01;

  const rebate =
    firstTime && price <= 835_000
      ? price <= 500_000
        ? tax
        : tax * ((835_000 - price) / 335_000)
      : 0;
  return {
    tax,
    rebate: Math.max(0, rebate),
    net: tax - Math.max(0, rebate),
    note: firstTime
      ? 'BC first-time buyers: full exemption up to $500K, partial up to $835K (newly built homes up to $1.1M may also qualify).'
      : '',
  };
}

function calcManitobaLTT(price: number, firstTime: boolean): LttResult {
  let tax = 0;
  if (price > 200_000) tax += (price - 200_000) * 0.02;
  const cap1 = Math.min(price, 200_000);
  if (cap1 > 150_000) tax += (cap1 - 150_000) * 0.015;
  const cap2 = Math.min(price, 150_000);
  if (cap2 > 90_000) tax += (cap2 - 90_000) * 0.01;
  const cap3 = Math.min(price, 90_000);
  if (cap3 > 30_000) tax += (cap3 - 30_000) * 0.005;
  // first $30K is 0%

  // Manitoba does not provide a first-time buyer LTT rebate (separate from the Home Buyers Tax Credit)
  return {
    tax,
    rebate: 0,
    net: tax,
    note: firstTime
      ? 'Manitoba has no specific LTT first-time buyer rebate, but you may qualify for the federal Home Buyers Tax Credit.'
      : '',
  };
}

function calcQuebecLTT(price: number, firstTime: boolean): LttResult {
  let tax = 0;
  if (price > 500_000) tax += (price - 500_000) * 0.03;
  const cap1 = Math.min(price, 500_000);
  if (cap1 > 294_600) tax += (cap1 - 294_600) * 0.015;
  const cap2 = Math.min(price, 294_600);
  if (cap2 > 58_900) tax += (cap2 - 58_900) * 0.01;
  tax += Math.min(price, 58_900) * 0.005;

  return {
    tax,
    rebate: 0,
    net: tax,
    note: firstTime
      ? 'Quebec has no provincial first-time buyer LTT rebate. Some municipalities (like Montreal) charge an additional transfer tax.'
      : '',
  };
}

function calcFlatLTT(
  price: number,
  rate: number,
  provinceName: string,
  firstTime: boolean,
): LttResult {
  const tax = price * rate;
  return {
    tax,
    rebate: 0,
    net: tax,
    note: firstTime
      ? `${provinceName} charges a flat ${(rate * 100).toFixed(0)}% land transfer tax with no first-time buyer rebate.`
      : '',
  };
}

function calcNoLTT(provinceName: string): LttResult {
  return {
    tax: 0,
    rebate: 0,
    net: 0,
    note: `${provinceName} does not charge a provincial land transfer tax.`,
  };
}

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

function calcLTT(
  province: Province,
  price: number,
  firstTime: boolean,
): LttResult {
  switch (province) {
    case 'ON':
      return calcOntarioLTT(price, firstTime);
    case 'BC':
      return calcBCLTT(price, firstTime);
    case 'MB':
      return calcManitobaLTT(price, firstTime);
    case 'QC':
      return calcQuebecLTT(price, firstTime);
    case 'NB':
      return calcFlatLTT(price, 0.01, 'New Brunswick', firstTime);
    case 'PE':
      return calcFlatLTT(price, 0.01, 'Prince Edward Island', firstTime);
    case 'NL':
      return calcFlatLTT(
        price,
        // NL has varied registration fees; approximate as flat 0.4% for residential
        0.004,
        'Newfoundland & Labrador',
        firstTime,
      );
    case 'AB':
      return calcNoLTT('Alberta');
    case 'SK':
      return calcNoLTT('Saskatchewan');
    case 'NS':
      return calcNoLTT('Nova Scotia');
    default:
      return calcNoLTT('Unknown');
  }
}

// ---------------------------------------------------------------------------
// Monthly payment formula
// ---------------------------------------------------------------------------

function monthlyPayment(
  principal: number,
  annualRate: number,
  amortYears: number,
): number {
  if (principal <= 0) return 0;
  // Canadian mortgages compound semi-annually
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
// Custom chart tooltip
// ---------------------------------------------------------------------------

interface CustomTooltipPayload {
  name: string;
  value: number;
  payload: { fill: string };
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: CustomTooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ background: entry.payload.fill }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
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
// Main component
// ---------------------------------------------------------------------------

export default function MortgageCalculator() {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState(500_000);
  const [downPaymentMode, setDownPaymentMode] = useState<'percent' | 'dollar'>(
    'percent',
  );
  const [downPaymentPct, setDownPaymentPct] = useState(5);
  const [downPaymentDollar, setDownPaymentDollar] = useState(25_000);
  const [interestRate, setInterestRate] = useState(5.0);
  const [amortization, setAmortization] = useState(25);

  // LTT
  const [province, setProvince] = useState<Province>('ON');
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(true);

  // Derived values
  const calculations = useMemo(() => {
    const price = clamp(purchasePrice, 0, 10_000_000);
    const rate = clamp(interestRate, 0, 15);

    let dpAmount: number;
    let dpPct: number;
    if (downPaymentMode === 'percent') {
      dpPct = clamp(downPaymentPct, 0, 100);
      dpAmount = price * (dpPct / 100);
    } else {
      dpAmount = clamp(downPaymentDollar, 0, price);
      dpPct = price > 0 ? (dpAmount / price) * 100 : 0;
    }

    // Minimum down payment validation (Canada rules)
    const minDpPct = price <= 500_000 ? 5 : price <= 999_999 ? 5 : 20;
    const minDpAmount =
      price <= 500_000
        ? price * 0.05
        : price <= 999_999
          ? 25_000 + (price - 500_000) * 0.1
          : price * 0.2;

    const mortgageBeforeInsurance = price - dpAmount;

    // CMHC
    const cmhc = cmhcRate(dpPct);
    const cmhcPremium = mortgageBeforeInsurance * cmhc;
    const totalMortgage = mortgageBeforeInsurance + cmhcPremium;

    // 30-year only available if dp >= 20%
    const effectiveAmort = dpPct < 20 && amortization === 30 ? 25 : amortization;

    const monthly = monthlyPayment(totalMortgage, rate, effectiveAmort);
    const totalPaid = monthly * effectiveAmort * 12;
    const totalInterest = totalPaid - totalMortgage;

    // Stress test
    const stressRate = Math.max(rate + 2, 5.25);
    const stressMonthly = monthlyPayment(
      totalMortgage,
      stressRate,
      effectiveAmort,
    );

    const totalCost = price + totalInterest + cmhcPremium;

    // LTT
    const ltt = calcLTT(province, price, firstTimeBuyer);

    return {
      price,
      dpAmount,
      dpPct,
      minDpPct,
      minDpAmount,
      mortgageBeforeInsurance,
      cmhcRate: cmhc,
      cmhcPremium,
      totalMortgage,
      effectiveAmort,
      monthly,
      totalPaid,
      totalInterest,
      stressRate,
      stressMonthly,
      totalCost,
      ltt,
      dpBelowMin: dpAmount < minDpAmount - 0.01,
    };
  }, [
    purchasePrice,
    downPaymentMode,
    downPaymentPct,
    downPaymentDollar,
    interestRate,
    amortization,
    province,
    firstTimeBuyer,
  ]);

  // Chart data
  const chartData = useMemo(() => {
    const items = [
      {
        name: 'Principal',
        value: Math.max(0, calculations.totalMortgage),
        fill: 'oklch(0.58 0.2 285)',
      },
      {
        name: 'Interest',
        value: Math.max(0, calculations.totalInterest),
        fill: 'oklch(0.65 0.25 320)',
      },
    ];
    if (calculations.cmhcPremium > 0) {
      items.push({
        name: 'CMHC Insurance',
        value: calculations.cmhcPremium,
        fill: 'oklch(0.72 0.15 25)',
      });
    }
    return items;
  }, [calculations]);

  // Input handler with validation
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
            <Calculator className="size-3" />
            Interactive Calculator
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Mortgage &amp; Affordability{' '}
            <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Estimate your monthly payments, CMHC insurance, stress test
            qualification, and land transfer taxes — all based on 2026 Canadian
            rules.
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
                  <Home className="size-5 text-chart-1" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Purchase price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Purchase Price</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="price"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={purchasePrice.toLocaleString('en-CA')}
                      onChange={(e) => handleNumericInput(e.target.value, 0, 10_000_000, setPurchasePrice)}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Typical range: $100K - $2M
                  </p>
                </div>

                {/* Down payment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Down Payment</Label>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-chart-1 h-auto px-2 py-1 text-xs"
                      onClick={() =>
                        setDownPaymentMode((m) =>
                          m === 'percent' ? 'dollar' : 'percent',
                        )
                      }
                    >
                      Switch to{' '}
                      {downPaymentMode === 'percent' ? '$' : '%'}
                    </Button>
                  </div>
                  {downPaymentMode === 'percent' ? (
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={downPaymentPct}
                        onChange={(e) => handleNumericInput(e.target.value, 0, 100, setDownPaymentPct)}
                      />
                      <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                    </div>
                  ) : (
                    <div className="relative">
                      <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        type="text"
                        inputMode="numeric"
                        className="pl-9"
                        value={downPaymentDollar.toLocaleString('en-CA')}
                        onChange={(e) => handleNumericInput(e.target.value, 0, purchasePrice, setDownPaymentDollar)}
                      />
                    </div>
                  )}
                  {calculations.dpBelowMin && (
                    <p className="text-destructive text-xs font-medium">
                      Minimum down payment for this price is{' '}
                      {fmt(calculations.minDpAmount)} (
                      {calculations.minDpPct}%)
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    = {fmt(calculations.dpAmount)} (
                    {fmtPct(calculations.dpPct)})
                  </p>
                </div>

                {/* Interest rate */}
                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate</Label>
                  <div className="relative">
                    <Input
                      id="rate"
                      type="text"
                      inputMode="decimal"
                      value={interestRate}
                      onChange={(e) => handleNumericInput(e.target.value, 0, 15, setInterestRate)}
                    />
                    <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Typical range: 1% - 10%
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
                      disabled={calculations.dpPct < 20}
                    >
                      30 years
                    </Button>
                  </div>
                  {calculations.dpPct < 20 && amortization === 30 && (
                    <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
                      <Info className="mt-0.5 size-3 shrink-0" />
                      30-year amortization requires 20%+ down payment. Using 25
                      years.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* LTT Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="size-5 text-chart-2" />
                  Land Transfer Tax
                </CardTitle>
                <CardDescription>
                  Estimate based on province of purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="ftb"
                    className="cursor-pointer text-sm"
                  >
                    First-time buyer?
                  </Label>
                  <Button
                    id="ftb"
                    variant={firstTimeBuyer ? 'default' : 'outline'}
                    size="xs"
                    onClick={() => setFirstTimeBuyer((v) => !v)}
                  >
                    {firstTimeBuyer ? 'Yes' : 'No'}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Land Transfer Tax
                    </span>
                    <span className="font-medium">
                      {fmt(calculations.ltt.tax)}
                    </span>
                  </div>
                  {calculations.ltt.rebate > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>First-Time Buyer Rebate</span>
                      <span className="font-medium">
                        -{fmt(calculations.ltt.rebate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Net LTT Payable</span>
                    <span>{fmt(calculations.ltt.net)}</span>
                  </div>
                  {calculations.ltt.note && (
                    <p className="text-muted-foreground flex items-start gap-1.5 pt-1 text-xs">
                      <Info className="mt-0.5 size-3 shrink-0" />
                      {calculations.ltt.note}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT: Results                                                   */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            <Tabs defaultValue="results">
              <TabsList className="w-full">
                <TabsTrigger value="results" className="flex-1">
                  Results
                </TabsTrigger>
                <TabsTrigger value="breakdown" className="flex-1">
                  Cost Breakdown
                </TabsTrigger>
              </TabsList>

              {/* Results tab */}
              <TabsContent value="results" className="mt-6 space-y-4">
                {/* Monthly payment highlight */}
                <Card className="border-chart-1/20 bg-chart-1/5">
                  <CardContent className="flex flex-col items-center gap-1 py-2 text-center">
                    <p className="text-muted-foreground text-sm">
                      Estimated Monthly Payment
                    </p>
                    <p className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
                      {fmt(calculations.monthly)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      over {calculations.effectiveAmort} years at{' '}
                      {fmtPct(interestRate)}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultItem
                    icon={DollarSign}
                    label="Down Payment"
                    value={fmt(calculations.dpAmount)}
                    sublabel={`${fmtPct(calculations.dpPct)} of purchase price`}
                  />
                  <ResultItem
                    icon={Home}
                    label="Mortgage Amount"
                    value={fmt(calculations.mortgageBeforeInsurance)}
                    sublabel="Before CMHC insurance"
                  />
                  <ResultItem
                    icon={ShieldCheck}
                    label="CMHC Insurance"
                    value={fmt(calculations.cmhcPremium)}
                    sublabel={
                      calculations.cmhcRate > 0
                        ? `Premium rate: ${(calculations.cmhcRate * 100).toFixed(1)}%`
                        : 'Not required (20%+ down)'
                    }
                    highlight={calculations.cmhcPremium > 0}
                  />
                  <ResultItem
                    icon={Calculator}
                    label="Total Mortgage"
                    value={fmt(calculations.totalMortgage)}
                    sublabel="Mortgage + CMHC premium"
                  />
                </div>

                {/* Stress test */}
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
                        You would need to qualify at{' '}
                        <span className="text-foreground font-semibold">
                          {fmtPct(calculations.stressRate)}
                        </span>{' '}
                        (contract rate + 2% or 5.25%, whichever is higher).
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Stress test monthly payment:{' '}
                        {fmt(calculations.stressMonthly)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Totals */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultItem
                    icon={TrendingUp}
                    label="Total Interest Paid"
                    value={fmt(calculations.totalInterest)}
                    sublabel={`Over ${calculations.effectiveAmort} years`}
                  />
                  <ResultItem
                    icon={DollarSign}
                    label="Total Cost of Home"
                    value={fmt(calculations.totalCost)}
                    sublabel="Purchase + interest + CMHC"
                    highlight
                  />
                </div>
              </TabsContent>

              {/* Breakdown tab */}
              <TabsContent value="breakdown" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Breakdown</CardTitle>
                    <CardDescription>
                      How your total payments are split between principal,
                      interest, and insurance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72 w-full sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="45%"
                            outerRadius="75%"
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={index} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                          <Legend
                            verticalAlign="bottom"
                            formatter={(value: string) => (
                              <span className="text-foreground text-sm">
                                {value}
                              </span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed breakdown table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Cost Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        label: 'Purchase Price',
                        value: fmt(calculations.price),
                      },
                      {
                        label: 'Down Payment',
                        value: `-${fmt(calculations.dpAmount)}`,
                      },
                      {
                        label: 'Base Mortgage',
                        value: fmt(calculations.mortgageBeforeInsurance),
                      },
                      {
                        label: `CMHC Insurance (${(calculations.cmhcRate * 100).toFixed(1)}%)`,
                        value: fmt(calculations.cmhcPremium),
                      },
                      {
                        label: 'Total Mortgage',
                        value: fmt(calculations.totalMortgage),
                        bold: true,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex items-center justify-between text-sm',
                          row.bold && 'border-t pt-3 font-semibold',
                        )}
                      >
                        <span className="text-muted-foreground">
                          {row.label}
                        </span>
                        <span>{row.value}</span>
                      </div>
                    ))}

                    <Separator className="my-2" />

                    {[
                      {
                        label: `Monthly Payment`,
                        value: fmt(calculations.monthly),
                      },
                      {
                        label: `Total Payments (${calculations.effectiveAmort}yr)`,
                        value: fmt(calculations.totalPaid),
                      },
                      {
                        label: 'Total Interest Paid',
                        value: fmt(calculations.totalInterest),
                      },
                      {
                        label: 'Land Transfer Tax',
                        value: fmt(calculations.ltt.net),
                      },
                      {
                        label: 'Total Cost of Home',
                        value: fmt(calculations.totalCost),
                        bold: true,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex items-center justify-between text-sm',
                          row.bold && 'border-t pt-3 font-semibold',
                        )}
                      >
                        <span className="text-muted-foreground">
                          {row.label}
                        </span>
                        <span>{row.value}</span>
                      </div>
                    ))}
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
