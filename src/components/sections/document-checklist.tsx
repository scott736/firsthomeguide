'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FileText,
  Home,
  Printer,
  RotateCcw,
  User,
  Users,
  Wallet,
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
import { Checkbox } from '@/components/ui/checkbox';
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
// Types
// ---------------------------------------------------------------------------

type EmploymentType = 'salaried' | 'self-employed' | 'contract' | 'commission';
type DownPaymentSource =
  | 'savings'
  | 'fhsa'
  | 'rrsp-hbp'
  | 'gift'
  | 'sale-of-property'
  | 'multiple';
type PropertyType = 'resale' | 'new-construction' | 'condo';
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

interface ChecklistState {
  employmentType: EmploymentType;
  hasPartner: boolean;
  partnerEmploymentType: EmploymentType;
  downPaymentSource: DownPaymentSource;
  propertyType: PropertyType;
  province: Province;
  checkedItems: Record<string, boolean>;
}

interface DocumentItem {
  id: string;
  label: string;
}

interface DocumentCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  items: DocumentItem[];
  condition?: (state: ChecklistState) => boolean;
}

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'fhg-doc-checklist';

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

const DEFAULT_STATE: ChecklistState = {
  employmentType: 'salaried',
  hasPartner: false,
  partnerEmploymentType: 'salaried',
  downPaymentSource: 'savings',
  propertyType: 'resale',
  province: 'ON',
  checkedItems: {},
};

// ---------------------------------------------------------------------------
// Province list
// ---------------------------------------------------------------------------

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
// Document categories
// ---------------------------------------------------------------------------

function buildCategories(forPartner: boolean): DocumentCategory[] {
  const prefix = forPartner ? 'partner-' : '';
  const labelSuffix = forPartner ? ' (Partner)' : '';

  return [
    // Income & Employment — always shown
    {
      id: `${prefix}income`,
      title: `Income & Employment${labelSuffix}`,
      icon: Briefcase,
      items: [
        {
          id: `${prefix}pay-stubs`,
          label: 'Recent pay stubs (last 30 days)',
        },
        {
          id: `${prefix}employment-letter`,
          label:
            'Letter of employment (confirm salary, position, start date)',
        },
        { id: `${prefix}t4-slips`, label: 'T4 slips (last 2 years)' },
        {
          id: `${prefix}noa`,
          label: 'NOA — Notice of Assessment (last 2 years)',
        },
        {
          id: `${prefix}t1-returns`,
          label: 'T1 General tax returns (last 2 years)',
        },
      ],
    },

    // Self-employed
    {
      id: `${prefix}self-employed`,
      title: `Self-Employment Documents${labelSuffix}`,
      icon: FileText,
      items: [
        {
          id: `${prefix}biz-licence`,
          label: 'Business licence or articles of incorporation',
        },
        {
          id: `${prefix}t2-return`,
          label: 'T2 corporate tax return (if incorporated)',
        },
        {
          id: `${prefix}biz-financials`,
          label: 'Business financial statements (last 2 years)',
        },
        {
          id: `${prefix}biz-bank-statements`,
          label: 'Business bank statements (6-12 months)',
        },
        { id: `${prefix}gst-hst`, label: 'GST/HST returns' },
        {
          id: `${prefix}client-contracts`,
          label: 'Client contracts or invoices showing ongoing work',
        },
        {
          id: `${prefix}accountant-letter`,
          label: 'Letter from accountant confirming income',
        },
      ],
      condition: (state) => {
        const empType = forPartner
          ? state.partnerEmploymentType
          : state.employmentType;
        return empType === 'self-employed';
      },
    },

    // Contract / Commission
    {
      id: `${prefix}contract-commission`,
      title: `Contract/Commission Documents${labelSuffix}`,
      icon: FileText,
      items: [
        {
          id: `${prefix}employment-contracts`,
          label: 'Employment contracts',
        },
        {
          id: `${prefix}commission-statements`,
          label: 'Commission statements (12 months)',
        },
        {
          id: `${prefix}compensation-letter`,
          label: 'Letter from employer confirming compensation structure',
        },
      ],
      condition: (state) => {
        const empType = forPartner
          ? state.partnerEmploymentType
          : state.employmentType;
        return empType === 'contract' || empType === 'commission';
      },
    },
  ];
}

