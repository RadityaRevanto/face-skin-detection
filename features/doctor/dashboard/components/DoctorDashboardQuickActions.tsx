"use client";

import Link from "next/link";
import { Plus, FlaskConical, GitBranch } from "lucide-react";

export function DoctorDashboardQuickActions() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
      {/* Action 1: Tambah Formula Skincare */}
      <div className="bg-surface p-space-lg rounded-xl shadow-xs border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:shadow-sm transition-shadow">
        <div className="flex items-start gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-role-accent-doctor shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
              Tambah Formula Skincare
            </h3>
            <p className="font-body-default text-body-default text-ink-muted mt-0.5">
              Daftarkan cleanser, serum, moisturizer baru ke katalog klinik Anda.
            </p>
          </div>
        </div>
        <Link
          href="/doctor/skincare/create"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-space-md h-10 rounded-[10px] bg-role-accent-doctor text-on-primary font-caption text-caption font-semibold shadow-xs hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Formula Baru</span>
        </Link>
      </div>

      {/* Action 2: Buat Aturan Rekomendasi */}
      <div className="bg-surface p-space-lg rounded-xl shadow-xs border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:shadow-sm transition-shadow">
        <div className="flex items-start gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-ink shrink-0">
            <GitBranch className="w-6 h-6 text-role-accent-admin" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
              Buat Aturan Rekomendasi
            </h3>
            <p className="font-body-default text-body-default text-ink-muted mt-0.5">
              Hubungkan diagnosa AI dengan produk perawatan untuk saran instan.
            </p>
          </div>
        </div>
        <Link
          href="/doctor/recommendations/create"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-space-md h-10 rounded-[10px] bg-surface-container text-role-accent-doctor font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Aturan</span>
        </Link>
      </div>
    </section>
  );
}
