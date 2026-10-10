import { Plus, CheckCircle2 } from "lucide-react";

type SkinTypesHeaderProps = {
  activeCount: number;
  totalCount: number;
  onAddClick: () => void;
};

export function SkinTypesHeader({
  activeCount,
  totalCount,
  onAddClick,
}: SkinTypesHeaderProps) {
  return (
    <section className="bg-surface rounded-2xl shadow-xs border border-border/50 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-eyebrow text-eyebrow uppercase font-bold text-role-accent-doctor tracking-wider">
            Klasifikasi Dermis
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-ink font-bold tracking-tight">
          Kelola Skin Types
        </h1>
        <p className="font-body-default text-body-default text-ink-muted mt-0.5 max-w-2xl leading-relaxed">
          Karakteristik profil kelenjar sebasea dan tingkat hidrasi barrier kulit pasien untuk akurasi algoritma rekomendasi perawatan.
        </p>
      </div>

      {/* Action Slot */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low border border-border/40 text-ink">
          <CheckCircle2 className="w-4 h-4 text-role-accent-doctor" />
          <span className="font-caption text-caption font-semibold text-ink">
            {activeCount} / {totalCount} Tipe Aktif
          </span>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-role-accent-doctor hover:opacity-95 text-on-primary font-headline-sm text-caption font-semibold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skin Type</span>
        </button>
      </div>
    </section>
  );
}
