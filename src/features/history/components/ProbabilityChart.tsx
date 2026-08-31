import { translateSkinLabel } from "@/lib/utils/skin-labels";

type ProbabilityChartProps = {
  probabilities: Record<string, number>;
};

export function ProbabilityChart({ probabilities }: ProbabilityChartProps) {
  const entries = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a);

  if (entries.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-base font-bold text-slate-900">Probabilitas Deteksi</h2>
      <div className="mt-4 space-y-3">
        {entries.map(([label, prob]) => {
          const percent = Math.round(prob * 100);
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="w-36 truncate text-xs font-medium text-slate-500">{translateSkinLabel(label)}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-bold text-slate-700">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
