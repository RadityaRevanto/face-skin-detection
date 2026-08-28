"use client";

import { useEffect, useState } from "react";

type ReactScanProps = {
  enabled?: boolean;
};

export function ReactScan({ enabled = false }: ReactScanProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/react-scan@latest/build/global.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [enabled]);

  if (!enabled || !isLoaded) return null;

  return null;
}
