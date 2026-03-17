import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const WORDS_PER_MINUTE = 238;

interface ReadingTimeProps {
  wordCount: number;
  className?: string;
}

export default function ReadingTime({ wordCount, className }: ReadingTimeProps) {
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

  return (
    <Badge variant="outline" className={cn('gap-1.5', className)}>
      <Clock className="size-3" />
      {minutes} min read
    </Badge>
  );
}
