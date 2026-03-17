'use client';

import { useEffect, useState } from 'react';

import { ArrowRight, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MilestoneCelebrationProps {
  moduleNumber: number;
  moduleName: string;
  totalModules: number;
  nextModuleHref?: string;
  nextModuleName?: string;
}

const PROGRESS_STORAGE_KEY = 'fhg-guide-progress';

interface GuideProgress {
  completedModules: number[];
}

function loadProgress(): GuideProgress {
  if (typeof window === 'undefined') return { completedModules: [] };
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { completedModules: [] };
  } catch {
    return { completedModules: [] };
  }
}

function isModuleComplete(moduleNumber: number): boolean {
  const progress = loadProgress();
  return progress.completedModules?.includes(moduleNumber) ?? false;
}

function getCompletedCount(): number {
  const progress = loadProgress();
  return progress.completedModules?.length ?? 0;
}

export default function MilestoneCelebration({
  moduleNumber,
  moduleName,
  totalModules,
  nextModuleHref,
  nextModuleName,
}: MilestoneCelebrationProps) {
  const [complete, setComplete] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const moduleComplete = isModuleComplete(moduleNumber);
    setComplete(moduleComplete);
    setCompletedCount(getCompletedCount());
    setMounted(true);
  }, [moduleNumber]);

  if (!mounted || !complete) {
    return null;
  }

  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="my-8 not-content">
      <Card
        className={cn(
          'relative overflow-hidden',
          'border-chart-1/30',
          'bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5',
        )}
      >
        {/* Decorative gradient border effect */}
        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-chart-1/20 via-chart-2/20 to-chart-3/20 [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude]" />

        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-chart-1/10">
              <Trophy className="size-5 text-chart-1" />
            </span>
            <div>
              <CardTitle className="text-gradient">
                Module {moduleNumber} Complete!
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {moduleName}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">
            You now know more about{' '}
            <span className="font-medium">{moduleName.toLowerCase()}</span> than
            85% of first-time buyers. That knowledge gives you a real advantage.
          </p>

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-medium tabular-nums">
                {completedCount} of {totalModules} modules completed
              </span>
            </div>
            <div
              className="bg-muted h-2 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Guide progress: ${completedCount} of ${totalModules} modules completed`}
            >
              <div
                className={cn(
                  'h-full rounded-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 transition-all duration-500',
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>

        {nextModuleHref && nextModuleName && (
          <CardFooter>
            <Button asChild>
              <a href={nextModuleHref}>
                Continue to Module {moduleNumber + 1}: {nextModuleName}
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
