import type { LandingStat } from "./landing-types";

export function LandingStats({ stats }: { stats: LandingStat[] }) {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-black text-emerald-600 sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
