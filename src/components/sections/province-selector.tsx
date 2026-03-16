'use client';

import { useState } from 'react';

import { ArrowRight, DollarSign, MapPin, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { cn } from '@/lib/utils';

interface Program {
  name: string;
  description: string;
  amount?: string;
}

interface ProvinceData {
  slug: string;
  name: string;
  docsUrl: string;
  programs: Program[];
  combinedSavings: string;
  highlight: string;
}

const FEDERAL_HBTC = 1500;
const AVERAGE_FHSA_TAX_SAVINGS = 8000;

const PROVINCES: ProvinceData[] = [
  {
    slug: 'ontario',
    name: 'Ontario',
    docsUrl: '/guide/4-government-programs/2-ontario/',
    programs: [
      {
        name: 'Land Transfer Tax Rebate',
        description:
          'Refund of the provincial land transfer tax for first-time buyers.',
        amount: 'up to $4,000',
      },
      {
        name: 'Toronto Municipal LTT Rebate',
        description:
          'Additional rebate if buying in the City of Toronto (stacks with the provincial rebate).',
        amount: 'up to $4,475',
      },
      {
        name: 'HST Rebate on New Homes',
        description:
          'GST/HST new housing rebate for newly built or substantially renovated homes.',
        amount: 'up to $24,000',
      },
    ],
    combinedSavings: 'up to $41,975',
    highlight: 'Largest combined rebate potential in Canada',
  },
  {
    slug: 'british-columbia',
    name: 'British Columbia',
    docsUrl: '/guide/4-government-programs/3-british-columbia/',
    programs: [
      {
        name: 'Property Transfer Tax Exemption',
        description:
          'Full exemption on purchases up to $500K for qualifying first-time buyers.',
        amount: 'saves up to $8,000',
      },
      {
        name: 'Newly Built Home Exemption',
        description:
          'Additional PTT exemption for new builds valued up to $750K.',
        amount: 'up to $750K eligible',
      },
      {
        name: 'BC Home Owner Grant',
        description:
          'Annual property tax reduction for owner-occupied homes.',
        amount: '$570/year reduction',
      },
    ],
    combinedSavings: 'up to $17,500+',
    highlight: 'Strong exemptions for new builds',
  },
  {
    slug: 'alberta',
    name: 'Alberta',
    docsUrl: '/guide/4-government-programs/4-alberta-prairies/',
    programs: [
      {
        name: 'No Provincial Land Transfer Tax',
        description:
          'Alberta does not charge a land transfer tax, saving thousands at closing.',
        amount: '$0 transfer tax',
      },
      {
        name: 'Attainable Homes Calgary',
        description:
          'Shared equity program helping buyers purchase with as little as $2,000 down in Calgary.',
        amount: 'shared equity',
      },
      {
        name: 'Lowest Closing Costs in Canada',
        description:
          'With no LTT and competitive legal fees, Alberta has the lowest closing costs nationally.',
      },
    ],
    combinedSavings: 'up to $9,500+',
    highlight: 'No land transfer tax — lowest closing costs in Canada',
  },
  {
    slug: 'quebec',
    name: 'Quebec',
    docsUrl: '/guide/4-government-programs/5-quebec/',
    programs: [
      {
        name: 'Montreal Home Ownership Grant',
        description:
          'Municipal grant for first-time buyers purchasing in Montreal.',
        amount: 'up to $15,000',
      },
      {
        name: 'Welcome Tax (No First-Time Rebate)',
        description:
          'Quebec charges a welcome tax (transfer duty) with no first-time buyer exemption.',
      },
      {
        name: 'QST Rebate on New Homes',
        description:
          'Quebec Sales Tax rebate for qualifying newly constructed homes.',
        amount: 'up to $9,975',
      },
    ],
    combinedSavings: 'up to $34,475',
    highlight: 'Montreal grant is one of the most generous municipal programs',
  },
  {
    slug: 'nova-scotia',
    name: 'Nova Scotia',
    docsUrl: '/guide/4-government-programs/6-atlantic-canada/',
    programs: [
      {
        name: 'Down Payment Assistance',
        description:
          'Interest-free loan covering 5% of the purchase price to help with down payment.',
        amount: '5% interest-free loan',
      },
      {
        name: 'HST Rebate on New Homes',
        description:
          'Federal/provincial HST rebate available on qualifying new builds.',
        amount: 'up to $3,000',
      },
    ],
    combinedSavings: 'up to $12,500+',
    highlight: 'Interest-free down payment loan available',
  },
  {
    slug: 'saskatchewan',
    name: 'Saskatchewan',
    docsUrl: '/guide/4-government-programs/4-alberta-prairies/',
    programs: [
      {
        name: 'PST Rebate on New Construction',
        description:
          'Provincial Sales Tax rebate for newly constructed homes.',
      },
    ],
    combinedSavings: 'up to $9,500+',
    highlight: 'PST rebate on new builds',
  },
  {
    slug: 'manitoba',
    name: 'Manitoba',
    docsUrl: '/guide/4-government-programs/4-alberta-prairies/',
    programs: [
      {
        name: 'Land Transfer Tax Rebate',
        description:
          'Rebate of the provincial land transfer tax for first-time home buyers.',
        amount: 'up to $5,250',
      },
      {
        name: 'Down Payment Assistance',
        description:
          'Income-tested program to help eligible buyers with the down payment.',
        amount: 'income-tested',
      },
    ],
    combinedSavings: 'up to $14,750',
    highlight: 'Generous LTT rebate stacked with down payment help',
  },
  {
    slug: 'new-brunswick',
    name: 'New Brunswick',
    docsUrl: '/guide/4-government-programs/6-atlantic-canada/',
    programs: [
      {
        name: 'HST Rebate on New Homes',
        description:
          'HST new housing rebate for qualifying newly built homes.',
        amount: 'up to $3,000',
      },
      {
        name: 'Low Transfer Tax Rate',
        description:
          'New Brunswick has one of the lowest property transfer tax rates at just 1%.',
        amount: '1% rate',
      },
    ],
    combinedSavings: 'up to $12,500+',
    highlight: 'Low 1% transfer tax keeps closing costs down',
  },
  {
    slug: 'pei',
    name: 'Prince Edward Island',
    docsUrl: '/guide/4-government-programs/6-atlantic-canada/',
    programs: [
      {
        name: 'Property Transfer Tax Exemption',
        description:
          'Full exemption from the real property transfer tax for qualifying first-time buyers.',
        amount: 'saves ~$3,000 on $300K',
      },
    ],
    combinedSavings: 'up to $12,500+',
    highlight: 'Full transfer tax exemption for first-time buyers',
  },
  {
    slug: 'newfoundland',
    name: 'Newfoundland & Labrador',
    docsUrl: '/guide/4-government-programs/6-atlantic-canada/',
    programs: [
      {
        name: 'Down Payment Assistance',
        description:
          'Income-tested program providing assistance with your down payment.',
        amount: 'income-tested',
      },
      {
        name: 'HST Rebate on New Builds',
        description:
          'HST new housing rebate available on qualifying new construction.',
      },
    ],
    combinedSavings: 'up to $9,500+',
    highlight: 'Down payment help plus HST rebate on new builds',
  },
];

const ProvinceSelector = ({ className }: { className?: string }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const province = PROVINCES.find((p) => p.slug === selectedProvince);

  return (
    <section className={cn('section-padding', className)}>
      <div className="container max-w-screen-xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-4">
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Programs available in{' '}
            <span className="text-gradient">your province</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Every province offers different first-time buyer incentives. Select
            yours to see what you qualify for — stacked with federal programs
            like the FHSA and HBTC.
          </p>
        </div>

        {/* Province Selector */}
        <div className="mb-8">
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="h-12 w-full max-w-md text-base">
              <MapPin className="mr-1 size-4" />
              <SelectValue placeholder="Select your province" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Province Card */}
        {province && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main programs card */}
            <Card className="dark:via-muted/20 dark:to-muted/50 to-background via-card from-card bg-gradient-to-br dark:from-transparent lg:col-span-2">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-2xl font-bold">
                    {province.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {province.programs.length}{' '}
                    {province.programs.length === 1 ? 'program' : 'programs'}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {province.highlight}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {province.programs.map((program, idx) => (
                    <div
                      key={idx}
                      className="border-border flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="text-accent-foreground font-semibold">
                          {program.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {program.description}
                        </p>
                      </div>
                      {program.amount && (
                        <Badge
                          variant="outline"
                          className="border-chart-1/30 bg-chart-1/10 text-chart-1 mt-2 shrink-0 self-start sm:mt-0"
                        >
                          <DollarSign className="size-3" />
                          {program.amount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <a
                  href={province.docsUrl}
                  className="text-chart-1 hover:text-chart-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  View full details
                  <ArrowRight className="size-4" />
                </a>
              </CardFooter>
            </Card>

            {/* Combined savings card */}
            <Card className="from-chart-1/10 via-chart-2/5 to-card border-chart-1/20 bg-gradient-to-br">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="text-chart-2 size-5" />
                  Combined Savings
                </CardTitle>
                <CardDescription className="text-sm">
                  Federal + provincial programs stacked together
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">
                      Maximum potential savings
                    </p>
                    <p className="text-gradient text-3xl font-bold">
                      {province.combinedSavings}
                    </p>
                  </div>

                  <div className="border-border space-y-3 border-t pt-4">
                    <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
                      Includes
                    </p>

                    {/* Provincial programs */}
                    {province.programs
                      .filter((p) => p.amount)
                      .map((program, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-muted-foreground truncate text-sm">
                            {program.name}
                          </span>
                          <span className="text-accent-foreground shrink-0 text-sm font-medium">
                            {program.amount}
                          </span>
                        </div>
                      ))}

                    {/* Federal programs */}
                    <div className="border-border border-t pt-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-sm">
                          Federal HBTC
                        </span>
                        <span className="text-accent-foreground text-sm font-medium">
                          ${FEDERAL_HBTC.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-sm">
                          FHSA tax savings (avg.)
                        </span>
                        <span className="text-accent-foreground text-sm font-medium">
                          ~${AVERAGE_FHSA_TAX_SAVINGS.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!province && (
          <Card className="dark:via-muted/20 dark:to-muted/50 to-background via-card from-card border-dashed bg-gradient-to-br dark:from-transparent">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="text-muted-foreground mb-4 size-10 opacity-50" />
              <p className="text-muted-foreground text-lg">
                Select a province above to see available first-time buyer
                programs and your potential savings.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ProvinceSelector;
