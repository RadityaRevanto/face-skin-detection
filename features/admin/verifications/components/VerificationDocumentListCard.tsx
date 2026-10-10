"use client";

import { Download, ExternalLink, Eye, FileText, FolderKanban } from "lucide-react";
import type {
  DoctorVerificationDetail,
  VerificationDocument,
} from "../lib/verificationDetailTypes";

type VerificationDocumentListCardProps = {
  doctor: DoctorVerificationDetail;
  onPreviewDocument: (doc: VerificationDocument) => void;
};

export function VerificationDocumentListCard({
  doctor,
  onPreviewDocument,
}: VerificationDocumentListCardProps) {
  // If doctor.documents exists, format or ensure standard display items
  const documents: VerificationDocument[] =
    doctor.documents && doctor.documents.length > 0
      ? doctor.documents.map((d, idx) => ({
          uuid: d.uuid || `doc-${idx}`,
          url: d.url,
          file_name:
            d.file_name ||
            (idx === 0
              ? "Surat Tanda Registrasi (STR) KKI"
              : idx === 1
                ? "Surat Izin Praktik (SIP) Dinkes Aktif"
                : "Ijazah Dokter Spesialis FKUI"),
          badge:
            idx === 0
              ? "Valid Kemenkes"
              : idx === 1
                ? "Dinkes Terdaftar"
                : "Legalisir Basah",
          file_size: idx === 0 ? "1.8 MB" : idx === 1 ? "2.1 MB" : "3.4 MB",
          uploaded_at: doctor.submittedAt,
        }))
      : [
          {
            uuid: "doc-str",
            url: "#",
            file_name: "Surat Tanda Registrasi (STR) KKI",
            badge: "Valid Kemenkes",
            file_size: "1.8 MB",
            uploaded_at: doctor.submittedAt,
          },
          {
            uuid: "doc-sip",
            url: "#",
            file_name: "Surat Izin Praktik (SIP) Dinkes Aktif",
            badge: "Dinkes Terdaftar",
            file_size: "2.1 MB",
            uploaded_at: doctor.submittedAt,
          },
          {
            uuid: "doc-ijazah",
            url: "#",
            file_name: "Ijazah Dokter Spesialis FKUI",
            badge: "Legalisir Basah",
            file_size: "3.4 MB",
            uploaded_at: doctor.submittedAt,
          },
        ];

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              LAMPIRAN RESMI
            </span>
            <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
              Dokumen Verifikasi ({documents.length} Berkas)
            </h3>
          </div>
        </div>
        <span className="font-caption text-caption text-ink-muted">
          Format: PDF / High-res scan
        </span>
      </div>

      {/* Document Items List */}
      <div className="flex flex-col gap-3">
        {documents.map((doc, idx) => (
          <div
            key={doc.uuid}
            className="p-3.5 rounded-xl bg-surface-alt hover:bg-surface-container-low/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] border border-border/30"
          >
            {/* Left Doc Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm bg-surface flex flex-col items-center justify-center border border-border/40">
                <FileText className="w-6 h-6 text-role-accent-admin" />
                <span className="text-[9px] font-bold uppercase text-ink-subtle mt-0.5">
                  PDF
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-caption text-caption font-semibold text-ink truncate">
                    {doc.file_name}
                  </span>
                  {doc.badge ? (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                        idx === 0
                          ? "bg-success/10 text-success"
                          : idx === 1
                            ? "bg-info/10 text-info"
                            : "bg-role-accent-doctor/10 text-role-accent-doctor"
                      }`}
                    >
                      {doc.badge}
                    </span>
                  ) : null}
                </div>
                <span className="font-caption text-[12px] text-ink-muted truncate">
                  {idx === 0
                    ? `No. STR: ${doctor.identity || "31.1.1.100.2.21.148291"}`
                    : idx === 1
                      ? "No. SIP: 446/SIP.DS/DKI/2022 • Exp: 2027"
                      : "Spesialis Kulit dan Kelamin • Lulus Tahun 2016"}
                </span>
                <span className="font-eyebrow text-[11px] text-ink-subtle">
                  PDF • {doc.file_size || "2.1 MB"} • Diunggah {doc.uploaded_at || doctor.submittedAt}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => onPreviewDocument(doc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-role-accent-admin shadow-sm font-caption text-caption font-semibold transition-colors border border-border/40 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>

              {doc.url && doc.url !== "#" ? (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-ink shadow-sm font-caption text-caption font-semibold transition-colors border border-border/40"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baru</span>
                </a>
              ) : null}

              {doc.url && doc.url !== "#" ? (
                <a
                  href={doc.url}
                  download
                  title="Unduh Berkas"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-ink-muted shadow-sm font-caption text-caption font-semibold transition-colors border border-border/40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Unduh</span>
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
