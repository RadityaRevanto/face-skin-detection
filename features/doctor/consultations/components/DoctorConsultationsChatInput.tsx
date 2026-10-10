"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";

type DoctorConsultationsChatInputProps = {
  isSending: boolean;
  onSendMessage: (content: string, mediaFile: File | null) => Promise<void>;
};

export function DoctorConsultationsChatInput({
  isSending,
  onSendMessage,
}: DoctorConsultationsChatInputProps) {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar melebihi batas 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSending || (!inputText.trim() && !selectedFile)) return;

    const text = inputText;
    const file = selectedFile;

    setInputText("");
    clearAttachment();

    await onSendMessage(text, file);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border/40 bg-surface p-3 sm:p-4">
      {/* Pratinjau Lampiran Gambar */}
      {previewUrl && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-surface-alt rounded-xl border border-border/50 max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Lampiran dokter"
            className="w-14 h-14 rounded-lg object-cover ring-1 ring-border/50 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-caption text-caption text-ink font-medium truncate">
              {selectedFile?.name}
            </p>
            <p className="font-caption text-[11px] text-ink-subtle">
              Foto lampiran medis siap dikirim
            </p>
          </div>
          <button
            type="button"
            onClick={clearAttachment}
            className="p-1 rounded-lg text-ink-subtle hover:text-error hover:bg-error-container/30 transition-colors"
            title="Hapus lampiran"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Formulir Input Pesan */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="doctor-consult-media-upload"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending}
          className="p-2.5 rounded-xl border border-border/50 bg-surface-alt hover:bg-surface-container text-ink-muted hover:text-role-accent-doctor transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          title="Lampirkan foto keluhan / panduan"
          aria-label="Lampirkan foto"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis instruksi medis, saran klinis, atau tanggapan untuk pasien..."
            rows={1}
            disabled={isSending}
            className="w-full resize-none py-2.5 px-3.5 bg-surface-alt border border-border/50 rounded-xl text-ink font-body-default text-body-default placeholder:text-ink-subtle focus:outline-hidden focus:ring-2 focus:ring-role-accent-doctor/30 focus:border-role-accent-doctor transition-all min-h-[42px] max-h-32"
          />
        </div>

        <button
          type="submit"
          disabled={isSending || (!inputText.trim() && !selectedFile)}
          className="p-2.5 rounded-xl bg-role-accent-doctor hover:bg-role-accent-doctor/90 text-white font-semibold transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          title="Kirim instruksi medis"
          aria-label="Kirim balasan"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      <div className="flex items-center justify-between mt-1.5 px-1">
        <span className="text-[10px] text-ink-subtle">
          Tekan Enter untuk mengirim, Shift+Enter untuk baris baru.
        </span>
        <span className="text-[10px] text-role-accent-doctor font-medium">
          Kanal Terenkripsi Pasien-Dokter
        </span>
      </div>
    </div>
  );
}
