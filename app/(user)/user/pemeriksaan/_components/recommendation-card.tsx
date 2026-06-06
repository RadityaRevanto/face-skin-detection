import type { Recommendation } from "../_lib/pemeriksaan-types";
import { BulbIcon, CalendarIcon } from "./icons";

type RecommendationCardProps = {
  recommendations: Recommendation[];
};

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

      <div className='space-y-5'>
        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <div key={item.id} className='flex items-start gap-3'>
              <div className='mt-0.5 text-slate-400'>
                <CalendarIcon />
              </div>
              <p className='text-sm font-semibold leading-6 text-slate-500'>
                {item.recommendation_text}
              </p>
            </div>
          ))
        ) : (
          <p className='text-sm font-semibold leading-6 text-slate-500'>
            Belum ada rekomendasi perawatan. Lakukan pemeriksaan terlebih
            dahulu.
          </p>
        )}
      </div>
    </section>
  );
}
