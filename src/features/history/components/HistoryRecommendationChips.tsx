import type { PredictionHistory } from "../types";

type HistoryRecommendationChipsProps = {
  history: PredictionHistory;
};

/**
 * Ringkasan rekomendasi pada kartu riwayat: jumlah tips perawatan &
 * produk skincare yang embedded di response scan. Non-interactive —
 * kartu induk adalah Link ke halaman detail.
 */
export function HistoryRecommendationChips({
  history,
}: HistoryRecommendationChipsProps) {
  const tipsCount = history.treatment_recommendations?.length ?? 0;
  const productsCount = history.skincare_recommendations?.length ?? 0;

  if (tipsCount === 0 && productsCount === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {tipsCount > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">
          💡 {tipsCount} tips perawatan
        </span>
      )}
      {productsCount > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700 ring-1 ring-sky-100">
          🧴 {productsCount} produk skincare
        </span>
      )}
    </div>
  );
}
