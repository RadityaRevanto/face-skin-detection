import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";
import { ROUTES } from "@/lib/constants";

import type {
  DoctorVerificationPageData,
  DoctorVerificationPageType,
  DoctorVerificationRequest,
} from "./doctorVerificationTypes";

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

async function fetchCount(status: string): Promise<number> {
  try {
    const res = await fetchApi<{ meta: { total: number } }>(
      `/admin/verifications?status=${status}&per_page=1`
    );
    return res.meta?.total ?? 0;
  } catch {
    return 0;
  }
}

export async function getPendingVerificationCount() {
  return fetchCount("pending");
}

type GetDoctorVerificationPageDataParams = {
  page?: number;
  pageType: DoctorVerificationPageType;
};

interface VerificationApi {
  id: string;
  uuid: string;
  specialization: string;
  str_number: string;
  documents?: {
    uuid: string;
    url: string;
    file_name: string;
  }[];
  verification_status: string;
  created_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
  doctor?: {
    id: string;
    uuid: string;
    name: string;
    email: string;
  };
}

export async function getDoctorVerificationPageData({
  page = 1,
  pageType,
}: GetDoctorVerificationPageDataParams): Promise<DoctorVerificationPageData> {
  await requireAdminProfile();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;

  const targetStatus = pageType === "pending" ? "pending" : "rejected";

  const [pendingCount, rejectedCount, approvedCount] = await Promise.all([
    fetchCount("pending"),
    fetchCount("rejected"),
    fetchCount("approved"),
  ]);

  try {
    const res = await fetchApi<VerificationApi[]>(
      `/admin/verifications?status=${targetStatus}&page=${safePage}&per_page=${PAGE_SIZE}`
    );

    const verificationRequests: DoctorVerificationRequest[] = (res.data ?? []).map(
      (verification: VerificationApi, index: number) => {
        const profile = verification.doctor;

        return {
          id: verification.uuid || verification.id,
          no: from + index + 1,
          name: profile?.name ?? "Dokter",
          email: profile?.email ?? "-",
          identity: verification.str_number ?? "-",
          specialization: verification.specialization ?? "-",
          documents: verification.documents ?? [],
          status: pageType === "pending" ? "Pending" : "Rejected",
          submittedAt: formatDate(verification.created_at),
          reviewedAt: formatDate(verification.reviewed_at),
          rejectionReason: verification.rejection_reason ?? null,
        };
      },
    );

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
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath:
          pageType === "pending"
            ? `${ROUTES.ADMIN.DOCTOR_VERIFICATIONS}/pending`
            : `${ROUTES.ADMIN.DOCTOR_VERIFICATIONS}/rejected`,
        itemLabel: "verifikasi",
      },
    };
  } catch (error) {
    console.error("Failed to fetch doctor verifications:", error);

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
        basePath:
          pageType === "pending"
            ? `${ROUTES.ADMIN.DOCTOR_VERIFICATIONS}/pending`
            : `${ROUTES.ADMIN.DOCTOR_VERIFICATIONS}/rejected`,
        itemLabel: "verifikasi",
      },
    };
  }
}
