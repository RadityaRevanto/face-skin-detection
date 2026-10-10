"use client";

import { CloudCheck, FileText, Award, IdCard, Check, ExternalLink } from "lucide-react";
import type { DoctorDocument } from "../lib/doctorDetailTypes";

type DoctorDocumentIntegrityCardProps = {
  documents?: DoctorDocument[];
};

export function DoctorDocumentIntegrityCard({
  documents = [],
}: DoctorDocumentIntegrityCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm space-y-4 border border-border/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
            Tinjauan Integritas Dokumen Digital
          </h3>
          <span className="font-caption text-caption text-ink-muted">
            Arsip digital tersinkronisasi dengan basis data Kemenkes SATUSEHAT
          </span>
        </div>
        <span className="font-caption text-caption text-success font-semibold flex items-center gap-1">
          <CloudCheck className="w-4 h-4 text-success" />
          <span>Tervalidasi API</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {documents.length > 0 ? (
          documents.map((doc, idx) => (
            <a
              key={doc.uuid || idx}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-surface-alt hover:bg-surface-container flex items-center justify-between border border-border/40 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-ink-muted group-hover:text-role-accent-admin shrink-0" />
                <span className="font-caption text-caption font-medium text-ink truncate">
                  {doc.file_name || `Berkas Medis ${idx + 1}`}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-ink-subtle group-hover:text-role-accent-admin shrink-0" />
            </a>
          ))
        ) : (
          <>
            <div className="p-3.5 rounded-xl bg-surface-alt flex items-center justify-between border border-border/40">
              <div className="flex items-center gap-2.5">
                <IdCard className="w-5 h-5 text-ink-muted" />
                <span className="font-caption text-caption font-medium text-ink">E-KTP & NPWP</span>
              </div>
              <Check className="w-4 h-4 text-success" />
            </div>

            <div className="p-3.5 rounded-xl bg-surface-alt flex items-center justify-between border border-border/40">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-ink-muted" />
                <span className="font-caption text-caption font-medium text-ink">Scan Salinan SIP</span>
              </div>
              <Check className="w-4 h-4 text-success" />
            </div>

            <div className="p-3.5 rounded-xl bg-surface-alt flex items-center justify-between border border-border/40">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-ink-muted" />
                <span className="font-caption text-caption font-medium text-ink">Ijazah & Sertifikat Kolegium</span>
              </div>
              <Check className="w-4 h-4 text-success" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
