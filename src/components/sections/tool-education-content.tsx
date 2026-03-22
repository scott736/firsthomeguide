import type { LucideIcon } from 'lucide-react';
import { HelpCircle } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface EducationSection {
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

export interface HighlightStat {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
}

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface ToolEducationContentProps {
  badge: string;
  badgeIcon?: LucideIcon;
  title: string;
  titleGradient: string;
  subtitle: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  highlights?: HighlightStat[];
  sections: EducationSection[];
  faqs?: FAQItem[];
}

const ICON_COLORS = [
  'bg-chart-1/15 text-chart-1',
  'bg-chart-2/15 text-chart-2',
  'bg-chart-3/15 text-chart-3',
  'bg-chart-4/15 text-chart-4',
];

export default function ToolEducationContent({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleGradient,
  subtitle,
  heroImage,
  highlights,
  sections,
  faqs,
}: ToolEducationContentProps) {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="section-padding pb-10">
        <div className="container max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              {BadgeIcon && <BadgeIcon className="mr-1 size-3" />}
              {badge}
            </Badge>
            <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
              {title}{' '}
              <span className="text-gradient">{titleGradient}</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg leading-snug">
              {subtitle}
            </p>
          </div>

          {heroImage && (
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              loading="lazy"
              className="ring-foreground/5 mt-12 w-full rounded-xs shadow-2xl ring-6 md:rounded-sm md:ring-16"
              width={1472}
              height={520}
            />
          )}
        </div>
      </section>

      {/* Highlight Stats */}
      {highlights && highlights.length > 0 && (
        <section className="pb-10">
          <div className="container max-w-screen-xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={i}
                    className={cn(
                      'dark:via-muted/20 dark:to-muted/50 to-background via-card from-card bg-gradient-to-br dark:from-transparent',
                      'transition-colors duration-200 hover:bg-accent/40',
                    )}
                  >
                    <CardContent className="flex items-center gap-4 p-5">
                      <div
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-lg',
                          ICON_COLORS[i % ICON_COLORS.length],
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold tracking-tight">
                          {stat.value}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {stat.label}
                        </p>
                        {stat.sublabel && (
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            {stat.sublabel}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Education Sections */}
      <section className="pb-10">
        <div className="container max-w-screen-xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {sections.map((section, i) => {
              const Icon = section.icon;
              const isFullWidth =
                i === 0 || (sections.length % 2 !== 0 && i === sections.length - 1);
              return (
                <Card
                  key={i}
                  className={cn(
                    'dark:via-muted/20 dark:to-muted/50 to-background via-card from-card bg-gradient-to-br dark:from-transparent',
                    isFullWidth && 'md:col-span-2',
                  )}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-lg',
                          ICON_COLORS[i % ICON_COLORS.length],
                        )}
                      >
                        <Icon className="size-4.5" />
                      </div>
                      <h3 className="text-accent-foreground text-lg font-bold">
                        {section.title}
                      </h3>
                    </div>
                    <div className="text-muted-foreground space-y-3 text-sm leading-relaxed [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-chart-1 [&_strong]:text-accent-foreground [&_strong]:font-semibold [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1">
                      {section.content}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="section-padding pt-0 pb-0">
          <div className="container max-w-screen-xl">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
                  <HelpCircle className="size-4.5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Frequently Asked Questions
                </h3>
              </div>
              <Accordion type="multiple" className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-base font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-chart-1">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
