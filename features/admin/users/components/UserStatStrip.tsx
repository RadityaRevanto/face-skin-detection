"use client";

import { Users, Stethoscope, ShieldCheck, UserX, TrendingUp } from "lucide-react";

type UserStatStripProps = {
  totalUsers?: number;
  totalDoctors?: number;
  totalAdmins?: number;
  totalSuspended?: number;
};

export function UserStatStrip({
  totalUsers = 0,
  totalDoctors = 0,
  totalAdmins = 0,
  totalSuspended = 0,
}: UserStatStripProps) {
  const cards = [
    {
      title: "Total Terdaftar",
      value: totalUsers.toLocaleString("id-ID"),
      badge: "+8.4%",
      badgeIcon: TrendingUp,
      badgeColor: "text-success",
      subtext: "Akun terverifikasi sistem",
      icon: Users,
      iconBg: "bg-surface-container",
      iconColor: "text-role-accent-admin",
    },
    {
      title: "Praktisi Medis",
      value: totalDoctors.toLocaleString("id-ID"),
      badge: "Sp.KK & DVE",
      badgeColor: "text-role-accent-doctor",
      subtext: "Aktif berpraktek & telekonsul",
      icon: Stethoscope,
      iconBg: "bg-role-accent-doctor/10",
      iconColor: "text-role-accent-doctor",
    },
    {
      title: "Superadmin & Staf",
      value: totalAdmins.toLocaleString("id-ID"),
      badge: "Kredensial",
      badgeColor: "text-ink-subtle",
      subtext: "Hak akses root & audit trail",
      icon: ShieldCheck,
      iconBg: "bg-role-accent-admin/10",
      iconColor: "text-role-accent-admin",
    },
    {
      title: "Ditangguhkan",
      value: totalSuspended.toLocaleString("id-ID"),
      badge: "Nonaktif",
      badgeColor: "text-danger",
      subtext: "Pelanggaran SOP & keamanan",
      icon: UserX,
      iconBg: "bg-error-container text-danger",
      iconColor: "text-danger",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const BadgeIcon = card.badgeIcon;

        return (
          <div
            key={card.title}
            className="bg-surface rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-border/50"
          >
            <div className="flex items-center justify-between">
              <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
                {card.title}
              </span>
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg} ${card.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-display text-ink font-semibold">
                {card.value}
              </span>
              {card.badge && (
                <span
                  className={`font-caption text-caption flex items-center gap-0.5 font-semibold ${card.badgeColor}`}
                >
                  {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
                  {card.badge}
                </span>
              )}
            </div>
            <span className="font-caption text-caption text-ink-muted">
              {card.subtext}
            </span>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-role-accent-admin/5 rounded-full blur-xl pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
