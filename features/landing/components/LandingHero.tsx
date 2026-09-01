import Link from "next/link";

import {
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
} from "./LandingIcons";

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-emerald-50 via-white to-cyan-50 p-8 shadow-xl shadow-emerald-100/60 ring-1 ring-slate-100">
        <div className="relative flex h-[320px] w-full items-end justify-center">
          <div className="absolute left-1/2 top-3 h-52 w-64 -translate-x-1/2 rounded-[44px] border-4 border-emerald-300/70" />

          <div className="relative h-[270px] w-[230px] overflow-hidden rounded-t-[110px] bg-linear-to-b from-amber-100 to-amber-200 shadow-2xl shadow-emerald-100">
            <div className="absolute left-1/2 top-14 h-28 w-24 -translate-x-1/2 rounded-[45%] bg-illustration-skin" />
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

export function LandingHero() {
  return (
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
            Skincek menganalisis kulit wajah Anda secara real-time,
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
  );
}
