import {
  Calculator,
  CreditCard,
  DollarSign,
  Percent,
  PieChart,
  TrendingDown,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function AffordabilityCalculatorContent() {
  return (
    <ToolEducationContent
      badge="Affordability Guide"
      badgeIcon={Calculator}
      title="How Much Home Can You"
      titleGradient="Afford in Canada?"
      subtitle="Understanding GDS and TDS ratios, the stress test, and how your down payment affects your maximum purchase price."
      heroImage={{
        src: '/images/tools/affordability-calculator.webp',
        alt: 'House balanced on a scale against stacked coins with financial charts',
      }}
      highlights={[
        {
          label: 'GDS ratio limit',
          value: '39%',
          sublabel: 'Housing costs cap',
          icon: PieChart,
        },
        {
          label: 'TDS ratio limit',
          value: '44%',
          sublabel: 'All debts cap',
          icon: Percent,
        },
        {
          label: 'Stress test reduction',
          value: '~20%',
          sublabel: 'Borrowing power impact',
          icon: TrendingDown,
        },
      ]}
      sections={[
        {
          title: 'GDS and TDS Ratios Explained',
          icon: PieChart,
          content: (
            <>
              <p>
                The GDS ratio includes your mortgage payment (principal and
                interest), property taxes, heating costs, and 50% of any
                condominium fees. All of these are divided by your gross monthly
                income. The TDS ratio takes everything in the GDS calculation
                and adds all other debt obligations: car loan payments, student
                loan payments, credit card minimum payments, and lines of
                credit.
              </p>
              <p>
                To qualify, both ratios must fall within the limits
                simultaneously. For example, if your household earns $8,333 per
                month ($100,000 annually), your maximum housing costs under the
                GDS rule would be $3,250 (39%), and your total debt payments
                including housing cannot exceed $3,667 (44%). Learn more on the{' '}
                <a
                  href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  FCAC mortgage page
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: 'How the Stress Test Reduces Your Maximum',
          icon: TrendingDown,
          content: (
            <>
              <p>
                When calculating your GDS and TDS ratios, lenders do not use
                your actual mortgage rate. Instead, they use the qualifying rate
                mandated by{' '}
                <a
                  href="https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  OSFI's B-20 guideline
                </a>{' '}
                — the higher of your contract rate plus 2% or a floor of 5.25%.
              </p>
              <p>
                Because the qualifying rate is higher than what you will actually
                pay, your calculated payments are larger, which means you
                qualify for a smaller mortgage. In practice, the stress test
                reduces your maximum borrowing power by roughly 20% compared to
                what you could borrow at your actual rate.
              </p>
            </>
          ),
        },
        {
          title: 'Down Payment and Affordability',
          icon: DollarSign,
          content: (
            <>
              <p>
                A larger down payment directly increases the home price you can
                afford because you need a smaller mortgage. The minimum down
                payment in Canada is 5% on the first $500,000 of purchase price
                and 10% on any portion above $500,000 (up to $1,499,999). For
                homes priced at $1.5 million or more, you need at least 20%
                down.
              </p>
              <p>
                A bigger down payment also eliminates{' '}
                <a
                  href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  CMHC mortgage insurance
                </a>{' '}
                if you reach the 20% threshold, which further reduces your
                monthly payment and lets you qualify for a higher purchase
                price.
              </p>
            </>
          ),
        },
      ]}
      faqs={[
        {
          question:
            'How much house can I afford on a $100,000 salary?',
          answer: (
            <p>
              With a $100,000 gross annual income, no other debts, and a 5%
              down payment, you could afford approximately $450,000 to $500,000
              depending on the current interest rate and your property taxes.
              The stress test is the primary limiting factor — it forces lenders
              to calculate your payment at a rate well above what you will
              actually pay. Adding a car payment of $500 per month or student
              loan payments could reduce your maximum by $50,000 to $80,000.
            </p>
          ),
        },
        {
          question:
            'What debts count against my mortgage application?',
          answer: (
            <p>
              Lenders include all recurring financial obligations when
              calculating your TDS ratio. This covers car loans, student loans,
              credit card minimum payments (typically 3% of the balance),
              personal lines of credit, and any other installment debts. Child
              support and alimony payments also count. Even a small monthly
              obligation can meaningfully reduce the mortgage you qualify for.
              For example, a $400 monthly car payment could lower your maximum
              purchase price by roughly $70,000.
            </p>
          ),
        },
      ]}
    />
  );
}
