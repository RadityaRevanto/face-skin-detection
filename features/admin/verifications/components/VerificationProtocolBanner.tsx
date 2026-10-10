"use client";

import { ShieldAlert, Lock } from "lucide-react";

export function VerificationProtocolBanner() {
  return (
    <div className="bg-surface-alt rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-role-accent-admin shadow-sm shrink-0 border border-border/40">
          <ShieldAlert className="w-5 h-5 text-role-accent-admin" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-ink font-semibold">
            Protokol Verifikasi SkinCek ID
          </span>
          <span className="font-caption text-caption text-ink-muted">
            Sesuai Peraturan Konsil Kedokteran Indonesia No. 90/KKI/PER/2024 tentang Telekonsultasi Dermatologi
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-ink-subtle font-caption text-caption shrink-0">
        <Lock className="w-4 h-4 text-success" />
        <span className="text-ink-muted font-medium">Enkripsi 256-bit SIP Validated</span>
      </div>
    </div>
  );
}
