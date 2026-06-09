import type { SkinProblem } from "../_lib/pemeriksaan-types";

type ProblemDetectionCardProps = {
  skinProblems: SkinProblem[];
};

export function ProblemDetectionCard({
  skinProblems,
}: ProblemDetectionCardProps) {
  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <h2 className='text-lg font-bold text-slate-900'>
        Deteksi Masalah Kulit
      </h2>

      <div className='mt-6 space-y-5'>
        {skinProblems.length > 0 ? (
          skinProblems.map((problem) => (
            <div key={problem.name} className='flex items-center gap-3'>
              <span className={`h-2.5 w-2.5 rounded-full ${problem.color}`} />
              <span className='flex-1 text-sm font-semibold text-slate-500'>
                {problem.name}
              </span>
              <span className='text-sm font-bold text-slate-700'>
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
