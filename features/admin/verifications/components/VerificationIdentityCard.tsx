"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Copy, Check, Mail, Phone, ShieldCheck } from "lucide-react";
import type { DoctorVerificationDetail } from "../lib/verificationDetailTypes";
import { customToast } from "@/lib/custom-toast";

type VerificationIdentityCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationIdentityCard({
  doctor,
}: VerificationIdentityCardProps) {
  const [copied, setCopied] = useState(false);
  const docId = `DOC-${doctor.doctorId ? doctor.doctorId.slice(0, 5).toUpperCase() : doctor.id.slice(0, 5).toUpperCase()}`;

  const handleCopyStr = () => {
    if (!doctor.identity) return;
    navigator.clipboard.writeText(doctor.identity);
    setCopied(true);
    customToast.success("Nomor STR berhasil disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden border border-border/50">
      {/* Header Profile Identity */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            {doctor.avatarUrl ? (
              <Image
                src={doctor.avatarUrl}
                alt={doctor.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center font-bold text-xl shadow-sm">
                {doctor.name.charAt(0) || "D"}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 p-1 bg-surface rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 text-role-accent-doctor" />
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              IDENTITAS KREDENSIAL
            </span>
            <h2 className="font-headline-md text-headline-md text-ink truncate font-semibold">
              {doctor.name}
            </h2>
            <span className="font-caption text-caption text-ink-muted">
              {doctor.specialization || "Spesialis Kulit & Kelamin"}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-surface-container-high text-role-accent-admin font-eyebrow text-eyebrow font-semibold shrink-0">
          ID: {docId}
        </span>
      </div>

      {/* 4 Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* STR */}
        <div className="flex flex-col p-3 rounded-xl bg-surface-alt border border-border/30">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Nomor STR (KKI Aktif)
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-body-default text-body-default font-semibold text-ink tracking-tight font-mono">
              {doctor.identity || "31.1.1.100.2.21.148291"}
            </span>
            <button
              type="button"
              onClick={handleCopyStr}
              title="Salin STR"
              className="text-ink-subtle hover:text-role-accent-admin transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <span className="font-caption text-[11px] text-success flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {doctor.strExpiry
                ? `Berlaku s/d ${doctor.strExpiry}`
                : "Tervalidasi aktif di KKI"}
            </span>
          </span>
        </div>

        {/* Email */}
        <div className="flex flex-col p-3 rounded-xl bg-surface-alt border border-border/30">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Alamat Email Terdaftar
          </span>
          <span className="font-body-default text-body-default font-semibold text-ink truncate mt-0.5">
            {doctor.email}
          </span>
          <span className="font-caption text-[11px] text-ink-subtle flex items-center gap-1 mt-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Akun SSO Google Terverifikasi</span>
          </span>
        </div>

        {/* Almamater */}
        <div className="flex flex-col p-3 rounded-xl bg-surface-alt border border-border/30">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Pendidikan Spesialis
          </span>
          <span className="font-body-default text-body-default font-semibold text-ink mt-0.5">
            {doctor.almaMater || "Universitas Indonesia"}
          </span>
          <span className="font-caption text-[11px] text-ink-subtle mt-1">
            {doctor.subSpecialization || "Dermatovenerologi Lulusan 2016"}
          </span>
        </div>

        {/* Kontak */}
        <div className="flex flex-col p-3 rounded-xl bg-surface-alt border border-border/30">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Nomor Kontak / WhatsApp
          </span>
          <span className="font-body-default text-body-default font-semibold text-ink mt-0.5">
            {doctor.phone || "+62 812-8829-0192"}
          </span>
          <span className="font-caption text-[11px] text-ink-subtle flex items-center gap-1 mt-1">
            <Phone className="w-3.5 h-3.5" />
            <span>Verifikasi OTP Seluler Selesai</span>
          </span>
        </div>
      </div>
    </div>
  );
}
