"use client";

import { FlaskConical, ShieldAlert, Layers, CheckCircle2 } from "lucide-react";
import type { SkincareSummary } from "../types";

export type SkincareSummaryCardsProps = {
  summary: SkincareSummary;
};

export function SkincareSummaryCards({ summary }: SkincareSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
      {/* Card 1: Total Produk */}
      <div className="bg-surface p-space-lg rounded-xl shadow-xs border border-border/50 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider font-semibold">
              Total Produk
            </span>
            <span className="font-display text-display text-ink mt-1 tabular-nums font-bold">
              {summary.totalProducts} Formula
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-role-accent-doctor/10 flex items-center justify-center text-role-accent-doctor shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-ink-muted bg-surface-alt px-3 py-2 rounded-lg">
          <span className="font-caption text-caption flex items-center gap-1.5 text-success font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Formula Klinik
          </span>
          <span className="font-caption text-caption text-ink-subtle">
            Terverifikasi
          </span>
        </div>
      </div>

      {/* Card 2: Target Concern */}
      <div className="bg-surface p-space-lg rounded-xl shadow-xs border border-border/50 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider font-semibold">
              Target Concern
            </span>
            <span className="font-display text-display text-ink mt-1 tabular-nums font-bold">
              {summary.totalConcerns} Kondisi Kulit
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-info shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-ink-muted bg-surface-alt px-3 py-2 rounded-lg">
          <span className="font-caption text-caption text-ink-muted truncate font-medium">
            Jerawat, Flek, Barrier, Pori
          </span>
          <span className="font-caption text-caption text-role-accent-doctor font-semibold">
            Terkover
          </span>
        </div>
      </div>

      {/* Card 3: Kelompok Formula */}
      <div className="bg-surface p-space-lg rounded-xl shadow-xs border border-border/50 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider font-semibold">
              Kelompok Formula
            </span>
            <span className="font-display text-display text-ink mt-1 tabular-nums font-bold">
              {summary.totalCategories} Kategori
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-role-accent-admin shrink-0">
            <Layers className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-ink-muted bg-surface-alt px-3 py-2 rounded-lg">
          <span className="font-caption text-caption text-ink-muted truncate font-medium">
            Cleanser, Serum, Moisturizer
          </span>
          <span className="font-caption text-caption text-role-accent-doctor font-semibold">
            Lengkap
          </span>
        </div>
      </div>
    </div>
  );
}
