import type { DoctorVerification, StepStatus, VerificationStep } from "./verification-types";
import { CheckIcon, XIcon } from "./verification-icons";
import { normalizeStatus, isRevisionStatus } from "./verification-utils";

export function getVerificationSteps(
  verification: DoctorVerification | null,
): VerificationStep[] {
  const status = normalizeStatus(verification?.verification_status);
  const hasDocument = Boolean(verification?.documents?.length);

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

export function getStepClass(status: StepStatus) {
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

export function StepIcon({ status, index }: { status: StepStatus; index: number }) {
  if (status === "completed") {
    return <CheckIcon />;
  }

  if (status === "failed") {
    return <XIcon />;
  }

  return <>{index + 1}</>;
}
