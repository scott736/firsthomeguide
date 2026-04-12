'use client';

import { useState, useCallback } from 'react';

import {
  ArrowRight,
  DollarSign,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { REGION_PATHS } from './canada-province-svg-paths';

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

/* ──────────── Per-province color palette ──────────── */

const PROVINCE_COLORS: Record<string, string> = {
  'british-columbia': '#34d399',
  'alberta': '#fbbf24',
  'saskatchewan': '#fb923c',
  'manitoba': '#f87171',
  'ontario': '#818cf8',
  'quebec': '#a78bfa',
  'new-brunswick': '#f472b6',
  'nova-scotia': '#fb7185',
  'pei': '#e879f9',
  'newfoundland': '#c084fc',
  'yukon': '#22d3ee',
  'northwest-territories': '#2dd4bf',
  'nunavut': '#67e8f9',
};

/* Render order: back-to-front (territories behind, then west → east) */
const RENDER_ORDER = [
  'nunavut',
  'northwest-territories',
  'yukon',
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
  isSelected,
  isHovered,
  index,
  color,
  onSelect,
  onHover,
  onLeave,
}: {
  slug: string;
  path: PathData;
  isSelected: boolean;
  isHovered: boolean;
  index: number;
  color: string;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) => {
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
      {/* Outer glow layer (selected) */}
      {isSelected && (
        <motion.path
          d={path.d}
          fill={color}
          fillOpacity={0.25}
          stroke="none"
          filter="url(#region-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Hover glow layer */}
      {isHovered && !isSelected && (
        <motion.path
          d={path.d}
          fill={color}
          fillOpacity={0.12}
          stroke="none"
          filter="url(#hover-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Orbiting border particles (selected) */}
      {isSelected && (
        <g className="pointer-events-none">
          <path
            id={`path-${slug}`}
            d={
              path.d
                .split(/\s*M\s/)
                .filter(Boolean)
                .map((s, i) => (i === 0 ? `M ${s}` : ''))
                .join('') || path.d
            }
            fill="none"
            stroke="none"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} filter="url(#particle-glow)">
              <circle
                r={2.5 - i * 0.15}
                fill={color}
                opacity={0.95 - i * 0.12}
              >
                <animateMotion
                  dur={`${7 + i * 1.8}s`}
                  begin={`${i * 1.1}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#path-${slug}`} />
                </animateMotion>
              </circle>
              <circle
                r={5 - i * 0.25}
                fill={color}
                opacity={0.2 - i * 0.025}
              >
                <animateMotion
                  dur={`${7 + i * 1.8}s`}
                  begin={`${i * 1.1}s`}
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
        fill={color}
        stroke={color}
        strokeLinejoin="round"
        initial={{ fillOpacity: 0, strokeOpacity: 0 }}
        animate={{
          fillOpacity: isSelected ? 0.6 : isHovered ? 0.45 : 0.22,
          strokeOpacity: isSelected ? 1 : isHovered ? 0.7 : 0.35,
          strokeWidth: isSelected ? 2.5 : isHovered ? 2 : 1,
        }}
        transition={{
          duration: 0.3,
          delay: isSelected || isHovered ? 0 : index * 0.04,
        }}
      />

      {/* Province abbreviation label */}
      <motion.text
        x={path.labelX}
        y={path.labelY}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none select-none"
        fill="white"
        style={{
          fontSize: ['pei', 'new-brunswick', 'nova-scotia'].includes(slug)
            ? 6
            : 8,
          fontWeight: isSelected ? 700 : 600,
          letterSpacing: '0.04em',
          textShadow: `0 1px 3px rgba(0,0,0,0.6)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected ? 1 : isHovered ? 0.95 : 0.75 }}
        transition={{ duration: 0.3, delay: index * 0.04 + 0.15 }}
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
  color,
}: {
  region: RegionData;
  path: PathData;
  color: string;
}) => (
  <motion.g
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 6 }}
    transition={{ duration: 0.15 }}
    className="pointer-events-none"
  >
    {/* Tooltip background with colored accent */}
    <rect
      x={path.labelX - 52}
      y={path.labelY - 38}
      width={104}
      height={28}
      rx={6}
      fill="rgba(10,10,20,0.92)"
      stroke={color}
      strokeWidth={1}
      strokeOpacity={0.5}
    />
    {/* Colored accent bar */}
    <rect
      x={path.labelX - 52}
      y={path.labelY - 38}
      width={3}
      height={28}
      rx={6}
      fill={color}
      fillOpacity={0.8}
    />
    <text
      x={path.labelX}
      y={path.labelY - 29}
      textAnchor="middle"
      dominantBaseline="central"
      fill="white"
      style={{ fontSize: 7, fontWeight: 600 }}
    >
      {region.name}
    </text>
    <text
      x={path.labelX}
      y={path.labelY - 19}
      textAnchor="middle"
      dominantBaseline="central"
      fill={color}
      style={{ fontSize: 5.5, fontWeight: 500 }}
    >
      {region.combinedSavings} in savings
    </text>
  </motion.g>
);

/** Detail panel showing selected province programs */
const DetailPanel = ({
  region,
  color,
}: {
  region: RegionData;
  color: string;
}) => (
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
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: color }}
          />
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
        <CardDescription className="text-sm">
          {region.highlight}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {region.programs.map((program, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.25 }}
            className="rounded-lg border p-4"
            style={{
              borderColor: `${color}15`,
            }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
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
                  className="mt-1 shrink-0 self-start text-xs sm:mt-0"
                  style={{
                    borderColor: `${color}30`,
                    backgroundColor: `${color}10`,
                    color: color,
                  }}
                >
                  <DollarSign className="size-3" />
                  {program.amount}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </CardContent>

      <CardFooter>
        <a
          href={region.docsUrl}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color }}
        >
          View full details in the guide
          <ArrowRight className="size-4" />
        </a>
      </CardFooter>
    </Card>

    {/* Combined savings card */}
    <Card
      className="overflow-hidden border bg-gradient-to-br"
      style={{
        borderColor: `${color}20`,
        background: `linear-gradient(135deg, ${color}08, transparent 40%, ${color}05)`,
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5" style={{ color }} />
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
              className="text-3xl font-bold"
              style={{ color }}
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

  const handleSelect = useCallback((slug: string) => {
    setSelected((prev) => (prev === slug ? null : slug));
  }, []);

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
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a14] p-4 shadow-2xl md:p-6">
              {/* Ambient background glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(99,102,241,0.12), transparent), radial-gradient(ellipse 50% 40% at 70% 40%, rgba(34,211,238,0.08), transparent), radial-gradient(ellipse 40% 30% at 50% 80%, rgba(244,114,182,0.06), transparent)',
                }}
              />
              <svg
                viewBox="0 0 629 609"
                className="relative h-auto w-full"
                role="img"
                aria-label="Interactive map of Canada showing provinces and territories"
              >
                <defs>
                  {/* Glow filter for selected province */}
                  <filter
                    id="region-glow"
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                  >
                    <feGaussianBlur stdDeviation="12" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>

                  {/* Lighter glow for hover */}
                  <filter
                    id="hover-glow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feGaussianBlur stdDeviation="6" result="blur" />
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
                </defs>

                {/* Subtle grid pattern */}
                <defs>
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="rgba(255,255,255,0.02)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="629"
                  height="609"
                  fill="url(#grid)"
                />

                {/* Province/Territory shapes */}
                {RENDER_ORDER.map((slug, index) => {
                  const path = REGION_PATHS[slug];
                  const regionData = REGIONS.find((r) => r.slug === slug);
                  const color = PROVINCE_COLORS[slug] ?? '#818cf8';
                  if (!path || !regionData) return null;

                  return (
                    <RegionShape
                      key={slug}
                      slug={slug}
                      path={path}
                      isSelected={selected === slug}
                      isHovered={hovered === slug}
                      index={index}
                      color={color}
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
                        color={PROVINCE_COLORS[hovered] ?? '#818cf8'}
                      />
                    )}
                </AnimatePresence>
              </svg>
            </div>

            {/* Province pills for easier mobile selection */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {REGIONS.map((r) => {
                const pillColor = PROVINCE_COLORS[r.slug] ?? '#818cf8';
                const isActive = selected === r.slug;
                return (
                  <button
                    key={r.slug}
                    onClick={() => handleSelect(r.slug)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200',
                      isActive
                        ? 'border-transparent text-white'
                        : 'border-white/10 text-muted-foreground hover:text-white',
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${pillColor}25`,
                            borderColor: `${pillColor}50`,
                            color: pillColor,
                          }
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = `${pillColor}40`;
                        (e.currentTarget as HTMLButtonElement).style.color =
                          pillColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = '';
                        (e.currentTarget as HTMLButtonElement).style.color = '';
                      }
                    }}
                  >
                    {r.abbr}
                  </button>
                );
              })}
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
                  <DetailPanel
                    region={region}
                    color={PROVINCE_COLORS[region.slug] ?? '#818cf8'}
                  />
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
