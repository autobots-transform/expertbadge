import { Expert, ExpertView } from '@/lib/types';

interface ExpertPanelProps {
  views: ExpertView[];
  experts: Expert[];
}

const DEMONSTRATED_META = {
  yes: { label: '✓ Demonstrated', className: 'bg-emerald-100 text-emerald-700' },
  partial: { label: '~ Partially demonstrated', className: 'bg-amber-100 text-amber-700' },
  no: { label: 'Not yet demonstrated', className: 'bg-red-50 text-red-600' },
};

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
          const demonstrated = DEMONSTRATED_META[view.demonstrated] ?? DEMONSTRATED_META.no;

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
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-stone-900">
                      {view.expert}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${demonstrated.className}`}
                    >
                      {demonstrated.label}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm italic leading-relaxed text-stone-500">
                    {view.principle}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    Source: {view.source}
                  </p>

                  <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">
                      What you showed
                    </p>
                    <p className="text-sm leading-relaxed text-stone-700">
                      {view.what_you_showed}
                    </p>
                  </div>

                  {view.what_to_deepen && (
                    <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">
                        To deepen
                      </p>
                      <p className="text-sm leading-relaxed text-stone-700">
                        {view.what_to_deepen}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
