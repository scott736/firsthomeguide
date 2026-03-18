'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookOpen, Check, ChevronDown, Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CUSTOM_GUIDE_KEY,
  GUIDE_MODULES,
  TOTAL_PAGES,
  type GuidePage,
} from '@/lib/guide-sections';

export default function GuideBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set(GUIDE_MODULES.map((_, i) => i)),
  );

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_GUIDE_KEY);
      if (stored) {
        setSelected(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  const persist = useCallback((next: Set<string>) => {
    setSelected(next);
    try {
      localStorage.setItem(CUSTOM_GUIDE_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }, []);

  const toggleSection = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    persist(next);
  };

  const toggleModule = (moduleIndex: number) => {
    const mod = GUIDE_MODULES[moduleIndex];
    const allSelected = mod.pages.every((p) => selected.has(p.id));
    const next = new Set(selected);
    if (allSelected) {
      mod.pages.forEach((p) => next.delete(p.id));
    } else {
      mod.pages.forEach((p) => next.add(p.id));
    }
    persist(next);
  };

  const selectAll = () => {
    const next = new Set<string>();
    GUIDE_MODULES.forEach((mod) => mod.pages.forEach((p) => next.add(p.id)));
    persist(next);
  };

  const clearAll = () => {
    persist(new Set());
  };

  const toggleExpanded = (index: number) => {
    const next = new Set(expandedModules);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setExpandedModules(next);
  };

  const handlePrint = () => {
    if (selected.size === 0) return;
    window.location.href = '/print-guide';
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {selected.size} of {TOTAL_PAGES} sections selected
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={selectAll}>
            Select all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            disabled={selected.size === 0}
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Module list */}
      <div className="space-y-3">
        {GUIDE_MODULES.map((mod, modIndex) => {
          const modSelectedCount = mod.pages.filter((p) =>
            selected.has(p.id),
          ).length;
          const allSelected =
            mod.pages.length > 0 &&
            mod.pages.every((p) => selected.has(p.id));
          const someSelected = modSelectedCount > 0 && !allSelected;
          const isExpanded = expandedModules.has(modIndex);

          return (
            <div
              key={modIndex}
              className="rounded-lg border bg-card overflow-hidden"
            >
              {/* Module header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={() => toggleModule(modIndex)}
                  aria-label={`Select all sections in ${mod.name}`}
                />
                <button
                  type="button"
                  className="flex flex-1 items-center justify-between gap-2 text-left"
                  onClick={() => toggleExpanded(modIndex)}
                  aria-expanded={isExpanded}
                >
                  <span className="font-medium text-sm">{mod.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {modSelectedCount}/{mod.pages.length}
                    </span>
                    <ChevronDown
                      className={`text-muted-foreground size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
              </div>

              {/* Section list */}
              {isExpanded && (
                <div className="border-t px-4 py-2">
                  {mod.pages.map((page) => (
                    <SectionRow
                      key={page.id}
                      page={page}
                      isSelected={selected.has(page.id)}
                      onToggle={() => toggleSection(page.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky bottom bar */}
      <div className="no-print sticky bottom-0 z-10 mt-8 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-muted-foreground size-4" />
            <span className="text-sm font-medium">
              {selected.size === 0 ? (
                'Select sections to build your custom guide'
              ) : (
                <>
                  {selected.size} section{selected.size !== 1 ? 's' : ''}{' '}
                  ready to export
                </>
              )}
            </span>
          </div>
          <Button
            onClick={handlePrint}
            disabled={selected.size === 0}
            className="gap-2"
          >
            <Printer className="size-4" />
            Print / Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionRow({
  page,
  isSelected,
  onToggle,
}: {
  page: GuidePage;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-2 transition-colors hover:bg-accent/50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        aria-label={`Select ${page.label}`}
      />
      <span className="text-sm">{page.label}</span>
      {isSelected && (
        <Check className="ml-auto size-3.5 text-primary opacity-60" />
      )}
    </label>
  );
}
