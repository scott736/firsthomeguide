import { ArrowRight, BookOpen, Calculator, Phone } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WhatsNextItem {
  title: string;
  description: string;
  href: string;
  type: 'guide' | 'tool' | 'action';
}

interface WhatsNextProps {
  items: WhatsNextItem[];
}

const typeIcons = {
  guide: BookOpen,
  tool: Calculator,
  action: Phone,
} as const;

const typeLabels = {
  guide: 'Guide',
  tool: 'Tool',
  action: 'Action',
} as const;

export default function WhatsNext({ items }: WhatsNextProps) {
  return (
    <section className="my-8 not-content">
      <h3 className="mb-4 text-lg font-semibold tracking-tight">
        What to do next
      </h3>

      <div
        className={cn(
          'grid gap-4',
          items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {items.map((item) => {
          const Icon = typeIcons[item.type];

          return (
            <a
              key={item.href}
              href={item.href}
              className="group block no-underline"
            >
              <Card className="h-full transition-colors hover:bg-accent/40">
                <CardContent className="flex h-full flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-chart-1/10">
                      <Icon className="size-4.5 text-chart-1" />
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-snug">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <span className="text-muted-foreground mt-auto text-xs">
                    {typeLabels[item.type]}
                  </span>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </section>
  );
}
