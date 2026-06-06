"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type IconProps = {
  children: ReactNode;
  className?: string;
};

function Icon({ children, className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {children}
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.4l1.2-1.7A2 2 0 0 1 10.7 3.5h2.6a2 2 0 0 1 1.6.8L16.1 6h1.4A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function BoltIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function RefreshIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3M17 3v4h4M7 21v-4H3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M12 3 5 6v5.3c0 4.4 2.9 8.4 7 9.7 4.1-1.3 7-5.3 7-9.7V6l-7-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function CalendarIcon() {
  return (
    <Icon className="h-4 w-4">
      <path
        d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function BulbIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M9 18h6m-5 3h4m2.5-10.5A4.5 4.5 0 0 0 7.7 12c.5 1.2 1.4 2 2.1 2.9.5.6.7 1.2.7 2.1h3c0-.9.2-1.5.7-2.1.7-.9 1.6-1.7 2.1-2.9.2-.5.2-1 .2-1.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

const skinProblems = [
  { name: "Jerawat", value: 15, color: "bg-orange-500" },
  { name: "Flek Hitam", value: 8, color: "bg-yellow-400" },
  { name: "Kemerahan", value: 5, color: "bg-emerald-500" },
  { name: "Pori-pori Besar", value: 12, color: "bg-orange-400" },
  { name: "Komedo", value: 6, color: "bg-green-500" },
];

const careRecommendations = [
  "Gunakan pembersih wajah 2x sehari",
  "Jangan lupa sunscreen setiap pagi",
  "Gunakan pelembab yang sesuai",
  "Minum air putih minimal 8 gelas/hari",
];

const steps = [
  ["Ambil Foto", "Foto wajah Anda"],
  ["Analisis YOLO", "Proses AI berjalan"],
  ["Hasil Analisis", "Lihat kondisi kulit"],
  ["Rekomendasi", "Dapatkan saran"],
];

export default function PemeriksaanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [cameraMessage, setCameraMessage] = useState(
    "Klik tombol kamera untuk mulai livecam"
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
        "Kamera tidak bisa diakses. Izinkan akses kamera di browser Anda."
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
      "Frame berhasil diambil. Nanti frame ini bisa dikirim ke model YOLO."
    );
  }

  return (
    <main className="w-full px-8 py-8 sm:px-10 lg:px-12">

      <div className="grid gap-8 xl:grid-cols-[1.65fr_0.75fr]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
            <div className="relative min-h-[560px] overflow-hidden rounded-t-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50">
              <div className="absolute left-5 top-5 z-20 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg shadow-emerald-100">
                <p className="text-xs font-bold leading-4">
                  YOLO Face
                  <br />
                  Detection Active
                </p>
              </div>

              <div className="absolute right-6 top-5 z-20 flex gap-3">
                <button
                  type="button"
                  aria-label={isCameraOn ? "Matikan kamera" : "Nyalakan kamera"}
                  onClick={isCameraOn ? stopCamera : () => startCamera()}
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <BoltIcon />
                </button>
                <button
                  type="button"
                  aria-label="Ganti kamera"
                  onClick={switchCamera}
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600"
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
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : capturedFrame ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedFrame}
                  alt="Frame hasil capture livecam"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute bottom-0 left-1/2 h-[500px] w-[420px] -translate-x-1/2">
                  <div className="absolute left-1/2 top-10 h-44 w-60 -translate-x-1/2 rounded-t-full bg-slate-950" />
                  <div className="absolute left-1/2 top-[92px] h-[240px] w-[205px] -translate-x-1/2 rounded-[46%] bg-[#efc09d]" />
                  <div className="absolute left-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900" />
                  <div className="absolute right-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900" />
                  <div className="absolute left-1/2 top-[245px] h-3 w-12 -translate-x-1/2 rounded-full bg-rose-300" />
                  <div className="absolute bottom-0 left-1/2 h-36 w-[380px] -translate-x-1/2 rounded-t-[120px] bg-white" />
                </div>
              )}

              <div className="pointer-events-none absolute left-1/2 top-20 h-[320px] w-[360px] -translate-x-1/2 rounded-[48px] border-4 border-white/95" />
              <div className="pointer-events-none absolute left-1/2 top-[116px] h-[250px] w-[230px] -translate-x-1/2 rounded-[48%] border border-white/70" />
              <canvas ref={canvasRef} className="hidden" />

              <button
                type="button"
                aria-label="Ambil foto pemeriksaan"
                onClick={isCameraOn ? captureFrame : () => startCamera()}
                className="absolute bottom-0 left-1/2 z-30 grid h-20 w-20 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-200 ring-8 ring-white transition-colors hover:bg-emerald-700"
              >
                <CameraIcon className="h-9 w-9" />
              </button>
            </div>

            <div className="px-8 pb-6 pt-12">
              <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
                  <CameraIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900">
                    {isCameraOn
                      ? "Posisikan wajah Anda di tengah kamera"
                      : capturedFrame
                        ? "Frame livecam berhasil diambil"
                        : "Aktifkan kamera untuk mulai pemeriksaan"}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {cameraMessage}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                  {isCameraOn ? "Live" : capturedFrame ? "Captured" : "Siap"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="grid gap-4 md:grid-cols-4">
              {steps.map(([title, description], index) => (
                <div key={title} className="relative flex items-center gap-4">
                  <span
                    className={[
                      "grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black",
                      index === 0
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {description}
                    </p>
                  </div>
                  {index < steps.length - 1 ? (
                    <span className="absolute right-4 top-1/2 hidden h-px w-14 bg-slate-200 xl:block" />
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Status Kulit
              </h2>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Analisis Real-time
              </span>
            </div>

            <div className="flex items-center gap-7">
              <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[conic-gradient(#10b981_0_295deg,#facc15_295deg_340deg,#e2e8f0_340deg)]">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-white">
                  <span className="text-3xl font-black text-slate-900">
                    82%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-emerald-600">
                  Kulit Sehat
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Kondisi kulit Anda dalam keadaan baik.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  <ShieldIcon />
                  Skor Kesehatan
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Deteksi Masalah Kulit
            </h2>

            <div className="mt-6 space-y-5">
              {skinProblems.map((problem) => (
                <div key={problem.name} className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${problem.color}`}
                  />
                  <span className="flex-1 text-sm font-semibold text-slate-500">
                    {problem.name}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {problem.value}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center gap-3">
              <div className="text-amber-500">
                <BulbIcon />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekomendasi Perawatan
              </h2>
            </div>

            <div className="space-y-5">
              {careRecommendations.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 text-slate-400">
                    <CalendarIcon />
                  </div>
                  <p className="text-sm font-semibold leading-6 text-slate-500">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
