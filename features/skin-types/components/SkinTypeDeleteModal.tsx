import { AlertTriangle } from "lucide-react";
import type { SkinType } from "../types";

type SkinTypeDeleteModalProps = {
  skinType: SkinType | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function SkinTypeDeleteModal({
  skinType,
  isDeleting,
  onClose,
  onConfirm,
}: SkinTypeDeleteModalProps) {
  if (!skinType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full p-6 relative overflow-hidden transform transition-all border border-border/50 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-xl bg-error-container/40 text-danger flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-danger" />
        </div>

        <h3 className="font-headline-md text-headline-md font-bold text-ink mb-1.5">
          Hapus Skin Type?
        </h3>
        <p className="font-body-default text-body-default text-ink-muted mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus klasifikasi <strong className="text-ink font-semibold">{skinType.name}</strong>? Tindakan ini dapat mempengaruhi algoritma rekomendasi aktif.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl bg-surface-alt hover:bg-surface-container-low text-ink font-headline-sm text-caption font-semibold transition-colors border border-border/40 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-danger hover:opacity-95 text-white font-headline-sm text-caption font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? "Menghapus..." : "Hapus Klasifikasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
