import { Card } from "@/components/ui/card";

import type { LatestUser, UserRoleSummary } from "../lib/admin-dashboard-types";
import { DashboardCardHeader } from "./dashboard-card-header";
import { PersonRow } from "./person-row";

type UserInfoCardProps = {
  userRoleSummary: UserRoleSummary[];
  latestUsers: LatestUser[];
};

export function UserInfoCard({
  userRoleSummary,
  latestUsers,
}: UserInfoCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <DashboardCardHeader
        title='Informasi User'
        description='Ringkasan role dan user terbaru yang terdaftar.'
        href='/admin/users'
      />

      <div className='space-y-5 p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {userRoleSummary.map((item) => (
            <div key={item.label} className='rounded-xl bg-gray-50/80 p-3.5'>
              <p className='text-xs text-gray-400'>{item.label}</p>
              <p className={`mt-1 text-2xl font-bold ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className='space-y-3'>
          {latestUsers.length > 0 ? (
            latestUsers.map((user) => (
              <PersonRow
                key={user.email}
                name={user.name}
                email={user.email}
                meta={user.join}
              />
            ))
          ) : (
            <p className='rounded-xl bg-gray-50/80 p-3.5 text-sm font-semibold text-gray-500'>
              Belum ada user terbaru.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
