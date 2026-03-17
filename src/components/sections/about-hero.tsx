import { Button } from '@/components/ui/button';
import { LENDCITY } from '@/lib/lendcity';

export default function AboutHero() {
  return (
    <section className="section-padding container">
      <div className="flex w-fit items-center rounded-full border p-1 text-xs">
        <span className="bg-muted rounded-full px-3 py-1">Updated for 2026</span>
        <span className="px-3">New FHSA limits, HBP changes & more</span>
      </div>

      <h1 className="my-5 text-5xl leading-none tracking-tight lg:text-7xl">
        Built by mortgage professionals
        <br className="hidden sm:block" />
        who believe education comes first.
      </h1>

      <p className="text-muted-foreground leading-snug md:text-lg lg:text-xl">
        {LENDCITY.name} is a team of licensed mortgage professionals under{' '}
        {LENDCITY.brokerage} who saw first-hand how unprepared first-time buyers
        felt walking into the biggest purchase of their lives. So we built
        FirstHomeGuide.ca — a completely free, comprehensive education platform.
        When you&apos;re ready to take the next step, our concierge team walks
        you through every stage from pre-approval to closing.
        <br />
        <br />
        Eight structured modules, province-specific program lookups, interactive
        calculators, and plain-language explainers — all free. And when
        you&apos;re ready, our team is here to help.
      </p>

      <div className="mt-8">
        <Button asChild size="lg">
          <a href={LENDCITY.bookingUrl}>Book a Free Call</a>
        </Button>
      </div>
    </section>
  );
}
