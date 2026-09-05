import type { LandingStep } from "./LandingTypes";

export function LandingHowItWorks({ steps }: { steps: LandingStep[] }) {
  return (
    <section id="cara-kerja" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Cara Kerja
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Empat langkah mudah, hasil dalam sekejap
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Tidak perlu keahlian khusus. Cukup ikuti langkah berikut.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm"
            >
              <span className="text-4xl font-black text-emerald-500/30">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
