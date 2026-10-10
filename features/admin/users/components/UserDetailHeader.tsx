"use client";

import Link from "next/link";
import { ArrowLeft, Stethoscope, Shield, User, History, Download, CheckCircle2 } from "lucide-react";
import type { UserDetail } from "../lib/userDetailTypes";

type UserDetailHeaderProps = {
  user: UserDetail;
  onExport: () => void;
};

export function UserDetailHeader({ user, onExport }: UserDetailHeaderProps) {
  const isDoctor = user.role === "doctor";
  const isAdmin = user.role === "admin";

  return (
    <div className="w-full flex flex-col gap-2.5 mb-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink transition-colors font-caption text-caption group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Manajemen User</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-role-accent-admin/10 text-role-accent-admin font-eyebrow text-eyebrow uppercase tracking-wider font-semibold">
            Console Mode • Admin Access
          </span>
        </div>
      </div>

      {/* Main Header Identity Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-widest">
            Detail Identitas Pengguna
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-display text-ink tracking-tight font-semibold">
              {user.name}
            </h1>

            {isDoctor && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-role-accent-doctor/10 text-role-accent-doctor font-caption text-caption font-semibold">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
              </span>
            )}
            {isAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-role-accent-admin/10 text-role-accent-admin font-caption text-caption font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </span>
            )}
            {!isDoctor && !isAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-ink font-caption text-caption font-semibold">
                <User className="w-3.5 h-3.5 text-ink-muted" />
                <span>User</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/10 text-success font-eyebrow text-eyebrow font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isDoctor ? "Terverifikasi KKI" : "Akun Terverifikasi"}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href={`/admin/activity-log?search=${encodeURIComponent(user.name)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-role-accent-admin font-caption text-caption font-semibold transition-colors"
          >
            <History className="w-4 h-4" />
            <span>Log Audit Sesi</span>
          </Link>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-alt hover:bg-surface-container text-ink-muted hover:text-ink font-caption text-caption font-medium transition-colors border border-border/50"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Metadata</span>
          </button>
        </div>
      </div>
    </div>
  );
}
