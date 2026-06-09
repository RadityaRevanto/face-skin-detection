import type { DoctorVerificationPageData } from "../lib/doctor-verification-types";
import { DoctorVerificationStats } from "./doctor-verification-stats";
import { DoctorVerificationTable } from "./doctor-verification-table";
import { DoctorVerificationTabs } from "./doctor-verification-tabs";

type DoctorVerificationContentProps = DoctorVerificationPageData;

export function DoctorVerificationContent({
  pageType,
  verificationRequests,
  stats,
  pagination,
}: DoctorVerificationContentProps) {
  const isPendingPage = pageType === "pending";

  return (
    <div className='w-full space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
          {isPendingPage
            ? "Pending Doctor Verification"
            : "Rejected Doctor Verification"}
        </h1>

        <p className='mt-1 text-sm text-slate-500'>
          {isPendingPage
            ? "Review dokumen STR atau identitas dokter sebelum akun dokter diberi akses ke dashboard."
            : "Lihat riwayat dokter yang ditolak beserta alasan penolakannya."}
        </p>
      </div>

      <DoctorVerificationTabs
        pageType={pageType}
        pendingCount={stats.pendingCount}
        rejectedCount={stats.rejectedCount}
      />

      <DoctorVerificationStats stats={stats} />

      <DoctorVerificationTable
        pageType={pageType}
        verificationRequests={verificationRequests}
        pagination={pagination}
      />
    </div>
  );
}
