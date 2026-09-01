"use client";

import { useState } from "react";
import type { SkinType } from "../types";
import { deleteSkinType } from "../services/skinTypesService";

type SkinTypeTableProps = {
  skinTypes: SkinType[];
  onEdit: (skinType: SkinType) => void;
  onRefresh: () => void;
};

export function SkinTypeTable({
  skinTypes,
  onEdit,
  onRefresh,
}: SkinTypeTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(uuid: string) {
    if (!confirm("Yakin ingin menghapus skin type ini?")) return;
    setIsDeleting(uuid);
    try {
      await deleteSkinType(uuid);
      onRefresh();
    } catch {
      alert("Gagal menghapus skin type");
    } finally {
      setIsDeleting(null);
    }
  }

  if (skinTypes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Belum ada skin types
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Tambahkan skin types baru untuk digunakan dalam rekomendasi
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Deskripsi
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Dibuat
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {skinTypes.map((skinType) => (
              <tr
                key={skinType.uuid}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {skinType.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500 line-clamp-2">
                    {skinType.description ?? "-"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-400">
                    {new Date(skinType.created_at).toLocaleDateString("id-ID")}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(skinType)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(skinType.uuid)}
                      disabled={isDeleting === skinType.uuid}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                    >
                      {isDeleting === skinType.uuid ? "..." : "Hapus"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
