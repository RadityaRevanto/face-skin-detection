import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { DoctorVerificationDetail } from "@/features/admin/verifications/lib/verificationDetailTypes";

type VerificationDocumentCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationDocumentCard({
  doctor,
}: VerificationDocumentCardProps) {
  return (
    <Card>
      <div className='border-b border-[var(--line)] px-6 py-4'>
        <h3 className='font-heading text-base font-semibold text-[var(--ink)]'>
          Dokumen & Status
        </h3>
        <p className='mt-0.5 text-sm text-[var(--ink-muted)]'>
          Buka dokumen sebelum menentukan hasil verifikasi.
        </p>
      </div>

      <div className='space-y-3 p-5'>
        {doctor.documents.length > 0 ? (
          doctor.documents.map((doc) => (
            <div key={doc.uuid} className='flex items-center gap-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] p-3.5'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[var(--surface)] text-[var(--role-accent-strong)] shadow-sm'>
                <FileText className='h-5 w-5' aria-hidden='true' />
              </div>

              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold text-[var(--ink)]'>{doc.file_name ?? "Dokumen"}</p>
              </div>

              <a href={doc.url} target='_blank' rel='noreferrer'>
                <Button type='button' variant='secondary' size='sm'>
                  Lihat
                </Button>
              </a>
            </div>
          ))
        ) : (
          <div className='flex items-center gap-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] p-3.5 text-[var(--ink-muted)]'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[var(--surface)] shadow-sm'>
              <FileText className='h-5 w-5' aria-hidden='true' />
            </div>
            <p className='text-sm font-semibold'>Belum ada dokumen</p>
          </div>
        )}
      </div>
    </Card>
  );
}
