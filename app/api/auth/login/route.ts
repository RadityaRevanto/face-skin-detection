import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type LoginBody = {
  email?: string;
  password?: string;
};

type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "user" | "doctor" | string | null;
  is_active: boolean | null;
};

type DoctorVerification = {
  doctor_id: string;
  verification_status: string | null;
};

function normalizeStatus(status: string | null | undefined) {
  return status?.toLowerCase().trim() ?? "pending";
}

function getDoctorRedirect(
  profile: UserProfile,
  verification: DoctorVerification | null,
) {
  const verificationStatus = normalizeStatus(verification?.verification_status);

  const isApproved = verificationStatus === "approved";
  const isActive = profile.is_active !== false;

  if (isApproved && isActive) {
    return "/doctor/dashboard";
  }

  return "/doctor/verification-status";
}

export async function POST(request: Request) {
  const supabase = await createClient();

  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Body harus berupa JSON valid.",
      },
      { status: 400 },
    );
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
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

  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError || !loginData.user) {
    return NextResponse.json(
      {
        success: false,
        message: loginError?.message || "Email atau password salah.",
        code: loginError?.code,
        status: loginError?.status,
      },
      { status: 401 },
    );
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active")
    .eq("id", loginData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to fetch login profile:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data profil.",
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      },
      { status: 500 },
    );
  }

  if (!profileData) {
    await supabase.auth.signOut();

    return NextResponse.json(
      {
        success: false,
        message:
          "Profil akun tidak ditemukan. Pastikan data profiles sudah dibuat.",
      },
      { status: 404 },
    );
  }

  const profile = profileData as UserProfile;

  let redirectTo = "/login";
  let verification: DoctorVerification | null = null;

  if (profile.role === "admin") {
    redirectTo = "/admin/dashboard";
  } else if (profile.role === "user") {
    if (profile.is_active === false) {
      await supabase.auth.signOut();

      return NextResponse.json(
        {
          success: false,
          message: "Akun user belum aktif.",
        },
        { status: 403 },
      );
    }

    redirectTo = "/user/home";
  } else if (profile.role === "doctor") {
    const { data: verificationData, error: verificationError } = await supabase
      .from("doctor_verifications")
      .select("doctor_id, verification_status")
      .eq("doctor_id", profile.id)
      .maybeSingle();

    if (verificationError) {
      console.error("Failed to fetch doctor verification during login:", {
        message: verificationError.message,
        details: verificationError.details,
        hint: verificationError.hint,
        code: verificationError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil status verifikasi dokter.",
          code: verificationError.code,
          details: verificationError.details,
          hint: verificationError.hint,
        },
        { status: 500 },
      );
    }

    verification = verificationData as DoctorVerification | null;
    redirectTo = getDoctorRedirect(profile, verification);
  } else {
    await supabase.auth.signOut();

    return NextResponse.json(
      {
        success: false,
        message: "Role akun tidak dikenali.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Login berhasil.",
    user: {
      id: loginData.user.id,
      email: loginData.user.email,
    },
    profile,
    verification,
    redirectTo,
  });
}
