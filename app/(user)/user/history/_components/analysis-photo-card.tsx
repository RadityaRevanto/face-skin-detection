import type { PredictionHistory, ProblemDetail } from "../_lib/history-types";
import { ShieldIcon } from "./icons";

type AnalysisPhotoCardProps = {
  selectedHistory: PredictionHistory | null;
  problemDetails: ProblemDetail[];
};

export function AnalysisPhotoCard({
  selectedHistory,
  problemDetails,
}: AnalysisPhotoCardProps) {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <h2 className='text-lg font-bold text-slate-900'>Foto Analisis</h2>

      <p className='mt-1 text-sm font-medium text-slate-500'>
        Hasil deteksi menggunakan teknologi YOLO
      </p>

      <div className='relative mt-5 min-h-[420px] overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50'>
        <div className='absolute bottom-0 left-1/2 h-[410px] w-[330px] -translate-x-1/2'>
          <div className='absolute left-1/2 top-5 h-36 w-52 -translate-x-1/2 rounded-t-full bg-slate-950' />
          <div className='absolute left-1/2 top-[70px] h-[210px] w-[180px] -translate-x-1/2 rounded-[46%] bg-[#efc09d]' />
          <div className='absolute left-[115px] top-[160px] h-2.5 w-2.5 rounded-full bg-slate-900' />
          <div className='absolute right-[115px] top-[160px] h-2.5 w-2.5 rounded-full bg-slate-900' />
          <div className='absolute left-1/2 top-[200px] h-2.5 w-10 -translate-x-1/2 rounded-full bg-rose-300' />
          <div className='absolute bottom-0 left-1/2 h-28 w-[310px] -translate-x-1/2 rounded-t-[100px] bg-white' />
        </div>

        {problemDetails.slice(0, 5).map((problem, index) => {
          const positions = [
            "left-[12%] top-[25%]",
            "left-[16%] top-[55%]",
            "right-[18%] top-[18%]",
            "right-[16%] top-[43%]",
            "right-[22%] top-[62%]",
          ];

          const colors = [
            "bg-yellow-50 text-yellow-700",
            "bg-yellow-50 text-yellow-700",
            "bg-emerald-50 text-emerald-700",
            "bg-red-50 text-red-700",
            "bg-emerald-50 text-emerald-700",
          ];

          return (
            <span
              key={`${problem.name}-${index}`}
              className={`absolute ${
                positions[index] ?? "left-[12%] top-[25%]"
              } rounded-lg px-3 py-2 text-xs font-bold shadow ${
                colors[index] ?? "bg-emerald-50 text-emerald-700"
              }`}
            >
              {problem.name}
              <br />
              {problem.value}%
            </span>
          );
        })}
      </div>

      <div className='mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <span className='grid h-10 w-10 place-items-center rounded-full bg-white text-emerald-600'>
            <ShieldIcon />
          </span>

          <div>
            <p className='text-sm font-bold text-slate-900'>
              Teknologi: {selectedHistory?.model_used ?? "Belum Ada"}
            </p>
            <p className='text-xs font-medium text-slate-500'>
              Analisis real-time dengan akurasi tinggi
            </p>
          </div>
        </div>

        <span className='w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700'>
          {selectedHistory ? "Analisis Berhasil" : "Belum Ada Analisis"}
        </span>
      </div>
    </section>
  );
}
