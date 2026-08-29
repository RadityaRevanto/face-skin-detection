import Link from "next/link";

import { Logo } from "./LandingIcons";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                SkinCheck
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Deteksi kondisi kulit wajah dengan AI. Cepat, praktis, dan
              membantu Anda merawat kulit lebih baik.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">Produk</p>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500">
              <li>
                <a
                  href="#fitur"
                  className="transition-colors hover:text-emerald-600"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a
                  href="#cara-kerja"
                  className="transition-colors hover:text-emerald-600"
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <a
                  href="#keunggulan"
                  className="transition-colors hover:text-emerald-600"
                >
                  Keunggulan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">Akun</p>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500">
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-emerald-600"
                >
                  Masuk
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-emerald-600"
                >
                  Daftar
                </Link>
              </li>
              <li>
                <Link
                  href="/register/doctor"
                  className="transition-colors hover:text-emerald-600"
                >
                  Daftar sebagai Dokter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © 2026 SkinCheck. Semua hak dilindungi.
          </p>
          <p className="text-xs text-slate-400">
            Hasil analisis bersifat informatif, bukan pengganti diagnosis
            medis profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
