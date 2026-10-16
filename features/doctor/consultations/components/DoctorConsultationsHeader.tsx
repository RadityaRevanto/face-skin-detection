"use client";

import { RefreshCw, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import type { DoctorConsultationKpi } from "../types";

type DoctorConsultationsHeaderProps = {
  kpis: DoctorConsultationKpi;
  isLoading: boolean;
  onRefresh: () => void;
};

export function DoctorConsultationsHeader({
  kpis,
  isLoading,
  onRefresh,
}: DoctorConsultationsHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Title & Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-role-accent-doctor animate-pulse" />
            <span className="font-eyebrow text-eyebrow uppercase font-bold text-role-accent-doctor tracking-wider">
              TELEKONSULTASI PASIEN
            </span>
            <span className="text-ink-subtle text-caption">•</span>
            <span className="font-caption text-caption text-ink-muted">
              Modul Konsultasi #DOC-CNS-01
            </span>
          </div>
          <h1 className="font-display text-display text-ink font-semibold tracking-tight">
            Konsultasi Pasien
          </h1>
          <p className="font-body-default text-body-default text-ink-muted mt-1 max-w-2xl">
            Kelola percakapan telemedisin interaktif, evaluasi riwayat analisis pemindaian kulit AI,
            dan berikan instruksi perawatan klinis secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-alt shadow-sm text-ink-muted hover:text-ink transition-colors font-caption text-caption font-semibold border border-border/50 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Segarkan Antrean</span>
          </button>
        </div>
      </div>

      {/* 2. Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Total Pasien */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle font-semibold">
              Total Antrean Pasien
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {kpis.total} Sesi
            </span>
            <span className="font-caption text-caption text-ink-muted mt-0.5">
              Pasien terhubung ke klinik
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center text-ink-subtle">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Perlu Respons */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-warning font-semibold">
              Perlu Balasan Medis
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {kpis.unread} Pasien
            </span>
            <span className="font-caption text-caption text-ink-muted mt-0.5">
              Menunggu evaluasi dokter
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Selesai Ditanggapi */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-success font-semibold">
              Selesai Ditanggapi
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {kpis.done} Sesi
            </span>
            <span className="font-caption text-caption text-ink-muted mt-0.5">
              Instruksi resep terkirim
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
