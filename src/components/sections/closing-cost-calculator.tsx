'use client';

import { useMemo, useState } from 'react';

import {
  Building,
  Calculator,
  DollarSign,
  FileText,
  Home,
  Info,
  MapPin,
  Truck,
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
import { Separator } from '@/components/ui/separator';
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

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

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

type PropertyType = 'detached' | 'semi' | 'townhouse' | 'condo';
type City = 'other' | 'toronto' | 'montreal';

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
// Land Transfer Tax by Province (reused from mortgage-calculator)
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
  return { tax, rebate, net: tax - rebate, note: '' };
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
  return { tax, rebate: Math.max(0, rebate), net: tax - Math.max(0, rebate), note: '' };
}

function calcManitobaLTT(price: number): LttResult {
  let tax = 0;
  if (price > 200_000) tax += (price - 200_000) * 0.02;
  const cap1 = Math.min(price, 200_000);
  if (cap1 > 150_000) tax += (cap1 - 150_000) * 0.015;
  const cap2 = Math.min(price, 150_000);
  if (cap2 > 90_000) tax += (cap2 - 90_000) * 0.01;
  const cap3 = Math.min(price, 90_000);
  if (cap3 > 30_000) tax += (cap3 - 30_000) * 0.005;
  return { tax, rebate: 0, net: tax, note: '' };
}

function calcQuebecLTT(price: number): LttResult {
  let tax = 0;
  if (price > 500_000) tax += (price - 500_000) * 0.03;
  const cap1 = Math.min(price, 500_000);
  if (cap1 > 294_600) tax += (cap1 - 294_600) * 0.015;
  const cap2 = Math.min(price, 294_600);
  if (cap2 > 58_900) tax += (cap2 - 58_900) * 0.01;
  tax += Math.min(price, 58_900) * 0.005;
  return { tax, rebate: 0, net: tax, note: '' };
}

function calcLTT(province: Province, price: number, firstTime: boolean): LttResult {
  switch (province) {
    case 'ON': return calcOntarioLTT(price, firstTime);
    case 'BC': return calcBCLTT(price, firstTime);
    case 'MB': return calcManitobaLTT(price);
    case 'QC': return calcQuebecLTT(price);
    case 'NB': return { tax: price * 0.01, rebate: 0, net: price * 0.01, note: '' };
    case 'PE': return { tax: price * 0.01, rebate: 0, net: price * 0.01, note: '' };
    case 'NL': return { tax: price * 0.004, rebate: 0, net: price * 0.004, note: '' };
    case 'AB': return { tax: 0, rebate: 0, net: 0, note: '' };
    case 'SK': return { tax: 0, rebate: 0, net: 0, note: '' };
    case 'NS': return { tax: 0, rebate: 0, net: 0, note: '' };
    default: return { tax: 0, rebate: 0, net: 0, note: '' };
  }
}

// ---------------------------------------------------------------------------
// Toronto Municipal LTT
// ---------------------------------------------------------------------------

function calcTorontoMLTT(price: number, firstTime: boolean): LttResult {
  let tax = 0;
  if (price > 2_000_000) tax += (price - 2_000_000) * 0.025;
  const cap1 = Math.min(price, 2_000_000);
  if (cap1 > 400_000) tax += (cap1 - 400_000) * 0.02;
  const cap2 = Math.min(price, 400_000);
  if (cap2 > 55_000) tax += (cap2 - 55_000) * 0.01;
  tax += Math.min(price, 55_000) * 0.005;
  const rebate = firstTime ? Math.min(tax, 4_475) : 0;
  return { tax, rebate, net: tax - rebate, note: '' };
}

// ---------------------------------------------------------------------------
// Montreal Welcome Tax (additional)
// ---------------------------------------------------------------------------

function calcMontrealWelcomeTax(price: number): LttResult {
  let tax = 0;
  if (price > 500_000) tax += (price - 500_000) * 0.025;
  const cap1 = Math.min(price, 500_000);
  if (cap1 > 250_000) tax += (cap1 - 250_000) * 0.015;
  tax += Math.min(price, 250_000) * 0.005;
  // Note: Montreal has slightly different brackets but this is a reasonable approximation
  // The actual Quebec LTT is the "welcome tax" — Montreal charges the same provincial rates
  // but adds a supplementary tax for properties over $500K (1% on $500K-$1M, 1.5% on $1M-$2M, etc.)
  // For simplicity, we calculate the QC LTT above and add a Montreal surcharge
  let surcharge = 0;
  if (price > 2_000_000) surcharge += (price - 2_000_000) * 0.02;
  const sCap1 = Math.min(price, 2_000_000);
  if (sCap1 > 1_000_000) surcharge += (sCap1 - 1_000_000) * 0.015;
  const sCap2 = Math.min(price, 1_000_000);
  if (sCap2 > 500_000) surcharge += (sCap2 - 500_000) * 0.01;

  return { tax: surcharge, rebate: 0, net: surcharge, note: '' };
}

