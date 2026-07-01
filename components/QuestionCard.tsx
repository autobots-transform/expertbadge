'use client';

import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  disabled: boolean;
  error?: string | null;
}

const MIN_CHARS = 20;

export default function QuestionCard({
  question,
  answer,
  onAnswerChange,
  onSubmit,
  submitting,
  disabled,
  error,
}: QuestionCardProps) {
  const charCount = answer.trim().length;
  const canSubmit = charCount >= MIN_CHARS && !submitting && !disabled;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
        {question.domain}
      </div>

      <h2 className="text-lg sm:text-xl font-semibold leading-snug text-stone-900">
        {question.text}
      </h2>

      {question.context && (
        <p className="mt-3 rounded-lg bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-stone-600">
          {question.context}
        </p>
      )}

      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled || submitting}
        rows={7}
        placeholder="Think out loud. Walk through your reasoning, the tradeoffs you weigh, and the frameworks you lean on…"
        className="mt-5 w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-stone-50 disabled:text-stone-500"
      />

      <div className="mt-2 flex items-center justify-between text-xs">
        <span
          className={charCount < MIN_CHARS ? 'text-stone-400' : 'text-emerald-600'}
        >
          {charCount < MIN_CHARS
            ? `At least ${MIN_CHARS} characters to evaluate (${charCount}/${MIN_CHARS})`
            : `${charCount} characters`}
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {submitting && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {submitting ? 'Checking your answer…' : 'Evaluate answer'}
      </button>
    </div>
  );
}
