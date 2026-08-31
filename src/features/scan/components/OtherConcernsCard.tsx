import type { OtherConcern } from "@/lib/api/scans-query";

type OtherConcernsCardProps = {
  concerns: OtherConcern[];
};

export function OtherConcernsCard({ concerns }: OtherConcernsCardProps) {
  if (concerns.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-base font-bold text-slate-900">Kondisi Lain yang Terdeteksi</h2>
      <div className="mt-4 space-y-3">
        {concerns.map((concern) => (
          <div key={concern.ml_label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-slate-900">{concern.name || concern.ml_label}</p>
              <span className="ml-3 shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                {Math.round(concern.confidence * 100)}%
              </span>
            </div>
            {concern.description && (
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{concern.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