const SHARED_CATEGORIES: DocumentCategory[] = [
  // Down Payment Verification — always shown
  {
    id: 'down-payment',
    title: 'Down Payment Verification',
    icon: Wallet,
    items: [
      {
        id: 'bank-statements-90',
        label:
          'Bank statements (90 days, all accounts contributing to down payment)',
      },
      {
        id: 'investment-statements',
        label: 'Investment account statements (if liquidating investments)',
      },
    ],
  },

  // FHSA
  {
    id: 'fhsa',
    title: 'First Home Savings Account (FHSA)',
    icon: Wallet,
    items: [
      { id: 'fhsa-statements', label: 'FHSA account statements' },
      { id: 'fhsa-receipts', label: 'FHSA contribution receipts' },
      {
        id: 'fhsa-rc725',
        label: 'Qualifying withdrawal form (RC725)',
      },
    ],
    condition: (state) =>
      state.downPaymentSource === 'fhsa' ||
      state.downPaymentSource === 'multiple',
  },

  // RRSP / HBP
  {
    id: 'rrsp-hbp',
    title: "RRSP Home Buyers' Plan (HBP)",
    icon: Wallet,
    items: [
      {
        id: 'rrsp-statements',
        label: 'RRSP statements (showing 90+ day holding period)',
      },
      { id: 'hbp-t1036', label: 'HBP withdrawal form (T1036)' },
      {
        id: 'rrsp-90-day-proof',
        label: 'Proof funds deposited 90+ days before withdrawal',
      },
    ],
    condition: (state) =>
      state.downPaymentSource === 'rrsp-hbp' ||
      state.downPaymentSource === 'multiple',
  },

  // Gift
  {
    id: 'gift',
    title: 'Gift Funds',
    icon: Wallet,
    items: [
      {
        id: 'gift-letter',
        label:
          'Gift letter (signed, stating amount, no repayment expected)',
      },
      {
        id: 'donor-bank-statement',
        label: "Donor's bank statement showing source of gift funds",
      },
      {
        id: 'gift-deposit-proof',
        label: 'Proof of deposit into your account',
      },
    ],
    condition: (state) =>
      state.downPaymentSource === 'gift' ||
      state.downPaymentSource === 'multiple',
  },

  // Sale of property
  {
    id: 'sale-of-property',
    title: 'Sale of Existing Property',
    icon: Home,
    items: [
      {
        id: 'sale-agreement',
        label: 'Sale agreement for existing property',
      },
      {
        id: 'existing-mortgage-statement',
        label: 'Mortgage statement for existing property',
      },
    ],
    condition: (state) =>
      state.downPaymentSource === 'sale-of-property' ||
      state.downPaymentSource === 'multiple',
  },

  // Identification — always shown
  {
    id: 'identification',
    title: 'Identification',
    icon: User,
    items: [
      {
        id: 'photo-id',
        label: 'Government-issued photo ID (2 pieces)',
      },
      { id: 'sin', label: 'Social Insurance Number' },
      {
        id: 'proof-of-address',
        label: 'Proof of current address (utility bill, bank statement)',
      },
    ],
  },

  // Property-specific — always shown
  {
    id: 'property',
    title: 'Property Documents',
    icon: Home,
    items: [
      {
        id: 'purchase-agreement',
        label: 'MLS listing or purchase agreement (once you have one)',
      },
      { id: 'home-inspection', label: 'Home inspection report' },
      {
        id: 'appraisal',
        label: 'Appraisal report (lender usually orders this)',
      },
    ],
  },

  // Condo
  {
    id: 'condo',
    title: 'Condo-Specific Documents',
    icon: Home,
    items: [
      {
        id: 'status-certificate',
        label: 'Status certificate (Ontario) / Form B (BC) / equivalent',
      },
      {
        id: 'condo-financials',
        label: 'Condo corporation financials',
      },
      { id: 'reserve-fund', label: 'Reserve fund study' },
    ],
    condition: (state) => state.propertyType === 'condo',
  },

  // New Construction
  {
    id: 'new-construction',
    title: 'New Construction Documents',
    icon: Home,
    items: [
      {
        id: 'builder-agreement',
        label: "Builder's purchase agreement",
      },
      {
        id: 'floor-plans',
        label: 'Floor plans and specifications',
      },
      {
        id: 'tarion',
        label: 'Tarion registration (Ontario) / warranty enrollment',
      },
      { id: 'occupancy-permit', label: 'Occupancy permit' },
    ],
    condition: (state) => state.propertyType === 'new-construction',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVisibleCategories(state: ChecklistState): DocumentCategory[] {
  const primaryCategories = buildCategories(false);
  const partnerCategories = state.hasPartner ? buildCategories(true) : [];

  const all = [
    ...primaryCategories,
    ...partnerCategories,
    ...SHARED_CATEGORIES,
  ];

  return all.filter((cat) => !cat.condition || cat.condition(state));
}

function getAllVisibleItems(state: ChecklistState): DocumentItem[] {
  return getVisibleCategories(state).flatMap((cat) => cat.items);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DocumentChecklist() {
  const [state, setState] = useState<ChecklistState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const updateField = useCallback(
    <K extends keyof ChecklistState>(key: K, value: ChecklistState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      checkedItems: {
        ...prev.checkedItems,
        [id]: !prev.checkedItems[id],
      },
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Computed values
  const visibleCategories = useMemo(
    () => getVisibleCategories(state),
    [state],
  );

  const allVisibleItems = useMemo(() => getAllVisibleItems(state), [state]);

  const checkedCount = useMemo(
    () =>
      allVisibleItems.filter((item) => state.checkedItems[item.id]).length,
    [allVisibleItems, state.checkedItems],
  );

  const totalCount = allVisibleItems.length;
  const progressPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <section className="section-padding">
      <div className="container max-w-screen-xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-3 md:mb-14">
          <Badge variant="outline" className="gap-1.5">
            <ClipboardList className="size-3" />
            Interactive Checklist
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Document Checklist{' '}
            <span className="text-gradient">Generator</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Get a personalized list of every document you need for your
            mortgage application — based on your situation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          {/* ---------------------------------------------------------------- */}
          {/* LEFT: Form inputs                                                */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            {/* Employment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="size-5 text-chart-1" />
                  Your Situation
                </CardTitle>
                <CardDescription>
                  Tell us about yourself so we can customize your checklist
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Employment type */}
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select
                    value={state.employmentType}
                    onValueChange={(v) =>
                      updateField('employmentType', v as EmploymentType)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salaried">Salaried</SelectItem>
                      <SelectItem value="self-employed">
                        Self-Employed
                      </SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="commission">
                        Commission-Based
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Partner */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Buying with a partner?</Label>
                    <Button
                      variant={state.hasPartner ? 'default' : 'outline'}
                      size="xs"
                      onClick={() =>
                        updateField('hasPartner', !state.hasPartner)
                      }
                    >
                      {state.hasPartner ? 'Yes' : 'No'}
                    </Button>
                  </div>
                </div>

                {state.hasPartner && (
                  <div className="space-y-2">
                    <Label>Partner's Employment Type</Label>
                    <Select
                      value={state.partnerEmploymentType}
                      onValueChange={(v) =>
                        updateField(
                          'partnerEmploymentType',
                          v as EmploymentType,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried</SelectItem>
                        <SelectItem value="self-employed">
                          Self-Employed
                        </SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="commission">
                          Commission-Based
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Down payment & property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="size-5 text-chart-2" />
                  Down Payment & Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Down payment source */}
                <div className="space-y-2">
                  <Label>Down Payment Source</Label>
                  <Select
                    value={state.downPaymentSource}
                    onValueChange={(v) =>
                      updateField('downPaymentSource', v as DownPaymentSource)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="fhsa">FHSA</SelectItem>
                      <SelectItem value="rrsp-hbp">
                        RRSP (Home Buyers' Plan)
                      </SelectItem>
                      <SelectItem value="gift">Gift</SelectItem>
                      <SelectItem value="sale-of-property">
                        Sale of Property
                      </SelectItem>
                      <SelectItem value="multiple">
                        Multiple Sources
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property type */}
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={state.propertyType}
                    onValueChange={(v) =>
                      updateField('propertyType', v as PropertyType)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resale">Resale</SelectItem>
                      <SelectItem value="new-construction">
                        New Construction
                      </SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Select
                    value={state.province}
                    onValueChange={(v) =>
                      updateField('province', v as Province)
                    }
                  >
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

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                Print Checklist
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleReset}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT: Generated checklist                                        */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6">
            {/* Progress */}
            <Card
              className={cn(
                'transition-colors',
                progressPct === 100
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-chart-1/20 bg-chart-1/5',
              )}
            >
              <CardContent className="flex flex-col items-center gap-2 py-2 text-center">
                {progressPct === 100 ? (
                  <CheckCircle2 className="size-8 text-green-500" />
                ) : null}
                <p className="text-muted-foreground text-sm">
                  Documents Gathered
                </p>
                <p
                  className={cn(
                    'text-4xl font-bold tracking-tight',
                    progressPct === 100 ? 'text-green-600 dark:text-green-400' : 'text-gradient',
                  )}
                >
                  {checkedCount} of {totalCount}
                </p>
                {/* Progress bar */}
                <div className="bg-muted mt-1 h-2 w-full max-w-xs overflow-hidden rounded-full">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      progressPct === 100
                        ? 'bg-green-500'
                        : 'from-chart-1 via-chart-2 to-chart-3 bg-gradient-to-r',
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document categories */}
            {visibleCategories.map((category) => {
              const catChecked = category.items.filter(
                (item) => state.checkedItems[item.id],
              ).length;
              const catTotal = category.items.length;

              return (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <category.icon className="size-4 text-chart-1" />
                        {category.title}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-normal',
                          catChecked === catTotal
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-muted-foreground',
                        )}
                      >
                        {catChecked}/{catTotal}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {category.items.map((item) => {
                      const isChecked = !!state.checkedItems[item.id];
                      return (
                        <label
                          key={item.id}
                          className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
                            isChecked
                              ? 'border-green-500/30 bg-green-500/5'
                              : 'hover:bg-muted/50',
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mt-0.5"
                          />
                          <span
                            className={cn(
                              'text-sm leading-snug',
                              isChecked &&
                                'text-muted-foreground line-through',
                            )}
                          >
                            {item.label}
                          </span>
                        </label>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}

            {/* Partner note */}
            {state.hasPartner && (
              <Card className="border-chart-2/20 bg-chart-2/5">
                <CardContent className="flex items-start gap-3 py-4">
                  <Users className="size-5 shrink-0 text-chart-2" />
                  <p className="text-muted-foreground text-sm">
                    Your partner's income and employment documents are shown
                    above based on their employment type. Both applicants need
                    to provide their own set of identification documents.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
