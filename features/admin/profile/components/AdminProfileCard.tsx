import { Card } from "@/components/ui/card";

import type { AdminProfileData } from "../types";
import { formatAdminProfileDate, formatUserAgent } from "../lib/adminProfileUtils";

export function AdminProfileCard({ profile }: { profile: AdminProfileData }) {
  const initials = profile.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
        <h2 className="text-base font-bold text-slate-950">Profil Admin</h2>
        <p className="mt-1 text-sm text-slate-500">Data pribadi dan status akun admin.</p>
      </div>

      <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xl font-bold text-white">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
          ) : (
            initials || "A"
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight text-slate-950">{profile.full_name}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                profile.email_verified
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {profile.email_verified ? "Email Terverifikasi" : "Email Belum Verifikasi"}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">{profile.email}</p>
          <p className="text-xs text-slate-400">
            UUID: <span className="break-all font-medium">{profile.uuid}</span>
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <ProfileRow label="Role" value={profile.role} />
        <ProfileRow label="Akun dibuat" value={formatAdminProfileDate(profile.account_created_at)} />
        <ProfileRow label="Login terakhir" value={formatAdminProfileDate(profile.last_login.at)} />
        <ProfileRow label="IP login terakhir" value={profile.last_login.ip_address ?? "-"} />
        <ProfileRow label="Perangkat login terakhir" value={formatUserAgent(profile.last_login.user_agent)} />
      </div>
    </Card>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:px-8">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="break-all text-sm font-medium text-slate-800 sm:col-span-2">{value}</p>
    </div>
  );
}
