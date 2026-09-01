import type { SkincareRecommendation, TreatmentRecommendation } from "@/features/scan/services/scanService";

import { SkincareProductCard, TreatmentTipItem } from "./ScanRecommendationItems";

type ScanRecommendationsSectionProps = {
  treatmentRecommendations?: TreatmentRecommendation[] | null;
  skincareRecommendations?: SkincareRecommendation[] | null;
};

/**
 * Section hasil scan: 💡 Rekomendasi Perawatan (Tips) + 🧴 Rekomendasi
 * Skincare (Produk). Keduanya embedded di response scan backend — tidak
 * perlu fetch endpoint terpisah.
 */
export function ScanRecommendationsSection({
  treatmentRecommendations,
  skincareRecommendations,
}: ScanRecommendationsSectionProps) {
  const tips = treatmentRecommendations ?? [];
  const products = skincareRecommendations ?? [];

  if (tips.length === 0 && products.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Rekomendasi Untukmu</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
          Belum ada rekomendasi untuk kondisi kulit yang terdeteksi. Konsultasikan
          dengan dokter untuk saran perawatan yang tepat.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {tips.length > 0 ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-lg ring-1 ring-amber-100">
              💡
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekomendasi Perawatan
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Kebiasaan yang membantu kondisi kulitmu
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {tips.map((tip) => (
              <TreatmentTipItem key={tip.uuid} tip={tip} />
            ))}
          </div>
        </div>
      ) : null}

      {products.length > 0 ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-lg ring-1 ring-sky-100">
              🧴
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekomendasi Skincare
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Produk yang cocok untuk kondisi kulitmu
              </p>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {products.map((product) => (
              <SkincareProductCard key={product.uuid} product={product} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
