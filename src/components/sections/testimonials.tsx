'use client';

import { ArrowRight } from 'lucide-react';

import { Marquee } from '@/components/magicui/marquee';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const REVIEWS = [
  {
    name: 'First-time buyer',
    username: 'r/PersonalFinanceCanada',
    body: 'I have $40K saved. Between FHSA and RRSP HBP, I have no idea which to use first or if I can combine them. Why is this so complicated?',
    initials: 'FB',
    color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  },
  {
    name: 'Confused in Ontario',
    username: 'r/RealEstateCanada',
    body: "Just found out about land transfer tax AFTER making an offer. That's an extra $8,000 nobody mentioned. Are there rebates for first-time buyers?",
    initials: 'CO',
    color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Saving for a home',
    username: 'r/MortgagesCanada',
    body: "Can someone explain the stress test like I'm 5? My broker said I qualify for less than I expected and I don't understand why.",
    initials: 'SH',
    color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'New to real estate',
    username: 'r/TorontoRealEstate',
    body: "What are closing costs actually? I budgeted for the down payment but now I'm hearing I need another $15-20K on top of that??",
    initials: 'NR',
    color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  {
    name: 'Moving from renting',
    username: 'r/PersonalFinanceCanada',
    body: 'Is 5% down really enough? What is CMHC insurance and how much does it add to my mortgage? Nobody explains this clearly.',
    initials: 'MR',
    color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  },
  {
    name: 'BC first-timer',
    username: 'r/VancouverRealEstate',
    body: "I wish there was ONE place that listed all the programs I qualify for based on my province. Instead I'm googling 50 different things.",
    initials: 'BC',
    color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  },
];

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2);
const secondRow = REVIEWS.slice(REVIEWS.length / 2);
const Testimonials = () => {
  return (
    <section className="container flex flex-col gap-y-10 overflow-x-hidden py-10 md:py-15 lg:flex-row">
      <div className="flex max-w-lg flex-col gap-15 text-balance">
        <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
          Real questions from real first-time buyers
        </h2>
        <div className="space-y-7.5">
          <p className="text-muted-foreground text-lg leading-snug">
            These are the questions Canadians are actually asking. Our guide
            answers every single one.
          </p>

          <Button
            variant="ghost"
            asChild
            className="text-accent-foreground group gap-3 !px-0 hover:!bg-transparent hover:opacity-90"
          >
            <a href="/guide/welcome/">
              Get the answers
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>

      <div className="relative -mr-[max(2rem,calc((100vw-80rem)/2+5rem))] flex flex-1 flex-col gap-2.25 overflow-hidden mask-l-from-50% mask-l-to-100%">
        <Marquee
          pauseOnHover
          className="py-0 [--duration:20s] [--gap:calc(var(--spacing)*2.25)]"
        >
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee
          reverse
          pauseOnHover
          className="py-0 [--duration:20s] [--gap:calc(var(--spacing)*2.25)]"
        >
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;

const ReviewCard = ({
  name,
  username,
  body,
  initials,
  color,
}: {
  name: string;
  username: string;
  body: string;
  initials: string;
  color: string;
}) => {
  return (
    <Card
      className={cn(
        'hover:bg-accent/60 max-w-xs cursor-pointer gap-4 bg-transparent p-6 md:max-w-sm md:p-8',
        'transition-colors duration-200',
      )}
    >
      <CardHeader className="flex items-center gap-4 p-0">
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
            color,
          )}
        >
          {initials}
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-sm font-bold">{name}</CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            {username}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <blockquote className="text-sm leading-snug">
          {body.split(/(FirstHomeGuide)/g).map((part, index) =>
            part === 'FirstHomeGuide' ? (
              <span key={index} className="text-chart-1">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </blockquote>
      </CardContent>
    </Card>
  );
};
