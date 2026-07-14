import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Dokter | Face Skin Detection",
  description: "Dashboard dokter - kelola skincare dan rekomendasi",
};

export default function DoctorDashboardPage() {
  return (
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
  );
}
