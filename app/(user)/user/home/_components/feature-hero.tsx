import { CameraIcon, ClockIcon, LockIcon, ShieldIcon } from "./icons";

const featureItems = [
  {
    title: "Deteksi real-time",
    description: "Analisis cepat dalam hitungan detik",
    icon: <ClockIcon />,
  },
  {
    title: "Akurat & terpercaya",
    description: "Teknologi YOLOv8 terkini",
    icon: <ShieldIcon />,
  },
  {
    title: "Privasi terjamin",
    description: "Foto tidak disimpan tanpa izin Anda",
    icon: <LockIcon />,
  },
];

export function FeatureHero() {
  return (
    <section className='overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50 shadow-sm ring-1 ring-slate-100'>
      <div className='grid min-h-[340px] gap-6 p-7 md:grid-cols-[0.85fr_1.15fr]'>
        <div className='z-10 flex flex-col justify-center'>
          <h2 className='text-2xl font-bold tracking-tight text-slate-950'>
            Cek Kesehatan Kulit Sekarang
          </h2>
          <p className='mt-3 max-w-sm text-sm leading-6 text-slate-600'>
            Analisis kulit cepat dengan teknologi YOLO untuk hasil yang akurat.
          </p>

          <div className='mt-6 space-y-4'>
            {featureItems.map((item) => (
              <div key={item.title} className='flex items-start gap-3'>
                <div className='mt-0.5 text-slate-500'>{item.icon}</div>
                <div>
                  <p className='text-sm font-bold text-slate-800'>
                    {item.title}
                  </p>
                  <p className='text-xs font-medium text-slate-500'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a
            href='/user/pemeriksaan'
            className='mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700'
          >
            <CameraIcon className='h-5 w-5' />
            Mulai Pemeriksaan
          </a>
        </div>

        <div className='relative flex min-h-[280px] items-end justify-center'>
          <div className='absolute inset-x-8 top-10 h-40 rounded-[42px] border-4 border-white/90' />
          <div className='relative h-[270px] w-[230px] overflow-hidden rounded-t-[110px] bg-linear-to-b from-amber-100 to-amber-200 shadow-2xl shadow-emerald-100'>
            <div className='absolute left-1/2 top-14 h-28 w-24 -translate-x-1/2 rounded-[45%] bg-[#f2c7a7]' />
            <div className='absolute left-1/2 top-9 h-20 w-32 -translate-x-1/2 rounded-t-full bg-slate-950' />
            <div className='absolute left-[88px] top-[102px] h-2 w-2 rounded-full bg-slate-900' />
            <div className='absolute right-[88px] top-[102px] h-2 w-2 rounded-full bg-slate-900' />
            <div className='absolute left-1/2 top-[130px] h-1.5 w-10 -translate-x-1/2 rounded-full bg-rose-300' />
            <div className='absolute bottom-0 h-24 w-full rounded-t-[60px] bg-white' />
          </div>
          <button
            type='button'
            aria-label='Buka kamera pemeriksaan'
            className='absolute bottom-8 grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-200 ring-8 ring-white/90 transition-colors hover:bg-emerald-700'
          >
            <CameraIcon className='h-7 w-7' />
          </button>
        </div>
      </div>
    </section>
  );
}
