import type { Metadata } from "next";
import type { ReactNode } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { DoctorLogoutButton } from "@/components/doctor/doctor-logout-button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Status Verifikasi | Face Skin Detection",
  description: "Status verifikasi akun dokter Anda",
};

type IconProps = {
  children: ReactNode;
  className?: string;
};

type DoctorProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
};

type DoctorVerification = {
  doctor_id: string;
  str_number: string | null;
  specialization: string | null;
  document_url: string | null;
  verification_status: string | null;
  rejection_reason: string | null;
  revision_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type StepStatus = "completed" | "current" | "pending" | "failed";

type VerificationStep = {
  title: string;
  description: string;
  status: StepStatus;
};

function Icon({ children, className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      className={className}
    >
      {children}
    </svg>
  );
}

function ClockIcon() {
  return (
    <Icon className='h-6 w-6'>
      <path
        d='M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

function CheckIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='m5 12 4 4L19 6'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Icon>
  );
}

function XIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='m6 6 12 12M18 6 6 18'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Icon>
  );
}

function DocumentIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path
        d='M14 3v5h5M8.5 13h7M8.5 17h5'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon className='h-6 w-6'>
      <path
        d='M12 3 5 6v5.3c0 4.4 2.9 8.4 7 9.7 4.1-1.3 7-5.3 7-9.7V6l-7-3Z'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path
        d='m9 12 2 2 4-4'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function normalizeStatus(status: string | null | undefined) {
  return status?.toLowerCase().trim() || "pending";
}

function isRevisionStatus(status: string) {
  return (
    status === "revision" ||
    status === "revision_required" ||
    status === "needs_revision"
  );
}

function getStatusConfig(status: string | null | undefined) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "approved") {
    return {
      label: "Disetujui",
      badgeLabel: "Approved",
      title: "Akun dokter telah disetujui",
      description:
        "Verifikasi dokter Anda telah disetujui. Dashboard dokter sudah dapat digunakan.",
      cardTitle: "Akses dashboard aktif",
      cardDescription:
        "Akun Anda sudah lolos validasi admin dan dapat mengakses fitur dokter.",
      headerClass: "from-emerald-600 to-teal-600",
      badgeClass: "bg-emerald-50 text-emerald-700",
      icon: "check",
    };
  }

  if (normalizedStatus === "rejected") {
    return {
      label: "Ditolak",
      badgeLabel: "Rejected",
      title: "Verifikasi dokter ditolak",
      description:
        "Admin menolak verifikasi akun dokter Anda. Silakan periksa alasan penolakan dan hubungi admin jika diperlukan.",
      cardTitle: "Akses belum aktif",
      cardDescription:
        "Dashboard dokter belum tersedia karena verifikasi belum disetujui.",
      headerClass: "from-rose-600 to-red-600",
      badgeClass: "bg-rose-50 text-rose-700",
      icon: "x",
    };
  }

  if (isRevisionStatus(normalizedStatus)) {
    return {
      label: "Perlu Revisi",
      badgeLabel: "Revision",
      title: "Dokumen perlu diperbaiki",
      description:
        "Admin meminta revisi data atau dokumen profesi Anda sebelum verifikasi dapat dilanjutkan.",
      cardTitle: "Akses belum aktif",
      cardDescription:
        "Dashboard dokter akan tersedia setelah revisi disetujui oleh admin.",
      headerClass: "from-amber-500 to-orange-500",
      badgeClass: "bg-amber-50 text-amber-700",
      icon: "clock",
    };
  }

  return {
    label: "Menunggu Review",
    badgeLabel: "Pending",
    title: "Akun dokter sedang ditinjau",
    description:
      "Tim admin sedang memvalidasi dokumen dan data profesi Anda. Setelah disetujui, Anda dapat mengakses dashboard dokter.",
    cardTitle: "Akses belum aktif",
    cardDescription:
      "Untuk sementara Anda hanya dapat melihat halaman status ini. Dashboard dokter akan tersedia setelah admin menyetujui verifikasi.",
    headerClass: "from-emerald-600 to-teal-600",
    badgeClass: "bg-amber-50 text-amber-700",
    icon: "clock",
  };
}

