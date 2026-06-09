import type { PredictionHistory, TipItem } from "../lib/tips-types";
import { CalendarIcon, ShieldIcon } from "./icons";

type PersonalizedTipsCardProps = {
  latestPrediction: PredictionHistory | null;
  tips: TipItem[];
};

export function PersonalizedTipsCard({
  latestPrediction,
  tips,
}: PersonalizedTipsCardProps) {
  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-5 flex items-center gap-3'>
        <div className='grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600'>
          <ShieldIcon />
        </div>

        <div>
          <h2 className='text-lg font-bold text-slate-900'>
            Tips Personal untuk Anda
          </h2>
          <p className='mt-1 text-sm font-medium text-slate-500'>
            Berdasarkan hasil pemeriksaan terbaru.
          </p>
        </div>
      </div>

      {latestPrediction ? (
        <div className='mb-5 rounded-2xl bg-slate-50 p-4'>
          <p className='text-sm font-semibold text-slate-500'>Hasil terbaru</p>
          <p className='mt-1 text-xl font-bold text-slate-900'>
            {latestPrediction.predicted_class}
          </p>
        </div>
      ) : null}

      <div className='space-y-4'>
        {tips.length > 0 ? (
          tips.map((tip) => (
            <article key={tip.id} className='flex items-start gap-3'>
              <div className='mt-0.5 text-emerald-600'>
                <CalendarIcon />
              </div>

              <div>
                <h3 className='text-sm font-bold text-slate-800'>
                  {tip.title}
                </h3>
                <p className='mt-1 text-sm font-semibold leading-6 text-slate-500'>
                  {tip.recommendation_text}
                </p>
              </div>
            </article>
          ))
        ) : (
          <p className='rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500'>
            Belum ada tips personal. Lakukan pemeriksaan terlebih dahulu atau
            pastikan data rekomendasi sudah tersedia.
          </p>
        )}
      </div>
    </section>
  );
}
