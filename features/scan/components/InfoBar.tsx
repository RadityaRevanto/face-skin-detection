"use client";

import { CameraIcon } from "./Icons";

type InfoBarProps = {
  phase: string;
  faceDetected: boolean;
  countdown: number;
  errorMsg: string;
  modelStatus: string;
};

export function InfoBar({ phase, faceDetected, countdown, errorMsg, modelStatus }: InfoBarProps) {
  const statusText: Record<string, string> = {
    idle     : "Klik tombol kamera untuk mulai, wajah akan terdeteksi otomatis",
    live     : faceDetected ? "Wajah terdeteksi! Tahan sebentar…" : "Posisikan wajah di tengah kamera",
    countdown: `Bersiap… auto capture dalam ${countdown} detik`,
    analyzing: "Menganalisis kondisi kulit…",
    done     : "Analisis selesai! Hasil tersimpan ke riwayat.",
    error    : errorMsg || "Terjadi kesalahan.",
  };

  return (
    <>
      {modelStatus === "error" && (
        <div className="mx-5 mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:mx-8">
          <p className="text-sm font-semibold text-amber-800">
            Face detection model gagal dimuat. Auto crop tidak aktif — gambar penuh akan dikirim.
          </p>
          <p className="mt-1 text-xs text-amber-600">
            Coba refresh halaman atau periksa koneksi internet.
          </p>
        </div>
      )}

      <div className="px-5 pb-6 pt-12 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 sm:gap-4 sm:px-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
            <CameraIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-slate-900">
              {phase === "idle"      && "Aktifkan kamera — deteksi wajah otomatis"}
              {phase === "live"      && (faceDetected ? "Wajah terdeteksi! Tahan sebentar…" : "Posisikan wajah di tengah kamera")}
              {phase === "countdown" && `Auto capture dalam ${countdown} detik…`}
              {phase === "analyzing" && "Sedang menganalisis kondisi kulit…"}
              {phase === "done"      && "Analisis selesai — tersimpan ke riwayat"}
              {phase === "error"     && "Terjadi kesalahan saat analisis"}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{statusText[phase]}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-bold ${
            phase === "done"        ? "bg-emerald-100 text-emerald-700"
            : phase === "analyzing" ? "bg-amber-100 text-amber-700"
            : phase === "countdown" ? "bg-emerald-100 text-emerald-700"
            : phase === "error"     ? "bg-rose-100 text-rose-700"
            : faceDetected          ? "bg-emerald-100 text-emerald-700"
            : phase === "live"      ? "bg-yellow-100 text-yellow-700"
            : "bg-slate-100 text-slate-600"
          }`}>
            {phase === "idle"      && "Siap"}
            {phase === "live"      && (faceDetected ? "✓ Wajah" : "Live")}
            {phase === "countdown" && countdown}
            {phase === "analyzing" && "Proses…"}
            {phase === "done"      && "Selesai"}
            {phase === "error"     && "Error"}
          </span>
        </div>
      </div>
    </>
  );
}
