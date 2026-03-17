'use client';

import { useCallback, useEffect, useState } from 'react';

import { Check, RotateCcw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ChecklistItem {
  id: string;
  label: string;
  category?: string;
}

interface InteractiveChecklistProps {
  checklistId: string;
  items: ChecklistItem[];
  title?: string;
}

function getStorageKey(checklistId: string) {
  return `fhg-checklist-${checklistId}`;
}

function loadCheckedState(checklistId: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(getStorageKey(checklistId));
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveCheckedState(
  checklistId: string,
  state: Record<string, boolean>,
) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(checklistId), JSON.stringify(state));
  } catch {
    // localStorage may be full or unavailable
  }
}

export default function InteractiveChecklist({
  checklistId,
  items,
  title,
}: InteractiveChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecked(loadCheckedState(checklistId));
    setMounted(true);
  }, [checklistId]);

  const toggleItem = useCallback(
    (itemId: string) => {
      setChecked((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };
        saveCheckedState(checklistId, next);
        return next;
      });
    },
    [checklistId],
  );

  const resetProgress = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to reset this checklist? All progress will be cleared.',
      )
    ) {
      setChecked({});
      saveCheckedState(checklistId, {});
    }
  }, [checklistId]);

  const completedCount = items.filter((item) => checked[item.id]).length;
  const totalCount = items.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group items by category
  const categories = new Map<string, ChecklistItem[]>();
  for (const item of items) {
    const cat = item.category || '';
    if (!categories.has(cat)) {
      categories.set(cat, []);
    }
    categories.get(cat)!.push(item);
  }

  if (!mounted) {
    return (
      <Card className="my-6 not-content">
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          <div className="text-muted-foreground text-sm">Loading checklist...</div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="my-6 not-content">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {title && <CardTitle>{title}</CardTitle>}
            <Badge
              variant={completedCount === totalCount ? 'default' : 'outline'}
              className="tabular-nums"
            >
              {completedCount} of {totalCount} completed
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={resetProgress}
            className="text-muted-foreground no-print"
            aria-label="Reset checklist progress"
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        </div>
        {/* Progress bar */}
        <div
          className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Checklist progress: ${completedCount} of ${totalCount} completed`}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              completedCount === totalCount
                ? 'bg-chart-1'
                : 'bg-chart-1/70',
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {[...categories.entries()].map(([category, categoryItems]) => (
          <div key={category || '__default'}>
            {category && (
              <h4 className="text-accent-foreground mb-3 text-sm font-semibold">
                {category}
              </h4>
            )}
            <ul className="space-y-2">
              {categoryItems.map((item) => {
                const isChecked = !!checked[item.id];
                return (
                  <li key={item.id}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/50',
                        isChecked && 'opacity-70',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
                          isChecked
                            ? 'border-chart-1 bg-chart-1 text-white'
                            : 'border-input bg-background',
                        )}
                      >
                        {isChecked && <Check className="size-3.5" />}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => toggleItem(item.id)}
                        aria-label={item.label}
                      />
                      <span
                        className={cn(
                          'text-sm leading-snug',
                          isChecked && 'line-through',
                        )}
                      >
                        {item.label}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </CardContent>

      {completedCount === totalCount && totalCount > 0 && (
        <CardFooter className="border-t pt-4">
          <p className="text-chart-1 flex items-center gap-2 text-sm font-medium">
            <Check className="size-4" />
            All items completed — great work!
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
