import { ArrowRight, Home, MapPin, Quote } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SuccessStory {
  name: string;
  location: string;
  story: string;
  purchased: string;
  savings: string;
  avatar: string;
}

const STORIES: SuccessStory[] = [
  {
    name: 'Priya M.',
    location: 'Toronto, ON',
    story:
      'I had no idea the FHSA and RRSP Home Buyers\' Plan could be combined until I read the savings module. The guide\'s combined strategy page literally changed my timeline from 5 years to 3.',
    purchased: 'First condo in Toronto',
    savings: 'Saved $14,000 with FHSA + RRSP HBP',
    avatar: 'https://avatar.vercel.sh/priya',
  },
  {
    name: 'Marcus L.',
    location: 'Calgary, AB',
    story:
      'The closing costs calculator showed me exactly what to budget beyond my down payment. I would have been $11,000 short on closing day without it. The land transfer tax breakdown by province was a lifesaver.',
    purchased: 'Townhouse in Calgary',
    savings: 'Saved $8,500 with Alberta programs',
    avatar: 'https://avatar.vercel.sh/marcus',
  },
  {
    name: 'Sophie T.',
    location: 'Montreal, QC',
    story:
      'As a self-employed freelancer, I thought buying was impossible. The self-employed mortgage page and the Quebec programs section helped me understand exactly what documentation I needed and which provincial grants I qualified for.',
    purchased: 'Duplex in Verdun',
    savings: 'Saved $9,200 with Quebec tax credit + FHSA',
    avatar: 'https://avatar.vercel.sh/sophie',
  },
  {
    name: 'James & Rina K.',
    location: 'Vancouver, BC',
    story:
      'We used the affordability calculator and the BC programs page side by side. Finding out about the BC first-time buyer property transfer tax exemption and layering it with federal programs made all the difference.',
    purchased: 'Apartment in Burnaby',
    savings: 'Saved $16,000 with BC exemption + FHSA',
    avatar: 'https://avatar.vercel.sh/james-rina',
  },
  {
    name: 'David R.',
    location: 'Halifax, NS',
    story:
      'I went through every module over two weekends. The stress test explainer finally made sense of why the bank offered less than I expected, and the bidding wars page gave me the confidence to negotiate my first offer.',
    purchased: 'Semi-detached in Halifax',
    savings: 'Saved $6,800 with Atlantic Canada programs',
    avatar: 'https://avatar.vercel.sh/david',
  },
];

const VISIBLE_STORIES = STORIES.slice(0, 4);

export default function SuccessStories() {
  return (
    <section className="section-padding">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            From guide readers to{' '}
            <span className="text-gradient">homeowners</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-snug">
            Real stories from Canadians who used FirstHomeGuide.ca to buy their
            first home
          </p>
        </div>

        {/* Stories Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VISIBLE_STORIES.map((story) => (
            <Card
              key={story.name}
              className={cn(
                'h-full bg-transparent p-6 transition-colors duration-200 md:p-8',
                'hover:bg-accent/40',
              )}
            >
              <CardHeader className="flex items-start gap-4 p-0">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      className="size-10 rounded-full"
                      width={40}
                      height={40}
                      alt={`${story.name} avatar`}
                      loading="lazy"
                      src={story.avatar}
                    />
                    <div>
                      <p className="text-sm font-bold">{story.name}</p>
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        <MapPin className="size-3" />
                        {story.location}
                      </p>
                    </div>
                  </div>
                  <Quote className="text-chart-1/20 size-8 shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-0 pt-4">
                <blockquote className="text-muted-foreground text-sm leading-relaxed">
                  &ldquo;{story.story}&rdquo;
                </blockquote>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 text-xs font-normal"
                  >
                    <Home className="size-3" />
                    {story.purchased}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {story.savings}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <Button asChild size="lg" className="text-base">
            <a href="/guide/welcome/">
              Start Your Journey
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <p className="text-muted-foreground text-sm">
            Free, no account required
          </p>
        </div>
      </div>
    </section>
  );
}
