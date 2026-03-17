import { ArrowRight, BookCheck, Globe, Scale, Shield } from 'lucide-react';

const values = [
  {
    title: 'Neutral & Unbiased',
    description:
      'No mortgage applications at the end. No referral links. No sponsored content. Every recommendation is based on publicly available government data — never a financial product pitch.',
    icon: Scale,
  },
  {
    title: 'Province-Specific',
    description:
      'Federal programs are only half the picture. We cover every provincial incentive, rebate, and assistance program across all 10 provinces and 3 territories so nothing catches you off guard.',
    icon: Globe,
  },
  {
    title: 'Always Current',
    description:
      'Housing policy changes fast. We track FHSA contribution limits, HBP withdrawal rules, proposed GST changes, land transfer tax rates, and provincial program updates so the guide stays accurate for 2026.',
    icon: Shield,
  },
  {
    title: 'Plain Language',
    description:
      'GDS ratios, stress tests, amortization periods — we explain every concept in language anyone can understand, with real-dollar examples using current Canadian figures.',
    icon: BookCheck,
  },
];

const dataSources = [
  {
    name: 'CMHC',
    fullName: 'Canada Mortgage and Housing Corporation',
  },
  {
    name: 'FCAC',
    fullName: 'Financial Consumer Agency of Canada',
  },
  {
    name: 'CRA',
    fullName: 'Canada Revenue Agency',
  },
  {
    name: 'Statistics Canada',
    fullName: 'Statistics Canada',
  },
  {
    name: 'Provincial Authorities',
    fullName: 'Provincial housing and land title authorities',
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
            <div className="flex items-center gap-3">
              <div className="bg-chart-1/10 flex size-9 items-center justify-center rounded-md">
                <value.icon className="text-chart-1 size-5" />
              </div>
              <h3 className="text-accent-foreground text-xl font-bold">
                {value.title}
              </h3>
            </div>
            <p className="text-muted-foreground leading-snug">
              {value.description}
            </p>
          </div>
        ))}
      </div>

      {/* Data Sources */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold tracking-tight">
          Built on authoritative sources
        </h3>
        <p className="text-muted-foreground mt-2 max-w-2xl leading-snug">
          Every fact, figure, and program detail in this guide is sourced from
          official Canadian government publications and verified against primary
          sources.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {dataSources.map((source) => (
            <div
              key={source.name}
              className="bg-muted/30 rounded-lg border px-4 py-3"
            >
              <p className="text-sm font-semibold">{source.name}</p>
              <p className="text-muted-foreground text-xs">{source.fullName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Review */}
      <div className="bg-muted/30 mt-10 rounded-lg border p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Verified & up to date</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-snug">
              Content reviewed against official government sources and updated
              regularly. Last comprehensive review: March 2026.
            </p>
          </div>
          <div className="bg-chart-1/10 flex-shrink-0 rounded-lg px-4 py-2 text-center">
            <p className="text-chart-1 text-2xl font-bold">53</p>
            <p className="text-muted-foreground text-xs">in-depth articles</p>
          </div>
        </div>
      </div>

      {/* Guide scope */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-5 text-center">
          <p className="text-3xl font-bold tracking-tight">8</p>
          <p className="text-muted-foreground mt-1 text-sm">
            structured modules
          </p>
        </div>
        <div className="rounded-lg border p-5 text-center">
          <p className="text-3xl font-bold tracking-tight">13</p>
          <p className="text-muted-foreground mt-1 text-sm">
            provinces & territories covered
          </p>
        </div>
        <div className="rounded-lg border p-5 text-center">
          <p className="text-3xl font-bold tracking-tight">$0</p>
          <p className="text-muted-foreground mt-1 text-sm">
            cost — free forever
          </p>
        </div>
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
