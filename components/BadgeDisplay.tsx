import { BadgeTier } from '@/lib/types';
import { TIER_META } from '@/lib/scoring';

interface BadgeDisplayProps {
  tier: BadgeTier;
  overallScore: number;
}

export default function BadgeDisplay({ tier, overallScore }: BadgeDisplayProps) {
  const meta = TIER_META[tier];

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full text-5xl ${meta.bgColor}`}
      >
        <span aria-hidden>{meta.icon}</span>
      </div>

      <div
        className={`mt-5 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${meta.bgColor} ${meta.color}`}
      >
        {meta.label}
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-5xl font-bold text-stone-900">
          {overallScore}
        </span>
        <span className="text-lg font-medium text-stone-400">/100</span>
      </div>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">
        {meta.subtitle}
      </p>
    </div>
  );
}
