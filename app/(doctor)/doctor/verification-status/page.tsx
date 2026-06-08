import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DoctorLogoutButton } from "@/components/doctor/doctor-logout-button";

export const metadata: Metadata = {
  title: "Status Verifikasi | Face Skin Detection",
  description: "Status verifikasi akun dokter Anda",
};

type IconProps = {
  children: ReactNode;
  className?: string;
};

function Icon({ children, className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {children}
    </svg>
  );
}

function ClockIcon() {
  return (
    <Icon className="h-6 w-6">
      <path
        d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function CheckIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}

function DocumentIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 3v5h5M8.5 13h7M8.5 17h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon className="h-6 w-6">
      <path
        d="M12 3 5 6v5.3c0 4.4 2.9 8.4 7 9.7 4.1-1.3 7-5.3 7-9.7V6l-7-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

const verificationSteps = [
  {
    title: "Pendaftaran akun",
    description: "Data dasar dokter berhasil diterima.",
    status: "completed",
  },
  {
    title: "Upload dokumen",
    description: "Dokumen STR dan identitas profesi sudah masuk ke sistem.",
    status: "completed",
  },
  {
    title: "Review admin",
    description: "Tim admin sedang memeriksa keaslian dokumen Anda.",
    status: "current",
  },
  {
    title: "Akses dashboard",
    description: "Dashboard dokter aktif setelah verifikasi disetujui.",
    status: "pending",
  },
];

export default function VerificationStatusPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="bg-linear-to-br from-emerald-600 to-teal-600 px-8 py-10 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-100">
                  Status Verifikasi Dokter
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Akun dokter sedang ditinjau
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50">
                  Tim admin sedang memvalidasi dokumen dan data profesi Anda.
                  Setelah disetujui, Anda dapat mengakses dashboard dokter.
                </p>
              </div>

              <div className="flex w-fit items-center gap-3 rounded-2xl bg-white/15 px-5 py-4 ring-1 ring-white/20">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-emerald-600">
                  <ClockIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-100">
                    Status saat ini
                  </p>
                  <p className="text-lg font-bold">Menunggu Review</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
            <section className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Proses Verifikasi
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Anda tidak perlu melakukan apa pun saat status masih menunggu.
                Sistem akan membuka akses dashboard otomatis setelah disetujui.
              </p>

              <div className="mt-7 space-y-5">
                {verificationSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={[
                          "grid h-10 w-10 place-items-center rounded-full text-sm font-bold",
                          step.status === "completed"
                            ? "bg-emerald-600 text-white"
                            : step.status === "current"
                              ? "bg-amber-100 text-amber-700 ring-4 ring-amber-50"
                              : "bg-slate-200 text-slate-500",
                        ].join(" ")}
                      >
                        {step.status === "completed" ? <CheckIcon /> : index + 1}
                      </span>
                      {index < verificationSteps.length - 1 ? (
                        <span className="mt-2 h-12 w-px bg-slate-200" />
                      ) : null}
                    </div>

                    <div className="pb-5">
                      <h3 className="font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldIcon />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Akses belum aktif
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Untuk sementara Anda hanya dapat melihat halaman status ini.
                  Dashboard dokter akan tersedia setelah admin menyetujui
                  verifikasi.
                </p>
              </section>

              <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="text-emerald-600">
                    <DocumentIcon />
                  </div>
                  <h2 className="font-bold text-slate-900">
                    Ringkasan Dokumen
                  </h2>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-500">
                      Status dokumen
                    </span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                      Pending
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-500">
                      Estimasi review
                    </span>
                    <span className="font-bold text-slate-800">1-3 hari</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-500">
                      Diperiksa oleh
                    </span>
                    <span className="font-bold text-slate-800">Admin</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Perlu memperbarui data?
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Jika dokumen atau data profesi Anda salah, hubungi admin agar
              dapat dilakukan revisi.
            </p>
          </div>

          <DoctorLogoutButton />
        </section>
      </div>
    </main>
  );
}
