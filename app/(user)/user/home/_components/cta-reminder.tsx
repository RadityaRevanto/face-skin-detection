import { CalendarIcon, CameraIcon } from "./icons";

export function CtaReminder() {
  return (
    <section className='mt-5 flex flex-col gap-4 rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-4'>
        <div className='grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm'>
          <CalendarIcon />
        </div>
        <div>
          <h2 className='font-bold text-slate-900'>
            Jangan lupa periksa kulit secara rutin!
          </h2>
          <p className='mt-1 text-sm text-slate-600'>
            Pemeriksaan rutin membantu mendeteksi masalah kulit lebih awal dan
            menjaga kulit tetap sehat.
          </p>
        </div>
      </div>
      <a
        href='/user/pemeriksaan'
        className='inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700'
      >
        <CameraIcon className='h-5 w-5' />
        Buat Pemeriksaan Baru
      </a>
    </section>
  );
}
