"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import type { AuthUser } from "@/lib/api";

export type UserRole = AuthUser["role"];

function hasRole(user: AuthUser, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(user.role);
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { currentUser, isAuthenticated, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && currentUser && !hasRole(currentUser, allowedRoles)) {
      router.replace("/");
    }
  }, [isLoaded, isAuthenticated, currentUser, allowedRoles, router, pathname]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5]" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-3" suppressHydrationWarning>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" suppressHydrationWarning />
          <p className="text-sm font-medium text-slate-500 animate-pulse" suppressHydrationWarning>
            Memverifikasi sesi...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && currentUser && !hasRole(currentUser, allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}

export { hasRole };
