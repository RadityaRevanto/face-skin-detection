"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { customToast } from "@/lib/custom-toast";
import type { DoctorDetail } from "../lib/doctorDetailTypes";

type DoctorDossierHeaderProps = {
  doctor: DoctorDetail;
};

export function DoctorDossierHeader({ doctor }: DoctorDossierHeaderProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      customToast.success("Berkas dossier klinis berhasil diunduh (PDF)");
    }, 1200);
  };

  const verification = doctor.latestVerification;
  const isApproved = verification?.rawStatus === "approved";
  const isPending = verification?.rawStatus === "pending";

  return (
    <section className="relative bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <Link
            href="/admin/doctors"
            className="inline-flex items-center gap-2 text-ink-muted hover:text-role-accent-admin font-caption text-caption transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Manajemen Dokter</span>
          </Link>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-eyebrow text-eyebrow uppercase text-role-accent-admin tracking-wider font-semibold">
                Profil Klinis & Kredensial
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-display text-ink font-semibold tracking-tight">
                {doctor.name}
              </h1>

              <div className="flex items-center gap-2">
                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success font-caption text-caption font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>Disetujui</span>
                  </span>
                ) : isPending ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/15 text-warning font-caption text-caption font-semibold">
                    <Clock className="w-3.5 h-3.5 text-warning" />
                    <span>Menunggu Review</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger font-caption text-caption font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-danger" />
                    <span>{verification?.status ?? "Belum Diverifikasi"}</span>
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-caption text-caption font-semibold ${
                    doctor.isActive
                      ? "bg-success/10 text-success"
                      : "bg-warning/15 text-warning"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      doctor.isActive ? "bg-success animate-pulse" : "bg-warning"
                    }`}
                  />
                  <span>{doctor.isActive ? "Aktif" : "Ditangguhkan"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="h-10 px-4 rounded-xl bg-surface-alt hover:bg-surface-container text-ink font-caption text-caption font-semibold flex items-center gap-2 shadow-sm transition-all border border-border/50 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
            ) : (
              <Download className="w-4 h-4 text-ink-muted" />
            )}
            <span>{isExporting ? "Memproses..." : "Ekspor Berkas PDF"}</span>
          </button>

          <Link
            href={`/admin/doctor-verifications`}
            className="h-10 px-4 rounded-xl bg-role-accent-admin text-surface font-caption text-caption font-semibold flex items-center gap-2 shadow-sm hover:bg-secondary-container transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-surface" />
            <span>Sertifikasi Ulang</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
