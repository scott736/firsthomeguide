import {
  Clock,
  Home,
  PiggyBank,
  Scale,
  TrendingUp,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function ComparisonToolsContent() {
  return (
    <ToolEducationContent
      badge="Decision Guide"
      badgeIcon={Scale}
      title="Making the Right Financial"
      titleGradient="Decisions"
      subtitle="Rent vs. buy, FHSA vs. RRSP, and fixed vs. variable — understand the trade-offs behind every major first-time buyer decision."
      heroImage={{
        src: '/images/tools/comparison-tools.webp',
        alt: 'Split screen comparison between renting an apartment and owning a house with charts',
      }}
      highlights={[
        {
          label: 'Break-even point',
          value: '5 years',
          sublabel: 'Typical rent vs. buy threshold',
          icon: Clock,
        },
        {
          label: 'Per person',
          value: '$100K',
          sublabel: 'FHSA + HBP combined max',
          icon: PiggyBank,
        },
        {
          label: 'Of the time',
          value: '60%',
          sublabel: 'Variable beats fixed historically',
          icon: TrendingUp,
        },
      ]}
      sections={[
        {
          title: 'Rent vs. Buy: When Does Buying Make Sense?',
          icon: Home,
          content: (
            <p>
              The rent-versus-buy decision comes down to how long you plan to stay, your
              local market conditions, and the opportunity cost of tying up your money in a
              down payment. Generally, buying becomes financially advantageous if you plan
              to stay in the home for at least five years. That timeframe allows you to
              absorb closing costs and begin building meaningful equity. Over the long term,{' '}
              <a
                href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                CMHC data
              </a>{' '}
              consistently shows that homeownership builds wealth through forced savings
              and property appreciation. However, buying a home you cannot comfortably
              afford is worse than renting.
            </p>
          ),
        },
        {
          title: 'FHSA vs. RRSP Home Buyers\' Plan',
          icon: PiggyBank,
          content: (
            <>
              <p>
                Canada offers two powerful tax-advantaged programs. The{' '}
                <a
                  href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  FHSA
                </a>{' '}
                lets you contribute up to $8,000/year to a lifetime maximum of $40,000.
                Contributions are tax-deductible, growth is tax-free, and withdrawals for a
                qualifying home purchase are completely tax-free. There is no repayment
                requirement.
              </p>
              <p>
                The{' '}
                <a
                  href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  RRSP HBP
                </a>{' '}
                allows you to withdraw up to $60,000 per person. The withdrawal is
                tax-free, but you must repay over 15 years. The strongest strategy for most
                buyers is to use both programs simultaneously — up to $100,000 per person or
                $200,000 per couple.
              </p>
            </>
          ),
        },
        {
          title: 'Fixed vs. Variable Mortgage Rates',
          icon: TrendingUp,
          content: (
            <>
              <p>
                A fixed-rate mortgage locks in your interest rate for the entire term
                (typically five years), giving you predictable payments. A variable-rate
                mortgage fluctuates with the{' '}
                <a
                  href="https://www.bankofcanada.ca/rates/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Bank of Canada&apos;s policy rate
                </a>
                . The five-year fixed rate is the most popular choice among first-time
                buyers because it offers certainty.
              </p>
              <p>
                Historically, variable rates have saved borrowers money roughly 60% of the
                time compared to fixed rates. However, the savings come with risk. First-time
                buyers with limited financial cushion may find the certainty of a fixed rate
                more valuable.
              </p>
            </>
          ),
        },
      ]}
      faqs={[
        {
          question: 'Can I use both the FHSA and RRSP HBP together?',
          answer: (
            <p>
              Yes. You can combine both programs for up to $100,000 per person — $200,000
              per couple. The{' '}
              <a
                href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                FHSA
              </a>{' '}
              contribution never needs to be repaid. The{' '}
              <a
                href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                HBP
              </a>{' '}
              withdrawal must be repaid to your RRSP over 15 years, starting the second
              year after your withdrawal. Missing a repayment means that year&apos;s required
              amount is added to your taxable income.
            </p>
          ),
        },
        {
          question: 'Is a variable rate risky for first-time buyers?',
          answer: (
            <p>
              Variable rates carry more uncertainty than fixed rates. If interest rates
              rise, your payments increase or your amortization extends. If your budget is
              tight and you cannot absorb a payment increase of several hundred dollars per
              month, a fixed rate provides safer, more predictable cash flow. That said, if
              you have financial flexibility and a longer time horizon, a variable rate has
              historically offered savings more often than not.
            </p>
          ),
        },
      ]}
    />
  );
}
