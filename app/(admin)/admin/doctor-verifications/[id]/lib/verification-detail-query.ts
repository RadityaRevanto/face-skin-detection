import { notFound } from "next/navigation";

import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

import type {
  DoctorVerificationDetail,
  VerificationStatus,
} from "./verification-detail-types";
import {
  formatDate,
  mapVerificationStatus,
} from "./verification-detail-utils";

interface VerificationDetailApi {
  uuid: string;
  doctor_id?: string;
  specialization: string;
  str_number: string;
  documents?: {
    uuid: string;
    url: string;
    file_name: string;
  }[];
  verification_status: VerificationStatus;
  created_at: string;
  reviewed_at?: string;
  rejection_reason?: string | null;
  doctor?: {
    id: string;
    uuid: string;
    name: string;
    email: string;
  };
}

export async function getDoctorVerificationDetail(
  id: string,
): Promise<DoctorVerificationDetail> {
  await requireAdminProfile();

  try {
    const res = await fetchApi<VerificationDetailApi>(`/admin/verifications/${id}`);
    const row = res.data;

    if (!row) {
      notFound();
    }

    const profile = row.doctor;

    return {
      id: row.uuid,
      doctorId: row.doctor_id ?? profile?.uuid ?? "",
      name: profile?.name ?? "Dokter",
      email: profile?.email ?? "-",

      // Fallback dulu karena schema kita belum punya field phone/address di profiles.
      phone: "-",
      address: "-",

      identity: row.str_number ?? "-",
      specialization: row.specialization ?? "-",
      documents: row.documents ?? [],
      status: mapVerificationStatus(row.verification_status),
      rawStatus: row.verification_status,
      submittedAt: formatDate(row.created_at),
      rejectionReason: row.rejection_reason ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch doctor verification detail:", error);
    notFound();
  }
}
