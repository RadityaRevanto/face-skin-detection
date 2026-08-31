import { notFound } from "next/navigation";

import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

import type {
  DoctorDetail,
  DoctorVerificationStatus,
} from "./doctorDetailTypes";
import {
  formatDate,
  mapVerificationStatus,
} from "./doctorDetailUtils";

interface DoctorDetailApi {
  id: string;
  uuid: string;
  full_name: string;
  email: string;
  role: string;
  is_active?: boolean;
  avatar_url?: string;
  created_at: string;
  doctor_verification?: {
    id: string;
    uuid: string;
    str_number: string;
    specialization: string;
    documents: Array<{ uuid: string; url: string; file_name: string | null }>;
    verification_status: DoctorVerificationStatus;
    created_at: string;
    reviewed_at?: string;
    rejection_reason?: string;
  };
}

export async function getDoctorDetail(id: string): Promise<DoctorDetail> {
  await requireAdminProfile();

  try {
    const res = await fetchApi<DoctorDetailApi>(`/admin/users/${id}`);
    const profile = res.data;

    if (!profile || profile.role !== "doctor") {
      notFound();
    }

    const latestVerification = profile.doctor_verification;

    return {
      id: profile.id,
      name: profile.full_name ?? "Dokter",
      email: profile.email ?? "-",
      role: "doctor",
      isActive: profile.is_active ?? true,
      joinedAt: formatDate(profile.created_at),
      avatarUrl: profile.avatar_url ?? null,
      latestVerification: latestVerification
        ? {
            id: latestVerification.id,
            identity: latestVerification.str_number ?? "-",
            specialization: latestVerification.specialization ?? "-",
            documents: latestVerification.documents ?? [],
            status: mapVerificationStatus(latestVerification.verification_status),
            rawStatus: latestVerification.verification_status,
            submittedAt: formatDate(latestVerification.created_at),
            reviewedAt: formatDate(latestVerification.reviewed_at),
            rejectionReason: latestVerification.rejection_reason ?? null,
          }
        : null,
    };
  } catch (error) {
    console.error("Failed to fetch doctor profile:", error);
    notFound();
  }
}
