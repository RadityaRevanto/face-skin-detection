import { Card } from "@/components/ui/card";

import type { DoctorVerificationStats } from "../lib/doctor-verification-types";

type DoctorVerificationStatsProps = {
  stats: DoctorVerificationStats;
};

export function DoctorVerificationStats({
  stats,
}: DoctorVerificationStatsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <Card className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
        <p className='text-sm font-medium text-gray-500'>Menunggu Review</p>
        <p className='mt-3 text-3xl font-bold text-slate-950'>
          {stats.pendingCount}
        </p>
      </Card>

      <Card className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
        <p className='text-sm font-medium text-gray-500'>Perlu Revisi</p>
        <p className='mt-3 text-3xl font-bold text-amber-600'>
          {stats.revisionCount}
        </p>
      </Card>

      <Card className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
        <p className='text-sm font-medium text-gray-500'>Total Antrean</p>
        <p className='mt-3 text-3xl font-bold text-emerald-600'>
          {stats.totalQueue}
        </p>
      </Card>
    </div>
  );
}
