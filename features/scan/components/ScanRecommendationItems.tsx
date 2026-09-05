import type {
  SkincareRecommendation,
  TreatmentRecommendation,
} from "@/features/scan/services/scanService";

/**
 * 🧴 Kartu produk skincare — bagian "Rekomendasi Skincare (Produk)" hasil scan.
 * Data embedded dari response scan (skincare_recommendations).
 */
export function SkincareProductCard({ product }: { product: SkincareRecommendation }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/80 via-white to-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-black leading-5 text-slate-900">
            {product.name}
          </h4>
          <p className="mt-1 text-xs font-semibold text-emerald-700">
            {[product.category, product.skin_type, product.gender]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>
      </div>

      {product.key_ingredients ? (
        <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
          <span className="text-slate-700">Ingredients:</span>{" "}
          {product.key_ingredients}
        </p>
      ) : null}

      {product.usage_instruction ? (
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
          <span className="text-slate-700">Cara pakai:</span>{" "}
          {product.usage_instruction}
        </p>
      ) : null}

      {product.warning ? (
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-700">
          ⚠ {product.warning}
        </p>
      ) : null}

      {product.doctor ? (
        <p className="mt-3 border-t border-emerald-100 pt-2 text-xs font-medium text-slate-500">
          — direkomendasikan {product.doctor}
        </p>
      ) : null}
    </article>
  );
}

/**
 * 💡 Item tips perawatan — bagian "Rekomendasi Perawatan (Tips)" hasil scan.
 * Backend sudah mengurutkan high → medium → low.
 */
const PRIORITY_STYLES: Record<TreatmentRecommendation["priority_level"], string> = {
  high: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  low: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
};

const PRIORITY_LABELS: Record<TreatmentRecommendation["priority_level"], string> = {
  high: "Prioritas Tinggi",
  medium: "Prioritas Sedang",
  low: "Prioritas Ringan",
};

export function TreatmentTipItem({ tip }: { tip: TreatmentRecommendation }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/80 via-white to-white shadow-sm">
      <div className="flex items-start gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold leading-5 text-slate-900">
              {tip.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${PRIORITY_STYLES[tip.priority_level] ?? PRIORITY_STYLES.low}`}
            >
              {PRIORITY_LABELS[tip.priority_level] ?? "Prioritas Ringan"}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            {tip.recommendation_text}
          </p>
        </div>
      </div>
    </article>
  );
}
