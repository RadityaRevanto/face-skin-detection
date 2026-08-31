import Link from "next/link";

export function DashboardQuickActions() {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Akses Cepat
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickActionLink
          href="/doctor/consultations"
          label="Konsultasi"
          description="Balas chat pengguna"
        />
        <QuickActionLink
          href="/doctor/skincare"
          label="Produk Skincare"
          description="Kelola produk"
        />
        <QuickActionLink
          href="/doctor/recommendations"
          label="Rekomendasi"
          description="Atur rule rekomendasi"
        />
        <QuickActionLink
          href="/doctor/skin-concerns"
          label="Skin Concern"
          description="Lihat data kondisi kulit"
        />
      </div>
    </section>
  );
}

function QuickActionLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition-all hover:border-emerald-200 hover:bg-emerald-50"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-700 group-hover:text-emerald-700">{label}</p>
        <p className="truncate text-[11px] text-slate-400">{description}</p>
      </div>
    </Link>
  );
}
