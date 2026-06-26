import type { Metadata } from "next";
import Link from "next/link";

import { LandingHeader } from "./_components/landing-header";
import {
  ArrowRightIcon,
  BoltIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  LockIcon,
  Logo,
  MedicalShieldIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "./_components/landing-icons";

export const metadata: Metadata = {
  title: "SkinCheck — Deteksi Kondisi Kulit Wajah dengan AI",
  description:
    "Analisis kulit wajah Anda secara real-time dengan teknologi AI YOLOv8. Deteksi masalah kulit, dapatkan rekomendasi perawatan, dan pantau perkembangannya.",
};

const stats = [
  { value: "< 5 dtk", label: "Waktu analisis" },
  { value: "YOLOv8", label: "Model AI terkini" },
  { value: "2 Mode", label: "Live & Upload foto" },
  { value: "100%", label: "Privasi terjaga" },
];

const features = [
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

const steps = [
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

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-emerald-50 via-white to-cyan-50 p-8 shadow-xl shadow-emerald-100/60 ring-1 ring-slate-100">
        <div className="relative flex h-[320px] w-full items-end justify-center">
          <div className="absolute left-1/2 top-3 h-52 w-64 -translate-x-1/2 rounded-[44px] border-4 border-emerald-300/70" />

          <div className="relative h-[270px] w-[230px] overflow-hidden rounded-t-[110px] bg-linear-to-b from-amber-100 to-amber-200 shadow-2xl shadow-emerald-100">
            <div className="absolute left-1/2 top-14 h-28 w-24 -translate-x-1/2 rounded-[45%] bg-[#f2c7a7]" />
            <div className="absolute left-1/2 top-9 h-20 w-32 -translate-x-1/2 rounded-t-full bg-slate-950" />
            <div className="absolute left-[88px] top-[102px] h-2 w-2 rounded-full bg-slate-900" />
            <div className="absolute right-[88px] top-[102px] h-2 w-2 rounded-full bg-slate-900" />
            <div className="absolute left-1/2 top-[130px] h-1.5 w-10 -translate-x-1/2 rounded-full bg-rose-300" />
            <div className="absolute bottom-0 h-24 w-full rounded-t-[60px] bg-white" />
          </div>
        </div>
      </div>

      <div className="absolute -left-3 top-10 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-100 sm:-left-6">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold text-slate-900">Wajah Terdeteksi</p>
          <p className="text-[11px] font-medium text-slate-500">
            Analisis dimulai…
          </p>
        </div>
      </div>

      <div className="absolute -right-3 bottom-12 rounded-2xl bg-white px-4 py-3 text-center shadow-lg ring-1 ring-slate-100 sm:-right-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Confidence
        </p>
        <p className="text-lg font-black text-emerald-600">92%</p>
      </div>
    </div>
  );
}

function ResultPreview() {
  const problems = [
    { name: "Jerawat", value: 12, color: "bg-amber-400" },
    { name: "Kemerahan", value: 8, color: "bg-rose-400" },
    { name: "Kulit Kering", value: 5, color: "bg-cyan-400" },
  ];

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-emerald-100/50 ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">
          Ringkasan Kondisi Kulit
        </h3>
        <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Hasil Scan
        </span>
      </div>

      <div className="mt-6 flex items-center gap-5">
        <div
          className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{
            background:
              "conic-gradient(#10b981 0 331deg, #e2e8f0 331deg 360deg)",
          }}
        >
          <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-white">
            <span className="text-xl font-black text-slate-900">92%</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-lg font-black text-emerald-600">Kulit Sehat</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Confidence tinggi dari analisis AI.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {problems.map((problem) => (
          <div key={problem.name} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-slate-500">
              {problem.name}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${problem.color}`}
                style={{ width: `${problem.value}%` }}
              />
            </div>
            <span className="w-9 text-right text-xs font-bold text-slate-700">
              {problem.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />

          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700">
                <SparklesIcon className="h-4 w-4" />
                Ditenagai AI YOLOv8
              </span>

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Kenali Kondisi{" "}
                <span className="text-emerald-600">Kulit Wajah</span> Anda dalam
                Hitungan Detik
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0">
                SkinCheck menganalisis kulit wajah Anda secara real-time,
                mendeteksi masalah kulit, dan memberikan rekomendasi perawatan
                yang tepat — semuanya dari kamera atau foto Anda.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/register"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700 sm:w-auto"
                >
                  Mulai Gratis
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <a
                  href="#cara-kerja"
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-600 sm:w-auto"
                >
                  Lihat Cara Kerja
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  Tanpa biaya
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  Hasil instan
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  Privasi aman
                </span>
              </div>
            </div>

            <HeroVisual />
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-slate-100 bg-white">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-emerald-600 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="fitur" className="scroll-mt-20 bg-slate-50">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Fitur Unggulan
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Semua yang Anda butuhkan untuk merawat kulit
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Dirancang agar sederhana namun bertenaga — dari deteksi hingga
                rekomendasi, semua dalam satu aplikasi.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="cara-kerja" className="scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Cara Kerja
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Empat langkah mudah, hasil dalam sekejap
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Tidak perlu keahlian khusus. Cukup ikuti langkah berikut.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm"
                >
                  <span className="text-4xl font-black text-emerald-500/30">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="keunggulan" className="scroll-mt-20 bg-slate-50">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Kenapa SkinCheck
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Perawatan kulit yang cerdas, praktis, dan personal
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                SkinCheck membantu Anda memahami kondisi kulit tanpa ribet,
                kapan pun Anda butuh.
              </p>

              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
              >
                Coba Sekarang
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>

            <ResultPreview />
          </div>
        </section>

        {/* For doctors */}
        <section className="bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50/60 via-white to-white p-8 shadow-sm sm:p-10 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-700">
                  <MedicalShieldIcon className="h-4 w-4" />
                  Untuk Tenaga Medis
                </span>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  Anda seorang dokter kulit?
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  Bergabunglah untuk meninjau hasil analisis dan menyusun
                  rekomendasi perawatan yang terverifikasi bagi pengguna.
                </p>
              </div>

              <Link
                href="/register/doctor"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition-colors hover:bg-emerald-50 lg:w-auto"
              >
                Daftar sebagai Dokter
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-600 px-6 py-14 text-center shadow-2xl shadow-emerald-200 sm:px-12 lg:py-20">
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-8 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <h2 className="relative text-3xl font-black tracking-tight text-white sm:text-4xl">
              Siap cek kondisi kulit wajah Anda?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
              Mulai gratis dalam hitungan menit. Tidak perlu perangkat khusus —
              cukup kamera atau foto.
            </p>

            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 text-sm font-bold text-emerald-700 shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
              >
                Mulai Gratis Sekarang
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/40 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Masuk
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <Logo className="h-9 w-9" />
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  SkinCheck
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                Deteksi kondisi kulit wajah dengan AI. Cepat, praktis, dan
                membantu Anda merawat kulit lebih baik.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">Produk</p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500">
                <li>
                  <a href="#fitur" className="transition-colors hover:text-emerald-600">
                    Fitur
                  </a>
                </li>
                <li>
                  <a
                    href="#cara-kerja"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Cara Kerja
                  </a>
                </li>
                <li>
                  <a
                    href="#keunggulan"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Keunggulan
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">Akun</p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500">
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Daftar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register/doctor"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Daftar sebagai Dokter
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              © 2026 SkinCheck. Semua hak dilindungi.
            </p>
            <p className="text-xs text-slate-400">
              Hasil analisis bersifat informatif, bukan pengganti diagnosis
              medis profesional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
