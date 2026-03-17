import { Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LENDCITY } from '@/lib/lendcity';
import { cn } from '@/lib/utils';

interface LendCityCtaBannerProps {
  headline?: string;
  description?: string;
  className?: string;
}

export default function LendCityCtaBanner({
  headline = 'Ready for the next step?',
  description = 'Our licensed mortgage team can review your numbers and walk you through your options — no obligation, no pressure.',
  className,
}: LendCityCtaBannerProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-chart-1/20 bg-gradient-to-br from-chart-1/5 to-transparent p-6 sm:p-8',
        className,
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">{headline}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end sm:shrink-0">
          <Button size="lg" asChild>
            <a href={LENDCITY.bookingUrl}>Book a Free Call</a>
          </Button>
          <a
            href={`tel:${LENDCITY.phone}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            {LENDCITY.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
