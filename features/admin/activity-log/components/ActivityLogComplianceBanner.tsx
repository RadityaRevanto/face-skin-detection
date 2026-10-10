"use client";

import { ShieldCheck } from "lucide-react";

export function ActivityLogComplianceBanner() {
  return (
    <div className="mt-6 p-6 rounded-xl bg-surface-container-low/40 border border-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-role-accent-admin/10 flex items-center justify-center text-role-accent-admin shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-ink font-semibold">
            Jaminan Keamanan Rekam Audit Kemenkes SATUSEHAT
          </span>
          <p className="font-caption text-caption text-ink-muted mt-0.5">
            Setiap entri log diberi stempel waktu tersertifikasi (RFC 3161) dan tidak dapat dimodifikasi oleh superadmin manapun untuk keperluan investigasi forensik digital.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3 py-1.5 rounded-lg bg-surface font-caption text-caption text-ink font-mono font-medium shadow-sm border border-border/30">
          Node #ID-JKT-04
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-surface font-caption text-caption text-success font-medium shadow-sm border border-border/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>Sinkron SATUSEHAT</span>
        </span>
      </div>
    </div>
  );
}
