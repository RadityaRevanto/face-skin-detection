import {
  BoltIcon,
  CameraIcon,
  ClockIcon,
  LockIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "../components/LandingIcons";
import type { LandingFeature, LandingStat, LandingStep } from "../components/LandingTypes";

export const landingStats: LandingStat[] = [
  { value: "< 5 dtk", label: "Waktu analisis" },
  { value: "YOLOv8", label: "Model AI terkini" },
  { value: "2 Mode", label: "Live & Upload foto" },
  { value: "100%", label: "Privasi terjaga" },
];

export const landingFeatures: LandingFeature[] = [
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

export const landingSteps: LandingStep[] = [
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

export const landingBenefits = [
  "Tanpa perlu janji temu — cek kapan saja, di mana saja",
  "Hasil instan dengan tingkat keyakinan yang jelas",
  "Rekomendasi perawatan yang dipersonalisasi",
  "Riwayat pemeriksaan untuk memantau progres kulit",
];
