"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

import type { LiveScanResult } from "../_lib/pemeriksaan-types";
import { BoltIcon, CameraIcon, RefreshIcon } from "./icons";

type CameraPanelProps = {
  onScanComplete?: (result: LiveScanResult) => void;
  onReset?: () => void;
};

type ScanPhase = "idle" | "live" | "countdown" | "analyzing" | "done" | "error";

const STABLE_SECONDS  = 3;
const DETECT_INTERVAL = 300;
const FACE_PADDING    = 0.10;
// Berapa frame berturut-turut wajah harus terdeteksi sebelum countdown mulai
const STABLE_THRESHOLD = Math.round(1000 / DETECT_INTERVAL); // ≈3

export function CameraPanel({ onScanComplete, onReset }: CameraPanelProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Semua state operasional pakai ref agar tidak trigger re-render / restart useEffect
  const streamRef           = useRef<MediaStream | null>(null);
  const faceModelsLoadedRef = useRef(false);
  const onScanCompleteRef   = useRef(onScanComplete);
  const stableCountRef      = useRef(0);
  const isScanningRef       = useRef(false);
  const detectTimerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownValueRef   = useRef(STABLE_SECONDS);

  // State hanya untuk UI
  const [phase,           setPhase]           = useState<ScanPhase>("idle");
  const [faceDetected,    setFaceDetected]     = useState(false);
  const [countdown,       setCountdown]        = useState(STABLE_SECONDS);
  const [capturedDataUrl, setCapturedDataUrl]  = useState<string | null>(null);
  const [errorMsg,        setErrorMsg]         = useState("");
  const [facingMode,      setFacingMode]       = useState<"user"|"environment">("user");

  useEffect(() => { onScanCompleteRef.current = onScanComplete; }, [onScanComplete]);

  // ── Load face-api models ────────────────────────────────────────────
  useEffect(() => {
    faceapi.nets.tinyFaceDetector.loadFromUri("/models")
      .then(() => faceapi.nets.faceLandmark68Net.loadFromUri("/models"))
      .then(() => { faceModelsLoadedRef.current = true; })
      .catch((e) => console.error("face-api load error:", e));
  }, []);

  // ── Sync video srcObject ────────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = streamRef.current;
  });

  // ── Cleanup unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (detectTimerRef.current)   clearInterval(detectTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // ── Stop semua timer ────────────────────────────────────────────────
  function clearAllTimers() {
    if (detectTimerRef.current)   { clearInterval(detectTimerRef.current);   detectTimerRef.current   = null; }
    if (countdownTimerRef.current){ clearInterval(countdownTimerRef.current); countdownTimerRef.current = null; }
  }

  // ── Crop + kirim ke backend ─────────────────────────────────────────
  async function cropAndSend() {
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) { isScanningRef.current = false; return; }

    const W = video.videoWidth  || 1280;
    const H = video.videoHeight || 720;
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) { isScanningRef.current = false; return; }

    ctx.drawImage(video, 0, 0, W, H);

    // Stop stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    setPhase("analyzing");
    setCapturedDataUrl(canvas.toDataURL("image/jpeg", 0.92));

    // Coba crop wajah
    let blob: Blob | null = null;
    if (faceModelsLoadedRef.current) {
      const det = await faceapi.detectSingleFace(
        canvas, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 })
      );
      if (det) {
        const { x, y, width, height } = det.box;
        const px = width  * FACE_PADDING;
        const py = height * FACE_PADDING;
        const x1 = Math.max(0, x - px);
        const y1 = Math.max(0, y - py);
        const cw = Math.min(W - x1, width  + px * 2);
        const ch = Math.min(H - y1, height + py * 2);
        const cc = document.createElement("canvas");
        cc.width = cw; cc.height = ch;
        cc.getContext("2d")?.drawImage(canvas, x1, y1, cw, ch, 0, 0, cw, ch);
        blob = await new Promise<Blob|null>((r) => cc.toBlob((b) => r(b), "image/jpeg", 0.92));
      }
    }
    // Fallback gambar penuh
    if (!blob) blob = await new Promise<Blob|null>((r) => canvas.toBlob((b) => r(b), "image/jpeg", 0.92));
    if (!blob) { setPhase("error"); setErrorMsg("Gagal konversi frame."); isScanningRef.current = false; return; }

    const fd = new FormData();
    fd.append("cropped_face", blob, "livecam_frame.jpg");
    try {
      const res  = await fetch("/api/predict/livecam", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Server error");
      const result: LiveScanResult = {
        ...(json.data as LiveScanResult),
        recommendations: (json.data as LiveScanResult).recommendations ?? [],
      };
      setPhase("done");
      onScanCompleteRef.current?.(result);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setPhase("error");
    } finally {
      isScanningRef.current = false;
    }
  }

  // ── Mulai countdown (dipanggil dari detection loop) ─────────────────
  function startCountdown() {
    if (countdownTimerRef.current) return; // sudah jalan

    countdownValueRef.current = STABLE_SECONDS;
    setCountdown(STABLE_SECONDS);
    setPhase("countdown");

    countdownTimerRef.current = setInterval(() => {
      countdownValueRef.current -= 1;
      setCountdown(countdownValueRef.current);

      if (countdownValueRef.current <= 0) {
        clearAllTimers();
        cropAndSend();
      }
    }, 1000);
  }

  // ── Reset countdown (wajah hilang) ──────────────────────────────────
  function resetCountdown() {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    countdownValueRef.current = STABLE_SECONDS;
    setCountdown(STABLE_SECONDS);
    setPhase("live");
  }

  // ── Detection loop — dipanggil manual, bukan dari useEffect ─────────
  function startDetectionLoop() {
    if (detectTimerRef.current) return;

    detectTimerRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      if (isScanningRef.current) return;

      const det = faceModelsLoadedRef.current
        ? await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.45 }))
        : null;

      const detected = !!det;
      setFaceDetected(detected);

      if (detected) {
        stableCountRef.current += 1;
        // Wajah stabil cukup → mulai countdown
        if (stableCountRef.current >= STABLE_THRESHOLD && !countdownTimerRef.current) {
          startCountdown();
        }
      } else {
        stableCountRef.current = 0;
        // Wajah hilang saat countdown → reset
        if (countdownTimerRef.current) {
          resetCountdown();
        }
      }
    }, DETECT_INTERVAL);
  }

  // ── Camera controls ─────────────────────────────────────────────────
  async function startCamera(mode = facingMode) {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      clearAllTimers();

      const ms = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current  = ms;
      isScanningRef.current  = false;
      stableCountRef.current = 0;

      setCapturedDataUrl(null);
      setErrorMsg("");
      setFaceDetected(false);
      setCountdown(STABLE_SECONDS);
      setPhase("live");

      // Mulai detection loop setelah video siap
      if (videoRef.current) videoRef.current.srcObject = ms;
      setTimeout(() => startDetectionLoop(), 500);
    } catch {
      setPhase("error");
      setErrorMsg("Kamera tidak bisa diakses. Izinkan akses kamera di browser Anda.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    clearAllTimers();
    stableCountRef.current = 0;
    isScanningRef.current  = false;
    setFaceDetected(false);
    setCountdown(STABLE_SECONDS);
    setPhase("idle");
  }

  async function switchCamera() {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    await startCamera(next);
  }

  function resetScan() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    clearAllTimers();
    isScanningRef.current  = false;
    stableCountRef.current = 0;
    setCapturedDataUrl(null);
    setErrorMsg("");
    setFaceDetected(false);
    setCountdown(STABLE_SECONDS);
    setPhase("idle");
    onReset?.();
  }

  const isCameraOn = phase === "live" || phase === "countdown" || phase === "analyzing";

  const statusText: Record<ScanPhase, string> = {
    idle     : "Klik tombol kamera untuk mulai, wajah akan terdeteksi otomatis",
    live     : faceDetected ? "Wajah terdeteksi! Tahan sebentar…" : "Posisikan wajah di tengah kamera",
    countdown: `Bersiap… auto capture dalam ${countdown} detik`,
    analyzing: "Menganalisis kondisi kulit…",
    done     : "Analisis selesai! Hasil tersimpan ke riwayat.",
    error    : errorMsg || "Terjadi kesalahan.",
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="relative min-h-[560px] overflow-visible rounded-t-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50">

        {/* Badge */}
        <div className="absolute left-5 top-5 z-20 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg shadow-emerald-100">
          <p className="text-xs font-bold leading-4">
            {faceDetected ? "✓ Wajah" : "Auto Face"}<br />
            {faceDetected ? "Terdeteksi" : "Detection"}
          </p>
        </div>

        {/* Camera controls */}
        <div className="absolute right-6 top-5 z-20 flex gap-3">
          <button type="button"
            aria-label={isCameraOn ? "Matikan kamera" : "Nyalakan kamera"}
            onClick={isCameraOn ? stopCamera : () => startCamera()}
            disabled={phase === "analyzing"}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50">
            <BoltIcon />
          </button>
          <button type="button" aria-label="Ganti kamera"
            onClick={switchCamera}
            disabled={!isCameraOn || phase === "analyzing"}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50">
            <RefreshIcon />
          </button>
        </div>

        {/* Live video */}
        {(phase === "live" || phase === "countdown") && (
          <video ref={videoRef} autoPlay muted playsInline
            className="absolute inset-0 h-full w-full rounded-t-3xl object-cover" />
        )}

        {/* Captured frame */}
        {(phase === "analyzing" || phase === "done" || phase === "error") && capturedDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={capturedDataUrl} alt="Frame hasil capture"
            className="absolute inset-0 h-full w-full rounded-t-3xl object-cover" />
        )}

        {/* Idle placeholder */}
        {phase === "idle" && (
          <div className="absolute bottom-0 left-1/2 h-[500px] w-[420px] -translate-x-1/2">
            <div className="absolute left-1/2 top-10 h-44 w-60 -translate-x-1/2 rounded-t-full bg-slate-950" />
            <div className="absolute left-1/2 top-[92px] h-[240px] w-[205px] -translate-x-1/2 rounded-[46%] bg-[#efc09d]" />
            <div className="absolute left-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900" />
            <div className="absolute right-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900" />
            <div className="absolute left-1/2 top-[245px] h-3 w-12 -translate-x-1/2 rounded-full bg-rose-300" />
            <div className="absolute bottom-0 left-1/2 h-36 w-[380px] -translate-x-1/2 rounded-t-[120px] bg-white" />
          </div>
        )}

        {/* Face guide overlay */}
        <div className={`pointer-events-none absolute left-1/2 top-20 h-[320px] w-[360px] -translate-x-1/2 rounded-[48px] border-4 transition-colors duration-300 ${
          phase === "countdown" ? "border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.3)]"
          : faceDetected        ? "border-emerald-400"
          : "border-white/95"
        }`} />
        <div className="pointer-events-none absolute left-1/2 top-[116px] h-[250px] w-[230px] -translate-x-1/2 rounded-[48%] border border-white/70" />

        {/* Countdown overlay */}
        {phase === "countdown" && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
            <div className="rounded-full bg-emerald-600/80 w-24 h-24 flex items-center justify-center shadow-xl">
              <span className="text-5xl font-black text-white">{countdown}</span>
            </div>
            <p className="text-white font-bold text-sm bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
              Tahan wajah… auto capture segera
            </p>
          </div>
        )}

        {/* Analyzing overlay */}
        {phase === "analyzing" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-slate-900/60 backdrop-blur-sm">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400" />
            <p className="text-lg font-bold text-white">Menganalisis kulit…</p>
            <p className="text-sm text-white/70">Auto crop wajah → ML service</p>
          </div>
        )}

        {/* Error overlay */}
        {phase === "error" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-rose-900/70 px-8 text-center backdrop-blur-sm">
            <p className="text-2xl font-black text-white">Oops!</p>
            <p className="text-sm font-semibold text-rose-100">{errorMsg}</p>
            <button type="button" onClick={resetScan}
              className="mt-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-rose-700 shadow transition-colors hover:bg-rose-50">
              Coba Lagi
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Action button */}
        <button type="button"
          aria-label={phase === "done" ? "Scan ulang" : "Nyalakan kamera"}
          onClick={phase === "done" ? resetScan : () => startCamera()}
          disabled={phase === "analyzing"}
          className="absolute bottom-0 left-1/2 z-30 grid h-20 w-20 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-200 ring-8 ring-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          {phase === "done" ? <RefreshIcon /> : <CameraIcon className="h-9 w-9" />}
        </button>
      </div>

      {/* Info bar */}
      <div className="px-8 pb-6 pt-12">
        <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
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
    </section>
  );
}

