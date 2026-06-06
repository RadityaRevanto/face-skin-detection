import type { PredictionHistory, ToneConfig } from "../_lib/history-types";
import { ShieldIcon } from "./icons";

type ConditionSummaryCardProps = {
  selectedHistory: PredictionHistory | null;
  selectedConfidence: number;
  tone: ToneConfig;
};

export function ConditionSummaryCard({
  selectedHistory,
  selectedConfidence,
  tone,
}: ConditionSummaryCardProps) {
  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <h2 className='text-lg font-bold text-slate-900'>
        Ringkasan Kondisi Kulit
      </h2>

      <div className='mt-6 flex items-center gap-7'>
        <div
          className='grid h-32 w-32 shrink-0 place-items-center rounded-full'
          style={{
            background: `conic-gradient(#10b981 0 ${
              selectedConfidence * 3.6
            }deg, #e2e8f0 ${selectedConfidence * 3.6}deg 360deg)`,
          }}
        >
          <div className='grid h-24 w-24 place-items-center rounded-full bg-white'>
            <span className='text-3xl font-bold text-slate-900'>
              {selectedConfidence}%
            </span>
          </div>
        </div>

        <div>
          <h3 className={`text-2xl font-bold ${tone.title}`}>
            {selectedHistory?.predicted_class ?? "Belum Ada Data"}
          </h3>

          <p className='mt-2 text-sm leading-6 text-slate-500'>
            {selectedHistory
              ? tone.description
              : "Belum ada riwayat pemeriksaan yang tersedia."}
          </p>

          <span className='mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700'>
            <ShieldIcon />
            Confidence Score
          </span>
        </div>
      </div>
    </section>
  );
}
