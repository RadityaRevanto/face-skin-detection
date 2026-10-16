"use client";

import { Hourglass, CheckCircle2 } from "lucide-react";
import type { DoctorVerificationStats } from "../lib/doctorVerificationTypes";

type VerificationHeaderStripProps = {
  stats: DoctorVerificationStats;
};

export function VerificationHeaderStrip({ stats }: VerificationHeaderStripProps) {
  return (
    <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-border">
      <div className="flex flex-col max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-eyebrow text-eyebrow text-role-accent-admin uppercase tracking-wider font-semibold">
            VERIFIKASI TENAGA MEDIS
          </span>
        </div>
        <h1 className="font-display text-display text-ink font-semibold tracking-tight">
          Verifikasi Dokter
        </h1>
        <p className="font-body-default text-body-default text-ink-muted mt-1.5 leading-relaxed">
          Tinjau dan validasi izin SIP/STR dokter spesialis kulit yang mengajukan izin praktik klinis di SkinCek. Pastikan nomor lisensi aktif di Konsil Kedokteran Indonesia (KKI).
        </p>
      </div>

      {/* Live Telemetry Mini Metrics matching index7.html */}
      <div className="flex items-center gap-3 bg-surface p-2 rounded-2xl shadow-sm border border-border/50 shrink-0">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-alt border border-border/40">
          <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
            <Hourglass className="w-4 h-4 text-warning" />
          </div>
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Antrean Validasi
            </span>
            <span className="font-headline-sm text-headline-sm text-ink font-semibold">
              {stats.pendingCount} Berkas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-alt border border-border/40">
          <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Lolos Bulan Ini
            </span>
            <span className="font-headline-sm text-headline-sm text-ink font-semibold">
              {stats.approvedCount} Dokter
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
