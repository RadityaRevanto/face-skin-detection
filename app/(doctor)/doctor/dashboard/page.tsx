import type { Metadata } from "next";

import { DoctorHeader } from "@/components/doctor/doctor-header";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";

export const metadata: Metadata = {
  title: "Dashboard Dokter | Face Skin Detection",
  description: "Dashboard dokter - kelola skincare dan rekomendasi",
};

export default function DoctorDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-slate-950 dark:bg-[#f7fbf8] dark:text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DoctorSidebar />

        <div className="min-w-0 flex-1">
          <DoctorHeader
            title="Dashboard Dokter"
            description="Kelola skincare dan rekomendasi untuk pengguna."
            searchPlaceholder="Cari data skincare atau rekomendasi..."
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Dashboard
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                Selamat datang di panel dokter
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Gunakan sidebar untuk mengelola data skincare dan rekomendasi
                yang akan ditampilkan kepada pengguna.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
