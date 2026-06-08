import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";

import type { DoctorVerificationDetail } from "../lib/verification-detail-types";
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
  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <AdminSidebar />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DashboardHeader
            title='Verification Detail'
            description='Review doctor document before approval'
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            <div className='w-full space-y-6'>
              <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                <div>
                  <Link
                    href='/admin/doctor-verifications'
                    className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'
                  >
                    Back to verification list
                  </Link>

                  <h1 className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>
                    Verifikasi Detail Dokter
                  </h1>

                  <p className='mt-1 text-sm text-slate-500'>
                    Review detail data dokter, dokumen verifikasi, dan tentukan
                    status akun.
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

              <VerificationDecisionCard verificationId={doctor.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
