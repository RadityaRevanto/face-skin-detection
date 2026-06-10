"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { BoltIcon, CameraIcon, RefreshIcon } from "./icons";

export function CameraPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [cameraMessage, setCameraMessage] = useState(
    "Klik tombol kamera untuk mulai livecam",
  );
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  async function startCamera(mode = facingMode) {
    try {
      stream?.getTracks().forEach((track) => track.stop());

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraOn(true);
      setCapturedFrame(null);
      setIsSuccess(false);
      setCameraMessage("Livecam aktif. Posisikan wajah di tengah kamera.");
    } catch {
      setIsCameraOn(false);
      setCameraMessage(
        "Kamera tidak bisa diakses. Izinkan akses kamera di browser Anda.",
      );
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsCameraOn(false);
    setCameraMessage("Kamera dihentikan. Klik tombol kamera untuk mulai lagi.");
  }

  async function switchCamera() {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    await startCamera(nextMode);
  }

  async function captureAndSend() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !isCameraOn) {
      setCameraMessage("Aktifkan kamera terlebih dahulu sebelum ambil foto.");
      return;
    }

    // 1. Capture frame
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraMessage("Browser tidak mendukung capture frame kamera.");
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedFrame(dataUrl);
    stopCamera();

    // 2. Kirim ke ML API
    setIsSending(true);
    setCameraMessage("Menganalisis wajah... Mohon tunggu.");

    try {
      // Convert base64 dataUrl ke Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("cropped_face", file);

      const response = await fetch("/api/predict/livecam", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // 3. Simpan hasil ke database via endpoint upload (dengan scan_mode livecam)
        const saveFormData = new FormData();
        saveFormData.append("image", file);

        const saveResponse = await fetch("/api/predict/upload", {
          method: "POST",
          body: saveFormData,
        });

        const saveResult = await saveResponse.json();

        if (saveResult.success) {
          setIsSuccess(true);
          setCameraMessage(
            `Analisis selesai! Terdeteksi: ${result.data?.prediction?.predicted_class ?? "—"}`,
          );
          // Refresh halaman untuk tampilkan hasil terbaru di sidebar
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setCameraMessage("Analisis selesai tapi gagal menyimpan. Coba lagi.");
        }
      } else {
        setCameraMessage("Gagal menganalisis. Pastikan wajah terlihat jelas.");
      }
    } catch {
      setCameraMessage("Terjadi kesalahan koneksi. Coba lagi.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className='overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100'>
      <div className='relative min-h-[560px] overflow-hidden rounded-t-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50'>
        <div className='absolute left-5 top-5 z-20 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg shadow-emerald-100'>
          <p className='text-xs font-bold leading-4'>
            YOLO Face
            <br />
            Detection Active
          </p>
        </div>

        <div className='absolute right-6 top-5 z-20 flex gap-3'>
          <button
            type='button'
            aria-label={isCameraOn ? "Matikan kamera" : "Nyalakan kamera"}
            onClick={isCameraOn ? stopCamera : () => startCamera()}
            className='grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600'
          >
            <BoltIcon />
          </button>

          <button
            type='button'
            aria-label='Ganti kamera'
            onClick={switchCamera}
            className='grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600'
          >
            <RefreshIcon />
          </button>
        </div>

        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className='absolute inset-0 h-full w-full object-cover'
          />
        ) : capturedFrame ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedFrame}
            alt='Frame hasil capture livecam'
            className='absolute inset-0 h-full w-full object-cover'
          />
        ) : (
          <div className='absolute bottom-0 left-1/2 h-[500px] w-[420px] -translate-x-1/2'>
            <div className='absolute left-1/2 top-10 h-44 w-60 -translate-x-1/2 rounded-t-full bg-slate-950' />
            <div className='absolute left-1/2 top-[92px] h-[240px] w-[205px] -translate-x-1/2 rounded-[46%] bg-[#efc09d]' />
            <div className='absolute left-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900' />
            <div className='absolute right-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900' />
            <div className='absolute left-1/2 top-[245px] h-3 w-12 -translate-x-1/2 rounded-full bg-rose-300' />
            <div className='absolute bottom-0 left-1/2 h-36 w-[380px] -translate-x-1/2 rounded-t-[120px] bg-white' />
          </div>
        )}

        {/* Loading overlay saat analisis */}
        {isSending && (
          <div className='absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50'>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-white border-t-emerald-400' />
            <p className='mt-4 font-bold text-white'>Menganalisis wajah...</p>
          </div>
        )}

        {/* Success overlay */}
        {isSuccess && !isSending && (
          <div className='absolute inset-0 z-40 flex flex-col items-center justify-center bg-emerald-900/40'>
            <div className='grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white text-3xl shadow-xl'>
              ✓
            </div>
            <p className='mt-4 font-bold text-white text-lg'>Analisis Selesai!</p>
            <button
              onClick={() => {
                setCapturedFrame(null);
                setIsSuccess(false);
                setCameraMessage("Klik tombol kamera untuk mulai livecam");
              }}
              className='mt-4 rounded-xl bg-white px-5 py-2 text-sm font-bold text-emerald-700 shadow hover:bg-emerald-50'
            >
              Scan Lagi
            </button>
          </div>
        )}

        <div className='pointer-events-none absolute left-1/2 top-20 h-[320px] w-[360px] -translate-x-1/2 rounded-[48px] border-4 border-white/95' />
        <div className='pointer-events-none absolute left-1/2 top-[116px] h-[250px] w-[230px] -translate-x-1/2 rounded-[48%] border border-white/70' />

        <canvas ref={canvasRef} className='hidden' />

        {/* Tombol kamera — hilang saat loading atau success */}
        {!isSending && !isSuccess && (
          <button
            type='button'
            aria-label='Ambil foto pemeriksaan'
            onClick={isCameraOn ? captureAndSend : () => startCamera()}
            className='absolute bottom-0 left-1/2 z-30 grid h-20 w-20 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-200 ring-8 ring-white transition-colors hover:bg-emerald-700'
          >
            <CameraIcon className='h-9 w-9' />
          </button>
        )}
      </div>

      <div className='px-8 pb-6 pt-12'>
        <div className='mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4'>
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white ${isSuccess ? 'bg-emerald-500' : 'bg-emerald-600'}`}>
            <CameraIcon className='h-6 w-6' />
          </div>

          <div className='min-w-0 flex-1'>
            <h2 className='font-bold text-slate-900'>
              {isSending
                ? "Sedang menganalisis wajah..."
                : isSuccess
                  ? "Analisis berhasil!"
                  : isCameraOn
                    ? "Posisikan wajah Anda di tengah kamera"
                    : capturedFrame
                      ? "Frame livecam berhasil diambil"
                      : "Aktifkan kamera untuk mulai pemeriksaan"}
            </h2>
            <p className='mt-1 text-sm font-medium text-slate-500'>
              {cameraMessage}
            </p>
          </div>

          <span className={`rounded-full px-4 py-2 text-sm font-bold ${
            isSuccess
              ? 'bg-emerald-200 text-emerald-800'
              : isSending
                ? 'bg-yellow-100 text-yellow-700'
                : isCameraOn
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
          }`}>
            {isSuccess ? "Selesai" : isSending ? "Proses" : isCameraOn ? "Live" : capturedFrame ? "Captured" : "Siap"}
          </span>
        </div>
      </div>
    </section>
  );
}
