import type { PredictionHistory, ToneConfig } from "../types";
import { getConcernDisplayName } from "@/lib/utils/skin-labels";
import { ShieldIcon } from "./Icons";

type SkinStatusCardProps = {
  latestPrediction: PredictionHistory | null;
  confidencePercent: number;
  tone: ToneConfig;
  isLiveResult?: boolean;
};

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function SkinStatusCard({
  latestPrediction,
  confidencePercent,
  tone,
  isLiveResult = false,
}: SkinStatusCardProps) {
  const hasData = Boolean(latestPrediction);
  const topPrediction = latestPrediction?.probabilities
    ? Object.entries(latestPrediction.probabilities).sort(([, a], [, b]) => b - a)[0]
    : null;
  // Tampilkan nama berbahasa Indonesia: utamakan skin_concern.name dari backend,
  // fallback ke penerjemahan label mentah model (mis. "Redness" → "Kemerahan").
  const topPredictionLabel = latestPrediction
    ? getConcernDisplayName(
        latestPrediction.skin_concern?.name,
        topPrediction?.[0] ?? latestPrediction.predicted_class,
      )
    : "Belum Ada Data";

  // Ring progress — offset mengikuti confidence (0–100).
  const ringOffset = RING_CIRCUMFERENCE * (1 - Math.min(100, Math.max(0, confidencePercent)) / 100);

  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='flex items-center justify-between'>
        <h2 className='text-base font-bold text-slate-900'>Status Kulit</h2>
        <span className='flex items-center gap-1.5 text-xs font-semibold text-slate-500'>
          <span
            className={`h-2 w-2 rounded-full ${isLiveResult ? "bg-amber-500" : "bg-emerald-500"}`}
          />
          {isLiveResult ? "Hasil Scan" : "Data Terbaru"}
        </span>
      </div>

      {hasData ? (
        <>
          {/* Identitas kondisi — tersusun vertikal & center agar lega
              di kolom sidebar yang sempit (bukan berdampingan dengan ring). */}
          <div className='mt-5 flex flex-col items-center text-center'>
            <div className='relative grid h-32 w-32 place-items-center'>
              <svg viewBox='0 0 120 120' className='h-32 w-32 -rotate-90'>
                <circle
                  cx='60'
                  cy='60'
                  r={RING_RADIUS}
                  fill='none'
                  stroke='#e2e8f0'
                  strokeWidth='12'
                />
                <circle
                  cx='60'
                  cy='60'
                  r={RING_RADIUS}
                  fill='none'
                  stroke='#10b981'
                  strokeWidth='12'
                  strokeLinecap='round'
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  className='transition-[stroke-dashoffset] duration-700 ease-out'
                />
              </svg>
              <div className='absolute inset-0 grid place-items-center'>
                <div className='flex flex-col items-center'>
                  <span className='text-3xl font-black leading-none text-slate-900'>
                    {confidencePercent}%
                  </span>
                  <span className='mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                    Confidence
                  </span>
                </div>
              </div>
            </div>

            <h3 className={`mt-4 text-2xl font-black ${tone.titleClassName}`}>
              {topPredictionLabel}
            </h3>

            <span
              className={`mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${tone.badgeClassName}`}
            >
              <ShieldIcon />
              {tone.label}
            </span>
          </div>

          {/* Deskripsi kondisi — blok full-width terpisah, tidak tergencet. */}
          {latestPrediction?.skin_concern?.description ? (
            <div className='mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100'>
              <p className='text-[11px] font-bold uppercase tracking-wider text-slate-400'>
                Tentang Kondisi Ini
              </p>
              <p className='mt-1.5 text-sm leading-6 text-slate-600'>
                {latestPrediction.skin_concern.description}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <div className='mt-5 flex flex-col items-center gap-3 text-center'>
          <div className='grid h-28 w-28 place-items-center rounded-full bg-slate-100'>
            <span className='text-3xl font-black text-slate-300'>—</span>
          </div>
          <h3 className='text-xl font-black text-slate-400'>Belum Ada Data</h3>
          <p className='text-sm leading-6 text-slate-500'>
            Belum ada hasil pemeriksaan. Ambil foto atau unggah gambar untuk
            memulai analisis.
          </p>
        </div>
      )}
    </section>
  );
}
