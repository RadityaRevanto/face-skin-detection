import type { PredictionHistory, ToneConfig } from "../_lib/history-types";

type HistoryResultHeaderProps = {
  selectedHistory: PredictionHistory | null;
  selectedDate: string;
  tone: ToneConfig;
};

export function HistoryResultHeader({
  selectedHistory,
  selectedDate,
  tone,
}: HistoryResultHeaderProps) {
  return (
    <div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <p className='text-sm font-semibold text-slate-500'>{selectedDate}</p>

      <div className='mt-2 flex flex-wrap items-center gap-3'>
        <h2 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'>
          Hasil Pemeriksaan
        </h2>

        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${tone.badge}`}
        >
          {selectedHistory?.predicted_class ?? "Belum Ada Data"}
        </span>
      </div>

      <p className='mt-2 text-sm font-medium text-slate-500'>
        {selectedHistory
          ? tone.description
          : "Belum ada data pemeriksaan yang bisa ditampilkan."}
      </p>
    </div>
  );
}
