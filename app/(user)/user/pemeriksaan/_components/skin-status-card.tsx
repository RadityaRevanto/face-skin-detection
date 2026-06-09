import type { PredictionHistory, ToneConfig } from "../_lib/pemeriksaan-types";
import { ShieldIcon } from "./icons";

type SkinStatusCardProps = {
  latestPrediction: PredictionHistory | null;
  confidencePercent: number;
  tone: ToneConfig;
};

export function SkinStatusCard({
  latestPrediction,
  confidencePercent,
  tone,
}: SkinStatusCardProps) {
  const angle = confidencePercent * 3.6;

  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-7 flex items-center justify-between'>
        <h2 className='text-lg font-bold text-slate-900'>Status Kulit</h2>
        <span className='flex items-center gap-2 text-sm font-semibold text-slate-500'>
          <span className='h-2.5 w-2.5 rounded-full bg-emerald-500' />
          Data Terbaru
        </span>
      </div>

      <div className='flex items-center gap-7'>
        <div
          className='grid h-32 w-32 shrink-0 place-items-center rounded-full'
          style={{
            background: `conic-gradient(#10b981 0 ${angle}deg,#facc15 ${angle}deg 340deg,#e2e8f0 340deg)`,
          }}
        >
          <div className='grid h-24 w-24 place-items-center rounded-full bg-white'>
            <span className='text-3xl font-black text-slate-900'>
              {confidencePercent}%
            </span>
          </div>
        </div>

        <div>
          <h3 className={`text-2xl font-black ${tone.titleClassName}`}>
            {latestPrediction?.predicted_class ?? "Belum Ada Data"}
          </h3>
          <p className='mt-2 text-sm leading-6 text-slate-500'>
            {latestPrediction
              ? tone.description
              : "Belum ada hasil pemeriksaan. Ambil foto untuk memulai analisis."}
          </p>
          <span
            className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${tone.badgeClassName}`}
          >
            <ShieldIcon />
            {tone.label}
          </span>
        </div>
      </div>
    </section>
  );
}
