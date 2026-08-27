import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = ""; // clear search params to prevent redirect loops
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/user", "/doctor", "/admin"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (pathname === "/login" && request.nextUrl.searchParams.get("clear_session") === "true") {
    // Add ?session_expired=true so the login page can show a message
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "?session_expired=true";
    
    const response = NextResponse.redirect(url);
    response.cookies.delete("auth_token");
    response.cookies.delete("user_role");
    response.cookies.delete("user_status");
    return response;
  }

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Ambil token dari cookie (di-set dari Laravel Sanctum)
  const authToken = request.cookies.get("auth_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  const userStatus = request.cookies.get("user_status")?.value;

  if (!authToken || !userRole) {
    return redirectTo(request, "/login");
  }

  /**
   * ADMIN GUARD
   */
  if (pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      return redirectTo(request, "/");
    }

    if (userStatus === "inactive") {
      return redirectTo(request, "/login");
    }

    return NextResponse.next();
  }

  /**
   * USER GUARD
   */
  if (pathname.startsWith("/user")) {
    if (userRole !== "user") {
      return redirectTo(request, "/");
    }

    if (userStatus === "inactive") {
      return redirectTo(request, "/login");
    }

    return NextResponse.next();
  }

  /**
   * DOCTOR GUARD
   */
  if (pathname.startsWith("/doctor")) {
    if (userRole !== "doctor") {
      return redirectTo(request, "/");
    }

    const isVerificationStatusPage =
      pathname === "/doctor/verification-status" ||
      pathname.startsWith("/doctor/verification-status/");

    const isApproved = userStatus === "approved";
    const isActive = userStatus !== "inactive";

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

      return NextResponse.next();
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/doctor/:path*", "/admin/:path*", "/login"],
};
