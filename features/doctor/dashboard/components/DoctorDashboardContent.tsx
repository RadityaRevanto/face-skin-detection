"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  CalendarClock,
  MessageSquareDashed,
  Star,
  Users,
} from "lucide-react";

import { doctorService } from "@/features/doctor/services/doctorService";
import { profileService } from "@/features/profile/services/profileService";
import { ErrorState } from "@/components/ui/error-state";
import { StatCard } from "@/components/ui/stat-card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { DashboardRecentConversations } from "./DashboardRecentConversations";
import { formatNumber, formatRelativeTime } from "../utils/formatHelpers";

function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 19) return "Selamat sore";
  return "Selamat malam";
}

export function DoctorDashboardContent() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
  });

  const {
    data: dashboard,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["doctor", "dashboard"],
    queryFn: () => doctorService.dashboard(),
  });

  if (isError) {
    return (
      <ErrorState
        message="Gagal memuat dashboard. Statistik dan percakapan tidak dapat ditampilkan."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = (dashboard?.stats ?? null) as
    | Record<string, number | null>
    | null;
  const conversations = (dashboard?.recent_conversations ?? []) as never[];

  const fullName = profile?.full_name ?? "Dokter";
  const awaiting = stats?.conversations_awaiting_reply ?? null;
  const hasAwaiting = awaiting != null && awaiting > 0;
  const rating =
    stats?.average_rating != null ? Number(stats.average_rating).toFixed(1) : null;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Greeting hangat ala klinik — dokter disapa personal, bukan "Panel Dokter" */}
      <section className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={fullName}
            src={profile?.avatar_url ?? profile?.google_avatar_url ?? null}
            className="!h-14 !w-14 !text-lg"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--role-accent-strong)]">
              {greetingByHour()}, {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[var(--ink)]">
              Halo, dr. {fullName}
            </h1>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              {hasAwaiting ? (
                <>
                  Ada{" "}
                  <span className="font-semibold text-[var(--warning-fg)]">
                    {awaiting} chat
                  </span>{" "}
                  menunggu balasan Anda hari ini.
                </>
              ) : (
                "Semua chat pasien sudah terbalas. Siap membantu pasien baru."
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          {rating != null ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--warning-bg)] px-3 py-1.5 text-sm font-bold text-[var(--warning-fg)]">
              <Star className="h-4 w-4 fill-current" aria-hidden="true" />
              {rating}
              {stats?.total_ratings ? (
                <span className="text-xs font-medium opacity-75">
                  ({stats.total_ratings})
                </span>
              ) : null}
            </span>
          ) : null}
          {profileLoading ? null : (
            <Link
              href="/doctor/profile"
              className="text-xs font-semibold text-[var(--role-accent-strong)] transition-colors hover:text-[var(--role-accent)] hover:underline"
            >
              Kelola profil
            </Link>
          )}
        </div>
      </section>

      {/* KPI — konteks klinis: antrean chat, pasien, aktivitas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Menunggu Balasan"
          value={formatNumber(awaiting)}
          tone={hasAwaiting ? "amber" : "emerald"}
          icon={<MessageSquareDashed className="h-5 w-5" />}
          helper={hasAwaiting ? "Balas sebelum 24 jam" : "Inbox bersih"}
          href="/doctor/consultations"
        />
        <StatCard
          label="Total Pasien"
          value={formatNumber(stats?.total_patients ?? null)}
          tone="teal"
          icon={<Users className="h-5 w-5" />}
          helper="Pasien pernah konsultasi"
        />
        <StatCard
          label="Penilaian Pasien"
          value={stats?.total_ratings != null ? formatNumber(stats.total_ratings) : "-"}
          tone="coral"
          icon={<CalendarClock className="h-5 w-5" />}
          helper={rating != null ? `Rata-rata ${rating} bintang` : "Belum ada ulasan"}
        />
      </div>

      <DashboardQuickActions />
      <DashboardRecentConversations
        conversations={conversations}
        formatRelativeTime={(d) => {
          try {
            return formatRelativeTime(d);
          } catch {
            return "";
          }
        }}
      />
    </div>
  );
}