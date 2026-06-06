import type { CSSProperties } from "react";

import type { PredictionHistory, ToneConfig } from "../_lib/home-types";
import { ArrowRightIcon } from "./icons";

type HealthScoreCardProps = {
  latestPrediction: PredictionHistory | null;
  selectedConfidence: number;
  tone: ToneConfig;
};

export function HealthScoreCard({
  latestPrediction,
  selectedConfidence,
  tone,
}: HealthScoreCardProps) {
  const scoreStyle = {
    "--score-color": "#10b981",
    "--score-angle": `${selectedConfidence * 3.6}deg`,
  } as CSSProperties;

  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='font-bold text-slate-900'>Skor Kesehatan Kulit</h2>
        <a
          href='/user/history'
          className='inline-flex items-center gap-1 text-xs font-bold text-emerald-600'
        >
          Lihat Detail <ArrowRightIcon />
        </a>
      </div>

      <div className='flex items-center gap-6'>
        <div
          className='grid h-28 w-28 shrink-0 place-items-center rounded-full'
          style={{
            background:
              "conic-gradient(var(--score-color) var(--score-angle), #facc15 0 340deg, #e2e8f0 0)",
            ...scoreStyle,
          }}
        >
          <div className='grid h-20 w-20 place-items-center rounded-full bg-white'>
            <span className='text-2xl font-black text-slate-900'>
              {selectedConfidence}%
            </span>
          </div>
        </div>

        <div>
          <h3 className={`text-xl font-bold ${tone.title}`}>
            {latestPrediction?.predicted_class ?? "Belum Ada Data"}
          </h3>
          <p className='mt-2 text-sm leading-6 text-slate-500'>
            {latestPrediction
              ? tone.description
              : "Belum ada data pemeriksaan. Mulai pemeriksaan pertama Anda."}
          </p>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${tone.badge}`}
          >
            {tone.label}
          </span>
        </div>
      </div>
    </section>
  );
}
