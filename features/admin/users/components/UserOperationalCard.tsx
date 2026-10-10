"use client";

import {
  Info,
  ShieldCheck,
  AlertTriangle,
  Clock,
  UserCog,
  Key,
  Trash2,
} from "lucide-react";
import type { UserDetail } from "../lib/userDetailTypes";

type UserOperationalCardProps = {
  user: UserDetail;
  isCurrentUser?: boolean;
  onOpenSuspendModal: () => void;
  onOpenRoleModal: () => void;
  onResetPassword: () => void;
  onOpenDeleteModal: () => void;
};

export function UserOperationalCard({
  user,
  isCurrentUser = false,
  onOpenSuspendModal,
  onOpenRoleModal,
  onResetPassword,
  onOpenDeleteModal,
}: UserOperationalCardProps) {
  const isDoctor = user.role === "doctor";

  return (
    <div className="bg-surface rounded-2xl shadow-sm p-6 flex flex-col gap-5 border border-border/50">
      <div className="flex items-center justify-between">
        <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
          Status Operasional Akun
        </span>
        <Info className="text-ink-subtle w-4 h-4" />
      </div>

      {/* Large Status Badge matching index3.html */}
      <div
        className={`p-4 rounded-xl flex items-center justify-between transition-colors ${
          user.isActive ? "bg-success/10" : "bg-warning/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-surface ${
              user.isActive ? "bg-success" : "bg-warning"
            }`}
          >
            {user.isActive ? (
              <ShieldCheck className="w-5 h-5 text-white" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`font-headline-sm text-headline-sm font-semibold leading-tight ${
                user.isActive ? "text-success" : "text-warning"
              }`}
            >
              {user.isActive
                ? isDoctor
                  ? "Aktif Melayani"
                  : "Akun Aktif"
                : "Akun Ditangguhkan"}
            </span>
            <span
              className={`font-eyebrow text-eyebrow font-medium ${
                user.isActive ? "text-success" : "text-warning"
              }`}
            >
              {user.isActive
                ? "Layanan Konsultasi Realtime Diberikan"
                : "Akses Akun Sementara Dibatasi Sistem"}
            </span>
          </div>
        </div>
        {user.isActive ? (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
          </span>
        ) : (
          <span className="inline-flex rounded-full h-3 w-3 bg-warning" />
        )}
      </div>

      {/* Meta Timestamps */}
      <div className="bg-surface-alt rounded-xl p-3.5 flex flex-col gap-2 border border-border/40">
        <div className="flex items-center justify-between text-caption font-caption">
          <span className="text-ink-muted">Waktu Registrasi:</span>
          <span className="font-semibold text-ink">{user.createdAt}</span>
        </div>
        <div className="flex items-center justify-between text-caption font-caption">
          <span className="text-ink-muted">Terakhir Masuk Sistem:</span>
          <span className="font-semibold text-ink">Hari ini, 08:14 WIB</span>
        </div>
        <div className="flex items-center justify-between text-caption font-caption">
          <span className="text-ink-muted">Alamat IP Sesi:</span>
          <span className="font-mono text-ink-muted text-caption">
            182.253.14.98 (Jakarta)
          </span>
        </div>
      </div>

      {/* Action Buttons Cluster matching index3.html */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-border/50">
        <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
          Aksi Cepat Administrator
        </span>

        {/* Tangguhkan/Aktifkan Akun */}
        <button
          type="button"
          onClick={onOpenSuspendModal}
          className="w-full h-11 px-4 rounded-xl bg-warning/10 hover:bg-warning/20 text-warning font-caption text-caption font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <Clock className="w-4 h-4" />
          <span>
            {user.isActive ? "Tangguhkan Akun" : "Aktifkan Kembali Akun"}
          </span>
        </button>

        {/* Ubah Role Pengguna */}
        <button
          type="button"
          onClick={onOpenRoleModal}
          className="w-full h-11 px-4 rounded-xl bg-role-accent-admin/10 hover:bg-role-accent-admin/20 text-role-accent-admin font-caption text-caption font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <UserCog className="w-4 h-4" />
          <span>Ubah Role Pengguna</span>
        </button>

        {/* Reset Kata Sandi */}
        <button
          type="button"
          onClick={onResetPassword}
          className="w-full h-11 px-4 rounded-xl bg-surface-alt hover:bg-surface-container-high text-ink font-caption text-caption font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99] border border-border/60"
        >
          <Key className="w-4 h-4 text-ink-muted" />
          <span>Reset Kata Sandi Akun</span>
        </button>

        {/* Hapus Akun Permanen */}
        <button
          type="button"
          disabled={isCurrentUser}
          onClick={onOpenDeleteModal}
          className="w-full h-11 px-4 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger font-caption text-caption font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          title={isCurrentUser ? "Tidak dapat menghapus akun sendiri" : undefined}
        >
          <Trash2 className="w-4 h-4" />
          <span>Hapus Akun Permanen</span>
        </button>
      </div>
    </div>
  );
}
