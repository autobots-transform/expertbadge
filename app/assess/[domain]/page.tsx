'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDomain } from '@/lib/domains';
import { computeBadge } from '@/lib/scoring';
import { supabase } from '@/lib/supabase';
import {
  BadgeResult,
  ClarifyResult,
  DomainRating,
  EvaluationResult,
  QuestionScores,
  QuestionTurn,
} from '@/lib/types';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import ClarificationPanel from '@/components/ClarificationPanel';
import FeedbackCard from '@/components/FeedbackCard';

type Phase = 'intro' | 'questioning';
type Step = 'idle' | 'clarifying' | 'feedback';

interface RatingEntry {
  domain: string;
  rating: DomainRating;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('session_id', id);
  }
  return id;
}

async function saveBadge(badge: BadgeResult, sessionId: string) {
  if (!supabase) return;
  try {
    await supabase.from('badge_results').insert({
      session_id: sessionId,
      domain: badge.domain,
      tier: badge.tier,
      overall_score: badge.overallScore,
      accuracy_avg: badge.avgAccuracy,
      nuance_avg: badge.avgNuance,
      vocab_avg: badge.avgVocab,
      domain_ratings: badge.domainRatings,
      assessed_at: badge.assessedAt,
    });
  } catch (err) {
    // Best-effort persistence; never block the user's result.
    console.error('Badge save failed:', err);
  }
}

const FLAG_MESSAGE =
  'That answer was too brief or vague to assess fairly. Add more specifics — your reasoning, the tradeoffs, the frameworks you use — and try again.';

