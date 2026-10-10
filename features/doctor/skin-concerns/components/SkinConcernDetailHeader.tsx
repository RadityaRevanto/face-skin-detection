import Link from "next/link";
import { ArrowLeft, Edit3, Activity } from "lucide-react";
import { ROUTES } from "@/lib/constants";

type SkinConcernDetailHeaderProps = {
  name: string;
  onEditClick: () => void;
};

export function SkinConcernDetailHeader({
  name,
  onEditClick,
}: SkinConcernDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Top Nav & Quick Status */}
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.DOCTOR.SKIN_CONCERNS}
          className="inline-flex items-center gap-1.5 text-role-accent-doctor hover:underline font-headline-sm text-caption font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Skin Concern</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-full border border-border/40 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-role-accent-doctor animate-pulse" />
          <span className="font-caption text-caption text-ink font-semibold">
            ICD-11: Clinical Reference
          </span>
          <span className="text-ink-subtle text-caption">•</span>
          <span className="font-caption text-caption text-ink-muted">
            Clinical Synced
          </span>
        </div>
      </div>

      {/* Title & Action Trigger */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div className="flex flex-col gap-1 max-w-3xl">
          <span className="font-eyebrow text-eyebrow text-role-accent-doctor uppercase tracking-wider font-bold">
            Detail Referensi Dermatologi
          </span>
          <h1 className="font-display text-display text-ink font-bold tracking-tight">
            {name}
          </h1>
          <p className="font-body-default text-body-default text-ink-muted leading-relaxed">
            Referensi medis patologi, manifestasi klinis, dan panduan diagnosis AI untuk dokter.
          </p>
        </div>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onEditClick}
            className="inline-flex items-center gap-2 bg-role-accent-doctor hover:opacity-95 text-on-primary font-headline-sm text-caption font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Deskripsi Medis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
