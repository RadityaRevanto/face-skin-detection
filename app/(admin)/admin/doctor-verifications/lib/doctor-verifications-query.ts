import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

import type {
  DoctorVerificationPageData,
  DoctorVerificationRequest,
  VerificationStatus,
} from "./doctor-verification-types";

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

function mapVerificationStatus(status: VerificationStatus | string) {
  if (status === "revision_required") {
    return "Revision Required";
  }

  if (status === "pending") {
    return "Pending";
  }

  if (status === "approved") {
    return "Approved";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  if (status === "suspended") {
    return "Suspended";
  }

  return "Pending";
}

function getDocumentLabel(documentUrl: string | null) {
  if (!documentUrl) {
    return "No Document";
  }

  const fileName = documentUrl.split("/").pop();

  return fileName || "Document";
}

async function getCount(
  table: string,
  filters?: (query: any) => any,
): Promise<number> {
  const supabase = await createClient();

  let query = supabase.from(table).select("*", {
    count: "exact",
    head: true,
  });

  if (filters) {
    query = filters(query);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`Failed to count ${table}:`, error);
    return 0;
  }

  return count ?? 0;
}

type GetDoctorVerificationsParams = {
  page?: number;
};

export async function getDoctorVerificationPageData({
  page = 1,
}: GetDoctorVerificationsParams = {}): Promise<DoctorVerificationPageData> {
  await requireAdminProfile();

  const supabase = await createClient();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [pendingCount, revisionCount, totalQueue] = await Promise.all([
    getCount("doctor_verifications", (query) =>
      query.eq("verification_status", "pending"),
    ),
    getCount("doctor_verifications", (query) =>
      query.eq("verification_status", "revision_required"),
    ),
    getCount("doctor_verifications", (query) =>
      query.in("verification_status", ["pending", "revision_required"]),
    ),
  ]);

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
      created_at,
      profiles:doctor_id (
        id,
        full_name,
        email
      )
    `,
      {
        count: "exact",
      },
    )
    .in("verification_status", ["pending", "revision_required"])
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch doctor verifications:", error);

    return {
      verificationRequests: [],
      stats: {
        pendingCount,
        revisionCount,
        totalQueue,
      },
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
    verification_status: VerificationStatus;
    created_at: string | null;
    profiles: {
      id: string;
      full_name: string | null;
      email: string | null;
    } | null;
  }>;

  const verificationRequests: DoctorVerificationRequest[] = rows.map(
    (doctor, index) => ({
      id: doctor.id,
      no: from + index + 1,
      name: doctor.profiles?.full_name ?? "Dokter",
      email: doctor.profiles?.email ?? "-",
      identity: doctor.str_number ?? "-",
      specialization: doctor.specialization ?? "-",
      document: getDocumentLabel(doctor.document_url),
      documentUrl: doctor.document_url,
      status: mapVerificationStatus(doctor.verification_status),
      submittedAt: formatDate(doctor.created_at),
    }),
  );

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return {
    verificationRequests,
    stats: {
      pendingCount,
      revisionCount,
      totalQueue,
    },
    pagination: {
      currentPage: safePage,
      totalPages,
      totalItems,
      pageSize: PAGE_SIZE,
    },
  };
}
