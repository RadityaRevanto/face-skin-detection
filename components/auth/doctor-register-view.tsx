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

function BadgeIcon() {
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
        d="M9 12.75 11.25 15 15 9.75M12 3.75l6.75 3v4.95c0 4.28-2.72 8.1-6.75 9.55-4.03-1.45-6.75-5.27-6.75-9.55V6.75l6.75-3Z"
      />
    </svg>
  );
}

function StethoscopeIcon() {
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
        d="M6 4.5v5.25a4.5 4.5 0 0 0 9 0V4.5M4.5 4.5H7.5M13.5 4.5h3M15 10.5v3.75A4.25 4.25 0 0 0 19.25 18.5h.25a2 2 0 1 0-2-2"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V4.5m0 0L7.5 9M12 4.5 16.5 9M4.5 16.5v1.875A2.625 2.625 0 0 0 7.125 21h9.75a2.625 2.625 0 0 0 2.625-2.625V16.5"
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.22A10.5 10.5 0 0 0 2.25 12s3.75 6.75 9.75 6.75c1.53 0 2.91-.44 4.11-1.08M6.53 6.53C8.02 5.72 9.84 5.25 12 5.25c6 0 9.75 6.75 9.75 6.75a12.34 12.34 0 0 1-2.67 3.35M3 3l18 18"
        />
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
        strokeLinecap="round"
        strokeWidth="2"
      />
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

function DashboardMenuItem({
  title,
  active,
}: {
  title: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-zinc-500 hover:bg-zinc-50"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-emerald-500" : "bg-zinc-300"
        }`}
      />
      {title}
    </div>
  );
}

function DashboardContentCard({
  icon,
  title,
  description,
  count,
  label,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  count: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">
              {description}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
            Approved
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold tracking-tight text-zinc-950">
          {count}
        </p>
        <p className="text-[10px] text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

export function DoctorRegisterView() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 900);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6fbf8] px-4 py-6 text-zinc-950 sm:px-6">
      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-emerald-100/80 blur-3xl" />
      <div className="absolute right-0 top-0 h-136 w-136 rounded-full bg-emerald-200/45 blur-3xl" />
      <div className="absolute right-32 top-28 h-60 w-60 rounded-full border border-emerald-200/50" />
      <div className="absolute right-24 top-20 h-84 w-84 rounded-full border border-emerald-200/35" />

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1500px] items-center gap-8 lg:grid-cols-[460px_minmax(0,1fr)] xl:grid-cols-[500px_minmax(0,1fr)]">
        <section className="rounded-4xl border border-zinc-200/70 bg-white px-8 py-8 shadow-2xl shadow-emerald-950/10 sm:px-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-3">
              <span className="rounded-2xl border border-emerald-100 bg-emerald-50 p-1">
                <LeafLogo />
              </span>
              <span>
                <span className="block text-base font-bold tracking-tight">
                  Skin Detection
                </span>
                <span className="block text-xs font-medium text-emerald-600">
                  Doctor Portal
                </span>
              </span>
            </Link>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              AI Powered
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Buat Akun Dokter
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Bergabunglah dengan platform AI Skin Detection untuk memberikan
              layanan analisis kulit yang lebih akurat dan terpercaya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <FieldIcon>
                    <UserIcon />
                  </FieldIcon>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Nama lengkap"
                    autoComplete="name"
                    className="h-11 rounded-xl pl-10 focus-visible:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <FieldIcon>
                    <MailIcon />
                  </FieldIcon>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email aktif"
                    autoComplete="email"
                    className="h-11 rounded-xl pl-10 focus-visible:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-rose-500">*</span>
              </Label>
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
                  className="h-11 rounded-xl pl-10 pr-10 focus-visible:ring-emerald-500"
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

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="strNumber" className="flex min-h-8 items-end">
                  Nomor STR / Identitas Dokter{" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <FieldIcon>
                    <BadgeIcon />
                  </FieldIcon>
                  <Input
                    id="strNumber"
                    name="strNumber"
                    placeholder="Contoh: 1234567890123456"
                    className="h-11 rounded-xl pl-10 focus-visible:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="specialization"
                  className="flex min-h-8 items-end"
                >
                  Spesialisasi <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <FieldIcon>
                    <StethoscopeIcon />
                  </FieldIcon>
                  <select
                    id="specialization"
                    name="specialization"
                    className="flex h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm text-zinc-950 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih spesialisasi
                    </option>
                    <option value="dermatology">Dermatologi</option>
                    <option value="aesthetic-medicine">Kedokteran Estetika</option>
                    <option value="general-practitioner">Dokter Umum</option>
                    <option value="skincare-consultant">Konsultan Skincare</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
                        d="m6 9 6 6 6-6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationDocument">
                Dokumen Verifikasi <span className="text-rose-500">*</span>
              </Label>
              <label
                htmlFor="verificationDocument"
                className="flex cursor-pointer items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                  <UploadIcon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900">
                    {selectedFile ||
                      "Upload surat keterangan dokter / STR atau dokumen pendukung lainnya"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    PDF, JPG, PNG (Maks: 5MB)
                  </span>
                </span>
                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  Pilih File
                </span>
                <input
                  id="verificationDocument"
                  name="verificationDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  required
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0]?.name ?? "")
                  }
                />
              </label>
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
                  Terms of Service
                </Link>{" "}
                &{" "}
                <Link href="#" className="font-semibold text-emerald-700">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              variant="success"
              className="h-12 w-full rounded-xl bg-emerald-600 text-base shadow-xl shadow-emerald-600/25 hover:bg-emerald-700"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  Daftar sebagai Dokter
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                </>
              ) : (
                "Daftar sebagai Dokter"
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Sudah punya akun?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </section>

        <section className="relative hidden min-h-[720px] overflow-hidden rounded-4xl px-8 py-10 lg:block">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute bottom-0 left-4 h-72 w-72 rounded-full bg-teal-100/80 blur-3xl" />

          <div className="relative">
            <div className="mb-10 grid grid-cols-[1fr_260px] items-start gap-8">
              <div className="pt-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Doctor Dashboard
                </div>
                <h2 className="text-4xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-5xl">
                  Kelola Konten Skincare dengan{" "}
                  <span className="text-emerald-700">
                    Mudah dan Terpercaya
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-zinc-600">
                  Kelola daftar skincare, rekomendasi, dan skin concern yang
                  membantu pasien mendapatkan hasil terbaik.
                </p>
              </div>

              <div className="relative h-64">
                <div className="absolute right-3 top-3 h-56 w-44 rounded-t-full bg-linear-to-b from-zinc-800 to-zinc-950" />
                <div className="absolute right-6 top-16 h-48 w-36 rounded-t-full bg-linear-to-b from-amber-100 to-orange-100 shadow-xl" />
                <div className="absolute right-8 top-8 h-24 w-32 rounded-t-full bg-zinc-900" />
                <div className="absolute right-24 top-28 h-2 w-4 rounded-full border-t border-zinc-700" />
                <div className="absolute right-12 top-28 h-2 w-4 rounded-full border-t border-zinc-700" />
                <div className="absolute bottom-0 right-0 h-24 w-56 rounded-t-4xl bg-white shadow-xl" />
                <div className="absolute bottom-14 right-20 h-14 w-16 rounded-xl bg-zinc-200" />
                <div className="absolute -right-4 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg">
                  <BadgeIcon />
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-white/80 bg-white/85 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
              <div className="grid gap-5 lg:grid-cols-[150px_1fr]">
                <aside className="border-r border-zinc-100 pr-4">
                  <div className="mb-6 flex items-center gap-3">
                    <LeafLogo />
                    <span>
                      <span className="block text-sm font-bold">
                        Skin Detection
                      </span>
                      <span className="block text-[11px] text-emerald-600">
                        Doctor Portal
                      </span>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <DashboardMenuItem title="Dashboard" active />
                    <DashboardMenuItem title="Skincare" />
                    <DashboardMenuItem title="Rekomendasi" />
                    <DashboardMenuItem title="Skin Concern" />
                    <DashboardMenuItem title="Profile" />
                    <DashboardMenuItem title="Pengaturan" />
                  </div>
                </aside>

                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-950">
                        Selamat datang kembali, Dokter
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        Kelola konten skincare yang aman, efektif, dan berbasis
                        data.
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <UserIcon />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <DashboardContentCard
                      icon={<BadgeIcon />}
                      title="Kelola Daftar Skincare"
                      description="Tambah, edit, hapus, dan kelola produk skincare yang telah disetujui sistem."
                      count="128"
                      label="Produk Aktif"
                    />
                    <DashboardContentCard
                      icon={<StethoscopeIcon />}
                      title="Kelola Rekomendasi Skincare"
                      description="Buat dan kelola rekomendasi skincare berdasarkan kondisi kulit dan kebutuhan pasien."
                      count="56"
                      label="Rekomendasi Aktif"
                    />
                    <DashboardContentCard
                      icon={<UserIcon />}
                      title="Kelola Skin Concern"
                      description="Kelola daftar skin concern seperti jerawat, flek hitam, kerutan, kemerahan, dan lainnya."
                      count="24"
                      label="Concern Aktif"
                    />
                  </div>

                  <div className="mt-5 flex items-center gap-4 rounded-2xl bg-zinc-50 p-4 text-xs leading-5 text-zinc-600">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
                      <BadgeIcon />
                    </span>
                    Semua konten yang Anda kelola harus sesuai dengan kebijakan
                    dan telah disetujui sistem untuk memastikan keamanan dan
                    kualitas bagi pasien.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
