'use client';

import { useRef } from 'react';

import { BookOpen, FileCheck, Home, Key, Phone } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LENDCITY } from '@/lib/lendcity';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    number: 1,
    title: 'Learn',
    description: 'Work through our free 8-module guide at your own pace',
    icon: BookOpen,
  },
  {
    number: 2,
    title: 'Plan',
    description: 'Book a free call to discuss your goals and timeline',
    icon: Phone,
  },
  {
    number: 3,
    title: 'Get Pre-Approved',
    description:
      'We handle your mortgage pre-approval and find the best rate',
    icon: FileCheck,
  },
  {
    number: 4,
    title: 'Find Your Home',
    description:
      'Your realtor partner searches while we keep your financing ready',
    icon: Home,
  },
  {
    number: 5,
    title: 'Close With Confidence',
    description:
      'We coordinate everything from offer to keys in hand',
    icon: Key,
  },
];

const Concierge = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section className="section-padding" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            className="text-4xxl leading-tight tracking-tight md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            From Learning to Keys —{' '}
            <span className="text-gradient">We're With You Every Step</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-snug"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
          >
            FirstHomeGuide.ca is built by {LENDCITY.name}, licensed mortgage
            professionals who provide free education and personalized concierge
            service for first-time home buyers across Canada.
          </motion.p>
        </div>

        {/* Timeline Steps */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {STEPS.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 + index * 0.1,
                }}
                className="relative"
              >
                {/* Connector line (desktop only, between cards) */}
                {index < STEPS.length - 1 && (
                  <div className="from-chart-2/40 to-chart-3/40 absolute top-10 right-0 hidden h-px w-full translate-x-1/2 bg-gradient-to-r lg:block" />
                )}

                <Card
                  className={cn(
                    'relative h-full bg-transparent p-6 transition-colors duration-200',
                    'hover:bg-accent/40',
                  )}
                >
                  <CardContent className="flex flex-col items-center p-0 text-center">
                    {/* Step number */}
                    <div className="from-chart-1 via-chart-2 to-chart-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r text-sm font-bold text-white">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mt-4">
                      <IconComponent className="text-muted-foreground size-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-accent-foreground mt-3 text-lg font-bold">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mt-2 text-sm leading-snug">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.7,
          }}
        >
          <Button asChild size="lg" className="text-base">
            <a href={LENDCITY.bookingUrl} target="_blank" rel="noopener noreferrer">
              Book Your Free Call
            </a>
          </Button>
          <p className="text-muted-foreground text-sm">
            Or call us directly:{' '}
            <a
              href={`tel:${LENDCITY.phone}`}
              className="text-accent-foreground font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              {LENDCITY.phone}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Concierge;
