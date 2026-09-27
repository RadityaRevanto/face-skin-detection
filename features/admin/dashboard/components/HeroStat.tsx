"use client";

import Link from "next/link";
import { ArrowRight, Clock3, ShieldQuestion } from "lucide-react";

/**
 * HeroStat — kartu aksi utama dashboard admin.
 * Ukuran & bobot visual lebih besar dari StatCard satelit:
 * angka pending verifikasi = keputusan paling penting hari ini.
 */
export function HeroStat({ value, href }: { value: string; href: string }) {
  const count = Number(value) || 0;
  const urgent = count > 0;

  return (
    <Link
      href={href}
      className="group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border border-[var(--role-accent)]/25 bg-[var(--role-accent)] p-5 text-white shadow-[var(--shadow-card)] transition-all duration-[var(--motion-base)] ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:p-6"
    >
      {/* Motif lingkaran dekoratif — memecah flat-nya blok solid */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 text-white opacity-[0.08]"
      >
        <circle cx="100" cy="100" r="96" fill="currentColor" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-2 top-2 h-28 w-28 text-white opacity-[0.12]"
      >
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="8" />
      </svg>

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {urgent ? "Butuh keputusan" : "Hari ini"}
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] bg-white/15">
            <ShieldQuestion className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <p className="mt-4 font-heading text-5xl font-extrabold leading-none tracking-tight tabular-nums sm:text-6xl">
          {value}
        </p>
        <p className="mt-2 text-sm font-semibold text-white/90">
          Verifikasi dokter menunggu
        </p>
        <p className="mt-0.5 text-xs text-white/65">
          {urgent
            ? "Review dokumen STR & setujui atau tolak pengajuan."
            : "Semua pengajuan sudah diproses. Kerja bagus."}
        </p>
      </div>

      <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5">
        {urgent ? "Review sekarang" : "Lihat riwayat verifikasi"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}