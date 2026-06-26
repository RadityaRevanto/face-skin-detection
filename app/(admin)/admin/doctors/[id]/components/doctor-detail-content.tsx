import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";

import type { DoctorDetail } from "../lib/doctor-detail-types";
import { DoctorIdentityCard } from "./doctor-identity-card";
import { DoctorVerificationCard } from "./doctor-verification-card";

type DoctorDetailContentProps = {
  doctor: DoctorDetail;
};

export function DoctorDetailContent({ doctor }: DoctorDetailContentProps) {
  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <AdminSidebar />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DashboardHeader
            title='Doctor Detail'
            description='Read doctor profile information'
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            <div className='w-full space-y-6'>
              <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                <div>
                  <Link
                    href='/admin/doctors'
                    className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'
                  >
                    Back to doctor list
                  </Link>

                  <h1 className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>
                    Detail Profil Dokter
                  </h1>

                  <p className='mt-1 text-sm text-slate-500'>
                    Halaman ini hanya menampilkan data profile doctor dan status
                    verifikasi terakhir.
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <DoctorIdentityCard doctor={doctor} />
                <DoctorVerificationCard doctor={doctor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
