import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/api/server-client";
import { getDashboardData } from "./_lib/dashboard-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Dokter | Face Skin Detection",
  description: "Dashboard dokter - kelola skincare dan rekomendasi",
};

type DoctorProfile = {
  uuid: string;
  role: string | null;
  full_name: string | null;
  email: string | null;
};

function formatNumber(value: number | null): string {
  if (value == null) return "-";
  return value.toLocaleString("id-ID");
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin}m lalu`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}j lalu`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}h lalu`;
  } catch {
    return "";
  }
}

export default async function DoctorDashboardPage() {
  let doctorProfile: DoctorProfile | null = null;

  try {
    const res = await fetchApi<DoctorProfile>("/profile");
    doctorProfile = res.data ?? null;
    if (!doctorProfile || doctorProfile.role !== "doctor") {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  const dashboard = await getDashboardData();
  const stats = dashboard?.stats ?? null;
  const conversations = dashboard?.recent_conversations ?? [];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
          Selamat datang, {doctorProfile?.full_name ?? "Dokter"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Kelola produk skincare, rekomendasi, dan pantau aktivitas konsultasi
          pengguna dari satu tempat.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Pasien"
          value={formatNumber(stats?.total_patients ?? null)}
          accent="emerald"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          title="Chat Menunggu Balasan"
          value={formatNumber(stats?.conversations_awaiting_reply ?? null)}
          accent="amber"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          href="/doctor/consultations"
        />
        <StatCard
          title="Produk Skincare"
          value={formatNumber(stats?.my_products ?? null)}
          accent="sky"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          }
          href="/doctor/skincare"
        />
        <StatCard
          title="Rekomendasi Aktif"
          value={formatNumber(stats?.my_recommendations ?? null)}
          accent="violet"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          }
          href="/doctor/recommendations"
        />
        <StatCard
          title="Rating Rata-rata"
          value={stats?.average_rating != null ? stats.average_rating.toFixed(1) : "-"}
          subtitle={stats?.total_ratings ? `${stats.total_ratings} penilaian` : undefined}
          accent="yellow"
          icon={
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Akses Cepat
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionLink
            href="/doctor/consultations"
            label="Konsultasi"
            description="Balas chat pengguna"
          />
          <QuickActionLink
            href="/doctor/skincare"
            label="Produk Skincare"
            description="Kelola produk"
          />
          <QuickActionLink
            href="/doctor/recommendations"
            label="Rekomendasi"
            description="Atur rule rekomendasi"
          />
          <QuickActionLink
            href="/doctor/skin-concerns"
            label="Skin Concern"
            description="Lihat data kondisi kulit"
          />
        </div>
      </section>

      {/* Recent Conversations */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Percakapan Terbaru
          </h2>
          <Link
            href="/doctor/consultations"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Lihat semua
          </Link>
        </div>

        {conversations.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Belum ada percakapan.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => (
              <Link
                key={conv.uuid}
                href={`/doctor/consultations?conversation=${conv.uuid}`}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-slate-50 -mx-3 px-3 rounded-xl"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {(conv.user?.full_name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {conv.user?.full_name ?? "Pengguna"}
                    </span>
                    {conv.message_count != null && (
                      <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        {conv.message_count} pesan
                      </span>
                    )}
                  </div>
                  {conv.last_message?.content && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {conv.last_message.sender_role === "doctor" ? "Anda: " : ""}
                      {conv.last_message.content}
                    </p>
                  )}
                </div>
                <span className="flex-shrink-0 text-[11px] font-medium text-slate-400">
                  {formatRelativeTime(conv.last_message?.created_at ?? null)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Small components ---------- */

const ACCENT_MAP: Record<string, { bg: string; text: string; iconBg: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100 text-emerald-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   iconBg: "bg-amber-100 text-amber-600" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     iconBg: "bg-sky-100 text-sky-600" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  iconBg: "bg-violet-100 text-violet-600" },
  yellow:  { bg: "bg-yellow-50",  text: "text-yellow-700",  iconBg: "bg-yellow-100 text-yellow-600" },
};

function StatCard({
  title,
  value,
  subtitle,
  accent = "emerald",
  icon,
  href,
}: {
  title: string;
  value: string;
  subtitle?: string;
  accent?: string;
  icon: React.ReactNode;
  href?: string;
}) {
  const colors = ACCENT_MAP[accent] ?? ACCENT_MAP.emerald;

  if (href) {
    return (
      <Link
        href={href}
        className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
            <p className={`mt-2 text-2xl font-bold ${colors.text}`}>{value}</p>
            {subtitle && <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>}
          </div>
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${colors.iconBg}`}>{icon}</div>
        </div>
      </Link>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className={`mt-2 text-2xl font-bold ${colors.text}`}>{value}</p>
          {subtitle && <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>}
        </div>
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${colors.iconBg}`}>{icon}</div>
      </div>
    </div>
  );
}

function QuickActionLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition-all hover:border-emerald-200 hover:bg-emerald-50"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-700 group-hover:text-emerald-700">{label}</p>
        <p className="truncate text-[11px] text-slate-400">{description}</p>
      </div>
    </Link>
  );
}
