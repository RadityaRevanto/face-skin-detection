import type { SkinRecommendation } from "../_lib/history-types";
import { BulbIcon, CalendarIcon } from "./icons";

type RecommendationCardProps = {
  recommendations: SkinRecommendation[];
};

function getProduct(item: SkinRecommendation) {
  const product = item.skincare_products;

  if (Array.isArray(product)) {
    return product[0] ?? null;
  }

  return product;
}

export function RecommendationCard({
  recommendations,
}: RecommendationCardProps) {
  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-5 flex items-center gap-3'>
        <div className='text-amber-500'>
          <BulbIcon />
        </div>

        <h2 className='text-lg font-bold text-slate-900'>
          Rekomendasi Perawatan
        </h2>
      </div>

      <div className='space-y-4'>
        {recommendations.length > 0 ? (
          recommendations.map((item, index) => {
            const product = getProduct(item);

            return (
              <article
                key={item.id}
                className='overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/80 via-white to-white shadow-sm'
              >
                <div className='flex items-start gap-4 p-4'>
                  <div className='grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100'>
                    <CalendarIcon />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <p className='text-xs font-bold uppercase tracking-[0.18em] text-emerald-600'>
                          Rekomendasi #{index + 1}
                        </p>
                        <h3 className='mt-1 text-sm font-bold leading-5 text-slate-900'>
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                          item.priority_level === "high"
                            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                            : item.priority_level === "medium"
                              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        }`}
                      >
                        {item.priority_level === "high"
                          ? "Prioritas Tinggi"
                          : item.priority_level === "medium"
                            ? "Prioritas Sedang"
                            : "Prioritas Ringan"}
                      </span>
                    </div>

                    <p className='mt-3 text-sm font-semibold leading-6 text-slate-500'>
                      {item.recommendation_text}
                    </p>
                  </div>
                </div>

                {product ? (
                  <div className='border-t border-emerald-100 bg-white/75 p-4'>
                    <div className='rounded-2xl bg-white p-4 ring-1 ring-slate-100'>
                      <p className='text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>
                        Produk Skincare
                      </p>
                      <div className='mt-2 flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <h4 className='text-sm font-black text-slate-900'>
                            {product.name}
                          </h4>
                          <p className='mt-1 text-xs font-semibold text-emerald-700'>
                            {product.category}
                          </p>
                        </div>
                      </div>

                      {product.key_ingredients ? (
                        <p className='mt-3 text-xs font-semibold leading-5 text-slate-500'>
                          <span className='text-slate-700'>Ingredients:</span>{" "}
                          {product.key_ingredients}
                        </p>
                      ) : null}

                      {product.usage_instruction ? (
                        <p className='mt-2 text-xs font-semibold leading-5 text-slate-500'>
                          <span className='text-slate-700'>Cara pakai:</span>{" "}
                          {product.usage_instruction}
                        </p>
                      ) : null}

                      {product.warning ? (
                        <p className='mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-700'>
                          {product.warning}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })
        ) : (
          <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center'>
            <p className='text-sm font-semibold leading-6 text-slate-500'>
              Belum ada rekomendasi perawatan untuk hasil ini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
