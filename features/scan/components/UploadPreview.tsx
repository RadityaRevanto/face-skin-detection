"use client";

import {
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  Loader2,
  ScanFace,
  Check,
} from "lucide-react";

import type { ReactNode } from "react";

type Phase = "idle" | "preview" | "analyzing" | "done" | "error";

type Props = {
  phase: Phase;
  previewUrl: string | null;
  fileName: string;
  errorMsg: string;
  onPickImage: () => void;
  onAnalyze: () => void;
  onReset: () => void;
};

function StatusBadge({ tone, icon, label }: { tone: "success" | "loading" | "error"; icon: ReactNode; label: string }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    loading: "bg-sky-50 text-sky-700 ring-sky-200",
    error: "bg-rose-50 text-rose-700 ring-rose-200",
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${styles}`}>
      {icon}
      {label}
    </span>
  );
}

export function UploadPreview({
  phase,
  previewUrl,
  fileName,
  errorMsg,
  onPickImage,
  onAnalyze,
  onReset,
}: Props) {
  // ===== Ada gambar terpilih: preview + aksi =====
  if (previewUrl) {
    const isAnalyzing = phase === "analyzing";
    const isDone = phase === "done";
    const isError = phase === "error";

    return (
      <div className='p-4 sm:p-5'>
        <div className='grid gap-5 sm:grid-cols-[220px_1fr] sm:items-start'>
          {/* Preview + overlay saat analyzing */}
          <div className='relative overflow-hidden rounded-2xl ring-1 ring-slate-200'>
            {/* eslint-disable-next-line @next/next/no-img-element -- preview blob/base64 lokal, next/image tidak cocok */}
            <img
              src={previewUrl}
              alt='Preview gambar yang dipilih'
              className={`h-44 w-full object-cover transition-all duration-300 sm:h-40 ${
                isAnalyzing ? "scale-[1.03] blur-[2px]" : ""
              }`}
            />

            {isAnalyzing ? (
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/45 backdrop-blur-[2px]'>
                <Loader2 className='h-8 w-8 animate-spin text-white' />
                <span className='text-xs font-bold text-white'>
                  Menganalisis gambar...
                </span>
              </div>
            ) : null}

            {isDone ? (
              <span className='absolute left-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white shadow-lg'>
                <CheckCircle2 className='h-5 w-5' />
              </span>
            ) : null}
          </div>

          {/* Info file + status + aksi */}
          <div className='flex min-w-0 flex-col'>
            <div className='flex flex-wrap items-center gap-2'>
              {isDone ? (
                <StatusBadge tone='success' icon={<CheckCircle2 className='h-3.5 w-3.5' />} label='Analisis selesai' />
              ) : null}
              {isAnalyzing ? (
                <StatusBadge tone='loading' icon={<Loader2 className='h-3.5 w-3.5 animate-spin' />} label='Memproses' />
              ) : null}
              {isError ? (
                <StatusBadge tone='error' icon={<AlertCircle className='h-3.5 w-3.5' />} label='Gagal' />
              ) : null}
              {phase === "preview" ? (
                <StatusBadge tone='loading' icon={<Check className='h-3.5 w-3.5' />} label='Siap dianalisis' />
              ) : null}
            </div>

            <p className='mt-2 truncate text-sm font-bold text-slate-900' title={fileName}>
              {fileName}
            </p>

            <p className='mt-1.5 text-sm leading-6 text-slate-500'>
              {phase === "preview" &&
                "Gambar sudah siap. Tekan tombol di bawah untuk mulai menganalisis kondisi kulit."}
              {isAnalyzing && "ML model sedang memeriksa kondisi kulit Anda. Ini biasanya hanya beberapa detik."}
              {isDone && "Hasil analisis tersimpan ke riwayat dan tampil di panel sebelah kanan."}
              {isError && (
                <span className='font-semibold text-rose-600'>{errorMsg || "Terjadi kesalahan saat menganalisis."}</span>
              )}
            </p>

            {/* Aksi */}
            <div className='mt-4 flex flex-wrap gap-2.5'>
              {phase === "preview" || isError ? (
                <button
                  type='button'
                  onClick={onAnalyze}
                  className='inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700'
                >
                  <ScanFace className='h-5 w-5' />
                  {isError ? "Coba Lagi" : "Analisis Sekarang"}
                </button>
              ) : null}

              {isDone ? (
                <button
                  type='button'
                  onClick={onReset}
                  className='inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700'
                >
                  <ScanFace className='h-5 w-5' />
                  Scan Ulang
                </button>
              ) : null}

              {phase === "preview" || isError ? (
                <button
                  type='button'
                  onClick={onPickImage}
                  className='inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50'
                >
                  <ImageIcon className='h-5 w-5' />
                  Ganti Gambar
                </button>
              ) : null}

              {isAnalyzing ? (
                <button
                  type='button'
                  disabled
                  className='inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-white'
                >
                  <Loader2 className='h-5 w-5 animate-spin' />
                  Menganalisis...
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Kosong: dropzone pilih gambar =====
  return (
    <button
      type='button'
      onClick={onPickImage}
      disabled={phase === "analyzing"}
      className='group flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center transition-colors hover:bg-white/60 disabled:cursor-wait'
    >
      <span className='grid h-16 w-16 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100 transition-shadow duration-300 group-hover:shadow-md'>
        {phase === "analyzing" ? (
          <Loader2 className='h-7 w-7 animate-spin' />
        ) : (
          <ScanFace className='h-8 w-8' />
        )}
      </span>
      <span className='text-sm font-bold text-slate-900'>
        Klik untuk pilih foto wajah
      </span>
      <span className='text-xs font-semibold text-slate-500'>
        JPG, JPEG, atau PNG maksimal 5MB — gambar tidak otomatis terkirim
      </span>
      {phase === "error" && (
        <span className='inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 ring-1 ring-rose-200'>
          <AlertCircle className='h-3.5 w-3.5' />
          {errorMsg}
        </span>
      )}
    </button>
  );
}
