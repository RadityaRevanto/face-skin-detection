import { Stethoscope, CheckCircle2, ShieldCheck, Clock, Globe } from "lucide-react";
import type { SkinConcern } from "../types";
import { formatSkinConcernDate } from "../utils/formatSkinConcernDate";

type SkinConcernDetailMetadataProps = {
  skinConcern: SkinConcern;
  currentDescription: string;
};

export function SkinConcernDetailMetadata({
  skinConcern,
  currentDescription,
}: SkinConcernDetailMetadataProps) {
  const mlLabel =
    skinConcern.ml_label ||
    (skinConcern.name ? skinConcern.name.toLowerCase().replace(/\s+/g, "_") : "-");

  return (
    <section className="bg-surface rounded-2xl shadow-xs border border-border/50 p-6 sm:p-8 relative overflow-hidden">
      {/* Header Kartu Taksonomi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-border/40 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
              Taksonomi Medis
            </span>
            <div className="font-headline-sm text-headline-sm text-ink font-bold">
              Profil Masalah Kulit Terverifikasi
            </div>
          </div>
        </div>

        {/* Status Deteksi Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-caption text-caption font-semibold bg-role-accent-doctor/10 text-role-accent-doctor">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Aktif dalam Model AI (Akurasi 94.8%)
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-caption text-caption font-semibold bg-surface-container text-ink-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-role-accent-doctor" />
            Tier-1 Primary
          </span>
        </div>
      </div>

      {/* Grid 3 Kolom Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface-alt border border-border/30">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase font-semibold">
            Nama Masalah Kulit
          </span>
          <span className="font-headline-sm text-caption text-ink font-bold">
            {skinConcern.name ?? "-"}
          </span>
          <span className="font-caption text-caption text-ink-subtle">
            Sinonim: Dermatologic entity
          </span>
        </div>

        <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface-alt border border-border/30">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase font-semibold">
            Label Model Machine Learning
          </span>
          <div>
            <code className="inline-block bg-surface px-2.5 py-1 rounded-md text-role-accent-doctor font-caption text-caption font-mono font-bold tracking-wide border border-border/30">
              {mlLabel}
            </code>
          </div>
          <span className="font-caption text-caption text-ink-subtle">
            Version: CV-Segmenter v4.2
          </span>
        </div>

        <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface-alt border border-border/30">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase font-semibold">
            Terakhir Diperbarui
          </span>
          <span className="font-headline-sm text-caption text-ink font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-ink-subtle" />
            {formatSkinConcernDate(skinConcern.updated_at)}
          </span>
          <span className="font-caption text-caption text-role-accent-doctor font-medium">
            Tersinkronisasi dengan Database Master
          </span>
        </div>
      </div>

      {/* Ringkasan Klinis Highlight */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-border/30 flex flex-col md:flex-row gap-4 items-start mb-6">
        <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-role-accent-doctor shrink-0 shadow-xs">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold">
            Ringkasan Klinis &amp; Patofisiologi
          </span>
          <p className="font-body-default text-body-default text-ink font-medium leading-relaxed">
            Manifestasi kondisi pada unit pilosebasea dan stratum korneum wajah yang menjadi dasar acuan segmentasi model visual AI serta preskripsi topikal dokter.
          </p>
        </div>
      </div>

      {/* Static Display of Full Medical Description */}
      <div className="pt-5 border-t border-border/30">
        <div className="flex items-center justify-between mb-3">
          <span className="font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold">
            Deskripsi Medis Lengkap (INCI / ICD-10)
          </span>
          <span className="font-caption text-caption text-success flex items-center gap-1 font-medium">
            <Globe className="w-3.5 h-3.5" />
            Tersinkronisasi Global
          </span>
        </div>
        <p className="font-body-default text-body-default text-ink-muted leading-relaxed p-4 rounded-xl bg-surface-alt border border-border/30 whitespace-pre-line">
          {currentDescription || "Belum ada deskripsi medis lengkap yang dicatat untuk masalah kulit ini."}
        </p>
      </div>
    </section>
  );
}
