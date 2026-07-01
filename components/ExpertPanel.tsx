import { Expert, ExpertView } from '@/lib/types';

interface ExpertPanelProps {
  views: ExpertView[];
  experts: Expert[];
}

export default function ExpertPanel({ views, experts }: ExpertPanelProps) {
  const lookup = new Map(experts.map((e) => [e.key, e]));

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        How the experts would frame this
      </h3>

      <div className="grid gap-4">
        {views.map((view, i) => {
          const expert = lookup.get(view.key);
          const avatarColor = expert?.avatarColor ?? 'bg-stone-100';
          const textColor = expert?.textColor ?? 'text-stone-700';

          return (
            <div
              key={`${view.key}-${i}`}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColor} ${textColor}`}
                >
                  {view.key}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900">
                    {view.expert}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    {view.position}
                  </p>
                  <div className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-sm leading-relaxed text-stone-700">
                    <span className="font-medium text-stone-500">
                      On your answer:{' '}
                    </span>
                    {view.gap}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
