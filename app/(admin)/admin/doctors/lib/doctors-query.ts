import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

import type { DoctorRow, DoctorsPageData } from "./doctors-types";

const PAGE_SIZE = 10;

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function getDocumentLabel(documentUrl: string | null) {
  if (!documentUrl) {
    return "No Document";
  }

  const fileName = documentUrl.split("/").pop();

  return fileName || "Document";
}

type GetDoctorsPageDataParams = {
  page?: number;
};

export async function getDoctorsPageData({
  page = 1,
}: GetDoctorsPageDataParams = {}): Promise<DoctorsPageData> {
  await requireAdminProfile();

  const supabase = await createClient();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("doctor_verifications")
    .select(
      `
      id,
      doctor_id,
      str_number,
      specialization,
      document_url,
      verification_status,
      reviewed_at,
      created_at,
      profiles:doctor_id (
        id,
        full_name,
        email,
        is_active
      )
    `,
      {
        count: "exact",
      },
    )
    .eq("verification_status", "approved")
    .order("reviewed_at", {
      ascending: false,
      nullsFirst: false,
    })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch doctors:", error);

    return {
      doctors: [],
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }

  const rows = (data ?? []) as unknown as Array<{
    id: string;
    doctor_id: string;
    str_number: string | null;
    specialization: string | null;
    document_url: string | null;
    verification_status: string;
    reviewed_at: string | null;
    created_at: string | null;
    profiles: {
      id: string;
      full_name: string | null;
      email: string | null;
      is_active: boolean | null;
    } | null;
  }>;

  const doctors: DoctorRow[] = rows.map((doctor, index) => ({
    id: doctor.doctor_id,
    verificationId: doctor.id,
    no: from + index + 1,
    name: doctor.profiles?.full_name ?? "Dokter",
    email: doctor.profiles?.email ?? "-",
    identity: doctor.str_number ?? "-",
    specialization: doctor.specialization ?? "-",
    document: getDocumentLabel(doctor.document_url),
    documentUrl: doctor.document_url,
    verifiedAt: formatDate(doctor.reviewed_at ?? doctor.created_at),
    status: doctor.profiles?.is_active === false ? "Suspended" : "Approved",
    isActive: doctor.profiles?.is_active ?? true,
  }));

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return {
    doctors,
    pagination: {
      currentPage: safePage,
      totalPages,
      totalItems,
      pageSize: PAGE_SIZE,
    },
  };
}
