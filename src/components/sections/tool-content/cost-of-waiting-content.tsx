import {
  Banknote,
  Clock,
  Home,
  Percent,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import ToolEducationContent from '@/components/sections/tool-education-content';

export default function CostOfWaitingContent() {
  return (
    <ToolEducationContent
      badge="Cost of Delay"
      badgeIcon={Clock}
      title="The Real Cost of Delaying Your"
      titleGradient="Home Purchase"
      subtitle="How appreciation, rent, and rising rates compound against you — and when waiting actually makes sense."
      heroImage={{
        src: '/images/tools/cost-of-waiting.webp',
        alt: 'Clock and calendar with a house growing larger over time showing rising prices',
      }}
      highlights={[
        {
          label: 'Annual appreciation',
          value: '5%–7%',
          sublabel: '20-year Canadian average',
          icon: TrendingUp,
        },
        {
          label: 'Rent with no equity',
          value: '$24,000/yr',
          sublabel: 'At $2,000/month',
          icon: Home,
        },
        {
          label: 'Purchasing power lost',
          value: '~10%',
          sublabel: 'Per 1% rate increase',
          icon: Banknote,
        },
      ]}
      sections={[
        {
          title: 'How Home Prices Change Over Time',
          icon: TrendingUp,
          content: (
            <p>
              The CREA national composite benchmark tracks home prices across Canada and
              has shown consistent long-term growth despite periodic corrections. Even
              during slower markets or temporary dips, prices have historically recovered
              and continued climbing. Between 2005 and 2025, the national average home
              price more than doubled. While no one can guarantee future appreciation, the
              fundamental drivers of Canadian housing demand — population growth,
              immigration, and limited supply in major cities — continue to push prices
              upward. You can explore the data on the{' '}
              <a
                href="https://creastats.crea.ca/en-CA/"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                CREA statistics
              </a>{' '}
              website.
            </p>
          ),
        },
        {
          title: 'Rising Rates and Affordability',
          icon: Percent,
          content: (
            <>
              <p>
                Interest rates have a dramatic effect on what you can afford. Each 1%
                increase in mortgage rates reduces your purchasing power by approximately
                10%. If rates climb from 4.5% to 5.5% while you wait, a buyer who could
                afford a $500,000 home may now qualify for only $450,000 — even if their
                income has not changed. You can track current rates on the{' '}
                <a
                  href="https://www.bankofcanada.ca/rates/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Bank of Canada rates
                </a>{' '}
                page.
              </p>
              <p>
                Rate movements are unpredictable, which means delaying your purchase is a
                gamble in both directions.
              </p>
            </>
          ),
        },
        {
          title: 'Opportunity Cost of Rent',
          icon: Banknote,
          content: (
            <p>
              Every month you rent is money that builds your landlord's equity instead of
              your own. If you are paying $2,000 per month in rent, that is $24,000 per
              year — or $48,000 over two years — with nothing to show for it at the end. A
              mortgage payment, by contrast, splits between interest and principal
              repayment. Even in the early years when interest dominates, a portion of
              every payment reduces your loan balance. Over five years of ownership, you
              could build $50,000 to $80,000 in equity through principal repayment alone,
              plus any appreciation in the home's value.
            </p>
          ),
        },
        {
          title: 'When It Makes Sense to Wait',
          icon: ShieldCheck,
          content: (
            <p>
              Despite the costs of delay, there are valid reasons to hold off. If your
              credit score is below 680, spending time improving it can help you qualify
              for a better rate, saving thousands over your mortgage term. If you are close
              to the 20% down payment threshold, waiting a few months to cross that line
              eliminates the CMHC insurance premium entirely — a savings of tens of
              thousands of dollars. Unstable employment or the possibility of relocating
              within a few years also argues for patience. Rushing into a purchase you
              cannot comfortably afford is always worse than waiting strategically with a
              clear savings plan.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: 'How much do Canadian home prices go up each year?',
          answer: (
            <p>
              The Canadian Real Estate Association reports that national home prices have
              increased an average of 5% to 7% annually over the past two decades.
              However, this varies significantly by city and property type. Some markets
              like Toronto and Vancouver have seen periods of double-digit annual growth,
              while other regions have experienced more modest gains or occasional
              declines. You can review the data on the{' '}
              <a
                href="https://creastats.crea.ca/en-CA/"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                CREA
              </a>{' '}
              website.
            </p>
          ),
        },
        {
          question: 'Should I buy now or wait for prices to drop?',
          answer: (
            <p>
              Timing the real estate market is extremely difficult, even for professional
              investors. Most financial advisors recommend buying when you are financially
              ready — meaning you have a stable income, manageable debts, a sufficient down
              payment, and an emergency fund — rather than trying to predict market
              corrections. Historically, buyers who waited for a crash often missed years
              of appreciation. The most reliable strategy is to focus on what you can
              control: your savings rate, your credit score, and finding a home you can
              afford within your means.
            </p>
          ),
        },
      ]}
    />
  );
}
