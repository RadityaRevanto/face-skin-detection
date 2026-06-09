import type { ProblemDetail } from "../_lib/history-types";

type ProblemDetailsCardProps = {
  problemDetails: ProblemDetail[];
};

export function ProblemDetailsCard({
  problemDetails,
}: ProblemDetailsCardProps) {
  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <h2 className='text-lg font-bold text-slate-900'>
        Detail Deteksi Masalah
      </h2>

      <div className='mt-6 space-y-4'>
        {problemDetails.length > 0 ? (
          problemDetails.map((problem) => (
            <div
              key={problem.name}
              className='grid grid-cols-[130px_1fr_36px] items-center gap-3'
            >
              <span className='flex items-center gap-2 text-sm font-semibold text-slate-500'>
                <span className={`h-2.5 w-2.5 rounded-full ${problem.color}`} />
                {problem.name}
              </span>

              <div className='h-2 rounded-full bg-slate-100'>
                <div
                  className={`h-full rounded-full ${problem.color}`}
                  style={{ width: `${Math.min(problem.value, 100)}%` }}
                />
              </div>

              <span className='text-right text-sm font-bold text-slate-700'>
                {problem.value}%
              </span>
            </div>
          ))
        ) : (
          <p className='text-sm font-semibold leading-6 text-slate-500'>
            Belum ada detail probabilitas yang tersedia.
          </p>
        )}
      </div>
    </section>
  );
}
