import { Fragment } from "react";

const steps = [
  ["Ambil Foto", "Foto wajah Anda"],
  ["Analisis YOLO", "Proses AI berjalan"],
  ["Hasil Analisis", "Lihat kondisi kulit"],
  ["Rekomendasi", "Dapatkan saran"],
];

export function StepsCard() {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8'>
        {steps.map(([title, description], index) => (
          <div key={title} className='relative flex items-center gap-4'>
            <span
              className={[
                "grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black z-10",
                index === 0
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500",
              ].join(" ")}
            >
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className='font-bold text-slate-900 leading-tight'>{title}</p>
              <p className='mt-1 text-sm font-medium text-slate-500 leading-tight'>
                {description}
              </p>
            </div>

            {/* Garis vertikal penyambung untuk layar HP (1 kolom) */}
            {index < steps.length - 1 ? (
              <div className='absolute left-[1.5rem] top-[3rem] h-[calc(100%+1.5rem)] w-px bg-slate-200 sm:hidden' style={{ zIndex: 0 }} />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
