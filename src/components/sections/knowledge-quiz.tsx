'use client';

import { useCallback, useEffect, useState } from 'react';

import { CheckCircle, RotateCcw, Trophy, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface KnowledgeQuizProps {
  moduleNumber: number;
  moduleName: string;
  questions: QuizQuestion[];
}

function getStorageKey(moduleNumber: number) {
  return `fhg-quiz-module-${moduleNumber}`;
}

interface QuizState {
  completed: boolean;
  score: number;
  total: number;
  completedAt?: string;
}

function loadQuizState(moduleNumber: number): QuizState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(getStorageKey(moduleNumber));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveQuizState(moduleNumber: number, state: QuizState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(moduleNumber), JSON.stringify(state));
  } catch {
    // localStorage may be full or unavailable
  }
}

export default function KnowledgeQuiz({
  moduleNumber,
  moduleName,
  questions,
}: KnowledgeQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = loadQuizState(moduleNumber);
    if (saved?.completed) {
      setIsComplete(true);
      setCorrectAnswers(saved.score);
    }
    setMounted(true);
  }, [moduleNumber]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion?.correctIndex;
  const allCorrect = correctAnswers === questions.length;

  const handleCheck = useCallback(() => {
    if (selectedOption === null) return;
    setHasChecked(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setCorrectAnswers((prev) => prev + 1);
    }
  }, [selectedOption, currentQuestion]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setIsComplete(true);
      saveQuizState(moduleNumber, {
        completed: true,
        score: correctAnswers,
        total: questions.length,
        completedAt: new Date().toISOString(),
      });
    } else {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setHasChecked(false);
    }
  }, [currentIndex, questions.length, correctAnswers, moduleNumber]);

  const handleRetake = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasChecked(false);
    setCorrectAnswers(0);
    setIsComplete(false);
    saveQuizState(moduleNumber, {
      completed: false,
      score: 0,
      total: questions.length,
    });
  }, [moduleNumber, questions.length]);

  if (!mounted) {
    return (
      <Card className="my-6 not-content">
        <CardHeader>
          <CardTitle>Module {moduleNumber} Quiz</CardTitle>
          <div className="text-muted-foreground text-sm">Loading quiz...</div>
        </CardHeader>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="my-6 not-content">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy
              className={cn(
                'size-6',
                allCorrect ? 'text-chart-3' : 'text-chart-1',
              )}
            />
            <div>
              <CardTitle>Module {moduleNumber} Quiz Complete</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">{moduleName}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge
              variant={allCorrect ? 'default' : 'outline'}
              className={cn(
                'text-sm tabular-nums',
                allCorrect && 'bg-chart-1',
              )}
            >
              {correctAnswers} of {questions.length} correct
            </Badge>
          </div>

          {allCorrect ? (
            <div className="rounded-lg border border-chart-1/20 bg-chart-1/5 p-4">
              <p className="text-sm font-medium">
                Perfect score! You have a solid understanding of {moduleName.toLowerCase()}. Keep up the great work on your home buying journey.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Good effort! Consider reviewing the material and trying again to
              strengthen your understanding.
            </p>
          )}
        </CardContent>

        <CardFooter>
          <Button variant="outline" onClick={handleRetake}>
            <RotateCcw className="size-4" />
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="my-6 not-content">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Module {moduleNumber} Quiz</CardTitle>
          <Badge variant="outline" className="tabular-nums">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{moduleName}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm font-medium leading-relaxed">
          {currentQuestion.question}
        </p>

        <div className="space-y-2" role="radiogroup" aria-label="Answer options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isOptionCorrect = index === currentQuestion.correctIndex;

            let optionStyle = '';
            if (hasChecked) {
              if (isOptionCorrect) {
                optionStyle =
                  'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400';
              } else if (isSelected && !isOptionCorrect) {
                optionStyle =
                  'border-destructive/50 bg-destructive/10 text-destructive';
              }
            } else if (isSelected) {
              optionStyle = 'border-chart-1/50 bg-chart-1/5';
            }

            return (
              <label
                key={index}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors',
                  !hasChecked && !isSelected && 'hover:bg-muted/50',
                  hasChecked && 'cursor-default',
                  optionStyle || 'border-border',
                )}
              >
                <input
                  type="radio"
                  name={`quiz-${moduleNumber}-q${currentIndex}`}
                  value={index}
                  checked={isSelected}
                  onChange={() => {
                    if (!hasChecked) setSelectedOption(index);
                  }}
                  disabled={hasChecked}
                  className="sr-only"
                  aria-label={option}
                />
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                    isSelected && !hasChecked && 'border-chart-1 bg-chart-1',
                    hasChecked && isOptionCorrect && 'border-green-500 bg-green-500',
                    hasChecked && isSelected && !isOptionCorrect && 'border-destructive bg-destructive',
                    !isSelected && !hasChecked && 'border-input bg-background',
                    hasChecked && !isSelected && !isOptionCorrect && 'border-input bg-background',
                  )}
                >
                  {hasChecked && isOptionCorrect && (
                    <CheckCircle className="size-3 text-white" />
                  )}
                  {hasChecked && isSelected && !isOptionCorrect && (
                    <XCircle className="size-3 text-white" />
                  )}
                  {isSelected && !hasChecked && (
                    <span className="size-2 rounded-full bg-white" />
                  )}
                </span>
                <span className="leading-snug">{option}</span>
              </label>
            );
          })}
        </div>

        {hasChecked && (
          <div
            className={cn(
              'rounded-lg border p-3 text-sm leading-relaxed',
              isCorrect
                ? 'border-green-500/20 bg-green-500/5'
                : 'border-destructive/20 bg-destructive/5',
            )}
          >
            <p className="mb-1 font-medium">
              {isCorrect ? 'Correct!' : 'Not quite.'}
            </p>
            <p className="text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-3">
        {!hasChecked ? (
          <Button
            onClick={handleCheck}
            disabled={selectedOption === null}
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentIndex + 1 >= questions.length
              ? 'See Results'
              : 'Next Question'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
