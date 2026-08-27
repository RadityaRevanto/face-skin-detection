import type { DoctorProfile, DoctorVerification } from "./verification-types";
import {
  CheckIcon,
  XIcon,
  ClockIcon,
} from "./verification-icons";
import {
  normalizeStatus,
  getStatusConfig,
} from "./verification-utils";
import {
  getVerificationSteps,
  getStepClass,
  StepIcon,
} from "./verification-steps";
import { VerificationDocumentSummary } from "./verification-document-summary";
import { VerificationBottomSections } from "./verification-bottom-sections";

export function VerificationStatusContent({
  doctorProfile,
  verification,
}: {
  doctorProfile: DoctorProfile;
  verification: DoctorVerification | null;
}) {
  const normalizedStatus = normalizeStatus(verification?.verification_status);
  const statusConfig = getStatusConfig(verification?.verification_status);
  const verificationSteps = getVerificationSteps(verification);

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

            <VerificationDocumentSummary
              doctorProfile={doctorProfile}
              verification={verification}
            />
          </div>
        </section>

        <VerificationBottomSections
          doctorProfile={doctorProfile}
          verification={verification}
          normalizedStatus={normalizedStatus}
        />
      </div>
    </main>
  );
}
