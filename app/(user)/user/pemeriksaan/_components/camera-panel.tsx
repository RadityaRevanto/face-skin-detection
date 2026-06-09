"use client";

import { useEffect, useRef, useState } from "react";

import { BoltIcon, CameraIcon, RefreshIcon } from "./icons";

export function CameraPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [cameraMessage, setCameraMessage] = useState(
    "Klik tombol kamera untuk mulai livecam",
  );

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

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !isCameraOn) {
      setCameraMessage("Aktifkan kamera terlebih dahulu sebelum ambil foto.");
      return;
    }

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraMessage("Browser tidak mendukung capture frame kamera.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedFrame(canvas.toDataURL("image/png"));
    setCameraMessage(
      "Frame berhasil diambil. Tahap berikutnya frame ini dikirim ke ML API.",
    );
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

        <div className='pointer-events-none absolute left-1/2 top-20 h-[320px] w-[360px] -translate-x-1/2 rounded-[48px] border-4 border-white/95' />
        <div className='pointer-events-none absolute left-1/2 top-[116px] h-[250px] w-[230px] -translate-x-1/2 rounded-[48%] border border-white/70' />

        <canvas ref={canvasRef} className='hidden' />

        <button
          type='button'
          aria-label='Ambil foto pemeriksaan'
          onClick={isCameraOn ? captureFrame : () => startCamera()}
          className='absolute bottom-0 left-1/2 z-30 grid h-20 w-20 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-200 ring-8 ring-white transition-colors hover:bg-emerald-700'
        >
          <CameraIcon className='h-9 w-9' />
        </button>
      </div>

      <div className='px-8 pb-6 pt-12'>
        <div className='mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4'>
          <div className='grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-white'>
            <CameraIcon className='h-6 w-6' />
          </div>

          <div className='min-w-0 flex-1'>
            <h2 className='font-bold text-slate-900'>
              {isCameraOn
                ? "Posisikan wajah Anda di tengah kamera"
                : capturedFrame
                  ? "Frame livecam berhasil diambil"
                  : "Aktifkan kamera untuk mulai pemeriksaan"}
            </h2>
            <p className='mt-1 text-sm font-medium text-slate-500'>
              {cameraMessage}
            </p>
          </div>

          <span className='rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700'>
            {isCameraOn ? "Live" : capturedFrame ? "Captured" : "Siap"}
          </span>
        </div>
      </div>
    </section>
  );
}
