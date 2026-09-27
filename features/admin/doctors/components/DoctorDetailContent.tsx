import { PageHeader } from "@/components/ui/page-header";

import type { DoctorDetail } from "@/features/admin/doctors/lib/doctorDetailTypes";
import { DoctorIdentityCard } from "./DoctorIdentityCard";
import { DoctorVerificationCard } from "./DoctorVerificationCard";

type DoctorDetailContentProps = {
  doctor: DoctorDetail;
};

export function DoctorDetailContent({ doctor }: DoctorDetailContentProps) {
  return (
    <div className='w-full space-y-6'>
      <PageHeader
        backHref="/admin/doctors"
        backLabel="Kembali ke daftar dokter"
        eyebrow="Profil Dokter"
        title="Detail Profil Dokter"
        description="Data akun dokter dan status verifikasi terakhir."
      />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <DoctorIdentityCard doctor={doctor} />
        <DoctorVerificationCard doctor={doctor} />
      </div>
    </div>
  );
}