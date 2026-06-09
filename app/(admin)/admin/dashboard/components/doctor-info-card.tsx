import { Card } from "@/components/ui/card";

import type { VerifiedDoctor } from "../lib/admin-dashboard-types";
import { DashboardCardHeader } from "./dashboard-card-header";
import { PersonRow } from "./person-row";

type DoctorInfoCardProps = {
  verifiedDoctors: VerifiedDoctor[];
};

export function DoctorInfoCard({ verifiedDoctors }: DoctorInfoCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <DashboardCardHeader
        title='Informasi Dokter'
        description='Dokter yang sudah diverifikasi dan aktif.'
        href='/admin/doctors'
      />

      <div className='space-y-3 p-6'>
        {verifiedDoctors.length > 0 ? (
          verifiedDoctors.map((doctor) => (
            <PersonRow
              key={doctor.email}
              name={doctor.name}
              email={doctor.email}
              meta={doctor.specialization}
            />
          ))
        ) : (
          <p className='rounded-xl bg-gray-50/80 p-3.5 text-sm font-semibold text-gray-500'>
            Belum ada dokter terverifikasi.
          </p>
        )}
      </div>
    </Card>
  );
}
