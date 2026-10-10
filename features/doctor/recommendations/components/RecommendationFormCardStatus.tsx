"use client";

import { CheckCircle2, Save } from "lucide-react";

type RecommendationFormCardStatusProps = {
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
};

export function RecommendationFormCardStatus({
  isActive,
  setIsActive,
  isSubmitting,
  mode,
  onCancel,
}: RecommendationFormCardStatusProps) {
  return (
    <>
      {/* Kartu 3: Status Protokol */}
      <section className="bg-surface rounded-2xl p-6 shadow-xs border border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-caption text-ink font-semibold">
              Status Aktif Aturan
            </h3>
            <p className="font-caption text-caption text-ink-muted">
              Aturan aktif akan langsung diikutsertakan dalam mesin rekomendasi otomatis.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-headline-sm text-caption text-ink font-semibold select-none">
            {isActive ? "Aktif" : "Nonaktif"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/50 ${
              isActive ? "bg-role-accent-doctor" : "bg-border"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 mt-1 ml-1 ${
                isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-[264px] right-0 bg-surface/95 backdrop-blur-md border-t border-border/50 py-3 px-6 md:px-10 z-30 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-2 text-ink-subtle font-caption text-caption">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Tersinkron dengan Server Preskripsi Digital</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-surface-alt hover:bg-surface-container-low text-ink font-caption text-caption font-semibold transition-all border border-border/40 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-role-accent-doctor hover:opacity-95 text-on-primary font-caption text-caption font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSubmitting
                ? "Menyimpan..."
                : mode === "edit"
                  ? "Simpan Perubahan"
                  : "Simpan Aturan"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
