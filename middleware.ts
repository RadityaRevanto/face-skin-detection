import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/lib/constants";
import type { UserRole, VerificationStatus } from "@/lib/types";

const bypassAuth =
  process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

export async function middleware(request: NextRequest) {
  // Dev only: set NEXT_PUBLIC_BYPASS_AUTH=true in .env.local to open protected routes without login
  if (bypassAuth) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // -------------------------------------------------------
  // Redirect unauthenticated users away from protected routes
  // -------------------------------------------------------
  const protectedPrefixes = ["/user", "/doctor", "/admin"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  // -------------------------------------------------------
  // Redirect authenticated users away from auth pages
  // -------------------------------------------------------
  const authRoutes: readonly string[] = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.REGISTER_DOCTOR,
  ];
  if (user && authRoutes.includes(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as UserRole | undefined;
    if (role === "admin") {
      return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
    }
    if (role === "doctor") {
      return NextResponse.redirect(
        new URL(ROUTES.DOCTOR.VERIFICATION_STATUS, request.url)
      );
    }
    return NextResponse.redirect(new URL(ROUTES.USER.DASHBOARD, request.url));
  }

  // -------------------------------------------------------
  // Role-based access guards
  // -------------------------------------------------------
  if (user && isProtected) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as UserRole | undefined;

    // Guard: /admin/* → only admin
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }

    // Guard: /user/* → only user
    if (pathname.startsWith("/user") && role !== "user") {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }

    // Guard: /doctor/* → only doctor
    if (pathname.startsWith("/doctor") && role !== "doctor") {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }

    // Guard: /doctor/dashboard → only approved doctor
    if (pathname.startsWith("/doctor/dashboard")) {
      const { data: verification } = await supabase
        .from("doctor_verifications")
        .select("verification_status")
        .eq("doctor_id", user.id)
        .single();

      const status = verification?.verification_status as
        | VerificationStatus
        | undefined;

      if (status !== "approved") {
        return NextResponse.redirect(
          new URL(ROUTES.DOCTOR.VERIFICATION_STATUS, request.url)
        );
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
