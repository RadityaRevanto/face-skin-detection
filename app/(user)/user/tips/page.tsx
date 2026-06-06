import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tips | Face Skin Detection",
  description: "Tips perawatan kulit wajah berdasarkan kondisi kulit Anda",
};

export default function TipsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
          Tips Perawatan
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Tips menjaga kesehatan kulit wajah
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Temukan panduan perawatan kulit, kebiasaan harian, dan rekomendasi
          sederhana untuk membantu menjaga kulit tetap sehat.
        </p>
      </section>
    </main>
  );
}
