"use client";

import Link from "next/link";
import {
  FileCheck2, ShieldCheck, Calendar, Building2, Stethoscope,
  Award, Hourglass, GraduationCap, Hospital, MapPin, CheckCircle2, History,
} from "lucide-react";
import type { DoctorDetail } from "../lib/doctorDetailTypes";

type DoctorCredentialsCardProps = {
  doctor: DoctorDetail;
};

export function DoctorCredentialsCard({ doctor }: DoctorCredentialsCardProps) {
  const v = doctor.latestVerification;
  const strNumber = v?.identity || "31.1.1.100.2.21.148291";
  const mainSpec = v?.specialization || "Dermatologi & Venereologi";
  const subSpec = v?.subSpecialization || "Dermatologi Kosmetik & Estetika";
  const experience = v?.clinicalExperience || "8 Tahun Praktik Aktif";
  const education = v?.almamater || "FK Universitas Indonesia";
  const strExpiry = v?.strExpiry || "12 Des 2028";
  const strIssuer = v?.strIssuer || "Konsil Kedokteran Indonesia (KKI)";
  const reviewedAtText = v?.reviewedAt ? `Diverifikasi pada ${v.reviewedAt}` : "Diverifikasi oleh Tim Medis Pusat";

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm space-y-8 border border-border/50">
      {/* 1. Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-role-accent-admin" />
            <span className="font-eyebrow text-eyebrow uppercase text-role-accent-admin tracking-wider font-semibold">
              Sertifikasi & Regulasi
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-ink font-semibold">
            Data Profesi & Legalitas Medis
          </h2>
        </div>
        <div className="p-2.5 rounded-xl bg-role-accent-admin/10 text-role-accent-admin">
          <ShieldCheck className="w-6 h-6 text-role-accent-admin" />
        </div>
      </div>

      {/* 2. STR Card */}
      <div className="p-5 rounded-2xl bg-surface-alt space-y-4 border border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">
              Nomor Surat Tanda Registrasi (STR)
            </span>
            <span className="font-headline-md text-headline-md text-ink font-bold tracking-tight font-mono">
              {strNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success font-caption text-caption font-semibold">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Status STR Aktif</span>
            </span>
          </div>
        </div>
        <div className="pt-3 flex flex-wrap items-center justify-between gap-4 font-caption text-caption text-ink-muted border-t border-border/40">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-ink-subtle" /><span>Masa Berlaku STR: <strong className="text-ink">{strExpiry}</strong></span></div>
          <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-ink-subtle" /><span>Penerbit: <strong className="text-ink">{strIssuer}</strong></span></div>
        </div>
      </div>

      {/* 3. Specialization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Spesialisasi Utama</span>
          <div className="p-4 rounded-xl bg-surface-alt flex items-center gap-3 border border-border/40">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-role-accent-doctor shadow-sm shrink-0">
              <Stethoscope className="w-5 h-5 text-role-accent-doctor" />
            </div>
            <div>
              <span className="font-body-default text-body-default text-ink font-semibold block">{mainSpec}</span>
              <span className="font-caption text-caption text-ink-muted">Penyakit Kulit & Kelamin</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Sub-Spesialisasi / Peminatan</span>
          <div className="p-4 rounded-xl bg-surface-alt flex items-center gap-3 border border-border/40">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-role-accent-admin shadow-sm shrink-0">
              <Award className="w-5 h-5 text-role-accent-admin" />
            </div>
            <div>
              <span className="font-body-default text-body-default text-ink font-semibold block">{subSpec}</span>
              <span className="font-caption text-caption text-ink-muted">Estetika Klinis & Terapi Laser</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Experience & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Pengalaman Klinis</span>
          <div className="p-4 rounded-xl bg-surface-alt flex items-center justify-between border border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm shrink-0">
                <Hourglass className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-body-default text-body-default text-ink font-semibold block">{experience}</span>
                <span className="font-caption text-caption text-ink-muted">Terhitung sejak 2017</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-surface text-ink font-caption text-caption font-semibold shadow-sm">Senior</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Almamater & Pendidikan</span>
          <div className="p-4 rounded-xl bg-surface-alt flex items-center gap-3 border border-border/40">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-secondary shadow-sm shrink-0">
              <GraduationCap className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <span className="font-body-default text-body-default text-ink font-semibold truncate block">{education}</span>
              <span className="font-caption text-caption text-ink-muted">Lulus Spesialis 2017 (Cum Laude)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Practice Locations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">Lokasi Praktik Resmi</span>
          <span className="font-caption text-caption text-ink-muted">2 Fasilitas Kesehatan Terdaftar</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-surface-alt flex items-start gap-3 border border-border/40">
            <Hospital className="w-5 h-5 text-role-accent-admin mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-body-default text-body-default text-ink font-semibold block">RSUP Persahabatan</span>
              <span className="font-caption text-caption text-ink-muted block">Jakarta Timur, DKI Jakarta</span>
              <span className="inline-block mt-1 font-caption text-[11px] text-role-accent-admin bg-surface px-2 py-0.5 rounded shadow-sm">Klinik Kulit & Kelamin Terpadu</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-alt flex items-start gap-3 border border-border/40">
            <MapPin className="w-5 h-5 text-role-accent-doctor mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-body-default text-body-default text-ink font-semibold block">Klinik Dermacare Senopati</span>
              <span className="font-caption text-caption text-ink-muted block">Jakarta Selatan, DKI Jakarta</span>
              <span className="inline-block mt-1 font-caption text-[11px] text-role-accent-doctor bg-surface px-2 py-0.5 rounded shadow-sm">Pusat Laser & Estetika Medis</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Professional Organizations */}
      <div className="space-y-3">
        <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle block">Keanggotaan Organisasi Profesi</span>
        <div className="flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-alt text-ink font-body-default text-body-default font-medium border border-border/40">
            <span className="w-2 h-2 rounded-full bg-role-accent-admin" />
            IDI: Ikatan Dokter Indonesia
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-alt text-ink font-body-default text-body-default font-medium border border-border/40">
            <span className="w-2 h-2 rounded-full bg-role-accent-doctor" />
            PERDOSKI: Perhimpunan Dokter Spesialis Kulit & Kelamin
          </span>
        </div>
      </div>

      {/* 7. Verification Status Banner */}
      <div className="p-4 rounded-xl bg-surface-alt flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <span className="font-caption text-caption font-semibold text-ink block">
              Status Verifikasi Legalitas: {v?.status || "Disetujui (Approved)"}
            </span>
            <span className="font-caption text-caption text-ink-muted">{reviewedAtText}</span>
          </div>
        </div>
        <Link
          href={v?.id ? `/admin/doctor-verifications/detail?id=${encodeURIComponent(v.id)}` : "/admin/doctor-verifications"}
          className="h-9 px-3 rounded-lg bg-surface hover:bg-surface-container text-ink font-caption text-caption font-semibold flex items-center gap-1.5 shadow-sm transition-colors border border-border/40"
        >
          <History className="w-4 h-4 text-ink-muted" />
          <span>Riwayat Verifikasi</span>
        </Link>
      </div>
    </div>
  );
}
