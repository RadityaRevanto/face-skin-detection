import type { AdminProfileData } from "../types";
import { AdminProfileCard } from "./AdminProfileCard";
import { AdminSummaryWidgets } from "./AdminSummaryWidgets";
import { AdminSessionInfo } from "./AdminSessionInfo";
import { AdminProfileNav } from "./AdminProfileNav";

export function AdminProfileContent({ profile }: { profile: AdminProfileData }) {
  return (
    <main className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Profil Admin</h1>
        <p className="text-zinc-500 mt-1.5 text-sm sm:text-base">
          Ringkasan akun admin, aktivitas login terakhir, dan statistik platform.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
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
    </main>
  );
}
