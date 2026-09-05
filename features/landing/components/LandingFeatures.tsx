import type { LandingFeature } from "./LandingTypes";

export function LandingFeatures({
  features,
}: {
  features: LandingFeature[];
}) {
  return (
    <section id="fitur" className="scroll-mt-20 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Fitur Unggulan
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Semua yang Anda butuhkan untuk merawat kulit
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Dirancang agar sederhana namun bertenaga — dari deteksi hingga
            rekomendasi, semua dalam satu aplikasi.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
