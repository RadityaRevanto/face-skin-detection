"use client";

import { useQuery } from "@tanstack/react-query";

import { doctorService } from "@/features/doctor/services/doctorService";
import { profileService } from "@/features/profile/services/profileService";
import { ErrorState } from "@/components/ui/error-state";
import { DoctorDashboardHeader } from "./DoctorDashboardHeader";
import { DoctorDashboardStatGrid } from "./DoctorDashboardStatGrid";
import { DoctorDashboardQuickActions } from "./DoctorDashboardQuickActions";
import { DoctorDashboardConsultations } from "./DoctorDashboardConsultations";
import { DoctorDashboardReviews } from "./DoctorDashboardReviews";

export function DoctorDashboardContent() {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
  });

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["doctor", "dashboard"],
    queryFn: () => doctorService.dashboard(),
  });

  if (isError) {
    return (
      <ErrorState
        message="Gagal memuat dashboard dokter. Statistik dan percakapan tidak dapat ditampilkan."
        onRetry={() => refetch()}
      />
    );
  }

  const fullName = profile?.full_name ?? "Dokter";
  const avatarUrl = profile?.avatar_url ?? profile?.google_avatar_url ?? null;
  const stats = dashboard?.stats ?? null;
  const conversations = dashboard?.recent_conversations ?? [];
  const awaitingCount = stats?.conversations_awaiting_reply ?? 0;

  return (
    <div className="space-y-space-lg">
      {/* Header Personal Dokter */}
      <DoctorDashboardHeader
        fullName={fullName}
        avatarUrl={avatarUrl}
        awaitingCount={awaitingCount}
      />

      {/* Grid 4 Kartu Metrik Klinis */}
      <DoctorDashboardStatGrid
        stats={stats}
        isLoading={isDashboardLoading || isProfileLoading}
      />

      {/* 2 Banner Aksi Cepat */}
      <DoctorDashboardQuickActions />

      {/* Tata Letak Dua Kolom: Konsultasi Terkini (7) & Feedback Ulasan (5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-7">
          <DoctorDashboardConsultations
            conversations={conversations}
            isLoading={isDashboardLoading}
          />
        </div>

        <div className="lg:col-span-5">
          <DoctorDashboardReviews
            stats={stats}
            isLoading={isDashboardLoading}
          />
        </div>
      </div>
    </div>
  );
}
