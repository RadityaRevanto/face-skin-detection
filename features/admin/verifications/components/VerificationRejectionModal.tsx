"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Gavel, X } from "lucide-react";

type VerificationRejectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isLoading?: boolean;
};

export function VerificationRejectionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: VerificationRejectionModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const presets = [
    {
      label: "STR Kedaluwarsa",
      text: "Berkas STR kedaluwarsa dan tidak aktif di pangkalan data KKI.",
    },
    {
      label: "Data Tidak Sinkron",
      text: "Indikasi ketidaksesuaian data STR dengan identitas KTP pemohon.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full p-6 flex flex-col gap-4 border border-border/50 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-danger font-semibold">
                Tolak Pengajuan Verifikasi
              </h3>
              <span className="font-caption text-caption text-ink-subtle">
                Penolakan permanen keanggotaan dokter
              </span>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-ink-subtle hover:text-ink p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Alert Box */}
        <div className="p-3.5 rounded-xl bg-danger/10 text-ink flex items-start gap-2.5 border border-danger/20">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <span className="font-caption text-[12px] leading-relaxed">
            Peringatan: Menolak pengajuan akan menonaktifkan izin praktik klinis dokter di platform SkinCek hingga permohonan baru diajukan kembali.
          </span>
        </div>

        {/* Textarea */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="inputAlasanPenolakan"
            className="font-caption text-caption font-semibold text-ink flex items-center justify-between"
          >
            <span>
              Alasan Penolakan <span className="text-danger">*</span>
            </span>
            <span className="font-eyebrow text-eyebrow text-ink-subtle">Wajib diisi</span>
          </label>
          <textarea
            id="inputAlasanPenolakan"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Berkas STR kedaluwarsa dan nomor STR tidak ditemukan di database resmi Konsil Kedokteran Indonesia (KKI)."
            className="w-full p-3.5 rounded-xl bg-surface-alt text-ink font-body-default text-body-default placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-danger transition-all resize-none border border-border/40"
          />
          <p className="font-caption text-[12px] text-ink-muted leading-relaxed">
            Alasan ini akan dikirimkan kepada dokter melalui email notifikasi resmi SkinCek.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-1.5">
          <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle font-semibold">
            Preset Alasan:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setReason(preset.text)}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-ink font-caption text-[11px] transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-surface-alt hover:bg-surface-container-high text-ink font-caption text-caption font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isLoading || !reason.trim()}
            onClick={() => onSubmit(reason.trim())}
            className="px-5 py-2.5 rounded-xl bg-danger hover:bg-danger/90 text-on-primary font-caption text-caption font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Gavel className="w-4 h-4" />
            <span>{isLoading ? "Memproses..." : "Konfirmasi Tolak"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
