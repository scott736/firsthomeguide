import { BookOpen, Calculator, FileText, MapPin, Users } from 'lucide-react';

const highlights = [
  { icon: BookOpen, label: '8 Modules' },
  { icon: MapPin, label: '10 Provinces' },
  { icon: Calculator, label: 'Interactive Tools' },
  { icon: FileText, label: '50+ Topics' },
  { icon: Users, label: 'LendCity Concierge' },
];

export default function AboutLogos() {
  return (
    <section className="section-padding container !pt-0 text-center">
      <p className="text-muted-foreground tracking-normal">
        Built by LendCity · Powered by data from CMHC, FCAC, CRA, and provincial housing authorities
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-13">
        {highlights.map((item, index) => (
          <div key={index} className="flex items-center gap-2 opacity-70">
            <item.icon className="size-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
