import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/api/server-client";
import { DashboardGreeting } from "@/src/features/doctor/dashboard/components/DashboardGreeting";
import { DashboardQuickActions } from "@/src/features/doctor/dashboard/components/DashboardQuickActions";
import { DashboardRecentConversations } from "@/src/features/doctor/dashboard/components/DashboardRecentConversations";
import { StatCard } from "@/src/features/doctor/dashboard/components/StatCard";
import { getDashboardData } from "@/src/features/doctor/dashboard/lib/dashboardQuery";
import { formatNumber, formatRelativeTime } from "@/src/features/doctor/dashboard/lib/formatHelpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Dokter",
  description: "Dashboard dokter - kelola skincare dan rekomendasi",
};

type DoctorProfile = { uuid: string; role: string | null; full_name: string | null; email: string | null };

export default async function DoctorDashboardPage() {
  let doctorProfile: DoctorProfile | null = null;
  try {
    const res = await fetchApi<DoctorProfile>("/profile");
    doctorProfile = res.data ?? null;
    if (!doctorProfile || doctorProfile.role !== "doctor") redirect("/login");
  } catch { redirect("/login"); }

  const dashboard = await getDashboardData();
  const stats = dashboard?.stats ?? null;
  const conversations = dashboard?.recent_conversations ?? [];

  return (
    <div className="space-y-6">
      <DashboardGreeting fullName={doctorProfile?.full_name ?? null} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Pasien" value={formatNumber(stats?.total_patients ?? null)} accent="emerald"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />
        <StatCard title="Chat Menunggu Balasan" value={formatNumber(stats?.conversations_awaiting_reply ?? null)} accent="amber"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          href="/doctor/consultations" />
        <StatCard title="Produk Skincare" value={formatNumber(stats?.my_products ?? null)} accent="sky"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>}
          href="/doctor/skincare" />
        <StatCard title="Rekomendasi Aktif" value={formatNumber(stats?.my_recommendations ?? null)} accent="violet"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
          href="/doctor/recommendations" />
        <StatCard title="Rating Rata-rata" value={stats?.average_rating != null ? stats.average_rating.toFixed(1) : "-"}
          subtitle={stats?.total_ratings ? `${stats.total_ratings} penilaian` : undefined} accent="yellow"
          icon={<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>} />
      </div>
      <DashboardQuickActions />
      <DashboardRecentConversations conversations={conversations} formatRelativeTime={formatRelativeTime} />
    </div>
  );
}
