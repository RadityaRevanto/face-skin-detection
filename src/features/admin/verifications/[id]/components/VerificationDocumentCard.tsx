import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { DoctorVerificationDetail } from "@/src/features/admin/verifications/[id]/lib/verificationDetailTypes";
import { DocumentIcon } from "./DocumentIcon";

type VerificationDocumentCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationDocumentCard({
  doctor,
}: VerificationDocumentCardProps) {
  const firstDoc = doctor.documents.length > 0 ? doctor.documents[0] : null;

  return (
    <Card className='overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>
          Dokumen & Status
        </h3>
        <p className='mt-0.5 text-sm text-gray-400'>
          Buka dokumen sebelum menentukan hasil verifikasi.
        </p>
      </div>

      <div className='space-y-4 p-6'>
        {doctor.documents.length > 0 ? (
          doctor.documents.map((doc) => (
            <div key={doc.uuid} className='flex items-center gap-4 rounded-xl bg-emerald-50/70 p-3.5 text-emerald-700'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm'>
                <DocumentIcon />
              </div>

              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold'>{doc.file_name ?? "Dokumen"}</p>
                <p className='text-xs text-emerald-600'>File preview placeholder</p>
              </div>

              <a href={doc.url} target='_blank' rel='noreferrer'>
                <Button
                  type='button'
                  variant='outline'
                  className='border-emerald-100! bg-white! text-emerald-700! hover:bg-emerald-50!'
                >
                  View
                </Button>
              </a>
            </div>
          ))
        ) : (
          <div className='flex items-center gap-4 rounded-xl bg-gray-50 p-3.5 text-gray-500'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm'>
              <DocumentIcon />
            </div>
            <p className='text-sm font-semibold'>No Document</p>
          </div>
        )}
      </div>
    </Card>
  );
}
