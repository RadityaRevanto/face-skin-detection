"use client";

import { CheckCircle2, Clock, UserPlus } from "lucide-react";

type DoctorHeaderCardProps = {
  verifiedCount: number;
  pendingCount: number;
  onOpenInviteModal: () => void;
};

export function DoctorHeaderCard({
  verifiedCount,
  pendingCount,
  onOpenInviteModal,
}: DoctorHeaderCardProps) {
  return (
    <div className="relative w-full rounded-2xl bg-surface shadow-sm p-6 border border-border/50">
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-role-accent-admin" />
            <span className="font-eyebrow text-eyebrow uppercase text-role-accent-admin font-semibold tracking-wider">
              DIREKTORI TENAGA MEDIS
            </span>
            
          </div>
          <h1 className="font-display text-display text-ink font-semibold tracking-tight">
            Manajemen Dokter
          </h1>
          <p className="font-body-default text-body-default text-ink-muted mt-1 leading-relaxed">
            Kelola dokter spesialis dermatologi, nomor STR, status verifikasi SIP, dan keaktifan akun klinis.
          </p>
        </div>

        {/* Quick Metrics Counters matching index4.html */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-alt shadow-sm border border-border/40">
            <div className="w-10 h-10 rounded-xl bg-role-accent-doctor/10 flex items-center justify-center text-role-accent-doctor">
              <CheckCircle2 className="w-5 h-5 text-role-accent-doctor" />
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm font-semibold text-ink leading-tight">
                {verifiedCount}
              </div>
              <div className="font-caption text-caption text-ink-subtle">
                Dokter Terverifikasi
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-alt shadow-sm border border-border/40">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm font-semibold text-ink leading-tight">
                {pendingCount}
              </div>
              <div className="font-caption text-caption text-ink-subtle">
                Menunggu SIP
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenInviteModal}
            className="h-11 px-5 rounded-xl bg-role-accent-admin hover:bg-secondary-container text-surface flex items-center gap-2 shadow-sm font-caption text-caption font-semibold transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Undang Spesialis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
