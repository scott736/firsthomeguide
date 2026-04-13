'use client';

import { Phone } from 'lucide-react';

import Logo from '@/components/layout/logo';
import { NAV_LINKS } from '@/components/navbar18';
import { Button } from '@/components/ui/button';
import { LENDCITY } from '@/lib/lendcity';

interface FooterProps {
  currentPage: string;
}

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sitemap', href: '/sitemap-index.xml' },
];

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

      <div className="container mt-16 grid gap-10 border-t pt-10 text-sm sm:grid-cols-2 md:grid-cols-3 lg:mt-20">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Learn
          </h3>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/my-guide"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Build Your Guide
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company
          </h3>
          <ul className="mt-3 space-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Talk to us
          </h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={LENDCITY.bookingUrl}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Book a free call
              </a>
            </li>
            <li>
              <a
                href={`tel:${LENDCITY.phone}`}
                className="text-foreground/80 hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                <Phone className="size-3" />
                {LENDCITY.phone}
              </a>
            </li>
            <li>
              <a
                href={LENDCITY.website}
                title={LENDCITY.title}
                target="_blank"
                rel="noopener"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                LendCity.ca
              </a>
            </li>
            <li>
              <address className="text-foreground/80 not-italic leading-relaxed">
                {LENDCITY.streetAddress}
                <br />
                {LENDCITY.city}, {LENDCITY.provinceCode} {LENDCITY.postalCode}
              </address>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-10 border-t pt-6">
        <p className="text-muted-foreground mx-auto max-w-3xl text-center text-xs leading-relaxed">
          <strong className="text-foreground/80">General information only.</strong>{' '}
          FirstHomeGuide.ca provides educational content about home buying in Canada and is
          not financial, legal, tax, or mortgage advice. Programs, rates, and rules change —
          confirm details with a licensed professional before acting. See our{' '}
          <a href="/disclaimer" className="underline underline-offset-4 hover:text-foreground">
            full disclaimer
          </a>
          .
        </p>
      </div>

      <div className="container mt-8 flex flex-col-reverse items-center justify-between gap-4 text-xs lg:flex-row">
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
          Resource &middot; {LENDCITY.license}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
