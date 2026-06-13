import type { PredictionHistory, ToneConfig } from "../_lib/pemeriksaan-types";
import { ShieldIcon } from "./icons";

type SkinStatusCardProps = {
  latestPrediction: PredictionHistory | null;
  confidencePercent: number;
  tone: ToneConfig;
  isLiveResult?: boolean;
};

export function SkinStatusCard({
  latestPrediction,
  confidencePercent,
  tone,
  isLiveResult = false,
}: SkinStatusCardProps) {
  const angle = confidencePercent * 3.6;
  const hasData = Boolean(latestPrediction);
  const topPrediction = latestPrediction?.probabilities
    ? Object.entries(latestPrediction.probabilities).sort(([, a], [, b]) => b - a)[0]
    : null;
  const topPredictionLabel =
    topPrediction?.[0] ?? latestPrediction?.predicted_class ?? "Belum Ada Data";
  const topPredictionPercent = topPrediction
    ? Math.round(
        Number(topPrediction[1]) <= 1
          ? Number(topPrediction[1]) * 100
          : Number(topPrediction[1]),
      )
    : confidencePercent;

  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-7 flex items-center justify-between'>
        <h2 className='text-lg font-bold text-slate-900'>Status Kulit</h2>
        <span className='flex items-center gap-2 text-sm font-semibold text-slate-500'>
          <span
            className={`h-2.5 w-2.5 rounded-full ${isLiveResult ? "bg-amber-500" : "bg-emerald-500"}`}
          />
          {isLiveResult ? "Hasil Scan" : "Data Terbaru"}
        </span>
      </div>

      {hasData ? (
        <>
          <div className='mt-6 flex items-center gap-7'>
            <div
              className='grid h-28 w-28 shrink-0 place-items-center rounded-full'
              style={{
                background: `conic-gradient(#10b981 0 ${angle}deg,#facc15 ${angle}deg 340deg,#e2e8f0 340deg)`,
              }}
            >
              <div className='grid h-20 w-20 place-items-center rounded-full bg-white'>
                <span className='text-2xl font-black text-slate-900'>
                  {confidencePercent}%
                </span>
              </div>
            </div>

            <div>
              <h3 className={`text-xl font-black ${tone.titleClassName}`}>
                {topPredictionLabel}
              </h3>
              <p className='mt-2 text-sm leading-6 text-slate-500'>
                Hasil prediksi terbesar dari analisis AI adalah{" "}
                <span className='font-bold text-slate-700'>
                  {topPredictionLabel}
                </span>{" "}
                dengan confidence {topPredictionPercent}%.
              </p>
              <span
                className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${tone.badgeClassName}`}
              >
                <ShieldIcon />
                {tone.label}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center gap-7'>
          <div className='grid h-32 w-32 shrink-0 place-items-center rounded-full bg-slate-100'>
            <span className='text-3xl font-black text-slate-300'>—</span>
          </div>
          <div>
            <h3 className='text-2xl font-black text-slate-400'>Belum Ada Data</h3>
            <p className='mt-2 text-sm leading-6 text-slate-500'>
              Belum ada hasil pemeriksaan. Ambil foto untuk memulai analisis.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
