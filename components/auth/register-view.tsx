"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 7.5 12 12.75 19.5 7.5M5.25 6h13.5A2.25 2.25 0 0 1 21 8.25v7.5A2.25 2.25 0 0 1 18.75 18H5.25A2.25 2.25 0 0 1 3 15.75v-7.5A2.25 2.25 0 0 1 5.25 6Z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V7.875a4.5 4.5 0 0 0-9 0V10.5M6.75 10.5h10.5A1.5 1.5 0 0 1 18.75 12v6A1.5 1.5 0 0 1 17.25 19.5H6.75A1.5 1.5 0 0 1 5.25 18v-6a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {hidden ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.22A10.5 10.5 0 0 0 2.25 12s3.75 6.75 9.75 6.75c1.53 0 2.91-.44 4.11-1.08M6.53 6.53C8.02 5.72 9.84 5.25 12 5.25c6 0 9.75 6.75 9.75 6.75a12.34 12.34 0 0 1-2.67 3.35M3 3l18 18"
          />
        </>
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12S6 5.25 12 5.25 21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </>
      )}
    </svg>
  );
}

function LeafLogo() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 48 48" fill="none">
      <path
        d="M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z"
        fill="#10B981"
      />
      <path
        d="M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z"
        fill="#047857"
      />
      <path
        d="M12 31.5c6.6-8.1 13.5-14.4 24-20.4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackgroundLeaf({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 180 180"
      fill="none"
    >
      <path
        d="M156.7 18.8C113.7 24.5 74.1 51.2 56.1 87.5c-15.8 31.8-8.9 60.5 18.1 75.6 4.8-38.2 21.1-75.4 50.4-106.7-21.7 34.3-32.1 68.8-29.8 101.6 31-9.8 56.8-34.6 67.9-66.5 8.4-24.3 6-50.3-6-72.7Z"
        fill="url(#leafGradient)"
      />
      <path
        d="M70 141.5c19.8-40.7 47.8-76.2 84.4-108.1"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="leafGradient"
          x1="43"
          x2="169"
          y1="157"
          y2="25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#A7F3D0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
      {children}
    </span>
  );
}

