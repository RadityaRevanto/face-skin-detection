import type { SkinProblem } from "../_lib/pemeriksaan-types";

type ProblemDetectionCardProps = {
  skinProblems: SkinProblem[];
  probabilities?: Record<string, number> | null;
};

export function ProblemDetectionCard({
  skinProblems,
  probabilities,
}: ProblemDetectionCardProps) {
  const probabilityEntries = probabilities
    ? Object.entries(probabilities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  return (
    <section className='rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100'>
      <h2 className='text-lg font-bold text-slate-900'>Deteksi Masalah Kulit</h2>

      <div className='mt-6 space-y-5'>
        {probabilityEntries.length > 0 ? (
          <>
            <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
              Probabilitas per Kondisi
            </p>
            <div className='space-y-3'>
              {probabilityEntries.map(([label, prob]) => (
                <div key={label} className='flex items-center gap-3'>
                  <span className='w-36 truncate text-xs font-semibold text-slate-500'>
                    {label}
                  </span>
                  <div className='h-2 flex-1 overflow-hidden rounded-full bg-slate-100'>
                    <div
                      className='h-2 rounded-full bg-emerald-500 transition-all duration-700'
                      style={{ width: `${Math.round(prob * 100)}%` }}
                    />
                  </div>
                  <span className='w-10 text-right text-xs font-bold text-slate-700'>
                    {Math.round(prob * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : skinProblems.length > 0 ? (
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
