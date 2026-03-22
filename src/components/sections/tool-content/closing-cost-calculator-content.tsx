import {
  Calculator,
  DollarSign,
  FileText,
  Home,
  Landmark,
  Receipt,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function ClosingCostCalculatorContent() {
  return (
    <ToolEducationContent
      badge="Closing Costs Guide"
      badgeIcon={Receipt}
      title="What Are Closing Costs in"
      titleGradient="Canada?"
      subtitle="From land transfer tax to legal fees — understand every expense you'll face on closing day beyond your down payment."
      heroImage={{
        src: '/images/tools/closing-cost-calculator.webp',
        alt: 'House keys on top of closing documents with calculator',
      }}
      highlights={[
        {
          label: 'Of purchase price',
          value: '1.5%–4%',
          sublabel: 'Typical closing cost range',
          icon: Calculator,
        },
        {
          label: 'Ontario LTT on $500K',
          value: '$6,475',
          sublabel: 'Land transfer tax example',
          icon: Landmark,
        },
        {
          label: 'Legal fees',
          value: '$1,500–$2,500',
          sublabel: 'Lawyer or notary costs',
          icon: FileText,
        },
      ]}
      sections={[
        {
          title: 'Land Transfer Tax',
          icon: Landmark,
          content: (
            <>
              <p>
                Land transfer tax is usually the single largest closing cost.
                Every province except Alberta and Saskatchewan charges a tax
                when property changes hands, and rates vary significantly. In
                Ontario, the tax is tiered: 0.5% on the first $55,000, 1% on
                $55,001 to $250,000, 1.5% on $250,001 to $400,000, and 2% on
                $400,001 to $2,000,000. On a $500,000 home in Ontario, you
                would pay approximately $6,475.
              </p>
              <p>
                Toronto buyers face an additional municipal land transfer tax at
                matching rates, effectively doubling the bill. In British
                Columbia, the property transfer tax runs from 1% on the first
                $200,000 up to 5% on amounts over $3,000,000. Alberta charges
                only a modest registration fee of roughly $400. See the{' '}
                <a
                  href="https://www.ontario.ca/document/land-transfer-tax"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Ontario LTT
                </a>{' '}
                and{' '}
                <a
                  href="https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  BC PTT
                </a>{' '}
                pages for full details.
              </p>
            </>
          ),
        },
        {
          title: 'Legal Fees and Title Insurance',
          icon: FileText,
          content: (
            <>
              <p>
                You are required to have a real estate lawyer (or notary in BC
                and Quebec) handle the closing of your purchase. Legal fees
                typically range from $1,500 to $2,500 and cover the review of
                your purchase agreement, title search, mortgage registration,
                and the transfer of funds.
              </p>
              <p>
                Title insurance is a one-time premium of $250 to $500 that
                protects you and your lender against title defects, fraud, and
                encroachment issues. Most lenders require title insurance as a
                condition of funding your mortgage.
              </p>
            </>
          ),
        },
        {
          title: 'Other Common Closing Costs',
          icon: DollarSign,
          content: (
            <p>
              Beyond the major items, several smaller costs add up quickly. A
              home inspection costs $400 to $600 and is strongly recommended
              even though it is not legally required. An appraisal, if your
              lender orders one, runs $300 to $500. Property tax adjustments
              reimburse the seller for any taxes they have prepaid beyond the
              closing date. Utility adjustments work the same way for water and
              sewer charges. Moving costs, immediate repairs, and utility hookup
              fees should also be part of your budget.
            </p>
          ),
        },
        {
          title: 'First-Time Buyer Rebates',
          icon: Home,
          content: (
            <>
              <p>
                Most provinces offer land transfer tax relief for first-time
                buyers. In Ontario, you can receive a rebate of up to $4,000 on
                the provincial land transfer tax, which fully covers the tax on
                homes up to $368,000. In Toronto, first-time buyers also receive
                an additional rebate of up to $4,475 on the municipal land
                transfer tax.
              </p>
              <p>
                In British Columbia, first-time buyers are fully exempt from the
                property transfer tax on homes priced at $500,000 or less, with
                a partial exemption on homes up to $835,000. See the{' '}
                <a
                  href="https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  BC PTT page
                </a>{' '}
                for full details.
              </p>
            </>
          ),
        },
      ]}
      faqs={[
        {
          question: 'How much cash do I need at closing?',
          answer: (
            <p>
              Plan for your down payment plus 1.5% to 4% of the purchase price
              in closing costs. On a $500,000 home with 5% down, budget
              approximately $25,000 for the down payment plus $15,000 to
              $20,000 for closing costs — a total of $40,000 to $45,000 in
              cash. Some costs like the home inspection and appraisal are paid
              before closing, so you will need that money available even
              earlier.
            </p>
          ),
        },
        {
          question:
            'Is land transfer tax included in my mortgage?',
          answer: (
            <p>
              No. Land transfer tax must be paid from your own funds at closing
              and cannot be added to your mortgage. This is a cash expense that
              comes directly out of your savings, which is why it surprises so
              many buyers. The only exception is in some provinces where
              first-time buyer rebates effectively eliminate or reduce the tax.
              Always confirm the exact amount with your real estate lawyer
              before closing day.
            </p>
          ),
        },
      ]}
    />
  );
}
