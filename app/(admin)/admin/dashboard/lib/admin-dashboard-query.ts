import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

import type {
  AdminDashboardData,
  LatestUser,
  UserRoleSummary,
  VerificationRequest,
  VerifiedDoctor,
} from "./admin-dashboard-types";

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

async function fetchCount(endpoint: string): Promise<number> {
  try {
    const res = await fetchApi<{ meta: { total: number } }>(endpoint);
    return res.meta?.total ?? 0;
  } catch {
    return 0;
  }
}

function mapVerificationStatus(status: string) {
  if (status === "needs_revision" || status === "revision_required") {
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

interface UserApi {
  id: string;
  uuid: string;
  full_name: string;
  email: string;
  created_at: string;
  role: string;
  avatar_url?: string;
  is_active?: boolean;
}

interface VerificationApi {
  id: string;
  uuid: string;
  specialization: string;
  str_number: string;
  document_url: string;
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

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await requireAdminProfile();

  const [
    regularUsersCount,
    doctorsCount,
    adminsCount,
    verifiedDoctorsCount,
    pendingVerificationsCount,
  ] = await Promise.all([
    fetchCount("/admin/users?role=user&per_page=1"),
    fetchCount("/admin/users?role=doctor&per_page=1"),
    fetchCount("/admin/users?role=admin&per_page=1"),
    fetchCount("/admin/verifications?status=approved&per_page=1"),
    fetchCount("/admin/verifications?status=pending&per_page=1"),
  ]);

  const suspendedAccountsCount = 0; // Not implemented yet in Laravel backend filters

  const totalUsers = regularUsersCount + doctorsCount + adminsCount;

  const stats = [
    {
      label: "Total Users",
      value: String(totalUsers),
      trend: "+12.5%",
      helper: "vs last month",
      tone: "bg-emerald-50 text-emerald-600",
      icon: "users",
    },
    {
      label: "Verified Doctors",
      value: String(verifiedDoctorsCount),
      trend: "+8.2%",
      helper: "vs last month",
      tone: "bg-emerald-50 text-emerald-600",
      icon: "stethoscope",
    },
    {
      label: "Pending Verifications",
      value: String(pendingVerificationsCount),
      trend: "-6.7%",
      helper: "vs last month",
      tone: "bg-amber-50 text-amber-600",
      icon: "shield",
    },
    {
      label: "Suspended Accounts",
      value: String(suspendedAccountsCount),
      trend: "+2.1%",
      helper: "vs last month",
      tone: "bg-rose-50 text-rose-600",
      icon: "blocked",
    },
  ];

  const userRoleSummary: UserRoleSummary[] = [
    {
      label: "Regular Users",
      value: String(regularUsersCount),
      tone: "text-emerald-700",
    },
    {
      label: "Doctors",
      value: String(doctorsCount),
      tone: "text-sky-700",
    },
    {
      label: "Admins",
      value: String(adminsCount),
      tone: "text-violet-700",
    },
  ];

  let latestProfiles: UserApi[] = [];
  try {
    const res = await fetchApi<UserApi[]>("/admin/users?role=user&per_page=3");
    latestProfiles = res.data ?? [];
  } catch (error) {
    console.error("Failed to fetch latest users:", error);
  }

  const latestUsers: LatestUser[] = latestProfiles.map((user: UserApi) => ({
    name: user.full_name ?? "User",
    email: user.email ?? "-",
    role: "User",
    join: formatDate(user.created_at),
  }));

  let verifiedDoctorRows: VerificationApi[] = [];
  try {
    const res = await fetchApi<VerificationApi[]>("/admin/verifications?status=approved&per_page=3");
    verifiedDoctorRows = res.data ?? [];
  } catch (error) {
    console.error("Failed to fetch verified doctors:", error);
  }

  const verifiedDoctors: VerifiedDoctor[] = verifiedDoctorRows.map((doctor: VerificationApi) => ({
    name: doctor.doctor?.name ?? "Dokter",
    email: doctor.doctor?.email ?? "-",
    specialization: doctor.specialization ?? "Dermatologi",
    verifiedAt: formatDate(doctor.reviewed_at ?? doctor.created_at),
  }));

  let verificationRows: VerificationApi[] = [];
  try {
    const res = await fetchApi<VerificationApi[]>("/admin/verifications?status=pending&per_page=4");
    verificationRows = res.data ?? [];
  } catch (error) {
    console.error("Failed to fetch verification requests:", error);
  }

  const verificationRequests: VerificationRequest[] = verificationRows.map((doctor: VerificationApi) => ({
    id: doctor.id,
    name: doctor.doctor?.name ?? "Dokter",
    email: doctor.doctor?.email ?? "-",
    identity: doctor.str_number ?? doctor.specialization ?? "Dokumen Dokter",
    submittedAt: formatDate(doctor.created_at),
    status: mapVerificationStatus(doctor.verification_status),
  }));

  return {
    stats,
    latestUsers,
    verifiedDoctors,
    userRoleSummary,
    verificationRequests,
  };
}
