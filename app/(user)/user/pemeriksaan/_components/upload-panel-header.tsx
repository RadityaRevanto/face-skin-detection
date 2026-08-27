"use client";

import { UploadIcon, RefreshIcon } from "./icons";

type Props = {
  phase: "idle" | "preview" | "analyzing" | "done" | "error";
  onPickImage: () => void;
  onReset: () => void;
};

export function UploadPanelHeader({ phase, onPickImage, onReset }: Props) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-emerald-600'>
          Upload Gambar
        </p>
        <h2 className='mt-1 text-lg font-bold text-slate-900'>
          Analisis dari File Foto
        </h2>
        <p className='mt-1 text-sm font-medium leading-6 text-slate-500'>
          Pilih foto JPG atau PNG maksimal 5MB. Hasil otomatis tersimpan ke
          riwayat pemeriksaan.
        </p>
      </div>

      <div className='flex gap-3'>
        <button
          type='button'
          onClick={onPickImage}
          className='inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:bg-emerald-400'
        >
          <UploadIcon />
          Pilih Gambar
        </button>

        {(phase === "preview" || phase === "done" || phase === "error") && (
          <button
            type='button'
            onClick={onReset}
            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50'
          >
            <RefreshIcon />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
