import type { PredictionHistory } from "../types";
import {
  formatDate,
  getConfidencePercent,
  getHistoryImageUrl,
  getToneBySeverity,
} from "../utils/historyHelpers";
import { getConcernDisplayName } from "@/lib/utils/skin-labels";

type ScanImageCardProps = {
  history: PredictionHistory;
};

export function ScanImageCard({ history }: ScanImageCardProps) {
  const confidencePercent = getConfidencePercent(history.confidence);
  const tone = getToneBySeverity(history.severity_level, history.severity_score);
  const imageUrl = getHistoryImageUrl(history);
  const label = getConcernDisplayName(history.skin_concern?.name, history.predicted_class);
  const date = formatDate(history.created_at);

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      {imageUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={`Foto pemeriksaan ${label}`} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center rounded-t-2xl bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
          <p className="text-sm font-semibold text-slate-400">Tidak ada foto</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {date}
        </span>
        <span className="flex items-center gap-1.5">
          {history.scan_mode === "livecam" ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="3" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
          {history.scan_mode === "livecam" ? "Live Camera" : "Upload Image"}
        </span>
        <span className="flex items-center gap-1.5">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {history.model_used ?? "ML Model"}
        </span>
      </div>

      <div className="border-t border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Status Kulit</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone.badge}`}>{tone.status}</span>
        </div>

        <div className="mt-4 flex items-center gap-5">
          <div
            className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
            style={{ background: `conic-gradient(#10b981 0 ${confidencePercent * 3.6}deg, #e2e8f0 ${confidencePercent * 3.6}deg 360deg)` }}
          >
            <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-white">
              <span className="text-xl font-black text-slate-900">{confidencePercent}%</span>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className={`text-lg font-bold ${tone.title}`}>{label}</h3>
            <p className="mt-1 text-sm text-slate-500">Confidence Score</p>
          </div>
        </div>

        {history.skin_concern?.description && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tentang Kondisi Ini</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{history.skin_concern.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
