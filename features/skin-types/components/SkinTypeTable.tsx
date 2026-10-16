"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { customToast } from "@/lib/custom-toast";
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
  const [pendingDelete, setPendingDelete] = useState<SkinType | null>(null);

  async function handleDelete() {
    if (!pendingDelete) return;
    setIsDeleting(pendingDelete.uuid);
    try {
      await deleteSkinType(pendingDelete.uuid);
      customToast.success("Skin type dihapus");
      setPendingDelete(null);
      onRefresh();
    } catch {
      customToast.error("Gagal menghapus skin type");
    } finally {
      setIsDeleting(null);
    }
  }

  if (skinTypes.length === 0) {
    return (
      <EmptyState
        title="Belum ada skin type"
        description="Tambahkan skin type baru untuk dipakai dalam sistem rekomendasi."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-slate-100 bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Nama
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Deskripsi
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Dibuat
                </th>
                <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skinTypes.map((skinType) => (
                <tr
                  key={skinType.uuid}
                  className="transition-colors hover:bg-[var(--role-accent-soft)]/40"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {skinType.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="line-clamp-2 text-sm text-slate-500">
                      {skinType.description ?? "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 tabular-nums">
                      {new Date(skinType.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(skinType)}
                        aria-label="Edit skin type"
                        title="Edit"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] text-slate-400 transition-colors hover:bg-[var(--role-accent-soft)] hover:text-[var(--role-accent-strong)]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(skinType)}
                        disabled={isDeleting === skinType.uuid}
                        aria-label="Hapus skin type"
                        title="Hapus"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Hapus skin type?"
        description={`"${pendingDelete?.name ?? ""}" akan dihapus permanen.`}
        confirmLabel="Hapus Skin Type"
        tone="danger"
        loading={isDeleting !== null}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}