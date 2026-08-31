type ExaminationInfoCardProps = {
  selectedDate: string;
  scanMethod: string;
};

export function ExaminationInfoCard({
  selectedDate,
  scanMethod,
}: ExaminationInfoCardProps) {
  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <h2 className='text-lg font-bold text-slate-900'>
        Informasi Pemeriksaan
      </h2>

      <div className='mt-5 space-y-4 text-sm'>
        <div className='flex justify-between gap-6'>
          <span className='font-semibold text-slate-500'>Tanggal & Waktu</span>
          <span className='font-bold text-slate-800'>{selectedDate}</span>
        </div>

        <div className='flex justify-between gap-6'>
          <span className='font-semibold text-slate-500'>Jenis Analisis</span>
          <span className='font-bold text-slate-800'>Analisis Kulit Wajah</span>
        </div>

        <div className='flex justify-between gap-6'>
          <span className='font-semibold text-slate-500'>Metode</span>
          <span className='font-bold text-slate-800'>{scanMethod}</span>
        </div>
      </div>
    </section>
  );
}
