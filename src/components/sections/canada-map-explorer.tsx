'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  DollarSign,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { REGION_PATHS } from './canada-province-svg-paths';

/* ─────────────────────── Types ─────────────────────── */

interface Program {
  name: string;
  description: string;
  amount?: string;
}

interface RegionData {
  slug: string;
  name: string;
  abbr: string;
  docsUrl: string;
  programs: Program[];
  combinedSavings: string;
  highlight: string;
  isTerritory?: boolean;
}

interface PathData {
  d: string;
  labelX: number;
  labelY: number;
}

/* Render order: west → east, provinces first, then territories */
const RENDER_ORDER = [
  'yukon',
  'northwest-territories',
  'nunavut',
  'british-columbia',
  'alberta',
  'saskatchewan',
  'manitoba',
  'ontario',
  'quebec',
  'newfoundland',
  'new-brunswick',
  'nova-scotia',
  'pei',
];

/* ──────────────── Region data ──────────────── */

const FEDERAL_HBTC = 1500;
const AVERAGE_FHSA_TAX_SAVINGS = 8000;

const REGIONS: RegionData[] = [
  {
    slug: 'ontario',
    name: 'Ontario',
    abbr: 'ON',
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
    abbr: 'BC',
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
    abbr: 'AB',
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
    abbr: 'QC',
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
    abbr: 'NS',
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
    abbr: 'SK',
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
    abbr: 'MB',
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
    abbr: 'NB',
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
    abbr: 'PE',
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
    abbr: 'NL',
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
  {
    slug: 'yukon',
    name: 'Yukon',
    abbr: 'YT',
    docsUrl: '/guide/4-government-programs/8-territories/',
    isTerritory: true,
    programs: [
      {
        name: 'No Land Transfer Tax',
        description:
          'Yukon does not levy a land transfer tax, reducing your closing costs.',
        amount: '$0 transfer tax',
      },
      {
        name: 'Yukon Housing — Down Payment Assistance',
        description:
          'The Yukon Housing Corporation offers down payment assistance for qualifying buyers.',
        amount: 'varies',
      },
    ],
    combinedSavings: 'up to $9,500+',
    highlight: 'No transfer tax plus territorial housing assistance',
  },
  {
    slug: 'northwest-territories',
    name: 'Northwest Territories',
    abbr: 'NT',
    docsUrl: '/guide/4-government-programs/8-territories/',
    isTerritory: true,
    programs: [
      {
        name: 'No Land Transfer Tax',
        description:
          'The NWT does not levy a land transfer tax, reducing your closing costs.',
        amount: '$0 transfer tax',
      },
      {
        name: 'PATH Program',
        description:
          'NWT Housing Corporation\u2019s Providing Access To Housing program assists with down payments and closing costs.',
        amount: 'varies',
      },
    ],
    combinedSavings: 'up to $9,500+',
    highlight: 'NWT Housing Corporation offers direct purchase assistance',
  },
  {
    slug: 'nunavut',
    name: 'Nunavut',
    abbr: 'NU',
    docsUrl: '/guide/4-government-programs/8-territories/',
    isTerritory: true,
    programs: [
      {
        name: 'No Land Transfer Tax',
        description:
          'Nunavut does not levy a land transfer tax, reducing your closing costs.',
        amount: '$0 transfer tax',
      },
      {
        name: 'Nunavut Housing Corporation',
        description:
          'Territorial housing programs to assist residents with home ownership.',
        amount: 'varies',
      },
    ],
    combinedSavings: 'up to $9,500+',
    highlight: 'Federal programs fully available with no territorial transfer tax',
  },
];

/* ──────────────── Sub-components ──────────────── */

/** Individual province / territory shape on the map */
const RegionShape = ({
  slug,
  path,
  isTerritory,
  isSelected,
  isHovered,
  index,
  onSelect,
  onHover,
  onLeave,
}: {
  slug: string;
  path: PathData;
  isTerritory: boolean;
  isSelected: boolean;
  isHovered: boolean;
  index: number;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const baseColor = isTerritory ? 'var(--chart-4)' : 'var(--chart-1)';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={slug}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer outline-none focus-visible:outline-2"
    >
      {/* Glow layer (only visible when selected) */}
      {isSelected && (
        <motion.path
          d={path.d}
          fill={baseColor}
          fillOpacity={0.2}
          stroke="none"
          filter="url(#region-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Orbiting border particles (only visible when selected) */}
      {isSelected && (
        <g className="pointer-events-none">
          {/* Use first sub-path for particle motion */}
          <path
            id={`path-${slug}`}
            d={path.d.split(/\s*M\s/).filter(Boolean).map((s, i) => (i === 0 ? `M ${s}` : '')).join('')
              || path.d}
            fill="none"
            stroke="none"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} filter="url(#particle-glow)">
              <circle r={2.5 - i * 0.15} fill="var(--chart-2)" opacity={0.9 - i * 0.1}>
                <animateMotion
                  dur={`${8 + i * 2}s`}
                  begin={`${i * 1.3}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#path-${slug}`} />
                </animateMotion>
              </circle>
              {/* Trailing glow */}
              <circle r={4.5 - i * 0.2} fill="var(--chart-1)" opacity={0.25 - i * 0.03}>
                <animateMotion
                  dur={`${8 + i * 2}s`}
                  begin={`${i * 1.3}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#path-${slug}`} />
                </animateMotion>
              </circle>
            </g>
          ))}
        </g>
      )}

      {/* Main shape */}
      <motion.path
        d={path.d}
        fill={baseColor}
        stroke={baseColor}
        strokeLinejoin="round"
        initial={{ fillOpacity: 0, strokeOpacity: 0 }}
        animate={{
          fillOpacity: isSelected ? 0.55 : isHovered ? 0.35 : isTerritory ? 0.1 : 0.15,
          strokeOpacity: isSelected ? 0.9 : isHovered ? 0.6 : 0.3,
          strokeWidth: isSelected ? 2.5 : isHovered ? 2 : 1.2,
        }}
        transition={{
          duration: 0.25,
          delay: isSelected || isHovered ? 0 : index * 0.03,
        }}
      />

      {/* Province abbreviation label */}
      <motion.text
        x={path.labelX}
        y={path.labelY}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none select-none fill-foreground"
        style={{
          fontSize: ['pei', 'new-brunswick', 'nova-scotia'].includes(slug) ? 6 : 8,
          fontWeight: isSelected ? 700 : 500,
          letterSpacing: '0.02em',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected ? 1 : isHovered ? 0.9 : 0.6 }}
        transition={{ duration: 0.25, delay: index * 0.03 + 0.15 }}
      >
        {REGIONS.find((r) => r.slug === slug)?.abbr}
      </motion.text>
    </g>
  );
};

