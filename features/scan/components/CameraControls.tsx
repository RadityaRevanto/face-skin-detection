"use client";

import { BoltIcon, RefreshIcon } from "./Icons";

type CameraControlsProps = {
  faceDetected: boolean;
  isCameraOn: boolean;
  isAnalyzing: boolean;
  onToggleCamera: () => void;
  onSwitchCamera: () => void;
};

export function CameraControls({
  faceDetected,
  isCameraOn,
  isAnalyzing,
  onToggleCamera,
  onSwitchCamera,
}: CameraControlsProps) {
  return (
    <>
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
          onClick={onToggleCamera}
          disabled={isAnalyzing}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50">
          <BoltIcon />
        </button>
        <button type="button" aria-label="Ganti kamera"
          onClick={onSwitchCamera}
          disabled={!isCameraOn || isAnalyzing}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-800 shadow-lg transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50">
          <RefreshIcon />
        </button>
      </div>
    </>
  );
}
