import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

import type {
  DoctorVerificationPageData,
  DoctorVerificationPageType,
  DoctorVerificationRequest,
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
    console.error(`Failed to count ${table}:`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return 0;
  }

  return count ?? 0;
}

type GetDoctorVerificationPageDataParams = {
  page?: number;
  pageType: DoctorVerificationPageType;
};

export async function getDoctorVerificationPageData({
  page = 1,
  pageType,
}: GetDoctorVerificationPageDataParams): Promise<DoctorVerificationPageData> {
  await requireAdminProfile();

  const supabase = await createClient();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const targetStatus = pageType === "pending" ? "pending" : "rejected";

  const [pendingCount, rejectedCount, approvedCount] = await Promise.all([
    getCount("doctor_verifications", (query) =>
      query.eq("verification_status", "pending"),
    ),
    getCount("doctor_verifications", (query) =>
      query.eq("verification_status", "rejected"),
    ),
    getCount("doctor_verifications", (query) =>
      query.eq("verification_status", "approved"),
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
      rejection_reason,
      reviewed_at,
      created_at
      `,
      {
        count: "exact",
      },
    )
    .eq("verification_status", targetStatus)
    .order(pageType === "pending" ? "created_at" : "reviewed_at", {
      ascending: false,
      nullsFirst: false,
    })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch doctor verifications:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return {
      pageType,
      verificationRequests: [],
      stats: {
        pendingCount,
        rejectedCount,
        approvedCount,
      },
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }

  const rows = (data ?? []) as Array<{
    id: string;
    doctor_id: string;
    str_number: string | null;
    specialization: string | null;
    document_url: string | null;
    verification_status: "pending" | "rejected";
    rejection_reason: string | null;
    reviewed_at: string | null;
    created_at: string | null;
  }>;

  const doctorIds = rows.map((row) => row.doctor_id);

  let profilesById = new Map<
    string,
    {
      id: string;
      full_name: string | null;
      email: string | null;
    }
  >();

  if (doctorIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", doctorIds);

    if (profilesError) {
      console.error("Failed to fetch doctor profiles:", {
        message: profilesError.message,
        details: profilesError.details,
        hint: profilesError.hint,
        code: profilesError.code,
      });
    }

    profilesById = new Map(
      (profilesData ?? []).map((profile) => [
        profile.id,
        {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
        },
      ]),
    );
  }

  const verificationRequests: DoctorVerificationRequest[] = rows.map(
    (verification, index) => {
      const profile = profilesById.get(verification.doctor_id);

      return {
        id: verification.id,
        no: from + index + 1,
        name: profile?.full_name ?? "Dokter",
        email: profile?.email ?? "-",
        identity: verification.str_number ?? "-",
        specialization: verification.specialization ?? "-",
        document: getDocumentLabel(verification.document_url),
        documentUrl: verification.document_url,
        status: pageType === "pending" ? "Pending" : "Rejected",
        submittedAt: formatDate(verification.created_at),
        reviewedAt: formatDate(verification.reviewed_at),
        rejectionReason: verification.rejection_reason,
      };
    },
  );

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return {
    pageType,
    verificationRequests,
    stats: {
      pendingCount,
      rejectedCount,
      approvedCount,
    },
    pagination: {
      currentPage: safePage,
      totalPages,
      totalItems,
      pageSize: PAGE_SIZE,
    },
  };
}
