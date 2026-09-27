import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/features/admin/components/StatusBadge";

import type { DoctorVerificationDetail } from "@/features/admin/verifications/lib/verificationDetailTypes";
import { RejectedReasonCard } from "./RejectedReasonCard";
import { VerificationDecisionCard } from "./VerificationDecisionCard";
import { VerificationDocumentCard } from "./VerificationDocumentCard";
import { VerificationIdentityCard } from "./VerificationIdentityCard";
import { VerificationProfileCard } from "./VerificationProfileCard";

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
      <PageHeader
        backHref={
          isRejected
            ? "/admin/doctor-verifications/rejected"
            : "/admin/doctor-verifications/pending"
        }
        backLabel="Kembali ke daftar verifikasi"
        eyebrow="Review Pengajuan"
        title="Verifikasi Detail Dokter"
        description="Periksa identitas, dokumen, dan rekam jejak dokter sebelum memutuskan."
        action={
          <div className="sm:pt-6">
            <StatusBadge status={doctor.status} />
          </div>
        }
      />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='flex flex-col gap-6'>
          <VerificationIdentityCard doctor={doctor} />
          <VerificationDocumentCard doctor={doctor} />
        </div>

        <VerificationProfileCard doctor={doctor} />
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