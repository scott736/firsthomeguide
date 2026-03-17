'use client';

import {
  ArrowRight,
  BookOpen,
  Calculator,
  HelpCircle,
  Home,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const HELPFUL_LINKS = [
  {
    href: '/',
    icon: Home,
    label: 'Home',
    description: 'Back to the homepage',
  },
  {
    href: '/guide/welcome/',
    icon: BookOpen,
    label: 'The Guide',
    description: 'Start learning about home buying',
  },
  {
    href: '/tools',
    icon: Calculator,
    label: 'Tools',
    description: 'Mortgage calculator, checklists & more',
  },
  {
    href: '/guide/faq/',
    icon: HelpCircle,
    label: 'FAQ',
    description: 'Frequently asked questions',
  },
];

export default function NotFoundPage() {
  return (
    <section className="section-padding relative flex items-center justify-center">
      <div className="container relative flex max-w-3xl flex-col items-center text-center">
        {/* 404 number */}
        <p className="text-gradient text-8xl font-bold tracking-tighter md:text-9xl">
          404
        </p>

        <div className="mt-6 space-y-4 text-balance md:mt-8">
          <h1 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Page not found
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved. Don&apos;t worry — there&apos;s plenty of helpful content
            waiting for you.
          </p>
        </div>

        {/* Search suggestion */}
        <div className="bg-muted/50 mt-8 flex items-center gap-3 rounded-lg border px-5 py-3">
          <Search className="text-muted-foreground size-5 shrink-0" />
          <p className="text-muted-foreground text-sm">
            Try searching for what you need in our{' '}
            <a
              href="/guide/welcome/"
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              guide
            </a>
            — use the search bar at the top of any guide page.
          </p>
        </div>

        {/* Helpful links grid */}
        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
          {HELPFUL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:border-chart-1/30 hover:bg-chart-1/5 group flex items-start gap-3 rounded-lg border p-4 text-left transition-colors"
            >
              <div className="bg-muted text-muted-foreground group-hover:bg-chart-1/15 group-hover:text-chart-1 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors">
                <link.icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold group-hover:text-chart-1">
                  {link.label}
                </p>
                <p className="text-muted-foreground text-sm">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Primary CTA */}
        <Button
          asChild
          size="lg"
          className="from-chart-1 via-chart-2 to-chart-3 text-foreground mt-10 w-full max-w-sm bg-gradient-to-r transition-all hover:opacity-80"
        >
          <a href="/">
            Take me home
            <ArrowRight className="size-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
