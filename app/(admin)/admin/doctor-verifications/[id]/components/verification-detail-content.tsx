import Link from "next/link";

import type { DoctorVerificationDetail } from "../lib/verification-detail-types";
import { RejectedReasonCard } from "./rejected-reason-card";
import { StatusBadge } from "./status-badge";
import { VerificationContactCard } from "./verification-contact-card";
import { VerificationDecisionCard } from "./verification-decision-card";
import { VerificationDocumentCard } from "./verification-document-card";
import { VerificationIdentityCard } from "./verification-identity-card";

type VerificationDetailContentProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationDetailContent({
  doctor,
}: VerificationDetailContentProps) {
  const isPending = doctor.rawStatus === "pending";
  const isRejected = doctor.rawStatus === "rejected";

  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <div>
          <Link
            href={
              isRejected
                ? "/admin/doctor-verifications/rejected"
                : "/admin/doctor-verifications/pending"
            }
            className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'
          >
            Back to verification list
          </Link>

          <h1 className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>
            Verifikasi Detail Dokter
          </h1>

          <p className='mt-1 text-sm text-slate-500'>
            Review detail data dokter, dokumen verifikasi, dan status pengajuan
            akun dokter.
          </p>
        </div>

        <StatusBadge status={doctor.status} />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <VerificationIdentityCard doctor={doctor} />

        <div className='flex flex-col gap-6'>
          <VerificationContactCard doctor={doctor} />
          <VerificationDocumentCard doctor={doctor} />
        </div>
      </div>

      {isPending ? (
        <VerificationDecisionCard verificationId={doctor.id} />
      ) : null}

      {isRejected ? (
        <RejectedReasonCard reason={doctor.rejectionReason} />
      ) : null}
    </div>
  );
}
