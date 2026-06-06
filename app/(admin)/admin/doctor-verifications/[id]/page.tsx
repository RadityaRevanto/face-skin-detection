import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getVerificationRequest, verificationRequests } from "../data";

export const metadata: Metadata = {
  title: "Detail Verifikasi Dokter | Face Skin Detection",
  description: "Detail review dokumen verifikasi dokter",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function ActionIcon({ type }: { type: "approve" | "reject" | "revision" }) {
  if (type === "approve") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m5 12 4 4L19 6"
        />
      </svg>
    );
  }

  if (type === "revision") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4 7h10a5 5 0 0 1 0 10H8"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m8 11-4-4 4-4"
        />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14 3v6h5M9 14h6M9 17h4"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Revision Required") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Revision Required
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
      Pending
    </span>
  );
}

function InfoBox({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-gray-50/80 p-3.5 ${className}`}>
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .replace(/^dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function generateStaticParams() {
  return verificationRequests.map((request) => ({
    id: request.id,
  }));
}

export default async function AdminDoctorVerificationDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const doctor = getVerificationRequest(id);

  if (!doctor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!">
      <div className="flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!">
          <DashboardHeader
            title="Verification Detail"
            description="Review doctor document before approval"
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <Link
                    href="/admin/doctor-verifications"
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Back to verification list
                  </Link>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                    Verifikasi Detail Dokter
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Review detail data dokter, dokumen verifikasi, dan tentukan
                    status akun.
                  </p>
                </div>
                <StatusBadge status={doctor.status} />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      Identitas Dokter
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-400">
                      Nama, email, STR, dan informasi umum dokter.
                    </p>
                  </div>
                  <div className="space-y-5 p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-xl font-bold text-emerald-600 shadow-sm">
                        {getInitials(doctor.name)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {doctor.name}
                        </h4>
                        <p className="text-sm text-gray-500">{doctor.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InfoBox
                        label="Nomor STR / Identitas"
                        value={doctor.identity}
                      />
                      <InfoBox
                        label="Spesialisasi"
                        value={doctor.specialization}
                      />
                    </div>

                    <InfoBox
                      label="Dokumen Verifikasi"
                      value={doctor.document}
                    />

                    <InfoBox
                      label="Tanggal Pengajuan"
                      value={doctor.submittedAt}
                    />
                  </div>
                </Card>

                <div className="flex flex-col gap-6">
                  <Card className="overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!">
                    <div className="border-b border-gray-100 px-6 py-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Informasi Kontak
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-400">
                        Kontak dan lokasi dokter yang mengajukan verifikasi.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                      <InfoBox label="Email" value={doctor.email} />
                      <InfoBox label="No. Telepon" value={doctor.phone} />
                      <InfoBox
                        label="Domisili"
                        value={doctor.address}
                        className="sm:col-span-2"
                      />
                    </div>
                  </Card>

                  <Card className="overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!">
                    <div className="border-b border-gray-100 px-6 py-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Dokumen & Status
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-400">
                        Buka dokumen sebelum menentukan hasil verifikasi.
                      </p>
                    </div>
                    <div className="space-y-4 p-6">
                     
                      <div className="flex items-center gap-4 rounded-xl bg-emerald-50/70 p-3.5 text-emerald-700">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                          <DocumentIcon />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {doctor.document}
                          </p>
                          <p className="text-xs text-emerald-600">
                            File preview placeholder
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-emerald-100! bg-white! text-emerald-700! hover:bg-emerald-50!"
                      >
                        View Document
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <Card className="overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Keputusan Verifikasi
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-400">
                    Tulis catatan admin lalu tentukan status verifikasi dokter.
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <label
                      htmlFor="review-note"
                      className="mb-2 block text-xs font-semibold text-gray-400"
                    >
                      Catatan Admin
                    </label>
                    <textarea
                      id="review-note"
                      name="review-note"
                      rows={3}
                      placeholder="Contoh: Dokumen STR tidak terbaca jelas, mohon upload ulang dokumen dengan kualitas yang lebih baik."
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm leading-6 text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-12 rounded-xl bg-emerald-50! text-emerald-700! hover:bg-emerald-100!"
                    >
                      <ActionIcon type="approve" />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-12 rounded-xl bg-amber-50! text-amber-700! hover:bg-amber-100!"
                    >
                      <ActionIcon type="revision" />
                      Request Revision
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-12 rounded-xl bg-rose-50! text-rose-600! hover:bg-rose-100!"
                    >
                      <ActionIcon type="reject" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
