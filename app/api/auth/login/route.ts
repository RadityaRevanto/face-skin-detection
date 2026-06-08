import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Body harus berupa JSON valid.",
      },
      { status: 400 },
    );
  }

  const email = String(body.email || "").trim();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Email dan password wajib diisi.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
        status: error.status,
      },
      { status: 401 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      {
        success: false,
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      },
      { status: 500 },
    );
  }

  let redirectTo = "/login";

  if (profile?.role === "admin") {
    redirectTo = "/admin/dashboard";
  }

  if (profile?.role === "user") {
    redirectTo = "/user/home";
  }

  if (profile?.role === "doctor") {
    const { data: verification } = await supabase
      .from("doctor_verifications")
      .select("verification_status")
      .eq("doctor_id", data.user.id)
      .maybeSingle();

    redirectTo =
      verification?.verification_status === "approved"
        ? "/doctor/dashboard"
        : "/doctor/verification-status";
  }

  return NextResponse.json({
    success: true,
    message: "Login berhasil.",
    user: data.user,
    profile,
    redirectTo,
  });
}
