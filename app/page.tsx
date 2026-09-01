import type { Metadata } from "next";

import { RedirectIfAuthenticated } from "@/features/auth/components/RedirectIfAuthenticated";
import { LandingContent } from "@/features/landing/components/LandingContent";

export const metadata: Metadata = {
  title: "Deteksi Kondisi Kulit Wajah dengan AI",
  description:
    "Analisis kulit wajah Anda secara real-time dengan teknologi AI YOLOv8. Deteksi masalah kulit, dapatkan rekomendasi perawatan, dan pantau perkembangannya.",
};

export default function LandingPage() {
  return (
    <RedirectIfAuthenticated>
      <LandingContent />
    </RedirectIfAuthenticated>
  );
}
