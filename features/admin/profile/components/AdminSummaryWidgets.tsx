import { StatCard } from "@/components/ui/stat-card";

import type { AdminProfileData } from "../types";

export function AdminSummaryWidgets({ summary }: { summary: AdminProfileData["summary"] }) {
  const widgets = [
    {
      label: "Total Pengguna",
      value: summary.total_users,
      href: "/admin/users",
    },
    {
      label: "Total Dokter",
      value: summary.total_doctors,
      href: "/admin/doctors",
    },
    {
      label: "Verifikasi Menunggu",
      value: summary.pending_doctor_verifications,
      href: "/admin/doctor-verifications",
      helper:
        summary.pending_doctor_verifications > 0 ? "Perlu review" : "Semua sudah diproses",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {widgets.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={String(item.value)}
          href={item.href}
          helper={item.helper}
          className="h-full"
        />
      ))}
    </section>
  );
}
