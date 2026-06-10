import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

type RegisterBody = {
  fullName?: string;
  email?: string;
  password?: string;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function isDuplicateEmailError(message: string | undefined) {
  if (!message) return false;

  const lowerMessage = message.toLowerCase();

  return (
    lowerMessage.includes("already") ||
    lowerMessage.includes("registered") ||
    lowerMessage.includes("exists") ||
    lowerMessage.includes("duplicate") ||
    lowerMessage.includes("user already")
  );
}

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Body harus berupa JSON valid.",
      },
      { status: 400 },
    );
  }

  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  if (!fullName || !email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Nama, email, dan password wajib diisi.",
      },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        success: false,
        message: "Password minimal 8 karakter.",
      },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: createdUserData, error: createUserError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "user",
      },
    });

  if (createUserError || !createdUserData.user) {
    console.error("Failed to create user auth account:", {
      message: createUserError?.message,
    });

    const duplicateEmail = isDuplicateEmailError(createUserError?.message);

    return NextResponse.json(
      {
        success: false,
        message: duplicateEmail
          ? "Email sudah terdaftar."
          : createUserError?.message || "Gagal membuat akun.",
      },
      { status: duplicateEmail ? 409 : 500 },
    );
  }

  const userId = createdUserData.user.id;
  const now = new Date().toISOString();

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: fullName,
      email,
      role: "user",
      is_active: true,
      created_at: now,
    },
    {
      onConflict: "id",
    },
  );

  if (profileError) {
    console.error("Failed to create user profile:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });

    await supabase.auth.admin.deleteUser(userId);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat profil user.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Registrasi berhasil. Silakan login.",
    user: {
      id: userId,
      email,
    },
  });
}
