"use client";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import type { LiveScanResult } from "../_lib/pemeriksaan-types";
import { CameraIcon, RefreshIcon } from "./icons";
import { CameraControls } from "./camera-controls";
import { CameraView } from "./camera-view";
import { CameraOverlays } from "./camera-overlays";
import { CameraPlaceholder } from "./camera-placeholder";
import { InfoBar } from "./info-bar";
type CameraPanelProps = {
  onScanComplete?: (result: LiveScanResult) => void;
  onReset?: () => void;
};
type ScanPhase = "idle" | "live" | "countdown" | "analyzing" | "done" | "error";
type ModelLoadStatus = "loading" | "loaded" | "error";
const STABLE_SECONDS  = 3;
const DETECT_INTERVAL = 300;
const FACE_PADDING    = 0.10;
const STABLE_THRESHOLD = Math.round(1000 / DETECT_INTERVAL);
export function CameraPanel({ onScanComplete, onReset }: CameraPanelProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef           = useRef<MediaStream | null>(null);
  const faceModelsLoadedRef = useRef(false);
  const onScanCompleteRef   = useRef(onScanComplete);
  const stableCountRef      = useRef(0);
  const isScanningRef       = useRef(false);
  const detectTimerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownValueRef   = useRef(STABLE_SECONDS);
  const [phase,        setPhase]        = useState<ScanPhase>("idle");
  const [faceDetected, setFaceDetected] = useState(false);
  const [countdown,    setCountdown]    = useState(STABLE_SECONDS);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [errorMsg,     setErrorMsg]     = useState("");
  const [facingMode,   setFacingMode]   = useState<"user"|"environment">("user");
  const [modelStatus,  setModelStatus]  = useState<ModelLoadStatus>("loading");
  useEffect(() => { onScanCompleteRef.current = onScanComplete; }, [onScanComplete]);
  useEffect(() => {
    setModelStatus("loading");
    faceapi.nets.tinyFaceDetector.loadFromUri("/models")
      .then(() => faceapi.nets.faceLandmark68Net.loadFromUri("/models"))
      .then(() => { faceModelsLoadedRef.current = true; setModelStatus("loaded"); })
      .catch((e) => { console.error("face-api load error:", e); setModelStatus("error"); });
  }, []);
  useEffect(() => { if (videoRef.current) videoRef.current.srcObject = streamRef.current; });
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (detectTimerRef.current)   clearInterval(detectTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);
  function clearAllTimers() {
    if (detectTimerRef.current)   { clearInterval(detectTimerRef.current);   detectTimerRef.current   = null; }
    if (countdownTimerRef.current){ clearInterval(countdownTimerRef.current); countdownTimerRef.current = null; }
  }
  async function cropAndSend() {
    if (isScanningRef.current) return;
    isScanningRef.current = true;
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) { isScanningRef.current = false; return; }
    const W = video.videoWidth || 1280, H = video.videoHeight || 720;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) { isScanningRef.current = false; return; }
    ctx.drawImage(video, 0, 0, W, H);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setPhase("analyzing");
    setCapturedDataUrl(canvas.toDataURL("image/jpeg", 0.92));
    let blob: Blob | null = null;
    if (faceModelsLoadedRef.current) {
      const det = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }));
      if (det) {
        const { x, y, width: dw, height: dh } = det.box;
        const px = dw * FACE_PADDING, py = dh * FACE_PADDING;
        const x1 = Math.max(0, x - px), y1 = Math.max(0, y - py);
        const cw = Math.min(W - x1, dw + px * 2), ch = Math.min(H - y1, dh + py * 2);
        const cc = document.createElement("canvas"); cc.width = cw; cc.height = ch;
        cc.getContext("2d")?.drawImage(canvas, x1, y1, cw, ch, 0, 0, cw, ch);
        blob = await new Promise<Blob|null>((r) => cc.toBlob((b) => r(b), "image/jpeg", 0.92));
      }
    }
    if (!blob) blob = await new Promise<Blob|null>((r) => canvas.toBlob((b) => r(b), "image/jpeg", 0.92));
    if (!blob) { setPhase("error"); setErrorMsg("Gagal konversi frame."); isScanningRef.current = false; return; }
    const fd = new FormData(); fd.append("cropped_face", blob, "livecam_frame.jpg");
    try {
      const res = await fetch("/api/predict/livecam", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Server error");
      setPhase("done"); onScanCompleteRef.current?.(json.data as LiveScanResult);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan."); setPhase("error");
    } finally { isScanningRef.current = false; }
  }
  function startCountdown() {
    if (countdownTimerRef.current) return;
    countdownValueRef.current = STABLE_SECONDS;
    setCountdown(STABLE_SECONDS);
    setPhase("countdown");
    countdownTimerRef.current = setInterval(() => {
      countdownValueRef.current -= 1;
      setCountdown(countdownValueRef.current);
      if (countdownValueRef.current <= 0) { clearAllTimers(); cropAndSend(); }
    }, 1000);
  }
  function resetCountdown() {
    if (countdownTimerRef.current) { clearInterval(countdownTimerRef.current); countdownTimerRef.current = null; }
    countdownValueRef.current = STABLE_SECONDS;
    setCountdown(STABLE_SECONDS);
    setPhase("live");
  }
  function startDetectionLoop() {
    if (detectTimerRef.current) return;
    detectTimerRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || isScanningRef.current) return;
      const det = faceModelsLoadedRef.current
        ? await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.45 }))
        : null;
      const detected = !!det;
      setFaceDetected(detected);
      if (detected) {
        stableCountRef.current += 1;
        if (stableCountRef.current >= STABLE_THRESHOLD && !countdownTimerRef.current) startCountdown();
      } else {
        stableCountRef.current = 0;
        if (countdownTimerRef.current) resetCountdown();
      }
    }, DETECT_INTERVAL);
  }
  async function startCamera(mode = facingMode) {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      clearAllTimers();
      const ms = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false,
      });
      streamRef.current = ms;
      isScanningRef.current = false;
      stableCountRef.current = 0;
      setCapturedDataUrl(null); setErrorMsg(""); setFaceDetected(false);
      setCountdown(STABLE_SECONDS); setPhase("live");
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
    stableCountRef.current = 0; isScanningRef.current = false;
    setFaceDetected(false); setCountdown(STABLE_SECONDS); setPhase("idle");
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
    isScanningRef.current = false; stableCountRef.current = 0;
    setCapturedDataUrl(null); setErrorMsg(""); setFaceDetected(false);
    setCountdown(STABLE_SECONDS); setPhase("idle");
    onReset?.();
  }
  const isCameraOn = phase === "live" || phase === "countdown" || phase === "analyzing"; const mirrorClass = facingMode === "user" ? "-scale-x-100" : "";
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="relative min-h-[440px] overflow-visible rounded-t-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50 sm:min-h-[520px] lg:min-h-[560px]">
        <CameraControls
          faceDetected={faceDetected} isCameraOn={isCameraOn} isAnalyzing={phase === "analyzing"}
          onToggleCamera={isCameraOn ? stopCamera : () => startCamera()} onSwitchCamera={switchCamera}
        />
        <CameraView phase={phase} videoRef={videoRef} capturedDataUrl={capturedDataUrl} mirrorClass={mirrorClass} />
        {phase === "idle" && <CameraPlaceholder />}
        <CameraOverlays
          phase={phase} faceDetected={faceDetected} countdown={countdown}
          modelStatus={modelStatus} errorMsg={errorMsg} onResetScan={resetScan}
        />
        <canvas ref={canvasRef} className="hidden" />
        <button type="button"
          aria-label={phase === "done" ? "Scan ulang" : "Nyalakan kamera"}
          onClick={phase === "done" ? resetScan : () => startCamera()}
          disabled={phase === "analyzing"}
          className="absolute bottom-0 left-1/2 z-30 grid h-20 w-20 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-200 ring-8 ring-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          {phase === "done" ? <RefreshIcon /> : <CameraIcon className="h-9 w-9" />}
        </button>
      </div>
      <InfoBar phase={phase} faceDetected={faceDetected} countdown={countdown} errorMsg={errorMsg} modelStatus={modelStatus} />
    </section>
  );
}
