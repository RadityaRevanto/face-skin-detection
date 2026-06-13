"use client";

import { ChangeEvent, useRef, useState } from "react";

import type { LiveScanResult } from "../_lib/pemeriksaan-types";
import { RefreshIcon, UploadIcon } from "./icons";

type UploadPhase = "idle" | "preview" | "analyzing" | "done" | "error";

type UploadImagePanelProps = {
  onUploadComplete?: (result: LiveScanResult) => void;
  onReset?: () => void;
};

type UploadApiResponse = {
  success: boolean;
  data?: LiveScanResult;
  error?: string;
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Gagal membaca gambar."));
    };

    reader.onerror = () => reject(new Error("Gagal membaca gambar."));
    reader.readAsDataURL(file);
  });
}

export function UploadImagePanel({
  onUploadComplete,
  onReset,
}: UploadImagePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function analyzeFile(file: File, imagePreviewUrl: string) {
    const formData = new FormData();
    formData.append("image", file);

    setPhase("analyzing");
    setErrorMsg("");

    try {
      const res = await fetch("/api/predict/upload", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as UploadApiResponse;

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? "Gagal analisis gambar.");
      }

      const result: LiveScanResult = {
        ...json.data,
        scan_mode: "upload_image",
        image_url: json.data.image_url ?? imagePreviewUrl,
        cropped_image_url: null,
        recommendations: json.data.recommendations ?? [],
      };

      setPhase("done");
      onUploadComplete?.(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setErrorMsg(message);
      setPhase("error");
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setPhase("error");
      setErrorMsg("Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.");
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setPhase("error");
      setErrorMsg("Ukuran file melebihi 5MB.");
      return;
    }

    try {
      const imagePreviewUrl = await readFileAsDataUrl(file);
      setPreviewUrl(imagePreviewUrl);
      setFileName(file.name);
      setPhase("preview");
      await analyzeFile(file, imagePreviewUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membaca gambar.";
      setErrorMsg(message);
      setPhase("error");
    }
  }

  function resetUpload() {
    setPhase("idle");
    setPreviewUrl(null);
    setFileName("");
    setErrorMsg("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onReset?.();
  }

  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
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
          <input
            ref={inputRef}
            type='file'
            accept='image/jpeg,image/jpg,image/png'
            className='hidden'
            onChange={handleFileChange}
          />

          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            disabled={phase === "analyzing"}
            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:bg-emerald-400'
          >
            <UploadIcon />
            Pilih Gambar
          </button>

          {(previewUrl || phase === "error") && (
            <button
              type='button'
              onClick={resetUpload}
              disabled={phase === "analyzing"}
              className='inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50'
            >
              <RefreshIcon />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className='mt-5 overflow-hidden rounded-3xl border border-dashed border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-cyan-50'>
        {previewUrl ? (
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
        ) : (
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
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
        )}
      </div>
    </section>
  );
}
