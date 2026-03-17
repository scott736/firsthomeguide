'use client';

import { useMemo, useState } from 'react';

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Building2,
  DollarSign,
  Home,
  Info,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
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

const fmtPct = (n: number) =>
  `${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

// ---------------------------------------------------------------------------
// Canadian minimum down payment calculation
// ---------------------------------------------------------------------------

function calcMinDownPayment(price: number): number {
  if (price <= 500_000) {
    return price * 0.05;
  }
  if (price <= 999_999) {
    return 25_000 + (price - 500_000) * 0.1;
  }
  return price * 0.2;
}

// ---------------------------------------------------------------------------
// Monthly mortgage payment (Canadian semi-annual compounding)
// ---------------------------------------------------------------------------

function monthlyPayment(
  principal: number,
  annualRate: number,
  amortYears: number,
): number {
  if (principal <= 0) return 0;
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
// City data
// ---------------------------------------------------------------------------

interface CityData {
  name: string;
  province: string;
  avgHomePrice: number;
  avgCondoPrice: number;
  avgDetachedPrice: number;
  avgRent1Bed: number;
  avgRent2Bed: number;
  propertyTaxRate: number;
  avgHouseholdIncome: number;
  hasLTT: boolean;
  hasMLTT: boolean;
  priceToIncomeRatio: number;
  minDownPayment5Pct: number;
}

const CITIES: CityData[] = [
  {
    name: 'Toronto',
    province: 'ON',
    avgHomePrice: 1_100_000,
    avgCondoPrice: 650_000,
    avgDetachedPrice: 1_500_000,
    avgRent1Bed: 2_400,
    avgRent2Bed: 3_100,
    propertyTaxRate: 0.67,
    avgHouseholdIncome: 95_000,
    hasLTT: true,
    hasMLTT: true,
    priceToIncomeRatio: 1_100_000 / 95_000,
    minDownPayment5Pct: calcMinDownPayment(1_100_000),
  },
  {
    name: 'Vancouver',
    province: 'BC',
    avgHomePrice: 1_200_000,
    avgCondoPrice: 700_000,
    avgDetachedPrice: 1_800_000,
    avgRent1Bed: 2_600,
    avgRent2Bed: 3_400,
    propertyTaxRate: 0.27,
    avgHouseholdIncome: 90_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 1_200_000 / 90_000,
    minDownPayment5Pct: calcMinDownPayment(1_200_000),
  },
  {
    name: 'Ottawa',
    province: 'ON',
    avgHomePrice: 650_000,
    avgCondoPrice: 400_000,
    avgDetachedPrice: 750_000,
    avgRent1Bed: 1_800,
    avgRent2Bed: 2_200,
    propertyTaxRate: 1.07,
    avgHouseholdIncome: 105_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 650_000 / 105_000,
    minDownPayment5Pct: calcMinDownPayment(650_000),
  },
  {
    name: 'Montreal',
    province: 'QC',
    avgHomePrice: 550_000,
    avgCondoPrice: 400_000,
    avgDetachedPrice: 700_000,
    avgRent1Bed: 1_600,
    avgRent2Bed: 2_000,
    propertyTaxRate: 0.87,
    avgHouseholdIncome: 78_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 550_000 / 78_000,
    minDownPayment5Pct: calcMinDownPayment(550_000),
  },
  {
    name: 'Calgary',
    province: 'AB',
    avgHomePrice: 575_000,
    avgCondoPrice: 300_000,
    avgDetachedPrice: 700_000,
    avgRent1Bed: 1_600,
    avgRent2Bed: 2_000,
    propertyTaxRate: 0.64,
    avgHouseholdIncome: 100_000,
    hasLTT: false,
    hasMLTT: false,
    priceToIncomeRatio: 575_000 / 100_000,
    minDownPayment5Pct: calcMinDownPayment(575_000),
  },
  {
    name: 'Edmonton',
    province: 'AB',
    avgHomePrice: 400_000,
    avgCondoPrice: 200_000,
    avgDetachedPrice: 475_000,
    avgRent1Bed: 1_300,
    avgRent2Bed: 1_600,
    propertyTaxRate: 0.87,
    avgHouseholdIncome: 95_000,
    hasLTT: false,
    hasMLTT: false,
    priceToIncomeRatio: 400_000 / 95_000,
    minDownPayment5Pct: calcMinDownPayment(400_000),
  },
  {
    name: 'Winnipeg',
    province: 'MB',
    avgHomePrice: 365_000,
    avgCondoPrice: 220_000,
    avgDetachedPrice: 400_000,
    avgRent1Bed: 1_200,
    avgRent2Bed: 1_500,
    propertyTaxRate: 2.54,
    avgHouseholdIncome: 82_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 365_000 / 82_000,
    minDownPayment5Pct: calcMinDownPayment(365_000),
  },
  {
    name: 'Saskatoon',
    province: 'SK',
    avgHomePrice: 380_000,
    avgCondoPrice: 210_000,
    avgDetachedPrice: 430_000,
    avgRent1Bed: 1_100,
    avgRent2Bed: 1_400,
    propertyTaxRate: 1.16,
    avgHouseholdIncome: 88_000,
    hasLTT: false,
    hasMLTT: false,
    priceToIncomeRatio: 380_000 / 88_000,
    minDownPayment5Pct: calcMinDownPayment(380_000),
  },
  {
    name: 'Regina',
    province: 'SK',
    avgHomePrice: 335_000,
    avgCondoPrice: 190_000,
    avgDetachedPrice: 380_000,
    avgRent1Bed: 1_100,
    avgRent2Bed: 1_350,
    propertyTaxRate: 1.21,
    avgHouseholdIncome: 90_000,
    hasLTT: false,
    hasMLTT: false,
    priceToIncomeRatio: 335_000 / 90_000,
    minDownPayment5Pct: calcMinDownPayment(335_000),
  },
  {
    name: 'Halifax',
    province: 'NS',
    avgHomePrice: 480_000,
    avgCondoPrice: 350_000,
    avgDetachedPrice: 550_000,
    avgRent1Bed: 1_700,
    avgRent2Bed: 2_100,
    propertyTaxRate: 1.19,
    avgHouseholdIncome: 78_000,
    hasLTT: false,
    hasMLTT: false,
    priceToIncomeRatio: 480_000 / 78_000,
    minDownPayment5Pct: calcMinDownPayment(480_000),
  },
  {
    name: "St. John's",
    province: 'NL',
    avgHomePrice: 310_000,
    avgCondoPrice: 220_000,
    avgDetachedPrice: 350_000,
    avgRent1Bed: 1_100,
    avgRent2Bed: 1_300,
    propertyTaxRate: 0.95,
    avgHouseholdIncome: 80_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 310_000 / 80_000,
    minDownPayment5Pct: calcMinDownPayment(310_000),
  },
  {
    name: 'Fredericton',
    province: 'NB',
    avgHomePrice: 320_000,
    avgCondoPrice: 230_000,
    avgDetachedPrice: 360_000,
    avgRent1Bed: 1_200,
    avgRent2Bed: 1_400,
    propertyTaxRate: 1.42,
    avgHouseholdIncome: 75_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 320_000 / 75_000,
    minDownPayment5Pct: calcMinDownPayment(320_000),
  },
  {
    name: 'Charlottetown',
    province: 'PE',
    avgHomePrice: 380_000,
    avgCondoPrice: 280_000,
    avgDetachedPrice: 420_000,
    avgRent1Bed: 1_400,
    avgRent2Bed: 1_700,
    propertyTaxRate: 0.89,
    avgHouseholdIncome: 72_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 380_000 / 72_000,
    minDownPayment5Pct: calcMinDownPayment(380_000),
  },
  {
    name: 'Victoria',
    province: 'BC',
    avgHomePrice: 900_000,
    avgCondoPrice: 500_000,
    avgDetachedPrice: 1_200_000,
    avgRent1Bed: 2_200,
    avgRent2Bed: 2_800,
    propertyTaxRate: 0.52,
    avgHouseholdIncome: 85_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 900_000 / 85_000,
    minDownPayment5Pct: calcMinDownPayment(900_000),
  },
  {
    name: 'Hamilton',
    province: 'ON',
    avgHomePrice: 780_000,
    avgCondoPrice: 480_000,
    avgDetachedPrice: 850_000,
    avgRent1Bed: 1_800,
    avgRent2Bed: 2_200,
    propertyTaxRate: 1.24,
    avgHouseholdIncome: 88_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 780_000 / 88_000,
    minDownPayment5Pct: calcMinDownPayment(780_000),
  },
  {
    name: 'Kitchener-Waterloo',
    province: 'ON',
    avgHomePrice: 720_000,
    avgCondoPrice: 450_000,
    avgDetachedPrice: 800_000,
    avgRent1Bed: 1_700,
    avgRent2Bed: 2_100,
    propertyTaxRate: 1.14,
    avgHouseholdIncome: 90_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 720_000 / 90_000,
    minDownPayment5Pct: calcMinDownPayment(720_000),
  },
  {
    name: 'London',
    province: 'ON',
    avgHomePrice: 580_000,
    avgCondoPrice: 370_000,
    avgDetachedPrice: 650_000,
    avgRent1Bed: 1_600,
    avgRent2Bed: 1_900,
    propertyTaxRate: 1.33,
    avgHouseholdIncome: 82_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 580_000 / 82_000,
    minDownPayment5Pct: calcMinDownPayment(580_000),
  },
  {
    name: 'Kelowna',
    province: 'BC',
    avgHomePrice: 750_000,
    avgCondoPrice: 420_000,
    avgDetachedPrice: 950_000,
    avgRent1Bed: 1_900,
    avgRent2Bed: 2_400,
    propertyTaxRate: 0.53,
    avgHouseholdIncome: 80_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 750_000 / 80_000,
    minDownPayment5Pct: calcMinDownPayment(750_000),
  },
  {
    name: 'Moncton',
    province: 'NB',
    avgHomePrice: 330_000,
    avgCondoPrice: 230_000,
    avgDetachedPrice: 370_000,
    avgRent1Bed: 1_200,
    avgRent2Bed: 1_500,
    propertyTaxRate: 1.55,
    avgHouseholdIncome: 72_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 330_000 / 72_000,
    minDownPayment5Pct: calcMinDownPayment(330_000),
  },
  {
    name: 'Barrie',
    province: 'ON',
    avgHomePrice: 700_000,
    avgCondoPrice: 450_000,
    avgDetachedPrice: 780_000,
    avgRent1Bed: 1_700,
    avgRent2Bed: 2_100,
    propertyTaxRate: 1.08,
    avgHouseholdIncome: 85_000,
    hasLTT: true,
    hasMLTT: false,
    priceToIncomeRatio: 700_000 / 85_000,
    minDownPayment5Pct: calcMinDownPayment(700_000),
  },
];

// ---------------------------------------------------------------------------
// Affordability helpers
// ---------------------------------------------------------------------------

type AffordabilityRating = 'Good' | 'Moderate' | 'Challenging' | 'Extreme';

function getAffordabilityRating(ratio: number): AffordabilityRating {
  if (ratio < 5) return 'Good';
  if (ratio < 8) return 'Moderate';
  if (ratio < 12) return 'Challenging';
  return 'Extreme';
}

function getAffordabilityColor(rating: AffordabilityRating): string {
  switch (rating) {
    case 'Good':
      return 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400';
    case 'Moderate':
      return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'Challenging':
      return 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400';
    case 'Extreme':
      return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400';
  }
}

// ---------------------------------------------------------------------------
// Get price for selected property type
// ---------------------------------------------------------------------------

type PropertyType = 'all' | 'condo' | 'detached';

function getPriceForType(city: CityData, type: PropertyType): number {
  switch (type) {
    case 'condo':
      return city.avgCondoPrice;
    case 'detached':
      return city.avgDetachedPrice;
    default:
      return city.avgHomePrice;
  }
}

function getPriceLabel(type: PropertyType): string {
  switch (type) {
    case 'condo':
      return 'Avg. Condo Price';
    case 'detached':
      return 'Avg. Detached Price';
    default:
      return 'Avg. Home Price';
  }
}

// ---------------------------------------------------------------------------
// Province labels
// ---------------------------------------------------------------------------

const PROVINCE_LABELS: Record<string, string> = {
  ON: 'Ontario',
  BC: 'British Columbia',
  AB: 'Alberta',
  QC: 'Quebec',
  MB: 'Manitoba',
  SK: 'Saskatchewan',
  NS: 'Nova Scotia',
  NB: 'New Brunswick',
  NL: 'Newfoundland & Labrador',
  PE: 'Prince Edward Island',
};

// ---------------------------------------------------------------------------
// Comparison metrics for a single city
// ---------------------------------------------------------------------------

interface CityMetrics {
  city: CityData;
  price: number;
  downPayment: number;
  monthlyMortgage: number;
  annualPropertyTax: number;
  rent1Bed: number;
  rent2Bed: number;
  priceToIncome: number;
  affordability: AffordabilityRating;
  closingCosts: number;
  emergencyFund: number;
  totalSavingsNeeded: number;
}

function computeMetrics(city: CityData, propertyType: PropertyType): CityMetrics {
  const price = getPriceForType(city, propertyType);
  const downPayment = calcMinDownPayment(price);
  const mortgage = price - downPayment;

  // CMHC insurance for < 20% down
  const dpPct = (downPayment / price) * 100;
  let cmhcRate = 0;
  if (dpPct < 20) {
    if (dpPct >= 15) cmhcRate = 0.028;
    else if (dpPct >= 10) cmhcRate = 0.031;
    else cmhcRate = 0.04;
  }
  const totalMortgage = mortgage + mortgage * cmhcRate;

  const monthlyMortgage = monthlyPayment(totalMortgage, 4.5, 25);
  const annualPropertyTax = price * (city.propertyTaxRate / 100);
  const priceToIncome = price / city.avgHouseholdIncome;
  const closingCosts = price * 0.035; // ~3.5%
  const emergencyFund = monthlyMortgage * 3;
  const totalSavingsNeeded = downPayment + closingCosts + emergencyFund;

  return {
    city,
    price,
    downPayment,
    monthlyMortgage,
    annualPropertyTax,
    rent1Bed: city.avgRent1Bed,
    rent2Bed: city.avgRent2Bed,
    priceToIncome,
    affordability: getAffordabilityRating(priceToIncome),
    closingCosts,
    emergencyFund,
    totalSavingsNeeded,
  };
}

// ---------------------------------------------------------------------------
// Chart tooltip
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
// Comparison metric row
// ---------------------------------------------------------------------------

function MetricRow({
  icon: Icon,
  label,
  value1,
  value2,
  sublabel1,
  sublabel2,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value1: string;
  value2: string;
  sublabel1?: string;
  sublabel2?: string;
  highlight?: 'city1' | 'city2' | null;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] items-start gap-3 rounded-lg border p-4 dark:bg-input/10">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p
          className={cn(
            'truncate text-lg font-semibold tracking-tight',
            highlight === 'city1' && 'text-green-600 dark:text-green-400',
          )}
        >
          {value1}
        </p>
        {sublabel1 && (
          <p className="text-muted-foreground mt-0.5 text-xs">{sublabel1}</p>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p
          className={cn(
            'truncate text-lg font-semibold tracking-tight',
            highlight === 'city2' && 'text-green-600 dark:text-green-400',
          )}
        >
          {value2}
        </p>
        {sublabel2 && (
          <p className="text-muted-foreground mt-0.5 text-xs">{sublabel2}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rankings sort
// ---------------------------------------------------------------------------

type SortKey =
  | 'name'
  | 'price'
  | 'downPayment'
  | 'monthly'
  | 'propertyTax'
  | 'priceToIncome';

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CityComparison() {
  const [city1, setCity1] = useState('Toronto');
  const [city2, setCity2] = useState('Calgary');
  const [propertyType, setPropertyType] = useState<PropertyType>('all');
  const [sortKey, setSortKey] = useState<SortKey>('priceToIncome');
  const [sortAsc, setSortAsc] = useState(true);

  const cityData1 = CITIES.find((c) => c.name === city1)!;
  const cityData2 = CITIES.find((c) => c.name === city2)!;

  const metrics1 = useMemo(
    () => computeMetrics(cityData1, propertyType),
    [cityData1, propertyType],
  );
  const metrics2 = useMemo(
    () => computeMetrics(cityData2, propertyType),
    [cityData2, propertyType],
  );

  // Chart data
  const chartData = useMemo(() => {
    return [
      {
        metric: 'Avg. Price',
        [city1]: metrics1.price,
        [city2]: metrics2.price,
      },
      {
        metric: 'Down Payment',
        [city1]: metrics1.downPayment,
        [city2]: metrics2.downPayment,
      },
      {
        metric: 'Monthly Mortgage',
        [city1]: metrics1.monthlyMortgage,
        [city2]: metrics2.monthlyMortgage,
      },
      {
        metric: 'Annual Prop. Tax',
        [city1]: metrics1.annualPropertyTax,
        [city2]: metrics2.annualPropertyTax,
      },
      {
        metric: '1BR Rent/mo',
        [city1]: metrics1.rent1Bed,
        [city2]: metrics2.rent2Bed,
      },
    ];
  }, [city1, city2, metrics1, metrics2]);

  // Rankings
  const rankings = useMemo(() => {
    const allMetrics = CITIES.map((c) => computeMetrics(c, propertyType));

    allMetrics.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortKey) {
        case 'name':
          aVal = a.city.name;
          bVal = b.city.name;
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'downPayment':
          aVal = a.downPayment;
          bVal = b.downPayment;
          break;
        case 'monthly':
          aVal = a.monthlyMortgage;
          bVal = b.monthlyMortgage;
          break;
        case 'propertyTax':
          aVal = a.annualPropertyTax;
          bVal = b.annualPropertyTax;
          break;
        case 'priceToIncome':
          aVal = a.priceToIncome;
          bVal = b.priceToIncome;
          break;
        default:
          aVal = a.priceToIncome;
          bVal = b.priceToIncome;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return allMetrics;
  }, [propertyType, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ArrowUpDown className="ml-1 inline size-3 opacity-40" />;
    return sortAsc ? (
      <ArrowUp className="ml-1 inline size-3" />
    ) : (
      <ArrowDown className="ml-1 inline size-3" />
    );
  };

  // Helper: which city is lower (better) for cost metrics
  const lowerWins = (v1: number, v2: number): 'city1' | 'city2' | null => {
    if (v1 < v2) return 'city1';
    if (v2 < v1) return 'city2';
    return null;
  };

  return (
    <section className="section-padding">
      <div className="container max-w-screen-xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-3 md:mb-14">
          <Badge variant="outline" className="gap-1.5">
            <BarChart3 className="size-3" />
            City Comparison Tool
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Cost of Living{' '}
            <span className="text-gradient">Comparison by City</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Compare the cost of buying a home across 20+ major Canadian cities.
            See average prices, down payments, mortgage costs, and affordability
            ratings side by side.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          {/* ---------------------------------------------------------------- */}
          {/* LEFT: City selectors                                             */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="size-5 text-chart-1" />
                  Select Cities
                </CardTitle>
                <CardDescription>
                  Choose two cities to compare side by side
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* City 1 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">City 1</label>
                  <Select value={city1} onValueChange={setCity1}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}, {c.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City 2 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">City 2</label>
                  <Select value={city2} onValueChange={setCity2}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}, {c.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Property type filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Property Type</label>
                  <Select
                    value={propertyType}
                    onValueChange={(v) => setPropertyType(v as PropertyType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="detached">Detached</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer card */}
            <Card>
              <CardContent className="flex items-start gap-3 py-1">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-chart-2/15 text-chart-2">
                  <Info className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Data Disclaimer</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Prices are approximate averages and change frequently. For
                    current data, consult your local real estate board.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT: Results                                                   */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            <Tabs defaultValue="compare">
              <TabsList className="w-full">
                <TabsTrigger value="compare" className="flex-1">
                  Compare
                </TabsTrigger>
                <TabsTrigger value="rankings" className="flex-1">
                  Rankings
                </TabsTrigger>
              </TabsList>

              {/* ============================================================ */}
              {/* Compare tab                                                  */}
              {/* ============================================================ */}
              <TabsContent value="compare" className="mt-6 space-y-4">
                {/* City names header */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="border-chart-1/20 bg-chart-1/5">
                    <CardContent className="py-2 text-center">
                      <p className="text-gradient text-xl font-bold tracking-tight">
                        {city1}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {PROVINCE_LABELS[cityData1.province] ?? cityData1.province}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-chart-2/20 bg-chart-2/5">
                    <CardContent className="py-2 text-center">
                      <p className="text-gradient text-xl font-bold tracking-tight">
                        {city2}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {PROVINCE_LABELS[cityData2.province] ?? cityData2.province}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Metrics rows */}
                <MetricRow
                  icon={Home}
                  label={getPriceLabel(propertyType)}
                  value1={fmt(metrics1.price)}
                  value2={fmt(metrics2.price)}
                  highlight={lowerWins(metrics1.price, metrics2.price)}
                />
                <MetricRow
                  icon={DollarSign}
                  label="Min. Down Payment"
                  value1={fmt(metrics1.downPayment)}
                  value2={fmt(metrics2.downPayment)}
                  sublabel1={fmtPct((metrics1.downPayment / metrics1.price) * 100)}
                  sublabel2={fmtPct((metrics2.downPayment / metrics2.price) * 100)}
                  highlight={lowerWins(metrics1.downPayment, metrics2.downPayment)}
                />
                <MetricRow
                  icon={Building2}
                  label="Monthly Mortgage"
                  value1={fmtFull(metrics1.monthlyMortgage)}
                  value2={fmtFull(metrics2.monthlyMortgage)}
                  sublabel1="at 4.5%, 25yr amortization"
                  sublabel2="at 4.5%, 25yr amortization"
                  highlight={lowerWins(
                    metrics1.monthlyMortgage,
                    metrics2.monthlyMortgage,
                  )}
                />
                <MetricRow
                  icon={DollarSign}
                  label="Annual Property Tax"
                  value1={fmt(metrics1.annualPropertyTax)}
                  value2={fmt(metrics2.annualPropertyTax)}
                  sublabel1={`Rate: ${fmtPct(cityData1.propertyTaxRate)}`}
                  sublabel2={`Rate: ${fmtPct(cityData2.propertyTaxRate)}`}
                  highlight={lowerWins(
                    metrics1.annualPropertyTax,
                    metrics2.annualPropertyTax,
                  )}
                />
                <MetricRow
                  icon={Home}
                  label="Avg. Rent (1BR / 2BR)"
                  value1={`${fmt(metrics1.rent1Bed)} / ${fmt(metrics1.rent2Bed)}`}
                  value2={`${fmt(metrics2.rent1Bed)} / ${fmt(metrics2.rent2Bed)}`}
                />

                {/* Affordability badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4 dark:bg-input/10">
                    <p className="text-muted-foreground text-xs">
                      Price-to-Income Ratio
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {metrics1.priceToIncome.toFixed(1)}x
                    </p>
                    <Badge
                      variant="outline"
                      className={getAffordabilityColor(metrics1.affordability)}
                    >
                      {metrics1.affordability}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4 dark:bg-input/10">
                    <p className="text-muted-foreground text-xs">
                      Price-to-Income Ratio
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {metrics2.priceToIncome.toFixed(1)}x
                    </p>
                    <Badge
                      variant="outline"
                      className={getAffordabilityColor(metrics2.affordability)}
                    >
                      {metrics2.affordability}
                    </Badge>
                  </div>
                </div>

                {/* Bar chart comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Side-by-Side Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72 w-full sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          layout="vertical"
                          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="oklch(0.5 0 0 / 0.15)"
                          />
                          <XAxis
                            type="number"
                            tickFormatter={(v: number) =>
                              v >= 1000
                                ? `$${(v / 1000).toFixed(0)}K`
                                : `$${v}`
                            }
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="metric"
                            width={110}
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar
                            dataKey={city1}
                            fill="oklch(0.58 0.2 285)"
                            radius={[0, 4, 4, 0]}
                            barSize={14}
                          />
                          <Bar
                            dataKey={city2}
                            fill="oklch(0.65 0.25 320)"
                            radius={[0, 4, 4, 0]}
                            barSize={14}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-6 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block size-2.5 rounded-full"
                          style={{ background: 'oklch(0.58 0.2 285)' }}
                        />
                        {city1}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block size-2.5 rounded-full"
                          style={{ background: 'oklch(0.65 0.25 320)' }}
                        />
                        {city2}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Savings needed section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="size-4 text-chart-2" />
                      Savings Needed to Buy
                    </CardTitle>
                    <CardDescription>
                      Down payment + closing costs (~3.5%) + 3-month emergency
                      fund
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {[metrics1, metrics2].map((m, idx) => (
                        <div key={idx} className="space-y-3 text-sm">
                          <p className="font-semibold">{m.city.name}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Down payment
                              </span>
                              <span className="font-medium">
                                {fmt(m.downPayment)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Closing costs
                              </span>
                              <span className="font-medium">
                                {fmt(m.closingCosts)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Emergency fund
                              </span>
                              <span className="font-medium">
                                {fmt(m.emergencyFund)}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                              <span>Total needed</span>
                              <span>{fmt(m.totalSavingsNeeded)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ============================================================ */}
              {/* Rankings tab                                                  */}
              {/* ============================================================ */}
              <TabsContent value="rankings" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      All Cities Ranked
                    </CardTitle>
                    <CardDescription>
                      Click column headers to sort. Showing{' '}
                      {propertyType === 'all'
                        ? 'average home'
                        : propertyType}{' '}
                      prices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="-mx-6 px-0 sm:mx-0 sm:px-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-sm">
                        <thead>
                          <tr className="border-b text-left">
                            <th
                              className="cursor-pointer pb-3 pr-3 font-medium"
                              onClick={() => handleSort('name')}
                            >
                              City
                              <SortIcon col="name" />
                            </th>
                            <th className="pb-3 pr-3 font-medium">Province</th>
                            <th
                              className="cursor-pointer pb-3 pr-3 text-right font-medium"
                              onClick={() => handleSort('price')}
                            >
                              Avg. Price
                              <SortIcon col="price" />
                            </th>
                            <th
                              className="cursor-pointer pb-3 pr-3 text-right font-medium"
                              onClick={() => handleSort('downPayment')}
                            >
                              Min. Down
                              <SortIcon col="downPayment" />
                            </th>
                            <th
                              className="cursor-pointer pb-3 pr-3 text-right font-medium"
                              onClick={() => handleSort('monthly')}
                            >
                              Monthly
                              <SortIcon col="monthly" />
                            </th>
                            <th
                              className="cursor-pointer pb-3 pr-3 text-right font-medium"
                              onClick={() => handleSort('propertyTax')}
                            >
                              Prop. Tax/yr
                              <SortIcon col="propertyTax" />
                            </th>
                            <th
                              className="cursor-pointer pb-3 pr-3 text-right font-medium"
                              onClick={() => handleSort('priceToIncome')}
                            >
                              Ratio
                              <SortIcon col="priceToIncome" />
                            </th>
                            <th className="pb-3 text-center font-medium">
                              Rating
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rankings.map((m, idx) => (
                            <tr
                              key={m.city.name}
                              className={cn(
                                'border-b last:border-0',
                                idx < 3 &&
                                  sortKey === 'priceToIncome' &&
                                  sortAsc &&
                                  'bg-green-500/5',
                              )}
                            >
                              <td className="py-3 pr-3 font-medium">
                                {m.city.name}
                              </td>
                              <td className="text-muted-foreground py-3 pr-3">
                                {m.city.province}
                              </td>
                              <td className="py-3 pr-3 text-right tabular-nums">
                                {fmt(m.price)}
                              </td>
                              <td className="py-3 pr-3 text-right tabular-nums">
                                {fmt(m.downPayment)}
                              </td>
                              <td className="py-3 pr-3 text-right tabular-nums">
                                {fmt(m.monthlyMortgage)}
                              </td>
                              <td className="py-3 pr-3 text-right tabular-nums">
                                {fmt(m.annualPropertyTax)}
                              </td>
                              <td className="py-3 pr-3 text-right tabular-nums">
                                {m.priceToIncome.toFixed(1)}x
                              </td>
                              <td className="py-3 text-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-[10px]',
                                    getAffordabilityColor(m.affordability),
                                  )}
                                >
                                  {m.affordability}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