export default function AssessPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: slug } = use(params);
  const router = useRouter();
  const domain = useMemo(() => getDomain(slug), [slug]);

  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState<Step>('idle');
  const [currentQ, setCurrentQ] = useState(0);

  const [answer, setAnswer] = useState('');
  const [clarificationResponse, setClarificationResponse] = useState('');
  const [currentTurn, setCurrentTurn] = useState<QuestionTurn | null>(null);

  const [checking, setChecking] = useState(false); // /api/clarify in-flight (inline)
  const [evaluating, setEvaluating] = useState(false); // /api/evaluate in-flight (overlay)
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Accumulated across questions.
  const [turns, setTurns] = useState<QuestionTurn[]>([]);
  const [allScores, setAllScores] = useState<QuestionScores[]>([]);
  const [allRatings, setAllRatings] = useState<RatingEntry[]>([]);

  useEffect(() => {
    if (!domain) router.replace('/');
  }, [domain, router]);

  useEffect(() => {
    getSessionId();
  }, []);

  if (!domain) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-stone-500">
        Redirecting…
      </main>
    );
  }

  const question = domain.questions[currentQ];
  const isLast = currentQ === domain.questions.length - 1;

  // Runs the scoring call. `completedTurn` is the full record to persist on success.
  async function runEvaluate(
    completedTurn: QuestionTurn,
    clarification?: string
  ) {
    if (!domain) return;
    setError(null);
    setChecking(false);
    setEvaluating(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainSlug: domain.slug,
          questionId: question.id,
          answer: completedTurn.answer,
          clarificationResponse: clarification,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Evaluation failed. Please try again.');
      }

      const data: EvaluationResult = await res.json();

      if (data.answer_flagged) {
        // Combined response still too vague — return to the answer step so the
        // user can expand. Original answer is preserved.
        setError(FLAG_MESSAGE);
        setCurrentTurn(null);
        setClarificationResponse('');
        setStep('idle');
        setEvaluating(false);
        return;
      }

      setTurns((prev) => [...prev, completedTurn]);
      setResult(data);
      setStep('feedback');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Try again.'
      );
      setStep('idle');
    } finally {
      setEvaluating(false);
    }
  }

  // Initial "Evaluate answer" — first checks whether a clarification is warranted.
  async function handleInitialSubmit() {
    if (!domain) return;
    setError(null);
    setChecking(true);

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainSlug: domain.slug,
          questionId: question.id,
          answer,
        }),
      });

      const data: ClarifyResult = await res.json();

      if (res.ok && data.needs_clarification && data.clarifying_question) {
        setCurrentTurn({
          questionId: question.id,
          answer,
          clarifyingQuestion: data.clarifying_question,
        });
        setClarificationResponse('');
        setStep('clarifying');
        setChecking(false);
        return;
      }

      // No clarification needed — score the answer directly.
      await runEvaluate({ questionId: question.id, answer });
    } catch {
      // Fail open — clarification is an enhancement, never a blocker.
      await runEvaluate({ questionId: question.id, answer });
    }
  }

  async function submitWithClarification() {
    if (!currentTurn) return;
    await runEvaluate(
      { ...currentTurn, clarificationResponse },
      clarificationResponse
    );
  }

  async function skipClarification() {
    if (!currentTurn) return;
    await runEvaluate({ ...currentTurn, skippedClarification: true });
  }

  async function handleNext() {
    if (!domain || !result) return;

    const nextScores = [...allScores, result.scores];
    const nextRatings = [
      ...allRatings,
      { domain: question.domain, rating: result.domain_rating },
    ];

    if (isLast) {
      const totals = nextScores.reduce(
        (acc, s) => ({
          accuracy: acc.accuracy + s.accuracy,
          nuance: acc.nuance + s.nuance,
          vocab: acc.vocab + s.vocab,
        }),
        { accuracy: 0, nuance: 0, vocab: 0 }
      );

      const badge = computeBadge(
        totals,
        nextScores.length,
        nextRatings,
        domain.slug
      );

      sessionStorage.setItem('badge_result', JSON.stringify(badge));
      await saveBadge(badge, getSessionId());
      router.push('/results');
      return;
    }

    setAllScores(nextScores);
    setAllRatings(nextRatings);
    setCurrentQ((q) => q + 1);
    setAnswer('');
    setClarificationResponse('');
    setCurrentTurn(null);
    setResult(null);
    setError(null);
    setStep('idle');
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href="/"
        className="text-sm font-medium text-stone-400 transition hover:text-stone-600"
      >
        ← ExpertBadge
      </Link>

      {phase === 'intro' ? (
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-7 sm:p-9 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            {domain.label} assessment
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {domain.description}
          </p>

          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Benchmarked against
            </p>
            {domain.experts.map((e) => (
              <div key={e.key} className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${e.avatarColor} ${e.textColor}`}
                >
                  {e.key}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    {e.name}
                  </p>
                  <p className="text-xs text-stone-500">{e.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-xs leading-relaxed text-stone-500">
            {domain.questions.length} open-ended questions. Each answer is scored
            on accuracy, nuance, and vocabulary. We may ask one follow-up to make
            sure we judge what you actually know — be specific, as vague answers
            are sent back rather than scored.
          </div>

          <button
            onClick={() => setPhase('questioning')}
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Begin assessment →
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <ProgressBar
            current={currentQ + (step === 'feedback' ? 1 : 0)}
            total={domain.questions.length}
          />

          {step === 'feedback' && result ? (
            <FeedbackCard
              result={result}
              experts={domain.experts}
              isLast={isLast}
              onNext={handleNext}
            />
          ) : step === 'clarifying' && currentTurn?.clarifyingQuestion ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {question.domain}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold leading-snug text-stone-900">
                  {question.text}
                </h2>
                <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-600">
                  <span className="font-medium text-stone-500">
                    Your answer:{' '}
                  </span>
                  {currentTurn.answer}
                </div>
              </div>

              <ClarificationPanel
                question={currentTurn.clarifyingQuestion}
                value={clarificationResponse}
                onChange={setClarificationResponse}
                onSubmit={submitWithClarification}
                onSkip={skipClarification}
                isSubmitting={evaluating}
              />
            </div>
          ) : (
            <QuestionCard
              question={question}
              answer={answer}
              onAnswerChange={setAnswer}
              onSubmit={handleInitialSubmit}
              submitting={checking}
              disabled={evaluating}
              error={error}
            />
          )}
        </div>
      )}

      {evaluating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white px-8 py-6 shadow-lg">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            <p className="text-sm font-medium text-stone-600">
              Evaluating against the experts…
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
