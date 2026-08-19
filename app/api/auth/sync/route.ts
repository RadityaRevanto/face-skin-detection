import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";
import { setUserRole } from "@/lib/auth/token";
import { getAuthToken } from "@/lib/auth/token";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.redirect(new URL("/login?clear_session=true", request.url));
  }

  try {
    const profileResponse = await fetchApi<any>("profile");
    const profile = profileResponse.data;

    if (!profile) {
      return NextResponse.redirect(new URL("/login?clear_session=true", request.url));
    }

    const role = profile.role || "user";
    const status =
      profile.verification_status ||
      (profile.is_active === false ? "inactive" : "active");

    // Override the cookies manually since setUserRole uses cookieStore which we also use
    const cookieStore = await cookies();
    cookieStore.set("user_role", role, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    cookieStore.set("user_status", status, { path: "/", maxAge: 30 * 24 * 60 * 60 });

    if (role === "doctor") {
      if (status === "approved") {
        return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/doctor/verification-status", request.url));
      }
    }

    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.redirect(new URL("/user/home", request.url));
  } catch (error) {
    console.error("Sync API Error:", error);
    return NextResponse.redirect(new URL("/login?clear_session=true", request.url));
  }
}
