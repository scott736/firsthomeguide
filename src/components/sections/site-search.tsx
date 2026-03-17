'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  BookOpen,
  Calculator,
  FileText,
  Search,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface SearchItem {
  title: string;
  description: string;
  href: string;
  category: 'tool' | 'guide' | 'page';
  keywords: string[];
}

const SEARCH_INDEX: SearchItem[] = [
  // Tools
  {
    title: 'Mortgage Calculator',
    description:
      'Calculate monthly payments, CMHC insurance, and land transfer tax',
    href: '/tools/mortgage-calculator',
    category: 'tool',
    keywords: [
      'mortgage',
      'calculator',
      'payment',
      'cmhc',
      'insurance',
      'land transfer tax',
      'monthly',
    ],
  },
  {
    title: 'Affordability Calculator',
    description:
      'Find out how much home you can afford based on income and debts',
    href: '/tools/affordability-calculator',
    category: 'tool',
    keywords: [
      'afford',
      'affordability',
      'income',
      'debt',
      'gds',
      'tds',
      'qualify',
      'budget',
    ],
  },
  {
    title: 'Closing Cost Calculator',
    description:
      'Estimate legal fees, land transfer tax, and total cash needed',
    href: '/tools/closing-cost-calculator',
    category: 'tool',
    keywords: [
      'closing',
      'cost',
      'legal',
      'fees',
      'land transfer',
      'cash',
      'lawyer',
    ],
  },
  {
    title: 'Comparison Tools',
    description: 'Rent vs Buy, FHSA vs RRSP, and Fixed vs Variable',
    href: '/tools/comparison-tools',
    category: 'tool',
    keywords: [
      'compare',
      'rent',
      'buy',
      'fhsa',
      'rrsp',
      'fixed',
      'variable',
    ],
  },
  {
    title: 'Timeline Planner',
    description: 'Plan your home buying timeline from saving to closing',
    href: '/tools/timeline-planner',
    category: 'tool',
    keywords: ['timeline', 'plan', 'schedule', 'saving', 'when'],
  },
  {
    title: 'City Comparison',
    description: 'Compare home prices across Canadian cities',
    href: '/tools/city-comparison',
    category: 'tool',
    keywords: [
      'city',
      'compare',
      'price',
      'toronto',
      'vancouver',
      'calgary',
      'ottawa',
    ],
  },
  {
    title: 'Document Checklist',
    description: 'Track every document for your mortgage application',
    href: '/tools/document-checklist',
    category: 'tool',
    keywords: ['document', 'checklist', 'mortgage', 'application', 'paperwork'],
  },
  {
    title: 'Programs by Province',
    description: 'Find federal and provincial programs you qualify for',
    href: '/tools/province-selector',
    category: 'tool',
    keywords: [
      'province',
      'program',
      'grant',
      'rebate',
      'federal',
      'ontario',
      'bc',
      'alberta',
      'quebec',
    ],
  },
  {
    title: 'Am I Ready? Assessment',
    description: 'Evaluate your readiness to buy with a quick quiz',
    href: '/tools/readiness-assessment',
    category: 'tool',
    keywords: ['ready', 'assessment', 'quiz', 'readiness', 'evaluate'],
  },
  {
    title: 'Cost of Waiting Calculator',
    description: 'See how delaying your purchase affects total cost',
    href: '/tools/cost-of-waiting',
    category: 'tool',
    keywords: ['wait', 'delay', 'cost', 'appreciation', 'rent', 'time'],
  },
  // Guide modules
  {
    title: 'Module 1: Are You Ready?',
    description:
      'First-time buyer status, credit score, stress test, financial checklist',
    href: '/guide/1-are-you-ready/1-first-time-buyer/',
    category: 'guide',
    keywords: [
      'ready',
      'first time',
      'credit',
      'score',
      'stress test',
      'checklist',
      'qualify',
    ],
  },
  {
    title: 'Module 2: Saving Smart',
    description: 'FHSA, RRSP HBP, combined strategy, TFSA, saving timelines',
    href: '/guide/2-saving-smart/1-fhsa/',
    category: 'guide',
    keywords: [
      'fhsa',
      'rrsp',
      'hbp',
      'save',
      'saving',
      'tfsa',
      'tax',
      'account',
    ],
  },
  {
    title: 'Module 3: Down Payments & Mortgages',
    description:
      'Down payment rules, CMHC, fixed vs variable, pre-approval, GDS/TDS',
    href: '/guide/3-down-payments-mortgages/1-down-payment-rules/',
    category: 'guide',
    keywords: [
      'down payment',
      'mortgage',
      'cmhc',
      'fixed',
      'variable',
      'pre-approval',
      'gds',
      'tds',
      'amortization',
    ],
  },
  {
    title: 'Module 4: Government Programs',
    description:
      'Federal programs, provincial grants and rebates by province',
    href: '/guide/4-government-programs/1-federal-programs/',
    category: 'guide',
    keywords: [
      'government',
      'program',
      'grant',
      'rebate',
      'hbtc',
      'tax credit',
      'provincial',
    ],
  },
  {
    title: 'Module 5: Finding a Home',
    description:
      'Your team, realtors, MLS listings, condos, showings, red flags',
    href: '/guide/5-finding-a-home/0-your-team/',
    category: 'guide',
    keywords: [
      'find',
      'home',
      'realtor',
      'agent',
      'mls',
      'condo',
      'showing',
      'neighbourhood',
    ],
  },
  {
    title: 'Module 6: Making an Offer',
    description:
      'Purchase agreements, conditions, bidding wars, inspection, deposits',
    href: '/guide/6-making-an-offer/1-purchase-agreement/',
    category: 'guide',
    keywords: [
      'offer',
      'agreement',
      'condition',
      'bid',
      'inspection',
      'deposit',
      'negotiate',
    ],
  },
  {
    title: 'Module 7: Closing the Deal',
    description:
      'Closing costs, land transfer tax, lawyer, title insurance, closing day',
    href: '/guide/7-closing-the-deal/1-closing-costs-overview/',
    category: 'guide',
    keywords: [
      'closing',
      'close',
      'lawyer',
      'title',
      'insurance',
      'land transfer',
      'cost',
    ],
  },
  {
    title: 'Module 8: Life After Closing',
    description:
      'Emergency fund, property taxes, insurance, renewal, maintenance, equity',
    href: '/guide/8-life-after-closing/1-emergency-fund/',
    category: 'guide',
    keywords: [
      'emergency',
      'property tax',
      'insurance',
      'renewal',
      'maintenance',
      'equity',
      'homeowner',
    ],
  },
  {
    title: 'Glossary',
    description:
      'Plain-language definitions of every home buying term',
    href: '/guide/glossary/',
    category: 'guide',
    keywords: ['glossary', 'definition', 'term', 'meaning', 'explain'],
  },
  {
    title: 'FAQ',
    description: 'Frequently asked questions about buying a home in Canada',
    href: '/guide/faq/',
    category: 'guide',
    keywords: ['faq', 'question', 'answer', 'help'],
  },
  // Pages
  {
    title: 'About',
    description: 'About FirstHomeGuide.ca and the LendCity team',
    href: '/about',
    category: 'page',
    keywords: ['about', 'team', 'lendcity', 'who'],
  },
  {
    title: 'Book a Free Call',
    description: 'Schedule a free consultation with our mortgage team',
    href: '/book-a-call',
    category: 'page',
    keywords: ['book', 'call', 'consultation', 'appointment', 'free'],
  },
];

