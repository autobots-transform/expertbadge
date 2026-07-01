'use client';

import { useEffect, useState } from 'react';

interface ScoreBarsProps {
  accuracy: number;
  nuance: number;
  vocab: number;
  compact?: boolean;
}

const BARS = [
  {
    key: 'accuracy' as const,
    label: 'Accuracy',
    hint: 'Correct by documented expert standards',
    barColor: 'bg-blue-600',
    textColor: 'text-blue-700',
  },
  {
    key: 'nuance' as const,
    label: 'Nuance',
    hint: 'Tradeoffs, edge cases, failure modes',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-700',
  },
  {
    key: 'vocab' as const,
    label: 'Vocabulary',
    hint: 'Correct use of PM terminology',
    barColor: 'bg-purple-600',
    textColor: 'text-purple-700',
  },
];

export default function ScoreBars({
  accuracy,
  nuance,
  vocab,
  compact = false,
}: ScoreBarsProps) {
  const values = { accuracy, nuance, vocab };
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="space-y-4">
      {BARS.map((bar) => {
        const value = values[bar.key];
        return (
          <div key={bar.key}>
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-stone-800">
                  {bar.label}
                </span>
                {!compact && (
                  <span className="text-xs text-stone-400">{bar.hint}</span>
                )}
              </div>
              <span className={`text-sm font-bold ${bar.textColor}`}>
                {value}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${bar.barColor}`}
                style={{
                  width: animate ? `${value}%` : '0%',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
