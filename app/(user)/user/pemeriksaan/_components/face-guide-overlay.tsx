"use client";

type FaceGuideOverlayProps = {
  phase: string;
  faceDetected: boolean;
  countdown: number;
};

export function FaceGuideOverlay({ phase, faceDetected, countdown }: FaceGuideOverlayProps) {
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
    </>
  );
}
