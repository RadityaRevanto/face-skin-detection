"use client";

import { Star, ShieldCheck, MessageCircleHeart } from "lucide-react";
import type { DoctorDashboardStats } from "@/features/doctor/services/doctorService";

export type DoctorDashboardReviewsProps = {
  stats?: DoctorDashboardStats | null;
  isLoading?: boolean;
};

export function DoctorDashboardReviews({
  stats,
  isLoading = false,
}: DoctorDashboardReviewsProps) {
  const avgRating =
    stats?.average_rating != null
      ? Number(stats.average_rating).toFixed(1)
      : "0.0";
  const totalRatings = stats?.total_ratings ?? 0;

  return (
    <section className="flex flex-col gap-space-lg">
      {/* Kartu Ulasan */}
      <div className="bg-surface rounded-xl p-space-lg shadow-xs border border-border/50 flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs border-b border-border/30">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
              Feedback Klinis
            </span>
            <h2 className="font-headline-md text-headline-md text-ink font-bold">
              Ulasan Pasien
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-warning font-headline-sm text-caption font-bold">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-ink tabular-nums">{avgRating}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-space-md rounded-xl bg-surface-alt animate-pulse h-28" />
        ) : totalRatings === 0 ? (
          <div className="p-space-lg rounded-xl bg-surface-alt flex flex-col items-center justify-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-ink-subtle">
              <MessageCircleHeart className="w-5 h-5" />
            </div>
            <span className="font-headline-sm text-caption text-ink font-semibold">
              Belum Ada Ulasan Pasien
            </span>
            <span className="font-caption text-caption text-ink-muted max-w-xs">
              Ulasan dan penilaian dari pasien setelah sesi teledermatologi selesai akan otomatis tercatat di sini.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-space-sm">
            <div className="p-space-md rounded-xl bg-surface-alt flex flex-col gap-2 border border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-500/10 text-role-accent-doctor flex items-center justify-center font-caption text-caption font-bold">
                    P
                  </div>
                  <span className="font-headline-sm text-caption text-ink font-semibold">
                    Pasien Teledermatologi
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-warning">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="font-caption text-caption text-ink-muted ml-1 tabular-nums font-semibold">
                    {avgRating}
                  </span>
                </div>
              </div>
              <p className="font-body-default text-caption text-ink-muted leading-relaxed">
                Total {totalRatings} ulasan terverifikasi telah diberikan oleh pasien yang berkonsultasi langsung.
              </p>
              <div className="flex items-center justify-between text-ink-subtle font-caption text-[11px] pt-1 border-t border-border/20">
                <span>Terverifikasi Konsultasi</span>
                <span className="tabular-nums">Skala 5.0</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel Info Tambahan: Ringkasan Kepatuhan & AI Accuracy */}
      <div className="bg-surface rounded-xl p-space-md shadow-xs border border-border/50 flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-role-accent-doctor flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-caption text-ink font-semibold truncate">
              Akurasi Rekomendasi Terverifikasi
            </span>
            <span className="font-caption text-caption text-ink-muted line-clamp-2">
              Formula klinis Anda disinkronkan secara aman dengan model rekomendasi AI SkinCek.
            </span>
          </div>
        </div>
        <span className="font-headline-sm text-headline-sm text-role-accent-doctor font-bold tabular-nums shrink-0">
          Aktif
        </span>
      </div>
    </section>
  );
}
