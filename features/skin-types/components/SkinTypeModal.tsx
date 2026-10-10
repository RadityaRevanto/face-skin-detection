"use client";

import { useEffect, useState } from "react";
import { Stethoscope, X, Save, AlertCircle } from "lucide-react";
import type { SkinType } from "../types";

type SkinTypeModalProps = {
  isOpen: boolean;
  skinType?: SkinType | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
};

export function SkinTypeModal({
  isOpen,
  skinType,
  isSubmitting,
  onClose,
  onSubmit,
}: SkinTypeModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skinType) {
      setName(skinType.name || "");
      setDescription(skinType.description || "");
      setIsActive(true);
    } else {
      setName("");
      setDescription("");
      setIsActive(true);
    }
    setError(null);
  }, [skinType, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Nama jenis kulit wajib diisi.");
      return;
    }

    try {
      await onSubmit({
        name: trimmedName,
        description: description.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan skin type.");
    }
  }

  const isEditing = !!skinType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full p-6 relative overflow-hidden border border-border/50 animate-in fade-in zoom-in-95 duration-150">
        <div className="absolute top-0 left-0 right-0 h-1 bg-role-accent-doctor" />

        <div className="flex items-start justify-between pb-4">
          <div className="flex flex-col pr-4">
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="w-4 h-4 text-role-accent-doctor" />
              <span className="font-eyebrow text-eyebrow font-semibold uppercase text-role-accent-doctor">
                Formulir Dermatologi
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-ink tracking-tight">
              {isEditing ? `Edit Skin Type: ${skinType.name}` : "Tambah Skin Type Baru"}
            </h2>
            <p className="font-caption text-caption text-ink-muted mt-0.5">
              {isEditing ? "Perbarui definisi karakteristik dermatologi." : "Definisikan klasifikasi jenis kulit baku untuk sistem preskripsi."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl bg-error-container/30 border border-error/30 text-error font-caption text-caption font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="font-caption text-caption font-semibold text-ink flex items-center justify-between">
              <span>Nama Jenis Kulit</span>
              <span className="text-danger font-bold">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kulit Berminyak (Oily)"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-caption text-caption font-semibold text-ink flex items-center justify-between">
              <span>Deskripsi Karakteristik</span>
              <span className="text-ink-subtle font-normal">Detail Sebasea &amp; NMF</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan pola distribusi sebum, ukuran pori, dan reaktivitas barrier..."
              className="w-full p-3.5 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="pt-1 pb-1">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-alt border border-border/30">
              <div className="flex flex-col">
                <span className="font-headline-sm text-caption text-ink font-semibold">Status Keaktifan</span>
                <span className="font-caption text-caption text-ink-muted">Tersedia pada kuesioner diagnosis pasien</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-caption text-role-accent-doctor font-semibold">
                  {isActive ? "Aktif" : "Nonaktif"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${isActive ? "bg-role-accent-doctor" : "bg-border"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 mt-1 ml-1 ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/30">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-surface-alt hover:bg-surface-container-low text-ink font-headline-sm text-caption font-semibold transition-colors border border-border/40 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-role-accent-doctor hover:opacity-95 text-on-primary font-headline-sm text-caption font-semibold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Skin Type"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
