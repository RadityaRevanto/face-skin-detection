import type { PredictionHistory } from "../_lib/home-types";
import {
  formatDate,
  getConfidencePercent,
  getToneBySeverity,
} from "../_lib/home-utils";
import { ArrowRightIcon } from "./icons";

type RecentHistoryCardProps = {
  histories: PredictionHistory[];
};

export function RecentHistoryCard({ histories }: RecentHistoryCardProps) {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='font-bold text-slate-900'>Riwayat Terakhir</h2>
        <a
          href='/user/history'
          className='inline-flex items-center gap-1 text-xs font-bold text-emerald-600'
        >
          Lihat Semua <ArrowRightIcon />
        </a>
      </div>

      <div className='space-y-3'>
        {histories.length > 0 ? (
          histories.slice(0, 3).map((history) => {
            const tone = getToneBySeverity(
              history.severity_level,
              history.severity_score,
            );

            return (
              <a
                key={history.id}
                href={`/user/history?id=${history.id}`}
                className='flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-emerald-50'
              >
                <div className='grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-amber-200 to-emerald-100 text-slate-700'>
                  <span className='h-7 w-7 rounded-full bg-amber-100' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-xs font-semibold text-slate-500'>
                    {formatDate(history.created_at)}
                  </p>
                  <p className='text-sm font-bold text-slate-800'>
                    {history.predicted_class}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${tone.badge}`}
                >
                  {getConfidencePercent(history.confidence)}%
                </span>
                <ArrowRightIcon />
              </a>
            );
          })
        ) : (
          <p className='rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500'>
            Belum ada riwayat pemeriksaan.
          </p>
        )}
      </div>

      <a
        href='/user/history'
        className='mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100'
      >
        Lihat Semua Riwayat
      </a>
    </section>
  );
}
