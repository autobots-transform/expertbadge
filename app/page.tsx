import Link from 'next/link';
import { listDomains } from '@/lib/domains';

const COMING_SOON = [
  { label: 'Engineering Leadership', icon: '🧭' },
  { label: 'Data Science', icon: '📊' },
  { label: 'Growth Marketing', icon: '📈' },
];

export default function Home() {
  const domains = listDomains();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          ExpertBadge
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
          Know your expertise. Earn it.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-stone-600">
          ExpertBadge assesses your professional judgment through adaptive
          questioning, then benchmarks every answer against documented expert
          frameworks. You walk away with an honest, tiered badge — and the
          specific gaps to close next.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-stone-200 bg-white px-5 py-4">
        <p className="text-sm leading-relaxed text-stone-600">
          <span className="font-semibold text-stone-800">
            No invented authorities.
          </span>{' '}
          Answers are scored only against named, published sources. When an
          answer is too vague to assess fairly, we ask for more — we never
          fabricate a score.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Choose a domain
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {domains.map((domain) => (
            <Link
              key={domain.slug}
              href={`/assess/${domain.slug}`}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🎯
                </div>
                <h3 className="text-lg font-semibold text-stone-900">
                  {domain.label}
                </h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
                {domain.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {domain.experts.map((e) => (
                    <span
                      key={e.key}
                      title={e.name}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold ${e.avatarColor} ${e.textColor}`}
                    >
                      {e.key}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-0.5">
                  Start assessment →
                </span>
              </div>
            </Link>
          ))}

          {COMING_SOON.map((c) => (
            <div
              key={c.label}
              className="flex flex-col rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-6 opacity-70"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-xl grayscale">
                  {c.icon}
                </div>
                <h3 className="text-lg font-semibold text-stone-500">
                  {c.label}
                </h3>
              </div>
              <p className="mt-3 flex-1 text-sm text-stone-400">
                Expert benchmarks in progress.
              </p>
              <span className="mt-5 inline-flex w-fit items-center rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-500">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-16 text-center text-xs text-stone-400">
        A point-in-time snapshot of professional judgment, not a permanent
        credential.
      </footer>
    </main>
  );
}
