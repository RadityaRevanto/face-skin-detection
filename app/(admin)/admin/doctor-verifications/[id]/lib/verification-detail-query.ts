import { notFound } from "next/navigation";

import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

import type {
  DoctorVerificationDetail,
  VerificationStatus,
} from "./verification-detail-types";
import {
  formatDate,
  getDocumentLabel,
  mapVerificationStatus,
} from "./verification-detail-utils";

export async function getDoctorVerificationDetail(
  id: string,
): Promise<DoctorVerificationDetail> {
  await requireAdminProfile();

  const supabase = await createClient();

  const { data: verification, error: verificationError } = await supabase
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
      created_at
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (verificationError) {
    console.error("Failed to fetch doctor verification detail:", {
      message: verificationError.message,
      details: verificationError.details,
      hint: verificationError.hint,
      code: verificationError.code,
    });

    notFound();
  }

  if (!verification) {
    notFound();
  }

  const row = verification as {
    id: string;
    doctor_id: string;
    str_number: string | null;
    specialization: string | null;
    document_url: string | null;
    verification_status: VerificationStatus;
    rejection_reason: string | null;
    created_at: string | null;
  };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", row.doctor_id)
    .eq("role", "doctor")
    .maybeSingle();

  if (profileError) {
    console.error("Failed to fetch doctor profile for verification detail:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });
  }

  return {
    id: row.id,
    doctorId: row.doctor_id,
    name: profile?.full_name ?? "Dokter",
    email: profile?.email ?? "-",

    // Fallback dulu karena schema kita belum punya field phone/address di profiles.
    phone: "-",
    address: "-",

    identity: row.str_number ?? "-",
    specialization: row.specialization ?? "-",
    document: getDocumentLabel(row.document_url),
    documentUrl: row.document_url,
    status: mapVerificationStatus(row.verification_status),
    rawStatus: row.verification_status,
    submittedAt: formatDate(row.created_at),
    rejectionReason: row.rejection_reason,
  };
}
