const steps = [
  ["Ambil Foto", "Foto wajah Anda"],
  ["Analisis YOLO", "Proses AI berjalan"],
  ["Hasil Analisis", "Lihat kondisi kulit"],
  ["Rekomendasi", "Dapatkan saran"],
];

export function StepsCard() {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4'>
        {steps.map(([title, description], index) => (
          <div key={title} className='relative flex items-center gap-4'>
            <span
              className={[
                "grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black",
                index === 0
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500",
              ].join(" ")}
            >
              {index + 1}
            </span>

            <div>
              <p className='font-bold text-slate-900'>{title}</p>
              <p className='mt-1 text-sm font-medium text-slate-500'>
                {description}
              </p>
            </div>

            {index < steps.length - 1 ? (
              <span className='absolute right-4 top-1/2 hidden h-px w-14 bg-slate-200 xl:block' />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
