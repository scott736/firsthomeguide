import {
  Building2,
  DollarSign,
  MapPin,
  Navigation,
  PieChart,
  Receipt,
  TrendingUp,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function CityComparisonContent() {
  return (
    <ToolEducationContent
      badge="City Comparison Guide"
      badgeIcon={MapPin}
      title="Comparing Housing Costs Across"
      titleGradient="Canadian Cities"
      subtitle="From Toronto to Halifax — understand how prices, taxes, and affordability differ across Canada's housing markets."
      heroImage={{
        src: '/images/tools/city-comparison.webp',
        alt: 'Canadian city skylines side by side with price comparison bars',
      }}
      highlights={[
        {
          label: 'National average price',
          value: '$680K',
          sublabel: '2026 CREA data',
          icon: DollarSign,
        },
        {
          label: 'Land transfer tax range',
          value: '0%–2%',
          sublabel: 'Varies by province',
          icon: Receipt,
        },
        {
          label: 'Unaffordable ratio',
          value: '5:1',
          sublabel: 'International threshold',
          icon: TrendingUp,
        },
      ]}
      sections={[
        {
          title: 'How Home Prices Vary by City',
          icon: Building2,
          content: (
            <>
              <p>
                As of early 2026, the national average home price in Canada sits at
                approximately $680,000 according to the{' '}
                <a
                  href="https://creastats.crea.ca/en-CA/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  CREA
                </a>
                . However, that national average masks enormous variation. Toronto and
                Vancouver remain the most expensive major markets, with average prices well
                above $900,000. In contrast, cities like Calgary, Edmonton, Winnipeg, and
                several Atlantic Canadian centres offer average home prices significantly
                below the national average, making homeownership accessible at much lower
                income levels.
              </p>
              <p>
                Even within a single metropolitan area, prices can vary by hundreds of
                thousands of dollars depending on the neighbourhood, property type, and
                proximity to transit or employment centres. A buyer who broadens their search
                area by even 15 to 20 minutes of commute time can often find substantially
                more affordable options.
              </p>
            </>
          ),
        },
        {
          title: 'Beyond the Purchase Price',
          icon: Receipt,
          content: (
            <>
              <p>
                The sticker price of a home tells only part of the story. Ongoing costs
                differ meaningfully by location and can significantly affect your monthly
                budget. Property taxes vary by municipality, typically ranging from 0.5% to
                1.5% of the assessed value annually — a difference that can amount to several
                thousand dollars per year on the same-priced home in different cities.
              </p>
              <p>
                Land transfer tax varies by province, with some provinces like Alberta
                charging none at all and others like Ontario and British Columbia imposing
                significant taxes on purchase. Condo fees, home insurance premiums, and
                heating costs also differ by region. A home in Winnipeg may cost far less to
                purchase than one in Vancouver, but heating costs during prairie winters will
                be notably higher. Smart buyers calculate the total cost of ownership, not
                just the mortgage payment.
              </p>
            </>
          ),
        },
        {
          title: 'Affordability Factors to Consider',
          icon: PieChart,
          content: (
            <>
              <p>
                One of the most useful metrics for comparing cities is the price-to-income
                ratio — the median home price divided by the median household income. A ratio
                above 5:1 is generally considered unaffordable by international standards.
                Many Canadian cities exceed this threshold, while others remain well within
                affordable range.
              </p>
              <p>
                Beyond raw affordability, consider how provincial tax differences affect your
                take-home pay, whether your industry has strong job opportunities in a given
                city, and what commute costs look like. Visit the{' '}
                <a
                  href="https://www.bankofcanada.ca/rates/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Bank of Canada rates
                </a>{' '}
                page for current interest rate information that affects affordability across
                all markets.
              </p>
            </>
          ),
        },
        {
          title: 'Where First-Time Buyers Are Heading',
          icon: Navigation,
          content: (
            <>
              <p>
                An increasing number of first-time buyers are looking at secondary cities
                within commuting distance of major employment centres. For those who work in
                Toronto, cities like Hamilton, Kitchener-Waterloo, and Barrie offer
                significantly lower home prices while remaining accessible via highway or GO
                Transit. Vancouver-area buyers are finding value in Langley, Abbotsford, and
                Chilliwack.
              </p>
              <p>
                The rise of remote and hybrid work has further expanded the geography of what
                counts as a commutable distance. Buyers who only need to be in the office two
                or three days per week are willing to accept a longer commute in exchange for
                a larger, more affordable home.
              </p>
            </>
          ),
        },
      ]}
      faqs={[
        {
          question: 'What is the most affordable city to buy in Canada?',
          answer: (
            <p>
              Among major Canadian cities, Calgary, Edmonton, Winnipeg, and several
              Atlantic Canadian cities including Saint John, Moncton, and Halifax offer the
              most affordable housing markets relative to local income levels. These cities
              have price-to-income ratios that are far more favourable than Toronto or
              Vancouver, making homeownership achievable for a wider range of buyers. That
              said, affordability is only one factor — local job markets, proximity to
              family, lifestyle preferences, and long-term economic outlook should all
              weigh into your decision.
            </p>
          ),
        },
        {
          question: 'Should I buy in a cheaper city and commute?',
          answer: (
            <p>
              Buying in a more affordable area and commuting is an increasingly common
              strategy, but it requires careful math. A lower home price saves you money on
              your mortgage, but you may face higher transportation costs, longer commute
              times, and increased vehicle wear. Calculate the full picture: if buying 45
              minutes outside a major centre saves you $200,000 on the purchase price but
              adds $800 per month in commuting costs, the savings are still substantial but
              not as dramatic as the price gap suggests. Many buyers find the best balance
              in satellite cities within 30 to 60 minutes of major centres.
            </p>
          ),
        },
      ]}
    />
  );
}
