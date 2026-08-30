import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/api/server-client";
import type { DoctorProfile, DoctorVerification, ApiStatusError } from "@/src/features/doctor/verification/components/VerificationTypes";
import { VerificationStatusContent } from "@/src/features/doctor/verification/components/VerificationStatusContent";
import { normalizeStatus } from "@/src/features/doctor/verification/utils/verificationUtils";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Status Verifikasi",
  description: "Status verifikasi akun dokter Anda",
};

export default async function VerificationStatusPage() {
  let doctorProfile: DoctorProfile | null = null;
  let verification: DoctorVerification | null = null;

  try {
    const resProfile = await fetchApi<DoctorProfile>("/profile");
    doctorProfile = resProfile.data ?? null;
    if (!doctorProfile || doctorProfile.role !== "doctor") redirect("/login");
    try {
      const resVerification = await fetchApi<DoctorVerification>("/doctor-verifications");
      verification = resVerification.data ?? null;
    } catch (error) {
      if ((error as ApiStatusError)?.status !== 404) console.error("Failed to fetch doctor verification status:", error);
    }
  } catch (error) {
    if ((error as ApiStatusError)?.status !== 404) console.error("Failed to fetch doctor profile:", error);
  }

  if (!doctorProfile) redirect("/login");
  const normalizedStatus = normalizeStatus(verification?.verification_status);
  if (normalizedStatus === "approved" && doctorProfile.is_active !== false) redirect("/api/auth/sync");

  return <VerificationStatusContent doctorProfile={doctorProfile} verification={verification} />;
}
