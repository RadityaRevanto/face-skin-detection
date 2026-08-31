"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

type Props = {
  role: "user" | "doctor";
  showDeleteConfirm: boolean;
  deleteConfirmText: string;
  isDeleting: boolean;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onConfirmTextChange: (value: string) => void;
};

export function DangerZoneCard({
  role,
  showDeleteConfirm,
  deleteConfirmText,
  isDeleting,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  onConfirmTextChange,
}: Props) {
  return (
    <div className="bg-rose-50 rounded-2xl p-6 border border-rose-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-xl text-rose-600 shadow-sm">
          <AlertTriangle size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-rose-900 mb-1">Zona Berbahaya</h3>
          <p className="text-sm text-rose-700 mb-4 leading-relaxed">
            Tindakan ini akan menghapus akun Anda secara permanen beserta seluruh riwayat *scan*, obrolan, dan sisa langganan *Skincek Pro* Anda (jika ada). Data yang telah dihapus tidak dapat dipulihkan kembali.
          </p>
          {role === "doctor" && (
            <p className="text-sm text-rose-800 mb-4 leading-relaxed rounded-xl bg-white/70 border border-rose-200 px-4 py-3">
              <strong className="font-bold">Perhatian khusus dokter:</strong> seluruh konten yang Anda buat (produk skincare, rekomendasi perawatan) dan riwayat konsultasi dengan pasien juga akan dihapus permanen setelah masa tenggang 30 hari.
            </p>
          )}

          {!showDeleteConfirm ? (
            <button
              onClick={onRequestDelete}
              className="px-4 py-2 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Hapus Akun Permanen
            </button>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-rose-200 mt-2">
              <p className="text-sm font-medium text-slate-900 mb-2">Ketik <strong className="text-rose-600 select-none">HAPUS AKUN SAYA</strong> untuk mengonfirmasi:</p>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="HAPUS AKUN SAYA"
                value={deleteConfirmText}
                onChange={(e) => onConfirmTextChange(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={onConfirmDelete}
                  disabled={isDeleting || deleteConfirmText !== "HAPUS AKUN SAYA"}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isDeleting ? "Menghapus..." : "Konfirmasi Hapus"}
                </button>
                <button
                  onClick={onCancelDelete}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
