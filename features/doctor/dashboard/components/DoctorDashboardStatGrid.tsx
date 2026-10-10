"use client";

import { Star, MessageSquare, Users, FlaskConical } from "lucide-react";
import type { DoctorDashboardStats } from "@/features/doctor/services/doctorService";

export type DoctorDashboardStatGridProps = {
  stats?: DoctorDashboardStats | null;
  isLoading?: boolean;
};

export function DoctorDashboardStatGrid({
  stats,
  isLoading = false,
}: DoctorDashboardStatGridProps) {
  const rating =
    stats?.average_rating != null
      ? Number(stats.average_rating).toFixed(1)
      : "0.0";
  const totalRatings = stats?.total_ratings ?? 0;
  const awaiting = stats?.conversations_awaiting_reply ?? 0;
  const totalPatients = stats?.total_patients ?? 0;
  const productsCount = stats?.my_products ?? 0;
  const recommendationsCount = stats?.my_recommendations ?? 0;

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface p-space-md rounded-xl shadow-xs border border-border/50 h-32 animate-pulse flex flex-col justify-between"
          >
            <div className="w-24 h-4 bg-surface-container rounded" />
            <div className="w-16 h-8 bg-surface-container rounded" />
            <div className="w-32 h-3 bg-surface-container rounded" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* Stat 1: Rata-Rata Rating */}
      <div className="bg-surface p-space-md rounded-xl shadow-xs border border-border/50 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Rata-Rata Rating
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-warning">
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="mt-space-sm">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-display text-ink font-bold tabular-nums">
              {rating}
            </span>
            <span className="font-caption text-caption text-ink-muted font-medium">
              / 5.0
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-caption text-caption text-ink-muted">
              {totalRatings} ulasan pasien
            </span>
            <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-emerald-500/10 text-success font-semibold">
              Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* Stat 2: Menunggu Respon */}
      <div className="bg-surface p-space-md rounded-xl shadow-xs border border-border/50 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Pesan Menunggu
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-success">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-space-sm">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-display text-ink font-bold tabular-nums">
              {awaiting}
            </span>
            <span className="font-caption text-caption text-ink-muted font-medium">
              Sesi
            </span>
          </div>
          <div className="mt-1">
            {awaiting > 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-danger/10 text-danger font-caption text-caption font-semibold">
                {awaiting} butuh respon
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-success font-caption text-caption font-semibold">
                Semua pesan terbalas
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stat 3: Pasien Aktif */}
      <div className="bg-surface p-space-md rounded-xl shadow-xs border border-border/50 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Total Pasien
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-role-accent-doctor">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-space-sm">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-display text-ink font-bold tabular-nums">
              {totalPatients}
            </span>
            <span className="font-caption text-caption text-ink-muted font-medium">
              Pasien
            </span>
          </div>
          <div className="mt-1">
            <span className="font-caption text-caption text-ink-muted">
              Terhubung di teledermatologi
            </span>
          </div>
        </div>
      </div>

      {/* Stat 4: Katalog Produk Klinik */}
      <div className="bg-surface p-space-md rounded-xl shadow-xs border border-border/50 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Katalog Produk Klinik
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-role-accent-admin">
            <FlaskConical className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-space-sm">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-display text-ink font-bold tabular-nums">
              {productsCount}
            </span>
            <span className="font-caption text-caption text-ink-muted font-medium">
              Formula
            </span>
          </div>
          <div className="mt-1">
            <span className="font-caption text-caption text-ink-muted">
              {recommendationsCount} aturan rekomendasi aktif
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
