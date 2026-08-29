import Link from "next/link";

import { ArrowRightIcon, CheckIcon } from "./LandingIcons";

function ResultPreview() {
  const problems = [
    { name: "Jerawat", value: 12, color: "bg-amber-400" },
    { name: "Kemerahan", value: 8, color: "bg-rose-400" },
    { name: "Kulit Kering", value: 5, color: "bg-cyan-400" },
  ];

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-emerald-100/50 ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">
          Ringkasan Kondisi Kulit
        </h3>
        <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Hasil Scan
        </span>
      </div>

      <div className="mt-6 flex items-center gap-5">
        <div
          className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{
            background:
              "conic-gradient(#10b981 0 331deg, #e2e8f0 331deg 360deg)",
          }}
        >
          <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-white">
            <span className="text-xl font-black text-slate-900">92%</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-lg font-black text-emerald-600">Kulit Sehat</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Confidence tinggi dari analisis AI.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {problems.map((problem) => (
          <div key={problem.name} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-slate-500">
              {problem.name}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${problem.color}`}
                style={{ width: `${problem.value}%` }}
              />
            </div>
            <span className="w-9 text-right text-xs font-bold text-slate-700">
              {problem.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingBenefits({ benefits }: { benefits: string[] }) {
  return (
    <section id="keunggulan" className="scroll-mt-20 bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Kenapa SkinCheck
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Perawatan kulit yang cerdas, praktis, dan personal
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            SkinCheck membantu Anda memahami kondisi kulit tanpa ribet,
            kapan pun Anda butuh.
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
          >
            Coba Sekarang
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <ResultPreview />
      </div>
    </section>
  );
}
