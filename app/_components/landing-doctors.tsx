import Link from "next/link";

import { ArrowRightIcon, MedicalShieldIcon } from "./landing-icons";

export function LandingForDoctors() {
  return (
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
  );
}
