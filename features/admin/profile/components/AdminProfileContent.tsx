import type { AdminProfileData } from "../types";
import { AdminProfileCard } from "./AdminProfileCard";
import { AdminSummaryWidgets } from "./AdminSummaryWidgets";
import { AdminSessionInfo } from "./AdminSessionInfo";
import { AdminProfileNav } from "./AdminProfileNav";

export function AdminProfileContent({ profile }: { profile: AdminProfileData }) {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col gap-1 pb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-eyebrow text-eyebrow text-role-accent-admin uppercase tracking-wider font-semibold">
            AKUN ADMINISTRATOR
          </span>
        </div>
        <h1 className="font-display text-display text-ink font-semibold tracking-tight">
          Profil Admin
        </h1>
        <p className="font-body-default text-body-default text-ink-muted">
          Ringkasan akun admin, aktivitas login terakhir, dan statistik platform.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <AdminProfileNav activePage="profile" />

        <div className="flex-1 w-full min-w-0 space-y-6">
          <AdminSummaryWidgets summary={profile.summary} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminProfileCard profile={profile} />
            <div className="space-y-6">
              <AdminSessionInfo activeSessions={profile.active_sessions} lastLogin={profile.last_login} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
