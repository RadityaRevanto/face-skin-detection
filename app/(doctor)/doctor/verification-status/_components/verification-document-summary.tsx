import type { DoctorProfile, DoctorVerification } from "./verification-types";
import { ShieldIcon, DocumentIcon } from "./verification-icons";
import { formatDate, getStatusConfig } from "./verification-utils";

export function VerificationDocumentSummary({
  doctorProfile,
  verification,
}: {
  doctorProfile: DoctorProfile;
  verification: DoctorVerification | null;
}) {
  const statusConfig = getStatusConfig(verification?.verification_status);

  return (
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
          <h2 className='font-bold text-slate-900'>Ringkasan Dokumen</h2>
        </div>

        <div className='space-y-4 text-sm'>
          <div className='flex justify-between gap-4'>
            <span className='font-semibold text-slate-500'>Status dokumen</span>
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
            <span className='font-semibold text-slate-500'>Nama dokter</span>
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
            <span className='font-semibold text-slate-500'>Nomor STR</span>
            <span className='max-w-44 truncate text-right font-bold text-slate-800'>
              {verification?.str_number ?? "-"}
            </span>
          </div>

          <div className='flex justify-between gap-4'>
            <span className='font-semibold text-slate-500'>Spesialisasi</span>
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
                      <span className='truncate'>{doc.file_name ?? doc.uuid}</span>
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
            <span className='font-semibold text-slate-500'>Dikirim pada</span>
            <span className='font-bold text-slate-800'>
              {formatDate(verification?.created_at)}
            </span>
          </div>

          <div className='flex justify-between gap-4'>
            <span className='font-semibold text-slate-500'>Direview pada</span>
            <span className='font-bold text-slate-800'>
              {formatDate(verification?.reviewed_at)}
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
}
