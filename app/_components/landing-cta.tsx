import Link from "next/link";

import { ArrowRightIcon } from "./landing-icons";

export function LandingCta() {
  return (
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
  );
}
