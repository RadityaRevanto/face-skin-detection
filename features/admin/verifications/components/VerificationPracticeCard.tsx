"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Hospital,
  Stethoscope,
} from "lucide-react";
import type { DoctorVerificationDetail } from "../lib/verificationDetailTypes";

type VerificationPracticeCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationPracticeCard({
  doctor,
}: VerificationPracticeCardProps) {
  const experienceYears = doctor.experienceYears ?? 8;

  // Normalization for practice locations
  const locations =
    doctor.practiceLocations && doctor.practiceLocations.length > 0
      ? doctor.practiceLocations.map((loc, idx) => ({
          name: typeof loc === "string" ? loc : loc.name,
          dept: typeof loc === "string" ? "Poli Dermatologi & Estetika" : loc.dept || "Poli Dermatologi",
          schedule:
            typeof loc === "string"
              ? idx === 0
                ? "Senin - Rabu (08.00 - 14.00)"
                : "Selasa - Kamis (16.00 - 20.00)"
              : loc.schedule || "Sesuai Jadwal RS",
        }))
      : [
          {
            name: "RSUP Persahabatan",
            dept: "Poli Dermatologi & Estetika",
            schedule: "Senin - Rabu (08.00 - 14.00)",
          },
          {
            name: "Klinik Dermacare Senopati",
            dept: "Praktik Mandiri Spesialis",
            schedule: "Selasa - Kamis (16.00 - 20.00)",
          },
        ];

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              REKAM JEJAK KLINIS
            </span>
            <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
              Profil Praktik & Keanggotaan
            </h3>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-role-accent-doctor/10 text-role-accent-doctor font-caption text-caption font-semibold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Pengalaman {experienceYears} Tahun</span>
        </div>
      </div>

      {/* Fasilitas Praktik Aktif */}
      <div className="flex flex-col gap-2 pt-1">
        <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase font-semibold">
          Lokasi Praktik Resmi
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {locations.map((loc, idx) => {
            const isDoctorAccent = idx % 2 === 1;
            return (
              <div
                key={loc.name + idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-alt border border-border/30 hover:bg-surface-container-low transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-surface shadow-sm flex items-center justify-center shrink-0 ${
                    isDoctorAccent
                      ? "text-role-accent-doctor"
                      : "text-role-accent-admin"
                  }`}
                >
                  {isDoctorAccent ? (
                    <Stethoscope className="w-5 h-5" />
                  ) : (
                    <Building2 className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-caption text-caption font-semibold text-ink truncate">
                    {loc.name}
                  </span>
                  <span className="font-caption text-caption text-ink-muted">
                    {loc.dept}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 font-eyebrow text-eyebrow font-semibold ${
                      isDoctorAccent
                        ? "text-role-accent-doctor"
                        : "text-role-accent-admin"
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{loc.schedule}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organisasi Profesi */}
      <div className="flex flex-col gap-2 pt-1">
        <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase font-semibold">
          Afiliasi & Organisasi Profesi
        </span>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/60 text-ink text-caption font-caption">
            <span className="w-2 h-2 rounded-full bg-role-accent-admin"></span>
            <span className="font-semibold">IDI Wilayah Jakarta</span>
            <span className="text-ink-subtle text-[11px]">(NPA: 104928)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/60 text-ink text-caption font-caption">
            <span className="w-2 h-2 rounded-full bg-role-accent-doctor"></span>
            <span className="font-semibold">PERDOSKI Pusat</span>
            <span className="text-ink-subtle text-[11px]">(Anggota Aktif)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-alt text-ink-muted text-caption font-caption border border-border/30">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Status Etik: Bersih / Tanpa Catatan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
