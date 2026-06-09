import type { Problem } from "../_lib/home-types";
import { ArrowRightIcon } from "./icons";

type LatestProblemsCardProps = {
  problems: Problem[];
};

export function LatestProblemsCard({ problems }: LatestProblemsCardProps) {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='font-bold text-slate-900'>
          Deteksi Masalah Kulit Terbaru
        </h2>
        <a
          href='/user/history'
          className='inline-flex items-center gap-1 text-xs font-bold text-emerald-600'
        >
          Lihat Semua <ArrowRightIcon />
        </a>
      </div>

      <div className='space-y-3'>
        {problems.length > 0 ? (
          problems.map((problem) => (
            <div
              key={problem.name}
              className='grid grid-cols-[120px_1fr_36px] items-center gap-3 text-sm'
            >
              <div className='flex items-center gap-2 text-slate-600'>
                <span className={`h-2.5 w-2.5 rounded-full ${problem.color}`} />
                {problem.name}
              </div>
              <div className='h-2 rounded-full bg-slate-100'>
                <div
                  className={`h-full rounded-full ${problem.color}`}
                  style={{ width: `${Math.min(problem.value, 100)}%` }}
                />
              </div>
              <span className='text-right text-xs font-bold text-slate-600'>
                {problem.value}%
              </span>
            </div>
          ))
        ) : (
          <p className='text-sm font-semibold leading-6 text-slate-500'>
            Belum ada data deteksi masalah kulit.
          </p>
        )}
      </div>
    </section>
  );
}
