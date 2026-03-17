'use client';

import { useMemo, useState } from 'react';

import {
  ArrowRight,
  Calculator,
  Clock,
  DollarSign,
  Home,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
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

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// CMHC Insurance (Canadian rules)
// ---------------------------------------------------------------------------

/** CMHC premium rate based on loan-to-value ratio. */
function cmhcRate(downPct: number): number {
  if (downPct >= 20) return 0;
  if (downPct >= 15) return 0.028;
  if (downPct >= 10) return 0.031;
  return 0.04; // 5-9.99%
}

/** CMHC premium in dollars for a given purchase price and down payment %. */
function cmhcPremium(price: number, downPct: number): number {
  const mortgage = price * (1 - downPct / 100);
  return mortgage * cmhcRate(downPct);
}

// ---------------------------------------------------------------------------
// Canadian mortgage: semi-annual compounding, monthly payments
// ---------------------------------------------------------------------------

function totalInterestPaid(
  principal: number,
  annualRate: number,
  amortYears: number,
): number {
  if (principal <= 0 || annualRate <= 0) return 0;
  const semiAnnual = annualRate / 100 / 2;
  const effectiveMonthly = Math.pow(1 + semiAnnual, 1 / 6) - 1;
  const n = amortYears * 12;
  if (effectiveMonthly === 0) return 0;
  const monthlyPmt =
    (principal * effectiveMonthly * Math.pow(1 + effectiveMonthly, n)) /
    (Math.pow(1 + effectiveMonthly, n) - 1);
  return monthlyPmt * n - principal;
}

// ---------------------------------------------------------------------------
// Delay period definitions
// ---------------------------------------------------------------------------

interface DelayPeriod {
  key: string;
  label: string;
  months: number;
}

const DELAY_PERIODS: DelayPeriod[] = [
  { key: '6mo', label: '6 mo', months: 6 },
  { key: '1yr', label: '1 yr', months: 12 },
  { key: '2yr', label: '2 yr', months: 24 },
  { key: '3yr', label: '3 yr', months: 36 },
  { key: '5yr', label: '5 yr', months: 60 },
];

// ---------------------------------------------------------------------------
// Cost-of-waiting snapshot for a single delay period
// ---------------------------------------------------------------------------

interface WaitingCost {
  months: number;
  label: string;
  futurePrice: number;
  priceIncrease: number;
  rentPaid: number;
  downPaymentNow: number;
  downPaymentFuture: number;
  downPaymentIncrease: number;
  cmhcNow: number;
  cmhcFuture: number;
  additionalCmhc: number;
  interestNow: number;
  interestFuture: number;
  additionalInterest: number;
  totalCost: number;
}

function calcWaitingCost(
  currentPrice: number,
  appreciationRate: number,
  monthlyRent: number,
  annualRentIncrease: number,
  mortgageRate: number,
  downPct: number,
  months: number,
  label: string,
): WaitingCost {
  const years = months / 12;

  // Future home price with compound appreciation
  const futurePrice = currentPrice * Math.pow(1 + appreciationRate / 100, years);
  const priceIncrease = futurePrice - currentPrice;

  // Rent paid while waiting (with annual increases applied month-by-month)
  let rentPaid = 0;
  for (let m = 0; m < months; m++) {
    const yearIndex = Math.floor(m / 12);
    const adjustedRent =
      monthlyRent * Math.pow(1 + annualRentIncrease / 100, yearIndex);
    rentPaid += adjustedRent;
  }

  // Down payment amounts
  const downPaymentNow = currentPrice * (downPct / 100);
  const downPaymentFuture = futurePrice * (downPct / 100);
  const downPaymentIncrease = downPaymentFuture - downPaymentNow;

  // CMHC insurance
  const cmhcNow = cmhcPremium(currentPrice, downPct);
  const cmhcFuture = cmhcPremium(futurePrice, downPct);
  const additionalCmhc = cmhcFuture - cmhcNow;

  // Total mortgage principal (including CMHC, which is added to the mortgage)
  const mortgageNow =
    currentPrice * (1 - downPct / 100) + cmhcNow;
  const mortgageFuture =
    futurePrice * (1 - downPct / 100) + cmhcFuture;

  // Total interest over 25-year amortization
  const interestNow = totalInterestPaid(mortgageNow, mortgageRate, 25);
  const interestFuture = totalInterestPaid(mortgageFuture, mortgageRate, 25);
  const additionalInterest = interestFuture - interestNow;

  // Total cost of waiting
  const totalCost = priceIncrease + rentPaid + additionalInterest + additionalCmhc;

  return {
    months,
    label,
    futurePrice,
    priceIncrease,
    rentPaid,
    downPaymentNow,
    downPaymentFuture,
    downPaymentIncrease,
    cmhcNow,
    cmhcFuture,
    additionalCmhc,
    interestNow,
    interestFuture,
    additionalInterest,
    totalCost,
  };
}

// ---------------------------------------------------------------------------
// Monthly chart data point
// ---------------------------------------------------------------------------

interface ChartPoint {
  month: number;
  priceIncrease: number;
  rentPaid: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Custom chart tooltip
// ---------------------------------------------------------------------------

interface TooltipEntry {
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
  payload?: TooltipEntry[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="text-muted-foreground mb-1 text-xs font-medium">
        Month {label}
      </p>
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
// Summary stat card
// ---------------------------------------------------------------------------

function StatCard({
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

export default function CostOfWaiting() {
  // Inputs
  const [currentPrice, setCurrentPrice] = useState(500_000);
  const [appreciationRate, setAppreciationRate] = useState('5');
  const [monthlyRent, setMonthlyRent] = useState(2_000);
  const [annualRentIncrease, setAnnualRentIncrease] = useState('3');
  const [mortgageRate, setMortgageRate] = useState(5.0);
  const [downPct, setDownPct] = useState('10');

  // Selected delay tab
  const [selectedDelay, setSelectedDelay] = useState('1yr');

  // Parsed numeric values
  const appreciation = parseFloat(appreciationRate);
  const rentIncrease = parseFloat(annualRentIncrease);
  const downPayment = parseFloat(downPct);

  // Calculate cost for each delay period
  const delayCosts = useMemo(() => {
    return DELAY_PERIODS.map((period) =>
      calcWaitingCost(
        currentPrice,
        appreciation,
        monthlyRent,
        rentIncrease,
        mortgageRate,
        downPayment,
        period.months,
        period.label,
      ),
    );
  }, [currentPrice, appreciation, monthlyRent, rentIncrease, mortgageRate, downPayment]);

  // Find selected delay cost
  const selectedCost = useMemo(() => {
    const period = DELAY_PERIODS.find((p) => p.key === selectedDelay);
    if (!period) return delayCosts[1]; // default to 1yr
    return delayCosts[DELAY_PERIODS.indexOf(period)];
  }, [selectedDelay, delayCosts]);

  // Month-by-month chart data (up to 60 months)
  const chartData = useMemo((): ChartPoint[] => {
    const points: ChartPoint[] = [];
    for (let m = 0; m <= 60; m++) {
      const years = m / 12;
      const futurePrice =
        currentPrice * Math.pow(1 + appreciation / 100, years);
      const priceIncrease = futurePrice - currentPrice;

      let rentPaid = 0;
      for (let r = 0; r < m; r++) {
        const yearIndex = Math.floor(r / 12);
        const adjustedRent =
          monthlyRent * Math.pow(1 + rentIncrease / 100, yearIndex);
        rentPaid += adjustedRent;
      }

      points.push({
        month: m,
        priceIncrease: Math.round(priceIncrease),
        rentPaid: Math.round(rentPaid),
        total: Math.round(priceIncrease + rentPaid),
      });
    }
    return points;
  }, [currentPrice, appreciation, monthlyRent, rentIncrease]);

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
            <Clock className="size-3" />
            Interactive Calculator
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Cost of Waiting{' '}
            <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Every month you wait, the cost of buying your first home
            goes up. See exactly how much delaying could cost you — based
            on real Canadian market dynamics.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          {/* -------------------------------------------------------------- */}
          {/* LEFT: Inputs                                                    */}
          {/* -------------------------------------------------------------- */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="size-5 text-chart-1" />
                  Your Numbers
                </CardTitle>
                <CardDescription>
                  Adjust these inputs to match your situation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Current home price */}
                <div className="space-y-2">
                  <Label htmlFor="cow-price">Current Home Price</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="cow-price"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={currentPrice.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(
                          e.target.value,
                          50_000,
                          5_000_000,
                          setCurrentPrice,
                        )
                      }
                    />
                  </div>
                </div>

                {/* Appreciation rate */}
                <div className="space-y-2">
                  <Label>Annual Appreciation Rate</Label>
                  <Select
                    value={appreciationRate}
                    onValueChange={setAppreciationRate}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    Canadian home prices have averaged ~5% annually over
                    the past 20 years
                  </p>
                </div>

                <Separator />

                {/* Monthly rent */}
                <div className="space-y-2">
                  <Label htmlFor="cow-rent">Current Monthly Rent</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="cow-rent"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={monthlyRent.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(
                          e.target.value,
                          0,
                          10_000,
                          setMonthlyRent,
                        )
                      }
                    />
                  </div>
                </div>

                {/* Rent increase */}
                <div className="space-y-2">
                  <Label>Annual Rent Increase</Label>
                  <Select
                    value={annualRentIncrease}
                    onValueChange={setAnnualRentIncrease}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2%</SelectItem>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Mortgage rate */}
                <div className="space-y-2">
                  <Label htmlFor="cow-rate">Mortgage Interest Rate</Label>
                  <div className="relative">
                    <Input
                      id="cow-rate"
                      type="text"
                      inputMode="decimal"
                      value={mortgageRate}
                      onChange={(e) =>
                        handleNumericInput(
                          e.target.value,
                          0.5,
                          15,
                          setMortgageRate,
                        )
                      }
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                      %
                    </span>
                  </div>
                </div>

                {/* Down payment */}
                <div className="space-y-2">
                  <Label>Down Payment Percentage</Label>
                  <Select value={downPct} onValueChange={setDownPct}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    Down payments under 20% require CMHC mortgage
                    insurance
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* RIGHT: Results                                                  */}
          {/* -------------------------------------------------------------- */}
          <div className="space-y-6">
            {/* Delay period tabs */}
            <Tabs value={selectedDelay} onValueChange={setSelectedDelay}>
              <TabsList className="w-full">
                {DELAY_PERIODS.map((period) => (
                  <TabsTrigger
                    key={period.key}
                    value={period.key}
                    className="flex-1"
                  >
                    {period.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {DELAY_PERIODS.map((period, idx) => {
                const cost = delayCosts[idx];
                return (
                  <TabsContent
                    key={period.key}
                    value={period.key}
                    className="mt-6 space-y-4"
                  >
                    {/* Total cost highlight */}
                    <Card className="border-chart-1/20 bg-chart-1/5">
                      <CardContent className="flex flex-col items-center gap-1 py-2 text-center">
                        <p className="text-muted-foreground text-sm">
                          Total Cost of Waiting {period.label}
                        </p>
                        <p className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
                          {fmt(cost.totalCost)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          in lost equity, rent paid, and additional interest
                        </p>
                      </CardContent>
                    </Card>

                    {/* Summary stat cards */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <StatCard
                        icon={TrendingUp}
                        label="Home Price Increase"
                        value={fmt(cost.priceIncrease)}
                        sublabel={`${fmt(currentPrice)} → ${fmt(cost.futurePrice)}`}
                      />
                      <StatCard
                        icon={Home}
                        label="Rent Paid While Waiting"
                        value={fmt(cost.rentPaid)}
                        sublabel={`${period.months} months of rent (with ${annualRentIncrease}% annual increase)`}
                      />
                      <StatCard
                        icon={PiggyBank}
                        label="Additional Down Payment Needed"
                        value={fmt(cost.downPaymentIncrease)}
                        sublabel={`${fmt(cost.downPaymentNow)} → ${fmt(cost.downPaymentFuture)} at ${downPct}%`}
                      />
                      <StatCard
                        icon={DollarSign}
                        label="Additional Interest (25 yr)"
                        value={fmt(cost.additionalInterest + cost.additionalCmhc)}
                        sublabel="Extra interest and CMHC on the larger mortgage"
                        highlight
                      />
                    </div>

                    {/* Detailed breakdown */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Detailed Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[
                          {
                            label: 'Home price increase',
                            value: fmt(cost.priceIncrease),
                          },
                          {
                            label: 'Rent paid while waiting',
                            value: fmt(cost.rentPaid),
                          },
                          {
                            label: 'Additional CMHC insurance',
                            value: fmt(cost.additionalCmhc),
                          },
                          {
                            label: 'Additional mortgage interest (25 yr)',
                            value: fmt(cost.additionalInterest),
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {row.label}
                            </span>
                            <span className="font-medium">{row.value}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
                          <span>Total cost of waiting</span>
                          <span className="text-chart-1">
                            {fmt(cost.totalCost)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Area chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Cost of Waiting Over Time
                </CardTitle>
                <CardDescription>
                  Month-by-month breakdown of how costs accumulate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v: number) =>
                          v % 12 === 0 ? `${v / 12}yr` : ''
                        }
                        className="text-muted-foreground"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v: number) =>
                          `$${(v / 1000).toFixed(0)}k`
                        }
                        width={55}
                        className="text-muted-foreground"
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="priceIncrease"
                        name="Home Price Increase"
                        stackId="1"
                        stroke="var(--chart-1)"
                        fill="var(--chart-1)"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="rentPaid"
                        name="Rent Paid"
                        stackId="1"
                        stroke="var(--chart-2)"
                        fill="var(--chart-2)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{ background: 'var(--chart-1)' }}
                    />
                    <span className="text-muted-foreground">
                      Home Price Increase
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{ background: 'var(--chart-2)' }}
                    />
                    <span className="text-muted-foreground">Rent Paid</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What you could do instead */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calculator className="size-4 text-chart-2" />
                  What you could do instead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    {
                      text: 'Open an FHSA and save up to $8,000/year tax-free',
                      href: '/guide/2-saving-smart/1-fhsa/',
                    },
                    {
                      text: "Get pre-approved to lock in today's rates",
                      href: '/guide/3-down-payments-mortgages/5-pre-approval/',
                    },
                    {
                      text: 'Use our Affordability Calculator to find your number',
                      href: '/tools/affordability-calculator',
                    },
                  ].map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="group flex items-center gap-2 text-sm transition-colors"
                      >
                        <ArrowRight className="text-chart-1 size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        <span className="text-foreground underline underline-offset-4 group-hover:text-chart-1">
                          {item.text}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
