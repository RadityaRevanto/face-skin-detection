"use client";

import { ProfileSettingsNav, type ProfileSettingsPage } from "./ProfileSettingsNav";
import type { UserProfile } from "@/lib/api/profile-query";
import { SubscriptionCard } from "./SubscriptionCard";

type ProfileSidebarProps = {
  profile: UserProfile;
  role: "user" | "doctor" | "admin";
  activePage: ProfileSettingsPage;
};

/**
 * Sidebar pengaturan akun — nav dari `ProfileSettingsNav` (satu sumber),
 * plus kartu kontekstual per role (langganan user / status verifikasi doctor).
 */
export function ProfileSidebar({ profile, role, activePage }: ProfileSidebarProps) {
  const basePath =
    role === "doctor"
      ? "/doctor/profile"
      : role === "admin"
        ? "/admin/profile"
        : "/user/profile";

  return (
    <div className="flex w-full shrink-0 flex-col gap-2 lg:w-64">
      <ProfileSettingsNav activePage={activePage} basePath={basePath} />
      {role === "user" && (
        <div className="order-last lg:order-none">
          <SubscriptionCard profile={profile} />
        </div>
      )}
      {role === "doctor" && <VerificationCard profile={profile} />}
    </div>
  );
}

function VerificationCard({ profile }: { profile: UserProfile }) {
  const status = profile.verification_status;
  const config =
    status === "approved"
      ? { label: "Terverifikasi", cls: "text-white" }
      : status === "pending"
        ? { label: "Menunggu Review", cls: "text-amber-300" }
        : status === "rejected"
          ? { label: "Ditolak", cls: "text-rose-300" }
          : status === "needs_revision"
            ? { label: "Perlu Revisi", cls: "text-amber-300" }
            : { label: "Belum Verifikasi", cls: "text-slate-200" };

  return (
    <div className="mt-2 rounded-[var(--radius-card)] bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-[var(--shadow-card)]">
      <p className="mb-1 text-xs font-medium text-slate-300">Status Verifikasi</p>
      <h3 className={`font-heading text-xl font-bold ${config.cls}`}>
        {config.label}
      </h3>
    </div>
  );
}