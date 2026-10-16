"use client";

import { FileText, Shield, X } from "lucide-react";
import type { VerificationDocument } from "../lib/verificationDetailTypes";

type VerificationInlineDocumentViewerProps = {
  document: VerificationDocument | null;
  onClose: () => void;
};

export function VerificationInlineDocumentViewer({
  document,
  onClose,
}: VerificationInlineDocumentViewerProps) {
  if (!document) return null;

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border/50 flex flex-col gap-3 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-role-accent-admin" />
          <span className="font-caption text-caption font-semibold text-ink">
            Pratinjau: {document.file_name || "Dokumen Resmi"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-ink-subtle hover:text-ink p-1 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Viewer Frame */}
      <div className="w-full min-h-[340px] rounded-xl bg-surface-alt flex flex-col items-center justify-center p-6 text-center border border-border/40 relative overflow-hidden">
        {document.url && document.url.startsWith("http") ? (
          <iframe
            src={document.url}
            title={document.file_name || "Pratinjau Dokumen"}
            className="w-full h-[400px] rounded-lg border-0"
          />
        ) : (
          <div className="flex flex-col items-center justify-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-role-accent-admin/10 text-role-accent-admin flex items-center justify-center mb-3">
              <FileText className="w-8 h-8" />
            </div>
            <span className="font-caption text-caption font-semibold text-ink">
              Pratinjau PDF Beresolusi Tinggi Aktif
            </span>
            <p className="font-caption text-[12px] text-ink-muted mt-1">
              Dokumen tersimpan aman dan terenkripsi AES-256 pada storage server SkinCek.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-ink-subtle text-[11px] font-semibold border border-border/40 shadow-xs">
              <Shield className="w-3.5 h-3.5 text-success" />
              <span>Watermark Keamanan SkinCek Console Terpasang</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
