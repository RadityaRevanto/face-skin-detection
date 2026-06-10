"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BoltIcon, CameraIcon, RefreshIcon } from "./icons";

// ─── Types ───────────────────────────────────────────────────────────────────

type PredictionResult = {
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  severity_score: number;
  severity_level: string;
  model_used: string;
};

type ScanResult = {
  prediction: PredictionResult;
  cropped_image_url: string;
  history_id?: string;
};

type ScanPhase =
  | "idle"       // kamera belum aktif
  | "live"       // kamera aktif
  | "analyzing"  // sedang kirim ke ML service
  | "done"       // hasil sudah ada
  | "error";     // ada error

// ─── Helpers ─────────────────────────────────────────────────────────────────

function severityColor(level: string) {
  if (level === "high" || level === "severe") return "text-rose-600";
  if (level === "medium" || level === "moderate") return "text-amber-600";
  return "text-emerald-600";
}

function severityBadge(level: string) {
  if (level === "high" || level === "severe")
    return "bg-rose-50 text-rose-700 ring-rose-200";
  if (level === "medium" || level === "moderate")
    return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function severityLabel(level: string) {
  if (level === "high" || level === "severe") return "Tinggi";
  if (level === "medium" || level === "moderate") return "Sedang";
  return "Rendah";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CameraPanel() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Assign stream ke video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cleanup stream saat unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const isCameraOn = phase === "live" || phase === "analyzing";

  // ── Camera controls ─────────────────────────────────────────────────────

  async function startCamera(mode = facingMode) {
    try {
      stream?.getTracks().forEach((t) => t.stop());

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      setCapturedDataUrl(null);
      setScanResult(null);
      setErrorMsg("");
      setPhase("live");
    } catch {
      setPhase("error");
      setErrorMsg("Kamera tidak bisa diakses. Izinkan akses kamera di browser Anda.");
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setPhase("idle");
  }

  async function switchCamera() {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    await startCamera(next);
  }

  // ── Scan ────────────────────────────────────────────────────────────────

  async function handleCaptureScan() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || phase !== "live") return;

    // 1. Capture frame
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedDataUrl(dataUrl);

    // Hentikan stream — hasil frame sudah di-capture
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setPhase("analyzing");

    // 2. Canvas → Blob → FormData
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setPhase("error");
          setErrorMsg("Gagal mengkonversi frame ke gambar. Coba lagi.");
          return;
        }

        const formData = new FormData();
        formData.append("cropped_face", blob, "livecam_frame.jpg");

        try {
          const res = await fetch("/api/predict/livecam", {
            method: "POST",
            body: formData,
          });

          const json = await res.json();

          if (!res.ok || !json.success) {
            throw new Error(json.error ?? "Gagal analisis dari server.");
          }

          setScanResult(json.data as ScanResult);
          setPhase("done");

          // Refresh Server Component data (sidebar: status, problem, rekomendasi)
          router.refresh();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
          setErrorMsg(msg);
          setPhase("error");
        }
      },
      "image/jpeg",
      0.92,
    );
  }

  function resetScan() {
    setCapturedDataUrl(null);
    setScanResult(null);
    setErrorMsg("");
    setPhase("idle");
  }

  // ── Derived values ───────────────────────────────────────────────────────

  const confidencePct = scanResult
    ? Math.round(scanResult.prediction.confidence * 100)
    : 0;

  const statusMessage: Record<ScanPhase, string> = {
    idle: "Klik tombol kamera untuk mulai livecam",
    live: "Livecam aktif. Posisikan wajah di tengah, lalu klik tombol capture.",
    analyzing: "Menganalisis kondisi kulit… harap tunggu.",
    done: "Analisis selesai! Hasil tersimpan ke riwayat.",
    error: errorMsg || "Terjadi kesalahan.",
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <section className='overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100'>
      {/* ── Camera viewport ── */}
      <div className='relative min-h-[560px] overflow-hidden rounded-t-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50'>

        {/* YOLO badge */}
        <div className='absolute left-5 top-5 z-20 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg shadow-emerald-100'>
          <p className='text-xs font-bold leading-4'>
            YOLO Face
            <br />
            Detection Active
          </p>
        </div>

        {/* Camera controls */}
        <div className='absolute right-6 top-5 z-20 flex gap-3'>
          <button
            type='button'
            aria-label={isCameraOn ? "Matikan kamera" : "Nyalakan kamera"}
            onClick={isCameraOn ? stopCamera : () => startCamera()}
            disabled={phase === "analyzing"}
            className='grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50'
          >
            <BoltIcon />
          </button>

          <button
            type='button'
            aria-label='Ganti kamera'
            onClick={switchCamera}
            disabled={!isCameraOn || phase === "analyzing"}
            className='grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50'
          >
            <RefreshIcon />
          </button>
        </div>

        {/* ── Content area ── */}
        {/* Live video */}
        {phase === "live" && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className='absolute inset-0 h-full w-full object-cover'
          />
        )}

        {/* Captured frame (analyzing / done / error) */}
        {(phase === "analyzing" || phase === "done" || phase === "error") &&
          capturedDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedDataUrl}
              alt='Frame hasil capture livecam'
              className='absolute inset-0 h-full w-full object-cover'
            />
          )}

        {/* Idle placeholder — ilustrasi wajah */}
        {phase === "idle" && (
          <div className='absolute bottom-0 left-1/2 h-[500px] w-[420px] -translate-x-1/2'>
            <div className='absolute left-1/2 top-10 h-44 w-60 -translate-x-1/2 rounded-t-full bg-slate-950' />
            <div className='absolute left-1/2 top-[92px] h-[240px] w-[205px] -translate-x-1/2 rounded-[46%] bg-[#efc09d]' />
            <div className='absolute left-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900' />
            <div className='absolute right-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900' />
            <div className='absolute left-1/2 top-[245px] h-3 w-12 -translate-x-1/2 rounded-full bg-rose-300' />
            <div className='absolute bottom-0 left-1/2 h-36 w-[380px] -translate-x-1/2 rounded-t-[120px] bg-white' />
          </div>
        )}

        {/* Face overlay guides */}
        <div className='pointer-events-none absolute left-1/2 top-20 h-[320px] w-[360px] -translate-x-1/2 rounded-[48px] border-4 border-white/95' />
        <div className='pointer-events-none absolute left-1/2 top-[116px] h-[250px] w-[230px] -translate-x-1/2 rounded-[48%] border border-white/70' />

        {/* Analyzing overlay */}
        {phase === "analyzing" && (
          <div className='absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-slate-900/60 backdrop-blur-sm'>
            {/* Spinner */}
            <div className='h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400' />
            <p className='text-lg font-bold text-white'>Menganalisis kulit…</p>
            <p className='text-sm text-white/70'>Menghubungi ML service</p>
          </div>
        )}

        {/* Result overlay — tampilkan ringkasan singkat di atas gambar */}
        {phase === "done" && scanResult && (
          <div className='absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent px-6 pb-14 pt-20'>
            <p className='text-xs font-semibold uppercase tracking-widest text-white/60'>
              Hasil Analisis
            </p>
            <h3 className={`mt-1 text-2xl font-black ${severityColor(scanResult.prediction.severity_level)} drop-shadow`}>
              {scanResult.prediction.predicted_class}
            </h3>
            <div className='mt-2 flex items-center gap-3'>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${severityBadge(scanResult.prediction.severity_level)}`}>
                Severity: {severityLabel(scanResult.prediction.severity_level)}
              </span>
              <span className='rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/30'>
                Confidence {confidencePct}%
              </span>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {phase === "error" && (
          <div className='absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-rose-900/70 px-8 text-center backdrop-blur-sm'>
            <p className='text-2xl font-black text-white'>Oops!</p>
            <p className='text-sm font-semibold text-rose-100'>{errorMsg}</p>
            <button
              type='button'
              onClick={resetScan}
              className='mt-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-rose-700 shadow transition-colors hover:bg-rose-50'
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Hidden canvas untuk capture */}
        <canvas ref={canvasRef} className='hidden' />

        {/* Main action button */}
        <button
          type='button'
          aria-label={phase === "live" ? "Capture & analisis wajah" : "Nyalakan kamera"}
          onClick={phase === "live" ? handleCaptureScan : phase === "done" ? resetScan : () => startCamera()}
          disabled={phase === "analyzing"}
          className='absolute bottom-0 left-1/2 z-30 grid h-20 w-20 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-200 ring-8 ring-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:bg-emerald-400'
        >
          {phase === "done" ? (
            <RefreshIcon />
          ) : (
            <CameraIcon className='h-9 w-9' />
          )}
        </button>
      </div>

      {/* ── Info bar ── */}
      <div className='px-8 pb-6 pt-12'>
        {/* Status bar */}
        <div className='mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4'>
          <div className='grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-white'>
            <CameraIcon className='h-6 w-6' />
          </div>

          <div className='min-w-0 flex-1'>
            <h2 className='font-bold text-slate-900'>
              {phase === "idle" && "Aktifkan kamera untuk mulai pemeriksaan"}
              {phase === "live" && "Posisikan wajah Anda di tengah kamera"}
              {phase === "analyzing" && "Sedang menganalisis kondisi kulit…"}
              {phase === "done" && "Analisis selesai — data tersimpan ke riwayat"}
              {phase === "error" && "Terjadi kesalahan saat analisis"}
            </h2>
            <p className='mt-1 text-sm font-medium text-slate-500'>
              {statusMessage[phase]}
            </p>
          </div>

          <span className={`rounded-full px-4 py-2 text-sm font-bold ${
            phase === "done"
              ? "bg-emerald-100 text-emerald-700"
              : phase === "analyzing"
                ? "bg-amber-100 text-amber-700"
                : phase === "error"
                  ? "bg-rose-100 text-rose-700"
                  : phase === "live"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
          }`}>
            {phase === "idle" && "Siap"}
            {phase === "live" && "Live"}
            {phase === "analyzing" && "Proses…"}
            {phase === "done" && "Selesai"}
            {phase === "error" && "Error"}
          </span>
        </div>

        {/* Result detail card — tampil saat done */}
        {phase === "done" && scanResult && (
          <div className='mx-auto mt-5 max-w-3xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm'>
            <div className='border-b border-slate-100 px-6 py-4'>
              <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
                Detail Hasil Pemeriksaan Livecam
              </p>
            </div>
            <div className='grid grid-cols-3 divide-x divide-slate-100 px-2 py-3'>
              <div className='px-4 py-3 text-center'>
                <p className='text-xs font-semibold text-slate-400'>Kondisi</p>
                <p className='mt-1 text-sm font-black text-slate-800 leading-tight'>
                  {scanResult.prediction.predicted_class}
                </p>
              </div>
              <div className='px-4 py-3 text-center'>
                <p className='text-xs font-semibold text-slate-400'>Confidence</p>
                <p className={`mt-1 text-2xl font-black ${severityColor(scanResult.prediction.severity_level)}`}>
                  {confidencePct}%
                </p>
              </div>
              <div className='px-4 py-3 text-center'>
                <p className='text-xs font-semibold text-slate-400'>Severity</p>
                <span className={`mt-2 inline-flex rounded-xl px-3 py-1.5 text-xs font-bold ring-1 ${severityBadge(scanResult.prediction.severity_level)}`}>
                  {severityLabel(scanResult.prediction.severity_level)}
                </span>
              </div>
            </div>
            <div className='border-t border-slate-100 px-6 py-4'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400'>
                Probabilitas per Kondisi
              </p>
              <div className='space-y-2'>
                {Object.entries(scanResult.prediction.probabilities)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([label, prob]) => (
                    <div key={label} className='flex items-center gap-3'>
                      <span className='w-44 truncate text-xs font-semibold text-slate-500'>
                        {label}
                      </span>
                      <div className='flex-1 overflow-hidden rounded-full bg-slate-100 h-2'>
                        <div
                          className='h-2 rounded-full bg-emerald-500 transition-all duration-700'
                          style={{ width: `${Math.round(prob * 100)}%` }}
                        />
                      </div>
                      <span className='w-10 text-right text-xs font-bold text-slate-700'>
                        {Math.round(prob * 100)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className='border-t border-slate-100 px-6 py-4'>
              <button
                type='button'
                onClick={resetScan}
                className='w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow transition-colors hover:bg-emerald-700'
              >
                Scan Ulang
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
