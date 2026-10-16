"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import type { DoctorVerificationDetail } from "../lib/verificationDetailTypes";

type VerificationDossierHeaderProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationDossierHeader({
  doctor,
}: VerificationDossierHeaderProps) {
  const refCode = `VRF-${doctor.id.slice(0, 8).toUpperCase()}`;

  const renderStatusBadge = () => {
    switch (doctor.rawStatus) {
      case "approved":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/15 text-success shadow-sm font-caption text-caption font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
            <span className="tracking-wide">Terverifikasi Aktif</span>
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/15 text-danger shadow-sm font-caption text-caption font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-danger"></span>
            <span className="tracking-wide">Pengajuan Ditolak</span>
          </div>
        );
      case "needs_revision":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-info/15 text-info shadow-sm font-caption text-caption font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-info"></span>
            <span className="tracking-wide">Perlu Revisi Berkas</span>
          </div>
        );
      case "pending":
      default:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/15 text-warning shadow-sm font-caption text-caption font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-warning"></span>
            </span>
            <span className="tracking-wide">Menunggu Review</span>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full py-6 px-1 flex flex-col gap-4">
      {/* Organic Contrast Glow */}
      <div className="absolute -top-10 right-20 w-80 h-40 bg-role-accent-admin/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation & Ref Code */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/doctor-verifications"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-alt shadow-sm text-ink hover:text-role-accent-admin transition-colors font-caption text-caption font-semibold border border-border/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Verifikasi</span>
        </Link>
        <span className="text-ink-subtle text-caption">•</span>
        <span className="font-eyebrow text-eyebrow uppercase text-role-accent-admin tracking-wider font-semibold">
          REF: {refCode}
        </span>
      </div>

      {/* Title & Status Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-eyebrow text-eyebrow uppercase tracking-widest text-ink-subtle font-semibold">
              VERIFIKASI TENAGA MEDIS
            </span>
            <span className="w-1 h-1 rounded-full bg-ink-subtle" />
            <span className="font-eyebrow text-eyebrow text-ink-muted">
              Diajukan: {doctor.submittedAt}
            </span>
          </div>
          <h1 className="font-display text-display text-ink font-semibold tracking-tight">
            {doctor.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {renderStatusBadge()}
          <button
            type="button"
            onClick={() => window.print()}
            title="Cetak Ringkasan Berkas"
            className="p-2.5 rounded-xl bg-surface hover:bg-surface-alt shadow-sm text-ink-muted hover:text-ink transition-colors border border-border/40 cursor-pointer"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
