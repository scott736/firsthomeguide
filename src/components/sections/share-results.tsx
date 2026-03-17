'use client';

import { useCallback, useState } from 'react';

import { Check, Copy, Link, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ShareResultsProps {
  title: string;
  summary: string;
  toolUrl: string;
}

export default function ShareResults({
  title,
  summary,
  toolUrl,
}: ShareResultsProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [open, setOpen] = useState(false);

  const supportsShare =
    typeof navigator !== 'undefined' && !!navigator.share;

  const getFullUrl = useCallback(() => {
    if (typeof window === 'undefined') return toolUrl;
    return window.location.href;
  }, [toolUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      setCopiedLink(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  }, [getFullUrl]);

  const handleCopySummary = useCallback(async () => {
    const text = `${title}\n${summary}\n\n${getFullUrl()}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      toast.success('Summary copied to clipboard');
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      toast.error('Failed to copy summary');
    }
  }, [title, summary, getFullUrl]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title,
        text: summary,
        url: getFullUrl(),
      });
      setOpen(false);
    } catch (err) {
      // User cancelled or share failed silently
      if (err instanceof Error && err.name !== 'AbortError') {
        toast.error('Sharing failed');
      }
    }
  }, [title, summary, getFullUrl]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Share2 className="size-3.5" />
          Share Results
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-1.5">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              'flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            {copiedLink ? (
              <Check className="size-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <Link className="size-3.5 text-muted-foreground" />
            )}
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className={cn(
              'flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            {copiedSummary ? (
              <Check className="size-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="size-3.5 text-muted-foreground" />
            )}
            <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          {supportsShare && (
            <button
              type="button"
              onClick={handleShare}
              className={cn(
                'flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <Share2 className="size-3.5 text-muted-foreground" />
              <span>Share</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
