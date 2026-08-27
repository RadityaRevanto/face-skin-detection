"use client";

type StatusOverlaysProps = {
  phase: string;
  modelStatus: string;
  errorMsg: string;
  onResetScan: () => void;
};

export function StatusOverlays({ phase, modelStatus, errorMsg, onResetScan }: StatusOverlaysProps) {
  return (
    <>
      {phase === "analyzing" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-slate-900/60 backdrop-blur-sm">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400" />
          <p className="text-lg font-bold text-white">Menganalisis kulit…</p>
          <p className="text-sm text-white/70">
            {modelStatus === "loaded" ? "Auto crop wajah → ML service" : "Mengirim frame penuh → ML service"}
          </p>
        </div>
      )}

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
