"use client";

import { useState } from "react";
import {
  Ban,
  CheckCircle2,
  Edit3,
  FileEdit,
  Gavel,
  History,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { DoctorVerificationDetail } from "../lib/verificationDetailTypes";

type VerificationDecisionPanelProps = {
  doctor: DoctorVerificationDetail;
  isSubmitting?: boolean;
  onApprove: () => void;
  onOpenRevisionModal: () => void;
  onOpenRejectionModal: () => void;
};

export function VerificationDecisionPanel({
  doctor,
  isSubmitting,
  onApprove,
  onOpenRevisionModal,
  onOpenRejectionModal,
}: VerificationDecisionPanelProps) {
  const [chkStr, setChkStr] = useState(true);
  const [chkSip, setChkSip] = useState(true);
  const [chkIjazah, setChkIjazah] = useState(true);

  const isPending = doctor.rawStatus === "pending";
  const isNeedsRevision = doctor.rawStatus === "needs_revision";
  const isApproved = doctor.rawStatus === "approved";
  const isRejected = doctor.rawStatus === "rejected";

  return (
    <div className="lg:sticky lg:top-20 flex flex-col gap-4">
      {/* 1. Main Interactive Decision Card (When Pending or Needs Revision) */}
      {(isPending || isNeedsRevision) && (
        <div className="bg-surface rounded-2xl p-6 shadow-md flex flex-col gap-4 relative overflow-hidden border border-border/50">
          {/* Subtle Top Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-role-accent-admin via-role-accent-doctor to-info" />

          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-eyebrow text-eyebrow uppercase tracking-wider text-role-accent-admin font-semibold">
                TINDAKAN ADMINISTRATOR
              </span>
              <Gavel className="w-4 h-4 text-ink-subtle" />
            </div>
            <h2 className="font-headline-md text-headline-md text-ink font-semibold">
              Keputusan Verifikasi Berkas
            </h2>
            <p className="font-caption text-caption text-ink-muted leading-relaxed">
              Tinjau keabsahan dokumen KKI & SIP sebelum mengaktifkan akun operasional dokter.
            </p>
          </div>

          {/* Checklist Validasi Cepat */}
          <div className="p-3.5 rounded-xl bg-surface-alt flex flex-col gap-2 border border-border/30">
            <span className="font-eyebrow text-[11px] text-ink-subtle uppercase font-semibold">
              Checklist Validasi Cepat:
            </span>
            <label className="flex items-center gap-2 cursor-pointer font-caption text-[12px] text-ink">
              <input
                type="checkbox"
                checked={chkStr}
                onChange={(e) => setChkStr(e.target.checked)}
                className="w-4 h-4 rounded text-role-accent-admin accent-role-accent-admin"
              />
              <span>STR terdaftar aktif di Konsil Kedokteran</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-caption text-[12px] text-ink">
              <input
                type="checkbox"
                checked={chkSip}
                onChange={(e) => setChkSip(e.target.checked)}
                className="w-4 h-4 rounded text-role-accent-admin accent-role-accent-admin"
              />
              <span>Masa berlaku SIP masih memenuhi syarat (&gt;6 bln)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-caption text-[12px] text-ink">
              <input
                type="checkbox"
                checked={chkIjazah}
                onChange={(e) => setChkIjazah(e.target.checked)}
                className="w-4 h-4 rounded text-role-accent-admin accent-role-accent-admin"
              />
              <span>Kesesuaian nama pada KTP & Ijazah FK</span>
            </label>
          </div>

          {/* Three Decision Actions */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onApprove}
              className="w-full h-11 px-4 rounded-xl bg-success hover:bg-success/90 text-on-primary font-caption text-caption font-semibold flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? "Memproses..." : "Setujui Verifikasi"}</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onOpenRevisionModal}
              className="w-full h-11 px-4 rounded-xl bg-info/10 hover:bg-info/15 text-info font-caption text-caption font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <FileEdit className="w-5 h-5" />
              <span>Minta Revisi</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onOpenRejectionModal}
              className="w-full h-11 px-4 rounded-xl bg-danger/10 hover:bg-danger/15 text-danger font-caption text-caption font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
              <span>Tolak Pengajuan</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="font-eyebrow text-eyebrow text-ink-subtle">
              Tindakan ini akan tercatat dalam log audit resmi sistem SkinCek.
            </span>
          </div>
        </div>
      )}

      {/* 2. Read-Only Status: DITOLAK */}
      {isRejected && (
        <div className="bg-danger/10 rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-danger/20">
          <div className="flex items-center gap-2 text-danger">
            <Ban className="w-6 h-6" />
            <span className="font-headline-sm text-headline-sm font-semibold">
              Status: Ditolak
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface flex flex-col gap-1 shadow-sm border border-border/30">
            <span className="font-eyebrow text-eyebrow uppercase text-danger font-semibold">
              Alasan Penolakan:
            </span>
            <p className="font-caption text-caption text-ink font-medium leading-relaxed">
              {doctor.rejectionReason ||
                "Berkas tidak memenuhi kelayakan legalitas konsil kedokteran."}
            </p>
          </div>
          <div className="flex items-center justify-between text-ink-subtle font-caption text-[11px] pt-1">
            <span>Diverifikasi oleh: Admin SkinCek</span>
            <span>{doctor.reviewedAt || doctor.submittedAt}</span>
          </div>
        </div>
      )}

      {/* 3. Read-Only Status: DISETUJUI */}
      {isApproved && (
        <div className="bg-success/10 rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-success/20">
          <div className="flex items-center gap-2 text-success">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-headline-sm text-headline-sm font-semibold">
              Status: Terverifikasi Aktif
            </span>
          </div>
          <p className="font-caption text-caption text-ink-muted leading-relaxed">
            Akun dokter telah aktif sepenuhnya. Kredensial telah diverifikasi dengan KKI & SatuSehat Kemenkes RI.
          </p>
          <div className="flex items-center justify-between text-ink-subtle font-caption text-[11px] pt-1">
            <span>Diverifikasi oleh: Admin SkinCek</span>
            <span>{doctor.reviewedAt || doctor.submittedAt}</span>
          </div>
        </div>
      )}

      {/* 4. Mini Timeline Histori */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-caption text-caption font-semibold text-ink">
            <History className="w-4 h-4 text-ink-subtle" />
            <span>Histori Log Akun</span>
          </div>
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Aktivitas
          </span>
        </div>
        <div className="flex flex-col gap-2.5 font-caption text-[12px]">
          <div className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-role-accent-admin mt-1.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-ink font-medium">Pengajuan dokumen verifikasi</span>
              <span className="text-ink-subtle text-[11px]">
                {doctor.submittedAt} oleh {doctor.name}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-ink-subtle mt-1.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-ink font-medium">Registrasi profil dokter</span>
              <span className="text-ink-subtle text-[11px]">via Web App SkinCek</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
