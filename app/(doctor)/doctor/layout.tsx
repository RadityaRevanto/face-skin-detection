import type { ReactNode } from "react";

import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { DoctorLayoutHeader } from "./components/doctor-layout-header";
import { requireDoctorProfile } from "@/lib/doctor-auth";

type DoctorLayoutProps = {
  children: ReactNode;
};

export default async function DoctorLayout({ children }: DoctorLayoutProps) {
  const profile = await requireDoctorProfile();
  
  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <DoctorSidebar 
          initialDisplayName={profile.full_name || "Dokter"} 
          initialAvatarUrl={profile.avatar_url || profile.google_avatar_url || null}
        />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DoctorLayoutHeader initialDisplayName={profile.full_name || "Dokter"} />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
