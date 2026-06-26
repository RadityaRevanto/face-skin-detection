import { notFound } from "next/navigation";

import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

import type {
  DoctorDetail,
  DoctorVerificationStatus,
} from "./doctor-detail-types";
import {
  formatDate,
  getDocumentLabel,
  mapVerificationStatus,
} from "./doctor-detail-utils";

export async function getDoctorDetail(id: string): Promise<DoctorDetail> {
  await requireAdminProfile();

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_active, created_at")
    .eq("id", id)
    .eq("role", "doctor")
    .maybeSingle();

  if (profileError) {
    console.error("Failed to fetch doctor profile:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });
    notFound();
  }

  if (!profile) {
    notFound();
  }

  const { data: verificationRows, error: verificationError } = await supabase
    .from("doctor_verifications")
    .select(
      `
      id,
      doctor_id,
      str_number,
      specialization,
      document_url,
      verification_status,
      rejection_reason,
      reviewed_at,
      created_at
    `,
    )
    .eq("doctor_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (verificationError) {
    console.error("Failed to fetch doctor verification:", {
      message: verificationError.message,
      details: verificationError.details,
      hint: verificationError.hint,
      code: verificationError.code,
    });
  }

  const latestVerification =
    (verificationRows?.[0] as
      | {
          id: string;
          doctor_id: string;
          str_number: string | null;
          specialization: string | null;
          document_url: string | null;
          verification_status: DoctorVerificationStatus;
          rejection_reason: string | null;
          reviewed_at: string | null;
          created_at: string | null;
        }
      | undefined) ?? null;

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
          document: getDocumentLabel(latestVerification.document_url),
          documentUrl: latestVerification.document_url,
          status: mapVerificationStatus(latestVerification.verification_status),
          rawStatus: latestVerification.verification_status,
          submittedAt: formatDate(latestVerification.created_at),
          reviewedAt: formatDate(latestVerification.reviewed_at),
          rejectionReason: latestVerification.rejection_reason,
        }
      : null,
  };
}
