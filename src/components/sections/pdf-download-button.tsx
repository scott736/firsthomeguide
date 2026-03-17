'use client';

import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PdfDownloadButtonProps {
  label?: string;
}

export default function PdfDownloadButton({
  label = 'Print this page',
}: PdfDownloadButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="no-print my-4 gap-2"
      onClick={() => window.print()}
      aria-label={label}
    >
      <Printer className="size-4" />
      {label}
    </Button>
  );
}
