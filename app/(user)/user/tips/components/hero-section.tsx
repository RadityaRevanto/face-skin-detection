import type { PredictionHistory } from "../lib/tips-types";
import { BulbIcon } from "./icons";

type HeroSectionProps = {
  latestPrediction: PredictionHistory | null;
};

export function HeroSection({ latestPrediction }: HeroSectionProps) {
  return (
    <section className='rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100'>
      <div className='flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-blue-500'>
            Tips Perawatan
          </p>

          <h1 className='mt-3 text-3xl font-bold tracking-tight text-slate-900'>
            Tips menjaga kesehatan kulit wajah
          </h1>

          <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600'>
            Temukan panduan perawatan kulit, kebiasaan harian, dan rekomendasi
            sederhana untuk membantu menjaga kulit tetap sehat.
          </p>
        </div>

        <div className='rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800 ring-1 ring-emerald-100'>
          <div className='flex items-center gap-3'>
            <div className='grid h-10 w-10 place-items-center rounded-full bg-white text-emerald-600'>
              <BulbIcon />
            </div>

            <div>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-emerald-600'>
                Kondisi terbaru
              </p>
              <p className='mt-1 text-sm font-bold text-emerald-900'>
                {latestPrediction?.predicted_class ?? "Belum ada pemeriksaan"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