// ---------------------------------------------------------------------------
// PST on CMHC insurance
// ---------------------------------------------------------------------------

function pstOnCMHC(province: Province, cmhcPremium: number): number {
  switch (province) {
    case 'ON': return cmhcPremium * 0.08;
    case 'QC': return cmhcPremium * 0.09975;
    case 'SK': return cmhcPremium * 0.06;
    default: return 0;
  }
}

// ---------------------------------------------------------------------------
// Line item component
// ---------------------------------------------------------------------------

function LineItem({
  label,
  amount,
  note,
  isRebate,
  isBold,
}: {
  label: string;
  amount: number;
  note?: string;
  isRebate?: boolean;
  isBold?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <div
        className={cn(
          'flex items-center justify-between text-sm',
          isBold && 'font-semibold',
          isRebate && 'text-green-600 dark:text-green-400',
        )}
      >
        <span className={cn(!isBold && !isRebate && 'text-muted-foreground')}>
          {label}
        </span>
        <span className="font-medium">
          {isRebate ? '-' : ''}
          {fmt(Math.abs(amount))}
        </span>
      </div>
      {note && (
        <p className="text-muted-foreground text-xs">{note}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ClosingCostCalculator() {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState(500_000);
  const [province, setProvince] = useState<Province>('ON');
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(true);
  const [propertyType, setPropertyType] = useState<PropertyType>('detached');
  const [isNewConstruction, setIsNewConstruction] = useState(false);
  const [city, setCity] = useState<City>('other');
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [movingCosts, setMovingCosts] = useState(1_500);

  // Derived values
  const calculations = useMemo(() => {
    const price = clamp(purchasePrice, 0, 10_000_000);
    const dpPct = clamp(downPaymentPct, 5, 100);
    const dpAmount = price * (dpPct / 100);
    const mortgageAmount = price - dpAmount;
    const cmhc = cmhcRate(dpPct);
    const cmhcPremium = mortgageAmount * cmhc;
    const moving = clamp(movingCosts, 0, 20_000);

    // Legal & Professional
    const legalFees = 2_000;
    const titleInsurance = 400;
    const homeInspection =
      propertyType === 'condo' || isNewConstruction ? 0 : 500;
    const appraisalFee = 400;

    const legalTotal = legalFees + titleInsurance + homeInspection + appraisalFee;

    // Government
    const ltt = calcLTT(province, price, firstTimeBuyer);
    const torontoMLTT =
      city === 'toronto' && province === 'ON'
        ? calcTorontoMLTT(price, firstTimeBuyer)
        : { tax: 0, rebate: 0, net: 0 };
    const montrealSurcharge =
      city === 'montreal' && province === 'QC'
        ? calcMontrealWelcomeTax(price)
        : { tax: 0, rebate: 0, net: 0 };

    const pstCMHC = pstOnCMHC(province, cmhcPremium);

    const governmentTotal =
      ltt.net + torontoMLTT.net + montrealSurcharge.net + pstCMHC;

    // Adjustments
    const propertyTaxAdjustment = Math.round(price * 0.01 * (6 / 12)); // half year estimate
    const utilityAdjustment = 200;
    const interestAdjustment = Math.round(
      (mortgageAmount + cmhcPremium) * 0.045 * (15 / 365),
    ); // ~15 days at 4.5%

    const adjustmentsTotal =
      propertyTaxAdjustment + utilityAdjustment + interestAdjustment;

    // Moving & Setup
    const lockChanges = 300;
    const homeSetup = 1_000;

    const movingTotal = moving + lockChanges + homeSetup;

    // Grand total
    const totalClosingCosts =
      legalTotal + governmentTotal + adjustmentsTotal + movingTotal;

    const closingCostPct = price > 0 ? (totalClosingCosts / price) * 100 : 0;

    // Budget recommendation
    const emergencyBuffer = 5_000;
    const totalCashNeeded = dpAmount + totalClosingCosts + emergencyBuffer;

    return {
      price,
      dpAmount,
      dpPct,
      cmhcPremium,

      // Legal
      legalFees,
      titleInsurance,
      homeInspection,
      appraisalFee,
      legalTotal,

      // Government
      ltt,
      torontoMLTT,
      montrealSurcharge,
      pstCMHC,
      governmentTotal,

      // Adjustments
      propertyTaxAdjustment,
      utilityAdjustment,
      interestAdjustment,
      adjustmentsTotal,

      // Moving
      movingCosts: moving,
      lockChanges,
      homeSetup,
      movingTotal,

      // Totals
      totalClosingCosts,
      closingCostPct,
      totalCashNeeded,
      emergencyBuffer,
    };
  }, [
    purchasePrice,
    province,
    firstTimeBuyer,
    propertyType,
    isNewConstruction,
    city,
    downPaymentPct,
    movingCosts,
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
            <FileText className="size-3" />
            Closing Cost Calculator
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Estimate your{' '}
            <span className="text-gradient">closing costs</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Closing costs typically add 1.5% - 4% on top of your purchase
            price. Know exactly what to budget for before you buy.
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
                  <Label htmlFor="cc-price">Purchase Price</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="cc-price"
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

                {/* Down payment % (for CMHC calc) */}
                <div className="space-y-2">
                  <Label htmlFor="cc-dp">Down Payment (%)</Label>
                  <div className="relative">
                    <Input
                      id="cc-dp"
                      type="text"
                      inputMode="decimal"
                      value={downPaymentPct}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 5, 100, setDownPaymentPct)
                      }
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                      %
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Used to calculate CMHC insurance PST
                  </p>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Select
                    value={province}
                    onValueChange={(v) => {
                      setProvince(v as Province);
                      // Reset city when province changes
                      if (v !== 'ON' && city === 'toronto') setCity('other');
                      if (v !== 'QC' && city === 'montreal') setCity('other');
                    }}
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

                {/* City */}
                {(province === 'ON' || province === 'QC') && (
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select
                      value={city}
                      onValueChange={(v) => setCity(v as City)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="other">
                          Other / Not applicable
                        </SelectItem>
                        {province === 'ON' && (
                          <SelectItem value="toronto">
                            City of Toronto
                          </SelectItem>
                        )}
                        {province === 'QC' && (
                          <SelectItem value="montreal">
                            Montreal
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {province === 'ON' && city === 'toronto' && (
                      <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
                        <Info className="mt-0.5 size-3 shrink-0" />
                        Toronto charges a municipal land transfer tax in addition to the provincial LTT.
                      </p>
                    )}
                  </div>
                )}

                {/* First-time buyer */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="cc-ftb" className="cursor-pointer text-sm">
                    First-time buyer?
                  </Label>
                  <Button
                    id="cc-ftb"
                    variant={firstTimeBuyer ? 'default' : 'outline'}
                    size="xs"
                    onClick={() => setFirstTimeBuyer((v) => !v)}
                  >
                    {firstTimeBuyer ? 'Yes' : 'No'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="size-5 text-chart-2" />
                  Property Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Property type */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={propertyType}
                    onValueChange={(v) => setPropertyType(v as PropertyType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detached">Detached</SelectItem>
                      <SelectItem value="semi">Semi-detached</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* New construction */}
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="cc-newbuild"
                    className="cursor-pointer text-sm"
                  >
                    New construction?
                  </Label>
                  <Button
                    id="cc-newbuild"
                    variant={isNewConstruction ? 'default' : 'outline'}
                    size="xs"
                    onClick={() => setIsNewConstruction((v) => !v)}
                  >
                    {isNewConstruction ? 'Yes' : 'No'}
                  </Button>
                </div>

                {/* Moving costs */}
                <div className="space-y-2">
                  <Label htmlFor="cc-moving">Estimated Moving Costs</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="cc-moving"
                      type="text"
                      inputMode="numeric"
                      className="pl-9"
                      value={movingCosts.toLocaleString('en-CA')}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, 0, 20_000, setMovingCosts)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT: Results                                                   */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            {/* Total highlight */}
            <Card className="border-chart-1/20 bg-chart-1/5">
              <CardContent className="flex flex-col items-center gap-1 py-2 text-center">
                <p className="text-muted-foreground text-sm">
                  Estimated Closing Costs
                </p>
                <p className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
                  {fmt(calculations.totalClosingCosts)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {calculations.closingCostPct.toFixed(1)}% of purchase price
                </p>
              </CardContent>
            </Card>

            {/* Budget recommendation */}
            <Card className="border-chart-2/20 bg-chart-2/5">
              <CardContent className="flex items-start gap-3 py-1">
                <div className="bg-chart-2/15 text-chart-2 flex size-9 shrink-0 items-center justify-center rounded-md">
                  <Calculator className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Total Cash Needed
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Down payment ({fmt(calculations.dpAmount)}) + closing
                    costs ({fmt(calculations.totalClosingCosts)}) +{' '}
                    {fmt(calculations.emergencyBuffer)} emergency buffer
                  </p>
                  <p className="text-foreground mt-1 text-lg font-bold">
                    {fmt(calculations.totalCashNeeded)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="size-5 text-chart-1" />
                  Legal &amp; Professional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <LineItem label="Legal fees" amount={calculations.legalFees} />
                <LineItem
                  label="Title insurance"
                  amount={calculations.titleInsurance}
                />
                <LineItem
                  label="Home inspection"
                  amount={calculations.homeInspection}
                  note={
                    calculations.homeInspection === 0
                      ? propertyType === 'condo'
                        ? 'Not typical for condos (status certificate instead)'
                        : 'Not typical for new construction'
                      : undefined
                  }
                />
                <LineItem
                  label="Appraisal fee"
                  amount={calculations.appraisalFee}
                />
                <Separator className="my-2" />
                <LineItem
                  label="Subtotal"
                  amount={calculations.legalTotal}
                  isBold
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="size-5 text-chart-2" />
                  Government Fees &amp; Taxes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <LineItem
                  label="Provincial land transfer tax"
                  amount={calculations.ltt.tax}
                />
                {calculations.ltt.rebate > 0 && (
                  <LineItem
                    label="First-time buyer LTT rebate"
                    amount={calculations.ltt.rebate}
                    isRebate
                  />
                )}
                {city === 'toronto' && province === 'ON' && (
                  <>
                    <LineItem
                      label="Toronto municipal LTT"
                      amount={calculations.torontoMLTT.tax}
                    />
                    {calculations.torontoMLTT.rebate > 0 && (
                      <LineItem
                        label="Toronto FTHB rebate"
                        amount={calculations.torontoMLTT.rebate}
                        isRebate
                      />
                    )}
                  </>
                )}
                {city === 'montreal' && province === 'QC' && (
                  <LineItem
                    label="Montreal surcharge"
                    amount={calculations.montrealSurcharge.net}
                    note="Additional transfer tax for Montreal properties"
                  />
                )}
                {calculations.pstCMHC > 0 && (
                  <LineItem
                    label="PST on CMHC insurance"
                    amount={calculations.pstCMHC}
                    note={
                      province === 'ON'
                        ? '8% Ontario PST on CMHC premium'
                        : province === 'QC'
                          ? '9.975% Quebec PST on CMHC premium'
                          : '6% Saskatchewan PST on CMHC premium'
                    }
                  />
                )}
                <Separator className="my-2" />
                <LineItem
                  label="Subtotal"
                  amount={calculations.governmentTotal}
                  isBold
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="size-5 text-chart-3" />
                  Adjustments
                </CardTitle>
                <CardDescription>
                  Estimated prepaid costs and adjustments at closing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <LineItem
                  label="Property tax adjustment"
                  amount={calculations.propertyTaxAdjustment}
                  note="Estimated prepaid property taxes (half-year)"
                />
                <LineItem
                  label="Utility adjustments"
                  amount={calculations.utilityAdjustment}
                />
                <LineItem
                  label="Interest adjustment"
                  amount={calculations.interestAdjustment}
                  note="Interest from closing to first payment date (~15 days)"
                />
                <Separator className="my-2" />
                <LineItem
                  label="Subtotal"
                  amount={calculations.adjustmentsTotal}
                  isBold
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="size-5 text-chart-4" />
                  Moving &amp; Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <LineItem
                  label="Moving costs"
                  amount={calculations.movingCosts}
                />
                <LineItem label="Lock changes" amount={calculations.lockChanges} />
                <LineItem
                  label="Home setup essentials"
                  amount={calculations.homeSetup}
                />
                <Separator className="my-2" />
                <LineItem
                  label="Subtotal"
                  amount={calculations.movingTotal}
                  isBold
                />
              </CardContent>
            </Card>

            {/* Grand total summary */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Legal & Professional', value: calculations.legalTotal },
                  { label: 'Government Fees & Taxes', value: calculations.governmentTotal },
                  { label: 'Adjustments', value: calculations.adjustmentsTotal },
                  { label: 'Moving & Setup', value: calculations.movingTotal },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{fmt(row.value)}</span>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Closing Costs</span>
                  <span>{fmt(calculations.totalClosingCosts)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
