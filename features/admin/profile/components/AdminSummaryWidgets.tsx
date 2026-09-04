import {
  GradientStatCard,
  type GradientStatVariant,
} from "@/components/ui/gradient-stat-card";

import type { AdminProfileData } from "../types";

function UsersWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[88px] w-[88px]">
      <path
        d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function DoctorWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[88px] w-[88px]">
      <path
        d="M7 4v5a5 5 0 0 0 10 0V4M7 4H5M17 4h2M12 14v2a4 4 0 0 0 8 0v-1M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function ShieldWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[88px] w-[88px]">
      <path
        d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export function AdminSummaryWidgets({ summary }: { summary: AdminProfileData["summary"] }) {
  const widgets: {
    label: string;
    value: number;
    href: string;
    variant: GradientStatVariant;
    icon: React.ReactNode;
    helper?: string;
  }[] = [
    {
      label: "Total Pengguna",
      value: summary.total_users,
      href: "/admin/users",
      variant: "emerald",
      icon: <UsersWatermark />,
    },
    {
      label: "Total Dokter",
      value: summary.total_doctors,
      href: "/admin/doctors",
      variant: "sky",
      icon: <DoctorWatermark />,
    },
    {
      label: "Verifikasi Menunggu",
      value: summary.pending_doctor_verifications,
      href: "/admin/doctor-verifications",
      variant: "amber",
      icon: <ShieldWatermark />,
      helper:
        summary.pending_doctor_verifications > 0 ? "Perlu review" : "Semua sudah diproses",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
      {widgets.map((item) => (
        <GradientStatCard
          key={item.label}
          label={item.label}
          value={String(item.value)}
          variant={item.variant}
          href={item.href}
          helper={item.helper}
          icon={item.icon}
          className="h-full"
        />
      ))}
    </section>
  );
}