export function RegisterView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 900);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbf8] px-4 py-6 text-zinc-950 sm:px-6">
      <div className="absolute -left-20 top-14 h-72 w-72 rounded-full bg-emerald-100/80 blur-3xl" />
      <div className="absolute right-0 top-0 h-136 w-136 rounded-full bg-emerald-200/45 blur-3xl" />
      <div className="absolute bottom-0 right-20 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl" />
      <BackgroundLeaf className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 opacity-25 blur-[1px] sm:h-52 sm:w-52" />
      <BackgroundLeaf className="pointer-events-none absolute right-12 top-10 h-24 w-24 -rotate-12 opacity-15 blur-[1px]" />
      <BackgroundLeaf className="pointer-events-none absolute -bottom-10 left-8 h-36 w-36 rotate-[-28deg] opacity-20 blur-[1px] sm:h-48 sm:w-48" />

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1500px] items-center gap-8 lg:grid-cols-[410px_minmax(0,1fr)] xl:grid-cols-[430px_minmax(0,1fr)]">
        <section className="rounded-4xl border border-zinc-200/70 bg-white px-8 py-10 shadow-2xl shadow-emerald-950/10 sm:px-10">
          <Link href={ROUTES.HOME} className="mb-10 flex items-center gap-3">
            <LeafLogo />
            <span>
              <span className="block text-base font-bold tracking-tight">
                Skin Detection
              </span>
              <span className="block text-xs font-medium text-emerald-600">
                Analisis Kulit Berbasis AI
              </span>
            </span>
          </Link>

          <div className="mb-7">
            <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Buat Akun Anda
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-600">
              Mulai analisis kondisi kulit dengan teknologi berbasis AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <div className="relative">
                <FieldIcon>
                  <UserIcon />
                </FieldIcon>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  className="h-12 rounded-xl border-zinc-200 bg-white pl-10 text-sm shadow-sm focus-visible:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <div className="relative">
                <FieldIcon>
                  <MailIcon />
                </FieldIcon>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan alamat email"
                  autoComplete="email"
                  className="h-12 rounded-xl border-zinc-200 bg-white pl-10 text-sm shadow-sm focus-visible:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <FieldIcon>
                  <LockIcon />
                </FieldIcon>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password"
                  autoComplete="new-password"
                  className="h-12 rounded-xl border-zinc-200 bg-white pl-10 pr-10 text-sm shadow-sm focus-visible:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-emerald-600"
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <FieldIcon>
                  <LockIcon />
                </FieldIcon>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi password"
                  autoComplete="new-password"
                  className="h-12 rounded-xl border-zinc-200 bg-white pl-10 pr-10 text-sm shadow-sm focus-visible:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-emerald-600"
                >
                  <EyeIcon hidden={showConfirmPassword} />
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-zinc-600">
              <input
                type="checkbox"
                required
                defaultChecked
                className="h-4 w-4 rounded border-emerald-300 accent-emerald-600"
              />
              <span>
                Saya menyetujui{" "}
                <Link href="#" className="font-semibold text-emerald-700">
                  Ketentuan
                </Link>{" "}
                &{" "}
                <Link href="#" className="font-semibold text-emerald-700">
                  Kebijakan Privasi
                </Link>
              </span>
            </label>

            <Button
              variant="success"
              className="h-13 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  Buat Akun
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                </>
              ) : (
                "Buat Akun"
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Mendaftar sebagai dokter?{" "}
            <Link
              href={ROUTES.REGISTER_DOCTOR}
              className="font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              Buat akun dokter
            </Link>
          </p>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 to-zinc-200" />
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
              atau
            </span>
            <div className="h-px flex-1 bg-linear-to-l from-transparent via-zinc-200 to-zinc-200" />
          </div>

          <p className="text-center text-sm text-zinc-500">
            Sudah punya akun?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </section>

        <section className="relative min-h-[720px] overflow-hidden rounded-4xl px-5 py-10 sm:px-8 lg:min-h-[760px]">
          <div className="absolute right-0 top-4 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="absolute bottom-10 left-8 h-40 w-40 rounded-full bg-teal-100/80 blur-3xl" />
          <div className="absolute right-4 top-4 h-24 w-24 rounded-full border border-emerald-200/40" />
          <div className="absolute right-14 top-14 h-40 w-40 rounded-full border border-emerald-200/30" />

          <div className="relative mx-auto w-full max-w-4xl">
            <div className="mb-8 max-w-md">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Analisis Kulit Berbasis AI
              </div>
              <h2 className="text-4xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-5xl">
                AI Canggih untuk{" "}
                <span className="text-emerald-700">Kulit Lebih Sehat</span>
              </h2>
              {/* <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-600">
                Our AI analyzes 30+ skin parameters to deliver personalized
                insights and recommendations.
              </p> */}
            </div>

            <div className="relative rounded-4xl border border-white/80 bg-white/65 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-6 lg:p-7">
              <div className="relative min-h-[330px] overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-teal-50">
                <div className="absolute left-8 top-7 z-20 flex items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  AI Memindai
                </div>

                <div className="absolute left-1/2 top-9 h-80 w-56 -translate-x-1/2 rounded-t-full bg-linear-to-b from-zinc-700 via-zinc-800 to-zinc-900 opacity-90" />
                <div className="absolute left-1/2 top-20 h-72 w-52 -translate-x-1/2 rounded-[46%] bg-linear-to-b from-orange-100 via-rose-100 to-amber-100 shadow-2xl shadow-emerald-950/10" />
                <div className="absolute left-1/2 top-20 h-36 w-52 -translate-x-1/2 rounded-t-full bg-linear-to-b from-zinc-800 to-zinc-700" />
                <div className="absolute left-[44%] top-40 h-2.5 w-5 rounded-full border-t-2 border-zinc-700" />
                <div className="absolute right-[44%] top-40 h-2.5 w-5 rounded-full border-t-2 border-zinc-700" />
                <div className="absolute left-1/2 top-52 h-9 w-5 -translate-x-1/2 rounded-full border border-orange-200" />
                <div className="absolute left-1/2 top-64 h-6 w-20 -translate-x-1/2 rounded-b-full border-b-2 border-rose-300" />
                <div className="absolute left-1/2 top-14 h-76 w-px -translate-x-1/2 bg-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.95)]" />
                <div className="absolute left-1/2 top-14 h-76 w-10 -translate-x-1/2 bg-emerald-300/15 blur-sm" />
                <div className="absolute inset-x-20 top-20 h-64 rounded-4xl border border-emerald-400/35" />
                <div className="absolute left-20 top-24 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-emerald-500/50" />
                <div className="absolute right-20 top-24 h-8 w-8 rounded-tr-xl border-r-2 border-t-2 border-emerald-500/50" />
                <div className="absolute bottom-14 left-20 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-emerald-500/50" />
                <div className="absolute bottom-14 right-20 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-emerald-500/50" />

                <div className="absolute right-6 top-16 z-20 w-36 rounded-2xl bg-white/88 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur">
                  <p className="text-[10px] font-semibold text-zinc-500">
                    Skor Kesehatan Kulit
                  </p>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-3xl font-bold text-emerald-700">
                      85
                    </span>
                    <span className="pb-1 text-[10px] text-zinc-500">/100</span>
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                    Bagus
                  </p>
                  <div className="mt-3 h-1.5 rounded-full bg-emerald-100">
                    <div className="h-full w-[85%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="absolute right-6 top-52 z-20 w-36 rounded-2xl bg-white/88 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur">
                  <p className="text-[10px] font-semibold text-zinc-700">
                    Insight Utama
                  </p>
                  {[
                    ["Jerawat", "Rendah", "bg-emerald-500"],
                    ["Hidrasi", "Baik", "bg-emerald-500"],
                    ["Sensitivitas", "Rendah", "bg-emerald-500"],
                    ["Paparan UV", "Sedang", "bg-amber-400"],
                  ].map(([label, value, color]) => (
                    <div key={label} className="mt-2 flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <span className="text-[10px] text-zinc-600">
                        {label}: {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-30 -mt-4 mx-5 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-xl shadow-emerald-950/10 backdrop-blur">
                <div className="grid items-center gap-5 sm:grid-cols-[150px_minmax(0,1fr)_130px]">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">
                      Progres Kulit
                    </p>
                    <div className="mt-2 text-3xl font-bold text-emerald-600">
                      +18%
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      Peningkatan bulan ini
                    </p>
                  </div>
                  <svg
                    aria-hidden="true"
                    className="h-24 w-full"
                    viewBox="0 0 360 90"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M8 72C48 70 58 62 89 58s50 6 78-10 48-34 82-25 52 28 103-14"
                      stroke="#10B981"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 72C48 70 58 62 89 58s50 6 78-10 48-34 82-25 52 28 103-14v81H8V72Z"
                      fill="url(#progressGradient)"
                    />
                    <circle cx="352" cy="9" r="5" fill="#10B981" />
                    <circle
                      cx="352"
                      cy="9"
                      r="9"
                      stroke="#10B981"
                      strokeOpacity="0.25"
                      strokeWidth="4"
                    />
                    <defs>
                      <linearGradient
                        id="progressGradient"
                        x1="180"
                        x2="180"
                        y1="9"
                        y2="90"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#10B981" stopOpacity="0.24" />
                        <stop offset="1" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex h-full min-h-32 flex-col justify-center rounded-2xl bg-zinc-50 p-4 text-center">
                    <p className="text-xs text-zinc-500">Minggu Ini</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-700">
                      85
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-4 text-xs sm:grid-cols-3">
              {[
                ["Analisis Kulit AI", "Detail & akurat"],
                ["Insight Personal", "Sesuai kulit Anda"],
                ["Pantau Progres", "Lihat perubahan nyata"],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <LeafLogo />
                  </span>
                  <span>
                    <span className="block font-semibold text-emerald-800">
                      {title}
                    </span>
                    <span className="text-zinc-500">{desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
