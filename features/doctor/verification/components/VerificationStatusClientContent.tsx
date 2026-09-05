"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { doctorService } from "@/features/doctor/services/doctorService";
import { profileService } from "@/features/profile/services/profileService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { DoctorProfile, DoctorVerification } from "./VerificationTypes";
import { VerificationStatusContent } from "./VerificationStatusContent";
import { normalizeStatus } from "../utils/verificationUtils";

export function VerificationStatusClientContent() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const { data: doctorProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<DoctorProfile | null> => {
      try {
        const profile = await profileService.get();
        return {
          id: profile.uuid,
          full_name: profile.full_name ?? null,
          email: profile.email ?? null,
          role: profile.role ?? null,
          is_active: (profile.is_active ?? true) as boolean | null,
        };
      } catch {
        return null;
      }
    },
  });

  const { data: verification } = useQuery({
    queryKey: ["doctor", "verification"],
    queryFn: async (): Promise<DoctorVerification | null> => {
      try {
        return await doctorService.verification();
      } catch (error) {
        // 404 = belum pernah mengajukan verifikasi — bukan error fatal.
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });

  const normalizedStatus = normalizeStatus(verification?.verification_status);

  // Dokter approved & aktif tidak perlu di halaman status.
  useEffect(() => {
    if (normalizedStatus === "approved" && doctorProfile?.is_active !== false) {
      router.replace("/doctor/dashboard");
    }
  }, [normalizedStatus, doctorProfile, router]);

  if (!doctorProfile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <VerificationStatusContent
      doctorProfile={doctorProfile}
      verification={verification ?? null}
    />
  );
}
