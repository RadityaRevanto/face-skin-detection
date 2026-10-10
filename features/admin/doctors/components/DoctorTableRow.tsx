"use client";

import Link from "next/link";
import { Stethoscope, Award, ChevronRight } from "lucide-react";
import type { DoctorRow } from "../lib/doctorsTypes";

type DoctorTableRowProps = {
  doctor: DoctorRow;
};

export function DoctorTableRow({ doctor }: DoctorTableRowProps) {
  const initials = doctor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const renderVerificationBadge = (status: DoctorRow["verificationStatus"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>Disetujui</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/15 text-warning font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            <span>Menunggu</span>
          </span>
        );
      case "needs_revision":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-info/10 text-info font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-info" />
            <span>Perlu Revisi</span>
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-ink-muted font-caption text-caption">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <tr className="hover:bg-surface-alt/70 transition-colors group border-b border-border/40">
      {/* 1. Dokter Info */}
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {doctor.avatarUrl ? (
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-surface"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center font-headline-sm font-semibold shadow-sm ring-2 ring-surface">
                {initials || "DR"}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-surface ${
                doctor.isActive ? "bg-success" : "bg-warning"
              }`}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/admin/doctors/detail?id=${encodeURIComponent(doctor.id)}`}
              className="font-headline-sm text-headline-sm text-ink font-semibold group-hover:text-role-accent-admin transition-colors truncate"
            >
              {doctor.name}
            </Link>
            <span className="font-caption text-caption text-ink-subtle truncate">
              {doctor.email}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Spesialisasi */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-ink-muted">
          <Stethoscope className="w-4 h-4 text-role-accent-doctor shrink-0" />
          <span className="font-body-default text-body-default font-medium text-ink">
            {doctor.specialization}
          </span>
        </div>
      </td>

      {/* 3. Nomor STR */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-alt text-ink font-mono text-[13px] font-medium tracking-tight border border-border/50">
          <Award className="w-3.5 h-3.5 text-ink-subtle" />
          <span>{doctor.strNumber}</span>
        </div>
      </td>

      {/* 4. Status Verifikasi */}
      <td className="py-4 px-4 whitespace-nowrap">
        {renderVerificationBadge(doctor.verificationStatus)}
      </td>

      {/* 5. Status Akun */}
      <td className="py-4 px-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption text-caption font-semibold ${
            doctor.isActive
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}
        >
          {doctor.isActive ? "Aktif" : "Ditangguhkan"}
        </span>
      </td>

      {/* 6. Tanggal Terdaftar */}
      <td className="py-4 px-4 whitespace-nowrap text-ink-muted font-body-default text-body-default">
        {doctor.createdAt}
      </td>

      {/* 7. Aksi */}
      <td className="py-4 pr-6 pl-4 whitespace-nowrap text-right">
        <Link
          href={`/admin/doctors/detail?id=${encodeURIComponent(doctor.id)}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-role-accent-admin hover:bg-surface-container-high transition-colors font-caption text-caption font-semibold"
        >
          <span>Lihat Detail</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
}
