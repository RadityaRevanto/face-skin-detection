import Link from "next/link";

import type { DoctorVerificationDetail } from "@/features/admin/verifications/lib/verificationDetailTypes";
import { RejectedReasonCard } from "./RejectedReasonCard";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { VerificationContactCard } from "./VerificationContactCard";
import { VerificationDecisionCard } from "./VerificationDecisionCard";
import { VerificationDocumentCard } from "./VerificationDocumentCard";
import { VerificationIdentityCard } from "./VerificationIdentityCard";

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
      <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-start'>
        <div>
          <Link
            href={
              isRejected
                ? "/admin/doctor-verifications/rejected"
                : "/admin/doctor-verifications/pending"
            }
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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

        {/* §5.7 mobile: badge di baris sendiri (mt-2); desktop: kanan atas */}
        <div className="sm:pt-9">
          <StatusBadge status={doctor.status} />
        </div>
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
