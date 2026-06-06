import type { Recommendation } from "../_lib/home-types";
import { CalendarIcon } from "./icons";

type RecommendationCardProps = {
  recommendations: Recommendation[];
};

export function RecommendationCard({
  recommendations,
}: RecommendationCardProps) {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <h2 className='font-bold text-slate-900'>Rekomendasi Perawatan</h2>
      <div className='mt-5 space-y-4'>
        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <div key={item.id} className='flex items-start gap-3'>
              <div className='mt-0.5 text-emerald-600'>
                <CalendarIcon />
              </div>
              <p className='text-sm font-semibold leading-6 text-slate-600'>
                {item.recommendation_text}
              </p>
            </div>
          ))
        ) : (
          <p className='text-sm font-semibold leading-6 text-slate-500'>
            Belum ada rekomendasi perawatan untuk hasil terbaru Anda.
          </p>
        )}
      </div>

      <a
        href='/user/tips'
        className='mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100'
      >
        Lihat Semua Tips
      </a>
    </section>
  );
}
