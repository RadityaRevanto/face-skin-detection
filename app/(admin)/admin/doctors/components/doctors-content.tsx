import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";

import type { DoctorsPageData } from "../lib/doctors-types";
import { DoctorsTable } from "./doctors-table";

type DoctorsContentProps = DoctorsPageData;

export function DoctorsContent({ doctors, pagination }: DoctorsContentProps) {
  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <AdminSidebar />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DashboardHeader
            title='Doctors'
            description='Manage verified doctors'
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            <div className='w-full space-y-6'>
              <div>
                <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
                  Verified Doctors
                </h1>
                <p className='mt-1 text-sm text-slate-500'>
                  Kelola daftar dokter yang sudah lolos verifikasi dan dapat
                  mengakses dashboard dokter.
                </p>
              </div>

              <DoctorsTable doctors={doctors} pagination={pagination} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
