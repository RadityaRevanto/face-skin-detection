"use client";

import { useEffect, useState } from "react";
import { Edit3, Send, X } from "lucide-react";

type VerificationRevisionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  isLoading?: boolean;
};

export function VerificationRevisionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: VerificationRevisionModalProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNote("");
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
      label: "Dokumen buram",
      text: "Hasil pemindaian STR buram/terpotong, mohon unggah dokumen utuh beresolusi tinggi.",
    },
    {
      label: "SIP hampir kedaluwarsa",
      text: "SIP mendekati masa tenggang kurang dari 1 bulan, mohon sertakan surat pengurusan perpanjangan resmi.",
    },
    {
      label: "Perbedaan ejaan nama",
      text: "Nama gelar spesialis pada STR dan KTP memiliki perbedaan ejaan, mohon lampirkan klarifikasi.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full p-6 flex flex-col gap-4 border border-border/50 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
                Minta Revisi Dokumen
              </h3>
              <span className="font-caption text-caption text-ink-subtle">
                Permintaan koreksi berkas dokter
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

        {/* Textarea */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="inputCatatanRevisi"
            className="font-caption text-caption font-semibold text-ink flex items-center justify-between"
          >
            <span>
              Catatan Revisi <span className="text-danger">*</span>
            </span>
            <span className="font-eyebrow text-eyebrow text-ink-subtle">Wajib diisi</span>
          </label>
          <textarea
            id="inputCatatanRevisi"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Foto scan SIP Dinkes buram pada bagian stempel dan tanggal kedaluwarsa. Mohon unggah kembali dokumen hasil pemindaian scanner asli dengan resolusi minimal 300 DPI."
            className="w-full p-3.5 rounded-xl bg-surface-alt text-ink font-body-default text-body-default placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-info transition-all resize-none border border-border/40"
          />
          <p className="font-caption text-[12px] text-ink-muted leading-relaxed">
            Dokter akan melihat catatan ini di halaman status verifikasi dan dapat mengajukan ulang perbaikan dokumen.
          </p>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-col gap-1.5">
          <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle font-semibold">
            Saran Preset Cepat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setNote(preset.text)}
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
            disabled={isLoading || !note.trim()}
            onClick={() => onSubmit(note.trim())}
            className="px-5 py-2.5 rounded-xl bg-info hover:bg-info/90 text-on-primary font-caption text-caption font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? "Mengirim..." : "Kirim Permintaan Revisi"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
