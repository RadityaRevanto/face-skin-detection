"use client";

import { useQuery } from "@tanstack/react-query";

import { doctorService } from "@/features/doctor/services/doctorService";
import { profileService } from "@/features/profile/services/profileService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ErrorState } from "@/components/ui/error-state";

import { DashboardGreeting } from "./DashboardGreeting";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { DashboardRecentConversations } from "./DashboardRecentConversations";
import { StatCard } from "@/components/ui/stat-card";
import { formatNumber, formatRelativeTime } from "../utils/formatHelpers";

export function DoctorDashboardContent() {
  const { currentUser } = useAuth();

  const { data: profileName } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
    select: (profile) => profile.full_name,
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

  const fullName =
    profileName ?? (currentUser?.full_name ?? null);

  return (
    <div className="space-y-6">
      <DashboardGreeting fullName={fullName} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Chat Menunggu Balasan" value={formatNumber(stats?.conversations_awaiting_reply ?? null)}
          href="/doctor/consultations" />
        <StatCard label="Total Pasien" value={formatNumber(stats?.total_patients ?? null)} />
        <StatCard label="Rating Rata-rata" value={stats?.average_rating != null ? Number(stats.average_rating).toFixed(1) : "-"}
          helper={stats?.total_ratings ? `${stats.total_ratings} penilaian` : undefined} />
      </div>
      <DashboardQuickActions />
      <DashboardRecentConversations conversations={conversations} formatRelativeTime={formatRelativeTime} />
    </div>
  );
}
