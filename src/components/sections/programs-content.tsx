import {
  Building2,
  CircleDollarSign,
  FileText,
  HandCoins,
  HelpCircle,
  Layers,
  MapPin,
  PiggyBank,
  Receipt,
  TrendingUp,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/* ---------- data ---------- */

const FEDERAL_PROGRAMS = [
  {
    icon: PiggyBank,
    name: 'First Home Savings Account (FHSA)',
    amount: '$40,000',
    amountLabel: 'lifetime max',
    description:
      'Contribute up to $8,000/year. Contributions are tax-deductible and withdrawals for a qualifying home purchase are completely tax-free.',
    href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html',
  },
  {
    icon: CircleDollarSign,
    name: "Home Buyers' Plan (HBP)",
    amount: '$60,000',
    amountLabel: 'per person',
    description:
      'Withdraw from your RRSPs for a down payment, interest-free. Couples can combine for up to $120,000. Repay over 15 years.',
    href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html',
  },
  {
    icon: Receipt,
    name: "Home Buyers' Tax Credit (HBTC)",
    amount: '$1,500',
    amountLabel: 'tax credit',
    description:
      'A non-refundable tax credit claimed on your return for the year you purchase your home.',
    href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-31270-home-buyers-amount.html',
  },
  {
    icon: Building2,
    name: 'GST/HST New Housing Rebate',
    amount: 'Varies',
    amountLabel: 'new builds',
    description:
      'Buying a newly constructed home? You may qualify for a rebate that returns a portion of the sales tax paid on the purchase.',
    href: undefined,
  },
];

const PROVINCIAL_HIGHLIGHTS = [
  {
    province: 'Ontario',
    savings: 'Up to $8,475',
    bullets: [
      'Land transfer tax rebate of up to $4,000',
      'Additional Municipal Land Transfer Tax rebate of up to $4,475 for Toronto purchases',
    ],
  },
  {
    province: 'British Columbia',
    savings: 'Up to $14,700',
    bullets: [
      'Full property transfer tax exemption on homes valued up to $835,000 (saves up to $14,700)',
      'Partial exemption for homes between $835,000 and $860,000',
    ],
  },
  {
    province: 'Alberta',
    savings: 'No transfer tax',
    bullets: [
      'No provincial land transfer tax at all',
      'Saves buyers thousands compared to other provinces',
    ],
  },
  {
    province: 'Quebec',
    savings: 'Up to $15,000',
    bullets: [
      'City of Montreal offers grants of up to $15,000 for first-time buyers',
      'Available for purchases within the city',
    ],
  },
  {
    province: 'Maritime Provinces',
    savings: 'Varies',
    bullets: [
      'Various rebates and down payment assistance programs',
      'Tailored to local markets',
    ],
  },
];

const STACKING_ITEMS = [
  { label: 'FHSA down payment (tax-free)', amount: '$40,000', color: 'from-chart-1 to-chart-1' },
  { label: 'RRSP via HBP (interest-free)', amount: '$60,000', color: 'from-chart-2 to-chart-2' },
  { label: 'HBTC tax credit', amount: '$1,500', color: 'from-chart-3 to-chart-3' },
  { label: 'Ontario land transfer rebate', amount: '$4,000', color: 'from-chart-4 to-chart-4' },
];

const FAQ_ITEMS = [
  {
    question: 'Can I use all these programs at once?',
    answer:
      'Yes. Federal programs such as the FHSA, HBP, and HBTC are designed to stack with each other and with provincial programs. There is no rule preventing you from claiming every program you are eligible for on the same purchase. The only requirement is that you meet the individual eligibility criteria for each program, which typically means being a first-time home buyer as defined by each program and using the home as your primary residence.',
  },
  {
    question: 'Do programs change depending on where I live?',
    answer:
      "Federal programs are identical across Canada — every qualifying first-time buyer has access to the FHSA, HBP, and HBTC regardless of province. Provincial programs, however, vary significantly. Some provinces offer land transfer tax rebates, others provide direct grants, and some — like Alberta — have no land transfer tax at all, which is itself a form of savings. It is worth researching the specific programs available in the province where you plan to buy, as the differences can amount to thousands of dollars.",
  },
];

/* ---------- component ---------- */

export default function ProgramsContent() {
  return (
    <div className="space-y-0">
      {/* ── Section 1: Federal Programs ── */}
      <section className="section-padding pb-10">
        <div className="container max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Available in every province
            </Badge>
            <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
              Federal Programs for{' '}
              <span className="text-gradient">Every First-Time Buyer</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg leading-snug">
              The federal government provides several programs designed
              specifically for first-time home buyers — available regardless of
              which province you live in.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEDERAL_PROGRAMS.map((program) => {
              const Icon = program.icon;
              return (
                <Card
                  key={program.name}
                  className={cn(
                    'dark:via-muted/20 dark:to-muted/50 to-background via-card from-card relative h-full bg-gradient-to-br dark:from-transparent',
                    'transition-colors duration-200 hover:bg-accent/40',
                  )}
                >
                  <CardContent className="flex h-full flex-col p-6">
                    {/* Icon */}
                    <div className="from-chart-1 via-chart-2 to-chart-3 flex size-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                      <Icon className="size-5 text-white" />
                    </div>

                    {/* Amount badge */}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-2xl font-bold tracking-tight">
                        {program.amount}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {program.amountLabel}
                      </span>
                    </div>

                    {/* Title & description */}
                    <h3 className="text-accent-foreground mt-2 text-base font-semibold leading-snug">
                      {program.href ? (
                        <a
                          href={program.href}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="hover:text-chart-1 transition-colors"
                        >
                          {program.name}
                        </a>
                      ) : (
                        program.name
                      )}
                    </h3>
                    <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                      {program.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Image Break: Federal Programs ── */}
      <section className="pb-10">
        <div className="container max-w-screen-xl">
          <img
            src="/images/programs/federal-programs.webp"
            alt="Canadian family reviewing first-time home buyer programs and savings strategies"
            loading="lazy"
            className="ring-foreground/5 w-full rounded-xs shadow-2xl ring-6 md:rounded-sm md:ring-16"
            width={1472}
            height={520}
          />
        </div>
      </section>

      {/* ── Section 2: Provincial Highlights ── */}
      <section className="section-padding pb-10">
        <div className="container max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              <MapPin className="mr-1 size-3" />
              Province-specific
            </Badge>
            <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
              How Provincial Programs{' '}
              <span className="text-gradient">Vary</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg leading-snug">
              Provincial programs differ widely and can add up to significant
              savings depending on where you buy.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROVINCIAL_HIGHLIGHTS.map((prov) => (
              <Card
                key={prov.province}
                className={cn(
                  'dark:via-muted/20 dark:to-muted/50 to-background via-card from-card relative bg-gradient-to-br dark:from-transparent',
                  'transition-colors duration-200 hover:bg-accent/40',
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-accent-foreground text-lg font-bold">
                      {prov.province}
                    </h3>
                    <Badge className="from-chart-1 via-chart-2 to-chart-3 border-0 bg-gradient-to-r text-white">
                      {prov.savings}
                    </Badge>
                  </div>
                  <ul className="text-muted-foreground mt-4 space-y-2 text-sm leading-relaxed">
                    {prov.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-chart-2 mt-1 shrink-0">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* CMHC link card */}
            <Card className="dark:via-muted/20 dark:to-muted/50 to-background via-card from-card flex items-center justify-center bg-gradient-to-br dark:from-transparent">
              <CardContent className="p-6 text-center">
                <FileText className="text-muted-foreground mx-auto size-8" />
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  For a comprehensive overview, the{' '}
                  <a
                    href="https://www.cmhc-schl.gc.ca/consumers/home-buying"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:text-chart-1"
                  >
                    CMHC homebuying guide
                  </a>{' '}
                  is an excellent starting point.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Image Break: Provincial ── */}
      <section className="pb-10">
        <div className="container max-w-screen-xl">
          <img
            src="/images/programs/provincial-savings.webp"
            alt="Map of Canada highlighting provincial first-time home buyer incentives and savings"
            loading="lazy"
            className="ring-foreground/5 w-full rounded-xs shadow-2xl ring-6 md:rounded-sm md:ring-16"
            width={1472}
            height={520}
          />
        </div>
      </section>

      {/* ── Section 3: Stacking Programs ── */}
      <section className="section-padding pb-10">
        <div className="container max-w-screen-xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: text + visual */}
            <div>
              <Badge variant="outline" className="mb-4">
                <Layers className="mr-1 size-3" />
                Stack for maximum savings
              </Badge>
              <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
                Combine Programs for{' '}
                <span className="text-gradient">$105,000+</span> in Benefits
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-snug">
                The real power comes from combining multiple programs on a single
                purchase. Here's what an Ontario buyer purchasing a{' '}
                <strong className="text-foreground">$500,000</strong> home could
                access:
              </p>
            </div>

            {/* Right: stacking visualization */}
            <Card className="dark:via-muted/20 dark:to-muted/50 to-background via-card from-card bg-gradient-to-br dark:from-transparent">
              <CardContent className="p-6 md:p-8">
                <div className="space-y-4">
                  {STACKING_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div
                        className={cn(
                          'h-10 w-2 shrink-0 rounded-full bg-gradient-to-b',
                          item.color,
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm leading-snug">{item.label}</p>
                      </div>
                      <span className="text-lg font-bold tracking-tight">
                        {item.amount}
                      </span>
                    </div>
                  ))}

                  {/* Divider + total */}
                  <div className="border-border border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-chart-2 size-5" />
                        <span className="font-semibold">Combined benefit</span>
                      </div>
                      <span className="text-gradient text-2xl font-bold tracking-tight">
                        $105,500
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      In tax-advantaged funds and savings applied to a single
                      transaction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Section 4: FAQ ── */}
      <section className="section-padding pt-10">
        <div className="container max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="mr-1 size-3" />
              Common questions
            </Badge>
            <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
              Frequently Asked{' '}
              <span className="text-gradient">Questions</span>
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6">
            {FAQ_ITEMS.map((item) => (
              <Card
                key={item.question}
                className={cn(
                  'dark:via-muted/20 dark:to-muted/50 to-background via-card from-card bg-gradient-to-br dark:from-transparent',
                )}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-4">
                    <HandCoins className="text-chart-1 mt-1 size-5 shrink-0" />
                    <div>
                      <h3 className="text-accent-foreground text-lg font-bold">
                        {item.question}
                      </h3>
                      <p className="text-muted-foreground mt-3 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
