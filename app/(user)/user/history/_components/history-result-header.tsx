import type { PredictionHistory, ToneConfig } from "../_lib/history-types";
import { DocumentIcon } from "./icons";

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
    <div className='flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-start md:justify-between'>
      <div>
        <p className='text-sm font-semibold text-slate-500'>{selectedDate}</p>

        <div className='mt-2 flex flex-wrap items-center gap-3'>
          <h2 className='text-3xl font-bold tracking-tight text-slate-900'>
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

      <button className='inline-flex h-12 w-fit items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition-colors hover:bg-emerald-50'>
        <DocumentIcon />
        Unduh Laporan
      </button>
    </div>
  );
}
