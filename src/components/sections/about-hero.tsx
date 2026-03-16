export default function AboutHero() {
  return (
    <section className="section-padding container">
      <div className="flex w-fit items-center rounded-full border p-1 text-xs">
        <span className="bg-muted rounded-full px-3 py-1">Updated for 2026</span>
        <span className="px-3">New FHSA limits, HBP changes & more</span>
      </div>

      <h1 className="my-5 text-5xl leading-none tracking-tight lg:text-7xl">
        Canada&apos;s missing home buyer
        <br className="hidden sm:block" />
        education platform.
      </h1>

      <p className="text-muted-foreground leading-snug md:text-lg lg:text-xl">
        FirstHomeGuide.ca exists because 85% of prospective Canadian homeowners
        say they don&apos;t feel comfortable with the home buying or mortgage
        process. Official resources are scattered across government PDFs and
        isolated web pages. Private guides lead you to their own mortgage
        products. There&apos;s no single, neutral, comprehensive platform that
        walks Canadians through every step — from &ldquo;Am I ready?&rdquo; to
        &ldquo;What happens after closing?&rdquo;
        <br />
        <br />
        We built the resource we wish existed when we started looking. Eight
        structured modules, province-specific program lookups, interactive
        calculators, and plain-language explainers — all free, with no product
        upsell.
      </p>
    </section>
  );
}
