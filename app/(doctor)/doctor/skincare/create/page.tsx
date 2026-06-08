import type { Metadata } from "next";
import Link from "next/link";

import { SkincareForm } from "@/app/(doctor)/doctor/skincare/_components/skincare-form";
import { DoctorHeader } from "@/components/doctor/doctor-header";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tambah Skincare | Face Skin Detection",
  description: "Tambah produk skincare baru - Dashboard Dokter",
};

export default function CreateSkincarePage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!">
      <div className="flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row">
        <DoctorSidebar />

        <div className="min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!">
          <DoctorHeader
            title="Tambah Skincare"
            description="Tambahkan produk skincare baru ke sistem rekomendasi."
            searchPlaceholder="Cari produk skincare..."
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <div>
                <Link
                  href={ROUTES.DOCTOR.SKINCARE}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                >
                  <span aria-hidden="true">←</span>
                  Kembali ke Data Skincare
                </Link>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                  Tambah Produk Skincare
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi informasi produk agar dapat digunakan pada
                  rekomendasi skincare pengguna.
                </p>
              </div>

              <SkincareForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
