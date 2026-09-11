const steps = [
  { title: "Ambil Foto", description: "Foto wajah Anda" },
  { title: "Analisis YOLO", description: "Proses AI berjalan" },
  { title: "Hasil Analisis", description: "Lihat kondisi kulit" },
  { title: "Rekomendasi", description: "Dapatkan saran" },
];

/**
 * Stepper alur scan — desktop: lingkaran center dengan garis konektor menerus
 * di belakangnya; mobile: grid 2 kolom sederhana tanpa konektor.
 */
export function StepsCard() {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <ol className='grid gap-y-8 sm:grid-cols-2 md:grid-cols-4 md:gap-x-4'>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isFirst = index === 0;

          return (
            <li
              key={step.title}
              className='relative flex flex-col items-center text-center'
            >
              {/* Konektor — dari tepi lingkaran ini ke tepi lingkaran berikutnya.
                  Lingkaran h-14 (56px) → center di top-7 (28px).
                  Hanya tampil di layout 4 kolom (md+). */}
              {!isLast ? (
                <span
                  aria-hidden='true'
                  className='absolute left-[calc(50%+40px)] right-[calc(-50%+40px)] top-7 hidden h-0.5 rounded bg-slate-200 md:block'
                />
              ) : null}

              {/* Lingkaran nomor — ring putih agar "duduk" di atas konektor */}
              <span
                className={[
                  "relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full text-lg font-black ring-4 ring-white",
                  isFirst
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                {index + 1}
              </span>

              <div className='mt-3 max-w-40'>
                <p className='text-sm font-bold text-slate-900 sm:text-base'>
                  {step.title}
                </p>
                <p className='mt-0.5 text-xs font-medium leading-5 text-slate-500 sm:text-sm'>
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
