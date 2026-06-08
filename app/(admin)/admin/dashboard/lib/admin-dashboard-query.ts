import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/admin-auth";

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

async function getCount(table: string, filters?: (query: any) => any) {
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

function mapVerificationStatus(status: string) {
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

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await requireAdminProfile();

  const supabase = await createClient();

  const [
    regularUsersCount,
    doctorsCount,
    adminsCount,
    verifiedDoctorsCount,
    pendingVerificationsCount,
    suspendedAccountsCount,
  ] = await Promise.all([
    getCount("profiles", (query) => query.eq("role", "user")),
    getCount("profiles", (query) => query.eq("role", "doctor")),
    getCount("profiles", (query) => query.eq("role", "admin")),
    getCount("doctor_verifications", (query) =>
      query.eq("verification_status", "approved"),
    ),
    getCount("doctor_verifications", (query) =>
      query.in("verification_status", ["pending", "revision_required"]),
    ),
    getCount("profiles", (query) => query.eq("is_active", false)),
  ]);

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

  const { data: latestProfiles, error: latestProfilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(3);

  if (latestProfilesError) {
    console.error("Failed to fetch latest users:", latestProfilesError);
  }

  const latestUsers: LatestUser[] = (latestProfiles ?? []).map((user) => ({
    name: user.full_name ?? "User",
    email: user.email ?? "-",
    role: "User",
    join: formatDate(user.created_at),
  }));

  const { data: verifiedDoctorRows, error: verifiedDoctorError } =
    await supabase
      .from("doctor_verifications")
      .select(
        `
        id,
        specialization,
        reviewed_at,
        created_at,
        profiles:doctor_id (
          id,
          full_name,
          email
        )
      `,
      )
      .eq("verification_status", "approved")
      .order("reviewed_at", { ascending: false, nullsFirst: false })
      .limit(3);

  if (verifiedDoctorError) {
    console.error("Failed to fetch verified doctors:", verifiedDoctorError);
  }

  const verifiedDoctors: VerifiedDoctor[] = (
    (verifiedDoctorRows ?? []) as unknown as Array<{
      id: string;
      specialization: string | null;
      reviewed_at: string | null;
      created_at: string | null;
      profiles: {
        id: string;
        full_name: string | null;
        email: string | null;
      } | null;
    }>
  ).map((doctor) => ({
    name: doctor.profiles?.full_name ?? "Dokter",
    email: doctor.profiles?.email ?? "-",
    specialization: doctor.specialization ?? "Dermatologi",
    verifiedAt: formatDate(doctor.reviewed_at ?? doctor.created_at),
  }));

  const { data: verificationRows, error: verificationRowsError } =
    await supabase
      .from("doctor_verifications")
      .select(
        `
        id,
        str_number,
        specialization,
        verification_status,
        created_at,
        profiles:doctor_id (
          id,
          full_name,
          email
        )
      `,
      )
      .in("verification_status", ["pending", "revision_required"])
      .order("created_at", { ascending: false })
      .limit(4);

  if (verificationRowsError) {
    console.error(
      "Failed to fetch verification requests:",
      verificationRowsError,
    );
  }

  const verificationRequests: VerificationRequest[] = (
    (verificationRows ?? []) as unknown as Array<{
      id: string;
      str_number: string | null;
      specialization: string | null;
      verification_status: string;
      created_at: string;
      profiles: {
        id: string;
        full_name: string | null;
        email: string | null;
      } | null;
    }>
  ).map((doctor) => ({
    id: doctor.id,
    name: doctor.profiles?.full_name ?? "Dokter",
    email: doctor.profiles?.email ?? "-",
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
