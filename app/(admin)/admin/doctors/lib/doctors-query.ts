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

type DoctorVerificationRow = {
  id: string;
  doctor_id: string;
  str_number: string | null;
  specialization: string | null;
  document_url: string | null;
  verification_status: "approved";
  reviewed_at: string | null;
  created_at: string | null;
};

type DoctorProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  is_active: boolean | null;
};

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

  const {
    data: verificationData,
    error: verificationError,
    count,
  } = await supabase
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
      created_at
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

  if (verificationError) {
    console.error("Failed to fetch approved doctor verifications:", {
      message: verificationError.message,
      details: verificationError.details,
      hint: verificationError.hint,
      code: verificationError.code,
    });

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

  const verifications = (verificationData ?? []) as DoctorVerificationRow[];
  const doctorIds = verifications.map((verification) => verification.doctor_id);

  let profilesById = new Map<string, DoctorProfileRow>();

  if (doctorIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, is_active")
      .eq("role", "doctor")
      .in("id", doctorIds);

    if (profilesError) {
      console.error("Failed to fetch approved doctor profiles:", {
        message: profilesError.message,
        details: profilesError.details,
        hint: profilesError.hint,
        code: profilesError.code,
      });
    }

    profilesById = new Map(
      ((profilesData ?? []) as DoctorProfileRow[]).map((profile) => [
        profile.id,
        profile,
      ]),
    );
  }

  const doctors: DoctorRow[] = verifications
    .map((verification, index) => {
      const profile = profilesById.get(verification.doctor_id);

      if (!profile) {
        return null;
      }

      return {
        id: profile.id,
        verificationId: verification.id,
        no: from + index + 1,
        name: profile.full_name ?? "Dokter",
        email: profile.email ?? "-",
        identity: verification.str_number ?? "-",
        specialization: verification.specialization ?? "-",
        document: "-",
        documentUrl: verification.document_url,
        verifiedAt: formatDate(
          verification.reviewed_at ?? verification.created_at,
        ),
        status: "Approved",
        rawStatus: "approved",
        isActive: profile.is_active ?? true,
      };
    })
    .filter((doctor): doctor is DoctorRow => doctor !== null);

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
