'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
}

export default function GlossaryTooltip({
  term,
  definition,
}: GlossaryTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="text-chart-1 cursor-help border-b border-dotted border-chart-1/50"
            tabIndex={0}
            role="term"
          >
            {term}
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="max-w-[300px] bg-popover text-popover-foreground text-sm leading-relaxed shadow-md"
          sideOffset={4}
        >
          {definition}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
