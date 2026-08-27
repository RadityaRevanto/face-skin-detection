"use client";

import { ChangeEvent, useRef, useState } from "react";

import type { LiveScanResult } from "../_lib/pemeriksaan-types";
import { UploadPanelHeader } from "./upload-panel-header";
import { UploadPreview } from "./upload-preview";

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

      // Respons identik dengan PredictionHistoryResource backend.
      // Jika Laravel tidak menyertakan URL foto, pakai preview lokal.
      const result: LiveScanResult = {
        ...json.data,
        image_url: json.data.image_url ?? imagePreviewUrl,
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

  function pickImage() {
    inputRef.current?.click();
  }

  return (
    <section className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <UploadPanelHeader
        phase={phase}
        onPickImage={pickImage}
        onReset={resetUpload}
      />

      <div className='mt-5 overflow-hidden rounded-3xl border border-dashed border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-cyan-50'>
        <UploadPreview
          phase={phase}
          previewUrl={previewUrl}
          fileName={fileName}
          errorMsg={errorMsg}
          inputRef={inputRef}
          onPickImage={pickImage}
        />
      </div>

      <input
        type='file'
        accept='image/jpeg,image/jpg,image/png'
        className='hidden'
        onChange={handleFileChange}
      />
    </section>
  );
}
