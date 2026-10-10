"use client";

import { FolderKanban, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import type { RecommendationSummary } from "../lib/recommendationsTypes";

type RecommendationSummaryCardsProps = {
  summary: RecommendationSummary;
};

export function RecommendationSummaryCards({
  summary,
}: RecommendationSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
      {/* Stat Card 1: Total Aturan */}
      <div className="bg-surface rounded-2xl p-space-lg shadow-xs border border-border/50 hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-role-accent-doctor opacity-80" />
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
              Total Aturan
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-display text-ink font-bold tabular-nums">
                {summary.totalRecommendations}
              </span>
              <span className="font-headline-sm text-headline-sm text-ink-muted font-medium">
                Protokol
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 text-success font-caption text-caption border-t border-border/30">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
          <span className="font-medium text-ink-muted truncate">
            Aktif dalam inferensi otomatis engine v2.4
          </span>
        </div>
      </div>

      {/* Stat Card 2: Target Concern */}
      <div className="bg-surface rounded-2xl p-space-lg shadow-xs border border-border/50 hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-info opacity-80" />
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
              Target Concern
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-display text-ink font-bold tabular-nums">
                {summary.totalConcerns}
              </span>
              <span className="font-headline-sm text-headline-sm text-ink-muted font-medium">
                Masalah Kulit
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 font-caption text-caption border-t border-border/30">
          <span className="px-2 py-0.5 rounded-full bg-success/10 text-success font-semibold">
            100%
          </span>
          <span className="text-ink-muted truncate">
            Kelas AI model terpetakan lengkap
          </span>
        </div>
      </div>

      {/* Stat Card 3: Tahapan Perawatan */}
      <div className="bg-surface rounded-2xl p-space-lg shadow-xs border border-border/50 hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-role-accent-admin opacity-80" />
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
              Tahapan Perawatan
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-display text-ink font-bold tabular-nums">
                {summary.totalRoutineSteps}
              </span>
              <span className="font-headline-sm text-headline-sm text-ink-muted font-medium">
                Langkah Unik
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-role-accent-admin/10 text-role-accent-admin flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 text-ink-subtle font-caption text-caption border-t border-border/30 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-ink font-medium">Pembersih</span>
          <span>•</span>
          <span className="text-ink font-medium">Serum</span>
          <span>•</span>
          <span className="text-ink font-medium">Pelembap</span>
          <span>•</span>
          <span className="text-ink font-medium">Tabir Surya</span>
        </div>
      </div>
    </section>
  );
}
