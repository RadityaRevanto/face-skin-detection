import { ShieldIcon } from "./icons";

export function TodayTipCard() {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <p className='text-sm font-bold text-slate-900'>Tips Hari Ini</p>
      <div className='mt-6 flex flex-col items-center text-center'>
        <div className='grid h-28 w-28 place-items-center rounded-full bg-emerald-50 text-emerald-600'>
          <ShieldIcon />
        </div>
        <h3 className='mt-5 text-base font-bold text-slate-900'>
          Lindungi kulit dari sinar UV
        </h3>
        <p className='mt-2 text-sm leading-6 text-slate-500'>
          Gunakan sunscreen minimal SPF 30 setiap pagi, bahkan saat cuaca
          mendung.
        </p>
        <div className='mt-6 flex gap-2'>
          <span className='h-2 w-5 rounded-full bg-emerald-500' />
          <span className='h-2 w-2 rounded-full bg-slate-200' />
          <span className='h-2 w-2 rounded-full bg-slate-200' />
          <span className='h-2 w-2 rounded-full bg-slate-200' />
        </div>
      </div>
    </section>
  );
}
