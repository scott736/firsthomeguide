'use client';

import {
  ArrowLeftRight,
  BookOpen,
  Building2,
  Calculator,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  DollarSign,
  Home,
  Hourglass,
  MapPin,
  Menu,
  Search,
} from 'lucide-react';
import React from 'react';

import { ThemeToggle } from '@/components/elements/theme-toggle';
import Logo from '@/components/layout/logo';
import SiteSearch from '@/components/sections/site-search';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export const NAV_LINKS = [
  {
    label: 'The Guide',
    href: '/guide/welcome/',
    subitems: [
      {
        label: 'The Complete Guide',
        href: '/guide/welcome/',
        description:
          'All 8 modules from "Am I ready?" to "Life after closing"',
        icon: BookOpen,
      },
      {
        label: 'Programs by Province',
        href: '/tools/province-selector',
        description:
          'Interactive map of federal and provincial programs by region',
        icon: MapPin,
      },
    ],
  },
  {
    label: 'Tools',
    href: '/tools',
    subitems: [
      {
        label: 'Mortgage Calculator',
        href: '/tools/mortgage-calculator',
        description:
          'Calculate payments, CMHC insurance, and land transfer tax',
        icon: Calculator,
      },
      {
        label: 'Affordability Calculator',
        href: '/tools/affordability-calculator',
        description:
          'Find out how much home you can afford based on income and debts',
        icon: Home,
      },
      {
        label: 'Closing Cost Calculator',
        href: '/tools/closing-cost-calculator',
        description:
          'Estimate legal fees, land transfer tax, and total cash needed',
        icon: DollarSign,
      },
      {
        label: 'Comparison Tools',
        href: '/tools/comparison-tools',
        description:
          'Rent vs Buy, FHSA vs RRSP, and Fixed vs Variable side by side',
        icon: ArrowLeftRight,
      },
      {
        label: 'Timeline Planner',
        href: '/tools/timeline-planner',
        description:
          'Plan your home buying timeline from saving to closing',
        icon: Calendar,
      },
      {
        label: 'City Comparison',
        href: '/tools/city-comparison',
        description:
          'Compare home prices and costs across Canadian cities',
        icon: Building2,
      },
      {
        label: 'Document Checklist',
        href: '/tools/document-checklist',
        description:
          'Track every document needed for your mortgage application',
        icon: ClipboardList,
      },
      {
        label: 'Programs by Province',
        href: '/tools/province-selector',
        description:
          'Find federal and provincial programs you qualify for',
        icon: MapPin,
      },
      {
        label: 'Am I Ready? Assessment',
        href: '/tools/readiness-assessment',
        description:
          'Evaluate your readiness and get personalized next steps',
        icon: ClipboardCheck,
      },
      {
        label: 'Cost of Waiting',
        href: '/tools/cost-of-waiting',
        description:
          'See how delaying your purchase affects the total cost',
        icon: Hourglass,
      },
    ],
  },
  { label: 'About', href: '/about' },
];

interface Navbar18Props {
  currentPage: string;
}

const Navbar18 = ({ currentPage }: Navbar18Props) => {
  const hideNavbar = ['/guide'].some((route) => currentPage.includes(route));
  if (hideNavbar) return null;

  return (
    <section className="relative z-50 mx-auto flex max-w-full items-center justify-between border border-t-0 bg-muted px-6 py-3 md:w-fit md:rounded-b-2xl lg:gap-4">
      <Logo className="w-47" />

      {/* Mobile menu */}
      <MobileNav currentPage={currentPage} />

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="h-full w-full">
          {NAV_LINKS.map((item) =>
            item.subitems ? (
              <NavigationMenuItem key={item.label} className="rounded-2xl">
                <NavigationMenuTrigger
                  className={cn(
                    'bg-transparent px-2 py-1 text-xs',
                    currentPage.startsWith(item.href) && 'font-semibold',
                  )}
                >
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-2xl">
                  <ul
                    className={cn(
                      'grid gap-2 p-2',
                      item.subitems.length > 3
                        ? 'w-[500px] grid-cols-2'
                        : 'w-[300px]',
                    )}
                  >
                    {item.subitems.map((sub) => (
                      <ListItem
                        key={sub.label}
                        title={sub.label}
                        href={sub.href}
                        icon={sub.icon}
                      >
                        {sub.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  href={item.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-transparent px-3 py-1.5 text-xs',
                    currentPage === item.href && 'font-semibold',
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ),
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop right actions */}
      <div className="hidden items-center gap-1.5 md:flex">
        <SiteSearch />
        <ThemeToggle className="size-8" />
        <Button
          className="h-auto rounded-lg px-3 py-1.5 text-xs"
          asChild
        >
          <a href="/guide/welcome/">Start the Guide</a>
        </Button>
      </div>
    </section>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'flex items-start gap-2.5 rounded-md p-2 text-xs leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          {Icon && (
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          )}
          <div className="flex flex-col gap-1">
            <div className="text-xs leading-none font-medium">{title}</div>
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

const MobileNav = ({ currentPage }: { currentPage: string }) => {
  return (
    <div className="mr-2 flex items-center gap-1 md:hidden">
      <SiteSearch />
      <ThemeToggle className="size-8" />
      <Popover>
        <PopoverTrigger aria-label="Open menu">
          <Menu className="size-5 text-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-screen max-w-xs overflow-hidden"
        >
          <div className="w-full bg-card/80 pt-2 text-foreground backdrop-blur-md">
            <Accordion type="single" collapsible className="w-full">
              {NAV_LINKS.map((item) =>
                item.subitems ? (
                  <AccordionItem
                    key={item.label}
                    value={item.label}
                    className="border-b-0"
                  >
                    <AccordionTrigger className="px-4 py-3 text-xs hover:bg-accent hover:no-underline">
                      <span className="text-foreground">{item.label}</span>
                    </AccordionTrigger>
                    <AccordionContent className="rounded-2xl">
                      <div className="ml-4 border-l-2 border-muted pl-2">
                        <ul className="py-1">
                          {item.subitems.map((sub) => (
                            <li
                              key={sub.label}
                              className={cn(
                                'px-2 py-2 text-xs hover:bg-accent',
                                currentPage === sub.href && 'font-semibold',
                              )}
                            >
                              <a
                                href={sub.href}
                                className="flex items-center gap-2"
                              >
                                <sub.icon className="size-3.5 shrink-0 text-muted-foreground" />
                                {sub.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div
                    key={item.label}
                    className="rounded-lg px-4 py-3 text-xs hover:bg-accent"
                  >
                    <a
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between',
                        currentPage === item.href && 'font-semibold',
                      )}
                    >
                      <span className="text-foreground">{item.label}</span>
                    </a>
                  </div>
                ),
              )}
            </Accordion>
            <div className="flex flex-col gap-2 border-t px-4 py-3">
              <Button className="w-full text-xs" size="sm" asChild>
                <a href="/guide/welcome/">Start the Guide</a>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { Navbar18 };
