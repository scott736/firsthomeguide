import {
  Calculator,
  Clock,
  DollarSign,
  Percent,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function MortgageCalculatorContent() {
  return (
    <ToolEducationContent
      badge="Understanding Your Mortgage"
      badgeIcon={Calculator}
      title="How Canadian Mortgage Payments Are"
      titleGradient="Calculated"
      subtitle="From principal and interest to CMHC insurance and the stress test — everything you need to understand your mortgage payment."
      heroImage={{
        src: '/images/tools/mortgage-calculator.webp',
        alt: 'Canadian couple reviewing mortgage documents at kitchen table with calculator and laptop',
      }}
      highlights={[
        {
          label: '5–9.99% down payment',
          value: '4.00%',
          sublabel: 'CMHC premium rate',
          icon: Percent,
        },
        {
          label: '10–14.99% down payment',
          value: '3.10%',
          sublabel: 'CMHC premium rate',
          icon: Percent,
        },
        {
          label: '15–19.99% down payment',
          value: '2.40%',
          sublabel: 'CMHC premium rate',
          icon: Percent,
        },
      ]}
      sections={[
        {
          title: 'How Mortgage Payments Work',
          icon: DollarSign,
          content: (
            <>
              <p>
                A mortgage payment is made up of two components: principal and interest.
                Each month, a portion of your payment goes toward reducing the loan balance
                (principal) while the rest covers the lender's interest charge. Early in your
                mortgage, most of your payment is interest. Over time, the balance shifts so
                that more of each payment chips away at the principal.
              </p>
              <p>
                In Canada, most fixed-rate mortgages compound interest semi-annually, not
                monthly. This is a legal requirement under the{' '}
                <a
                  href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Interest Act
                </a>{' '}
                and means the effective rate you pay is slightly different from the posted
                annual rate. Variable-rate mortgages typically compound monthly.
              </p>
            </>
          ),
        },
        {
          title: 'CMHC Mortgage Insurance',
          icon: ShieldCheck,
          content: (
            <>
              <p>
                If your down payment is less than 20% of the purchase price, you are required
                to purchase mortgage default insurance, commonly called CMHC insurance (though
                Sagen and Canada Guaranty also offer it). The premium is a percentage of your
                mortgage amount, and it varies by how much you put down.
              </p>
              <p>
                The premium is added directly to your mortgage balance. For example, on a
                $500,000 home with 5% down ($25,000), your mortgage would be $475,000. The
                CMHC premium at 4.00% is $19,000, bringing your total insured mortgage to
                $494,000. You can review the full schedule on the{' '}
                <a
                  href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance/mortgage-loan-insurance-premiums"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  CMHC mortgage insurance premiums
                </a>{' '}
                page.
              </p>
            </>
          ),
        },
        {
          title: 'Understanding the Stress Test',
          icon: TrendingDown,
          content: (
            <p>
              Before approving your mortgage, every federally regulated lender in Canada must
              confirm you can afford payments at a qualifying rate that is higher than your
              actual contract rate. Under{' '}
              <a
                href="https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                OSFI's B-20 guideline
              </a>
              , you must qualify at the greater of your contract rate plus 2% or a minimum
              floor rate of 5.25%. For instance, if your lender offers you a rate of 4.5%,
              you would need to prove you can handle payments at 6.5%. This stress test
              applies to purchases, renewals with a new lender, and refinances.
            </p>
          ),
        },
        {
          title: 'How Amortization Affects Your Payment',
          icon: Clock,
          content: (
            <p>
              The amortization period is the total length of time it takes to pay off your
              mortgage in full. In Canada, insured mortgages (less than 20% down) allow
              amortization up to 25 years. If you put 20% or more down, you can choose up to
              30 years. A shorter amortization means higher monthly payments, but you pay
              significantly less interest over the life of the loan. Extending from 25 to 30
              years lowers your monthly payment but can add tens of thousands of dollars in
              total interest cost. Choose the shortest amortization your budget can
              comfortably handle.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: 'How much is the mortgage on a $500,000 home?',
          answer: (
            <p>
              With 5% down ($25,000), a 4.5% interest rate, and a 25-year amortization,
              your monthly payment would be approximately $2,900. This includes the CMHC
              insurance premium of $19,000 rolled into the mortgage. Your actual payment
              will depend on the specific rate you lock in and your province's requirements.
              Use the calculator above for a personalized estimate, and visit the{' '}
              <a
                href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                FCAC mortgage page
              </a>{' '}
              for additional guidance on mortgage costs in Canada.
            </p>
          ),
        },
        {
          question: 'What is the current stress test rate?',
          answer: (
            <p>
              You must qualify at the higher of your contract rate plus 2% or the minimum
              qualifying rate of 5.25%, as set by{' '}
              <a
                href="https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                OSFI
              </a>
              . This means even if rates drop to 3.5%, you would still need to qualify at
              5.5%. The stress test is designed to ensure borrowers can handle potential rate
              increases during their mortgage term.
            </p>
          ),
        },
      ]}
    />
  );
}
