import type { PredictionHistory, SkinRecommendation } from "../_lib/history-types";
import {
  formatDate,
  getConfidencePercent,
  getToneBySeverity,
} from "../_lib/history-utils";
import { getConcernDisplayName } from "@/lib/utils/skin-labels";
import { getHistoryImageUrl } from "../_lib/history-utils";

type HistoryDetailProps = {
  selectedHistory: PredictionHistory | null;
  recommendations: SkinRecommendation[];
  mlLabel: string | null;
  hasMore: boolean;
};

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HistoryDetail({
  selectedHistory,
  recommendations,
  mlLabel,
  hasMore,
}: HistoryDetailProps) {
  if (!selectedHistory) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-lg font-bold text-slate-900">Belum Ada Riwayat</p>
        <p className="mt-1 text-sm text-slate-500">Lakukan pemeriksaan terlebih dahulu</p>
      </div>
    );
  }

  const confidencePercent = getConfidencePercent(selectedHistory.confidence);
  const tone = getToneBySeverity(
    selectedHistory.severity_level,
    selectedHistory.severity_score,
  );
  const imageUrl = getHistoryImageUrl(selectedHistory);
  const topLabel = getConcernDisplayName(
    selectedHistory.skin_concern?.name,
    selectedHistory.predicted_class,
  );

  const probabilityEntries = selectedHistory.probabilities
    ? Object.entries(selectedHistory.probabilities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-6">
      {/* Photo + Info */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`Foto pemeriksaan ${topLabel}`}
            className="h-64 w-full object-cover sm:h-80"
          />
        ) : (
          <div className="flex h-64 items-center justify-center bg-slate-100 sm:h-80">
            <p className="text-sm text-slate-500">Tidak ada foto</p>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{formatDate(selectedHistory.created_at)}</span>
            <span className="text-slate-300">|</span>
            <span>{selectedHistory.scan_mode === "livecam" ? "Kamera" : "Upload"}</span>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {selectedHistory.model_used ?? "ML Model"}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Status Kulit</h2>
          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${tone.badge}`}>
            {tone.status}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-5">
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full"
            style={{
              background: `conic-gradient(#10b981 0 ${confidencePercent * 3.6}deg, #e2e8f0 ${confidencePercent * 3.6}deg)`,
            }}
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white">
              <span className="text-lg font-black text-slate-900">{confidencePercent}%</span>
            </div>
          </div>
          <div>
            <h3 className={`text-lg font-bold ${tone.title}`}>{topLabel}</h3>
            <p className="mt-1 text-sm text-slate-500">Confidence {confidencePercent}%</p>
          </div>
        </div>

        {selectedHistory.skin_concern?.description && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tentang Kondisi Ini
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {selectedHistory.skin_concern.description}
            </p>
          </div>
        )}
      </div>

      {/* Probabilities */}
      {probabilityEntries.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Deteksi Masalah Kulit</h2>
          <div className="mt-4 space-y-3">
            {probabilityEntries.map(([label, prob]) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-28 truncate text-xs font-medium text-slate-500">
                  {label}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.round(prob * 100)}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold text-slate-700">
                  {Math.round(prob * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Rekomendasi Perawatan</h2>

        <div className="mt-4 space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((item, index) => {
              const product = item.product ?? null;

              return (
                <div
                  key={item.uuid}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
                        <CalendarIcon />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          Rekomendasi #{index + 1}
                        </p>
                        <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.priority_level === "high"
                          ? "bg-rose-50 text-rose-700"
                          : item.priority_level === "medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {item.priority_level === "high" ? "Tinggi" : item.priority_level === "medium" ? "Sedang" : "Ringan"}
                    </span>
                  </div>
                  <p className="mt-2.5 ml-12 text-sm text-slate-500">{item.recommendation_text}</p>
                  {product && (
                    <div className="mt-3 ml-12 rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Produk</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs font-medium text-emerald-600">{product.category}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
              <p className="text-sm text-slate-500">Belum ada rekomendasi</p>
            </div>
          )}
        </div>
        {hasMore && (
          <p className="mt-3 text-center text-xs text-slate-400">
            {mlLabel ? `Label ML: ${mlLabel}` : ""} — Masih ada rekomendasi lainnya
          </p>
        )}
      </div>
    </div>
  );
}
