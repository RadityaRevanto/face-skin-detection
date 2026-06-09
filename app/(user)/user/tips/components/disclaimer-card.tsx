import { InfoIcon } from "./icons";

export function DisclaimerCard() {
  return (
    <section className='flex gap-3 rounded-3xl bg-emerald-50 p-5 text-emerald-900 ring-1 ring-emerald-100'>
      <div className='mt-0.5 text-emerald-600'>
        <InfoIcon />
      </div>

      <div>
        <h2 className='font-bold'>Catatan</h2>
        <p className='mt-1 text-sm leading-6 text-emerald-800'>
          Tips ini bersifat informatif dan tidak menggantikan diagnosis medis.
          Jika kondisi kulit terasa berat, nyeri, meradang, atau tidak membaik,
          konsultasikan langsung dengan dokter.
        </p>
      </div>
    </section>
  );
}
