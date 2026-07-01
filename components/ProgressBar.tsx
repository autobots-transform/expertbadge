interface ProgressBarProps {
  current: number; // number of questions completed
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs font-medium text-stone-500">
        <span>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
