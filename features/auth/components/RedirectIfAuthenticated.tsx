"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

/**
 * Pengganti `redirectIfAuthenticated` server-side lama.
 * Jika user sudah login, arahkan ke dashboard sesuai role & status.
 */
function dashboardPathFor(role: string, status: string | undefined): string | null {
  if (role === "admin") {
    return status === "inactive" ? null : "/admin/dashboard";
  }
  if (role === "user") {
    return status === "inactive" ? null : "/user/home";
  }
  if (role === "doctor") {
    return status === "approved" ? "/doctor/dashboard" : "/doctor/verification-status";
  }
  return null;
}

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isAuthenticated || !currentUser) return;

    const path = dashboardPathFor(
      currentUser.role,
      currentUser.verification_status ??
        (currentUser.is_active === false ? "inactive" : "active"),
    );

    if (path) {
      router.replace(path);
    }
  }, [isLoaded, isAuthenticated, currentUser, router]);

  return <>{children}</>;
}
