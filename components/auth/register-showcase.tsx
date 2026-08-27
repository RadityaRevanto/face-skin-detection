import { LeafLogo } from "./icons";

export function RegisterShowcase() {
  return (
    <section className='relative min-h-180 overflow-hidden rounded-4xl px-5 py-10 sm:px-8 lg:min-h-190'>
      <div className='absolute right-0 top-4 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl' />
      <div className='absolute bottom-10 left-8 h-40 w-40 rounded-full bg-teal-100/80 blur-3xl' />
      <div className='absolute right-4 top-4 h-24 w-24 rounded-full border border-emerald-200/40' />
      <div className='absolute right-14 top-14 h-40 w-40 rounded-full border border-emerald-200/30' />

      <div className='relative mx-auto w-full max-w-4xl'>
        <div className='mb-8 max-w-md'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 shadow-sm backdrop-blur'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
            Analisis Kulit Berbasis AI
          </div>
          <h2 className='text-4xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-5xl'>
            AI Canggih untuk{" "}
            <span className='text-emerald-700'>Kulit Lebih Sehat</span>
          </h2>
        </div>

        <div className='relative rounded-4xl border border-white/80 bg-white/65 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-6 lg:p-7'>
          <div className='relative min-h-82.5 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-teal-50'>
            <div className='absolute left-8 top-7 z-20 flex items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur'>
              <span className='h-2.5 w-2.5 rounded-full bg-emerald-500' />
              AI Memindai
            </div>

            <div className='absolute left-1/2 top-9 h-80 w-56 -translate-x-1/2 rounded-t-full bg-linear-to-b from-zinc-700 via-zinc-800 to-zinc-900 opacity-90' />
            <div className='absolute left-1/2 top-20 h-72 w-52 -translate-x-1/2 rounded-[46%] bg-linear-to-b from-orange-100 via-rose-100 to-amber-100 shadow-2xl shadow-emerald-950/10' />
            <div className='absolute left-1/2 top-20 h-36 w-52 -translate-x-1/2 rounded-t-full bg-linear-to-b from-zinc-800 to-zinc-700' />
            <div className='absolute left-[44%] top-40 h-2.5 w-5 rounded-full border-t-2 border-zinc-700' />
            <div className='absolute right-[44%] top-40 h-2.5 w-5 rounded-full border-t-2 border-zinc-700' />
            <div className='absolute left-1/2 top-52 h-9 w-5 -translate-x-1/2 rounded-full border border-orange-200' />
            <div className='absolute left-1/2 top-64 h-6 w-20 -translate-x-1/2 rounded-b-full border-b-2 border-rose-300' />
            <div className='absolute left-1/2 top-14 h-76 w-px -translate-x-1/2 bg-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.95)]' />
            <div className='absolute left-1/2 top-14 h-76 w-10 -translate-x-1/2 bg-emerald-300/15 blur-sm' />
            <div className='absolute inset-x-20 top-20 h-64 rounded-4xl border border-emerald-400/35' />
            <div className='absolute left-20 top-24 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-emerald-500/50' />
            <div className='absolute right-20 top-24 h-8 w-8 rounded-tr-xl border-r-2 border-t-2 border-emerald-500/50' />
            <div className='absolute bottom-14 left-20 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-emerald-500/50' />
            <div className='absolute bottom-14 right-20 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-emerald-500/50' />

            <div className='absolute right-6 top-16 z-20 w-36 rounded-2xl bg-white/88 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur'>
              <p className='text-[10px] font-semibold text-zinc-500'>
                Skor Kesehatan Kulit
              </p>
              <div className='mt-2 flex items-end gap-1'>
                <span className='text-3xl font-bold text-emerald-700'>
                  85
                </span>
                <span className='pb-1 text-[10px] text-zinc-500'>/100</span>
              </div>
              <p className='mt-1 text-[10px] font-semibold text-emerald-600'>
                Bagus
              </p>
              <div className='mt-3 h-1.5 rounded-full bg-emerald-100'>
                <div className='h-full w-[85%] rounded-full bg-emerald-500' />
              </div>
            </div>

            <div className='absolute right-6 top-52 z-20 w-36 rounded-2xl bg-white/88 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur'>
              <p className='text-[10px] font-semibold text-zinc-700'>
                Insight Utama
              </p>
              {[
                ["Jerawat", "Rendah", "bg-emerald-500"],
                ["Hidrasi", "Baik", "bg-emerald-500"],
                ["Sensitivitas", "Rendah", "bg-emerald-500"],
                ["Paparan UV", "Sedang", "bg-amber-400"],
              ].map(([label, value, color]) => (
                <div key={label} className='mt-2 flex items-center gap-2'>
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  <span className='text-[10px] text-zinc-600'>
                    {label}: {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='relative z-30 -mt-4 mx-5 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-xl shadow-emerald-950/10 backdrop-blur'>
            <div className='grid items-center gap-5 sm:grid-cols-[150px_minmax(0,1fr)_130px]'>
              <div>
                <p className='text-sm font-semibold text-zinc-800'>
                  Progres Kulit
                </p>
                <div className='mt-2 text-3xl font-bold text-emerald-600'>
                  +18%
                </div>
                <p className='mt-1 text-xs text-zinc-500'>
                  Peningkatan bulan ini
                </p>
              </div>

              <svg
                aria-hidden='true'
                className='h-24 w-full'
                viewBox='0 0 360 90'
                fill='none'
                preserveAspectRatio='none'
              >
                <path
                  d='M8 72C48 70 58 62 89 58s50 6 78-10 48-34 82-25 52 28 103-14'
                  stroke='#10B981'
                  strokeWidth='4'
                  strokeLinecap='round'
                />
                <path
                  d='M8 72C48 70 58 62 89 58s50 6 78-10 48-34 82-25 52 28 103-14v81H8V72Z'
                  fill='url(#progressGradient)'
                />
                <circle cx='352' cy='9' r='5' fill='#10B981' />
                <circle
                  cx='352'
                  cy='9'
                  r='9'
                  stroke='#10B981'
                  strokeOpacity='0.25'
                  strokeWidth='4'
                />
                <defs>
                  <linearGradient
                    id='progressGradient'
                    x1='180'
                    x2='180'
                    y1='9'
                    y2='90'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#10B981' stopOpacity='0.24' />
                    <stop offset='1' stopColor='#10B981' stopOpacity='0' />
                  </linearGradient>
                </defs>
              </svg>

              <div className='flex h-full min-h-32 flex-col justify-center rounded-2xl bg-zinc-50 p-4 text-center'>
                <p className='text-xs text-zinc-500'>Minggu Ini</p>
                <p className='mt-2 text-3xl font-bold text-emerald-700'>
                  85
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-7 grid gap-4 text-xs sm:grid-cols-3'>
          {[
            ["Analisis Kulit AI", "Detail & akurat"],
            ["Insight Personal", "Sesuai kulit Anda"],
            ["Pantau Progres", "Lihat perubahan nyata"],
          ].map(([title, desc]) => (
            <div key={title} className='flex items-center gap-3'>
              <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700'>
                <LeafLogo />
              </span>
              <span>
                <span className='block font-semibold text-emerald-800'>
                  {title}
                </span>
                <span className='text-zinc-500'>{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
