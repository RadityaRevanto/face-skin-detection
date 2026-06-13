import type { PredictionHistory, ProblemDetail } from "../_lib/history-types";
import { getHistoryImageUrl } from "../_lib/history-utils";
import { ShieldIcon } from "./icons";

type AnalysisPhotoCardProps = {
  selectedHistory: PredictionHistory | null;
  problemDetails: ProblemDetail[];
};

export function AnalysisPhotoCard({
  selectedHistory,
  problemDetails,
}: AnalysisPhotoCardProps) {
  const imageUrl = getHistoryImageUrl(selectedHistory);

  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <h2 className='text-lg font-bold text-slate-900'>Foto Analisis</h2>

      <p className='mt-1 text-sm font-medium text-slate-500'>
        Foto hasil pemeriksaan dari bucket skin-images
      </p>

      <div className='relative mt-5 min-h-[420px] overflow-hidden rounded-3xl bg-slate-100'>
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`Foto pemeriksaan ${selectedHistory?.predicted_class ?? ""}`}
              className='absolute inset-0 h-full w-full object-cover'
            />

            {problemDetails.slice(0, 5).map((problem, index) => {
              const positions = [
                "left-[8%] top-[20%]",
                "left-[12%] top-[50%]",
                "right-[10%] top-[15%]",
                "right-[8%] top-[42%]",
                "right-[14%] top-[65%]",
              ];

              const colors = [
                "bg-yellow-50/95 text-yellow-700",
                "bg-yellow-50/95 text-yellow-700",
                "bg-emerald-50/95 text-emerald-700",
                "bg-red-50/95 text-red-700",
                "bg-emerald-50/95 text-emerald-700",
              ];

              return (
                <span
                  key={`${problem.name}-${index}`}
                  className={`absolute z-10 ${
                    positions[index] ?? "left-[8%] top-[20%]"
                  } rounded-lg px-3 py-2 text-xs font-bold shadow-md backdrop-blur-sm ${
                    colors[index] ?? "bg-emerald-50/95 text-emerald-700"
                  }`}
                >
                  {problem.name}
                  <br />
                  {problem.value}%
                </span>
              );
            })}
          </>
        ) : (
          <div className='flex h-full min-h-[420px] items-center justify-center bg-linear-to-br from-emerald-50 via-white to-cyan-50 px-6 text-center'>
            <p className='text-sm font-semibold text-slate-500'>
              Belum ada foto pemeriksaan untuk hasil ini.
            </p>
          </div>
        )}
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
              {selectedHistory?.scan_mode === "livecam_yolo"
                ? "Foto livecam dari skin-images"
                : "Foto upload dari skin-images"}
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
