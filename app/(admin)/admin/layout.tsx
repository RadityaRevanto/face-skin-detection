import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminLayoutHeader } from "./components/admin-layout-header";

import { getPendingVerificationCount } from "./doctor-verifications/lib/doctor-verifications-query";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const pendingCount = await getPendingVerificationCount();

  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <AdminSidebar pendingCount={pendingCount} />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <AdminLayoutHeader />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
