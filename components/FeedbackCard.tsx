import { EvaluationResult, Expert, DomainRating } from '@/lib/types';
import ScoreBars from './ScoreBars';
import ExpertPanel from './ExpertPanel';

interface FeedbackCardProps {
  result: EvaluationResult;
  experts: Expert[];
  isLast: boolean;
  onNext: () => void;
}

const RATING_META: Record<
  DomainRating,
  { label: string; className: string }
> = {
  strong: {
    label: 'Strong',
    className: 'bg-emerald-100 text-emerald-800',
  },
  partial: {
    label: 'Partial',
    className: 'bg-amber-100 text-amber-800',
  },
  gap: {
    label: 'Gap identified',
    className: 'bg-red-100 text-red-800',
  },
};

export default function FeedbackCard({
  result,
  experts,
  isLast,
  onNext,
}: FeedbackCardProps) {
  const rating = RATING_META[result.domain_rating];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            Your evaluation
          </h2>
          {rating && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${rating.className}`}
            >
              {rating.label}
            </span>
          )}
        </div>

        <ScoreBars
          accuracy={result.scores.accuracy}
          nuance={result.scores.nuance}
          vocab={result.scores.vocab}
        />

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Coaching note
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
            {result.coaching}
          </p>
        </div>
      </div>

      <ExpertPanel views={result.expert_views} experts={experts} />

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          {isLast ? 'See my results →' : 'Next question →'}
        </button>
      </div>
    </div>
  );
}
