'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BadgeResult, DomainRating } from '@/lib/types';
import { TIER_META } from '@/lib/scoring';
import BadgeDisplay from '@/components/BadgeDisplay';
import ScoreBars from '@/components/ScoreBars';

const RATING_META: Record<DomainRating, { label: string; className: string }> = {
  strong: { label: 'Strong', className: 'bg-emerald-100 text-emerald-800' },
  partial: { label: 'Partial', className: 'bg-amber-100 text-amber-800' },
  gap: { label: 'Gap identified', className: 'bg-red-100 text-red-800' },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function buildShareText(badge: BadgeResult): string {
  const meta = TIER_META[badge.tier];
  const lines = [
    `${meta.icon} ExpertBadge — Product Management: ${meta.label}`,
    `Overall score: ${badge.overallScore}/100`,
    `Accuracy ${badge.avgAccuracy} · Nuance ${badge.avgNuance} · Vocabulary ${badge.avgVocab}`,
    `Assessed ${formatDate(badge.assessedAt)} against documented expert frameworks (Cagan, Torres, Doshi).`,
    `A point-in-time snapshot, not a permanent credential.`,
  ];
  return lines.join('\n');
}

export default function ResultsPage() {
  const router = useRouter();
  const [badge, setBadge] = useState<BadgeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('badge_result');
    if (!raw) {
      router.replace('/');
      return;
    }
    try {
      setBadge(JSON.parse(raw) as BadgeResult);
    } catch {
      router.replace('/');
      return;
    }
    setLoading(false);
  }, [router]);

  async function handleShare() {
    if (!badge) return;
    try {
      await navigator.clipboard.writeText(buildShareText(badge));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (loading || !badge) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-stone-500">
        Loading your badge…
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href="/"
        className="text-sm font-medium text-stone-400 transition hover:text-stone-600"
      >
        ← ExpertBadge
      </Link>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <BadgeDisplay tier={badge.tier} overallScore={badge.overallScore} />
      </div>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Score breakdown
        </h2>
        <div className="mt-5">
          <ScoreBars
            accuracy={badge.avgAccuracy}
            nuance={badge.avgNuance}
            vocab={badge.avgVocab}
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Sub-domain breakdown
        </h2>
        <div className="mt-4 divide-y divide-stone-100">
          {badge.domainRatings.map((entry, i) => {
            const meta = RATING_META[entry.rating];
            return (
              <div
                key={`${entry.domain}-${i}`}
                className="flex items-center justify-between py-3"
              >
                <span className="text-sm font-medium text-stone-800">
                  {entry.domain}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}
                >
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-6 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-xs leading-relaxed text-stone-500">
        Assessed {formatDate(badge.assessedAt)} across{' '}
        {badge.domainRatings.length} domains. Benchmarks from Inspired &
        Empowered (Cagan/SVPG), Continuous Discovery Habits (Torres), and
        documented Doshi frameworks. This badge is a point-in-time snapshot, not
        a permanent credential.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/assess/product-management"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Retake assessment
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {copied ? 'Copied to clipboard ✓' : 'Share badge'}
        </button>
      </div>
    </main>
  );
}
