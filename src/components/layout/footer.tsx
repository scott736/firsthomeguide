'use client';

import { Phone } from 'lucide-react';

import Logo from '@/components/layout/logo';
import { NAV_LINKS } from '@/components/navbar18';
import { Button } from '@/components/ui/button';
import { LENDCITY } from '@/lib/lendcity';

interface FooterProps {
  currentPage: string;
}

const Footer = ({ currentPage }: FooterProps) => {
  const hideFooter = ['/guide'].some((route) => currentPage.includes(route));
  if (hideFooter) return null;

  return (
    <footer className="section-padding relative overflow-hidden">
      <div className="container text-center">
        <p className="text-accent-foreground">
          Helping Canadians navigate home ownership since 2025
        </p>

        <Logo
          className="mt-20 justify-center gap-3 text-3xl lg:mt-30"
          iconClassName="w-10"
        />

        <p className="my-8 text-2xl lg:my-6 lg:text-5xl">
          Your home buying journey{' '}
          <span className="text-gradient">starts here.</span>
        </p>

        <div className="mx-auto flex max-w-md flex-wrap justify-center gap-3">
          <Button className="flex-1" asChild>
            <a href="/guide/welcome/">Start the Free Guide</a>
          </Button>
          <Button className="flex-1" variant="secondary" asChild>
            <a href={LENDCITY.bookingUrl} target="_blank" rel="noopener noreferrer">
              <Phone className="mr-1.5 size-4" />
              Book a Free Call
            </a>
          </Button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Backed by{' '}
          <a
            href={LENDCITY.website}
            title={LENDCITY.title}
            className="font-medium text-foreground/80 hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener"
          >
            {LENDCITY.name}
          </a>{' '}
          — Licensed Mortgage Professionals
        </p>
      </div>

      <div className="container mt-20 flex flex-col-reverse justify-between gap-8 text-xs lg:mt-30 lg:flex-row">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <p>
            &copy; {new Date().getFullYear()} FirstHomeGuide.ca &mdash; A{' '}
            <a
              href={LENDCITY.website}
              title={LENDCITY.title}
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener"
            >
              {LENDCITY.name}
            </a>{' '}
            Resource
          </p>
          <a
            href={`tel:${LENDCITY.phone}`}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <Phone className="size-3" />
            {LENDCITY.phone}
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-center lg:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-opacity hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </div>

      </div>

    </footer>
  );
};

export default Footer;