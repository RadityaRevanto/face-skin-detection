import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DoctorLogoutButton } from "@/components/doctor/doctor-logout-button";
import { fetchApi } from "@/lib/api/server-client";
import { ResubmissionForm } from "./_components/resubmission-form";

import type { DoctorProfile, DoctorVerification, ApiStatusError } from "./_components/verification-types";
import { CheckIcon, XIcon, ClockIcon, ShieldIcon, DocumentIcon } from "./_components/verification-icons";
import {
  formatDate,
  normalizeStatus,
  isRevisionStatus,
  getStatusConfig,
} from "./_components/verification-utils";
import {
  getVerificationSteps,
  getStepClass,
  StepIcon,
} from "./_components/verification-steps";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Status Verifikasi | Face Skin Detection",
  description: "Status verifikasi akun dokter Anda",
};

export default async function VerificationStatusPage() {
  let doctorProfile: DoctorProfile | null = null;
  let verification: DoctorVerification | null = null;

  try {
    const resProfile = await fetchApi<DoctorProfile>("/profile");
    doctorProfile = resProfile.data ?? null;

    if (!doctorProfile || doctorProfile.role !== "doctor") {
      redirect("/login");
    }

    try {
      const resVerification =
        await fetchApi<DoctorVerification>("/doctor-verifications");
      verification = resVerification.data ?? null;
    } catch (error) {
      if ((error as ApiStatusError)?.status !== 404) {
        console.error("Failed to fetch doctor verification status:", error);
      }
    }
  } catch (error) {
    if ((error as ApiStatusError)?.status !== 404) {
      console.error("Failed to fetch doctor profile:", error);
    }
  }

  if (!doctorProfile) {
    redirect("/login");
  }

  const normalizedStatus = normalizeStatus(verification?.verification_status);
  const statusConfig = getStatusConfig(verification?.verification_status);
  const verificationSteps = getVerificationSteps(verification);

  const isApproved = normalizedStatus === "approved";
  const isActive = doctorProfile.is_active !== false;

  if (isApproved && isActive) {
    redirect("/api/auth/sync");
  }

  const statusIcon =
    statusConfig.icon === "check" ? (
      <CheckIcon />
    ) : statusConfig.icon === "x" ? (
      <XIcon />
    ) : (
      <ClockIcon />
    );

  return (
    <main className='min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10 lg:px-12'>
      <div className='mx-auto w-full max-w-6xl'>
        <section className='overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100'>
          <div
            className={[
              "bg-linear-to-br px-8 py-10 text-white",
              statusConfig.headerClass,
            ].join(" ")}
          >
            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <p className='text-sm font-bold uppercase tracking-[0.22em] text-white/80'>
                  Status Verifikasi Dokter
                </p>

                <h1 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>
                  {statusConfig.title}
                </h1>

                <p className='mt-3 max-w-3xl text-sm leading-6 text-white/90'>
                  {statusConfig.description}
                </p>
              </div>

              <div className='flex w-fit items-center gap-3 rounded-2xl bg-white/15 px-5 py-4 ring-1 ring-white/20'>
                <div className='grid h-12 w-12 place-items-center rounded-full bg-white text-emerald-600'>
                  {statusIcon}
                </div>

                <div>
                  <p className='text-xs font-semibold text-white/80'>
                    Status saat ini
                  </p>
                  <p className='text-lg font-bold'>{statusConfig.label}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8'>
            <section className='rounded-3xl border border-slate-100 bg-slate-50 p-6'>
              <h2 className='text-xl font-bold text-slate-900'>
                Proses Verifikasi
              </h2>

              <p className='mt-2 text-sm leading-6 text-slate-500'>
                Status ini mengikuti data verifikasi dokter yang tersimpan di
                sistem. Jika status berubah, akses dashboard akan menyesuaikan
                secara otomatis.
              </p>

              <div className='mt-7 space-y-5'>
                {verificationSteps.map((step, index) => (
                  <div key={step.title} className='flex gap-4'>
                    <div className='flex flex-col items-center'>
                      <span
                        className={[
                          "grid h-10 w-10 place-items-center rounded-full text-sm font-bold",
                          getStepClass(step.status),
                        ].join(" ")}
                      >
                        <StepIcon status={step.status} index={index} />
                      </span>

                      {index < verificationSteps.length - 1 ? (
                        <span className='mt-2 h-12 w-px bg-slate-200' />
                      ) : null}
                    </div>

                    <div className='pb-5'>
                      <h3 className='font-bold text-slate-900'>{step.title}</h3>
                      <p className='mt-1 text-sm leading-6 text-slate-500'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className='space-y-6'>
              <section className='rounded-3xl border border-slate-100 bg-white p-6 shadow-sm'>
                <div className='grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600'>
                  <ShieldIcon />
                </div>

                <h2 className='mt-5 text-xl font-bold text-slate-900'>
                  {statusConfig.cardTitle}
                </h2>

                <p className='mt-2 text-sm leading-6 text-slate-500'>
                  {statusConfig.cardDescription}
                </p>
              </section>

              <section className='rounded-3xl border border-slate-100 bg-white p-6 shadow-sm'>
                <div className='mb-5 flex items-center gap-3'>
                  <div className='text-emerald-600'>
                    <DocumentIcon />
                  </div>
                  <h2 className='font-bold text-slate-900'>
                    Ringkasan Dokumen
                  </h2>
                </div>

                <div className='space-y-4 text-sm'>
                  <div className='flex justify-between gap-4'>
                    <span className='font-semibold text-slate-500'>
                      Status dokumen
                    </span>
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-bold",
                        statusConfig.badgeClass,
                      ].join(" ")}
                    >
                      {statusConfig.badgeLabel}
                    </span>
                  </div>

                  <div className='flex justify-between gap-4'>
                    <span className='font-semibold text-slate-500'>
                      Nama dokter
                    </span>
                    <span className='max-w-44 truncate text-right font-bold text-slate-800'>
                      {doctorProfile.full_name ?? "-"}
                    </span>
                  </div>

                  <div className='flex justify-between gap-4'>
                    <span className='font-semibold text-slate-500'>Email</span>
                    <span className='max-w-44 truncate text-right font-bold text-slate-800'>
                      {doctorProfile.email ?? "-"}
                    </span>
                  </div>

                  <div className='flex justify-between gap-4'>
                    <span className='font-semibold text-slate-500'>
                      Nomor STR
                    </span>
                    <span className='max-w-44 truncate text-right font-bold text-slate-800'>
                      {verification?.str_number ?? "-"}
                    </span>
                  </div>

                  <div className='flex justify-between gap-4'>
                    <span className='font-semibold text-slate-500'>
                      Spesialisasi
                    </span>
                    <span className='max-w-44 truncate text-right font-bold text-slate-800'>
                      {verification?.specialization ?? "-"}
                    </span>
                  </div>

                  <div>
                    <span className='font-semibold text-slate-500'>
                      Dokumen terunggah
                    </span>
                    {verification?.documents?.length ? (
                      <ul className='mt-2 space-y-2'>
                        {verification.documents.map((doc) => (
                          <li key={doc.uuid}>
                            <a
                              href={doc.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50'
                            >
                              <DocumentIcon />
                              <span className='truncate'>
                                {doc.file_name ?? doc.uuid}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700'>
                        Belum ada dokumen tersimpan.
                      </p>
                    )}
                  </div>

                  <div className='flex justify-between gap-4'>
                    <span className='font-semibold text-slate-500'>
                      Dikirim pada
                    </span>
                    <span className='font-bold text-slate-800'>
                      {formatDate(verification?.created_at)}
                    </span>
                  </div>

                  <div className='flex justify-between gap-4'>
                    <span className='font-semibold text-slate-500'>
                      Direview pada
                    </span>
                    <span className='font-bold text-slate-800'>
                      {formatDate(verification?.reviewed_at)}
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>

        {normalizedStatus === "rejected" ||
        isRevisionStatus(normalizedStatus) ? (
          <section className='mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
            <h2 className='font-bold text-slate-900'>Catatan dari Admin</h2>

            <p className='mt-2 text-sm leading-6 text-slate-500'>
              {verification?.rejection_reason ||
                verification?.revision_note ||
                "Admin belum menambahkan catatan detail."}
            </p>
          </section>
        ) : null}

        {verification && (normalizedStatus === "rejected" || isRevisionStatus(normalizedStatus)) ? (
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

        {!(verification && (normalizedStatus === "rejected" || isRevisionStatus(normalizedStatus))) ? (
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
      </div>
    </main>
  );
}
