"use client";

import { CheckCircle2, Clock, ShieldCheck, Stethoscope } from "lucide-react";

type DoctorStatStripProps = {
  verifiedCount?: number;
  pendingCount?: number;
};

export function DoctorStatStrip({
  verifiedCount = 0,
  pendingCount = 0,
}: DoctorStatStripProps) {
  const cards = [
    {
      title: "Dokter Terverifikasi",
      value: verifiedCount.toLocaleString("id-ID"),
      badge: "Sp.KK & DVE",
      badgeColor: "text-role-accent-doctor",
      subtext: "Aktif berpraktek & telekonsul",
      icon: Stethoscope,
      iconBg: "bg-role-accent-doctor/10",
      iconColor: "text-role-accent-doctor",
    },
    {
      title: "Menunggu SIP",
      value: pendingCount.toLocaleString("id-ID"),
      badge: "Antrean",
      badgeColor: "text-warning",
      subtext: "Berkas butuh validasi KKI",
      icon: Clock,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: "Spesialisasi Kulit",
      value: "Dermatologi",
      badge: "Konsil KKI",
      badgeColor: "text-role-accent-admin",
      subtext: "Standar kompetensi medis",
      icon: ShieldCheck,
      iconBg: "bg-role-accent-admin/10",
      iconColor: "text-role-accent-admin",
    },
    {
      title: "Kepatuhan Medis",
      value: "100%",
      badge: "SATUSEHAT",
      badgeColor: "text-success",
      subtext: "Integrasi fasyankes terverifikasi",
      icon: CheckCircle2,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

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