function getVerificationSteps(
  verification: DoctorVerification | null,
): VerificationStep[] {
  const status = normalizeStatus(verification?.verification_status);
  const hasDocument = Boolean(verification?.document_url);

  if (status === "approved") {
    return [
      {
        title: "Pendaftaran akun",
        description: "Data dasar dokter berhasil diterima.",
        status: "completed",
      },
      {
        title: "Upload dokumen",
        description: "Dokumen STR dan identitas profesi sudah masuk ke sistem.",
        status: "completed",
      },
      {
        title: "Review admin",
        description: "Admin telah menyetujui verifikasi dokter Anda.",
        status: "completed",
      },
      {
        title: "Akses dashboard",
        description: "Dashboard dokter sudah aktif dan dapat digunakan.",
        status: "completed",
      },
    ];
  }

  if (status === "rejected") {
    return [
      {
        title: "Pendaftaran akun",
        description: "Data dasar dokter berhasil diterima.",
        status: "completed",
      },
      {
        title: "Upload dokumen",
        description: hasDocument
          ? "Dokumen STR dan identitas profesi sudah masuk ke sistem."
          : "Dokumen belum ditemukan di sistem.",
        status: hasDocument ? "completed" : "pending",
      },
      {
        title: "Review admin",
        description: "Admin menolak verifikasi dokumen Anda.",
        status: "failed",
      },
      {
        title: "Akses dashboard",
        description: "Dashboard dokter belum dapat diakses.",
        status: "pending",
      },
    ];
  }

  if (isRevisionStatus(status)) {
    return [
      {
        title: "Pendaftaran akun",
        description: "Data dasar dokter berhasil diterima.",
        status: "completed",
      },
      {
        title: "Upload dokumen",
        description: hasDocument
          ? "Dokumen STR dan identitas profesi sudah masuk ke sistem."
          : "Dokumen belum ditemukan di sistem.",
        status: hasDocument ? "completed" : "current",
      },
      {
        title: "Review admin",
        description: "Admin meminta revisi data atau dokumen verifikasi.",
        status: "current",
      },
      {
        title: "Akses dashboard",
        description: "Dashboard dokter aktif setelah revisi disetujui.",
        status: "pending",
      },
    ];
  }

  return [
    {
      title: "Pendaftaran akun",
      description: "Data dasar dokter berhasil diterima.",
      status: "completed",
    },
    {
      title: "Upload dokumen",
      description: hasDocument
        ? "Dokumen STR dan identitas profesi sudah masuk ke sistem."
        : "Dokumen verifikasi belum ditemukan.",
      status: hasDocument ? "completed" : "current",
    },
    {
      title: "Review admin",
      description: hasDocument
        ? "Tim admin sedang memeriksa keaslian dokumen Anda."
        : "Review admin akan dimulai setelah dokumen tersedia.",
      status: hasDocument ? "current" : "pending",
    },
    {
      title: "Akses dashboard",
      description: "Dashboard dokter aktif setelah verifikasi disetujui.",
      status: "pending",
    },
  ];
}

function getStepClass(status: StepStatus) {
  if (status === "completed") {
    return "bg-emerald-600 text-white";
  }

  if (status === "current") {
    return "bg-amber-100 text-amber-700 ring-4 ring-amber-50";
  }

  if (status === "failed") {
    return "bg-rose-100 text-rose-700 ring-4 ring-rose-50";
  }

  return "bg-slate-200 text-slate-500";
}

function StepIcon({ status, index }: { status: StepStatus; index: number }) {
  if (status === "completed") {
    return <CheckIcon />;
  }

  if (status === "failed") {
    return <XIcon />;
  }

  return <>{index + 1}</>;
}

export default async function VerificationStatusPage() {
  noStore();

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to fetch doctor profile on verification page:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });

    redirect("/login");
  }

  if (!profileData) {
    redirect("/login");
  }

  const doctorProfile = profileData as DoctorProfile;

  if (doctorProfile.role !== "doctor") {
    redirect("/login");
  }

  const { data: verificationData, error: verificationError } = await supabase
    .from("doctor_verifications")
    .select(
      `
      doctor_id,
      str_number,
      specialization,
      document_url,
      verification_status,
      rejection_reason,
      revision_note,
      reviewed_by,
      reviewed_at,
      created_at,
      updated_at
      `,
    )
    .eq("doctor_id", doctorProfile.id)
    .maybeSingle();

  if (verificationError) {
    console.error("Failed to fetch doctor verification status:", {
      message: verificationError.message,
      details: verificationError.details,
      hint: verificationError.hint,
      code: verificationError.code,
    });
  }

  const verification = verificationData as DoctorVerification | null;
  const normalizedStatus = normalizeStatus(verification?.verification_status);
  const statusConfig = getStatusConfig(verification?.verification_status);
  const verificationSteps = getVerificationSteps(verification);

  const isApproved = normalizedStatus === "approved";
  const isActive = doctorProfile.is_active !== false;

  if (isApproved && isActive) {
    redirect("/doctor/dashboard");
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
                      {doctorProfile.email ?? user.email ?? "-"}
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
      </div>
    </main>
  );
}
