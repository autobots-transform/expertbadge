'use client';

interface ClarificationPanelProps {
  question: string; // the clarifying question from Claude
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const MIN_CHARS = 10;

export default function ClarificationPanel({
  question,
  value,
  onChange,
  onSubmit,
  onSkip,
  isSubmitting,
}: ClarificationPanelProps) {
  const canSubmit = value.trim().length >= MIN_CHARS && !isSubmitting;

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8 shadow-sm">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
        One follow-up
      </p>
      <p className="mb-4 text-sm sm:text-base font-medium leading-snug text-stone-800">
        {question}
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isSubmitting}
        rows={4}
        placeholder="Add your clarification here…"
        className="w-full min-h-[80px] resize-y rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-stone-50 disabled:text-stone-500"
      />

      <div className="mt-2 text-xs">
        <span
          className={
            value.trim().length < MIN_CHARS
              ? 'text-stone-400'
              : 'text-emerald-600'
          }
        >
          {value.trim().length < MIN_CHARS
            ? `At least ${MIN_CHARS} characters to submit (${value.trim().length}/${MIN_CHARS})`
            : `${value.trim().length} characters`}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSubmitting ? 'Evaluating against the experts…' : 'Submit clarification'}
        </button>
        <button
          onClick={onSkip}
          disabled={isSubmitting}
          className="text-sm text-stone-400 underline transition hover:text-stone-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Skip, score as-is
        </button>
      </div>
    </div>
  );
}
