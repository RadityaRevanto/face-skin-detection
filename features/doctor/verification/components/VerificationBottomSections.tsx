import { DoctorLogoutButton } from "@/features/doctor/components/DoctorLogoutButton";
import type { DoctorProfile, DoctorVerification } from "./VerificationTypes";
import { isRevisionStatus } from "../utils/verificationUtils";
import { ResubmissionForm } from "./ResubmissionForm";

export function VerificationBottomSections({
  doctorProfile,
  verification,
  normalizedStatus,
}: {
  doctorProfile: DoctorProfile;
  verification: DoctorVerification | null;
  normalizedStatus: string;
}) {
  return (
    <>
      {normalizedStatus === "rejected" || isRevisionStatus(normalizedStatus) ? (
        <section className='mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
          <h2 className='font-bold text-slate-900'>Catatan dari Admin</h2>

          <p className='mt-2 text-sm leading-6 text-slate-500'>
            {verification?.rejection_reason ||
              verification?.revision_note ||
              "Admin belum menambahkan catatan detail."}
          </p>
        </section>
      ) : null}

      {verification &&
      (normalizedStatus === "rejected" || isRevisionStatus(normalizedStatus)) ? (
        <ResubmissionForm
          mode={normalizedStatus === "rejected" ? "rejected" : "needs_revision"}
          verificationUuid={verification.uuid}
          defaultValues={{
            specialization: verification.specialization,
            str_number: verification.str_number,
            title: verification.title,
            sub_specialization: verification.sub_specialization,
            experience_years: verification.experience_years,
            alma_mater: verification.alma_mater,
          }}
        />
      ) : null}

      {!verification ? (
        <section className='mt-6 rounded-3xl bg-amber-50 p-6 shadow-sm ring-1 ring-amber-100'>
          <h2 className='font-bold text-amber-900'>
            Data verifikasi belum ditemukan
          </h2>

          <p className='mt-2 text-sm leading-6 text-amber-700'>
            Akun dokter Anda sudah terdaftar, tetapi data verifikasi belum
            tersedia di sistem. Silakan hubungi admin jika status ini tidak
            berubah.
          </p>
        </section>
      ) : null}

      {!(verification &&
        (normalizedStatus === "rejected" || isRevisionStatus(normalizedStatus))) ? (
        <section className='mt-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='font-bold text-slate-900'>
              Perlu memperbarui data?
            </h2>

            <p className='mt-1 text-sm leading-6 text-slate-500'>
              Jika dokumen atau data profesi Anda salah, hubungi admin agar
              dapat dilakukan revisi.
            </p>
          </div>

          <DoctorLogoutButton />
        </section>
      ) : (
        <section className='mt-6 flex justify-end rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
          <DoctorLogoutButton />
        </section>
      )}
    </>
  );
}
