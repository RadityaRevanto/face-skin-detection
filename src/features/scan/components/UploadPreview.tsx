"use client";

import { UploadIcon, RefreshIcon } from "./Icons";

type Phase = "idle" | "preview" | "analyzing" | "done" | "error";

type Props = {
  phase: Phase;
  previewUrl: string | null;
  fileName: string;
  errorMsg: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPickImage: () => void;
};

export function UploadPreview({ phase, previewUrl, fileName, errorMsg, inputRef, onPickImage }: Props) {
  if (previewUrl) {
    return (
      <div className='grid gap-4 p-4 sm:grid-cols-[220px_1fr] sm:items-center'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt='Preview gambar upload'
          className='h-44 w-full rounded-2xl object-cover sm:h-36'
        />

        <div>
          <p className='text-sm font-bold text-slate-900'>{fileName}</p>
          <p className='mt-2 text-sm font-semibold text-slate-500'>
            {phase === "analyzing" && "Menganalisis gambar dengan ML service..."}
            {phase === "done" && "Analisis selesai. Hasil tersimpan ke riwayat dan tampil di kartu sebelah kanan."}
            {phase === "error" && errorMsg}
            {phase === "preview" && "Gambar siap dianalisis."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      type='button'
      onClick={onPickImage}
      disabled={phase === "analyzing"}
      className='flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center transition-colors hover:bg-white/50 disabled:cursor-wait'
    >
      <span className='grid h-14 w-14 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100'>
        <UploadIcon className='h-7 w-7' />
      </span>
      <span className='text-sm font-bold text-slate-900'>
        Klik untuk upload gambar wajah
      </span>
      <span className='text-xs font-semibold text-slate-500'>
        JPG, JPEG, atau PNG maksimal 5MB
      </span>
      {phase === "error" && (
        <span className='text-xs font-bold text-rose-600'>{errorMsg}</span>
      )}
    </button>
  );
}
