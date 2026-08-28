"use client";

import { useState } from "react";
import type { SkinType } from "../types";
import { createSkinType, updateSkinType } from "../lib/skinTypesService";

type SkinTypeFormProps = {
  skinType?: SkinType | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function SkinTypeForm({
  skinType,
  onSuccess,
  onCancel,
}: SkinTypeFormProps) {
  const [name, setName] = useState(skinType?.name ?? "");
  const [description, setDescription] = useState(
    skinType?.description ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!skinType;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateSkinType(skinType.uuid, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await createSkinType({
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }
      onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan skin type";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="skin-type-name"
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          Nama Skin Type <span className="text-rose-500">*</span>
        </label>
        <input
          id="skin-type-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Oily, Dry, Combination"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label
          htmlFor="skin-type-description"
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          Deskripsi
        </label>
        <textarea
          id="skin-type-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat tentang skin type ini..."
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : isEditing
              ? "Simpan Perubahan"
              : "Tambah Skin Type"}
        </button>
      </div>
    </form>
  );
}
