'use client';

import { useMemo, useState } from 'react';

import {
  ArrowLeftRight,
  BarChart3,
  DollarSign,
  Home,
  Info,
  Percent,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
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

// Canadian semi-annual compounding
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

function cmhcRate(downPct: number): number {
  if (downPct >= 20) return 0;
  if (downPct >= 15) return 0.028;
  if (downPct >= 10) return 0.031;
  return 0.04;
}

// Numeric input handler
function handleNumericInput(
  raw: string,
  min: number,
  max: number,
  setter: (v: number) => void,
) {
  const v = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (!isNaN(v)) setter(clamp(v, min, max));
  else if (raw === '') setter(0);
}

// ---------------------------------------------------------------------------
// Chart tooltip
// ---------------------------------------------------------------------------

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      {label && <p className="text-muted-foreground mb-1 text-xs">{label}</p>}
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

// ===========================================================================
// TAB 1: Rent vs. Buy
// ===========================================================================

function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(2_200);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [purchasePrice, setPurchasePrice] = useState(500_000);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [mortgageRate, setMortgageRate] = useState(4.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [insurance, setInsurance] = useState(2_000);
  const [condoFees, setCondoFees] = useState(0);
  const [appreciation, setAppreciation] = useState(3);
  const [investReturn, setInvestReturn] = useState(6);
  const [timeHorizon, setTimeHorizon] = useState(10);

  const calculations = useMemo(() => {
    const price = clamp(purchasePrice, 0, 10_000_000);
    const dp = clamp(downPaymentPct, 5, 100);
    const dpAmount = price * (dp / 100);
    const mortgageBeforeInsurance = price - dpAmount;
    const cmhc = cmhcRate(dp);
    const cmhcPremium = mortgageBeforeInsurance * cmhc;
    const totalMortgage = mortgageBeforeInsurance + cmhcPremium;
    const rate = clamp(mortgageRate, 0.1, 15);
    const amort = dp < 20 ? 25 : 25;
    const monthlyMortgagePayment = monthlyPayment(totalMortgage, rate, amort);

    const years = clamp(timeHorizon, 1, 30);
    const rentInc = clamp(rentIncrease, 0, 10) / 100;
    const appRate = clamp(appreciation, -5, 15) / 100;
    const invRate = clamp(investReturn, 0, 20) / 100;
    const propTax = clamp(propertyTaxRate, 0, 5) / 100;
    const maintRate = clamp(maintenanceRate, 0, 5) / 100;

    // Year-by-year
    const chartData: { year: number; rentWealth: number; buyWealth: number }[] = [];

    let rentTotalSpent = 0;
    let rentInvestmentBalance = dpAmount; // renter invests the down payment
    let currentRent = clamp(monthlyRent, 0, 50_000);

    let buyTotalSpent = dpAmount + cmhcPremium;
    let mortgageBalance = totalMortgage;
    let homeValue = price;

    // Monthly mortgage rate for balance tracking
    const semiAnnual = rate / 100 / 2;
    const effMonthly = Math.pow(1 + semiAnnual, 1 / 6) - 1;

    let crossoverYear = -1;

    for (let y = 1; y <= years; y++) {
      // RENTING: 12 months of rent
      for (let m = 0; m < 12; m++) {
        rentTotalSpent += currentRent;
        // Invest savings (difference between buy costs and rent)
        const buyCostsThisMonth =
          monthlyMortgagePayment +
          (homeValue * propTax) / 12 +
          (homeValue * maintRate) / 12 +
          insurance / 12 +
          condoFees;
        const savedThisMonth = Math.max(0, buyCostsThisMonth - currentRent);
        rentInvestmentBalance =
          rentInvestmentBalance * (1 + invRate / 12) + savedThisMonth;
      }
      // Rent increase at year end
      currentRent = currentRent * (1 + rentInc);

      // BUYING: Mortgage payments, build equity
      for (let m = 0; m < 12; m++) {
        const interestThisMonth = mortgageBalance * effMonthly;
        const principalThisMonth = Math.min(
          monthlyMortgagePayment - interestThisMonth,
          mortgageBalance,
        );
        mortgageBalance = Math.max(0, mortgageBalance - principalThisMonth);
        buyTotalSpent +=
          monthlyMortgagePayment +
          (homeValue * propTax) / 12 +
          (homeValue * maintRate) / 12 +
          insurance / 12 +
          condoFees;
      }
      // Home appreciation at year end
      homeValue = homeValue * (1 + appRate);

      const rentWealth = rentInvestmentBalance;
      const buyWealth = homeValue - mortgageBalance;

      if (crossoverYear === -1 && buyWealth >= rentWealth) {
        crossoverYear = y;
      }

      chartData.push({
        year: y,
        rentWealth: Math.round(rentWealth),
        buyWealth: Math.round(buyWealth),
      });
    }

    const finalRentWealth = rentInvestmentBalance;
    const finalBuyWealth = homeValue - mortgageBalance;

    return {
      chartData,
      finalRentWealth,
      finalBuyWealth,
      buyingIsBetter: finalBuyWealth > finalRentWealth,
      crossoverYear,
      monthlyMortgagePayment,
      homeValueAtEnd: homeValue,
      mortgageBalanceAtEnd: mortgageBalance,
      equityAtEnd: homeValue - mortgageBalance,
    };
  }, [
    monthlyRent,
    rentIncrease,
    purchasePrice,
    downPaymentPct,
    mortgageRate,
    propertyTaxRate,
    maintenanceRate,
    insurance,
    condoFees,
    appreciation,
    investReturn,
    timeHorizon,
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      {/* Inputs */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="size-5 text-chart-1" />
              Scenario Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Monthly Rent</Label>
              <div className="relative">
                <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={monthlyRent.toLocaleString('en-CA')}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0, 50_000, setMonthlyRent)
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Annual Rent Increase</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={rentIncrease}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 0, 10, setRentIncrease)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Time Horizon (years)</Label>
                <Select
                  value={String(timeHorizon)}
                  onValueChange={(v) => setTimeHorizon(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Purchase Price</Label>
              <div className="relative">
                <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={purchasePrice.toLocaleString('en-CA')}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0, 10_000_000, setPurchasePrice)
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Down Payment (%)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={downPaymentPct}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 5, 100, setDownPaymentPct)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mortgage Rate</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={mortgageRate}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 0.1, 15, setMortgageRate)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Property Tax (%/yr)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={propertyTaxRate}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 0, 5, setPropertyTaxRate)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Maintenance (%/yr)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={maintenanceRate}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 0, 5, setMaintenanceRate)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Home Insurance ($/yr)</Label>
                <div className="relative">
                  <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    type="text"
                    inputMode="numeric"
                    className="pl-9"
                    value={insurance.toLocaleString('en-CA')}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 0, 10_000, setInsurance)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Condo Fees ($/mo)</Label>
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
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Home Appreciation (%/yr)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={appreciation}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, -5, 15, setAppreciation)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Investment Return (%/yr)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={investReturn}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 0, 20, setInvestReturn)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Verdict */}
        <Card className="border-chart-1/20 bg-chart-1/5">
          <CardContent className="flex flex-col items-center gap-2 py-2 text-center">
            <p className="text-gradient text-2xl font-bold tracking-tight md:text-3xl">
              {calculations.buyingIsBetter
                ? 'Buying builds more wealth'
                : 'Renting + investing wins'}
            </p>
            <p className="text-muted-foreground text-sm">
              After {timeHorizon} years: Buying net worth{' '}
              <span className="text-foreground font-semibold">
                {fmt(calculations.finalBuyWealth)}
              </span>{' '}
              vs. Renting net worth{' '}
              <span className="text-foreground font-semibold">
                {fmt(calculations.finalRentWealth)}
              </span>
            </p>
            {calculations.crossoverYear > 0 && (
              <p className="text-muted-foreground text-xs">
                Buying becomes wealthier than renting after{' '}
                <span className="text-foreground font-semibold">
                  {calculations.crossoverYear}
                </span>{' '}
                {calculations.crossoverYear === 1 ? 'year' : 'years'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cumulative Wealth Over Time</CardTitle>
            <CardDescription>
              Net equity (buying) vs. investment portfolio (renting)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={calculations.chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="year"
                    className="text-xs"
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                    label={{
                      value: 'Years',
                      position: 'insideBottom',
                      offset: -2,
                      fill: 'var(--color-muted-foreground)',
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                    tickFormatter={(v: number) =>
                      `$${(v / 1000).toFixed(0)}K`
                    }
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend
                    formatter={(value: string) => (
                      <span className="text-foreground text-sm">{value}</span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="buyWealth"
                    name="Buying (equity)"
                    stroke="oklch(0.58 0.2 285)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rentWealth"
                    name="Renting (investments)"
                    stroke="oklch(0.65 0.25 320)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <ResultItem
            icon={Home}
            label="Home Value (end)"
            value={fmt(calculations.homeValueAtEnd)}
            sublabel={`Equity: ${fmt(calculations.equityAtEnd)}`}
            highlight={calculations.buyingIsBetter}
          />
          <ResultItem
            icon={TrendingUp}
            label="Investment Portfolio (end)"
            value={fmt(calculations.finalRentWealth)}
            sublabel="Down payment + monthly savings invested"
            highlight={!calculations.buyingIsBetter}
          />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 2: FHSA vs. RRSP/HBP
// ===========================================================================

function FhsaVsRrspCalculator() {
  const [annualIncome, setAnnualIncome] = useState(80_000);
  const [annualContribution, setAnnualContribution] = useState(8_000);
  const [yearsUntilPurchase, setYearsUntilPurchase] = useState(5);
  const [investmentReturn, setInvestmentReturn] = useState(5);

  // Federal marginal tax rate calculation
  function federalMarginalRate(income: number): number {
    if (income <= 57_375) return 15;
    if (income <= 114_750) return 20.5;
    if (income <= 158_468) return 26;
    if (income <= 220_000) return 29;
    return 33;
  }

  // Approximate combined (federal + provincial average) marginal rate
  function combinedMarginalRate(income: number): number {
    const federal = federalMarginalRate(income);
    // Rough provincial addition (average across provinces)
    const provincialAdd =
      income <= 50_000 ? 8 :
      income <= 100_000 ? 11 :
      income <= 150_000 ? 13 :
      income <= 200_000 ? 15 : 17;
    return federal + provincialAdd;
  }

  const calculations = useMemo(() => {
    const income = clamp(annualIncome, 0, 500_000);
    const contribution = clamp(annualContribution, 0, 50_000);
    const years = clamp(yearsUntilPurchase, 1, 15);
    const returnRate = clamp(investmentReturn, 0, 15) / 100;
    const marginalRate = combinedMarginalRate(income) / 100;

    // FHSA: max $8K/yr, $40K lifetime, tax-deductible contributions, tax-free withdrawals
    const fhsaAnnualMax = 8_000;
    const fhsaLifetimeMax = 40_000;
    const fhsaAnnualContrib = Math.min(contribution, fhsaAnnualMax);
    let fhsaBalance = 0;
    let fhsaTotalContrib = 0;
    let fhsaTotalTaxSavings = 0;

    for (let y = 0; y < years; y++) {
      const canContribute = Math.min(
        fhsaAnnualContrib,
        fhsaLifetimeMax - fhsaTotalContrib,
      );
      fhsaBalance = (fhsaBalance + canContribute) * (1 + returnRate);
      fhsaTotalContrib += canContribute;
      fhsaTotalTaxSavings += canContribute * marginalRate;
    }
    const fhsaWithdrawalTax = 0;
    const fhsaNetForHome = fhsaBalance;

    // RRSP/HBP: tax-deductible, max $60K HBP withdrawal, must repay over 15 years
    const rrspAnnualContrib = contribution; // no annual cap relevant here for our purposes
    const hbpMax = 60_000;
    let rrspBalance = 0;
    let rrspTotalContrib = 0;
    let rrspTotalTaxSavings = 0;

    for (let y = 0; y < years; y++) {
      rrspBalance = (rrspBalance + rrspAnnualContrib) * (1 + returnRate);
      rrspTotalContrib += rrspAnnualContrib;
      rrspTotalTaxSavings += rrspAnnualContrib * marginalRate;
    }
    const hbpWithdrawal = Math.min(rrspBalance, hbpMax);
    const hbpRepaymentPerYear = hbpWithdrawal / 15;
    const rrspNetForHome = hbpWithdrawal; // no tax on HBP withdrawal

    // Combined strategy: FHSA first (max it out), then RRSP with remaining
    let comboFhsaBalance = 0;
    let comboRrspBalance = 0;
    let comboFhsaContrib = 0;
    let comboTotalTaxSavings = 0;

    for (let y = 0; y < years; y++) {
      const fhsaCan = Math.min(
        fhsaAnnualMax,
        fhsaLifetimeMax - comboFhsaContrib,
      );
      const toFhsa = Math.min(contribution, fhsaCan);
      const toRrsp = Math.max(0, contribution - toFhsa);

      comboFhsaBalance = (comboFhsaBalance + toFhsa) * (1 + returnRate);
      comboRrspBalance = (comboRrspBalance + toRrsp) * (1 + returnRate);
      comboFhsaContrib += toFhsa;
      comboTotalTaxSavings += (toFhsa + toRrsp) * marginalRate;
    }
    const comboHbp = Math.min(comboRrspBalance, hbpMax);
    const comboNetForHome = comboFhsaBalance + comboHbp;
    const comboRepayment = comboHbp / 15;

    return {
      marginalRate: marginalRate * 100,

      fhsaTotalContrib,
      fhsaBalance,
      fhsaTotalTaxSavings,
      fhsaNetForHome,

      rrspTotalContrib,
      rrspBalance,
      rrspTotalTaxSavings,
      hbpWithdrawal,
      hbpRepaymentPerYear,
      rrspNetForHome,

      comboFhsaBalance,
      comboRrspBalance: comboHbp,
      comboNetForHome,
      comboTotalTaxSavings,
      comboRepayment,

      bestStrategy:
        comboNetForHome >= fhsaNetForHome && comboNetForHome >= rrspNetForHome
          ? 'combined'
          : fhsaNetForHome >= rrspNetForHome
            ? 'fhsa'
            : 'rrsp',
    };
  }, [annualIncome, annualContribution, yearsUntilPurchase, investmentReturn]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      {/* Inputs */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PiggyBank className="size-5 text-chart-1" />
              Your Savings Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Annual Income</Label>
              <div className="relative">
                <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={annualIncome.toLocaleString('en-CA')}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0, 500_000, setAnnualIncome)
                  }
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Estimated marginal tax rate:{' '}
                {fmtPct(calculations.marginalRate)}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Annual Contribution</Label>
              <div className="relative">
                <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={annualContribution.toLocaleString('en-CA')}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0, 50_000, setAnnualContribution)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Years Until Purchase</Label>
              <Select
                value={String(yearsUntilPurchase)}
                onValueChange={(v) => setYearsUntilPurchase(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y} {y === 1 ? 'year' : 'years'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expected Investment Return</Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={investmentReturn}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0, 15, setInvestmentReturn)
                  }
                />
                <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Best strategy callout */}
        <Card className="border-chart-1/20 bg-chart-1/5">
          <CardContent className="flex flex-col items-center gap-2 py-2 text-center">
            <p className="text-muted-foreground text-sm">Best Strategy</p>
            <p className="text-gradient text-2xl font-bold tracking-tight md:text-3xl">
              {calculations.bestStrategy === 'combined'
                ? 'Use FHSA + RRSP/HBP together'
                : calculations.bestStrategy === 'fhsa'
                  ? 'FHSA gives you the most'
                  : 'RRSP/HBP gives you the most'}
            </p>
            <p className="text-muted-foreground text-sm">
              Maximum available for your home:{' '}
              <span className="text-foreground font-bold">
                {fmt(
                  Math.max(
                    calculations.fhsaNetForHome,
                    calculations.rrspNetForHome,
                    calculations.comboNetForHome,
                  ),
                )}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Side-by-side comparison */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* FHSA */}
          <Card
            className={cn(
              calculations.bestStrategy === 'fhsa' &&
                'border-chart-1/30 ring-chart-1/20 ring-2',
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">FHSA</CardTitle>
              <CardDescription>
                Tax-free savings account for first home
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contributed</span>
                <span className="font-medium">
                  {fmt(calculations.fhsaTotalContrib)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-medium">
                  {fmt(calculations.fhsaBalance)}
                </span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Tax savings</span>
                <span className="font-medium">
                  {fmt(calculations.fhsaTotalTaxSavings)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>For home</span>
                <span>{fmt(calculations.fhsaNetForHome)}</span>
              </div>
              <p className="text-muted-foreground text-xs">
                Tax on withdrawal: $0
              </p>
            </CardContent>
          </Card>

          {/* RRSP/HBP */}
          <Card
            className={cn(
              calculations.bestStrategy === 'rrsp' &&
                'border-chart-1/30 ring-chart-1/20 ring-2',
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">RRSP / HBP</CardTitle>
              <CardDescription>
                Home Buyers&apos; Plan withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contributed</span>
                <span className="font-medium">
                  {fmt(calculations.rrspTotalContrib)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-medium">
                  {fmt(calculations.rrspBalance)}
                </span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Tax savings</span>
                <span className="font-medium">
                  {fmt(calculations.rrspTotalTaxSavings)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>HBP withdrawal</span>
                <span>{fmt(calculations.hbpWithdrawal)}</span>
              </div>
              <p className="text-muted-foreground text-xs">
                Repay {fmt(calculations.hbpRepaymentPerYear)}/yr over 15 yrs
              </p>
            </CardContent>
          </Card>

          {/* Combined */}
          <Card
            className={cn(
              calculations.bestStrategy === 'combined' &&
                'border-chart-1/30 ring-chart-1/20 ring-2',
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">Combined</CardTitle>
              <CardDescription>FHSA first, then RRSP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">FHSA balance</span>
                <span className="font-medium">
                  {fmt(calculations.comboFhsaBalance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HBP withdrawal</span>
                <span className="font-medium">
                  {fmt(calculations.comboRrspBalance)}
                </span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Tax savings</span>
                <span className="font-medium">
                  {fmt(calculations.comboTotalTaxSavings)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total for home</span>
                <span>{fmt(calculations.comboNetForHome)}</span>
              </div>
              {calculations.comboRepayment > 0 && (
                <p className="text-muted-foreground text-xs">
                  HBP repay: {fmt(calculations.comboRepayment)}/yr
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="flex items-start gap-3 py-1">
            <div className="bg-chart-2/15 text-chart-2 flex size-9 shrink-0 items-center justify-center rounded-md">
              <Info className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">How this works</p>
              <p className="text-muted-foreground mt-0.5 text-sm">
                The FHSA allows up to $8,000/year ($40,000 lifetime) in
                tax-deductible contributions with tax-free withdrawals for
                your first home. The RRSP Home Buyers&apos; Plan allows
                withdrawing up to $60,000 tax-free, but you must repay it over
                15 years. The optimal strategy uses FHSA first (no repayment)
                then RRSP/HBP for additional savings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 3: Fixed vs. Variable
// ===========================================================================

function FixedVsVariableCalculator() {
  const [mortgageAmount, setMortgageAmount] = useState(400_000);
  const [fixedRate, setFixedRate] = useState(4.5);
  const [variableRate, setVariableRate] = useState(3.8);
  const [term, setTerm] = useState(5);
  const [amortization, setAmortization] = useState(25);

  const calculations = useMemo(() => {
    const principal = clamp(mortgageAmount, 0, 5_000_000);
    const fixed = clamp(fixedRate, 0.1, 15);
    const variable = clamp(variableRate, 0.1, 15);
    const termYrs = clamp(term, 1, 5);
    const amort = amortization;

    const fixedMonthly = monthlyPayment(principal, fixed, amort);
    const variableMonthly = monthlyPayment(principal, variable, amort);

    // Calculate total interest for each over the term
    function totalInterestOverTerm(
      principal: number,
      annualRate: number,
      amortYears: number,
      termYears: number,
    ): { totalInterest: number; endingBalance: number } {
      const semiAnnual = annualRate / 100 / 2;
      const effMonthly = Math.pow(1 + semiAnnual, 1 / 6) - 1;
      const payment = monthlyPayment(principal, annualRate, amortYears);
      let balance = principal;
      let totalInterest = 0;

      for (let m = 0; m < termYears * 12; m++) {
        const interest = balance * effMonthly;
        const princPaid = payment - interest;
        totalInterest += interest;
        balance = Math.max(0, balance - princPaid);
      }
      return { totalInterest, endingBalance: balance };
    }

    const fixedResult = totalInterestOverTerm(principal, fixed, amort, termYrs);
    const variableResult = totalInterestOverTerm(
      principal,
      variable,
      amort,
      termYrs,
    );

    const monthlySavings = fixedMonthly - variableMonthly;
    const totalSavings = fixedResult.totalInterest - variableResult.totalInterest;

    // Break-even: how much does variable need to rise for fixed to be cheaper?
    // Binary search for the rate where total interest equals fixed total interest
    let beLo = variable;
    let beHi = fixed + 5;
    for (let i = 0; i < 50; i++) {
      const mid = (beLo + beHi) / 2;
      const midResult = totalInterestOverTerm(principal, mid, amort, termYrs);
      if (midResult.totalInterest < fixedResult.totalInterest) {
        beLo = mid;
      } else {
        beHi = mid;
      }
    }
    const breakEvenRate = (beLo + beHi) / 2;

    // Scenarios chart data
    const scenarios = [-1, -0.5, 0, 0.5, 1, 1.5, 2].map((change) => {
      const scenarioRate = Math.max(0.1, variable + change);
      const scenResult = totalInterestOverTerm(
        principal,
        scenarioRate,
        amort,
        termYrs,
      );
      return {
        scenario: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        variableCost: Math.round(scenResult.totalInterest),
        fixedCost: Math.round(fixedResult.totalInterest),
        rate: scenarioRate,
      };
    });

    return {
      fixedMonthly,
      variableMonthly,
      fixedTotalInterest: fixedResult.totalInterest,
      variableTotalInterest: variableResult.totalInterest,
      monthlySavings,
      totalSavings,
      breakEvenRate,
      breakEvenIncrease: breakEvenRate - variable,
      scenarios,
      variableIsCheaper: variableResult.totalInterest < fixedResult.totalInterest,
    };
  }, [mortgageAmount, fixedRate, variableRate, term, amortization]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      {/* Inputs */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="size-5 text-chart-1" />
              Mortgage Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mortgage Amount</Label>
              <div className="relative">
                <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={mortgageAmount.toLocaleString('en-CA')}
                  onChange={(e) =>
                    handleNumericInput(
                      e.target.value,
                      0,
                      5_000_000,
                      setMortgageAmount,
                    )
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Fixed Rate</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={fixedRate}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, 0.1, 15, setFixedRate)
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Variable Rate</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={variableRate}
                    onChange={(e) =>
                      handleNumericInput(
                        e.target.value,
                        0.1,
                        15,
                        setVariableRate,
                      )
                    }
                  />
                  <Percent className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Term</Label>
                <Select
                  value={String(term)}
                  onValueChange={(v) => setTerm(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y} {y === 1 ? 'year' : 'years'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amortization</Label>
                <div className="flex gap-2">
                  <Button
                    variant={amortization === 25 ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAmortization(25)}
                  >
                    25 yr
                  </Button>
                  <Button
                    variant={amortization === 30 ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAmortization(30)}
                  >
                    30 yr
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Verdict */}
        <Card className="border-chart-1/20 bg-chart-1/5">
          <CardContent className="flex flex-col items-center gap-2 py-2 text-center">
            <p className="text-gradient text-2xl font-bold tracking-tight md:text-3xl">
              {calculations.variableIsCheaper
                ? `Variable saves ${fmt(calculations.totalSavings)}`
                : `Fixed saves ${fmt(Math.abs(calculations.totalSavings))}`}
            </p>
            <p className="text-muted-foreground text-sm">
              Over the {term}-year term at current rates
            </p>
            <p className="text-muted-foreground text-xs">
              Variable would need to rise by{' '}
              <span className="text-foreground font-semibold">
                {fmtPct(calculations.breakEvenIncrease)}
              </span>{' '}
              (to {fmtPct(calculations.breakEvenRate)}) before fixed becomes
              cheaper
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <ResultItem
            icon={DollarSign}
            label="Fixed Monthly Payment"
            value={fmtDetailed(calculations.fixedMonthly)}
            sublabel={`Total interest: ${fmt(calculations.fixedTotalInterest)}`}
            highlight={!calculations.variableIsCheaper}
          />
          <ResultItem
            icon={DollarSign}
            label="Variable Monthly Payment"
            value={fmtDetailed(calculations.variableMonthly)}
            sublabel={`Total interest: ${fmt(calculations.variableTotalInterest)}`}
            highlight={calculations.variableIsCheaper}
          />
        </div>

        {/* Scenario chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rate Change Scenarios</CardTitle>
            <CardDescription>
              Total interest over {term}-year term if variable rate changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={calculations.scenarios}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="scenario"
                    className="text-xs"
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                    label={{
                      value: 'Rate change from current variable',
                      position: 'insideBottom',
                      offset: -2,
                      fill: 'var(--color-muted-foreground)',
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                    tickFormatter={(v: number) =>
                      `$${(v / 1000).toFixed(0)}K`
                    }
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend
                    formatter={(value: string) => (
                      <span className="text-foreground text-sm">{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="fixedCost"
                    name="Fixed interest"
                    fill="oklch(0.58 0.2 285)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="variableCost"
                    name="Variable interest"
                    fill="oklch(0.65 0.25 320)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-3 py-1">
            <div className="bg-chart-2/15 text-chart-2 flex size-9 shrink-0 items-center justify-center rounded-md">
              <Info className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Important Note</p>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Variable rates can change at any time during your term.
                This comparison assumes rates stay constant for simplicity.
                In practice, variable rates move with the Bank of Canada
                overnight rate, typically changing 0-8 times per year.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===========================================================================
// Main Comparison Tools Component (Tabbed)
// ===========================================================================

export default function ComparisonTools() {
  return (
    <section className="section-padding">
      <div className="container max-w-screen-xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-3 md:mb-14">
          <Badge variant="outline" className="gap-1.5">
            <ArrowLeftRight className="size-3" />
            Comparison Tools
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Compare your{' '}
            <span className="text-gradient">options</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Side-by-side comparisons to help you make the best financial
            decisions for your first home purchase.
          </p>
        </div>

        <Tabs defaultValue="rent-vs-buy">
          <TabsList className="w-full">
            <TabsTrigger value="rent-vs-buy" className="flex-1">
              Rent vs. Buy
            </TabsTrigger>
            <TabsTrigger value="fhsa-vs-rrsp" className="flex-1">
              FHSA vs. RRSP
            </TabsTrigger>
            <TabsTrigger value="fixed-vs-variable" className="flex-1">
              Fixed vs. Variable
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rent-vs-buy" className="mt-8">
            <RentVsBuyCalculator />
          </TabsContent>

          <TabsContent value="fhsa-vs-rrsp" className="mt-8">
            <FhsaVsRrspCalculator />
          </TabsContent>

          <TabsContent value="fixed-vs-variable" className="mt-8">
            <FixedVsVariableCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
