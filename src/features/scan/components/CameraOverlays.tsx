"use client";

type CameraOverlaysProps = {
  phase: string;
  faceDetected: boolean;
  countdown: number;
  modelStatus: string;
  errorMsg: string;
  onResetScan: () => void;
};

export function CameraOverlays({
  phase,
  faceDetected,
  countdown,
  modelStatus,
  errorMsg,
  onResetScan,
}: CameraOverlaysProps) {
  return (
    <>
      {/* Face guide outline */}
      <div
        className={`pointer-events-none absolute left-1/2 top-16 h-[280px] w-[280px] -translate-x-1/2 rounded-[48px] border-4 transition-colors duration-300 sm:top-20 sm:h-[320px] sm:w-[360px] ${
          phase === "countdown"
            ? "border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.3)]"
            : faceDetected
              ? "border-emerald-400"
              : "border-white/95"
        }`}
      />
      <div className="pointer-events-none absolute left-1/2 top-[104px] h-[210px] w-[190px] -translate-x-1/2 rounded-[48%] border border-white/70 sm:top-[116px] sm:h-[250px] sm:w-[230px]" />

      {/* Countdown overlay */}
      {phase === "countdown" && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600/80 shadow-xl">
            <span className="text-5xl font-black text-white">{countdown}</span>
          </div>
          <p className="rounded-full bg-black/40 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            Tahan wajah… auto capture segera
          </p>
        </div>
      )}

      {/* Analyzing overlay */}
      {phase === "analyzing" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-slate-900/60 backdrop-blur-sm">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400" />
          <p className="text-lg font-bold text-white">Menganalisis kulit…</p>
          <p className="text-sm text-white/70">
            {modelStatus === "loaded" ? "Auto crop wajah → ML service" : "Mengirim frame penuh → ML service"}
          </p>
        </div>
      )}

      {/* Error overlay */}
      {phase === "error" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-rose-900/70 px-8 text-center backdrop-blur-sm">
          <p className="text-2xl font-black text-white">Oops!</p>
          <p className="text-sm font-semibold text-rose-100">{errorMsg}</p>
          <button type="button" onClick={onResetScan}
            className="mt-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-rose-700 shadow transition-colors hover:bg-rose-50">
            Coba Lagi
          </button>
        </div>
      )}
    </>
  );
}
