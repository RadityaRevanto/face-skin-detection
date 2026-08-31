import type { AdminProfileData } from "../types";
import { AdminProfileCard } from "./AdminProfileCard";
import { AdminSummaryWidgets } from "./AdminSummaryWidgets";
import { AdminSessionInfo } from "./AdminSessionInfo";
import { AdminProfileNav } from "./AdminProfileNav";

export function AdminProfileContent({ profile }: { profile: AdminProfileData }) {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Profil Admin</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan akun admin, aktivitas login terakhir, dan statistik platform.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <AdminProfileNav activePage="profile" />

        <div className="min-w-0 flex-1 space-y-6">
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
