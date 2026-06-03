import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        redirectTo: "/login",
      },
      { status: 401 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json(
      {
        success: false,
        message: "Profile tidak ditemukan.",
        redirectTo: "/login",
      },
      { status: 404 },
    );
  }

  if (!profile.is_active) {
    return NextResponse.json(
      {
        success: false,
        message: "Akun tidak aktif.",
        redirectTo: "/login?error=account_inactive",
      },
      { status: 403 },
    );
  }

  if (profile.role === "admin") {
    return NextResponse.json({
      success: true,
      role: "admin",
      redirectTo: "/admin/dashboard",
    });
  }

  if (profile.role === "user") {
    return NextResponse.json({
      success: true,
      role: "user",
      redirectTo: "/user/dashboard",
    });
  }

  if (profile.role === "doctor") {
    const { data: verification } = await supabase
      .from("doctor_verifications")
      .select("verification_status")
      .eq("doctor_id", user.id)
      .maybeSingle();

    if (verification?.verification_status === "approved") {
      return NextResponse.json({
        success: true,
        role: "doctor",
        verificationStatus: "approved",
        redirectTo: "/doctor/dashboard",
      });
    }

    return NextResponse.json({
      success: true,
      role: "doctor",
      verificationStatus: verification?.verification_status ?? "not_submitted",
      redirectTo: "/doctor/verification-status",
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Role tidak valid.",
      redirectTo: "/login",
    },
    { status: 400 },
  );
}
