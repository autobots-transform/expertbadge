import { BadgeTier, BadgeResult, DomainRating } from './types';

interface ScoreTotals {
  accuracy: number;
  nuance: number;
  vocab: number;
}

interface DomainRatingEntry {
  domain: string;
  rating: DomainRating;
}

export function computeBadge(
  totals: ScoreTotals,
  questionCount: number,
  domainRatings: DomainRatingEntry[],
  domainSlug: string
): BadgeResult {
  const avgAccuracy = Math.round(totals.accuracy / questionCount);
  const avgNuance = Math.round(totals.nuance / questionCount);
  const avgVocab = Math.round(totals.vocab / questionCount);
  const overallScore = Math.round((avgAccuracy + avgNuance + avgVocab) / 3);

  const tier = scoreTier(overallScore);

  return {
    tier,
    overallScore,
    avgAccuracy,
    avgNuance,
    avgVocab,
    domainRatings,
    assessedAt: new Date().toISOString(),
    domain: domainSlug,
  };
}

function scoreTier(overall: number): BadgeTier {
  if (overall >= 80) return 'expert';
  if (overall >= 62) return 'proficient';
  if (overall >= 42) return 'practicing';
  return 'aspiring';
}

export const TIER_META: Record<
  BadgeTier,
  {
    label: string;
    subtitle: string;
    color: string;
    bgColor: string;
    icon: string;
  }
> = {
  expert: {
    label: 'Expert',
    subtitle:
      'Your answers consistently aligned with documented expert frameworks across all scoring dimensions.',
    color: 'text-emerald-800',
    bgColor: 'bg-emerald-100',
    icon: '🏆',
  },
  proficient: {
    label: 'Proficient',
    subtitle:
      'Strong foundations with some nuance gaps. Operating at a practiced level with clear areas to deepen.',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    icon: '🎓',
  },
  practicing: {
    label: 'Practicing',
    subtitle:
      'Core concepts are present but expert frameworks reveal meaningful depth gaps. The coaching notes are your roadmap.',
    color: 'text-purple-800',
    bgColor: 'bg-purple-100',
    icon: '📚',
  },
  aspiring: {
    label: 'Aspiring',
    subtitle:
      'Early-stage understanding. The gaps identified are clear, actionable learning targets.',
    color: 'text-stone-700',
    bgColor: 'bg-stone-100',
    icon: '🌱',
  },
};
