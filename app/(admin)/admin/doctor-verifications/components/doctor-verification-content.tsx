import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";

import type { DoctorVerificationPageData } from "../lib/doctor-verification-types";
import { DoctorVerificationStats } from "./doctor-verification-stats";
import { DoctorVerificationTable } from "./doctor-verification-table";

type DoctorVerificationContentProps = DoctorVerificationPageData;

export function DoctorVerificationContent({
  verificationRequests,
  stats,
  pagination,
}: DoctorVerificationContentProps) {
  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <AdminSidebar />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DashboardHeader
            title='Verification'
            description='Review doctor verification requests'
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            <div className='w-full space-y-6'>
              <div>
                <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
                  Doctor Verification
                </h1>
                <p className='mt-1 text-sm text-slate-500'>
                  Review dokumen STR atau identitas dokter sebelum akun dokter
                  diberi akses ke dashboard.
                </p>
              </div>

              <DoctorVerificationStats stats={stats} />

              <DoctorVerificationTable
                verificationRequests={verificationRequests}
                pagination={pagination}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
