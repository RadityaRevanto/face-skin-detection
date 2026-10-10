"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  Power,
  MessageSquare,
  History,
  Sliders,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { customToast } from "@/lib/custom-toast";
import type { DoctorDetail } from "../lib/doctorDetailTypes";

type DoctorProfileCardProps = {
  doctor: DoctorDetail;
  onToggleStatus: () => void;
};

export function DoctorProfileCard({ doctor, onToggleStatus }: DoctorProfileCardProps) {
  const initials = doctor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const sip = doctor.sipNumber || `SIP: 503/${doctor.id.slice(0, 4)}/SIP.D/2021`;
  const phone = doctor.phone || "+62 811-2345-6789";

  const handleSendMessage = () => {
    customToast.info("Pesan Administratif", {
      description: `Format pesan draft untuk ${doctor.name} siap dikirim via email.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Identity & Contact Overview Card */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden border border-border/50">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-role-accent-admin/10 to-transparent pointer-events-none" />
        <div className="relative mb-4 mt-2">
          <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-surface shadow-md bg-surface-alt">
            {doctor.avatarUrl ? (
              <img src={doctor.avatarUrl} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center font-display text-2xl font-bold">
                {initials || "DR"}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-success text-surface rounded-xl p-1.5 shadow-sm flex items-center justify-center ring-2 ring-surface">
            <CheckCircle className="w-4 h-4 text-surface" />
          </div>
        </div>

        <h2 className="font-headline-md text-headline-md text-ink font-semibold">{doctor.name}</h2>
        <span className="font-caption text-caption text-role-accent-admin font-medium mt-0.5">{sip}</span>

        <div className="w-full mt-6 space-y-3 text-left">
          <div className="p-3.5 rounded-xl bg-surface-alt flex items-center gap-3 border border-border/40">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-role-accent-admin shadow-sm shrink-0">
              <Mail className="w-4 h-4 text-role-accent-admin" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Alamat Email</span>
              <a href={`mailto:${doctor.email}`} className="font-body-default text-body-default text-ink font-medium truncate block hover:text-role-accent-admin transition-colors">
                {doctor.email}
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-alt flex items-center gap-3 border border-border/40">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-role-accent-admin shadow-sm shrink-0">
              <Phone className="w-4 h-4 text-role-accent-admin" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Nomor Telepon</span>
              <a href={`tel:${phone}`} className="font-body-default text-body-default text-ink font-medium truncate block hover:text-role-accent-admin transition-colors">
                {phone}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-surface-alt border border-border/40">
              <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Status Akun</span>
              <span className={`inline-flex items-center gap-1.5 mt-1 font-caption text-caption font-semibold ${doctor.isActive ? "text-success" : "text-warning"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${doctor.isActive ? "bg-success" : "bg-warning"}`} />
                <span>{doctor.isActive ? "Aktif" : "Ditangguhkan"}</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-alt border border-border/40">
              <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Terdaftar Sejak</span>
              <span className="font-caption text-caption text-ink font-semibold mt-1 block">{doctor.joinedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Admin Actions Card */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm space-y-4 border border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">Tindakan Cepat</h3>
          <Sliders className="w-5 h-5 text-ink-subtle" />
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onToggleStatus}
            className="w-full h-11 px-4 rounded-xl bg-surface-alt hover:bg-surface-container text-ink font-body-default text-body-default font-medium flex items-center justify-between group transition-colors border border-border/40"
          >
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-ink-muted group-hover:text-role-accent-admin" />
              <span>Ubah Keaktifan Akun</span>
            </div>
            <span className={`font-caption text-caption font-semibold px-2 py-0.5 rounded-md ${doctor.isActive ? "text-success bg-success/10" : "text-warning bg-warning/10"}`}>
              {doctor.isActive ? "Aktif" : "Nonaktif"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSendMessage}
            className="w-full h-11 px-4 rounded-xl bg-surface-alt hover:bg-surface-container text-ink font-body-default text-body-default font-medium flex items-center justify-between group transition-colors border border-border/40"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-ink-muted group-hover:text-role-accent-admin" />
              <span>Kirim Pesan Administratif</span>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-subtle" />
          </button>

          <Link
            href={`/admin/activity-log?search=${encodeURIComponent(doctor.email)}`}
            className="w-full h-11 px-4 rounded-xl bg-surface-alt hover:bg-surface-container text-ink font-body-default text-body-default font-medium flex items-center justify-between group transition-colors border border-border/40"
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-ink-muted group-hover:text-role-accent-admin" />
              <span>Log Audit & Aktivitas</span>
            </div>
            <span className="font-caption text-caption text-ink-muted">142 Rekaman</span>
          </Link>
        </div>
      </div>

      {/* 3. AI Consultation Activity Card */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm space-y-4 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">Aktivitas Konsultasi AI</h3>
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">30 Hari Terakhir</span>
          </div>
          <span className="font-headline-md text-headline-md text-role-accent-admin font-bold">98.4%</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between font-caption text-caption text-ink-muted">
            <span>Akurasi Diagnostik Lanjutan</span>
            <span className="text-ink font-semibold">312 / 317 Kasus</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-role-accent-admin rounded-full" style={{ width: "98.4%" }} />
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center text-ink-muted font-caption text-caption border-t border-border/40">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-role-accent-doctor" />
            <span>Avg Respon: 4.2 mnt</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>Rating: 4.9/5.0</span>
          </span>
        </div>
      </div>
    </div>
  );
}
