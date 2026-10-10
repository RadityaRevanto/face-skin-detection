"use client";

import {
  Users,
  Stethoscope,
  ScanLine,
  Cpu,
  UserPlus,
  Crown,
  Banknote,
  TrendingUp,
} from "lucide-react";

import { formatIDR } from "../lib/adminDashboardFormat";

type AdminDashboardStatGridProps = {
  stats: {
    total_users: number;
    total_doctors: number;
    new_users_this_week: number;
    total_scans: number;
    scans_today: number;
    active_pro_subscriptions: number;
    monthly_revenue: number;
  };
};

export function AdminDashboardStatGrid({ stats }: AdminDashboardStatGridProps) {
  const cards = [
    {
      title: "Total Pengguna",
      value: stats.total_users.toLocaleString("id-ID"),
      icon: Users,
      iconColor: "text-role-accent-admin",
      subText: "+12% bulan ini",
      subIcon: TrendingUp,
      subColor: "text-success",
    },
    {
      title: "Dokter Terdaftar",
      value: stats.total_doctors.toLocaleString("id-ID"),
      icon: Stethoscope,
      iconColor: "text-role-accent-doctor",
      subText: `${stats.total_doctors} terdaftar`,
      dotColor: "bg-role-accent-doctor",
    },
    {
      title: "Scan Hari Ini",
      value: stats.scans_today.toLocaleString("id-ID"),
      icon: ScanLine,
      iconColor: "text-role-accent-admin",
      subText: "Rata-rata harian aktif",
    },
    {
      title: "Total Scan AI",
      value: stats.total_scans.toLocaleString("id-ID"),
      icon: Cpu,
      iconColor: "text-role-accent-admin",
      subText: "Akumulasi model AI",
    },
    {
      title: "User Baru",
      value: stats.new_users_this_week.toLocaleString("id-ID"),
      icon: UserPlus,
      iconColor: "text-role-accent-admin",
      subText: "+8% vs minggu lalu",
      subIcon: TrendingUp,
      subColor: "text-success",
    },
    {
      title: "Langganan Pro",
      value: stats.active_pro_subscriptions.toLocaleString("id-ID"),
      icon: Crown,
      iconColor: "text-secondary",
      subText: "Tingkat retensi 94,2%",
      dotColor: "bg-secondary",
    },
    {
      title: "Pendapatan",
      value: formatIDR(stats.monthly_revenue),
      icon: Banknote,
      iconColor: "text-success",
      subText: "+16.4% target",
      subIcon: TrendingUp,
      subColor: "text-success",
      isMoney: true,
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const SubIcon = card.subIcon;

          return (
            <div
              key={card.title}
              className="relative flex flex-col justify-between p-5 rounded-2xl bg-surface shadow-sm hover:shadow-md transition-shadow border border-border/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div
                  className={`font-semibold text-ink tracking-tight font-mono ${
                    card.isMoney
                      ? "font-headline-sm text-headline-sm text-[15px]"
                      : "font-headline-lg text-headline-lg"
                  }`}
                >
                  {card.value}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1 font-caption text-caption ${
                    card.subColor || "text-ink-muted"
                  }`}
                >
                  {SubIcon && <SubIcon className="w-3.5 h-3.5" />}
                  {card.dotColor && <span className={`w-1.5 h-1.5 rounded-full ${card.dotColor}`} />}
                  <span>{card.subText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
