import { BriefcaseMedical, GraduationCap, MapPin, Stethoscope } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { DoctorVerificationDetail } from "@/features/admin/verifications/lib/verificationDetailTypes";

type VerificationProfileCardProps = {
  doctor: DoctorVerificationDetail;
};

/**
 * Kartu profil profesional dokter — data asli dari DoctorVerificationResource
 * (gelar, subspesialisasi, pengalaman, alma mater, lokasi praktik, organisasi).
 * Menggantikan kartu "kontak" lama yang cuma menampilkan "-" hardcode.
 */
export function VerificationProfileCard({ doctor }: VerificationProfileCardProps) {
  const rows = [
    {
      icon: <Stethoscope className="h-4 w-4" aria-hidden="true" />,
      label: "Subspesialisasi",
      value: doctor.subSpecialization,
    },
    {
      icon: <BriefcaseMedical className="h-4 w-4" aria-hidden="true" />,
      label: "Pengalaman",
      value:
        doctor.experienceYears != null
          ? `${doctor.experienceYears} tahun praktik`
          : null,
    },
    {
      icon: <GraduationCap className="h-4 w-4" aria-hidden="true" />,
      label: "Alma Mater",
      value: doctor.almaMater,
    },
    {
      icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
      label: "Lokasi Praktik",
      value:
        doctor.practiceLocations.length > 0
          ? doctor.practiceLocations.join(" · ")
          : null,
    },
  ].filter((r) => r.value);

  return (
    <Card>
      <div className='border-b border-[var(--line)] px-6 py-4'>
        <h3 className='font-heading text-base font-semibold text-[var(--ink)]'>
          Profil Profesional
        </h3>
        <p className='mt-0.5 text-sm text-[var(--ink-muted)]'>
          Data keprofesian yang disampaikan dokter saat mengajukan verifikasi.
        </p>
      </div>

      <div className='p-5 sm:p-6'>
        {doctor.title ? (
          <p className='mb-4 inline-flex items-center rounded-full bg-[var(--role-accent-soft)] px-3 py-1 text-xs font-bold text-[var(--role-accent-strong)]'>
            {doctor.title}
          </p>
        ) : null}

        {rows.length > 0 ? (
          <ul className='space-y-3.5'>
            {rows.map((row) => (
              <li key={row.label} className='flex items-start gap-3'>
                <span className='mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-control)] bg-[var(--surface-2)] text-[var(--role-accent-strong)]'>
                  {row.icon}
                </span>
                <div className='min-w-0'>
                  <p className='text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-muted)]'>
                    {row.label}
                  </p>
                  <p className='text-sm font-medium text-[var(--ink)]'>{row.value}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-[var(--ink-muted)]'>
            Dokter belum melengkapi data keprofesian (subspesialisasi, alma
            mater, lokasi praktik).
          </p>
        )}

        {doctor.professionalOrganizations.length > 0 ? (
          <div className='mt-5 border-t border-[var(--line)] pt-4'>
            <p className='mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-muted)]'>
              Organisasi Profesi
            </p>
            <div className='flex flex-wrap gap-1.5'>
              {doctor.professionalOrganizations.map((org) => (
                <span
                  key={org}
                  className='inline-flex items-center rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ink-soft)]'
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
