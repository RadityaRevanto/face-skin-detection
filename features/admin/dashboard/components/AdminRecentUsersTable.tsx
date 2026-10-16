"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Shield, Stethoscope, User } from "lucide-react";

import { adminService, type AdminUser } from "@/features/admin/services/adminService";

export function AdminRecentUsersTable() {
  const [viewState, setViewState] = useState<"live" | "skeleton" | "empty">("live");

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["admin", "recent-users"],
    queryFn: () => adminService.users({ page: 1, per_page: 5 }),
    staleTime: 60 * 1000,
  });

  const users: AdminUser[] = usersResponse?.data ?? [];

  return (
    <section className="mt-8">
      <div className="p-6 rounded-2xl bg-surface shadow-sm border border-border/50">
        {/* Table Header & View State Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md text-ink font-semibold">
                Pengguna Terbaru
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-role-accent-admin/10 text-role-accent-admin font-caption text-caption font-semibold">
                {users.length} akun baru
              </span>
            </div>
            <p className="font-body-default text-body-default text-ink-muted">
              Pendaftar akun platform terverifikasi secara realtime.
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            {/* View State Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-surface-alt border border-border text-caption font-caption">
              <button
                type="button"
                onClick={() => setViewState("live")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewState === "live"
                    ? "bg-surface font-semibold text-ink shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Live Data
              </button>
              <button
                type="button"
                onClick={() => setViewState("skeleton")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewState === "skeleton"
                    ? "bg-surface font-semibold text-ink shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Skeleton Mode
              </button>
              <button
                type="button"
                onClick={() => setViewState("empty")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewState === "empty"
                    ? "bg-surface font-semibold text-ink shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Empty State
              </button>
            </div>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-alt text-role-accent-admin font-caption text-caption font-semibold transition-colors"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* State 1: Skeleton */}
        {(viewState === "skeleton" || (viewState === "live" && isLoading)) && (
          <div className="py-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 animate-pulse bg-surface-alt rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200" />
                  <div className="space-y-1">
                    <div className="w-32 h-4 rounded bg-slate-200" />
                    <div className="w-20 h-3 rounded bg-slate-200" />
                  </div>
                </div>
                <div className="w-24 h-4 rounded bg-slate-200" />
                <div className="w-16 h-6 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* State 2: Empty */}
        {(viewState === "empty" || (viewState === "live" && !isLoading && users.length === 0)) && (
          <div className="py-16 text-center">
            <User className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
            <p className="font-semibold text-ink">Belum ada pengguna terdaftar</p>
            <p className="text-sm text-ink-muted mt-1">Data pendaftaran baru akan muncul di sini.</p>
          </div>
        )}

        {/* State 3: Live Data */}
        {viewState === "live" && !isLoading && users.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left font-body-default text-body-default">
              <thead>
                <tr className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider border-b border-border">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Tipe Akun</th>
                  <th className="py-3 px-4">Tanggal Registrasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const initials = user.full_name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("");

                  const roleConfig = user.role === "admin"
                    ? { label: "Admin", badge: "bg-role-accent-admin/10 text-role-accent-admin", Icon: Shield }
                    : user.role === "doctor"
                    ? { label: "Dokter", badge: "bg-role-accent-doctor/10 text-role-accent-doctor", Icon: Stethoscope }
                    : { label: "User", badge: "bg-secondary/10 text-secondary", Icon: User };
                  const RoleIcon = roleConfig.Icon;

                  return (
                    <tr key={user.uuid} className="hover:bg-surface-alt transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-surface-container text-role-accent-admin font-semibold flex items-center justify-center text-[13px]">
                            {initials || "U"}
                          </div>
                          <div>
                            <span className="font-semibold text-ink group-hover:text-role-accent-admin transition-colors">
                              {user.full_name}
                            </span>
                            <span className="block font-caption text-caption text-ink-subtle">
                              ID: {user.uuid.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted font-mono text-[13px]">{user.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption text-caption font-semibold ${roleConfig.badge}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/10 text-success font-caption text-caption font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          {user.is_active === false ? "Nonaktif" : "Aktif"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/users/detail?id=${user.uuid}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container text-ink-muted hover:text-ink transition-colors"
                          title="Lihat Detail"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
