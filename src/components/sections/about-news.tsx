import { LENDCITY } from '@/lib/lendcity';

const stats: { stat: string; description: React.ReactNode; source: string; cta?: boolean }[] = [
  {
    stat: '85%',
    description:
      'of prospective Canadian homeowners say they don\'t feel comfortable with the home buying or mortgage process.',
    source: 'TD Bank 2024 Survey',
  },
  {
    stat: '53%',
    description:
      'of prospective home buyers said they\'d feel "more confident" with access to quick advice from a professional.',
    source: 'TD Bank 2025 Survey',
    cta: true,
  },
  {
    stat: '$0',
    description: <>is what it costs to learn how to buy a home. Every module, calculator, and provincial program lookup is free — built and maintained by <a href={LENDCITY.website} title={LENDCITY.title} target="_blank" rel="noopener">{LENDCITY.name}</a>'s mortgage team.</>,
    source: 'FirstHomeGuide.ca',
  },
];

export default function AboutNews() {
  return (
    <section className="section-padding bg-muted/40">
      <div className="container">
        <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
          Why this matters
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((item, index) => (
            <div key={index} className="space-y-3">
              <p className="text-gradient text-5xl font-bold">{item.stat}</p>
              <p className="text-accent-foreground text-lg leading-snug">
                {item.description}
              </p>
              <p className="text-muted-foreground text-sm">{item.source}</p>
              {item.cta && (
                <p className="text-sm font-medium">
                  That&apos;s exactly what <a href={LENDCITY.website} title={LENDCITY.title} target="_blank" rel="noopener">{LENDCITY.name}</a> provides.{' '}
                  <a
                    href={LENDCITY.bookingUrl}
                    className="text-chart-1 hover:text-chart-2 underline underline-offset-2 transition-colors"
                  >
                    Book a free call
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
