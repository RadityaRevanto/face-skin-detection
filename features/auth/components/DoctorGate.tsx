"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

/**
 * Guard khusus dokter (pengganti logika middleware lama):
 * - Belum approved / inactive → hanya boleh /doctor/verification-status
 *   dan halaman profile; selain itu dialihkan ke halaman status.
 * - Sudah approved → jika membuka halaman status, dialihkan ke dashboard.
 */
export function DoctorGate({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded || !currentUser || currentUser.role !== "doctor") return;

    const isApproved = currentUser.verification_status === "approved";
    const isActive = currentUser.is_active !== false;

    const isVerificationStatusPage =
      pathname === "/doctor/verification-status" ||
      pathname.startsWith("/doctor/verification-status/");

    const isProfilePage =
      pathname === "/doctor/profile" ||
      pathname.startsWith("/doctor/profile/");

    if (isVerificationStatusPage && isApproved && isActive) {
      router.replace("/doctor/dashboard");
      return;
    }

    if (!isApproved || !isActive) {
      if (!isVerificationStatusPage && !isProfilePage) {
        router.replace("/doctor/verification-status");
      }
    }
  }, [isLoaded, currentUser, router, pathname]);

  return <>{children}</>;
}
