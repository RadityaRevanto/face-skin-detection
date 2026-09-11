"use client";

import { ChangeEvent, useRef, useState } from "react";

import type { LiveScanResult } from "../types";
import { scanService } from "../services/scanService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { UploadPanelHeader } from "./UploadPanelHeader";
import { UploadPreview } from "./UploadPreview";

type UploadPhase = "idle" | "preview" | "analyzing" | "done" | "error";

type UploadImagePanelProps = {
  onUploadComplete?: (result: LiveScanResult) => void;
  onReset?: () => void;
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
  const fileRef = useRef<File | null>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function pickImage() {
    inputRef.current?.click();
  }

  function resetUpload() {
    fileRef.current = null;
    setPhase("idle");
    setPreviewUrl(null);
    setFileName("");
    setErrorMsg("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onReset?.();
  }

  /** Validasi + tampilkan preview. Analisis HANYA dijalankan lewat tombol. */
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      fileRef.current = null;
      setPreviewUrl(null);
      setPhase("error");
      setErrorMsg("Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.");
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      fileRef.current = null;
      setPreviewUrl(null);
      setPhase("error");
      setErrorMsg("Ukuran file melebihi 5MB.");
      return;
    }

    try {
      const imagePreviewUrl = await readFileAsDataUrl(file);
      fileRef.current = file;
      setPreviewUrl(imagePreviewUrl);
      setFileName(file.name);
      setErrorMsg("");
      // Tunggu user menekan "Analisis Sekarang" — tidak auto-upload.
      setPhase("preview");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membaca gambar.";
      setErrorMsg(message);
      setPhase("error");
    }
  }

  /** Analisis gambar yang sudah dipreview (dipicu tombol "Analisis Sekarang"). */
  async function handleAnalyze() {
    const file = fileRef.current;
    const imagePreviewUrl = previewUrl;

    if (!file || !imagePreviewUrl || phase === "analyzing") {
      return;
    }

    setPhase("analyzing");
    setErrorMsg("");

    try {
      const data = await scanService.upload(file);

      // Respons identik dengan PredictionHistoryResource backend.
      // Jika Laravel tidak menyertakan URL foto, pakai preview lokal.
      const result: LiveScanResult = {
        ...data,
        image_url: data.image_url ?? imagePreviewUrl,
      };

      setPhase("done");
      onUploadComplete?.(result);
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message
          ? getUserFriendlyErrorMessage(err)
          : "Terjadi kesalahan.",
      );
      setPhase("error");
    }
  }

  return (
    <section className='rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6'>
      <UploadPanelHeader hasPendingImage={phase === "preview"} />

      <div className='mt-4 overflow-hidden rounded-3xl border border-dashed border-emerald-200 bg-linear-to-br from-emerald-50/80 via-white to-cyan-50/60'>
        <UploadPreview
          phase={phase}
          previewUrl={previewUrl}
          fileName={fileName}
          errorMsg={errorMsg}
          onPickImage={pickImage}
          onAnalyze={handleAnalyze}
          onReset={resetUpload}
        />
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='image/jpeg,image/jpg,image/png'
        className='hidden'
        onChange={handleFileChange}
      />
    </section>
  );
}
