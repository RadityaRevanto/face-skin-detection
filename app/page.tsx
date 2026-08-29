import type { Metadata } from "next";

import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

import { LandingContent } from "@/src/features/landing/components/LandingContent";

export const metadata: Metadata = {
  title: "SkinCheck — Deteksi Kondisi Kulit Wajah dengan AI",
  description:
    "Analisis kulit wajah Anda secara real-time dengan teknologi AI YOLOv8. Deteksi masalah kulit, dapatkan rekomendasi perawatan, dan pantau perkembangannya.",
};

export default async function LandingPage() {
  await redirectIfAuthenticated();

  return <LandingContent />;
}