const CATEGORY_ICONS = {
  tool: Calculator,
  guide: BookOpen,
  page: FileText,
};

const CATEGORY_LABELS = {
  tool: 'Tool',
  guide: 'Guide',
  page: 'Page',
};

function searchItems(query: string): SearchItem[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (terms.length === 0) return [];

  return SEARCH_INDEX.filter((item) => {
    const searchText = [
      item.title,
      item.description,
      ...item.keywords,
    ]
      .join(' ')
      .toLowerCase();
    return terms.every((term) => searchText.includes(term));
  }).slice(0, 8);
}

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      const found = searchItems(val);
      setResults(found);
      setSelectedIndex(0);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        window.location.href = results[selectedIndex].href;
      }
    },
    [results, selectedIndex, handleClose],
  );

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, handleOpen, handleClose]);

  return (
    <>
      {/* Search trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className="text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors"
        title="Search (Cmd+K)"
        aria-label="Search the site"
      >
        <Search className="size-3.5" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[15vh] backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            ref={dialogRef}
            className="bg-background w-full max-w-lg rounded-xl border shadow-2xl"
            role="dialog"
            aria-label="Search"
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <Search className="text-muted-foreground size-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder="Search tools, guide pages, and more..."
                className="bg-transparent text-foreground placeholder:text-muted-foreground flex-1 text-sm outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.length > 1 && results.length === 0 && (
                <div className="text-muted-foreground px-3 py-6 text-center text-sm">
                  No results found for "{query}"
                </div>
              )}

              {results.map((item, index) => {
                const Icon = CATEGORY_ICONS[item.category];
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50',
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {item.title}
                        </span>
                        <span className="text-muted-foreground shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase">
                          {CATEGORY_LABELS[item.category]}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        {item.description}
                      </p>
                    </div>
                  </a>
                );
              })}

              {query.length <= 1 && (
                <div className="text-muted-foreground px-3 py-4 text-center text-xs">
                  Type to search tools, guide modules, and pages
                  <br />
                  <kbd className="bg-muted mt-1 inline-block rounded border px-1.5 py-0.5 text-[10px] font-mono">
                    Cmd+K
                  </kbd>{' '}
                  to open anytime
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
