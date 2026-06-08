import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";

import type { AdminDashboardData } from "../lib/admin-dashboard-types";
import { DoctorInfoCard } from "./doctor-info-card";
import { StatsCardGrid } from "./stats-card-grid";
import { UserInfoCard } from "./user-info-card";
import { VerificationQueueCard } from "./verification-queue-card";

type AdminDashboardContentProps = AdminDashboardData;

export function AdminDashboardContent({
  stats,
  latestUsers,
  verifiedDoctors,
  userRoleSummary,
  verificationRequests,
}: AdminDashboardContentProps) {
  return (
    <main className='min-h-screen bg-[#f7fbf8] text-slate-950 dark:bg-[#f7fbf8] dark:text-slate-950'>
      <div className='flex min-h-screen flex-col lg:flex-row'>
        <AdminSidebar />

        <div className='min-w-0 flex-1'>
          <DashboardHeader
            title='Dashboard'
            description="Welcome back, Admin! Here's what's happening today."
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            <div className='w-full space-y-6'>
              <StatsCardGrid stats={stats} />

              <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <UserInfoCard
                  userRoleSummary={userRoleSummary}
                  latestUsers={latestUsers}
                />

                <DoctorInfoCard verifiedDoctors={verifiedDoctors} />
              </section>

              <VerificationQueueCard
                verificationRequests={verificationRequests}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
