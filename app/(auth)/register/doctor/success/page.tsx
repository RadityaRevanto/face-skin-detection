import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { LeafLogo } from "@/features/auth/components/BrandIcons";

export const metadata: Metadata = {
  title: "Registrasi Berhasil",
  description: "Akun dokter berhasil dibuat",
};

export default function RegisterDoctorSuccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-shell-alt px-4 py-6 text-zinc-950 sm:px-6">
      {/* Background orbs */}
      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-emerald-100/80 blur-3xl" />
      <div className="absolute right-0 top-0 h-136 w-136 rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-lg items-center justify-center">
        <section className="w-full rounded-4xl border border-zinc-200/70 bg-white px-6 py-10 shadow-2xl shadow-emerald-950/10 sm:px-10">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <span className="rounded-2xl border border-emerald-100 bg-emerald-50 p-2">
              <LeafLogo />
            </span>
          </div>

          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Registrasi Berhasil!
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-zinc-600">
            Akun dokter kamu sudah dibuat dan{" "}
            <span className="font-semibold text-amber-600">
              SEDANG DIVERIFIKASI
            </span>{" "}
            oleh admin.
          </p>

          {/* Steps */}
          <div className="mt-8 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Langkah selanjutnya
            </h2>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                1
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Cek email untuk verifikasi OTP
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Masukkan kode 6 digit yang dikirim ke email kamu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-300 text-xs font-bold text-white">
                2
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Tunggu review admin
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Proses verifikasi biasanya 1–3 hari kerja.
                </p>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                Kamu sudah bisa
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-700">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Upload produk
                  skincare
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Upload rekomendasi
                  perawatan
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                Belum bisa (sampai verified)
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-500">
                <li className="flex items-center gap-2">
                  <span className="text-zinc-400">–</span> Chat konsultasi
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-zinc-400">–</span> Muncul di daftar
                  dokter
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ROUTES.LOGIN}
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-xl shadow-emerald-600/25 transition hover:bg-emerald-700"
            >
              Verifikasi Email Sekarang
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Nanti
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
