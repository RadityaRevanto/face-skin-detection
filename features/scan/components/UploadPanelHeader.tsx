"use client";

import { ShieldIcon } from "./Icons";

type Props = {
  /** Di-set saat ada gambar — menampilkan hint "tekan Analisis Sekarang". */
  hasPendingImage?: boolean;
};

export function UploadPanelHeader({ hasPendingImage = false }: Props) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-emerald-600'>
          Upload Gambar
        </p>
        <h2 className='mt-1 text-lg font-bold text-slate-900'>
          Analisis dari Foto Wajah
        </h2>
        <p className='mt-1 text-sm font-medium leading-6 text-slate-500'>
          {hasPendingImage
            ? "Periksa pratinjau, lalu tekan Analisis Sekarang untuk memulai."
            : "Pilih foto wajah JPG/PNG maksimal 5MB. Hasil tersimpan otomatis ke riwayat pemeriksaan."}
        </p>
      </div>

      <span className='inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500 ring-1 ring-slate-200'>
        <ShieldIcon />
        Foto hanya diproses saat Anda minta
      </span>
    </div>
  );
}
