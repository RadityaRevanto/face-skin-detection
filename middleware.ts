import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { updateSession } from "@/lib/supabase/middleware";

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/user", "/doctor", "/admin"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtectedRoute) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Session cookie sudah di-handle oleh updateSession(request)
        },
      },
    },
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirectTo(request, "/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return redirectTo(request, "/login");
  }

  /**
   * ADMIN GUARD
   */
  if (pathname.startsWith("/admin")) {
    if (profile.role !== "admin") {
      return redirectTo(request, "/");
    }

    if (profile.is_active === false) {
      return redirectTo(request, "/login");
    }

    return response;
  }

  /**
   * USER GUARD
   */
  if (pathname.startsWith("/user")) {
    if (profile.role !== "user") {
      return redirectTo(request, "/");
    }

    if (profile.is_active === false) {
      return redirectTo(request, "/login");
    }

    return response;
  }

  /**
   * DOCTOR GUARD
   *
   * Dokter pending tetap boleh masuk ke:
   * /doctor/verification-status
   *
   * Karena dokter pending punya:
   * role = doctor
   * is_active = false
   */
  if (pathname.startsWith("/doctor")) {
    if (profile.role !== "doctor") {
      return redirectTo(request, "/");
    }

    const isVerificationStatusPage =
      pathname === "/doctor/verification-status" ||
      pathname.startsWith("/doctor/verification-status/");

    const { data: verification, error: verificationError } = await supabase
      .from("doctor_verifications")
      .select("verification_status")
      .eq("doctor_id", user.id)
      .maybeSingle();

    if (verificationError) {
      console.error("Failed to fetch doctor verification in middleware:", {
        message: verificationError.message,
        details: verificationError.details,
        hint: verificationError.hint,
        code: verificationError.code,
      });
    }

    const verificationStatus =
      verification?.verification_status?.toLowerCase().trim() || "pending";

    const isApproved = verificationStatus === "approved";
    const isActive = profile.is_active !== false;

    /**
     * Kalau dokter sudah approved dan aktif,
     * jangan biarkan tetap di halaman status.
     */
    if (isVerificationStatusPage && isApproved && isActive) {
      return redirectTo(request, "/doctor/dashboard");
    }

    /**
     * Kalau dokter belum approved / belum aktif,
     * hanya boleh akses halaman verification-status.
     */
    if (!isApproved || !isActive) {
      if (!isVerificationStatusPage) {
        return redirectTo(request, "/doctor/verification-status");
      }

      return response;
    }

    /**
     * Dokter approved + aktif boleh akses semua route doctor.
     */
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
