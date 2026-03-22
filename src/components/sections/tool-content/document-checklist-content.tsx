import {
  Briefcase,
  CreditCard,
  FileText,
  Home,
  PiggyBank,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function DocumentChecklistContent() {
  return (
    <ToolEducationContent
      badge="Mortgage Documents"
      badgeIcon={FileText}
      title="Documents You Need for a"
      titleGradient="Mortgage Application"
      subtitle="A complete guide to every document your lender needs — from employment verification to down payment proof."
      heroImage={{
        src: '/images/tools/document-checklist.webp',
        alt: 'Organized file folder with mortgage application documents and checkmarks',
      }}
      sections={[
        {
          title: 'Employment and Income Documents',
          icon: Briefcase,
          content: (
            <>
              <p>
                Your lender needs to confirm that you earn a stable, verifiable income
                sufficient to cover your mortgage payments. At a minimum, you should gather
                your most recent pay stubs covering the last 30 days, a letter of
                employment confirming your position, salary, and start date, your T4 slips
                from the past two years, and your Notice of Assessment from the CRA for the
                past two years.
              </p>
              <p>
                If you are self-employed, the requirements are more extensive. Most lenders
                will ask for at least two years of T1 General tax returns, corresponding
                financial statements, your business license, and CRA Notices of Assessment.
                Some lenders may also request business bank statements to verify revenue
                consistency. You can learn more on the{' '}
                <a
                  href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  FCAC mortgage guide
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: 'Down Payment Verification',
          icon: PiggyBank,
          content: (
            <>
              <p>
                Lenders need to confirm where your down payment is coming from and that the
                funds have been in your possession for a reasonable period. You will
                typically need to provide bank or investment account statements showing at
                least 90 days of accumulation history. If you are receiving a financial
                gift from family, you will need a signed gift letter confirming the money is
                not a loan and does not need to be repaid.
              </p>
              <p>
                If you are withdrawing from your RRSP under the{' '}
                <a
                  href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Home Buyers' Plan
                </a>
                , include your RRSP statements showing the balance. Similarly, if you have
                been contributing to a{' '}
                <a
                  href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  FHSA
                </a>
                , have your FHSA statements ready.
              </p>
            </>
          ),
        },
        {
          title: 'Property Documents',
          icon: Home,
          content: (
            <p>
              Once you have found a home and made an offer, additional documents come into
              play. Your lender will need the Agreement of Purchase and Sale, the MLS
              listing for the property, the most recent property tax statement, and a home
              insurance quote. If you are purchasing a condominium, the lender will also
              require a condo status certificate, which details the financial health of the
              condo corporation, any pending special assessments, and the reserve fund
              balance.
            </p>
          ),
        },
        {
          title: 'Identity and Credit',
          icon: CreditCard,
          content: (
            <p>
              You will need to present government-issued photo identification and proof of
              Canadian residency or permanent resident status. You will also sign a credit
              authorization form that allows the lender to pull your credit report from
              Equifax or TransUnion. Before you apply, it is wise to{' '}
              <a
                href="https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score.html"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                check your own credit report
              </a>{' '}
              so you can correct any errors.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: 'How far back do lenders look at bank statements?',
          answer: (
            <p>
              Most Canadian lenders require 90 days of bank statements to verify your down
              payment source and spending habits. Large deposits outside your regular
              income — such as lump sums from selling an asset or receiving a gift — will
              need to be explained with supporting documentation. The goal is to ensure
              your down payment comes from a legitimate, traceable source and that you are
              not taking on hidden debts to fund your purchase.
            </p>
          ),
        },
        {
          question: 'What extra documents do self-employed buyers need?',
          answer: (
            <p>
              Self-employed buyers typically need to provide two full years of tax returns
              (T1 General), the corresponding Notices of Assessment from the CRA, and
              financial statements for their business. Some lenders also request business
              bank statements covering the past 6 to 12 months and a copy of your business
              license. Because self-employed income can fluctuate, lenders often average
              your income over two years to determine your qualifying amount, which means
              consistent earnings over time work in your favour.
            </p>
          ),
        },
      ]}
    />
  );
}
