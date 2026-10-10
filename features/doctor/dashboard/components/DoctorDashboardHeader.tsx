"use client";

import Link from "next/link";
import { MessageSquare, Stethoscope, Activity } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";

export type DoctorDashboardHeaderProps = {
  fullName: string;
  avatarUrl?: string | null;
  awaitingCount?: number | null;
};

function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 11) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 19) return "Selamat Sore";
  return "Selamat Malam";
}

export function DoctorDashboardHeader({
  fullName,
  avatarUrl,
  awaitingCount = 0,
}: DoctorDashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface p-space-lg rounded-xl shadow-xs border border-border/60">
      <div className="flex items-center gap-space-md min-w-0">
        <UserAvatar
          name={fullName}
          src={avatarUrl ?? null}
          className="!w-14 !h-14 !text-base shrink-0 ring-2 ring-role-accent-doctor/20"
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-eyebrow text-eyebrow text-role-accent-doctor uppercase">
              {greetingByHour()} - {currentDate}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-ink font-bold tracking-tight truncate mt-0.5">
            Halo,  {fullName}
          </h1>
          <p className="font-body-default text-body-default text-ink-muted truncate mt-0.5">
            Pusat Kendali Praktik Medis &amp; Teledermatologi SkinCek
          </p>
        </div>
      </div>

      <div className="flex items-center gap-space-md shrink-0 flex-wrap">
        

        <Link
          href="/doctor/consultations"
          className="inline-flex items-center gap-2 px-space-md h-10 rounded-[10px] bg-role-accent-doctor text-on-primary font-caption text-caption font-semibold shadow-xs hover:opacity-95 transition-opacity"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ruang Konsultasi</span>
          {awaitingCount != null && awaitingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
              {awaitingCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
