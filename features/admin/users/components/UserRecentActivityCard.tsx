"use client";

import { Activity, Stethoscope, Scan, FileText, Calendar } from "lucide-react";
import type { UserDetail } from "../lib/userDetailTypes";

type UserRecentActivityCardProps = {
  user: UserDetail;
};

export function UserRecentActivityCard({ user }: UserRecentActivityCardProps) {
  const isDoctor = user.role === "doctor";

  return (
    <div className="bg-surface rounded-2xl shadow-sm p-6 flex flex-col gap-4 border border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-role-accent-admin" />
          <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
            {isDoctor ? "Aktivitas Klinis Dokter" : "Aktivitas Akun Pengguna"}
          </h3>
        </div>
        <span className="font-caption text-caption text-ink-muted">
          3 Sesi Terkini
        </span>
      </div>

      <div className="space-y-3">
        {isDoctor ? (
          <>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt hover:bg-surface-container-low transition-colors border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-caption text-caption font-semibold text-ink">
                    Diagnosis Melanocytic Nevus
                  </span>
                  <span className="font-eyebrow text-eyebrow text-ink-subtle">
                    Pasien #PT-90412 • Validasi AI: 96%
                  </span>
                </div>
              </div>
              <span className="font-caption text-caption text-ink-muted">14 mnt lalu</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt hover:bg-surface-container-low transition-colors border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-info/10 text-info flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-caption text-caption font-semibold text-ink">
                    Pemberian Resep Topikal Retinoid
                  </span>
                  <span className="font-eyebrow text-eyebrow text-ink-subtle">
                    Pasien #PT-88210 • Acne Vulgaris Grade II
                  </span>
                </div>
              </div>
              <span className="font-caption text-caption text-ink-muted">2 jam lalu</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt hover:bg-surface-container-low transition-colors border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-role-accent-admin/10 text-role-accent-admin flex items-center justify-center font-bold">
                  <Scan className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-caption text-caption font-semibold text-ink">
                    Pemindaian Wajah & Prediksi Kulit
                  </span>
                  <span className="font-eyebrow text-eyebrow text-ink-subtle">
                    Aura Skin AI • Akurasi 94%
                  </span>
                </div>
              </div>
              <span className="font-caption text-caption text-ink-muted">Hari ini</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt hover:bg-surface-container-low transition-colors border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-success/10 text-success flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-caption text-caption font-semibold text-ink">
                    Konsultasi Tele-Dermatologi Selesai
                  </span>
                  <span className="font-eyebrow text-eyebrow text-ink-subtle">
                    dr. Nadia Safira, Sp.DVE
                  </span>
                </div>
              </div>
              <span className="font-caption text-caption text-ink-muted">Kemarin</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
