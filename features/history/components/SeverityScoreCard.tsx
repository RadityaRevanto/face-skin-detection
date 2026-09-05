import type { PredictionHistory } from "../types";

type SeverityScoreCardProps = {
  severityScore: number;
  severityLevel: PredictionHistory["severity_level"];
};

export function SeverityScoreCard({ severityScore, severityLevel }: SeverityScoreCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h3 className="text-sm font-bold text-slate-900">Severity Score</h3>
      <div className="mt-3 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${
              severityLevel === "high" ? "bg-rose-500" : severityLevel === "medium" ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(severityScore, 100)}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-700">{severityScore}/100</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {severityLevel === "high" ? "Perlu perhatian lebih" : severityLevel === "medium" ? "Cukup baik, perlu perawatan rutin" : "Kondisi relatif baik"}
      </p>
    </div>
  );
}
