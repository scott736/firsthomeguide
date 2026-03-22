import {
  Calendar,
  Clock,
  FileCheck,
  Key,
  PiggyBank,
  Search,
  ShieldCheck,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function TimelinePlannerContent() {
  return (
    <ToolEducationContent
      badge="Timeline Guide"
      badgeIcon={Calendar}
      title="The Canadian Home Buying"
      titleGradient="Timeline"
      subtitle="From your first savings contribution to getting your keys — understand every phase and how long each step takes."
      heroImage={{
        src: '/images/tools/timeline-planner.webp',
        alt: 'Timeline roadmap from piggy bank savings to house keys with milestone dots',
      }}
      highlights={[
        {
          label: 'Total journey',
          value: '6mo–5yr',
          sublabel: 'Depending on starting point',
          icon: Clock,
        },
        {
          label: 'Rate hold',
          value: '90–120 days',
          sublabel: 'Pre-approval validity',
          icon: ShieldCheck,
        },
        {
          label: 'Closing period',
          value: '30–60 days',
          sublabel: 'Standard in Canada',
          icon: Key,
        },
      ]}
      sections={[
        {
          title: 'Phase 1: Preparation (6 Months to 5 Years Before)',
          icon: PiggyBank,
          content: (
            <>
              <p>
                Open a{' '}
                <a
                  href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  FHSA
                </a>{' '}
                as early as possible — even a small initial deposit starts building
                contribution room. Check your credit score and begin improving it.
              </p>
              <p>
                Focus on reducing existing debts, building your down payment through
                consistent saving, and educating yourself about the home buying process.
                Most first-time buyers spend one to three years in the preparation phase.
              </p>
            </>
          ),
        },
        {
          title: 'Phase 2: Pre-Approval (2-3 Months Before)',
          icon: FileCheck,
          content: (
            <>
              <p>
                Once your savings, credit, and debt levels are in good shape, get mortgage
                pre-approval. A pre-approval letter tells you exactly how much a lender is
                willing to offer, locks in an interest rate for 90 to 120 days, and signals
                to sellers that you are a serious buyer. Visit the{' '}
                <a
                  href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  FCAC mortgage guide
                </a>{' '}
                for detailed information on the pre-approval process.
              </p>
              <p>
                This is also the time to assemble your home buying team — find a real estate
                agent, select a real estate lawyer, and identify a reputable home inspector.
              </p>
            </>
          ),
        },
        {
          title: 'Phase 3: The Search (1-3 Months)',
          icon: Search,
          content: (
            <>
              <p>
                With pre-approval in hand and your team assembled, active property searching
                begins. Attend open houses, book private viewings, and evaluate
                neighbourhoods at different times of day. The average Canadian buyer views 10
                to 15 homes before making an offer.
              </p>
              <p>
                In competitive markets like Toronto and Vancouver, the search phase may take
                longer due to bidding wars and limited inventory. In more balanced markets,
                you may find the right home within a few weeks.
              </p>
            </>
          ),
        },
        {
          title: 'Phase 4: Offer to Closing (30-90 Days)',
          icon: Key,
          content: (
            <>
              <p>
                Once you find a home, you submit an offer. If accepted, you enter the
                conditional period — typically 5 to 10 business days. Your lawyer then
                conducts a title search, prepares closing documents, and coordinates the
                transfer of funds.
              </p>
              <p>
                The standard closing period in Canada is 30 to 60 days. On closing day, your
                lawyer transfers the funds, registers the title, and hands over the keys.
                Budget for closing costs of 3% to 5% of the purchase price.
              </p>
            </>
          ),
        },
      ]}
      faqs={[
        {
          question: 'How long does it take to get a mortgage pre-approval?',
          answer: (
            <p>
              A basic rate-hold pre-approval can often be completed in one to three business
              days. A full pre-approval with complete document verification typically takes
              5 to 10 business days. The full pre-approval carries more weight with sellers
              and gives you greater certainty about your borrowing power.
            </p>
          ),
        },
        {
          question: 'How long does the average home search take in Canada?',
          answer: (
            <p>
              Most first-time buyers spend one to three months actively searching for a
              home. In competitive markets like Toronto and Vancouver, it may take longer
              due to bidding competition. In more balanced markets across the Prairies and
              Atlantic Canada, buyers often find a suitable home within a few weeks.
              Patience during this phase pays off — rushing into a purchase you are not
              fully comfortable with is one of the most common regrets among first-time
              buyers.
            </p>
          ),
        },
      ]}
    />
  );
}
