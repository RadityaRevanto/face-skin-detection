import { Pencil, Trash2, Info } from "lucide-react";
import type { SkinType } from "../types";

type SkinTypesTableProps = {
  skinTypes: SkinType[];
  onEdit: (skinType: SkinType) => void;
  onDelete: (skinType: SkinType) => void;
};

export function SkinTypesTable({
  skinTypes,
  onEdit,
  onDelete,
}: SkinTypesTableProps) {
  return (
    <div className="bg-surface rounded-2xl shadow-xs border border-border/50 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border/40 text-ink">
              <th className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold w-[240px]">
                Nama Jenis Kulit
              </th>
              <th className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold">
                Deskripsi Karakteristik Dermatologi
              </th>
              <th className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold text-center w-[130px]">
                Status
              </th>
              <th className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold text-right w-[130px]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {skinTypes.map((skinType) => (
              <tr
                key={skinType.uuid}
                className="h-[60px] hover:bg-surface-alt/60 transition-colors group"
              >
                {/* Nama Jenis Kulit */}
                <td className="py-3.5 px-6 align-middle">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-role-accent-doctor/40 group-hover:bg-role-accent-doctor transition-colors" />
                    <span className="font-headline-sm text-caption font-semibold text-ink">
                      {skinType.name}
                    </span>
                  </div>
                </td>

                {/* Deskripsi Karakteristik */}
                <td className="py-3.5 px-6 align-middle">
                  <p className="font-body-default text-body-default text-ink-muted leading-relaxed line-clamp-2">
                    {skinType.description || "Karakteristik hidrasi dan sekresi sebum epidermis."}
                  </p>
                </td>

                {/* Status */}
                <td className="py-3.5 px-6 align-middle text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-success font-caption text-caption font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    Aktif
                  </span>
                </td>

                {/* Aksi */}
                <td className="py-3.5 px-6 align-middle text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(skinType)}
                      title="Edit Definisi"
                      aria-label={`Edit ${skinType.name}`}
                      className="p-2 rounded-lg text-ink-muted hover:text-role-accent-doctor hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(skinType)}
                      title="Hapus"
                      aria-label={`Hapus ${skinType.name}`}
                      className="p-2 rounded-lg text-ink-muted hover:text-danger hover:bg-error-container/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {skinTypes.length === 0 && (
        <div className="p-8 text-center text-ink-muted font-body-default text-body-default">
          Belum ada jenis kulit yang terdaftar. Tambahkan klasifikasi baru di atas.
        </div>
      )}

      {/* Subtext Info Bar replacing standard pagination */}
      <div className="bg-surface-alt/70 px-6 py-3 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-ink-subtle font-caption text-caption gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-role-accent-doctor shrink-0" />
          <span>
            Menampilkan {skinTypes.length} klasifikasi fisiologis baku dermatologi klinis (Non-paginated).
          </span>
        </div>
        <div className="font-medium text-ink-muted">
          Terakhir disinkronisasi: Database Master Konsili Medis
        </div>
      </div>
    </div>
  );
}
