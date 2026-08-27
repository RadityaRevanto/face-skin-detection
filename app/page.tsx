import type { Metadata } from "next";

import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

import { LandingHeader } from "./_components/landing-header";
import { LandingHero } from "./_components/landing-hero";
import { LandingStats } from "./_components/landing-stats";
import { LandingFeatures } from "./_components/landing-features";
import { LandingHowItWorks } from "./_components/landing-how-it-works";
import { LandingBenefits } from "./_components/landing-benefits";
import { LandingForDoctors } from "./_components/landing-doctors";
import { LandingCta } from "./_components/landing-cta";
import { LandingFooter } from "./_components/landing-footer";
import {
  ArrowRightIcon,
  BoltIcon,
  CameraIcon,
  ClockIcon,
  LockIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "./_components/landing-icons";
import type { LandingFeature, LandingStat, LandingStep } from "./_components/landing-types";

export const metadata: Metadata = {
  title: "SkinCheck — Deteksi Kondisi Kulit Wajah dengan AI",
  description:
    "Analisis kulit wajah Anda secara real-time dengan teknologi AI YOLOv8. Deteksi masalah kulit, dapatkan rekomendasi perawatan, dan pantau perkembangannya.",
};

const stats: LandingStat[] = [
  { value: "< 5 dtk", label: "Waktu analisis" },
  { value: "YOLOv8", label: "Model AI terkini" },
  { value: "2 Mode", label: "Live & Upload foto" },
  { value: "100%", label: "Privasi terjaga" },
];

const features: LandingFeature[] = [
  {
    icon: <BoltIcon className="h-6 w-6" />,
    title: "Deteksi Real-time",
    description:
      "Kamera langsung mendeteksi wajah secara otomatis lalu menganalisis kondisi kulit dalam hitungan detik.",
  },
  {
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    title: "Akurasi AI Tinggi",
    description:
      "Ditenagai model YOLOv8 yang dilatih untuk mengenali beragam kondisi kulit wajah dengan andal.",
  },
  {
    icon: <CameraIcon className="h-6 w-6" />,
    title: "Live atau Upload",
    description:
      "Analisis lewat kamera secara langsung, atau cukup unggah foto wajah dari galeri Anda.",
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: "Rekomendasi Perawatan",
    description:
      "Dapatkan saran skincare dan produk yang disesuaikan dengan kondisi kulit Anda.",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    title: "Riwayat Tersimpan",
    description:
      "Pantau perkembangan kesehatan kulit Anda dari setiap hasil pemeriksaan sebelumnya.",
  },
  {
    icon: <LockIcon className="h-6 w-6" />,
    title: "Privasi Terjaga",
    description:
      "Foto digunakan hanya untuk analisis. Data Anda tetap aman dan dalam kendali Anda.",
  },
];

const steps: LandingStep[] = [
  {
    number: "01",
    title: "Ambil atau Upload Foto",
    description:
      "Nyalakan kamera untuk deteksi wajah otomatis, atau unggah foto wajah Anda.",
  },
  {
    number: "02",
    title: "Analisis oleh AI",
    description:
      "Model YOLOv8 memproses gambar dan mendeteksi kondisi kulit pada wajah Anda.",
  },
  {
    number: "03",
    title: "Lihat Hasil",
    description:
      "Dapatkan kondisi kulit, tingkat keyakinan, dan detail masalah yang terdeteksi.",
  },
  {
    number: "04",
    title: "Terima Rekomendasi",
    description:
      "Saran perawatan & produk langsung tersaji dan otomatis tersimpan ke riwayat.",
  },
];

const benefits = [
  "Tanpa perlu janji temu — cek kapan saja, di mana saja",
  "Hasil instan dengan tingkat keyakinan yang jelas",
  "Rekomendasi perawatan yang dipersonalisasi",
  "Riwayat pemeriksaan untuk memantau progres kulit",
];

export default async function LandingPage() {
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <LandingHeader />

      <main className="flex-1">
        <LandingHero />
        <LandingStats stats={stats} />
        <LandingFeatures features={features} />
        <LandingHowItWorks steps={steps} />
        <LandingBenefits benefits={benefits} />
        <LandingForDoctors />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
