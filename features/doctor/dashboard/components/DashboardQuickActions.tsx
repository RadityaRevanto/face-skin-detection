import Link from "next/link";

export function DashboardQuickActions() {
  return (
    <section className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
      <h2 className="mb-4 text-base font-bold text-slate-900">
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
      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition-all duration-[var(--motion-base)] ease-out hover:-translate-y-0.5 hover:border-[var(--role-accent)]/40 hover:bg-[var(--role-accent-soft)] hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:bg-[var(--role-accent)] group-hover:text-white">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-700 group-hover:text-[var(--role-accent-strong)]">{label}</p>
        <p className="truncate text-[11px] text-slate-400">{description}</p>
      </div>
    </Link>
  );
}
