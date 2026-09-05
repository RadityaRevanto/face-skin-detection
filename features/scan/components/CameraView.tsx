"use client";

import type { RefObject } from "react";

type CameraViewProps = {
  phase: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  capturedDataUrl: string | null;
  mirrorClass: string;
};

export function CameraView({ phase, videoRef, capturedDataUrl, mirrorClass }: CameraViewProps) {
  return (
    <>
      {(phase === "live" || phase === "countdown") && (
        <video ref={videoRef} autoPlay muted playsInline
          className={`absolute inset-0 h-full w-full rounded-t-3xl object-cover ${mirrorClass}`} />
      )}

      {(phase === "analyzing" || phase === "done" || phase === "error") && capturedDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={capturedDataUrl} alt="Frame hasil capture"
          className={`absolute inset-0 h-full w-full rounded-t-3xl object-cover ${mirrorClass}`} />
      )}
    </>
  );
}
