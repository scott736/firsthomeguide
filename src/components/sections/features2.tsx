import { useCallback, useEffect, useRef, useState } from 'react';

import type { EmblaCarouselType } from 'embla-carousel';
import {
  BookOpen,
  Home,
  MapPin,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { useInView } from 'motion/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import { NumberTicker } from '@/components/magicui/number-ticker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { LENDCITY } from '@/lib/lendcity';
import { cn } from '@/lib/utils';

const MAIN_CHART_DATA = [
  { month: 'Module 1', confidence: 20, knowledge: 10 },
  { month: 'Module 2', confidence: 30, knowledge: 22 },
  { month: 'Module 3', confidence: 42, knowledge: 35 },
  { month: 'Module 4', confidence: 55, knowledge: 48 },
  { month: 'Module 5', confidence: 65, knowledge: 58 },
  { month: 'Module 6', confidence: 75, knowledge: 68 },
  { month: 'Module 7', confidence: 85, knowledge: 78 },
  { month: 'Module 8', confidence: 95, knowledge: 90 },
];

const SMALL_CHART_DATA = [
  { day: 1, views: 2000 },
  { day: 2, views: 3100 },
  { day: 3, views: 3600 },
  { day: 4, views: 3400 },
  { day: 5, views: 5600 },
  { day: 6, views: 4800 },
  { day: 7, views: 5812 },
  { day: 9, views: 6812 },
  { day: 10, views: 9812 },
  { day: 11, views: 12012 },
];

const Features2 = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isChartInView = useInView(cardRef, { once: true, amount: 0.5 });
  return (
    <section className="section-padding">
      <div className="container space-y-8">
        {/* Header */}
        <h2 className="text-4xxl mb-10 max-w-2xl leading-none tracking-tight text-balance md:text-5xl lg:mx-auto lg:mb-15 lg:text-center lg:text-6xl">
          85% of buyers feel unprepared. This guide changes that.
        </h2>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-5">
          {/* Chart Card - spans 2 columns */}
          <Card
            ref={cardRef}
            className="dark:to-muted/30 dark:via-muted/10 to-background via-card from-card relative col-span-1 overflow-hidden bg-gradient-to-t p-6 lg:col-span-2 lg:p-8 dark:from-transparent"
          >
            <CardContent className="relative h-full gap-6 p-0">
              {/* Content overlay */}
              <div className="relative z-10 flex max-w-xs flex-col gap-3">
                <div className="from-muted/30 via-muted/10 to-card flex aspect-square size-10 items-center justify-center rounded-md border bg-gradient-to-r p-2">
                  <Home className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-accent-foreground text-lg font-bold lg:text-xl">
                  The Knowledge Gap
                </h3>
                <p className="text-muted-foreground leading-snug lg:text-lg">
                  Canadian home buyers face scattered resources, hidden costs,
                  and complex programs with no single guide to connect them.
                </p>
              </div>

              {/* Chart */}
              <div className="pointer-events-auto h-48 w-full lg:absolute lg:right-0 lg:bottom-0 lg:h-80">
                {isChartInView && (
                  <ChartContainer
                    config={{
                      confidence: {
                        label: 'Confidence',
                        color: 'var(--chart-2)',
                      },
                      knowledge: {
                        label: 'Knowledge',
                        color: 'var(--chart-4)',
                      },
                    }}
                    className="h-full w-full [&_.recharts-yAxis_.recharts-cartesian-axis-tick-value]:hidden [&_.recharts-yAxis_.recharts-cartesian-axis-tick-value]:lg:block"
                  >
                    <LineChart
                      data={MAIN_CHART_DATA}
                      margin={{ right: 24, left: 0 }}
                      className="-ml-14 lg:-ml-6"
                    >
                      <CartesianGrid
                        strokeDasharray="none"
                        stroke="var(--border)"
                        opacity={0.3}
                        horizontal={true}
                        vertical={false}
                        horizontalCoordinatesGenerator={(props) => {
                          if (typeof props.yAxis?.scale !== 'function') return [];
                          return [
                            props.yAxis.scale(25),
                            props.yAxis.scale(50),
                            props.yAxis.scale(75),
                            props.yAxis.scale(100),
                          ];
                        }}
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={true}
                        tickMargin={8}
                        tick={{ fill: 'var(--border)', opacity: 0.7 }}
                        tickFormatter={(value, index) => {
                          // Show only 3 modules equally spaced
                          if (index === 1 || index === 4 || index === 7) {
                            return value;
                          }
                          return '';
                        }}
                        interval={0}
                        padding={{ left: 0, right: 0 }}
                        stroke="var(--border)"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={true}
                        tickMargin={8}
                        tick={{ fill: 'var(--border)', opacity: 0.5 }}
                        ticks={[25, 50, 75, 100]}
                        stroke="var(--border)"
                        domain={[0, 100]}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background flex flex-col items-center gap-2 rounded-lg border p-3 text-xs shadow-md">
                                {[
                                  {
                                    label: 'Confidence',
                                    value: payload[0]?.value,
                                    change: '+74%',
                                    changeClass:
                                      'inline-block rounded-sm bg-green-600/15 px-2 py-1  font-medium text-green-500',
                                  },
                                  {
                                    label: 'Knowledge',
                                    value: payload[1]?.value,
                                    change: '+80%',
                                    changeClass:
                                      'inline-block rounded-sm bg-green-600/15 px-2 py-1  font-medium text-green-500',
                                  },
                                ].map((item) => (
                                  <div
                                    key={item.label}
                                    className="flex items-center gap-3"
                                  >
                                    <span className="text-muted-foreground">
                                      {item.label}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-accent-foreground font-medium">
                                        {item.value}
                                      </span>
                                      <span className={item.changeClass}>
                                        {item.change}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        dataKey="confidence"
                        type="monotone"
                        stroke="var(--chart-2)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 6,
                          fill: 'var(--chart-2)',
                          stroke: 'var(--chart-2)',
                          strokeWidth: 2,
                        }}
                      />
                      <Line
                        dataKey="knowledge"
                        type="monotone"
                        stroke="var(--chart-4)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 6,
                          fill: 'var(--chart-4)',
                          stroke: 'var(--chart-4)',
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="dark:to-muted/50 dark:via-muted/10 to-background via-card from-card relative col-span-1 overflow-hidden bg-gradient-to-br p-6 lg:p-8 dark:from-transparent">
            <CardContent className="flex flex-col gap-6 p-0 lg:gap-8">
              <div className="relative z-10 flex flex-col gap-3">
                <div className="from-muted/30 via-muted/10 to-card flex aspect-square size-10 items-center justify-center rounded-md border bg-gradient-to-r p-2">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-accent-foreground text-lg font-bold lg:text-xl">
                  Built by Mortgage Professionals
                </h3>
                <p className="text-muted-foreground leading-snug lg:text-lg">
                  Created by licensed mortgage advisors at <a href={LENDCITY.website} title={LENDCITY.title} target="_blank" rel="noopener">{LENDCITY.name}</a> who
                  believe every first-time buyer deserves free, expert
                  education — and personal guidance when you're ready.
                </p>
              </div>

              <div>
                {/* Topics Covered Section */}
                <div className="flex items-center justify-between gap-5 lg:items-stretch">
                  <div className="w-1/2">
                    <span className="text-xs font-bold lg:text-sm">
                      Topics Covered
                    </span>
                    <div className="mt-2 flex items-center gap-3">
                      <NumberTicker
                        startValue={30}
                        value={47}
                        className="text-4xxl font-medium lg:text-5xl"
                      />
                    </div>
                    <p className="text-muted-foreground text-xs lg:mt-2">
                      Across 8 modules
                    </p>
                  </div>

                  {/* Small Chart */}
                  <div className="relative flex-1">
                    {isChartInView && (
                      <ChartContainer
                        config={{
                          views: {
                            label: 'Page Views',
                            color: 'var(--chart-2)',
                          },
                        }}
                        className="h-full w-full"
                      >
                        <AreaChart
                          data={SMALL_CHART_DATA}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="runGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="var(--chart-2)"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="100%"
                                stopColor="var(--chart-2)"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            dataKey="views"
                            stroke="var(--chart-2)"
                            fill="url(#runGradient)"
                            strokeWidth={2}
                            dot={false}
                            type="monotone"
                          />
                        </AreaChart>
                      </ChartContainer>
                    )}
                  </div>
                </div>

                <Separator className="mt-5 mb-8 lg:mt-6" />

                {/* Bottom Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Government Programs',
                      value: '30+',
                      change: 'Federal + Provincial',
                      changeClass: 'bg-green-800/10 text-green-800',
                    },
                    {
                      label: 'Provinces Covered',
                      value: '10',
                      change: 'All of Canada',
                      changeClass: 'bg-green-800/10 text-green-800',
                    },
                    {
                      label: 'Average Read Time',
                      value: '45m',
                      change: 'Self-paced',
                      changeClass: 'bg-green-800/10 text-green-800',
                    },
                  ].map((stat, idx) => (
                    <div
                      className="flex flex-col justify-between md:gap-1"
                      key={idx}
                    >
                      <div className="text-muted-foreground leading-tighter text-xs md:text-sm">
                        {stat.label}
                      </div>
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-xl font-medium md:text-2xl">
                          {stat.value}
                        </span>
                        <span
                          className={cn(
                            'rounded-full text-xs font-medium',
                            stat.changeClass,
                          )}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards Carousel */}
        <FeatureCarousel />

        <div className="flex justify-center gap-4">
          <Button
            variant="secondary"
            className="border-input bg-accent max-w-64 flex-1 border"
            asChild
          >
            <a href="/guide/welcome/">Start Learning</a>
          </Button>
          <Button
            variant="outline"
            className="max-w-64 flex-1"
            asChild
          >
            <a href={LENDCITY.bookingUrl}>Talk to an Advisor</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

const featureCards: { icon: typeof Shield; title: string; description: React.ReactNode }[] = [
  {
    icon: Shield,
    title: 'Expert-Backed Education',
    description:
      <>Built by licensed mortgage professionals at <a href="https://lendcity.ca" title="LendCity Mortgages – Licensed Mortgage Professionals in Canada" target="_blank" rel="noopener">LendCity</a>. The education is free and unbiased — when you're ready for personalized help, we're here.</>,
  },
  {
    icon: MapPin,
    title: 'Province-Specific',
    description:
      'Programs and costs vary wildly by province. We break it all down so nothing catches you off guard.',
  },
  {
    icon: BookOpen,
    title: 'Plain Language',
    description:
      'GDS ratios? Stress tests? Amortization? We explain every concept in language anyone can understand.',
  },
  {
    icon: RefreshCw,
    title: 'Updated for 2026',
    description:
      'New FHSA limits, HBP repayment changes, proposed GST elimination on new builds — all covered.',
  },
];

const FeatureCarousel = () => {
  const [api, setApi] = useState<EmblaCarouselType>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCurrent(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);
  }, [api, onSelect]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: false,
      }}
    >
      <CarouselContent className="cursor-grab snap-x snap-mandatory">
        {featureCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <CarouselItem key={idx} className="min-w-xs basis-1/4 snap-start">
              <Card
                className={cn(
                  'bg-card border-0 dark:bg-transparent',
                  current === idx &&
                    'dark:from-muted/50 dark:via-muted/10 to-card via-card from-background bg-gradient-to-r dark:to-transparent',
                )}
              >
                <CardContent className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <IconComponent className="h-4 w-4" />
                    <h4 className="text-lg leading-tight">
                      {card.title}
                    </h4>
                  </div>
                  <p
                    className="text-muted-foreground hidden text-sm leading-snug md:block"
                  >
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default Features2;
