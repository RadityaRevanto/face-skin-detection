import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { DoctorVerificationDetail } from "../lib/verification-detail-types";
import { DocumentIcon } from "./document-icon";

type VerificationDocumentCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationDocumentCard({
  doctor,
}: VerificationDocumentCardProps) {
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
        <div className='flex items-center gap-4 rounded-xl bg-emerald-50/70 p-3.5 text-emerald-700'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm'>
            <DocumentIcon />
          </div>

          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold'>{doctor.document}</p>
            <p className='text-xs text-emerald-600'>File preview placeholder</p>
          </div>
        </div>

        {doctor.documentUrl ? (
          <a href={doctor.documentUrl} target='_blank' rel='noreferrer'>
            <Button
              type='button'
              variant='outline'
              className='w-full border-emerald-100! bg-white! text-emerald-700! hover:bg-emerald-50!'
            >
              View Document
            </Button>
          </a>
        ) : (
          <Button
            type='button'
            variant='outline'
            disabled
            className='w-full border-emerald-100! bg-white! text-emerald-700! hover:bg-emerald-50!'
          >
            View Document
          </Button>
        )}
      </div>
    </Card>
  );
}
