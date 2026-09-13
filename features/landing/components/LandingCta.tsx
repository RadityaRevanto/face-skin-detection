import Link from "next/link";


export function LandingCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-[40px] bg-emerald-600 px-6 py-14 text-center shadow-sm sm:px-12 lg:py-20">

        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Siap cek kondisi kulit wajah Anda?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
          Mulai gratis dalam hitungan menit. Tidak perlu perangkat khusus —
          cukup kamera atau foto.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50 sm:w-auto"
          >
            Mulai Gratis Sekarang
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/40 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            Masuk
          </Link>
        </div>
      </div>
    </section>
  );
}