/** Floating tooltip that shows on hover */
const MapTooltip = ({
  region,
  path,
}: {
  region: RegionData;
  path: PathData;
}) => (
  <motion.g
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 5 }}
    transition={{ duration: 0.15 }}
  >
    <rect
      x={path.labelX - 44}
      y={path.labelY - 34}
      width={88}
      height={22}
      rx={5}
      className="fill-foreground"
      fillOpacity={0.9}
    />
    <text
      x={path.labelX}
      y={path.labelY - 26}
      textAnchor="middle"
      dominantBaseline="central"
      className="fill-background pointer-events-none select-none"
      style={{ fontSize: 7, fontWeight: 600 }}
    >
      {region.name}
    </text>
    <text
      x={path.labelX}
      y={path.labelY - 18}
      textAnchor="middle"
      dominantBaseline="central"
      className="fill-background pointer-events-none select-none"
      style={{ fontSize: 5.5, opacity: 0.8 }}
    >
      {region.combinedSavings} in savings
    </text>
  </motion.g>
);

/** Detail panel showing selected province programs */
const DetailPanel = ({ region }: { region: RegionData }) => (
  <motion.div
    key={region.slug}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="flex flex-col gap-5"
  >
    {/* Programs card */}
    <Card className="dark:via-muted/20 dark:to-muted/50 to-background via-card from-card overflow-hidden bg-gradient-to-br dark:from-transparent">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-2xl font-bold">{region.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {region.programs.length}{' '}
            {region.programs.length === 1 ? 'program' : 'programs'}
          </Badge>
          {region.isTerritory && (
            <Badge variant="outline" className="text-xs">
              Territory
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm">{region.highlight}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {region.programs.map((program, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.25 }}
            className="border-border flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="text-accent-foreground text-sm font-semibold">
                {program.name}
              </h4>
              <p className="text-muted-foreground text-sm">
                {program.description}
              </p>
            </div>
            {program.amount && (
              <Badge
                variant="outline"
                className="border-chart-1/30 bg-chart-1/10 text-chart-1 mt-1 shrink-0 self-start text-xs sm:mt-0"
              >
                <DollarSign className="size-3" />
                {program.amount}
              </Badge>
            )}
          </motion.div>
        ))}
      </CardContent>

      <CardFooter>
        <a
          href={region.docsUrl}
          className="text-chart-1 hover:text-chart-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          View full details in the guide
          <ArrowRight className="size-4" />
        </a>
      </CardFooter>
    </Card>

    {/* Combined savings card */}
    <Card className="from-chart-1/10 via-chart-2/5 to-card border-chart-1/20 bg-gradient-to-br">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="text-chart-2 size-5" />
          Combined Savings
        </CardTitle>
        <CardDescription className="text-xs">
          Federal + {region.isTerritory ? 'territorial' : 'provincial'} programs
          stacked together
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">
              Maximum potential savings
            </p>
            <motion.p
              className="text-gradient text-3xl font-bold"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {region.combinedSavings}
            </motion.p>
          </div>
          <div className="border-border space-y-3 border-t pt-4">
            <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
              Includes
            </p>
            {region.programs
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
  </motion.div>
);

