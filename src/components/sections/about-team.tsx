import { ArrowRight } from 'lucide-react';

const values = [
  {
    title: 'Neutral & Unbiased',
    description:
      'No mortgage applications at the end. No referral links. No sponsored content. Just clear, honest education that puts the buyer first.',
  },
  {
    title: 'Province-Specific',
    description:
      'Federal programs are only half the picture. We cover every provincial incentive, rebate, and assistance program so nothing catches you off guard.',
  },
  {
    title: 'Always Current',
    description:
      'Housing policy changes fast. We track FHSA limits, HBP repayment rules, proposed GST changes, and provincial program updates so the guide stays accurate.',
  },
  {
    title: 'Plain Language',
    description:
      'GDS ratios, stress tests, amortization periods — we explain every concept in language anyone can understand, with real-dollar examples.',
  },
];

export default function AboutTeam() {
  return (
    <section className="section-padding container max-w-screen-xl">
      <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
        What makes this guide different
      </h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-snug">
        Most home buyer resources in Canada are either government PDFs that
        haven&apos;t been updated in years, or bank-sponsored content designed to
        sell you a mortgage. We built something better.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-muted/30 space-y-3 rounded-lg border p-6"
          >
            <h3 className="text-accent-foreground text-xl font-bold">
              {value.title}
            </h3>
            <p className="text-muted-foreground leading-snug">
              {value.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <a
          href="/guide/welcome/"
          className="text-chart-1 hover:text-chart-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          Start the guide
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
