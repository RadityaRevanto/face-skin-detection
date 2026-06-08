import Link from "next/link";

import { Card } from "@/components/ui/card";

import type { VerificationRequest } from "../lib/admin-dashboard-types";
import { DashboardCardHeader } from "./dashboard-card-header";
import { StatusBadge } from "./status-badge";

type VerificationQueueCardProps = {
  verificationRequests: VerificationRequest[];
};

export function VerificationQueueCard({
  verificationRequests,
}: VerificationQueueCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <DashboardCardHeader
        title='Antrean Verifikasi Dokter'
        description='Dokter yang perlu direview sebelum mendapat akses dashboard dokter.'
        href='/admin/doctor-verifications'
      />

      <div className='grid grid-cols-1 gap-4 p-6 lg:grid-cols-2'>
        {verificationRequests.length > 0 ? (
          verificationRequests.slice(0, 4).map((doctor) => (
            <Link
              key={doctor.id}
              href={`/admin/doctor-verifications/${doctor.id}`}
              className='flex items-center justify-between gap-4 rounded-xl bg-gray-50/80 p-3.5 transition-colors hover:bg-emerald-50/70'
            >
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-gray-900'>
                  {doctor.name}
                </p>
                <p className='truncate text-xs text-gray-500'>
                  {doctor.identity} - {doctor.submittedAt}
                </p>
              </div>

              <StatusBadge status={doctor.status} />
            </Link>
          ))
        ) : (
          <p className='rounded-xl bg-gray-50/80 p-3.5 text-sm font-semibold text-gray-500'>
            Tidak ada antrean verifikasi dokter.
          </p>
        )}
      </div>
    </Card>
  );
}