/* ──────────────── Main component ──────────────── */

const CanadaMapExplorer = ({ className }: { className?: string }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const region = REGIONS.find((r) => r.slug === selected) ?? null;
  const hoveredRegion = REGIONS.find((r) => r.slug === hovered) ?? null;

  const handleSelect = useCallback(
    (slug: string) => {
      setSelected((prev) => (prev === slug ? null : slug));
    },
    [],
  );

  return (
    <section className={cn('section-padding', className)}>
      <div className="container max-w-screen-xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-4">
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Programs by{' '}
            <span className="text-gradient">province &amp; territory</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Click any region on the map to see the first-time buyer incentives
            available there — stacked with federal programs like the FHSA and
            HBTC.
          </p>
        </div>

        {/* Map + Detail grid */}
        <div className="grid items-start gap-8 lg:grid-cols-5">
          {/* Map column */}
          <div className="lg:col-span-3">
            {/* SVG Map */}
            <div className="border-border/50 bg-card/50 relative overflow-hidden rounded-2xl border p-4 backdrop-blur-sm md:p-6">
              <svg
                viewBox="0 0 629 609"
                className="h-auto w-full"
                role="img"
                aria-label="Interactive map of Canada showing provinces and territories"
              >
                <defs>
                  {/* Glow filter for selected province */}
                  <filter
                    id="region-glow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>

                  {/* Particle glow filter */}
                  <filter
                    id="particle-glow"
                    x="-200%"
                    y="-200%"
                    width="500%"
                    height="500%"
                  >
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>

                  {/* Subtle background gradient */}
                  <linearGradient
                    id="map-bg"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--chart-1)"
                      stopOpacity="0.03"
                    />
                    <stop
                      offset="50%"
                      stopColor="var(--chart-2)"
                      stopOpacity="0.02"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--chart-3)"
                      stopOpacity="0.03"
                    />
                  </linearGradient>
                </defs>

                {/* Background */}
                <rect
                  x="0"
                  y="0"
                  width="629"
                  height="609"
                  fill="url(#map-bg)"
                  rx="8"
                />

                {/* Province/Territory shapes */}
                {RENDER_ORDER.map((slug, index) => {
                  const path = REGION_PATHS[slug];
                  const regionData = REGIONS.find((r) => r.slug === slug);
                  if (!path || !regionData) return null;

                  return (
                    <RegionShape
                      key={slug}
                      slug={slug}
                      path={path}
                      isTerritory={regionData.isTerritory ?? false}
                      isSelected={selected === slug}
                      isHovered={hovered === slug}
                      index={index}
                      onSelect={() => handleSelect(slug)}
                      onHover={() => setHovered(slug)}
                      onLeave={() => setHovered(null)}
                    />
                  );
                })}

                {/* Tooltip on hover (not on selected, not on touch) */}
                <AnimatePresence>
                  {hovered &&
                    hovered !== selected &&
                    hoveredRegion &&
                    REGION_PATHS[hovered] && (
                      <MapTooltip
                        key={`tooltip-${hovered}`}
                        region={hoveredRegion}
                        path={REGION_PATHS[hovered]}
                      />
                    )}
                </AnimatePresence>
              </svg>
            </div>

            {/* Province pills for easier mobile selection */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => handleSelect(r.slug)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                    selected === r.slug
                      ? 'border-chart-1/50 bg-chart-1/15 text-chart-1'
                      : 'border-border text-muted-foreground hover:border-chart-1/30 hover:text-foreground',
                  )}
                >
                  {r.abbr}
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel column */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {region ? (
                <div key={region.slug} className="relative">
                  <button
                    onClick={() => setSelected(null)}
                    className="text-muted-foreground hover:text-foreground absolute -top-1 right-0 z-10 rounded-full p-1 transition-colors"
                    aria-label="Close detail panel"
                  >
                    <X className="size-4" />
                  </button>
                  <DetailPanel region={region} />
                </div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="dark:via-muted/20 dark:to-muted/50 to-background via-card from-card border-dashed bg-gradient-to-br dark:from-transparent">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                      <MapPin className="text-muted-foreground mb-4 size-10 opacity-40" />
                      <p className="text-muted-foreground max-w-xs text-base">
                        Click a province or territory on the map to explore
                        first-time buyer programs and your potential savings.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanadaMapExplorer;
