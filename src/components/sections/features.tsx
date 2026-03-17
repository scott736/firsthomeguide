import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const ITEMS = [
  {
    title: 'Module 1: Are You Ready?',
    image: { src: '/images/home/features/1.webp', width: 198, height: 133 },
    desc: 'Find out if you qualify as a first-time buyer, check your credit score, and understand the stress test.',
  },
  {
    title: 'Module 2: Saving Smart',
    image: { src: '/images/home/features/2.webp', width: 148, height: 124 },
    desc: 'FHSA, RRSP Home Buyers\' Plan, and how to combine them for up to $100,000 per couple.',
  },
  {
    title: 'Module 3: Down Payments & Mortgages',
    image: { src: '/images/home/features/3.webp', width: 154, height: 99 },
    desc: 'Down payment rules, CMHC insurance, fixed vs. variable rates, and getting pre-approved.',
  },
  {
    title: 'Module 4: Government Programs',
    image: { src: '/images/home/features/4.webp', width: 171, height: 120 },
    desc: 'Every federal and provincial program in one place — from HBTC to land transfer rebates.',
  },
  {
    title: 'Module 5: Finding a Home',
    image: { src: '/images/home/features/5.webp', width: 195, height: 74.6 },
    desc: 'Working with realtors, reading MLS listings, condo vs. freehold, and what to look for at showings.',
  },
  {
    title: 'Module 6: Making an Offer',
    image: { src: '/images/home/features/6.webp', width: 148, height: 124 },
    desc: 'Purchase agreements, conditions, bidding wars, and why home inspections matter.',
  },
  {
    title: 'Module 7: Closing the Deal',
    image: { src: '/images/home/features/7.webp', width: 186, height: 103 },
    desc: 'Complete closing cost breakdown: land transfer taxes, legal fees, title insurance, and what happens on closing day.',
  },
  {
    title: 'Module 8: Life After Closing',
    image: { src: '/images/home/features/8.webp', width: 186, height: 103 },
    desc: 'Emergency funds, property taxes, home insurance, mortgage renewal strategy, and energy efficiency grants.',
  },
];

const Features = ({ className }: { className?: string }) => {
  return (
    <section className={cn('py-10 md:py-20', className)}>
      <Carousel>
        <div className="container flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
              8 modules. One complete journey.
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg leading-snug">
              From your very first question to life after closing — we cover
              every step of buying your first home in Canada.
            </p>
          </div>
          <div className="hidden gap-3 md:flex">
            <CarouselPrevious className="via-muted/20 border-border to-muted/50 relative top-0 left-0 translate-y-0 rounded-md bg-gradient-to-br from-transparent" />
            <CarouselNext className="via-muted/20 border-border to-muted/50 relative top-0 left-0 translate-y-0 rounded-md bg-gradient-to-br from-transparent" />
          </div>
        </div>

        <CarouselContent className="mx-auto mt-10 max-w-[3000px] cursor-grab">
          {ITEMS.map((card, idx) => (
            <CarouselItem key={idx} className="min-w-70 basis-[16%] pl-6">
              <div className="flex h-full flex-col">
                <Card className="dark:via-muted/20 dark:to-muted/50 to-background via-card from-card h-43 bg-gradient-to-br dark:from-transparent">
                  <CardContent className="flex h-full items-center justify-center">
                    <img
                      src={card.image.src}
                      alt={card.title}
                      width={card.image.width}
                      height={card.image.height}
                      loading="lazy"
                      className="object-contain invert dark:invert-0"
                    />
                  </CardContent>
                </Card>

                {/* Text block outside of card */}
                <h3 className="text-accent-foreground mt-3 mb-2 text-lg font-bold">
                  {card.title}
                </h3>
                <p className="text-muted-foreground">{card.desc}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="container mt-10 flex justify-center gap-3 md:hidden">
          <CarouselPrevious className="dark:via-muted/20 border-border dark:to-muted/50 to-background via-card from-card relative top-0 left-0 translate-y-0 rounded-md bg-gradient-to-br dark:from-transparent" />
          <CarouselNext className="dark:via-muted/20 border-border dark:to-muted/50 to-background via-card from-card relative top-0 left-0 translate-y-0 rounded-md bg-gradient-to-br dark:from-transparent" />
        </div>
      </Carousel>
    </section>
  );
};

export default Features;
