'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  MapPin,
  PiggyBank,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LENDCITY } from '@/lib/lendcity';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuestionOption {
  label: string;
  value: number;
}

interface Question {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  options: QuestionOption[];
}

interface Recommendation {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  priority: 'high' | 'medium' | 'low';
}

type ReadinessCategory =
  | 'Getting Started'
  | 'Building Your Foundation'
  | 'Ready to Move Forward';

interface AssessmentResults {
  answers: Record<string, number>;
  province: string;
  score: number;
  maxScore: number;
  percentage: number;
  category: ReadinessCategory;
  completedAt: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'fhg-readiness-assessment';

const PROVINCES = [
  'Ontario',
  'British Columbia',
  'Alberta',
  'Quebec',
  'Manitoba',
  'Saskatchewan',
  'Nova Scotia',
  'New Brunswick',
  'Prince Edward Island',
  'Newfoundland & Labrador',
] as const;

const PROVINCE_SLUG_MAP: Record<string, string> = {
  Ontario: '/guide/4-government-programs/2-ontario/',
  'British Columbia': '/guide/4-government-programs/3-british-columbia/',
  Alberta: '/guide/4-government-programs/4-alberta-prairies/',
  Quebec: '/guide/4-government-programs/5-quebec/',
  Manitoba: '/guide/4-government-programs/4-alberta-prairies/',
  Saskatchewan: '/guide/4-government-programs/4-alberta-prairies/',
  'Nova Scotia': '/guide/4-government-programs/6-atlantic-canada/',
  'New Brunswick': '/guide/4-government-programs/6-atlantic-canada/',
  'Prince Edward Island': '/guide/4-government-programs/6-atlantic-canada/',
  'Newfoundland & Labrador': '/guide/4-government-programs/6-atlantic-canada/',
};

const QUESTIONS: Question[] = [
  {
    id: 'credit',
    title: 'What is your credit score range?',
    description:
      'Your credit score affects the mortgage rates you qualify for and your approval odds.',
    icon: CreditCard,
    options: [
      { label: 'Below 600', value: 0 },
      { label: '600 - 679', value: 1 },
      { label: '680 - 759', value: 2 },
      { label: '760+', value: 3 },
    ],
  },
  {
    id: 'savings',
    title: 'How much have you saved for a down payment?',
    description:
      'Your savings determine your down payment size and whether you need mortgage insurance.',
    icon: PiggyBank,
    options: [
      { label: 'Less than $10,000', value: 0 },
      { label: '$10,000 - $30,000', value: 1 },
      { label: '$30,000 - $60,000', value: 2 },
      { label: '$60,000+', value: 3 },
    ],
  },
  {
    id: 'debt',
    title: 'What are your total monthly debt payments?',
    description:
      'Lenders look at your debt-to-income ratios to determine how much you can borrow.',
    icon: TrendingUp,
    options: [
      { label: 'Over $1,500/month', value: 0 },
      { label: '$800 - $1,500/month', value: 1 },
      { label: '$200 - $800/month', value: 2 },
      { label: 'Under $200/month', value: 3 },
    ],
  },
  {
    id: 'employment',
    title: 'How stable is your current employment?',
    description:
      'Lenders typically want at least 2 years of stable employment or income history.',
    icon: Target,
    options: [
      { label: 'Just started or between jobs', value: 0 },
      { label: 'Less than 1 year', value: 1 },
      { label: '1 - 2 years', value: 2 },
      { label: '2+ years at current job', value: 3 },
    ],
  },
  {
    id: 'knowledge',
    title: 'How would you rate your home-buying knowledge?',
    description:
      'Understanding the process helps you make confident decisions and avoid costly mistakes.',
    icon: BookOpen,
    options: [
      { label: "I don't know where to start", value: 0 },
      { label: 'I know the basics', value: 1 },
      { label: 'I understand most concepts', value: 2 },
      { label: "I'm very well-informed", value: 3 },
    ],
  },
  {
    id: 'timeline',
    title: 'When are you hoping to buy?',
    description:
      'Your timeline helps determine which steps to prioritize right now.',
    icon: Calendar,
    options: [
      { label: 'Someday / not sure', value: 0 },
      { label: '2+ years from now', value: 1 },
      { label: '1 - 2 years', value: 2 },
      { label: 'Within 12 months', value: 3 },
    ],
  },
  {
    id: 'province',
    title: 'Which province are you buying in?',
    description:
      'Each province has unique programs, rebates, and land transfer taxes for first-time buyers.',
    icon: MapPin,
    options: PROVINCES.map((p) => ({ label: p, value: -1 })),
  },
];

const MAX_SCORE = 18; // 6 scored questions x 3 max each

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCategory(percentage: number): ReadinessCategory {
  if (percentage <= 33) return 'Getting Started';
  if (percentage <= 66) return 'Building Your Foundation';
  return 'Ready to Move Forward';
}

function getCategoryColor(category: ReadinessCategory): string {
  switch (category) {
    case 'Getting Started':
      return 'text-orange-500 dark:text-orange-400';
    case 'Building Your Foundation':
      return 'text-yellow-500 dark:text-yellow-400';
    case 'Ready to Move Forward':
      return 'text-green-500 dark:text-green-400';
  }
}

function getCategoryBg(category: ReadinessCategory): string {
  switch (category) {
    case 'Getting Started':
      return 'from-orange-500/20 to-orange-500/5';
    case 'Building Your Foundation':
      return 'from-yellow-500/20 to-yellow-500/5';
    case 'Ready to Move Forward':
      return 'from-green-500/20 to-green-500/5';
  }
}

function getGaugeStroke(category: ReadinessCategory): string {
  switch (category) {
    case 'Getting Started':
      return 'stroke-orange-500';
    case 'Building Your Foundation':
      return 'stroke-yellow-500';
    case 'Ready to Move Forward':
      return 'stroke-green-500';
  }
}

function buildRecommendations(
  answers: Record<string, number>,
  province: string,
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Low credit score
  if ((answers.credit ?? 0) <= 1) {
    recs.push({
      title: 'Improve Your Credit Score',
      description:
        'Learn how credit scores work in Canada and proven strategies to raise yours before applying.',
      href: '/guide/1-are-you-ready/3-credit-score/',
      icon: CreditCard,
      priority: 'high',
    });
  }

  // Low savings
  if ((answers.savings ?? 0) <= 1) {
    recs.push({
      title: 'Open a First Home Savings Account (FHSA)',
      description:
        'Save up to $40,000 tax-free for your down payment with this powerful new account.',
      href: '/guide/2-saving-smart/1-fhsa/',
      icon: PiggyBank,
      priority: 'high',
    });
    recs.push({
      title: 'Check Your Affordability',
      description:
        'Use our calculator to see how much home you can afford based on your current savings and income.',
      href: '/tools/affordability-calculator',
      icon: DollarSign,
      priority: 'medium',
    });
  }

  // High debt
  if ((answers.debt ?? 0) <= 1) {
    recs.push({
      title: 'Understand GDS/TDS Ratios',
      description:
        'Learn how lenders calculate your debt service ratios and what you can do to improve them.',
      href: '/guide/3-down-payments-mortgages/6-gds-tds-ratios/',
      icon: TrendingUp,
      priority: 'high',
    });
    recs.push({
      title: 'Calculate What You Can Afford',
      description:
        'See how your current debt load affects the maximum mortgage you can qualify for.',
      href: '/tools/affordability-calculator',
      icon: DollarSign,
      priority: 'medium',
    });
  }

  // Low knowledge
  if ((answers.knowledge ?? 0) <= 1) {
    recs.push({
      title: 'Start From the Beginning',
      description:
        'Our Module 1 covers everything you need to know about whether you\'re ready to buy your first home.',
      href: '/guide/1-are-you-ready/1-first-time-buyer/',
      icon: BookOpen,
      priority: 'medium',
    });
  }

  // Short timeline (buying soon)
  if ((answers.timeline ?? 0) >= 2) {
    recs.push({
      title: 'Get Pre-Approved',
      description:
        'With your timeline, getting a mortgage pre-approval should be your next step. Learn what to expect.',
      href: '/guide/3-down-payments-mortgages/5-pre-approval/',
      icon: CheckCircle2,
      priority: 'high',
    });
  }

  // Province-specific
  if (province) {
    const slug = PROVINCE_SLUG_MAP[province];
    if (slug) {
      recs.push({
        title: `${province} Programs & Rebates`,
        description: `Explore first-time buyer incentives, tax credits, and land transfer rebates specific to ${province}.`,
        href: slug,
        icon: MapPin,
        priority: 'medium',
      });
    }
  }

  // Deduplicate by href
  const seen = new Set<string>();
  return recs.filter((r) => {
    if (seen.has(r.href)) return false;
    seen.add(r.href);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percentage = ((current + 1) / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {current + 1} of {total}
        </span>
        <span className="text-muted-foreground font-medium">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-chart-1 to-chart-2"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

function ScoreGauge({
  percentage,
  category,
}: {
  percentage: number;
  category: ReadinessCategory;
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" className="-rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="12"
          className="stroke-muted"
        />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className={getGaugeStroke(category)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          style={{ strokeDasharray: circumference }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold tracking-tight"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {percentage}%
        </motion.span>
        <motion.span
          className={cn('text-sm font-medium', getCategoryColor(category))}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {category}
        </motion.span>
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const Icon = rec.icon;
  return (
    <a href={rec.href} className="group block">
      <Card className="transition-colors hover:border-chart-1/30 hover:bg-chart-1/5">
        <CardContent className="flex items-start gap-4 py-1">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-lg',
              rec.priority === 'high'
                ? 'bg-chart-1/15 text-chart-1'
                : 'bg-muted text-muted-foreground',
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold group-hover:text-chart-1 transition-colors">
                {rec.title}
              </p>
              {rec.priority === 'high' && (
                <Badge
                  variant="outline"
                  className="border-chart-1/30 text-chart-1 shrink-0 text-[10px]"
                >
                  Priority
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {rec.description}
            </p>
          </div>
          <ArrowRight className="text-muted-foreground mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </CardContent>
      </Card>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Slide variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ReadinessAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [province, setProvince] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);

  // Load saved results on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AssessmentResults = JSON.parse(saved);
        if (parsed.answers && parsed.completedAt) {
          setAnswers(parsed.answers);
          setProvince(parsed.province);
          setShowResults(true);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const currentQuestion = QUESTIONS[currentStep];
  const isProvinceQuestion = currentQuestion?.id === 'province';
  const hasSelection = isProvinceQuestion
    ? province !== ''
    : answers[currentQuestion?.id] !== undefined;

  const score = useMemo(() => {
    return Object.entries(answers).reduce((sum, [key, val]) => {
      if (key === 'province') return sum;
      return sum + val;
    }, 0);
  }, [answers]);

  const percentage = useMemo(
    () => Math.round((score / MAX_SCORE) * 100),
    [score],
  );

  const category = useMemo(() => getCategory(percentage), [percentage]);

  const recommendations = useMemo(
    () => buildRecommendations(answers, province),
    [answers, province],
  );

  const handleSelect = useCallback(
    (value: number | string) => {
      if (isProvinceQuestion) {
        setProvince(value as string);
      } else {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: value as number,
        }));
      }
    },
    [currentQuestion, isProvinceQuestion],
  );

  const handleNext = useCallback(() => {
    if (currentStep < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      // Complete assessment
      const finalScore = Object.entries(answers).reduce((sum, [key, val]) => {
        if (key === 'province') return sum;
        return sum + val;
      }, 0);
      const finalPercentage = Math.round((finalScore / MAX_SCORE) * 100);

      const results: AssessmentResults = {
        answers,
        province,
        score: finalScore,
        maxScore: MAX_SCORE,
        percentage: finalPercentage,
        category: getCategory(finalPercentage),
        completedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      } catch {
        // storage full or unavailable
      }

      setShowResults(true);
    }
  }, [currentStep, answers, province]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setProvince('');
    setCurrentStep(0);
    setShowResults(false);
    setDirection(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Results screen
  // ---------------------------------------------------------------------------

  if (showResults) {
    return (
      <section className="section-padding">
        <div className="container max-w-screen-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Score header */}
            <div className="text-center">
              <Badge variant="outline" className="mb-4 gap-1.5">
                <Sparkles className="size-3" />
                Assessment Complete
              </Badge>
              <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
                Your Readiness{' '}
                <span className="text-gradient">Score</span>
              </h2>
              <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-lg leading-snug">
                Based on your answers, here is where you stand on your
                journey to buying your first home.
              </p>
            </div>

            {/* Score card */}
            <Card
              className={cn(
                'overflow-hidden border-0 bg-gradient-to-b',
                getCategoryBg(category),
              )}
            >
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <ScoreGauge percentage={percentage} category={category} />
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    You scored{' '}
                    <span className="text-foreground font-semibold">
                      {score}
                    </span>{' '}
                    out of {MAX_SCORE} points
                  </p>
                  {province && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      Buying in{' '}
                      <span className="text-foreground font-medium">
                        {province}
                      </span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Your Personalized Next Steps
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Based on your answers, we recommend focusing on these
                    areas first.
                  </p>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <RecommendationCard key={rec.href} rec={rec} />
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Book a call CTA */}
            <Card className="border-chart-1/20 bg-gradient-to-br from-chart-1/5 to-transparent">
              <CardContent className="py-2">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-semibold tracking-tight">
                      Want expert guidance?
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A licensed mortgage professional can review your full
                      picture and build a plan tailored to you — free, no
                      obligation.
                    </p>
                  </div>
                  <Button size="lg" className="shrink-0" asChild>
                    <a href={LENDCITY.bookingUrl}>Book a Free Call</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Retake */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleRetake}
                className="gap-2"
              >
                <RefreshCw className="size-4" />
                Retake Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Quiz screen
  // ---------------------------------------------------------------------------

  const Icon = currentQuestion.icon;

  return (
    <section className="section-padding">
      <div className="container max-w-screen-md">
        {/* Header */}
        <div className="mb-10 space-y-3 md:mb-14">
          <Badge variant="outline" className="gap-1.5">
            <ClipboardCheck className="size-3" />
            Readiness Assessment
          </Badge>
          <h2 className="text-4xxl leading-tight tracking-tight md:text-5xl">
            Am I Ready to{' '}
            <span className="text-gradient">Buy?</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-snug">
            Answer 7 quick questions to evaluate your readiness and get
            personalized recommendations.
          </p>
        </div>

        {/* Progress */}
        <ProgressBar current={currentStep} total={QUESTIONS.length} />

        {/* Question */}
        <div className="mt-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-chart-1/15 text-chart-1 flex size-10 items-center justify-center rounded-lg">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {currentQuestion.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {currentQuestion.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      'grid gap-3',
                      isProvinceQuestion
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1',
                    )}
                  >
                    {currentQuestion.options.map((option) => {
                      const isSelected = isProvinceQuestion
                        ? province === option.label
                        : answers[currentQuestion.id] === option.value;

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() =>
                            handleSelect(
                              isProvinceQuestion
                                ? option.label
                                : option.value,
                            )
                          }
                          className={cn(
                            'flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all',
                            'hover:border-chart-1/40 hover:bg-chart-1/5',
                            isSelected
                              ? 'border-chart-1 bg-chart-1/10 ring-1 ring-chart-1/30'
                              : 'dark:bg-input/10',
                          )}
                        >
                          <div
                            className={cn(
                              'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                              isSelected
                                ? 'border-chart-1 bg-chart-1'
                                : 'border-muted-foreground/40',
                            )}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="size-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                          <span
                            className={cn(
                              'font-medium',
                              isSelected && 'text-chart-1',
                            )}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hasSelection}
            className="gap-2"
          >
            {currentStep < QUESTIONS.length - 1
              ? 'Next'
              : 'See My Results'}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
