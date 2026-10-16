"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, FlaskConical } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export type SkincareFormPageHeaderProps = {
  title: string;
  description: string;
};

export function SkincareFormPageHeader({
  title,
  description,
}: SkincareFormPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href={ROUTES.DOCTOR.SKINCARE}
        className="inline-flex items-center gap-2 text-ink-muted hover:text-role-accent-doctor transition-colors w-fit font-caption text-caption font-semibold group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Kembali ke Daftar Produk Skincare</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-role-accent-doctor/10 text-role-accent-doctor font-eyebrow text-eyebrow font-semibold uppercase tracking-wider">
              Formulasi Klinis Dokter
            </span>
            <span className="text-ink-subtle text-caption">&bull;</span>
            <span className="text-ink-subtle font-caption text-caption flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-role-accent-doctor" />
              <span>Dermatologist Verified Protocol</span>
            </span>
          </div>

          <h1 className="font-display text-display text-ink font-bold tracking-tight">
            {title}
          </h1>
          <p className="font-body-default text-body-default text-ink-muted mt-1">
            {description}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-surface p-2.5 rounded-xl shadow-xs border border-border/50 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-role-accent-doctor">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div className="pr-2">
            <p className="font-caption text-caption text-ink font-semibold">
              Katalog Formulasi Medis
            </p>
            <p className="font-eyebrow text-eyebrow text-ink-subtle">
              Standar Preskripsi Digital
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
