import Link from "next/link";

type DashboardGreetingProps = {
  fullName: string | null;
};

export function DashboardGreeting({ fullName }: DashboardGreetingProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
        Dashboard
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
        Selamat datang, {fullName ?? "Dokter"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Kelola produk skincare, rekomendasi, dan pantau aktivitas konsultasi
        pengguna dari satu tempat.
      </p>
    </section>
  );
}
