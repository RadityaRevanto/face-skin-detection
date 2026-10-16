"use client";

import { useState } from "react";
import {
  Fingerprint,
  Copy,
  Check,
  Mail,
  CheckCircle,
  Phone,
  Shield,
  Stethoscope,
  User,
  Calendar,
  Award,
} from "lucide-react";
import type { UserDetail } from "../lib/userDetailTypes";

type UserIdentityCardProps = {
  user: UserDetail;
};

export function UserIdentityCard({ user }: UserIdentityCardProps) {
  const [copied, setCopied] = useState(false);

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const handleCopy = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDoctor = user.role === "doctor";
  const genderLabel =
    user.gender === "laki_laki"
      ? "Laki-laki"
      : user.gender === "perempuan"
        ? "Perempuan"
        : user.gender || "Belum diisi";

  return (
    <div className="bg-surface rounded-2xl shadow-sm p-6 relative flex flex-col gap-6 border border-border/50">
      {/* Upper Bio Segment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container shadow-inner flex items-center justify-center font-headline-lg text-headline-lg font-bold text-role-accent-admin">
            {user.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              initials || "U"
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 bg-surface rounded-full shadow-sm">
            <span className={`w-3 h-3 rounded-full block ${user.isActive ? "bg-success" : "bg-warning"}`} />
          </span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h2 className="font-headline-md text-headline-md text-ink truncate font-semibold">
            {user.name}
          </h2>
          <span className="font-caption text-caption text-ink-muted mt-0.5">
            {isDoctor
              ? user.doctorVerification?.specialization || "Spesialis Kulit & Dermatologi"
              : "Pengguna Terdaftar SkinCek"}
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {isDoctor && user.doctorVerification?.str_number && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-role-accent-doctor/10 text-role-accent-doctor font-caption text-caption font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>STR: {user.doctorVerification.str_number}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-ink font-caption text-caption font-medium">
              <span>Bergabung: {user.createdAt}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Monospace UUID Copy Strip */}
      <div className="bg-surface-alt rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border/50 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <Fingerprint className="text-ink-subtle w-5 h-5 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
              Identifikasi UUID Sistem
            </span>
            <code className="font-caption text-caption text-ink font-mono select-all truncate">
              usr_{user.id}
            </code>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-role-accent-admin text-caption font-caption font-semibold shadow-sm transition-all border border-border/60 shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Tersalin!" : "Salin UUID"}</span>
        </button>
      </div>

      {/* Detail Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 pt-2 border-t border-border/50 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">Alamat Email</span>
          <div className="flex items-center gap-2">
            <Mail className="text-ink-subtle w-4 h-4 shrink-0" />
            <span className="font-body-default text-body-default text-ink font-medium truncate">{user.email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">Verifikasi Email</span>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success font-caption text-caption font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Email Terverifikasi</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">Nomor Telepon</span>
          <div className="flex items-center gap-2">
            <Phone className="text-ink-subtle w-4 h-4 shrink-0" />
            <span className="font-body-default text-body-default text-ink font-medium">{user.phone || "+62 (Belum diisi)"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">Role & Otoritas</span>
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-role-accent-admin/10 text-role-accent-admin font-caption text-caption font-semibold">
              {isDoctor ? (
                <Stethoscope className="w-3.5 h-3.5 text-role-accent-doctor" />
              ) : user.role === "admin" ? (
                <Shield className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5 text-ink-muted" />
              )}
              <span className="capitalize">{user.role}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">Jenis Kelamin</span>
          <span className="font-body-default text-body-default text-ink font-medium">{genderLabel}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">Usia / Tanggal Lahir</span>
          <div className="flex items-center gap-2">
            <Calendar className="text-ink-subtle w-4 h-4 shrink-0" />
            <span className="font-body-default text-body-default text-ink font-medium">
              {user.age ? `${user.age} Tahun` : user.dateOfBirth || "Belum diisi"}
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostics Insight Bar */}
      <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2 border border-border/40 relative z-10">
        <div className="flex items-center justify-between">
          <span className="font-caption text-caption text-ink font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-role-accent-admin" />
            <span>Tingkat Ketuntasan Konsultasi AI & Tele-Dermatologi</span>
          </span>
          <span className="font-caption text-caption text-role-accent-admin font-bold">98.4%</span>
        </div>
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
          <div className="bg-role-accent-admin h-full rounded-full w-[98.4%]" />
        </div>
        <div className="flex items-center justify-between text-ink-subtle font-eyebrow text-eyebrow">
          <span>Akun Terverifikasi Aktif</span>
          <span>SLA Respons Optimal</span>
        </div>
      </div>
    </div>
  );
}
