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

export async function getDoctorVerificationDetail(id: string) {
  await requireAdminProfile();

  const supabase = await createClient();

  const { data, error } = await supabase
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
      revision_note,
      created_at,
      profiles:doctor_id (
        id,
        full_name,
        email
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch doctor verification detail:", error);
    notFound();
  }

  if (!data) {
    notFound();
  }

  const row = data as unknown as {
    id: string;
    doctor_id: string;
    str_number: string | null;
    specialization: string | null;
    document_url: string | null;
    verification_status: VerificationStatus;
    rejection_reason: string | null;
    revision_note: string | null;
    created_at: string | null;
    profiles: {
      id: string;
      full_name: string | null;
      email: string | null;
    } | null;
  };

  const doctor: DoctorVerificationDetail = {
    id: row.id,
    doctorId: row.doctor_id,
    name: row.profiles?.full_name ?? "Dokter",
    email: row.profiles?.email ?? "-",

    // Untuk sekarang fallback dulu karena schema yang kita pakai belum punya phone/address.
    // Kalau nanti ada kolom phone/address, baru query-nya bisa ditambah.
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
    revisionNote: row.revision_note,
  };

  return doctor;
}
