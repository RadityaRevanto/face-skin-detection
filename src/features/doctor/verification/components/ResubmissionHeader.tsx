type ResubmissionHeaderProps = {
  isResubmit: boolean;
};

export function ResubmissionHeader({ isResubmit }: ResubmissionHeaderProps) {
  return (
    <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h2 className='font-bold text-slate-900'>
          {isResubmit ? "Ajukan Revisi Ulang" : "Ajukan Verifikasi Ulang"}
        </h2>
        <p className='mt-1 text-sm leading-6 text-slate-500'>
          {isResubmit
            ? "Perbarui data/dokumen sesuai catatan admin, lalu kirim untuk ditinjau ulang."
            : "Lengkapi data dan unggah dokumen STR/identitas profesi (JPG, PNG, atau PDF maks 5MB per berkas)."}
        </p>
      </div>
      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
          isResubmit
            ? "bg-amber-50 text-amber-700"
            : "bg-rose-50 text-rose-700"
        }`}
      >
        {isResubmit ? "Needs Revision" : "Rejected"}
      </span>
    </div>
  );
}
