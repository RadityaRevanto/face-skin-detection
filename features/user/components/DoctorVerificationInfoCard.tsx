"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Lock } from "lucide-react";

import { doctorVerificationService } from "@/features/doctor/services/doctorVerificationService";

type VerificationInfo = {
  uuid: string;
  str_number: string | null;
  title?: string | null;
  specialization: string | null;
  sub_specialization?: string | null;
  experience_years?: number | null;
  alma_mater?: string | null;
  practice_locations?: string[] | null;
  professional_organizations?: string[] | null;
  verification_status: string | null;
};

/**
 * Info profesional dokter (read-only) di halaman pengaturan profil.
 * Sumber: GET /api/doctor/verifications (data verifikasi milik sendiri).
 * Data hanya bisa diubah melalui alur verifikasi resmi — di sini
 * ditampilkan apa adanya, tidak ada input.
 */
export function DoctorVerificationInfoCard() {
  const [info, setInfo] = useState<VerificationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    doctorVerificationService
      .show()
      .then((data) => {
        if (data) setInfo(data as VerificationInfo);
      })
      .catch((err) => console.error("Gagal memuat verifikasi:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  // Belum pernah mengajukan verifikasi (404) — tampilkan panduan singkat.
  if (!info) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BadgeCheck size={18} className="text-slate-400" />
          <h3 className="text-lg font-bold text-zinc-900">Data Profesional</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Data profesional (STR, pengalaman, alma mater, lokasi praktik) akan
          tampil di sini setelah verifikasi Anda diajukan dan disetujui admin.
          Belum ada pengajuan verifikasi pada akun ini.
        </p>
      </div>
    );
  }

  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "Pengalaman", value: info.experience_years != null ? `${info.experience_years} tahun` : null },
    { label: "STR", value: info.str_number },
    { label: "Alma Mater", value: info.alma_mater },
    {
      label: "Organisasi",
      value: info.professional_organizations?.length
        ? info.professional_organizations.join(", ")
        : null,
    },
    {
      label: "Lokasi Praktik",
      value: info.practice_locations?.length
        ? info.practice_locations.join(", ")
        : null,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <BadgeCheck size={18} className="text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Data Profesional</h3>
            <p className="text-xs text-zinc-500">
              {[info.specialization, info.sub_specialization].filter(Boolean).join(" — ") || "Spesialisasi belum diisi"}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
          <Lock size={12} />
          Read-only — diubah lewat verifikasi
        </span>
      </div>

      <div className="mt-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-start sm:gap-6"
          >
            <span className="w-40 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400">
              {row.label}
            </span>
            <span className="min-w-0 text-sm font-medium text-slate-700">
              {row.value ?? "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
