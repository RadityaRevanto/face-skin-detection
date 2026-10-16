"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";

type RecommendationFormHeaderProps = {
  mode: "create" | "edit";
};

export function RecommendationFormHeader({
  mode,
}: RecommendationFormHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Back Navigation */}
      <Link
        href={ROUTES.DOCTOR.RECOMMENDATIONS}
        className="inline-flex items-center gap-1.5 text-role-accent-doctor hover:opacity-85 transition-colors group w-fit font-caption text-caption font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Kembali ke Aturan Rekomendasi</span>
      </Link>

      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-eyebrow text-eyebrow text-role-accent-doctor font-bold uppercase tracking-wider">
            Protokol Inferensi Rekomendasi
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-role-accent-doctor/10 text-role-accent-doctor">
            Versi AI v2.4
          </span>
        </div>
        <h1 className="font-display text-display text-ink font-bold tracking-tight">
          {mode === "edit"
            ? "Edit Aturan Rekomendasi Klinis"
            : "Buat Aturan Rekomendasi Klinis"}
        </h1>
        <p className="font-body-default text-body-default text-ink-muted">
          Tentukan formula produk dan edukasi pemakaian yang akan otomatis disarankan sistem saat concern terdeteksi.
        </p>
      </div>

      {/* Clinical Context Banner */}
      <div className="bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between shadow-xs border border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-caption text-caption text-ink font-semibold">
              Inference Engine Integration
            </span>
            <span className="font-caption text-[11px] text-ink-subtle">
              Aturan akan disematkan pada evaluasi scan dermatologis SkinCek Neural Core
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full font-eyebrow text-eyebrow text-success bg-success/10 font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span>Real-time Sync</span>
        </span>
      </div>
    </div>
  );
}
