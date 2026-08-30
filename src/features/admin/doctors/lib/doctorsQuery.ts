import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";
import { ROUTES } from "@/lib/constants";

import type { DoctorRow, DoctorsPageData } from "./doctorsTypes";

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

type GetDoctorsPageDataParams = {
  page?: number;
};

interface VerificationApi {
  id: string;
  uuid: string;
  specialization: string;
  str_number: string;
  documents: Array<{ uuid: string; url: string; file_name: string | null }>;
  verification_status: string;
  created_at: string;
  reviewed_at?: string;
  doctor?: {
    id: string;
    uuid: string;
    name: string;
    email: string;
  };
}

export async function getDoctorsPageData({
  page = 1,
}: GetDoctorsPageDataParams = {}): Promise<DoctorsPageData> {
  await requireAdminProfile();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;

  try {
    const res = await fetchApi<VerificationApi[]>(
      `/admin/verifications?status=approved&page=${safePage}&per_page=${PAGE_SIZE}`,
    );

    const doctors: DoctorRow[] = (res.data ?? []).map((verification: VerificationApi, index: number) => {
      const profile = verification.doctor;

      return {
        id: profile?.uuid ?? profile?.id ?? verification.uuid ?? verification.id,
        verificationId: verification.uuid ?? verification.id,
        no: from + index + 1,
        name: profile?.name ?? "Dokter",
        email: profile?.email ?? "-",
        identity: verification.str_number ?? "-",
        specialization: verification.specialization ?? "-",
        documents: verification.documents ?? [],
        verifiedAt: formatDate(verification.reviewed_at ?? verification.created_at),
        status: "Approved",
        rawStatus: "approved",
        isActive: true,
      };
    });

    return {
      doctors,
      pagination: {
        currentPage: safePage,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: ROUTES.ADMIN.DOCTORS,
        itemLabel: "dokter",
      },
    };
  } catch (error) {
    console.error("Failed to fetch approved doctor verifications:", error);

    return {
      doctors: [],
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
        basePath: ROUTES.ADMIN.DOCTORS,
        itemLabel: "dokter",
      },
    };
  }
}
