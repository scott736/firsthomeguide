export interface GuidePage {
  id: string; // Collection entry ID, e.g. "guide/1-are-you-ready/1-first-time-buyer"
  path: string; // URL path, e.g. "/guide/1-are-you-ready/1-first-time-buyer/"
  label: string;
}

export interface GuideModule {
  name: string;
  shortName: string;
  pages: GuidePage[];
}

function page(id: string, label: string): GuidePage {
  return { id, path: `/${id}/`, label };
}

export const GUIDE_MODULES: GuideModule[] = [
  {
    name: 'Welcome',
    shortName: 'Welcome',
    pages: [page('guide/welcome', 'Welcome')],
  },
  {
    name: 'Module 1: Are You Ready?',
    shortName: 'Are You Ready?',
    pages: [
      page('guide/1-are-you-ready/1-first-time-buyer', 'First-Time Buyer'),
      page('guide/1-are-you-ready/2-rent-vs-buy', 'Rent vs. Buy'),
      page('guide/1-are-you-ready/3-credit-score', 'Credit Score'),
      page('guide/1-are-you-ready/4-stress-test', 'Stress Test'),
      page('guide/1-are-you-ready/5-financial-checklist', 'Financial Checklist'),
      page('guide/1-are-you-ready/6-co-buying', 'Co-Buying'),
    ],
  },
  {
    name: 'Module 2: Saving Smart',
    shortName: 'Saving Smart',
    pages: [
      page('guide/2-saving-smart/1-fhsa', 'FHSA'),
      page('guide/2-saving-smart/2-rrsp-hbp', 'RRSP HBP'),
      page('guide/2-saving-smart/3-combined-strategy', 'Combined Strategy'),
      page('guide/2-saving-smart/4-tfsa', 'TFSA'),
      page('guide/2-saving-smart/5-saving-timelines', 'Saving Timelines'),
      page('guide/2-saving-smart/6-common-mistakes', 'Common Mistakes'),
    ],
  },
  {
    name: 'Module 3: Down Payments & Mortgages',
    shortName: 'Down Payments & Mortgages',
    pages: [
      page('guide/3-down-payments-mortgages/1-down-payment-rules', 'Down Payment Rules'),
      page('guide/3-down-payments-mortgages/2-cmhc-insurance', 'CMHC Insurance'),
      page('guide/3-down-payments-mortgages/3-fixed-vs-variable', 'Fixed vs. Variable'),
      page('guide/3-down-payments-mortgages/4-amortization', 'Amortization'),
      page('guide/3-down-payments-mortgages/5-pre-approval', 'Pre-Approval'),
      page('guide/3-down-payments-mortgages/6-gds-tds-ratios', 'GDS & TDS Ratios'),
      page('guide/3-down-payments-mortgages/7-choosing-provider', 'Choosing a Provider'),
      page('guide/3-down-payments-mortgages/8-self-employed', 'Self-Employed'),
    ],
  },
  {
    name: 'Module 4: Government Programs',
    shortName: 'Government Programs',
    pages: [
      page('guide/4-government-programs/1-federal-programs', 'Federal Programs'),
      page('guide/4-government-programs/2-ontario', 'Ontario'),
      page('guide/4-government-programs/3-british-columbia', 'British Columbia'),
      page('guide/4-government-programs/4-alberta-prairies', 'Alberta & Prairies'),
      page('guide/4-government-programs/5-quebec', 'Quebec'),
      page('guide/4-government-programs/6-atlantic-canada', 'Atlantic Canada'),
      page('guide/4-government-programs/7-program-comparison', 'Program Comparison'),
      page('guide/4-government-programs/8-territories', 'Territories'),
    ],
  },
  {
    name: 'Module 5: Finding a Home',
    shortName: 'Finding a Home',
    pages: [
      page('guide/5-finding-a-home/0-your-team', 'Your Home-Buying Team'),
      page('guide/5-finding-a-home/1-working-with-realtor', 'Working with a Realtor'),
      page('guide/5-finding-a-home/2-reading-mls-listings', 'Reading MLS Listings'),
      page('guide/5-finding-a-home/3-condo-vs-freehold', 'Condo vs. Freehold'),
      page('guide/5-finding-a-home/4-showings-guide', 'Showings Guide'),
      page('guide/5-finding-a-home/5-school-catchment', 'School Catchment'),
      page('guide/5-finding-a-home/6-red-flags', 'Red Flags'),
      page('guide/5-finding-a-home/7-new-construction', 'New Construction'),
    ],
  },
  {
    name: 'Module 6: Making an Offer',
    shortName: 'Making an Offer',
    pages: [
      page('guide/6-making-an-offer/1-purchase-agreement', 'Purchase Agreement'),
      page('guide/6-making-an-offer/2-conditions', 'Conditions'),
      page('guide/6-making-an-offer/3-bidding-wars', 'Bidding Wars'),
      page('guide/6-making-an-offer/4-home-inspection', 'Home Inspection'),
      page('guide/6-making-an-offer/5-deposits', 'Deposits'),
      page('guide/6-making-an-offer/6-offer-mistakes', 'Offer Mistakes'),
    ],
  },
  {
    name: 'Module 7: Closing the Deal',
    shortName: 'Closing the Deal',
    pages: [
      page('guide/7-closing-the-deal/1-closing-costs-overview', 'Closing Costs Overview'),
      page('guide/7-closing-the-deal/2-cost-breakdown', 'Cost Breakdown'),
      page('guide/7-closing-the-deal/3-land-transfer-tax', 'Land Transfer Tax'),
      page('guide/7-closing-the-deal/4-real-estate-lawyer', 'Real Estate Lawyer'),
      page('guide/7-closing-the-deal/5-title-insurance', 'Title Insurance'),
      page('guide/7-closing-the-deal/6-closing-day', 'Closing Day'),
      page('guide/7-closing-the-deal/7-closing-example', 'Closing Example'),
    ],
  },
  {
    name: 'Module 8: Life After Closing',
    shortName: 'Life After Closing',
    pages: [
      page('guide/8-life-after-closing/1-emergency-fund', 'Emergency Fund'),
      page('guide/8-life-after-closing/2-property-taxes', 'Property Taxes'),
      page('guide/8-life-after-closing/3-home-insurance', 'Home Insurance'),
      page('guide/8-life-after-closing/4-mortgage-renewal', 'Mortgage Renewal'),
      page('guide/8-life-after-closing/5-home-maintenance', 'Home Maintenance'),
      page('guide/8-life-after-closing/6-energy-efficiency', 'Energy Efficiency'),
      page('guide/8-life-after-closing/7-building-equity', 'Building Equity'),
      page('guide/8-life-after-closing/8-congratulations', 'Congratulations'),
    ],
  },
  {
    name: 'Reference',
    shortName: 'Reference',
    pages: [
      page('guide/faq', 'FAQ'),
      page('guide/glossary', 'Glossary'),
    ],
  },
];

export const ALL_PAGE_IDS = GUIDE_MODULES.flatMap((m) => m.pages.map((p) => p.id));
export const TOTAL_PAGES = ALL_PAGE_IDS.length;

// localStorage helpers for custom guide selections
export const CUSTOM_GUIDE_KEY = 'fhg-custom-guide';

export function getSelectedSections(): Set<string> {
  try {
    const stored = localStorage.getItem(CUSTOM_GUIDE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveSelectedSections(selected: Set<string>) {
  try {
    localStorage.setItem(CUSTOM_GUIDE_KEY, JSON.stringify([...selected]));
  } catch {
    // localStorage may be unavailable
  }
}

export function toggleSection(sectionId: string): Set<string> {
  const selected = getSelectedSections();
  if (selected.has(sectionId)) {
    selected.delete(sectionId);
  } else {
    selected.add(sectionId);
  }
  saveSelectedSections(selected);
  return selected;
}
