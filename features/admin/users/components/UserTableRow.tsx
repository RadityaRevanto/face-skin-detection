"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Stethoscope,
  User as UserIcon,
  Trash2,
  MoreVertical,
  Eye,
  UserCog,
  PowerOff,
  Power,
} from "lucide-react";
import type { AdminUser } from "@/features/admin/services/adminService";

type UserTableRowProps = {
  user: AdminUser;
  isCurrentUser: boolean;
  onOpenRoleModal: (user: AdminUser) => void;
  onOpenSuspendModal: (user: AdminUser) => void;
  onOpenDeleteModal: (user: AdminUser) => void;
};

const ROLE_BADGES: Record<string, { icon: typeof Shield; label: string; cls: string }> = {
  admin: { icon: Shield, label: "Admin", cls: "bg-role-accent-admin/10 text-role-accent-admin" },
  doctor: { icon: Stethoscope, label: "Doctor", cls: "bg-role-accent-doctor/10 text-role-accent-doctor" },
  user: { icon: UserIcon, label: "User", cls: "bg-surface-container text-ink" },
};

export function UserTableRow({
  user,
  isCurrentUser,
  onOpenRoleModal,
  onOpenSuspendModal,
  onOpenDeleteModal,
}: UserTableRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user.full_name
    ? user.full_name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    : "U";

  const role = user.role?.toLowerCase() || "user";
  const isActive = user.is_active !== false;

  const dateStr = user.created_at
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(user.created_at))
    : "-";

  const badge = ROLE_BADGES[role] || ROLE_BADGES.user;
  const RoleIcon = badge.icon;

  return (
    <tr
      className={`h-14 transition-colors ${
        isCurrentUser ? "bg-surface-container-high/30 hover:bg-surface-container-high/50" : "hover:bg-surface-alt"
      }`}
    >
      {/* Pengguna Column */}
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-headline-sm text-caption font-semibold shadow-sm ${
                role === "admin"
                  ? "bg-role-accent-admin text-surface"
                  : role === "doctor"
                    ? "bg-role-accent-doctor text-surface"
                    : "bg-surface-container text-ink"
              }`}
            >
              {initials}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-surface ${
                isActive ? "bg-success" : "bg-warning"
              }`}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-caption text-ink font-semibold truncate">
                {user.full_name}
              </span>
              {isCurrentUser && (
                <span className="px-1.5 py-0.5 rounded bg-role-accent-admin text-surface font-eyebrow text-[10px] font-semibold tracking-wide uppercase">
                  Anda
                </span>
              )}
            </div>
            <span className="font-caption text-caption text-ink-subtle truncate">
              {isCurrentUser ? "Kredensial Sesi Aktif" : `ID: ${user.uuid?.slice(0, 8)}`}
            </span>
          </div>
        </div>
      </td>

      {/* Email Column */}
      <td className="py-2.5 px-4 text-ink-muted font-body-default text-sm">
        {user.email}
      </td>

      {/* Role Column */}
      <td className="py-2.5 px-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-caption text-caption font-semibold ${badge.cls}`}>
          <RoleIcon className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </span>
      </td>

      {/* Status Column */}
      <td className="py-2.5 px-4">
        {isActive ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>Aktif</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span>Ditangguhkan</span>
          </span>
        )}
      </td>

      {/* Tanggal Daftar Column */}
      <td className="py-2.5 px-4 text-ink-muted font-caption text-caption">
        {dateStr}
      </td>

      {/* Aksi Column */}
      <td className="py-2.5 px-4 text-right relative">
        <div className="inline-flex items-center gap-1">
          {isCurrentUser ? (
            <div className="relative group/tooltip">
              <button
                type="button"
                disabled
                aria-label="Tidak dapat menghapus akun sendiri"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-subtle/40 bg-surface-alt cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/tooltip:flex flex-col items-end z-30 pointer-events-none">
                <span className="px-2 py-1 rounded-md bg-ink text-surface font-caption text-[11px] whitespace-nowrap shadow-md">
                  Tidak dapat menghapus akun sendiri
                </span>
                <span className="w-2 h-2 -mr-3 rotate-45 bg-ink -mt-1" />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenDeleteModal(user)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-danger/80 hover:text-danger hover:bg-danger/10 transition-colors"
              title="Hapus Pengguna"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface-alt hover:text-ink transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-surface shadow-lg border border-border py-1 z-30 text-left font-caption text-caption text-ink">
                  <Link
                    href={`/admin/users/detail?id=${user.uuid}`}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-surface-alt transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Eye className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Lihat Detail</span>
                  </Link>

                  {!isCurrentUser && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenRoleModal(user);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-alt transition-colors text-left"
                      >
                        <UserCog className="w-3.5 h-3.5 text-ink-muted" />
                        <span>Ubah Role</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenSuspendModal(user);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-alt transition-colors text-left ${
                          isActive ? "text-warning" : "text-success"
                        }`}
                      >
                        {isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        <span>{isActive ? "Tangguhkan" : "Aktifkan Akun"}</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
