"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

type AdminPriorityAlertBannerProps = {
  pendingCount: number;
};

export function AdminPriorityAlertBanner({ pendingCount }: AdminPriorityAlertBannerProps) {
  if (pendingCount <= 0) {
    return (
      <section className="mt-6">
        <div className="relative overflow-hidden rounded-2xl bg-emerald-50 p-5 shadow-sm border border-emerald-200/60">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-emerald-950 font-semibold tracking-tight">
                  Semua Antrean Verifikasi Bersih
                </h2>
                <p className="font-body-default text-body-default text-emerald-900/80 text-xs">
                  Tidak ada pengajuan STR & SIP dokter yang tertunda saat ini.
                </p>
              </div>
            </div>
            <Link
              href="/admin/doctor-verifications"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-700 hover:bg-emerald-100 font-caption text-caption font-semibold transition-colors border border-emerald-200"
            >
              <span>Daftar Verifikasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="relative overflow-hidden rounded-2xl bg-amber-50 p-6 shadow-sm border border-amber-200/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 font-caption text-caption font-semibold">
                  Perlu Tindakan Segera
                </span>
                <span className="font-eyebrow text-eyebrow text-amber-700/80 uppercase tracking-wider">
                  Prioritas Klinis
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-amber-950 font-semibold tracking-tight">
                Verifikasi Dokter Menunggu ({pendingCount} Berkas)
              </h2>
              <p className="font-body-default text-body-default text-amber-900/80 max-w-3xl leading-relaxed">
                Terdapat {pendingCount} pengajuan SIP & STR dokter spesialis baru yang memerlukan validasi administratif sebelum status praktik diterbitkan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <Link
              href="/admin/doctor-verifications/pending"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-role-accent-admin hover:bg-role-accent-admin/90 text-white font-caption text-caption font-semibold shadow-md shadow-role-accent-admin/20 transition-all hover:translate-y-[-1px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tinjau Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
